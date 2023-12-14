export default function BottomContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5 w-full">{children}</div>
  )
}