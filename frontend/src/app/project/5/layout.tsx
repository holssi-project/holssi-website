import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '실행 파일 다운로드 - 홀씨',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
    </>
  )
}
