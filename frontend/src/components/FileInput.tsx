import { useState } from "react";

interface FileInputProps {
  file: File | null;
  onChange: (value: File) => void;
  accept?: string;
}

export default function FileInput({ file, onChange, accept }: FileInputProps) {
  const [dragging, setDragging] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files?.[0]) {
      onChange(e.target.files[0])
    }
  }

  function handleDragIn(e: React.DragEvent<HTMLLabelElement>) {
    e.preventDefault();
    e.stopPropagation();
  }
  function handleDragOut(e: React.DragEvent<HTMLLabelElement>) {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
  }
  function handleDragOver(e: React.DragEvent<HTMLLabelElement>) {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
  }
  function handleDrop(e: React.DragEvent<HTMLLabelElement>) {
    e.preventDefault();
    e.stopPropagation();

    setDragging(false);
    if (e.dataTransfer?.files?.length > 0) {
      onChange(e.dataTransfer.files[0]);
    }
  }


  return (
    <label
      className={`flex w-full p-2 rounded-md border border-emerald-500 font-body text-emerald-500 cursor-pointer
          outline-none text-base ${dragging ? "bg-emerald-500/10" : "bg-transparent"}`}
      onDragEnter={handleDragIn}
      onDragLeave={handleDragOut}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="w-full px-3 py-10 border border-emerald-500 rounded-sm border-dashed text-center">
        {
          file
            ? file.name
            : <>
              <div>파일을 여기로 드래그하세요.</div>
              <div className="text-xs">또는 여기를 클릭하여 파일을 선택할 수도 있습니다.</div>
            </>
        }
      </div>
      <input type="file" onChange={handleChange} className="hidden" accept={accept} />
    </label>
  )
}