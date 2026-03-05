"use client";
import{useEffect,useState}from"react";
import{useParams,useRouter}from"next/navigation";
import dynamic from"next/dynamic";
import{ArrowLeft,Share2,Heart,MapPin}from"lucide-react";
import{api,fmt,getImg,type Listing}from"@/lib/api";
import Carousel from"@/components/Carousel";

const MapComponent=dynamic(()=>import("@/components/Map"),{ssr:false});

export default function ListingPage(){
  const{id}=useParams();
  const router=useRouter();
  const[l,setL]=useState<Listing|null>(null);
  const[saved,setSaved]=useState(false);
  const[cur]=useState<"ye"|"som">("ye");

  useEffect(()=>{
    api.get(`/api/listings/${id}`).then(({data})=>setL(data)).catch(()=>router.push("/"));
  },[id]);

  if(!l) return <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center"}}><div className="spin" style={{width:32,height:32,border:"3px solid #F2F2F7",borderTop:"3px solid #F5C518",borderRadius:"50%"}}/></div>;

  const days=l.published_at?Math.floor((Date.now()-new Date(l.published_at).getTime())/86400000):null;
  const DEAL_L={sale:"Sotuv",rent:"Ijara",kunlik:"Kunlik"}[l.deal_type]||l.deal_type;
  const CAT_L={apartment:"Kvartira",house:"Hovli",commercial:"Tijorat",land:"Yer",hotel:"Mehmonxona"}[l.category]||l.category;

  return(
    <div style={{minHeight:"100vh",background:"#fff",paddingBottom:90}}>
      <div style={{position:"fixed",top:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:480,zIndex:30,display:"flex",justifyContent:"space-between",padding:"12px 16px"}}>
        <button onClick={()=>router.back()} style={{width:38,height:38,borderRadius:"50%",background:"rgba(255,255,255,.9)",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><ArrowLeft size={18}/></button>
        <div style={{display:"flex",gap:8}}>
          <button style={{width:38,height:38,borderRadius:"50%",background:"rgba(255,255,255,.9)",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><Share2 size={16}/></button>
          <button onClick={()=>setSaved(!saved)} style={{width:38,height:38,borderRadius:"50%",background:"rgba(255,255,255,.9)",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <Heart size={16} fill={saved?"#FF3B30":"none"} color={saved?"#FF3B30":"#000"}/>
          </button>
          <button style={{width:38,height:38,borderRadius:"50%",background:"rgba(255,255,255,.9)",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>⋯</button>
        </div>
      </div>

      <Carousel images={l.images}/>

      <div style={{padding:"12px 16px 0",display:"flex",alignItems:"center",gap:10}}>
        <img src="/ph.png" style={{width:38,height:38,borderRadius:"50%",objectFit:"cover"}}/>
        <span style={{fontSize:15,fontWeight:700}}>{l.owner_username||l.owner_name||"Foydalanuvchi"}</span>
      </div>
      <div style={{padding:"10px 16px",display:"flex",alignItems:"center",gap:8}}>
        <span style={{background:"#F2F2F7",padding:"4px 10px",borderRadius:20,fontSize:12,fontWeight:600}}>{DEAL_L}</span>
        <span style={{background:"#F2F2F7",padding:"4px 10px",borderRadius:20,fontSize:12,fontWeight:600}}>{CAT_L}</span>
        {days!==null&&<span style={{marginLeft:"auto",fontSize:13,color:"#8E8E93"}}>{days===0?"Bugun":`${days} kun oldin`}</span>}
      </div>
      <div style={{padding:"0 16px 8px"}}>
        <h1 style={{fontSize:18,fontWeight:800,lineHeight:1.4}}>ID {String(l.id).padStart(4,"0")} 📍 {l.city}<br/>{l.title}</h1>
      </div>
      <div style={{padding:"0 16px 16px"}}>
        <p style={{fontSize:32,fontWeight:900}}>{fmt(l.price,cur)}</p>
      </div>
      {l.description&&<div style={{padding:"0 16px 16px"}}><p style={{fontSize:15,color:"#333",lineHeight:1.6,whiteSpace:"pre-line"}}>{l.description}</p></div>}
      <div style={{margin:"0 16px 16px",background:"#F8F8F8",borderRadius:14,overflow:"hidden"}}>
        {[l.land_sotix&&["Maydon, sotix",`${l.land_sotix}`],l.area_m2&&["Maydon, m²",`${l.area_m2}`],l.floor&&l.floors&&["Qavat",`${l.floor}/${l.floors}`],l.rooms&&["Xonalar",`${l.rooms} ta`],l.tamir&&["Ta'mirlash",l.tamir]].filter(Boolean).map((row,i)=>(
          <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"12px 16px",borderBottom:i<3?"1px solid #EBEBEB":"none"}}>
            <span style={{fontSize:14,color:"#8E8E93"}}>{(row as string[])[0]}</span>
            <span style={{fontSize:14,fontWeight:600}}>— {(row as string[])[1]}</span>
          </div>
        ))}
      </div>
      {l.lat&&l.lng&&(
        <div style={{padding:"0 16px 16px"}}>
          <h3 style={{fontSize:16,fontWeight:800,marginBottom:10}}>Joylashuv</h3>
          <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:10}}>
            <span style={{fontSize:18}}>📍</span>
            <span style={{fontSize:15,color:"#555"}}>{l.city}, {l.region}</span>
          </div>
          <div style={{height:180,borderRadius:14,overflow:"hidden"}}>
            <MapComponent listings={[l]} center={[l.lat,l.lng]} zoom={15}/>
          </div>
        </div>
      )}
      <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:480,background:"#fff",borderTop:"1px solid #E5E5EA",padding:"12px 16px",display:"flex",gap:10}}>
        <button style={{flex:1,padding:"14px",background:"#F2F2F7",borderRadius:50,border:"none",fontWeight:700,fontSize:14,cursor:"pointer"}}>Sotuvchiga yozing</button>
        <button style={{flex:1,padding:"14px",background:"#F2F2F7",borderRadius:50,border:"none",fontWeight:700,fontSize:14,cursor:"pointer"}}>Izoh qoldiring...</button>
        <a href={`tel:${l.owner_phone||"+998901234567"}`} className="yellow-btn" style={{flex:2,padding:"14px",fontSize:15,textDecoration:"none",borderRadius:50}}>📞 Qo'ng'iroq</a>
      </div>
    </div>
  );
}
