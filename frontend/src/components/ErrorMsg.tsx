interface Props {
  error: string;
}
export default function ErrorMsg({ error }: Props) {
  return (
    <div>
      { error ? <div className="text-red-500">오류: {error}</div> : <></>}
    </div>
  )
}