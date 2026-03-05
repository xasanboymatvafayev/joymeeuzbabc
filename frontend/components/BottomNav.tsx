"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Plus, MessageSquare, User } from "lucide-react";
const TABS = [
  {href:"/",icon:Home,label:"Asosiy"},
  {href:"/search",icon:Search,label:"Qidirish"},
  {href:"/add",icon:Plus,label:"Qo'shish",special:true},
  {href:"/messages",icon:MessageSquare,label:"Xabarlar"},
  {href:"/profile",icon:User,label:"Profil"},
];
export default function BottomNav() {
  const path = usePathname();
  return (
    <nav className="bottom-nav h-[60px]">
      {TABS.map(({href,icon:Icon,label,special})=>{
        const active = path===href;
        if(special) return (
          <Link key={href} href={href} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:3,textDecoration:"none"}}>
            <div style={{width:44,height:44,borderRadius:"50%",background:"#000",display:"flex",alignItems:"center",justifyContent:"center",marginTop:-18,boxShadow:"0 4px 16px rgba(0,0,0,.25)"}}>
              <Icon size={22} color="#fff" strokeWidth={2.5}/>
            </div>
            <span style={{fontSize:10,fontWeight:600,color:"#8E8E93",marginTop:2}}>{label}</span>
          </Link>
        );
        return (
          <Link key={href} href={href} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:3,padding:"10px 12px",textDecoration:"none"}}>
            <Icon size={22} color={active?"#000":"#8E8E93"} strokeWidth={active?2.5:2}/>
            <span style={{fontSize:10,fontWeight:active?700:500,color:active?"#000":"#8E8E93"}}>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
