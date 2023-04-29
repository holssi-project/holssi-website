import Head from 'next/head'
import Nav from '@/components/Nav'
import Button from '@/components/Button'
import { useRouter } from 'next/router';
import { useState } from 'react';
import { create } from '@/utils/fetch';
import ErrorMsg from '@/components/ErrorMsg';

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  function handleStartBtnClick() {
    setIsLoading(true);
    create()
      .then(data => {
        router.push(`/project/${data.project_id}`);
      })
      .catch(error => setError(`${error}`))
      .finally(() => setIsLoading(false));
  }

  return (
    <>
      <Head>
        <title>홀씨</title>
        <meta name="description" content="본인의 엔트리 작품을 하나의 실행 파일로 만들어보세요." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className='container mx-auto px-10'>
        <Nav />
        <Button title='새로 만들기' onClick={handleStartBtnClick} disabled={isLoading} />
        <ErrorMsg error={error} />
        <div>
          <span className="text-red-400">*</span>현재 베타 테스트 중입니다.
          혹시 오류가 발생한다면 <a className="text-blue-600" href="https://github.com/jedeop/holssi-website/issues">이곳</a>에 이슈를 생성해주세요.
        </div>
        <br />
        <div>
          <span className="text-red-400">*</span>
          업로드한 엔트리 작품 파일 및 빌드된 실행 파일은 최대 48시간 이후 서버에서 삭제됩니다.
        </div>
        <div>
          <span className="text-red-400">*</span>
          서비스 제공, 개선 및 연구 등을 위해 다음과 같은 정보들이 자동으로 생성되어 수집될 수 있습니다. <br />
          - IP 주소, 쿠키, 방문 일시, 서비스 이용 기록(사용자가 입력한 작품 정보 포함), 불량 이용 기록
        </div>
      </main>
    </>
  )
}
