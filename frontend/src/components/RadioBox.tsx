import { ChangeEvent } from "react";

interface Props<T> {
  title: string;
  value: string;
  onChange: (value: keyof T) => void;
  options: { label: string, value: keyof T }[];
}
function RadioBox<T>({ title, value, onChange, options }: Props<T>) {
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    onChange(e.target.value as keyof T);
  }
  return (
    <div className="border rounded-md border-slate-900/20 flex my-3 overflow-hidden flex-col sm:flex-row">
      <div className="font-medium text-lg py-1 px-3 w-32">{title}</div>
      <div className="outline-none py-1 px-3 flex-1 border-t sm:border-l sm:border-t-0 border-slate-900/20 rounded-none flex flex-col sm:flex-row sm:items-center">
        {options.map(opt => {
          const key = `radiobox-${String(opt.value)}`;
          return (
            <div key={key}>
              <input type="radio"
                checked={value == opt.value}
                onChange={handleChange}
                id={key}
                value={String(opt.value)}
              />
              <label htmlFor={key} className="font-normal text-base py-1 px-3">{opt.label}</label>
            </div>
          )
        }
        )}
      </div>
    </div>
  )
}

export default RadioBox
