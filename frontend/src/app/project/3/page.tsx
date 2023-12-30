"use client";

import BottomContainer from "@/components/BottomContainer";
import Button from "@/components/Button";
import Error from "@/components/Error";
import ItemTitle from "@/components/ItemTitle";
import PageTitle from "@/components/PageTitle";
import Radio from "@/components/Radio";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { projectDataSavedStep2 } from "@/store/projectSlice";
import { BuildData, Target, runBuild, targetToArch, targetToPlatform } from "@/utils/fetch";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function Page() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const projectId = useAppSelector(state => state.project.project?.project_id);
  const buildData = useAppSelector(state => state.project.build_data);

  const [target, setTarget] = useState<Target>("win64");
  const [besEnable, setBesEnable] = useState<"true" | "false">("false");
  const [boostModeEnable, setBoostModeEnable] = useState<"true" | "false">("true");

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  function handleNextClick() {
    const projectData = {
      platform: targetToPlatform(target),
      arch: targetToArch(target),
      useBes: besEnable === "true",
      useBoostMode: boostModeEnable === "true",
    }
    dispatch(projectDataSavedStep2(projectData));

    if (!projectId || !buildData || !buildData.nameEn) {
      setError("잘못된 접근입니다. 처음부터 다시 시도해주세요.")
      return;
    }

    setIsLoading(true);
    runBuild(projectId, {
      ...buildData,
      ...projectData,
    } as BuildData)
      .then(() => {
        setError("");
        router.push(`./4`);
      })
      .catch(err => {
        setError(`${err}`)
        setIsLoading(false);
      })
    
  }

  return (
    <>
      <div className="flex flex-col gap-6">
        <PageTitle title="실행 파일 설정" desc="실행 파일과 관련된 옵션을 선택해주세요." />
        <div>
          <ItemTitle title="타겟" desc="어떤 운영체제를 위한 실행 파일을 만들지 선택해주세요." />
          <Radio value={target} onChange={setTarget} items={[
            { value: "win64", label: "Windows (x64)" },
            // { value: "mac_intel", label: "MacOS (Intel)" },
            // { value: "mac_arm", label: "MacOS (Apple Silicon)" },
          ]} />
        </div>
        <div>
          <ItemTitle title="BetterEntryScreen 적용" desc={"작품의 해상도를 높이는 도구입니다. 일부 작품과는 호환되지 않습니다."} />
          <Radio value={besEnable} onChange={setBesEnable} items={[
            { value: "true", label: "적용하기" },
            { value: "false", label: "적용하지 않기" },
          ]} />
        </div>
        <div>
          <ItemTitle title="부스트 모드 사용" />
          <Radio value={boostModeEnable} onChange={setBoostModeEnable} items={[
            { value: "true", label: "사용하기" },
            { value: "false", label: "사용하지 않기" },
          ]} />
        </div>
      </div>
      <BottomContainer>
        <Button text="실행 파일 만들기" onClick={handleNextClick} disabled={isLoading} />
        {error && <Error msg={error} detail />}
      </BottomContainer>
    </>
  )
}