import Head from 'next/head'
import Nav from '@/components/Nav'
import Step from '@/components/Step'
import { useState } from 'react'
import TextInput from '@/components/TextInput';
import FileInput from '@/components/FileInput';
import Button from '@/components/Button';

export default function Home() {
  const [step, setStep] = useState(1);
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

        <Step num={1} title="엔트리 파일 업로드" disabled={step !== 0} />
        {
          step !== 0
            ? null
            : (
              <div>
                <FileInput />
                <div className='flex gap-2'>
                  <Button title='다음' onClick={() => setStep(1)} />
                </div>
              </div>
            )
        }

        <Step num={2} title="작품 정보 입력" disabled={step !== 1} />
        {
          step !== 1
            ? null
            : (
              <div>
                <TextInput title='앱 이름' placeholder='비워 두면 자동으로 입력됩니다.' />
                <TextInput title='앱 영문 이름' placeholder='로마자, 숫자, 대시(-)만 입력할 수 있습니다.' required />
                <TextInput title='만든이' placeholder='로마자, 숫자, 대시(-)만 입력할 수 있습니다.' required />
                <TextInput title='버전' placeholder='0.0.1' />
                <TextInput title='작품 설명' placeholder='멋진 엔트리 작품' />
                <div className='text-sm'>
                  '<span className="text-red-400">*</span>' 표시가 있는 항목은 필수로 입력해야 합니다.
                </div>
                <div className='flex gap-2'>
                  <Button title='이전' outline onClick={() => setStep(0)} />
                  <Button title='다음' onClick={() => setStep(2)} />
                </div>
              </div>
            )
        }

        <Step num={3} title="작품 정보 확인 및 빌드" disabled={step !== 2} />
        {
          step !== 2
            ? null
            : (
              <div>
                <div className='flex gap-2'>
                  <Button title='이전' outline onClick={() => setStep(1)} />
                  <Button title='빌드하기' onClick={() => console.log("Build Process")} />
                </div>
              </div>
            )
        }

        <Step num={4} title="실행 파일 다운로드" disabled={step !== 3} />
        {
          step !== 3
            ? null
            : (
              <div>
                <div className='flex gap-2'>
                  <Button title='다운로드' onClick={() => {}} />
                </div>
              </div>
            )
        }
      </main>
    </>
  )
}
