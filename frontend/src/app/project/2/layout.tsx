import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '작품 정보 입력 - 홀씨',
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
