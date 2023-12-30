"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

const ADFIT = [
  {
    id: process.env.NEXT_PUBLIC_ADFIT_ID_1 || '',
    width: 320,
    height: 100,
  },
  {
    id: process.env.NEXT_PUBLIC_ADFIT_ID_2 || '',
    width: 320,
    height: 50,
  },
  {
    id: process.env.NEXT_PUBLIC_ADFIT_ID_3 || '',
    width: 300,
    height: 250,
  }
];

interface AdfitAdProps {
  type: 0 | 1 | 2;
}

export default function AdfitAd({ type }: AdfitAdProps) {
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
        data-ad-unit={ADFIT[type].id}
        data-ad-width={ADFIT[type].width}
        data-ad-height={ADFIT[type].height}></ins>
    </>
  )
}