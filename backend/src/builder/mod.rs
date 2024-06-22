use std::collections::HashMap;

use flyio::{FlyIO, RunMachineOption};
use machine::MachineController;
use tokio::sync::mpsc;

use crate::Result;

pub(crate) mod flyio;
mod machine;

pub(crate) struct Builder {
    flyio: FlyIO,
    queue: BuilderRx,
    rxs: HashMap<String, BuilderTx>,
}

impl Builder {
    pub(crate) fn new(flyio: FlyIO, queue: BuilderRx) -> Self {
        Builder {
            flyio,
            queue,
            rxs: HashMap::new(),
        }
    }

    pub(crate) async fn run(&mut self, pool_size: u64) -> Result<()> {
        let mut machines = self.flyio.list_machines().await?;
        let lack = if pool_size > machines.len() as u64 {
            pool_size - machines.len() as u64
        } else {
            0
        };
        for _ in 0..lack {
            let machine = self.flyio.create_machine().await?;
            machines.push(machine);
        }
        let (machine_tx, mut builder_rx) = mpsc::channel(pool_size as usize);
        for machine in machines {
            let (builder_tx, machine_rx) = mpsc::channel(1);
            self.rxs.insert(machine.id().to_string(), builder_tx);
            let machine_tx = machine_tx.clone();
            let flyio = self.flyio.clone();
            tokio::spawn(async move {
                let mut controller =
                    MachineController::new(machine.id().to_string(), flyio, machine_tx, machine_rx);
                controller.run().await;
            });
        }

        while let Some(machine_id) = builder_rx.recv().await {
            if let Some(sender) = self.rxs.get(&machine_id) {
                match self.queue.recv().await {
                    Some(opt) => {
                        if let Err(err) = sender.send(opt).await {
                            tracing::error!("error while sending mpsc: {:#?}", err);
                        }
                    }
                    None => break,
                }
            }
        }

        Ok(())
    }
}

type BuilderRx = mpsc::Receiver<RunMachineOption>;
pub(crate) type BuilderTx = mpsc::Sender<RunMachineOption>;
