interface PageTitleProps {
  title: string;
  desc: string;
} 

export default function PageTitle({ title, desc }: PageTitleProps) {
  return (
    <div className="flex flex-col gap-2 mt-8">
      <h1 className="font-title text-4xl font-bold text-black">{title}</h1>
      <div className="font-body text-base/5 font-normal text-slate-500 break-keep">{desc}</div>
    </div>
  )
}