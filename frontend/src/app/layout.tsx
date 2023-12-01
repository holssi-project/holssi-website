import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import AppProvider from '@/components/AppProvider'
import Script from 'next/script'
import * as gtag from '../utils/gtag'

const SUIT = localFont({
  src: "../fonts/SUIT-Variable.woff2",
  variable: "--font-suit",
})
const SUITE = localFont({
  src: "../fonts/SUITE-Variable.woff2",
  variable: "--font-suite",
})

export const metadata: Metadata = {
  title: '홀씨',
  description: '엔트리 작품을 단일 실행 파일로.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className={`${SUIT.variable} ${SUITE.variable}`}>
        <main className="min-h-screen max-w-sm m-auto flex flex-col items-start justify-between p-6 gap-6">
          <AppProvider>
            {children}
          </AppProvider>
        </main>
        {/* Google Analytics https://github.com/vercel/next.js/tree/canary/examples/with-google-analytics */}
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${gtag.GA_TRACKING_ID}`}
        />
        <Script
          id='ga-script-gtag'
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', '${gtag.GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `,
          }}
        />
        <script type="text/javascript" src="//t1.daumcdn.net/kas/static/ba.min.js" async></script>
      </body>
    </html>
  )
}
