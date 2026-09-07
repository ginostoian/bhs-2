import Image from "next/image";
import Link from "next/link";
import { BOOKING_URL } from "@/libs/booking";
export default function Hero({title,titleAccent,subtitle,heroCTA,heroImgUrl,heroImgAlt,ctaTallyFormLink,secondaryCTA,secondaryCtaLink,secondaryCtas=[]}){
const src=heroImgUrl?.startsWith("/") ? heroImgUrl : heroImgUrl ? `/assets/img/${heroImgUrl}` : null;
const actions=secondaryCtas.length ? secondaryCtas : secondaryCTA&&secondaryCtaLink ? [{label:secondaryCTA,href:secondaryCtaLink}] : [];
return <section className="bh-wrap bh-section"><div className={src ? "bh-grid-two" : ""}><div><p className="bh-eyebrow">Better Homes · London</p><h1 className="bh-title">{title} {titleAccent}</h1><p className="bh-lead">{subtitle}</p><div className="bh-actions"><Link className="bh-button" href={ctaTallyFormLink||BOOKING_URL}>{heroCTA||"Discuss your project"}</Link>{actions.map(a=><Link key={a.href} className="bh-text-link" href={a.href}>{a.label}</Link>)}</div></div>{src ? <Image src={src} alt={heroImgAlt||"A completed Better Homes renovation in London"} width={1000} height={800} priority sizes="(max-width:700px) 100vw, 50vw" style={{width:"100%",height:"100%",maxHeight:560,objectFit:"cover",borderRadius:0}}/> : null}</div></section>;
}
