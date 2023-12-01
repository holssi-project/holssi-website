import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '실행 파일 만드는 중 - 홀씨',
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
