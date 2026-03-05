"use client";
import{useEffect,useState}from"react";
import{useRouter}from"next/navigation";
import{Share2,Edit3,Menu,Building2,Handshake,Heart,LogOut}from"lucide-react";
import{api,getUser,clearAuth,type User}from"@/lib/api";
import BottomNav from"@/components/BottomNav";

export default function ProfilePage(){
  const router=useRouter();
  const[user,setUser]=useState<User|null>(null);
  const[myListings,setMyListings]=useState<any[]>([]);
  const[tab,setTab]=useState("listings");

  useEffect(()=>{
    const u=getUser();
    if(!u){router.push("/login");return;}
    setUser(u);
    api.get("/api/listings/my/listings").then(({data})=>setMyListings(data)).catch(()=>{});
  },[]);

  if(!user) return null;

  return(
    <div style={{minHeight:"100vh",background:"#F2F2F7",paddingBottom:72}}>
      <div style={{background:"#F2F2F7",padding:"16px 16px 0",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <span style={{fontSize:17,fontWeight:700}}>{user.username||"profil"}</span>
        <div style={{display:"flex",gap:10}}>
          <button style={{background:"none",border:"none",cursor:"pointer"}}><Share2 size={20}/></button>
          <button style={{background:"none",border:"none",cursor:"pointer"}}><Edit3 size={20}/></button>
          <button style={{background:"none",border:"none",cursor:"pointer"}}><Menu size={20}/></button>
        </div>
      </div>
      <div style={{padding:"16px",display:"flex",alignItems:"center",gap:16}}>
        <div style={{width:72,height:72,borderRadius:"50%",background:"#ddd",overflow:"hidden",flexShrink:0}}>
          <img src={`https://i.pravatar.cc/72?u=${user.id}`} style={{width:"100%",height:"100%"}} alt=""/>
        </div>
        <div style={{display:"flex",gap:24}}>
          {[["E'lonlar",user.elonlar_count||0],["Ko'rishlar",user.korishlar_count||0],["Qo'ng'iroqlar",user.qongiroqlar_count||0]].map(([l,v])=>(
            <div key={l as string} style={{textAlign:"center"}}>
              <div style={{fontSize:20,fontWeight:800}}>{v}</div>
              <div style={{fontSize:12,color:"#8E8E93"}}>{l}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{padding:"0 16px 12px"}}>
        <p style={{fontSize:17,fontWeight:800}}>{user.name}</p>
        <p style={{fontSize:14,color:"#8E8E93"}}>{user.phone}</p>
      </div>
      <div style={{margin:"0 16px 12px"}}>
        <div className="card" style={{padding:"14px 16px",borderRadius:14}}>
          <p style={{textAlign:"center",color:"#555",marginBottom:12,fontSize:14}}>Balans: {(user.balance||0).toLocaleString()} so'm</p>
          <div style={{display:"flex",gap:10}}>
            <button className="black-btn" style={{flex:1,padding:"12px",fontSize:14}}>To'ldirish</button>
            <button className="yellow-btn" style={{flex:1,padding:"12px",fontSize:14,borderRadius:14}}>Paket</button>
          </div>
        </div>
      </div>
      <div style={{display:"flex",borderBottom:"1px solid #E5E5EA",background:"#fff",margin:"0 0 2px"}}>
        {[{k:"listings",i:Building2},{k:"deals",i:Handshake},{k:"saved",i:Heart}].map(({k,i:Icon})=>(
          <button key={k} onClick={()=>setTab(k)} style={{flex:1,padding:"14px 0",background:"none",border:"none",cursor:"pointer",borderBottom:tab===k?"2px solid #000":"2px solid transparent",display:"flex",justifyContent:"center"}}>
            <Icon size={20} color={tab===k?"#000":"#8E8E93"}/>
          </button>
        ))}
      </div>
      {myListings.length===0?(
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"40px 24px",textAlign:"center"}}>
          <div style={{width:80,height:80,borderRadius:"50%",background:"#000",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:16}}>
            <Building2 size={36} color="#F5C518"/>
          </div>
          <p style={{fontSize:17,fontWeight:700}}>Sizda hech qanday e'lon yo'q</p>
        </div>
      ):(
        <div style={{padding:16,display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          {myListings.map((l:any)=>(
            <div key={l.id} className="card" style={{overflow:"hidden",borderRadius:12}}>
              <img src={l.images[0]?.file_path||"/ph.png"} style={{width:"100%",height:120,objectFit:"cover"}} alt=""/>
              <div style={{padding:"8px 10px"}}>
                <p style={{fontWeight:700,fontSize:13,marginBottom:2}}>{l.price.toLocaleString()} y.e</p>
                <p style={{fontSize:12,color:"#8E8E93",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{l.title}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      <div style={{padding:"0 16px 16px"}}>
        <button onClick={()=>{clearAuth();router.push("/login");}} style={{width:"100%",padding:"14px",background:"none",border:"1px solid #FF3B30",borderRadius:14,color:"#FF3B30",fontWeight:700,fontSize:15,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
          <LogOut size={16}/> Chiqish
        </button>
      </div>
      <BottomNav/>
    </div>
  );
}
