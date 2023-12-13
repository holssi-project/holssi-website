"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

const ADFIT_ID = process.env.NEXT_PUBLIC_ADFIT_ID || ''

export default function AdfitAd() {
  const router = useRouter();

  useEffect(() => {
    const script = document.createElement('script');

    script.src = '//t1.daumcdn.net/kas/static/ba.min.js';

    script.async = true;

    document.body.appendChild(script);

    return () => {
        document.body.removeChild(script);
    };
}, [router]);

  return (
    <>
      <ins className="kakao_ad_area" style={{ display: "none" }}
        data-ad-unit={ADFIT_ID}
        data-ad-width="320"
        data-ad-height="100"></ins>
    </>
  )
}