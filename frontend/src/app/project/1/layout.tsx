import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '엔트리 작품 선택 - 홀씨',
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
