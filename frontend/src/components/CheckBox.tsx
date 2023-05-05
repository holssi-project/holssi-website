import { ChangeEvent } from "react";

interface Props {
  title: string;
  hint?: string;
  value: boolean;
  onChange: (value: boolean) => void;
  labelKey: string;
}
function CheckBox({ title, hint, value, onChange, labelKey }: Props) {
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    onChange(e.target.checked);
  }
  const key = `checkbox-${labelKey}`;
  return (
    <div className="border rounded-md border-slate-900/20 flex my-3 overflow-hidden flex-row items-center">
      <input type="checkbox"
        className="outline-none py-1 mx-3"
        checked={value}
        onChange={handleChange}
        id={key}
      />
      <label htmlFor={key} className="font-medium text-lg py-1 pr-3">
        {title}
        <span className="font-normal text-base pl-3 flex-1 text-slate-900/50">{hint}</span>
      </label>
    </div>
  )
}

export default CheckBox