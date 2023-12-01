const ADFIT_ID = process.env.NEXT_PUBLIC_ADFIT_ID || ''

export default function AdfitAd() {
  return (
    <ins className="kakao_ad_area" style={{ display: "none" }}
      data-ad-unit={ADFIT_ID}
      data-ad-width="320"
      data-ad-height="100"></ins>
  )
}