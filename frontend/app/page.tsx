"use client";
import{useEffect,useState,useCallback}from"react";
import{useRouter}from"next/navigation";
import dynamic from"next/dynamic";
import{Search,SlidersHorizontal,Bell,ArrowUpDown,MapPin}from"lucide-react";
import{api,getUser,fmt,REGIONS,type Listing}from"@/lib/api";
import ListingCard from"@/components/ListingCard";
import BottomNav from"@/components/BottomNav";
import Link from"next/link";

const MapComponent=dynamic(()=>import("@/components/Map"),{ssr:false});

const TOP_PROFILES=[
  {name:"shahzoda_shahzo",elonlar:2535,avatar:"https://i.pravatar.cc/48?img=47"},
  {name:"nodira_rieltor",elonlar:1759,avatar:"https://i.pravatar.cc/48?img=45"},
  {name:"nargiza_rieltor",elonlar:1549,avatar:"https://i.pravatar.cc/48?img=44"},
  {name:"Abu_Usmon",elonlar:1283,avatar:"https://i.pravatar.cc/48?img=32"},
];

export default function HomePage(){
  const router=useRouter();
  const[user,setUser]=useState<any>(null);
  const[view,setView]=useState<"gallery"|"map">("gallery");
  const[deal,setDeal]=useState("sale");
  const[cur,setCur]=useState<"ye"|"som">("ye");
  const[search,setSearch]=useState("");
  const[showFilter,setShowFilter]=useState(false);
  const[filterCat,setFilterCat]=useState("");
  const[filterRegion,setFilterRegion]=useState("");
  const[listings,setListings]=useState<Listing[]>([]);
  const[loading,setLoading]=useState(true);
  const[userPos,setUserPos]=useState<[number,number]|null>(null);

  useEffect(()=>{
    const u=getUser();
    if(!u){router.push("/login");return;}
    setUser(u);
    navigator.geolocation?.getCurrentPosition(p=>setUserPos([p.coords.latitude,p.coords.longitude]));
    fetchListings();
  },[]);

  const fetchListings=useCallback(async(params:any={})=>{
    setLoading(true);
    try{
      const{data}=await api.get("/api/listings",{params:{limit:100,...params}});
      setListings(data);
    }catch{setListings([]);}
    setLoading(false);
  },[]);

  useEffect(()=>{
    const params:any={deal_type:deal};
    if(filterCat) params.category=filterCat;
    if(filterRegion) params.region=filterRegion;
    fetchListings(params);
  },[deal,filterCat,filterRegion]);

  const filtered=listings.filter(l=>!search||(l.title.toLowerCase().includes(search.toLowerCase())||l.city.toLowerCase().includes(search.toLowerCase())));
  const vips=filtered.filter(l=>l.is_vip);
  const tops=filtered.filter(l=>l.is_top&&!l.is_vip);
  const regular=filtered.filter(l=>!l.is_vip&&!l.is_top);

  return(
    <div style={{paddingBottom:72,background:"#F2F2F7",minHeight:"100vh"}}>
      {/* Header */}
      <div style={{background:"#fff",padding:"12px 16px 0",position:"sticky",top:0,zIndex:40,boxShadow:"0 1px 0 #E5E5EA"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:34,height:34,background:"#F5C518",borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>🏠</div>
            <span style={{fontSize:20,fontWeight:900,letterSpacing:-0.5}}>JOYMEE</span>
          </div>
          <div style={{display:"flex",gap:8}}>
            <Link href="/top10" style={{width:36,height:36,background:"#000",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",textDecoration:"none"}}>
              <span style={{fontSize:9,fontWeight:900,color:"#F5C518",lineHeight:1.1,textAlign:"center"}}>TOP{"
"}10</span>
            </Link>
            <button style={{width:36,height:36,background:"#F2F2F7",borderRadius:"50%",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",position:"relative"}}>
              <Bell size={18} color="#000"/>
              <span style={{position:"absolute",top:6,right:6,width:8,height:8,background:"#FF3B30",borderRadius:"50%",border:"2px solid #fff"}}/>
            </button>
          </div>
        </div>
        <div className="toggle-wrap" style={{margin:"0 0 10px"}}>
          <button className={`toggle-btn${view==="gallery"?" active":""}`} onClick={()=>setView("gallery")}>≡ Galereya</button>
          <button className={`toggle-btn${view==="map"?" active":""}`} onClick={()=>setView("map")}>🗺 Xaritada</button>
        </div>
        {view==="gallery"&&(
          <div style={{display:"flex",gap:8,marginBottom:10}}>
            <div style={{position:"relative",flex:1}}>
              <Search size={16} style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:"#8E8E93"}}/>
              <input className="jm-input" style={{paddingLeft:38,paddingTop:11,paddingBottom:11,fontSize:14}} placeholder="Nimani qidiramiz?" value={search} onChange={e=>setSearch(e.target.value)}/>
            </div>
            <button onClick={()=>setShowFilter(true)} style={{width:44,height:44,background:"#F2F2F7",borderRadius:12,border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
              <SlidersHorizontal size={18} color="#000"/>
            </button>
          </div>
        )}
      </div>

      {/* Map */}
      {view==="map"&&(
        <div style={{height:"calc(100vh - 130px)",position:"relative"}}>
          <MapComponent listings={filtered} center={userPos||[41.2995,69.2401]} zoom={userPos?13:11} cur={cur}/>
          <div style={{position:"absolute",top:10,left:10,right:10,display:"flex",gap:6}}>
            {["sale","rent","kunlik"].map(d=>(
              <button key={d} onClick={()=>setDeal(d)} style={{padding:"8px 14px",borderRadius:20,border:"none",cursor:"pointer",fontWeight:700,fontSize:13,background:deal===d?"#000":"#fff",color:deal===d?"#fff":"#000",boxShadow:"0 2px 8px rgba(0,0,0,.15)"}}>
                {d==="sale"?"Sotuv":d==="rent"?"Ijara":"Kunlik"}
              </button>
            ))}
          </div>
          <button onClick={async()=>{
            if(!userPos)return;
            try{const{data}=await api.get("/api/listings/near",{params:{lat:userPos[0],lng:userPos[1],radius_km:50,deal_type:deal}});setListings(data);}catch{}
          }} style={{position:"absolute",bottom:20,right:16,background:"#000",color:"#fff",border:"none",borderRadius:50,padding:"12px 20px",fontWeight:700,fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",gap:8,boxShadow:"0 4px 16px rgba(0,0,0,.3)"}}>
            <MapPin size={16}/> Menga yaqin
          </button>
        </div>
      )}

      {/* Gallery */}
      {view==="gallery"&&(
        <div style={{padding:"0 12px 12px"}}>
          <div style={{display:"flex",gap:6,overflowX:"auto",padding:"10px 0",scrollbarWidth:"none"}}>
            {["sale","rent","kunlik"].map(d=>(
              <button key={d} className={`chip${deal===d?" active":""}`} onClick={()=>setDeal(d)}>
                {d==="sale"?"Sotuv":d==="rent"?"Ijara":"Kunlik"}
              </button>
            ))}
          </div>

          {loading?(
            <div style={{display:"flex",justifyContent:"center",padding:"40px 0"}}>
              <div className="spin" style={{width:32,height:32,border:"3px solid #F2F2F7",borderTop:"3px solid #F5C518",borderRadius:"50%"}}/>
            </div>
          ):(
            <>
              {vips.length>0&&(
                <div style={{marginBottom:16}}>
                  <h2 style={{fontSize:18,fontWeight:800,marginBottom:10}}>VIP E'lonlar</h2>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                    {vips.map(l=><ListingCard key={l.id} listing={l} cur={cur}/>)}
                  </div>
                </div>
              )}
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
                <h2 style={{fontSize:18,fontWeight:800}}>Biz <span style={{color:"#F5C518"}}>{filtered.length.toLocaleString()}</span> ta e'lon topdik</h2>
                <button style={{display:"flex",alignItems:"center",gap:4,background:"none",border:"none",cursor:"pointer",fontSize:13,color:"#555",fontWeight:600}}>
                  <ArrowUpDown size={14}/>Saralash
                </button>
              </div>
              {filtered.length===0?(
                <div style={{textAlign:"center",padding:"40px 0",color:"#8E8E93"}}>
                  <div style={{fontSize:40,marginBottom:12}}>🔍</div>
                  <p style={{fontWeight:600}}>E'lonlar topilmadi</p>
                </div>
              ):(
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                  {[...tops,...regular].map(l=><ListingCard key={l.id} listing={l} cur={cur}/>)}
                </div>
              )}

              {/* Top profiles */}
              <div style={{marginTop:20}}>
                <h2 style={{fontSize:18,fontWeight:800,marginBottom:12}}>Eng yaxshi profillar</h2>
                <div className="card" style={{borderRadius:16,overflow:"hidden"}}>
                  {TOP_PROFILES.map((p,i)=>(
                    <div key={p.name} style={{display:"flex",alignItems:"center",gap:12,padding:"14px 16px",borderBottom:i<3?"1px solid #F2F2F7":"none"}}>
                      <img src={p.avatar} style={{width:48,height:48,borderRadius:"50%",objectFit:"cover"}} alt=""/>
                      <div>
                        <div style={{fontWeight:700,fontSize:15}}>{p.name}</div>
                        <div style={{fontSize:13,color:"#8E8E93"}}>E'lonlar: <b>{p.elonlar.toLocaleString()}</b></div>
                      </div>
                      <div style={{marginLeft:"auto",width:32,height:32,borderRadius:"50%",border:"2px solid #F5C518",display:"flex",alignItems:"center",justifyContent:"center"}}>🏆</div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Filter sheet */}
      {showFilter&&(
        <>
          <div className="sheet-overlay" onClick={()=>setShowFilter(false)}/>
          <div className="sheet">
            <div className="sheet-handle"/>
            <div style={{padding:"0 20px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
                <span style={{fontSize:20,fontWeight:800}}>Filtrlar</span>
                <button onClick={()=>{setFilterCat("");setFilterRegion("");}} style={{color:"#FF3B30",fontWeight:700,background:"none",border:"none",cursor:"pointer",fontSize:15}}>Tozalash</button>
              </div>
              <p style={{fontSize:13,color:"#8E8E93",fontWeight:600,marginBottom:8}}>Turkum</p>
              <select className="jm-input" style={{marginBottom:16}} value={filterCat} onChange={e=>setFilterCat(e.target.value)}>
                <option value="">Kategoriyani tanlang</option>
                {["Kvartira","Hovli/Kottej/Dacha","Tijorat binolari","Yer"].map((l,i)=>(
                  <option key={i} value={["apartment","house","commercial","land"][i]}>{l}</option>
                ))}
              </select>
              <p style={{fontSize:13,color:"#8E8E93",fontWeight:600,marginBottom:8}}>Mulk turi</p>
              {["Kunlik","Ijara","Sotuv"].map(t=>(
                <div key={t} style={{padding:"14px 0",borderBottom:"1px solid #F2F2F7",fontSize:16,fontWeight:500,cursor:"pointer"}}
                  onClick={()=>{setDeal(t==="Sotuv"?"sale":t==="Ijara"?"rent":"kunlik");setShowFilter(false);}}>
                  {t}
                </div>
              ))}
              <p style={{fontSize:13,color:"#8E8E93",fontWeight:600,margin:"16px 0 8px"}}>Viloyat</p>
              <select className="jm-input" style={{marginBottom:16}} value={filterRegion} onChange={e=>setFilterRegion(e.target.value)}>
                <option value="">Hududni tanlang</option>
                {REGIONS.map(r=><option key={r} value={r}>{r}</option>)}
              </select>
              <button className="yellow-btn" style={{width:"100%",padding:16,fontSize:16}} onClick={()=>setShowFilter(false)}>Qo'llash</button>
              <button style={{width:"100%",padding:"14px",background:"none",border:"none",cursor:"pointer",fontSize:15,color:"#555",fontWeight:600}} onClick={()=>setShowFilter(false)}>Keyingi</button>
            </div>
          </div>
        </>
      )}
      <BottomNav/>
    </div>
  );
}
