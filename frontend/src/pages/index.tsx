import Head from 'next/head'
import Nav from '@/components/Nav'
import { useMemo, useState } from 'react'
import TextInput from '@/components/TextInput';
import FileInput from '@/components/FileInput';
import Button from '@/components/Button';
import Section from '@/components/Section';
import { Loader } from 'react-feather';
import { createAndUpload, runBuild, UploadType } from '@/utils/fetch';

export default function Home() {
  const [step, setStep] = useState(0);
  const [waiting, setWaiting] = useState(false);

  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [author, setAuthor] = useState("");
  const [version, setVersion] = useState("");
  const [desc, setDesc] = useState("");
  const [uid, setUid] = useState("");

  const asciiAlphanumericRule = useMemo(() => new RegExp("^[A-Za-z\-0-9]*$"), []);
  const versionRule = useMemo(() => new RegExp("^[0-9\.]*$"), []);

  function handleUploadClick() {
    if (file == null) return;

    setWaiting(true);
    createAndUpload({
      file,
      type: UploadType.ENTRY,
    })
      .then(data => {
        console.log(data);
        setUid(data.uid);
      })
      .then(() => setStep(1))
      .catch(err => console.error(err))
      .finally(() => setWaiting(false))
  }
  function handleBuildClick() {
    setWaiting(true);
    runBuild({ uid, name, nameEn, author, version, desc })
      .then(console.log)
      .then(() => setStep(2))
      .catch(console.error)
      .finally(() => setWaiting(false))
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

        <Section step={0} current={step} title="엔트리 파일 업로드">
          <div>
            <FileInput onChange={f => setFile(f || null)} />
            <div className='flex gap-2'>
              <Button title='업로드하기' onClick={handleUploadClick} disabled={!file || waiting} />
            </div>
          </div>
        </Section>

        <Section step={1} current={step} title="작품 정보 입력">
          <div>
            <TextInput title='앱 이름'
              placeholder='비워 두면 자동으로 입력됩니다.'
              value={name}
              onChange={setName}
            />
            <TextInput title='앱 영문 이름'
              placeholder='로마자, 숫자, 대시(-)만 입력할 수 있습니다.'
              value={nameEn}
              onChange={setNameEn}
              required
              validate={v => asciiAlphanumericRule.test(v)}
            />
            <TextInput title='만든이'
              placeholder='로마자, 숫자, 대시(-)만 입력할 수 있습니다.'
              value={author}
              onChange={setAuthor}
              required
              validate={v => asciiAlphanumericRule.test(v)}
            />
            <TextInput title='버전'
              placeholder='0.0.1'
              value={version}
              onChange={setVersion}
              validate={v => versionRule.test(v)}
            />
            <TextInput title='작품 설명'
              placeholder='멋진 엔트리 작품'
              value={desc}
              onChange={setDesc}
            />
            <div className='text-sm'>
              '<span className="text-red-400">*</span>' 표시가 있는 항목은 필수로 입력해야 합니다.
            </div>
            <div className='flex gap-2'>
              <Button title='이전' outline onClick={() => setStep(0)} />
              <Button title='빌드하기' onClick={handleBuildClick} disabled={!nameEn || !author || waiting} />
            </div>
          </div>
        </Section>

        <Section step={2} current={step} title="기다리기">
          <div>
            <div>빌드가 완료될 때까지 잠시만 기다려주세요.</div>
          </div>
        </Section>

        <Section step={3} current={step} title="실행 파일 다운로드">
          <div>
            <div className='flex gap-2'>
              <Button title='다운로드' onClick={() => { }} />
            </div>
          </div>
        </Section>
      </main>
    </>
  )
}
