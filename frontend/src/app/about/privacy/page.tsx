"use client";

import PageTitle from '@/components/PageTitle';

export default function Home() {
  return (
    <>
      <div>
        <PageTitle title='개인정보 처리에 관하여' desc='홀씨가 어떤 개인정보를 수집하고 어떻게 처리하는지 안내합니다.' />
        <div>
          <h3 className="font-title text-2xl font-bold mt-8">사용자가 직접 입력한 데이터</h3>
          <ul className="list-disc list-inside">
            <li>
              <h4 className="font-body text-lg font-semibold inline">업로드한 엔트리 작품 파일</h4>
              <div className='font-body text-base'>Cloudflare의 서버에 저장되며, 약 24시간 후 삭제됩니다.</div>
            </li>
            <li>
              <h4 className="font-body text-lg font-semibold inline">입력/선택한 작품 정보 및 옵션</h4>
              <div className='font-body text-base'>fly.io의 서버에 로그 형태로 기록이 남습니다. 이 기록은 비정기적으로 삭제됩니다.</div>
              <div className='font-body text-base'>서비스 개선, 버그 수정 및 연구를 위해 사용될 수 있습니다.</div>
            </li>
          </ul>

          <h3 className="font-title text-2xl font-bold mt-8">서비스 이용 과정에서 자동으로 생성되는 데이터</h3>
          <ul className="list-disc list-inside">
            <li>
              <h4 className="font-body text-lg font-semibold inline">생성된 실행 파일</h4>
              <div className='font-body text-base'>Cloudflare의 서버에 저장되며, 약 24시간 후 삭제됩니다.</div>
            </li>
            <li>
              <h4 className="font-body text-lg font-semibold inline">IP 주소, 쿠키, 방문 일시, 서비스 이용 기록 등</h4>
              <div className='font-body text-base'>서비스 제공, 개선 및 연구 등을 위해 수집됩니다.</div>
              <div className='font-body text-base'>fly.io, Vercel, Google, Kakao, Cloudflare와 공유될 수 있습니다.</div>
            </li>
          </ul>
        </div>
      </div>
      <div></div>
    </>
  )
}
