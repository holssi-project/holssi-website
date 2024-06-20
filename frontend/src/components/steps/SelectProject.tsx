"use client";

import BottomContainer from "@/components/BottomContainer";
import Button from "@/components/Button";
import Error from "@/components/Error";
import FileInput from "@/components/FileInput";
import ItemTitle from "@/components/ItemTitle";
import PageTitle from "@/components/PageTitle";
import SegmentedControl from "@/components/SegmentedControl";
import TextInput from "@/components/TextInput";
import { upload } from "@/utils/fetch";
import { useState } from "react";

interface SelectProjectProps {
  projectId: string;
  next: () => void;
}

export default function SelectProject({ projectId, next }: SelectProjectProps) {
  const [inputType, setInputType] = useState("file");

  const [url, setUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  function handleInputTypeChange(id: string) {
    setInputType(id);
  }

  function handleNextClick() {
    if (inputType === "file") {
      setIsLoading(true);
      upload(projectId, file!)
        .then(() => {
          setError("");
          next();
        })
        .catch(err => {
          setError(`${err}`)
          setIsLoading(false);
        })
    }

  }

  return (
    <>
      <div className="flex flex-col gap-6">
        <PageTitle title="엔트리 작품 선택" desc="단일 실행 파일로 바꾸고 싶은 엔트리 작품을 입력하세요." />
        {/* <div>
          <ItemTitle title="방식" />
          <SegmentedControl
            items={[{ id: "url", title: "작품 링크" }, { id: "file", title: "오프라인 파일" }]}
            selectedId={inputType}
            onChange={handleInputTypeChange}
          />
        </div> */}
        {
          inputType === "url" ?
            <div>
              <ItemTitle title="작품 링크" />
              <TextInput value={url} onChange={setUrl} placeholder="https://playentry.org/project/..." />
            </div> :
            <div>
              <ItemTitle title="작품 업로드" desc="*.ent 형식의 파일을 업로드 할 수 있습니다." />
              <FileInput file={file} onChange={setFile} accept=".ent" />
            </div>
        }
      </div>
      <BottomContainer>
        <Button text="다음" onClick={handleNextClick} disabled={(inputType === "url" && !url) || (inputType === "file" && !file) || isLoading} />
        {error && <Error msg={error} detail />}
      </BottomContainer>
    </>
  )
}