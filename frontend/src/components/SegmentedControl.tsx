interface Item {
  id: string;
  title: string;
}

interface ItemProps {
  item: Item;
  selectedId: string;
  onChange: (id: string) => void;
}

function Item({ item, selectedId, onChange }: ItemProps) {
  const selectedStyle = "bg-white/90 font-bold text-emerald-500";
  const unselectedStyle = "bg-transparent font-normal text-white";

  return (
    <div
      className={`flex-1 text-center p-1 rounded-md font-title cursor-pointer text-base ${item.id === selectedId ? selectedStyle : unselectedStyle}`}
      onClick={() => onChange(item.id)}
      >
      {item.title}
    </div>
  )
}

interface SegmentedControlProps {
  items: Item[];
  selectedId: string;
  onChange: (id: string) => void;
}

export default function SegmentedControl({ items, selectedId, onChange }: SegmentedControlProps) {
  return (
    <div className="flex w-full p-0.5 bg-emerald-500 rounded-lg gap-0.5">
      {items.map(item => <Item key={item.id} item={item} selectedId={selectedId} onChange={onChange} />)}
    </div>
  )
}