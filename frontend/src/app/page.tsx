"use client";

import AppTitle from '@/components/AppTitle'
import BottomContainer from '@/components/BottomContainer';
import Button from '@/components/Button'
import Error from '@/components/Error';
import { useAppDispatch } from '@/store/hooks';
import { projectCreated } from '@/store/projectSlice';
import { create } from '@/utils/fetch';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Home() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleStartBtnClick() {
    setIsLoading(true);
    create()
      .then(project => {
        console.log(project);
        dispatch(projectCreated(project));
        router.push(`/project/1`)
      })
      .catch(e => {
        setError(e.message);
        setIsLoading(false);
      });
  }

  return (
    <>
      <div></div>
      <AppTitle />
      <BottomContainer>
        <Button text="시작하기" onClick={handleStartBtnClick} disabled={isLoading} />
        {
          error && <Error msg={error} detail />
        }
        <div className="text-slate-500 text-sm font-body">
          홀씨는 이용 과정에서 사용자의 개인정보를 수집합니다. <Link href="/about/privacy" className='underline'>여기를 눌러 자세히 알아보세요.</Link>
        </div>
        <div className="text-slate-500 text-sm font-body">
          홀씨는 엔트리 또는 네이버 커넥트재단에서 운영하는 서비스가 아닙니다.
        </div>
        <div className="text-slate-500 text-sm font-body">
          홀씨 및 홀씨 웹사이트의 소스코드는 GitHub에 공개되어 있습니다. {"> "}
          <Link href="https://github.com/jedeop/holssi" className='underline'>홀씨 Github</Link>,{" "}
          <Link href="https://github.com/jedeop/holssi-website" className='underline'>홀씨 웹사이트 GitHub</Link>
        </div>
      </BottomContainer>
    </>
  )
}
