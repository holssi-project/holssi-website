import Image from "next/image";

import logo from "@/app/icon.png"

export default function AppTitle() {
  return (
    <div className="flex flex-col gap-5">
      <Image src={logo}
        alt="홀씨 로고. 무지개빛 노을 배경에 흰 털로 변한 민들레 한 송이가 피어 있다."
        width={150} height={150}
      />
      <header>
        <h1 className="font-title text-4xl font-bold text-black">홀씨</h1>
        <h2 className="font-body text-2xl font-normal text-slate-500">엔트리 작품을 단일 실행 파일로.</h2>
      </header>
    </div>
  )
}