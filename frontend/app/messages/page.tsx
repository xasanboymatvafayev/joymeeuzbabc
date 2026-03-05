"use client";
import BottomNav from"@/components/BottomNav";
export default function MessagesPage(){
  return(
    <div style={{minHeight:"100vh",background:"#fff",paddingBottom:72}}>
      <div style={{background:"#F5C518",margin:16,borderRadius:16,padding:"14px 16px",display:"flex",alignItems:"center",gap:14,cursor:"pointer"}}>
        <div style={{width:44,height:44,borderRadius:"50%",background:"#000",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>🎧</div>
        <div style={{flex:1}}><p style={{fontWeight:800,fontSize:15}}>Joymee.uz</p><p style={{fontSize:13,color:"rgba(0,0,0,.7)"}}>Biz yordam berishdan xursand bo'lamiz</p></div>
        <span style={{fontSize:20,color:"rgba(0,0,0,.5)"}}>›</span>
      </div>
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"60px 24px",textAlign:"center"}}>
        <div style={{fontSize:64,marginBottom:16}}>📪</div>
        <p style={{fontSize:16,color:"#555"}}>Hali hech qanday xabar yo'q...</p>
      </div>
      <BottomNav/>
    </div>
  );
}
