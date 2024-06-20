import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '사용하기 - 홀씨',
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
