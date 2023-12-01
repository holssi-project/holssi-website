interface ItemTitleProps {
  title: string;
  desc?: string;
  important?: boolean;
}

export default function ItemTitle({title, desc, important}: ItemTitleProps) {
  return (
    <div className="mb-1">
      <h3 className="font-title text-lg/5 text-black font-bold">
        {title} {important ? <span className="text-red-400">*</span> : ''}
      </h3>
      <div className="font-body text-sm text-slate-500">
        {desc}
      </div>
    </div>
  )
}