use std::time::Duration;

use tokio::{sync::mpsc, time::sleep};

use crate::builder::flyio::{FlyIO, MachineStatus};

use super::flyio::RunMachineOption;

pub(crate) struct MachineController {
    machine_id: String,
    flyio: FlyIO,
    tx: MachineTx,
    rx: MachineRx,
}

impl MachineController {
    pub(crate) fn new(machine_id: String, flyio: FlyIO, tx: MachineTx, rx: MachineRx) -> Self {
        MachineController {
            machine_id,
            flyio,
            tx,
            rx,
        }
    }
    pub(crate) async fn run(&mut self) {
        tracing::info!(
            "machine controller started (machine_id = {})",
            self.machine_id
        );
        loop {
            tracing::info!("check machine status (machine_id = {})", self.machine_id);
            match self.flyio.get_machine(&self.machine_id).await {
                Ok(machine) => {
                    if let MachineStatus::Created | MachineStatus::Stopped = machine.state() {
                        if let Err(err) = self.tx.send(self.machine_id.clone()).await {
                            tracing::error!("error while sending mpsc: {:#?}", err);
                            break;
                        }
                        match self.rx.recv().await {
                            Some(opt) => {
                                if let Err(err) =
                                    self.flyio.run_machine(&self.machine_id, &opt).await
                                {
                                    tracing::error!("{:#?}", err);
                                }
                            }
                            None => break,
                        }
                    }
                }
                Err(err) => tracing::error!("{:#?}", err),
            }
            sleep(Duration::from_secs(60)).await;
        }
        tracing::info!(
            "machine controller stopped (machine_id = {})",
            self.machine_id
        );
    }
}

type MachineTx = mpsc::Sender<String>;
type MachineRx = mpsc::Receiver<RunMachineOption>;
