import Image from "next/image"
import logo from "@/../public/logo.png";
import { GitHub } from "react-feather";

function Nav() {
  return (
    <nav className="py-6 border-b border-slate-900/10 flex items-center gap-3 justify-between">
      <div>
        <div className="flex items-center gap-2">
          <Image src={logo} alt="홀씨 로고" className="h-8 w-8" />
          <div className="font-semibold text-2xl flex-shrink-0">홀씨</div>
        </div>
        <div className="text-slate-400 text-xl mt-1">엔트리 작품을 하나의 실행 파일로 만들어보세요</div>
      </div>
      <div>
        <a href="https://github.com/jedeop/holssi">
          <GitHub className="text-slate-400" />
        </a>
      </div>
    </nav>
  )
}

export default Nav