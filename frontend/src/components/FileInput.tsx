import { ChangeEvent } from "react";

interface Props {
  onChange: (file: File | undefined) => void;
}

function FileInput({ onChange }: Props) {
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    onChange(e.target.files?.[0]);
  }
  return (
    <input type="file"
      accept=".ent"
      className="file:font-medium file:text-lg file:py-1 file:px-3 my-3 file:rounded-md file:border file:border-emerald-500 file:text-emerald-500 file:hover:bg-emerald-500/20 file:bg-white file:border-solid
      text-sm text-slate-400"
      onChange={handleChange}
    />
  )
}

export default FileInput