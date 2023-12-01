"use client";

import BottomContainer from "@/components/BottomContainer";
import Button from "@/components/Button";
import Error from "@/components/Error";
import ItemTitle from "@/components/ItemTitle";
import PageTitle from "@/components/PageTitle";
import TextInput from "@/components/TextInput";
import { useAppDispatch } from "@/store/hooks";
import { projectDataSavedStep1 } from "@/store/projectSlice";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";

export default function Page() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [projectName, setProjectName] = useState("");
  const [projectNameEn, setProjectNameEn] = useState("");
  const [author, setAuthor] = useState("");
  const [version, setVersion] = useState("");
  const [description, setDescription] = useState("");

  const [error, setError] = useState<string | null>(null);

  const asciiAlphanumericRule = useMemo(() => new RegExp("^[A-Za-z\-0-9]*$"), []);
  // version regex from https://semver.org/#is-there-a-suggested-regular-expression-regex-to-check-a-semver-string
  const versionRule = useMemo(() => new RegExp("^(0|[1-9]\\d*)\\.(0|[1-9]\\d*)\\.(0|[1-9]\\d*)(?:-((?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\\.(?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\\+([0-9a-zA-Z-]+(?:\\.[0-9a-zA-Z-]+)*))?$"), []);


  function handleNextClick() {
    if (version && !versionRule.test(version)) return setError("유효하지 않은 버전입니다. 버전은 SemVer를 만족시켜야 합니다. 참고: https://semver.org/")

    dispatch(projectDataSavedStep1({
      name: projectName,
      nameEn: projectNameEn,
      author,
      version,
      desc: description,
    }))
    router.push(`./3`);
  }

  return (
    <>
      <div className="flex flex-col gap-6">
        <PageTitle title="작품 정보 입력" desc="입력하신 내용은 실행 파일의 메타데이터로 설정됩니다." />
        <div>
          <ItemTitle title="작품 이름" desc="비워 두시면 작품 이름으로 설정됩니다." />
          <TextInput value={projectName} onChange={setProjectName} placeholder="멋진 작품" />
        </div>
        <div>
          <ItemTitle title="작품 영문 이름" desc="로마자, 숫자, 대시(-)만 입력할 수 있습니다." important />
          <TextInput value={projectNameEn} onChange={setProjectNameEn} placeholder="great-project" validate={v => asciiAlphanumericRule.test(v)} />
        </div>
        <div>
          <ItemTitle title="만든이" desc="로마자, 숫자, 대시(-)만 입력할 수 있습니다." important />
          <TextInput value={author} onChange={setAuthor} placeholder="entry-user" validate={v => asciiAlphanumericRule.test(v)} />
        </div>
        <div>
          <ItemTitle title="버전" />
          <TextInput value={version} onChange={setVersion} placeholder="0.1.0" />
        </div>
        <div>
          <ItemTitle title="작품 설명" />
          <TextInput value={description} onChange={setDescription} placeholder="엔둥이의 멋진 작품입니다." />
        </div>
      </div>
      <BottomContainer>
        <Button text="다음" onClick={handleNextClick} disabled={!projectNameEn || !author} />
        {error && <Error msg={error} />}
      </BottomContainer>
    </>
  )
}