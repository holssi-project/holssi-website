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
      </main>
    </>
  )
}
