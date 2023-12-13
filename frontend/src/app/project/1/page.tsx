"use client";

import BottomContainer from "@/components/BottomContainer";
import Button from "@/components/Button";
import Error from "@/components/Error";
import FileInput from "@/components/FileInput";
import ItemTitle from "@/components/ItemTitle";
import PageTitle from "@/components/PageTitle";
import SegmentedControl from "@/components/SegmentedControl";
import TextInput from "@/components/TextInput";
import { useAppSelector } from "@/store/hooks";
import { upload } from "@/utils/fetch";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Page() {
  const router = useRouter();
  const projectId = useAppSelector(state => state.project.project?.project_id);

  const [inputType, setInputType] = useState("file");

  const [url, setUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  function handleInputTypeChange(id: string) {
    setInputType(id);
  }

  function handleNextClick() {
    if (!projectId) {
      setError("잘못된 접근입니다. 처음부터 다시 시도해주세요.")
      return;
    }

    if (inputType === "file") {
      setIsLoading(true);
      upload(projectId, file!)
        .then(() => {
          setError("");
          router.push(`./2`);
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