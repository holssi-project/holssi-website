import Step from "./Step";

interface Props {
  step: number;
  title: string;
  current: number;
  children: React.ReactNode;
}

function Section({ step, title, current, children }: Props) {
  return (
    <div>
      <Step num={step + 1} title={title} disabled={step !== current} />
      <div className={step !== current ? 'hidden' : ''}>{children}</div>
    </div>
  )
}

export default Section