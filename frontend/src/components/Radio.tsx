interface ItemProps<T extends string> {
  value: T;
  label: string;
  onChange: (value: T) => void;
  selected: T;
}

function Item<T extends string>({ value, label, onChange, selected }: ItemProps<T>) {
  function handleChange() {
    onChange(value);
  }

  const isSelected = selected === value;

  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="15" viewBox="0 0 14 15" fill="none">
        <circle cx="7" cy="7.5" r="6.5" fill={isSelected ? "#10B981" : "white"} stroke="#10B981" />
      </svg>
      <div className="font-body text-emerald-500 text-base">{label}</div>
      <input type="radio" value={value} onChange={handleChange} checked={isSelected} className="hidden" />
    </label>
  )
}

interface RadioProps<T> {
  value: T;
  onChange: (value: T) => void;
  items: { value: T, label: string }[];
}

export default function Radio<T extends string>({ value, onChange, items }: RadioProps<T>) {

  return (
    <div>
      {items.map(item => (
        <Item key={item.value} value={item.value} label={item.label} onChange={onChange} selected={value} />
      ))}
    </div>
  )
}