import { useState, useEffect, useCallback } from "react"

const F={display:"'Baloo 2',system-ui,sans-serif",body:"'Nunito',system-ui,sans-serif"}
const TH={
  blue:{fg:"#2E7BF0",bg:"#EAF3FF",sd:"#D4E6FF"},green:{fg:"#27C26E",bg:"#E9F8EF",sd:"#CFEFD9"},
  purple:{fg:"#A23DD6",bg:"#FBEEFF",sd:"#F0D6FA"},orange:{fg:"#FF7A1A",bg:"#FFF1E6",sd:"#FBDEC4"},
  teal:{fg:"#0FB8B0",bg:"#E4F8F6",sd:"#C7EEEA"},pink:{fg:"#FF4F9A",bg:"#FFEAF3",sd:"#FFD4E6"},
  violet:{fg:"#7B5BFF",bg:"#F0ECFF",sd:"#E0D6FA"},
}
const GRADS={
  blue:"linear-gradient(160deg,#7DBDFF,#2E7BF0)",green:"linear-gradient(160deg,#5BE39A,#1FA85B)",
  purple:"linear-gradient(160deg,#C77DF0,#8B2FC9)",orange:"linear-gradient(160deg,#FFB05C,#FF7A1A)",
  teal:"linear-gradient(160deg,#4FD8D0,#0FB8B0)",pink:"linear-gradient(160deg,#FF9BC7,#FF4F9A)",
  violet:"linear-gradient(160deg,#A98CFF,#6A3DF0)",
}
const GRADSD={blue:"#1F5FCC",green:"#1FA85B",purple:"#5A28C0",orange:"#E0900A",teal:"#0A8F88",pink:"#E02E7D",violet:"#5A38E0"}
const C={
  bg:"#F3F1FA",text:"#211B33",soft:"#8A85A0",softer:"#ADA7BE",
  violet:"#7B5BFF",violetSd:"#5A38E0",gold:"#FFB323",goldTxt:"#E0900A",
  green:"#27C26E",fire:"#FF7A1A",white:"#fff",
  card:{background:"#fff",borderRadius:22,boxShadow:"0 3px 0 rgba(33,27,51,.05),0 10px 24px rgba(33,27,51,.06)"},
}
const ME_GRAD="linear-gradient(160deg,#54A0FF,#2E7BF0)",ME_SD="#1F5FCC"
const PAIR_GRAD="linear-gradient(160deg,#FF7DB5,#FF4F9A)",PAIR_SD="#E02E7D"
const diffColor=d=>d==="Facil"?C.green:d==="Dificil"?C.fire:C.goldTxt

const LIB_DEFAULT=[
  {id:"guardar-louca",   name:"Guardar a lou\u00e7a da m\u00e1quina",     cat:"Cozinha",   icon:"restaurant",           th:"blue",  pts:15,coins:10,diff:"Facil", minCount:0},
  {id:"botar-louca",     name:"Botar a lou\u00e7a na m\u00e1quina",       cat:"Cozinha",   icon:"dishwasher",           th:"blue",  pts:15,coins:10,diff:"Facil", minCount:0},
  {id:"passar-aecio",    name:"Passar o A\u00e9cio",                       cat:"Geral",     icon:"smart_toy",            th:"teal",  pts:20,coins:12,diff:"Facil", minCount:0},
  {id:"colocar-roupa",   name:"Colocar roupas na m\u00e1quina",           cat:"Lavanderia",icon:"local_laundry_service",th:"blue",  pts:25,coins:15,diff:"Facil", minCount:0},
  {id:"estender-roupas", name:"Estender as roupas",                       cat:"Lavanderia",icon:"dry_cleaning",         th:"teal",  pts:25,coins:15,diff:"Facil", minCount:0},
  {id:"guardar-roupas",  name:"Guardar roupas",                           cat:"Lavanderia",icon:"checkroom",            th:"pink",  pts:30,coins:18,diff:"Media", minCount:0},
  {id:"trocar-toalhas",  name:"Trocar toalhas",                           cat:"Banheiro",  icon:"towel",                th:"green", pts:20,coins:12,diff:"Facil", minCount:0},
  {id:"trocar-cama",     name:"Trocar roupa de cama",                     cat:"Quarto",    icon:"king_bed",             th:"purple",pts:50,coins:30,diff:"Media", minCount:0},
  {id:"superficies",     name:"Tirar sujeira das superf\u00edcies",       cat:"Geral",     icon:"countertops",          th:"orange",pts:30,coins:18,diff:"Media", minCount:0},
  {id:"tirar-lixo",      name:"Tirar o lixo",                             cat:"Geral",     icon:"delete",               th:"green", pts:15,coins:10,diff:"Facil", minCount:0},
  {id:"levar-lixo",      name:"Levar o lixo pra baixo",                  cat:"Geral",     icon:"recycling",            th:"green", pts:20,coins:12,diff:"Facil", minCount:0},
  {id:"regar-plantas",   name:"Regar plantas",                            cat:"Geral",     icon:"yard",                 th:"green", pts:20,coins:12,diff:"Facil", minCount:0},
  {id:"organizar",       name:"Organizar bagu\u00e7as superficiais",      cat:"Geral",     icon:"inventory_2",          th:"orange",pts:25,coins:15,diff:"Facil", minCount:0},
  {id:"cozinhar",        name:"Cozinhar",                                 cat:"Cozinha",   icon:"cooking",              th:"orange",pts:40,coins:25,diff:"Media", minCount:0},
  {id:"limpar-geladeira",name:"Limpar a geladeira",                       cat:"Cozinha",   icon:"kitchen",              th:"blue",  pts:45,coins:28,diff:"Media", minCount:0},
  {id:"limpar-fogao",    name:"Limpar o fog\u00e3o",                      cat:"Cozinha",   icon:"mode_heat",            th:"orange",pts:35,coins:22,diff:"Media", minCount:0},
  {id:"limpar-pia",      name:"Limpar a pia",                             cat:"Cozinha",   icon:"water_drop",           th:"teal",  pts:25,coins:15,diff:"Facil", minCount:0},
  {id:"limpar-espelhos", name:"Limpar espelhos",                          cat:"Banheiro",  icon:"light_mode",           th:"blue",  pts:20,coins:12,diff:"Facil", minCount:0},
  {id:"limpar-vaso",     name:"Limpar vaso",                              cat:"Banheiro",  icon:"plumbing",             th:"purple",pts:30,coins:18,diff:"Media", minCount:0},
  {id:"limpar-caixa",    name:"Limpar a caixa de areia",                  cat:"Gatos",     icon:"cleaning_services",    th:"orange",pts:20,coins:12,diff:"Facil", minCount:0},
  {id:"trocar-areia",    name:"Trocar areia e lavar a caixa",             cat:"Gatos",     icon:"recycling",            th:"teal",  pts:35,coins:22,diff:"Media", minCount:0},
  {id:"lavar-pote",      name:"Lavar pote de \u00e1gua",                  cat:"Gatos",     icon:"water_drop",           th:"blue",  pts:15,coins:10,diff:"Facil", minCount:0},
  {id:"dar-comida",      name:"Dar comida pras gatas",                    cat:"Gatos",     icon:"pets",                 th:"green", pts:10,coins:8, diff:"Facil", minCount:0},
  {id:"dar-agua",        name:"Dar \u00e1gua pras gatas",                 cat:"Gatos",     icon:"local_drink",          th:"teal",  pts:10,coins:8, diff:"Facil", minCount:0},
  {id:"escovar-gatas",   name:"Escovar as gatas",                         cat:"Gatos",     icon:"spa",                  th:"pink",  pts:20,coins:12,diff:"Facil", minCount:0},
  {id:"lista-compras",   name:"Fazer a lista de compras",                 cat:"Compras",   icon:"list_alt",             th:"violet",pts:20,coins:12,diff:"Facil", minCount:0},
]
const MKT_DEFAULT=[
  {id:"filme",  name:"Escolher o filme",        icon:"movie",           th:"violet",cost:50, tier:"Baixo"},
  {id:"tv",     name:"Controle da TV",          icon:"settings_remote", th:"blue",  cost:40, tier:"Baixo"},
  {id:"jantar", name:"Escolher o jantar",       icon:"restaurant_menu", th:"orange",cost:60, tier:"Baixo"},
  {id:"cafe",   name:"Caf\u00e9 na cama",       icon:"local_cafe",      th:"orange",cost:120,tier:"Medio"},
  {id:"sobre",  name:"Sobremesa especial",      icon:"cake",            th:"pink",  cost:100,tier:"Medio"},
  {id:"massa",  name:"Vale massagem",           icon:"spa",             th:"purple",cost:200,tier:"Medio"},
  {id:"date",   name:"Vale date",               icon:"favorite",        th:"pink",  cost:400,tier:"Alto"},
  {id:"folga",  name:"Folga da lou\u00e7a (1 sem.)", icon:"restaurant", th:"violet",cost:350,tier:"Alto"},
  {id:"passeio",name:"Passeio do fim de semana",icon:"hiking",          th:"teal",  cost:500,tier:"Alto"},
]
const ACHS=[
  {id:"first",   label:"1\u00ba Lugar",        icon:"emoji_events",         th:"violet",desc:"Ganhe o ranking do m\u00eas",   ok:s=>s.wins>=1},
  {id:"streak7", label:"7 dias seguidos",       icon:"local_fire_department",th:"orange",desc:"7 dias consecutivos",           ok:s=>s.best_streak>=7},
  {id:"streak30",label:"30 dias!",              icon:"local_fire_department",th:"pink",  desc:"30 dias consecutivos",          ok:s=>s.best_streak>=30},
  {id:"t100",    label:"100 tarefas",           icon:"task_alt",             th:"blue",  desc:"100 tarefas conclu\u00eddas",   ok:s=>s.tasks_done>=100},
  {id:"t500",    label:"500 tarefas",           icon:"workspace_premium",    th:"violet",desc:"500 tarefas conclu\u00eddas",   ok:s=>s.tasks_done>=500},
  {id:"louca10", label:"Lou\u00e7a Mestre",     icon:"dishwasher",           th:"blue",  desc:"Guardou a lou\u00e7a 10\u00d7", ok:s=>(s.task_counts?.["guardar-louca"]||0)>=10},
  {id:"gatas10", label:"Cat Parent",            icon:"pets",                 th:"green", desc:"Cuidou das gatas 10\u00d7",     ok:s=>(s.task_counts?.["dar-comida"]||0)>=10},
  {id:"chef10",  label:"Chef de Casa",          icon:"cooking",              th:"orange",desc:"Cozinhou 10\u00d7",             ok:s=>(s.task_counts?.["cozinhar"]||0)>=10},
]
const TITLES=[{min:500,t:"Lenda da Casa"},{min:100,t:"Faxineiro Lend\u00e1rio"},{min:50,t:"Mestre de Casa"},{min:10,t:"Faxineiro Jr."},{min:0,t:"Iniciante"}]
const ICON_OPTIONS=["restaurant","dishwasher","smart_toy","local_laundry_service","dry_cleaning","checkroom","towel","king_bed","countertops","delete","recycling","yard","inventory_2","cooking","kitchen","mode_heat","water_drop","light_mode","plumbing","cleaning_services","pets","local_drink","spa","list_alt","shopping_cart","bathtub","favorite","movie","hiking","cake","local_cafe","task_alt","home","star","bolt","emoji_events","card_giftcard","settings_remote","restaurant_menu","sports_esports","fitness_center","music_note","handyman","local_florist","iron","vacuum"]
const THEMES_LIST=["blue","green","purple","orange","teal","pink","violet"]
const DIFF_LIST=["Facil","Media","Dificil"]
const DIFF_LBL={Facil:"F\u00e1cil",Media:"M\u00e9dia",Dificil:"Dif\u00edcil"}
const TIER_LIST=["Baixo","Medio","Alto"]
const TIER_LBL={Baixo:"Baixo custo",Medio:"M\u00e9dio custo",Alto:"Alto custo"}
const OLD_IDS=["lavar-louca","aspirador","lavar-roupa","dobrar-roupa","mercado","limpar-coz","cama","varrer","limpar-ban"]

const today=()=>new Date().toISOString().split("T")[0]
const sundayWeekId=()=>{const d=new Date(),day=d.getDay(),s=new Date(d);s.setDate(d.getDate()-day);return s.toISOString().split("T")[0]}
const nextSundayStr=()=>{const d=new Date(),days=d.getDay()===0?7:7-d.getDay(),n=new Date(d);n.setDate(d.getDate()+days);return n.toLocaleDateString("pt-BR",{weekday:"long",day:"2-digit",month:"short"})}
const daysLeft=()=>{const d=new Date();return new Date(d.getFullYear(),d.getMonth()+1,0).getDate()-d.getDate()}
const monthName=()=>["\u0041pr","\u004a\u0061\u006e","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"][new Date().getMonth()]
const getTitle=td=>TITLES.find(t=>td>=t.min)?.t||"Iniciante"
const ini=n=>(n||"?")[0].toUpperCase()
const sBon=s=>s>=30?.15:s>=15?.10:s>=7?.05:0
const genId=()=>`id_${Date.now()}_${Math.random().toString(36).slice(2,6)}`
const store={
  get:()=>{try{const r=localStorage.getItem("casa_v2");return r?JSON.parse(r):null}catch{return null}},
  set:v=>{try{localStorage.setItem("casa_v2",JSON.stringify(v))}catch{}}
}
const blankStats=()=>({month_points:0,hall_points:0,coins:0,streak:0,best_streak:0,last_date:null,tasks_done:0,wins:0,task_counts:{}})
const blankDraft=()=>({week_id:"",confirmed:false,bonus_given:false,assigns:{"0":[],"1":[]},steals_used:0})
const blankState=()=>({
  house:{name:""},users:[{id:0,name:"",color:"blue"},{id:1,name:"",color:"pink"}],viewUser:0,
  stats:{"0":blankStats(),"1":blankStats()},draft:blankDraft(),
  history:[],unlocked:{"0":[],"1":[]},redemptions:[],library:LIB_DEFAULT,market:MKT_DEFAULT,
})
const loadState=()=>{
  const s=store.get()||blankState()
  if(!s.library)s.library=LIB_DEFAULT
  if(!s.market)s.market=MKT_DEFAULT
  if(!s.redemptions)s.redemptions=[]
  if(s.draft.steals_used===undefined)s.draft.steals_used=0
  if(s.library.some(t=>OLD_IDS.includes(t.id))){s.library=LIB_DEFAULT;s.draft=blankDraft()}
  return s
}
function applyStreak(s0){
  const t=today(),s={...s0}
  if(s.last_date===t)return s
  if(s.last_date){const diff=(new Date(t)-new Date(s.last_date))/864e5;s.streak=diff===1?s.streak+1:1}
  else s.streak=1
  s.last_date=t;s.best_streak=Math.max(s.best_streak,s.streak);return s
}
const checkAchs=(stats,unlocked)=>ACHS.filter(a=>!unlocked.includes(a.id)&&a.ok(stats)).map(a=>a.id)

function Icon({name,size=24,color,style={}}){
  return<span className="material-symbols-rounded" style={{fontSize:size,color:color||"inherit",lineHeight:1,userSelect:"none",flexShrink:0,...style}}>{name}</span>
}
function TaskIcon({task,size=44}){
  const th=TH[task?.th]||TH.violet
  return<div style={{width:size,height:size,borderRadius:Math.round(size*.3),background:th.bg,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 3px 0 ${th.sd}`,flexShrink:0}}>
    <Icon name={task?.icon||"task_alt"} size={Math.round(size*.54)} color={th.fg}/>
  </div>
}
function Coin({n,size=14,color=C.goldTxt}){
  return<span style={{display:"inline-flex",alignItems:"center",gap:3,fontFamily:F.display,fontWeight:800,color}}><Icon name="paid" size={size} color={C.gold}/>{n}</span>
}
function PtsBolt({n,size=14,color=C.violet}){
  return<span style={{display:"inline-flex",alignItems:"center",gap:2,fontFamily:F.display,fontWeight:800,color}}><Icon name="bolt" size={size} color={color}/>{n}</span>
}
function TaskMeta({task}){
  return<div style={{display:"flex",alignItems:"center",gap:8,fontFamily:F.body,fontWeight:800,fontSize:11.5,color:C.soft}}>
    <span style={{color:diffColor(task.diff)}}>{DIFF_LBL[task.diff]||task.diff}</span>
    <PtsBolt n={task.pts} size={13}/><Coin n={task.coins} size={13}/>
    {(task.minCount||0)>0&&<span style={{color:C.violet,fontSize:11}}>{"m\u00edn"} {task.minCount}{"\u00d7"}</span>}
  </div>
}
function Pill({icon,value,color=C.violet,iconColor}){
  return<div style={{display:"flex",alignItems:"center",gap:5,background:"#fff",borderRadius:999,padding:"7px 12px",boxShadow:"0 2px 0 rgba(33,27,51,.05)"}}>
    <Icon name={icon} size={19} color={iconColor||color}/><span style={{fontSize:15,fontFamily:F.display,fontWeight:700,color}}>{value}</span>
  </div>
}
function Btn3D({children,onClick,color=C.violet,shadow=C.violetSd,style={},disabled=false,small=false}){
  const[p,setP]=useState(false)
  return<button onClick={!disabled?onClick:undefined}
    onMouseDown={()=>setP(true)} onMouseUp={()=>setP(false)} onMouseLeave={()=>setP(false)}
    onTouchStart={()=>setP(true)} onTouchEnd={()=>setP(false)}
    style={{background:disabled?"#C9C3D6":color,color:"#fff",border:"none",borderRadius:16,
      padding:small?"9px 16px":"14px 20px",fontFamily:F.display,fontWeight:800,
      fontSize:small?13:17,boxShadow:p||disabled?"none":`0 4px 0 ${shadow}`,
      transform:p?"translateY(4px)":"none",cursor:disabled?"not-allowed":"pointer",
      width:"100%",transition:"all .08s",...style}}>
    {children}
  </button>
}
function Card({children,style={}}){return<div style={{...C.card,padding:18,...style}}>{children}</div>}
function SectionLabel({children}){
  return<div style={{display:"flex",alignItems:"center",gap:8,margin:"4px 2px 10px"}}>
    <span style={{fontFamily:F.display,fontWeight:700,fontSize:15,color:C.text}}>{children}</span>
    <div style={{flex:1,height:2,background:"#E7E2F3",borderRadius:2}}/>
  </div>
}
function Toast({msg,action,onAction,onClose}){
  useEffect(()=>{const t=setTimeout(onClose,action?5000:2400);return()=>clearTimeout(t)},[])
  return<div style={{position:"fixed",bottom:104,left:"50%",transform:"translateX(-50%)",background:"#211B33",color:"#fff",borderRadius:14,padding:"12px 16px",fontFamily:F.display,fontWeight:700,fontSize:15,zIndex:999,boxShadow:"0 8px 24px rgba(0,0,0,.25)",display:"flex",alignItems:"center",gap:12,whiteSpace:"nowrap",animation:"toastIn .3s ease-out"}}>
    <span>{msg}</span>
    {action&&<button onClick={()=>{onAction();onClose()}} style={{background:"rgba(255,255,255,.22)",border:"none",borderRadius:9,padding:"5px 11px",color:"#fff",fontFamily:F.display,fontWeight:800,fontSize:13,cursor:"pointer"}}>{action}</button>}
  </div>
}
function AchModal({ach,onClose}){
  if(!ach)return null
  const grad=GRADS[ach.th]||GRADS.violet,sd=GRADSD[ach.th]||GRADSD.violet
  return<div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(20,12,40,.55)",backdropFilter:"blur(4px)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:32,animation:"fadeIn .25s ease-out"}}>
    <div style={{...C.card,padding:"30px 24px 24px",textAlign:"center",maxWidth:300,width:"100%",animation:"popIn .45s cubic-bezier(.34,1.56,.64,1)"}}>
      <div style={{fontSize:12,fontFamily:F.body,fontWeight:800,letterSpacing:1,color:C.gold}}>CONQUISTA DESBLOQUEADA</div>
      <div style={{width:96,height:96,borderRadius:"50%",background:grad,display:"flex",alignItems:"center",justifyContent:"center",margin:"16px auto",boxShadow:`0 8px 0 ${sd}`,animation:"badgePulse 1.4s ease-in-out infinite"}}><Icon name={ach.icon} size={50} color="#fff"/></div>
      <div style={{fontFamily:F.display,fontWeight:800,fontSize:23,color:C.text}}>{ach.label}</div>
      <div style={{fontFamily:F.body,fontWeight:700,fontSize:13.5,color:C.soft,marginTop:4}}>{ach.desc}</div>
      <Btn3D onClick={onClose} style={{marginTop:20}}>Mandou bem!</Btn3D>
    </div>
  </div>
}
function ConfirmSheet({title,msg,confirmLabel="Confirmar",onConfirm,onCancel,danger=false}){
  return<div onClick={onCancel} style={{position:"fixed",inset:0,background:"rgba(20,12,40,.45)",zIndex:800,display:"flex",alignItems:"flex-end",justifyContent:"center",animation:"fadeIn .2s ease-out"}}>
    <div onClick={e=>e.stopPropagation()} style={{...C.card,width:"100%",maxWidth:430,borderRadius:"22px 22px 0 0",padding:"24px 20px 40px",animation:"toastIn .25s ease-out"}}>
      <div style={{fontFamily:F.display,fontWeight:800,fontSize:19,color:C.text,marginBottom:msg?6:20}}>{title}</div>
      {msg&&<div style={{fontFamily:F.body,fontWeight:700,fontSize:14,color:C.soft,marginBottom:20}}>{msg}</div>}
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        <Btn3D onClick={onConfirm} color={danger?"#D93434":C.violet} shadow={danger?"#A02828":C.violetSd}>{confirmLabel}</Btn3D>
        <button onClick={onCancel} style={{border:"none",background:"none",fontFamily:F.display,fontWeight:800,fontSize:16,color:C.soft,padding:10,cursor:"pointer"}}>Cancelar</button>
      </div>
    </div>
  </div>
}
function BottomSheet({title,onClose,children}){
  return<div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(20,12,40,.45)",zIndex:850,display:"flex",alignItems:"flex-end",justifyContent:"center",animation:"fadeIn .2s ease-out"}}>
    <div onClick={e=>e.stopPropagation()} style={{...C.card,width:"100%",maxWidth:430,borderRadius:"22px 22px 0 0",padding:"20px 20px 40px",maxHeight:"88vh",overflowY:"auto",animation:"toastIn .25s ease-out"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18}}>
        <div style={{fontFamily:F.display,fontWeight:800,fontSize:18,color:C.text}}>{title}</div>
        <button onClick={onClose} style={{background:"#F0ECFF",border:"none",borderRadius:999,width:32,height:32,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}><Icon name="close" size={18} color={C.violet}/></button>
      </div>
      {children}
    </div>
  </div>
}
function ConfirmWordModal({word,title,desc,onConfirm,onCancel,danger=false}){
  const[typed,setTyped]=useState("")
  return<BottomSheet title={title} onClose={onCancel}>
    {desc&&<div style={{fontFamily:F.body,fontSize:14,fontWeight:700,color:C.soft,marginBottom:14}}>{desc}</div>}
    <div style={{fontFamily:F.body,fontSize:13,fontWeight:800,color:danger?"#D93434":C.text,marginBottom:10}}>
      {"Digite "}<span style={{fontFamily:F.display,fontWeight:900}}>{"\""+word+"\""}</span>{" para confirmar:"}
    </div>
    <input value={typed} onChange={e=>setTyped(e.target.value)} placeholder={word} autoFocus
      style={{width:"100%",padding:"13px 14px",borderRadius:14,border:`2px solid ${typed===word?"#27C26E":"#E3DDF1"}`,fontFamily:F.body,fontWeight:700,fontSize:15,color:C.text,outline:"none",boxSizing:"border-box",background:"#fff",marginBottom:14,display:"block"}}/>
    <Btn3D onClick={onConfirm} disabled={typed!==word} color={danger?"#D93434":C.violet} shadow={danger?"#A02828":C.violetSd}>Confirmar</Btn3D>
  </BottomSheet>
}
const inp={width:"100%",padding:"13px 14px",borderRadius:14,border:"2px solid #E3DDF1",fontFamily:"'Nunito',system-ui",fontWeight:700,fontSize:15,color:"#211B33",outline:"none",boxSizing:"border-box",background:"#fff",marginBottom:12,display:"block"}
const lbl={fontFamily:"'Nunito',system-ui",fontSize:12,fontWeight:800,color:"#6E6688",margin:"0 0 5px 3px",display:"block"}
function IconPicker({value,onChange}){
  const[open,setOpen]=useState(false)
  return<>
    <label style={lbl}>{"\u00cdCONE"}</label>
    <button onClick={()=>setOpen(true)} style={{display:"flex",alignItems:"center",gap:10,background:"#F8F6FF",border:"2px solid #E3DDF1",borderRadius:14,padding:"10px 14px",cursor:"pointer",marginBottom:12,width:"100%",textAlign:"left"}}>
      <Icon name={value||"task_alt"} size={28} color={C.violet}/>
      <span style={{fontFamily:F.body,fontWeight:700,fontSize:14,color:C.text,flex:1}}>{value||"task_alt"}</span>
      <Icon name="expand_more" size={20} color={C.soft}/>
    </button>
    {open&&<BottomSheet title={"Escolher \u00edcone"} onClose={()=>setOpen(false)}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:10}}>
        {ICON_OPTIONS.map(ic=>(
          <button key={ic} onClick={()=>{onChange(ic);setOpen(false)}}
            style={{aspectRatio:"1",borderRadius:14,background:value===ic?C.violet:"#F0ECFF",border:"none",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",padding:10}}>
            <Icon name={ic} size={26} color={value===ic?"#fff":C.violet}/>
          </button>
        ))}
      </div>
    </BottomSheet>}
  </>
}
function TaskForm({initial={},onSave}){
  const[v,setV]=useState({name:"",cat:"Geral",icon:"task_alt",th:"blue",pts:20,coins:12,diff:"Facil",minCount:0,...initial})
  return<div>
    <label style={lbl}>NOME</label>
    <input value={v.name} onChange={e=>setV(p=>({...p,name:e.target.value}))} placeholder={"Ex: Lavar lou\u00e7a"} style={inp}/>
    <label style={lbl}>CATEGORIA</label>
    <input value={v.cat} onChange={e=>setV(p=>({...p,cat:e.target.value}))} placeholder="Ex: Cozinha" style={inp}/>
    <IconPicker value={v.icon} onChange={ic=>setV(p=>({...p,icon:ic}))}/>
    <label style={lbl}>TEMA</label>
    <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:14}}>
      {THEMES_LIST.map(t=><button key={t} onClick={()=>setV(p=>({...p,th:t}))} style={{width:32,height:32,borderRadius:10,background:GRADS[t],border:v.th===t?"3px solid #211B33":"3px solid transparent",cursor:"pointer",boxShadow:`0 3px 0 ${GRADSD[t]}`}}/>)}
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:12}}>
      <div><label style={lbl}>PONTOS</label><input type="number" value={v.pts} onChange={e=>setV(p=>({...p,pts:+e.target.value}))} style={{...inp,marginBottom:0}}/></div>
      <div><label style={lbl}>MOEDAS</label><input type="number" value={v.coins} onChange={e=>setV(p=>({...p,coins:+e.target.value}))} style={{...inp,marginBottom:0}}/></div>
      <div><label style={lbl}>{"\u004d\u00cdN/SEM."}</label><input type="number" value={v.minCount} min="0" onChange={e=>setV(p=>({...p,minCount:+e.target.value}))} style={{...inp,marginBottom:0}}/></div>
    </div>
    <label style={lbl}>DIFICULDADE</label>
    <select value={v.diff} onChange={e=>setV(p=>({...p,diff:e.target.value}))} style={{...inp,appearance:"none"}}>
      {DIFF_LIST.map(d=><option key={d} value={d}>{DIFF_LBL[d]}</option>)}
    </select>
    <Btn3D onClick={()=>v.name.trim()&&onSave({...v})} disabled={!v.name.trim()}>Salvar tarefa</Btn3D>
  </div>
}
function RewardForm({initial={},onSave}){
  const[v,setV]=useState({name:"",icon:"card_giftcard",th:"violet",cost:100,tier:"Medio",...initial})
  return<div>
    <label style={lbl}>NOME</label>
    <input value={v.name} onChange={e=>setV(p=>({...p,name:e.target.value}))} placeholder="Ex: Escolher o filme" style={inp}/>
    <IconPicker value={v.icon} onChange={ic=>setV(p=>({...p,icon:ic}))}/>
    <label style={lbl}>TEMA</label>
    <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:14}}>
      {THEMES_LIST.map(t=><button key={t} onClick={()=>setV(p=>({...p,th:t}))} style={{width:32,height:32,borderRadius:10,background:GRADS[t],border:v.th===t?"3px solid #211B33":"3px solid transparent",cursor:"pointer",boxShadow:`0 3px 0 ${GRADSD[t]}`}}/>)}
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
      <div><label style={lbl}>CUSTO (moedas)</label><input type="number" value={v.cost} onChange={e=>setV(p=>({...p,cost:+e.target.value}))} style={{...inp,marginBottom:0}}/></div>
      <div><label style={lbl}>{"\u004e\u00cdVEL"}</label>
        <select value={v.tier} onChange={e=>setV(p=>({...p,tier:e.target.value}))} style={{...inp,appearance:"none",marginBottom:0}}>
          {TIER_LIST.map(t=><option key={t} value={t}>{TIER_LBL[t]}</option>)}
        </select>
      </div>
    </div>
    <Btn3D onClick={()=>v.name.trim()&&onSave({...v})} disabled={!v.name.trim()}>Salvar recompensa</Btn3D>
  </div>
}

function Onboarding({onDone}){
  const[step,setStep]=useState(0),[house,setHouse]=useState(""),[myName,setMyName]=useState(""),[pairName,setPairName]=useState(""),[assigns,setAssigns]=useState({})
  const totalPts=Object.entries(assigns).reduce((a,[id,n])=>{const t=LIB_DEFAULT.find(t=>t.id===id);return a+(t?t.pts*n:0)},0)
  const taskCount=Object.values(assigns).filter(n=>n>0).length
  const fi={width:"100%",padding:"15px 16px",borderRadius:16,border:"2px solid #E3DDF1",fontFamily:"'Nunito',system-ui",fontWeight:700,fontSize:16,color:C.text,outline:"none",boxSizing:"border-box",background:"#fff",display:"block"}
  const fl={fontFamily:"'Nunito',system-ui",fontSize:12.5,fontWeight:800,color:"#6E6688",margin:"0 0 7px 4px",display:"block"}
  return<div style={{minHeight:"100vh",background:C.bg,display:"flex",flexDirection:"column"}}>
    {step>0&&<div style={{padding:"24px 24px 0"}}><div style={{display:"flex",gap:6}}>{[1,2].map(i=><div key={i} style={{flex:1,height:6,borderRadius:99,background:step>=i?C.violet:"#DDD6EC"}}/>)}</div><div style={{fontFamily:F.body,fontSize:12,fontWeight:700,color:C.soft,marginTop:8}}>Passo {step} de 2</div></div>}
    {step===0&&<div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"40px 28px",textAlign:"center"}}>
      <div style={{width:108,height:108,borderRadius:32,background:"linear-gradient(160deg,#8B6BFF,#6A3DF0)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 8px 0 #5A28C0,0 18px 40px rgba(106,61,240,.35)",marginBottom:28}}><Icon name="home" size={58} color="#fff"/></div>
      <div style={{fontFamily:F.display,fontWeight:800,fontSize:34,color:C.text}}>Casa</div>
      <div style={{fontFamily:F.body,fontWeight:700,fontSize:16,color:"#6E6688",marginTop:8,maxWidth:280,lineHeight:1.4}}>{"Transforme as tarefas da casa numa competi\u00e7\u00e3o divertida entre voc\u00eas dois."}</div>
      <div style={{display:"flex",gap:18,margin:"34px 0"}}>
        {[["emoji_events","Ranking",C.violet],["paid","Recompensas",C.gold],["local_fire_department",{"Sequ\u00eancias"},C.fire]].map(([icon,label,col])=>(
          <div key={label} style={{textAlign:"center"}}>
            <div style={{width:54,height:54,borderRadius:16,background:"#fff",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 3px 0 rgba(0,0,0,.06)",marginBottom:6}}><Icon name={icon} size={28} color={col}/></div>
            <div style={{fontFamily:F.body,fontSize:11,fontWeight:800,color:C.soft}}>{label}</div>
          </div>
        ))}
      </div>
      <Btn3D onClick={()=>setStep(1)} style={{maxWidth:320}}>Criar nossa casa</Btn3D>
    </div>}
    {step===1&&<div style={{flex:1,padding:24,display:"flex",flexDirection:"column"}}>
      <div style={{fontFamily:F.display,fontWeight:800,fontSize:26,color:C.text,marginTop:4}}>Quem mora aqui?</div>
      <div style={{fontFamily:F.body,fontWeight:700,fontSize:14,color:C.soft,marginTop:4,marginBottom:24}}>{"Vamos configurar a casa de voc\u00eas."}</div>
      <label style={fl}>NOME DA CASA</label>
      <input placeholder={"Ex: Casa do Victor & Ingrid"} value={house} onChange={e=>setHouse(e.target.value)} style={{...fi,marginBottom:18}}/>
      <label style={fl}>{"VOC\u00ca"}</label>
      <div style={{display:"flex",gap:11,alignItems:"center",marginBottom:18}}>
        <div style={{width:50,height:50,borderRadius:15,background:ME_GRAD,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,boxShadow:`0 4px 0 ${ME_SD}`}}><span style={{fontFamily:F.display,fontWeight:800,fontSize:22,color:"#fff"}}>{ini(myName)}</span></div>
        <input placeholder="Seu nome" value={myName} onChange={e=>setMyName(e.target.value)} style={fi}/>
      </div>
      <label style={fl}>SEU PAR</label>
      <div style={{display:"flex",gap:11,alignItems:"center"}}>
        <div style={{width:50,height:50,borderRadius:15,background:PAIR_GRAD,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,boxShadow:`0 4px 0 ${PAIR_SD}`}}><span style={{fontFamily:F.display,fontWeight:800,fontSize:22,color:"#fff"}}>{ini(pairName)}</span></div>
        <input placeholder="Nome do seu par" value={pairName} onChange={e=>setPairName(e.target.value)} style={fi}/>
      </div>
      <div style={{flex:1}}/><Btn3D onClick={()=>setStep(2)} disabled={!house.trim()||!myName.trim()||!pairName.trim()}>Continuar</Btn3D>
    </div>}
    {step===2&&<div style={{flex:1,display:"flex",flexDirection:"column"}}>
      <div style={{padding:"4px 24px 14px"}}>
        <div style={{fontFamily:F.display,fontWeight:800,fontSize:26,color:C.text,lineHeight:1.15}}>{"O que voc\u00ea assume esta semana?"}</div>
        <div style={{fontFamily:F.body,fontWeight:700,fontSize:14,color:C.soft,marginTop:4}}>Toque para adicionar. Ajuste a quantidade depois.</div>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"0 16px",display:"flex",flexDirection:"column",gap:10,paddingBottom:130}}>
        {LIB_DEFAULT.map(task=>{
          const n=assigns[task.id]||0
          return<div key={task.id} style={{...C.card,padding:"13px 16px",display:"flex",alignItems:"center",gap:12}}>
            <TaskIcon task={task}/>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontFamily:F.display,fontWeight:700,fontSize:15,color:C.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{task.name}</div>
              <TaskMeta task={task}/>
            </div>
            {n===0
              ?<button onClick={()=>setAssigns({...assigns,[task.id]:1})} style={{background:"none",color:C.violet,border:`2px solid ${C.violet}`,borderRadius:12,padding:"7px 12px",fontFamily:F.display,fontWeight:800,fontSize:13,cursor:"pointer",whiteSpace:"nowrap",flexShrink:0}}>+ Assumir</button>
              :<div style={{display:"flex",alignItems:"center",background:C.violet,borderRadius:12,boxShadow:`0 3px 0 ${C.violetSd}`,flexShrink:0}}>
                <button onClick={()=>setAssigns({...assigns,[task.id]:Math.max(0,n-1)})} style={{width:30,height:32,background:"none",border:"none",cursor:"pointer",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center"}}><Icon name="remove" size={18}/></button>
                <span style={{fontFamily:F.display,fontWeight:800,fontSize:15,color:"#fff",minWidth:26,textAlign:"center"}}>{n}{"\u00d7"}</span>
                <button onClick={()=>setAssigns({...assigns,[task.id]:n+1})} style={{width:30,height:32,background:"none",border:"none",cursor:"pointer",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center"}}><Icon name="add" size={18}/></button>
              </div>}
          </div>
        })}
      </div>
      <div style={{position:"fixed",bottom:0,left:0,right:0,maxWidth:430,margin:"0 auto",background:"#fff",borderTop:"1px solid #EFEBF8",padding:"12px 16px 28px",display:"flex",alignItems:"center",gap:10}}>
        <div style={{flex:1,lineHeight:1.2}}>
          <div style={{fontFamily:F.display,fontWeight:800,fontSize:16,color:C.text}}>{taskCount} tarefa{taskCount!==1?"s":""} {"\u00b7"} {totalPts} pts</div>
          <div style={{fontFamily:F.body,fontWeight:700,fontSize:12,color:C.soft}}>previstos na sua semana</div>
        </div>
        <Btn3D onClick={()=>onDone({house,myName,pairName,assigns})} disabled={taskCount===0} style={{width:"auto",padding:"14px 22px"}}>{"Come\u00e7ar"}</Btn3D>
      </div>
    </div>}
  </div>
}

function HomeScreen({state,dispatch,onOpenSettings}){
  const u0=state.stats["0"],u1=state.stats["1"],me=state.users[0],pair=state.users[1]
  const total=u0.month_points+u1.month_points
  let myPct=total>0?Math.round(u0.month_points/total*100):50;myPct=Math.max(12,Math.min(88,myPct))
  const iLead=u0.month_points>=u1.month_points,isTie=u0.month_points===u1.month_points,diff=Math.abs(u0.month_points-u1.month_points)
  const greeting=()=>{const h=new Date().getHours();return h<12?"Bom dia":h<18?"Boa tarde":"Boa noite"}
  const myAssigns=state.draft.assigns?.["0"]||[]
  const nextTask=myAssigns.find(a=>(a.done||0)<a.count)
  const nextTaskData=nextTask?state.library.find(t=>t.id===nextTask.id):null
  const myTotal=myAssigns.reduce((a,x)=>a+x.count,0),myDone=myAssigns.reduce((a,x)=>a+(x.done||0),0)
  const commitment=myTotal>0?Math.round(myDone/myTotal*100):null
  const myUnlocked=state.unlocked?.["0"]||[],lastAch=myUnlocked.length>0?ACHS.find(a=>a.id===myUnlocked[myUnlocked.length-1]):null
  const monthsArr=["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"]
  const mName=monthsArr[new Date().getMonth()]
  const Avatar=({grad,sd,name,size=64,fs=28,crown})=>(
    <div style={{position:"relative",width:size,margin:"0 auto 6px"}}>
      {crown&&<Icon name="crown" size={Math.round(size*.34)} color={C.gold} style={{position:"absolute",top:Math.round(-size*.27),left:"50%",transform:"translateX(-50%)"}}/>}
      <div style={{width:size,height:size,borderRadius:Math.round(size*.31),background:grad,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 4px 0 ${sd}`}}>
        <span style={{fontFamily:F.display,fontWeight:800,fontSize:fs,color:"#fff"}}>{name}</span>
      </div>
    </div>
  )
  return<div style={{padding:"calc(env(safe-area-inset-top,20px) + 18px) 16px 100px",display:"flex",flexDirection:"column",gap:14}}>
    <div style={{display:"flex",alignItems:"center",gap:11}}>
      <div style={{width:46,height:46,borderRadius:15,background:ME_GRAD,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 4px 0 ${ME_SD}`}}><span style={{fontFamily:F.display,fontWeight:800,fontSize:21,color:"#fff"}}>{ini(me.name)}</span></div>
      <div style={{flex:1,minWidth:0,lineHeight:1.1}}>
        <div style={{fontFamily:F.body,fontSize:12.5,fontWeight:700,color:C.soft}}>{greeting()},</div>
        <div style={{fontFamily:F.display,fontWeight:700,fontSize:19,color:C.text}}>{me.name}</div>
      </div>
      <Pill icon="local_fire_department" value={u0.streak} color={C.fire}/>
      <Pill icon="paid" value={u0.coins} color={C.goldTxt} iconColor={C.gold}/>
      <button onClick={onOpenSettings} style={{width:42,height:42,borderRadius:13,background:"#fff",border:"none",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 2px 0 rgba(33,27,51,.06)",cursor:"pointer",flexShrink:0}}><Icon name="settings" size={22} color={C.soft}/></button>
    </div>
    <Card>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
        <div style={{display:"flex",alignItems:"center",gap:7}}><Icon name="emoji_events" size={22} color={C.violet}/><span style={{fontFamily:F.display,fontWeight:700,fontSize:17,color:C.text}}>Ranking de {mName}</span></div>
        <div style={{display:"flex",alignItems:"center",gap:4,background:C.bg,borderRadius:999,padding:"5px 10px"}}><Icon name="schedule" size={15} color={C.soft}/><span style={{fontFamily:F.body,fontSize:12.5,fontWeight:800,color:C.soft}}>{daysLeft()} dias</span></div>
      </div>
      <div style={{display:"flex",alignItems:"flex-end",justifyContent:"space-between",gap:8}}>
        <div style={{flex:1,textAlign:"center"}}>
          <Avatar grad={ME_GRAD} sd={ME_SD} name={ini(me.name)} crown={iLead}/>
          <div style={{fontFamily:F.body,fontWeight:800,fontSize:13.5,color:C.text}}>{"Voc\u00ea"}</div>
          <div style={{fontFamily:F.display,fontWeight:800,fontSize:23,color:C.text,lineHeight:1.1}}>{u0.month_points}</div>
          <div style={{fontFamily:F.body,fontSize:11,fontWeight:800,color:C.soft,letterSpacing:.5}}>PONTOS</div>
        </div>
        <div style={{fontFamily:F.display,fontWeight:800,fontSize:15,color:"#C9C3D6",paddingBottom:30}}>VS</div>
        <div style={{flex:1,textAlign:"center",opacity:.92}}>
          <Avatar grad={PAIR_GRAD} sd={PAIR_SD} name={ini(pair.name)} size={56} fs={24} crown={!iLead&&!isTie}/>
          <div style={{fontFamily:F.body,fontWeight:800,fontSize:13.5,color:"#5a5468"}}>{pair.name}</div>
          <div style={{fontFamily:F.display,fontWeight:800,fontSize:21,color:"#5a5468",lineHeight:1.1}}>{u1.month_points}</div>
          <div style={{fontFamily:F.body,fontSize:11,fontWeight:800,color:C.softer,letterSpacing:.5}}>PONTOS</div>
        </div>
      </div>
      <div style={{marginTop:14,height:12,borderRadius:999,overflow:"hidden",display:"flex",background:"#FFE3F0"}}>
        <div style={{width:`${myPct}%`,background:ME_GRAD,transition:"width .5s"}}/><div style={{flex:1,background:PAIR_GRAD}}/>
      </div>
      <div style={{textAlign:"center",marginTop:9,fontFamily:F.body,fontSize:12.5,fontWeight:800,color:C.violet}}>
        {total===0?"A disputa come\u00e7a agora!":isTie?"Empate t\u00e9cnico!":iLead?`Voc\u00ea lidera por ${diff} pts \uD83D\uDD25`:`${pair.name} lidera por ${diff} pts`}
      </div>
    </Card>
    <div style={{display:"flex",gap:10}}>
      {[{icon:"military_tech",label:"Posi\u00e7\u00e3o",value:iLead||isTie?"1\u00ba":"2\u00ba",color:C.gold},
        {icon:"verified",label:"Comprometimento",value:commitment!=null?`${commitment}%`:"\u2014",color:C.green},
        {icon:"check_circle",label:"Esta semana",value:`${myDone}/${myTotal}`,color:C.violet}].map(({icon,label,value,color})=>(
        <div key={label} style={{flex:1,...C.card,padding:"13px 10px",textAlign:"center"}}>
          <Icon name={icon} size={22} color={color}/>
          <div style={{fontFamily:F.display,fontWeight:800,fontSize:19,color:C.text,marginTop:2}}>{value}</div>
          <div style={{fontFamily:F.body,fontSize:11,fontWeight:700,color:C.soft}}>{label}</div>
        </div>
      ))}
    </div>
    {myTotal>0&&(nextTaskData?(
      <Card>
        <div style={{fontFamily:F.body,fontWeight:800,fontSize:12,color:C.soft,marginBottom:10,textTransform:"uppercase",letterSpacing:.5}}>{"Pr\u00f3xima tarefa"}</div>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14}}>
          <TaskIcon task={nextTaskData} size={48}/>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontFamily:F.display,fontWeight:700,fontSize:17,color:C.text}}>{nextTaskData.name}</div>
            <div style={{fontFamily:F.body,fontSize:12.5,fontWeight:700,color:C.soft}}>{nextTaskData.cat}{nextTask.count>1?` \u00b7 ${nextTask.done||0}/${nextTask.count}`:""}</div>
          </div>
          <div style={{textAlign:"right",display:"flex",flexDirection:"column",gap:3,alignItems:"flex-end"}}>
            <PtsBolt n={`+${nextTaskData.pts}`} size={16}/><Coin n={`+${nextTaskData.coins}`} size={16}/>
          </div>
        </div>
        <Btn3D onClick={()=>{if(navigator.vibrate)navigator.vibrate(8);dispatch({type:"COMPLETE",userId:"0",taskId:nextTask.id})}}>Concluir tarefa</Btn3D>
      </Card>
    ):(
      <div style={{background:"linear-gradient(135deg,#E9F8EF,#D2F3DF)",borderRadius:22,padding:20,textAlign:"center",boxShadow:"0 3px 0 #C0ECCF"}}>
        <Icon name="task_alt" size={40} color={C.green}/>
        <div style={{fontFamily:F.display,fontWeight:800,fontSize:18,color:"#1B8F52",marginTop:4}}>{"Tudo conclu\u00eddo! \uD83C\uDF89"}</div>
        <div style={{fontFamily:F.body,fontWeight:700,fontSize:13,color:"#4FA877",marginTop:2}}>{"Voc\u00ea zerou suas tarefas da semana."}</div>
      </div>
    ))}
    <div style={{background:"linear-gradient(135deg,#FFF3D6,#FFE6A8)",borderRadius:22,padding:"14px 16px",display:"flex",alignItems:"center",gap:13,boxShadow:"0 3px 0 #F2D27E",position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",top:0,bottom:0,width:40,background:"linear-gradient(90deg,transparent,rgba(255,255,255,.7),transparent)",animation:"shine 2.8s infinite"}}/>
      <div style={{width:46,height:46,borderRadius:14,background:"#fff",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 3px 0 #F2D27E",zIndex:1}}><Icon name={lastAch?lastAch.icon:"local_fire_department"} size={26} color={C.gold}/></div>
      <div style={{flex:1,zIndex:1,lineHeight:1.25}}>
        <div style={{fontFamily:F.body,fontSize:11,fontWeight:800,color:"#B7892A",letterSpacing:.5}}>{lastAch?"CONQUISTA DESBLOQUEADA":"SUA META"}</div>
        <div style={{fontFamily:F.display,fontWeight:700,fontSize:16,color:"#7A5A12"}}>
          {lastAch?lastAch.label:u0.streak>0?`Sequ\u00eancia de ${u0.streak} dia${u0.streak>1?"s":""}!`:"Conclua sua 1\u00aa tarefa hoje"}
        </div>
      </div>
    </div>
  </div>
}

function SettingsScreen({state,dispatch,onClose}){
  const[house,setHouse]=useState(state.house.name),[name0,setName0]=useState(state.users[0].name),[name1,setName1]=useState(state.users[1].name)
  const[taskSheet,setTaskSheet]=useState(null),[rewardSheet,setRewardSheet]=useState(null),[confirmDel,setConfirmDel]=useState(null),[resetModal,setResetModal]=useState(null)
  const saveNames=()=>dispatch({type:"UPDATE_SETTINGS",house:house.trim()||state.house.name,name0:name0.trim()||state.users[0].name,name1:name1.trim()||state.users[1].name})
  return<div style={{position:"fixed",inset:0,background:C.bg,zIndex:900,overflowY:"auto",maxWidth:430,margin:"0 auto"}}>
    <div style={{padding:"calc(env(safe-area-inset-top,20px) + 14px) 16px 100px",display:"flex",flexDirection:"column",gap:16}}>
      <div style={{display:"flex",alignItems:"center",gap:12}}>
        <button onClick={onClose} style={{width:40,height:40,borderRadius:12,background:"#fff",border:"none",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 2px 0 rgba(33,27,51,.06)",cursor:"pointer"}}><Icon name="arrow_back" size={22} color={C.text}/></button>
        <span style={{fontFamily:F.display,fontWeight:700,fontSize:22,color:C.text}}>{"Configura\u00e7\u00f5es"}</span>
      </div>
      <SectionLabel>A casa</SectionLabel>
      <Card style={{padding:16}}>
        <label style={lbl}>NOME DA CASA</label>
        <input value={house} onChange={e=>setHouse(e.target.value)} style={inp}/>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
          <div><label style={lbl}>{"VOC\u00ca"}</label>
            <div style={{display:"flex",gap:8,alignItems:"center"}}>
              <div style={{width:36,height:36,borderRadius:11,background:ME_GRAD,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><span style={{fontFamily:F.display,fontWeight:800,fontSize:16,color:"#fff"}}>{ini(name0)}</span></div>
              <input value={name0} onChange={e=>setName0(e.target.value)} style={{...inp,marginBottom:0,flex:1}}/>
            </div>
          </div>
          <div><label style={lbl}>SEU PAR</label>
            <div style={{display:"flex",gap:8,alignItems:"center"}}>
              <div style={{width:36,height:36,borderRadius:11,background:PAIR_GRAD,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><span style={{fontFamily:F.display,fontWeight:800,fontSize:16,color:"#fff"}}>{ini(name1)}</span></div>
              <input value={name1} onChange={e=>setName1(e.target.value)} style={{...inp,marginBottom:0,flex:1}}/>
            </div>
          </div>
        </div>
        <Btn3D onClick={saveNames} small>Salvar nomes</Btn3D>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:12}}>
          <button onClick={()=>setResetModal("week")} style={{background:"#FFF1E6",border:"none",borderRadius:14,padding:"12px 0",fontFamily:F.display,fontWeight:800,fontSize:13,color:C.fire,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:5}}>
            <Icon name="calendar_today" size={16} color={C.fire}/>Resetar semana
          </button>
          <button onClick={()=>setResetModal("all")} style={{background:"#FFF0F0",border:"none",borderRadius:14,padding:"12px 0",fontFamily:F.display,fontWeight:800,fontSize:13,color:"#D93434",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:5}}>
            <Icon name="delete_forever" size={16} color="#D93434"/>Apagar tudo
          </button>
        </div>
      </Card>
      <SectionLabel>Biblioteca de tarefas</SectionLabel>
      <div style={{...C.card,padding:"4px 14px"}}>
        {state.library.map((task,i)=>(
          <div key={task.id} style={{display:"flex",alignItems:"center",gap:10,padding:"11px 0",borderBottom:i<state.library.length-1?"1px solid #F2EEFA":"none"}}>
            <TaskIcon task={task} size={38}/>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontFamily:F.display,fontWeight:700,fontSize:14,color:C.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{task.name}</div>
              <div style={{fontFamily:F.body,fontSize:11,fontWeight:700,color:C.soft}}>{task.cat} {"\u00b7"} {task.pts}pts{(task.minCount||0)>0?` \u00b7 m\u00edn ${task.minCount}\u00d7`:""}</div>
            </div>
            <button onClick={()=>setTaskSheet(task)} style={{width:32,height:32,borderRadius:10,background:"#F0ECFF",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><Icon name="edit" size={16} color={C.violet}/></button>
            <button onClick={()=>setConfirmDel({type:"task",id:task.id})} style={{width:32,height:32,borderRadius:10,background:"#FFF0F0",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><Icon name="delete" size={16} color="#D93434"/></button>
          </div>
        ))}
      </div>
      <button onClick={()=>setTaskSheet("new")} style={{background:"#fff",border:`2px dashed ${C.violet}`,borderRadius:16,padding:"13px 0",fontFamily:F.display,fontWeight:800,fontSize:15,color:C.violet,cursor:"pointer",width:"100%",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
        <Icon name="add" size={20} color={C.violet}/>Adicionar tarefa
      </button>
      <SectionLabel>Recompensas do Market</SectionLabel>
      <div style={{...C.card,padding:"4px 14px"}}>
        {state.market.map((r,i)=>{
          const th=TH[r.th]||TH.violet
          return<div key={r.id} style={{display:"flex",alignItems:"center",gap:10,padding:"11px 0",borderBottom:i<state.market.length-1?"1px solid #F2EEFA":"none"}}>
            <div style={{width:38,height:38,borderRadius:12,background:th.bg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,boxShadow:`0 2px 0 ${th.sd}`}}><Icon name={r.icon||"card_giftcard"} size={20} color={th.fg}/></div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontFamily:F.display,fontWeight:700,fontSize:14,color:C.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.name}</div>
              <Coin n={r.cost} size={12}/>
            </div>
            <button onClick={()=>setRewardSheet(r)} style={{width:32,height:32,borderRadius:10,background:"#F0ECFF",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><Icon name="edit" size={16} color={C.violet}/></button>
            <button onClick={()=>setConfirmDel({type:"reward",id:r.id})} style={{width:32,height:32,borderRadius:10,background:"#FFF0F0",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><Icon name="delete" size={16} color="#D93434"/></button>
          </div>
        })}
      </div>
      <button onClick={()=>setRewardSheet("new")} style={{background:"#fff",border:`2px dashed ${C.violet}`,borderRadius:16,padding:"13px 0",fontFamily:F.display,fontWeight:800,fontSize:15,color:C.violet,cursor:"pointer",width:"100%",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
        <Icon name="add" size={20} color={C.violet}/>Adicionar recompensa
      </button>
    </div>
    {taskSheet&&<BottomSheet title={taskSheet==="new"?"Nova tarefa":"Editar tarefa"} onClose={()=>setTaskSheet(null)}>
      <TaskForm initial={taskSheet==="new"?{}:taskSheet} onSave={data=>{dispatch(taskSheet==="new"?{type:"ADD_TASK",task:{...data,id:genId()}}:{type:"EDIT_TASK",taskId:taskSheet.id,updates:data});setTaskSheet(null)}}/>
    </BottomSheet>}
    {rewardSheet&&<BottomSheet title={rewardSheet==="new"?"Nova recompensa":"Editar recompensa"} onClose={()=>setRewardSheet(null)}>
      <RewardForm initial={rewardSheet==="new"?{}:rewardSheet} onSave={data=>{dispatch(rewardSheet==="new"?{type:"ADD_REWARD",reward:{...data,id:genId()}}:{type:"EDIT_REWARD",rewardId:rewardSheet.id,updates:data});setRewardSheet(null)}}/>
    </BottomSheet>}
    {confirmDel&&<ConfirmSheet title={confirmDel.type==="task"?"Excluir tarefa?":"Excluir recompensa?"} msg={"Essa a\u00e7\u00e3o n\u00e3o pode ser desfeita."} confirmLabel="Excluir" danger
      onConfirm={()=>{dispatch(confirmDel.type==="task"?{type:"DELETE_TASK",taskId:confirmDel.id}:{type:"DELETE_REWARD",rewardId:confirmDel.id});setConfirmDel(null)}}
      onCancel={()=>setConfirmDel(null)}/>}
    {resetModal==="week"&&<ConfirmWordModal word="SEMANA" title="Resetar a semana?" desc={"O draft e os progressos desta semana ser\u00e3o apagados. Hist\u00f3rico e pontos ficam intactos."} danger
      onConfirm={()=>{dispatch({type:"RESET_WEEK"});setResetModal(null)}} onCancel={()=>setResetModal(null)}/>}
    {resetModal==="all"&&<ConfirmWordModal word="APAGAR" title="Apagar tudo?" desc={"Todos os dados ser\u00e3o perdidos permanentemente: pontos, hist\u00f3rico, moedas e configura\u00e7\u00f5es."} danger
      onConfirm={()=>{dispatch({type:"RESET"});setResetModal(null);onClose()}} onCancel={()=>setResetModal(null)}/>}
  </div>
}

function DraftScreen({state,dispatch}){
  const[showU,setShowU]=useState(0),[confirmUnassign,setConfirmUnassign]=useState(null),[confirmSteal,setConfirmSteal]=useState(null)
  const lib=state.library,a0=state.draft.assigns?.["0"]||[],a1=state.draft.assigns?.["1"]||[]
  const draftLocked=state.draft.confirmed&&state.draft.week_id===sundayWeekId()
  const stealsUsed=state.draft.steals_used||0,myCoins=state.stats["0"].coins
  const pts0=a0.reduce((a,x)=>a+x.count*(lib.find(t=>t.id===x.id)?.pts||0),0)
  const pts1=a1.reduce((a,x)=>a+x.count*(lib.find(t=>t.id===x.id)?.pts||0),0)
  const cnt0=a0.reduce((a,x)=>a+x.count,0),cnt1=a1.reduce((a,x)=>a+x.count,0)
  const ptsMax=Math.max(pts0,pts1,1),balanced=Math.abs(pts0-pts1)<=40
  const missingReq=lib.filter(t=>(t.minCount||0)>0).filter(task=>{
    const t0=a0.find(a=>a.id===task.id)?.count||0,t1=a1.find(a=>a.id===task.id)?.count||0
    return t0+t1<task.minCount
  })
  const canConfirm=!draftLocked&&missingReq.length===0&&(cnt0+cnt1>0)
  const setCount=(u,id,n)=>dispatch({type:"DRAFT_SET",userId:String(u),taskId:id,count:Math.max((u===0?a0:a1).find(a=>a.id===id)?.done||0,n)})
  const currentAssigns=showU===0?a0:a1
  return<div style={{padding:"calc(env(safe-area-inset-top,20px) + 18px) 16px 140px",display:"flex",flexDirection:"column",gap:14}}>
    <div>
      <div style={{display:"flex",alignItems:"center",gap:8}}><Icon name="swap_horiz" size={26} color={C.violet}/><span style={{fontFamily:F.display,fontWeight:700,fontSize:25,color:C.text}}>Draft Semanal</span></div>
      <div style={{fontFamily:F.body,fontSize:13,fontWeight:700,color:C.soft,marginTop:2}}>{"Escolha quais tarefas assumir nesta semana."}</div>
    </div>
    {draftLocked&&<div style={{background:"linear-gradient(135deg,#FFF3D6,#FFE6A8)",borderRadius:18,padding:"14px 16px",boxShadow:"0 3px 0 #F2D27E"}}>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}><Icon name="lock" size={20} color="#B7892A"/><span style={{fontFamily:F.display,fontWeight:800,fontSize:16,color:"#7A5A12"}}>Draft confirmado {"\u2713"}</span></div>
      <div style={{fontFamily:F.body,fontSize:12.5,fontWeight:700,color:"#B7892A",display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:4}}>
        <span>Libera: {nextSundayStr()}</span>
        <span style={{color:stealsUsed>=2?"#D93434":C.fire}}>Roubos: {stealsUsed}/2 esta semana</span>
      </div>
    </div>}
    {!draftLocked&&<Card>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <span style={{fontFamily:F.display,fontWeight:700,fontSize:15,color:C.text}}>Carga prevista</span>
        <div style={{display:"flex",alignItems:"center",gap:4,background:balanced?"#E6F8EF":"#FFF1E6",borderRadius:999,padding:"4px 9px"}}><Icon name="balance" size={14} color={balanced?C.green:C.fire}/><span style={{fontFamily:F.body,fontWeight:800,fontSize:12,color:balanced?C.green:C.fire}}>{balanced?"Equilibrado":"Desequilibrado"}</span></div>
      </div>
      {[{name:state.users[0].name,pts:pts0,grad:ME_GRAD,txt:"#2E7BF0"},{name:state.users[1].name,pts:pts1,grad:PAIR_GRAD,txt:"#FF4F9A"}].map((r,idx)=>(
        <div key={idx} style={{display:"flex",alignItems:"center",gap:8,marginBottom:idx===0?7:0}}>
          <div style={{width:26,height:26,borderRadius:8,background:r.grad,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontFamily:F.display,fontWeight:800,fontSize:13,color:"#fff"}}>{ini(r.name)}</span></div>
          <div style={{flex:1,height:14,borderRadius:999,background:"#EEEAF6",overflow:"hidden"}}><div style={{height:"100%",width:`${Math.round(r.pts/ptsMax*100)}%`,background:r.grad,transition:"width .3s"}}/></div>
          <div style={{fontFamily:F.display,fontWeight:800,fontSize:14,color:r.txt,width:64,textAlign:"right"}}>{r.pts} pts</div>
        </div>
      ))}
      {missingReq.length>0&&<div style={{marginTop:12,padding:"8px 12px",background:"#FFF1E6",borderRadius:12}}>
        <div style={{fontFamily:F.body,fontWeight:800,fontSize:12,color:C.fire,marginBottom:4}}>{"Faltam m\u00ednimos obrigat\u00f3rios:"}</div>
        {missingReq.map(t=><div key={t.id} style={{fontFamily:F.body,fontSize:12,color:C.fire}}>{"\u2022"} {t.name} (m{"\u00ed"}n {t.minCount}{"\u00d7"})</div>)}
      </div>}
    </Card>}
    <div style={{display:"flex",background:"#E7E2F3",borderRadius:14,padding:4,gap:4}}>
      {[0,1].map(u=>(
        <button key={u} onClick={()=>setShowU(u)} style={{flex:1,border:"none",borderRadius:11,padding:"9px 0",cursor:"pointer",background:showU===u?"#fff":"transparent",color:showU===u?C.violet:C.soft,fontFamily:F.body,fontWeight:800,fontSize:13.5,boxShadow:showU===u?"0 2px 0 rgba(33,27,51,.05)":"none",transition:"all .2s"}}>
          {state.users[u].name} {"\u00b7"} {u===0?cnt0:cnt1}
        </button>
      ))}
    </div>
    <div style={{...C.card,padding:"4px 14px"}}>
      {currentAssigns.length===0&&<div style={{padding:"20px 0",textAlign:"center",fontFamily:F.body,fontWeight:700,fontSize:14,color:C.soft}}>Nenhuma tarefa assumida</div>}
      {currentAssigns.map((assign,i)=>{
        const task=lib.find(t=>t.id===assign.id);if(!task)return null
        const remaining=assign.count-(assign.done||0),isMe=showU===0,cost=task.coins*remaining
        return<div key={`${assign.id}-${assign.stolen?"s":"n"}`} style={{display:"flex",alignItems:"center",gap:11,padding:"13px 0",borderBottom:i<currentAssigns.length-1?"1px solid #F2EEFA":"none"}}>
          <TaskIcon task={task}/>
          <div style={{flex:1,minWidth:0}}>
            <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
              <span style={{fontFamily:F.display,fontWeight:700,fontSize:15,color:C.text}}>{task.name}</span>
              {assign.stolen&&<span style={{background:"linear-gradient(135deg,#FF7A1A,#FFB323)",color:"#fff",borderRadius:6,padding:"2px 7px",fontFamily:F.body,fontWeight:800,fontSize:10,flexShrink:0}}>ROUBADA</span>}
            </div>
            <div style={{display:"flex",alignItems:"center",gap:6,marginTop:2}}>
              <TaskMeta task={task}/>
              {assign.count>1&&<span style={{fontFamily:F.body,fontSize:11,fontWeight:800,color:C.soft}}>{"\u00b7"} {assign.done||0}/{assign.count}{"\u00d7"}</span>}
              {assign.stolen&&<span style={{fontFamily:F.body,fontSize:11,fontWeight:800,color:C.fire}}>{"\u00b7"} 2,5{"\u00d7"} ao concluir</span>}
            </div>
          </div>
          {!draftLocked&&!assign.stolen&&(
            <div style={{display:"flex",alignItems:"center",background:C.violet,borderRadius:12,boxShadow:`0 3px 0 ${C.violetSd}`,flexShrink:0}}>
              <button onClick={()=>setCount(showU,task.id,assign.count-1)} style={{width:30,height:32,background:"none",border:"none",cursor:"pointer",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center"}}><Icon name="remove" size={18}/></button>
              <span style={{fontFamily:F.display,fontWeight:800,fontSize:15,color:"#fff",minWidth:26,textAlign:"center"}}>{assign.count}{"\u00d7"}</span>
              <button onClick={()=>setCount(showU,task.id,assign.count+1)} style={{width:30,height:32,background:"none",border:"none",cursor:"pointer",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center"}}><Icon name="add" size={18}/></button>
            </div>
          )}
          {draftLocked&&isMe&&!assign.stolen&&remaining>0&&(
            <button onClick={()=>setConfirmUnassign({task,assign,cost})} style={{background:"#FFF1E6",border:"none",borderRadius:12,padding:"7px 10px",cursor:"pointer",flexShrink:0,textAlign:"center"}}>
              <div style={{fontFamily:F.body,fontWeight:800,fontSize:11.5,color:C.fire}}>Desatribuir</div>
              <div style={{fontFamily:F.body,fontWeight:800,fontSize:11,color:C.fire,display:"flex",alignItems:"center",gap:2,justifyContent:"center",marginTop:1}}><Icon name="paid" size={12} color={C.fire}/>{cost}</div>
            </button>
          )}
          {draftLocked&&!isMe&&remaining>0&&(stealsUsed<2
            ?<button onClick={()=>setConfirmSteal({task,assign})} style={{background:"linear-gradient(135deg,#FF7A1A,#FFB323)",border:"none",borderRadius:12,padding:"7px 10px",cursor:"pointer",flexShrink:0,boxShadow:"0 3px 0 #E0900A",textAlign:"center"}}>
                <div style={{fontFamily:F.body,fontWeight:800,fontSize:11.5,color:"#fff"}}>Roubar</div>
                <div style={{fontFamily:F.body,fontWeight:800,fontSize:11,color:"rgba(255,255,255,.9)",display:"flex",alignItems:"center",gap:2,justifyContent:"center",marginTop:1}}><Icon name="paid" size={12} color="#fff"/>{task.coins}</div>
              </button>
            :<div style={{background:"#F8F7FB",borderRadius:12,padding:"7px 10px",flexShrink:0,textAlign:"center"}}><div style={{fontFamily:F.body,fontWeight:800,fontSize:11,color:C.softer,lineHeight:1.3}}>Limite<br/>atingido</div></div>
          )}
        </div>
      })}
    </div>
    {!draftLocked&&<>
      <SectionLabel>Adicionar tarefa</SectionLabel>
      <div style={{...C.card,padding:"4px 14px",marginTop:-4}}>
        {lib.filter(t=>!(showU===0?a0:a1).find(a=>a.id===t.id&&!a.stolen)).map((task,i,arr)=>(
          <div key={task.id} style={{display:"flex",alignItems:"center",gap:11,padding:"13px 0",borderBottom:i<arr.length-1?"1px solid #F2EEFA":"none"}}>
            <TaskIcon task={task}/>
            <div style={{flex:1,minWidth:0}}><div style={{fontFamily:F.display,fontWeight:700,fontSize:15,color:C.text}}>{task.name}</div><TaskMeta task={task}/></div>
            <button onClick={()=>setCount(showU,task.id,1)} style={{background:"none",color:C.violet,border:`2px solid ${C.violet}`,borderRadius:12,padding:"7px 12px",fontFamily:F.display,fontWeight:800,fontSize:13,cursor:"pointer",whiteSpace:"nowrap",flexShrink:0}}>+ Assumir</button>
          </div>
        ))}
      </div>
    </>}
    {!draftLocked&&<div style={{position:"fixed",bottom:0,left:0,right:0,maxWidth:430,margin:"0 auto",background:"#fff",borderTop:"1px solid #EFEBF8",padding:"12px 16px 28px",display:"flex",alignItems:"center",gap:10,zIndex:10}}>
      <div style={{flex:1,lineHeight:1.2}}>
        <div style={{fontFamily:F.display,fontWeight:800,fontSize:16,color:C.text}}>{cnt0+cnt1} tarefas assumidas</div>
        {missingReq.length>0&&<div style={{fontFamily:F.body,fontWeight:700,fontSize:12,color:C.fire}}>Faltam {missingReq.length} obrigat{"\u00f3"}ria{missingReq.length!==1?"s":""}</div>}
      </div>
      <Btn3D onClick={()=>dispatch({type:"DRAFT_CONFIRM"})} disabled={!canConfirm} style={{width:"auto",padding:"13px 18px",fontSize:15}}>Confirmar</Btn3D>
    </div>}
    {confirmUnassign&&<ConfirmSheet
      title={`Desatribuir "${confirmUnassign.task.name}"?`}
      msg={`Voc\u00ea tem ${myCoins} moedas. Vai custar ${confirmUnassign.cost} moedas para remover as ${confirmUnassign.assign.count-(confirmUnassign.assign.done||0)} execu\u00e7\u00f5es restantes.`}
      confirmLabel={`Desatribuir \u00b7 ${confirmUnassign.cost} \uD83E\uDE99`}
      onConfirm={()=>{dispatch({type:"UNASSIGN_TASK",userId:"0",taskId:confirmUnassign.task.id});setConfirmUnassign(null)}}
      onCancel={()=>setConfirmUnassign(null)} danger/>}
    {confirmSteal&&<ConfirmSheet
      title={`Roubar "${confirmSteal.task.name}"?`}
      msg={`Custa ${confirmSteal.task.coins} moedas agora (voc\u00ea tem ${myCoins}). Ao concluir, ganha ${Math.round(confirmSteal.task.coins*2.5)} moedas \u2014 lucro de ${Math.round(confirmSteal.task.coins*1.5)}!`}
      confirmLabel={`Roubar \u00b7 ${confirmSteal.task.coins} \uD83E\uDE99`}
      onConfirm={()=>{dispatch({type:"STEAL_TASK",userId:"0",partnerId:"1",taskId:confirmSteal.task.id});setConfirmSteal(null)}}
      onCancel={()=>setConfirmSteal(null)}/>}
  </div>
}

function TasksScreen({state,dispatch}){
  const lib=state.library,myAssigns=state.draft.assigns?.["0"]||[]
  const total=myAssigns.reduce((a,x)=>a+x.count,0),done=myAssigns.reduce((a,x)=>a+(x.done||0),0)
  const allDone=total>0&&done>=total,bonusGiven=state.draft.bonus_given
  const history=(state.history||[]).filter(h=>h.userId==="0").slice().reverse()
  const monthsArr=["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"]
  const mName=monthsArr[new Date().getMonth()]
  return<div style={{padding:"calc(env(safe-area-inset-top,20px) + 18px) 16px 100px",display:"flex",flexDirection:"column",gap:14}}>
    <div>
      <span style={{fontFamily:F.display,fontWeight:700,fontSize:25,color:C.text}}>Minhas Tarefas</span>
      <div style={{fontFamily:F.body,fontSize:13,fontWeight:700,color:C.soft,marginTop:2}}>Ranking de {mName} {"\u00b7"} faltam {daysLeft()} dias</div>
    </div>
    {total>0&&<div style={{background:C.violet,borderRadius:22,padding:16,color:"#fff",boxShadow:`0 4px 0 ${C.violetSd},0 10px 24px rgba(123,91,255,.25)`,position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",top:-30,right:-20,width:120,height:120,borderRadius:"50%",background:"rgba(255,255,255,.1)"}}/>
      <div style={{display:"flex",alignItems:"flex-end",justifyContent:"space-between",position:"relative"}}>
        <div>
          <div style={{fontFamily:F.body,fontSize:12.5,fontWeight:800,opacity:.85}}>Progresso da semana</div>
          <div style={{fontFamily:F.display,fontWeight:800,fontSize:30,lineHeight:1.1}}>{done}<span style={{fontSize:18,opacity:.75}}> / {total}</span></div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:6,background:"rgba(0,0,0,.18)",borderRadius:999,padding:"6px 11px"}}>
          {allDone&&bonusGiven?<><Icon name="check_circle" size={18} color="#5BE39A"/><span style={{fontFamily:F.display,fontWeight:800,fontSize:14}}>+50 ganho!</span></>:<><Icon name="paid" size={18} color={C.gold}/><span style={{fontFamily:F.display,fontWeight:800,fontSize:14}}>+50 ao zerar</span></>}
        </div>
      </div>
      <div style={{marginTop:12,height:12,borderRadius:999,background:"rgba(0,0,0,.2)",overflow:"hidden"}}>
        <div style={{height:"100%",width:`${total>0?done/total*100:0}%`,background:"linear-gradient(90deg,#FFD45C,#FFB323)",borderRadius:999,transition:"width .4s"}}/>
      </div>
    </div>}
    {myAssigns.length===0
      ?<div style={{...C.card,padding:"28px 20px",textAlign:"center"}}>
        <Icon name="inbox" size={40} color="#C9C3D6"/>
        <div style={{fontFamily:F.display,fontWeight:800,fontSize:17,color:C.text,marginTop:6}}>Nenhuma tarefa assumida</div>
        <div style={{fontFamily:F.body,fontWeight:700,fontSize:13,color:C.soft,marginTop:2}}>{"V\u00e1 ao "}<span style={{color:C.violet}}>Draft</span>{" e escolha suas tarefas."}</div>
      </div>
      :<div style={{...C.card,padding:"4px 14px"}}>
        {myAssigns.map((assign,i)=>{
          const task=lib.find(t=>t.id===assign.id);if(!task)return null
          const tDone=assign.done||0,tTotal=assign.count,isOk=tDone>=tTotal
          return<div key={`${assign.id}-${assign.stolen?"s":"n"}`} style={{display:"flex",alignItems:"center",gap:11,padding:"13px 0",borderBottom:i<myAssigns.length-1?"1px solid #F2EEFA":"none"}}>
            <TaskIcon task={task}/>
            <div style={{flex:1,minWidth:0}}>
              <div style={{display:"flex",alignItems:"center",gap:6}}>
                <span style={{fontFamily:F.display,fontWeight:700,fontSize:15,color:isOk?C.soft:C.text,textDecoration:isOk?"line-through":"none"}}>{task.name}</span>
                {assign.stolen&&<span style={{background:"linear-gradient(135deg,#FF7A1A,#FFB323)",color:"#fff",borderRadius:6,padding:"2px 7px",fontFamily:F.body,fontWeight:800,fontSize:10,flexShrink:0}}>2,5{"\u00d7"}</span>}
              </div>
              {tTotal>1
                ?<div style={{display:"flex",alignItems:"center",gap:6,marginTop:4}}>
                  <div style={{flex:1,maxWidth:100,height:7,borderRadius:999,background:"#EEEAF6",overflow:"hidden"}}><div style={{height:"100%",width:`${tDone/tTotal*100}%`,background:isOk?C.green:C.violet,borderRadius:999}}/></div>
                  <span style={{fontFamily:F.body,fontSize:11.5,fontWeight:800,color:C.soft}}>{tDone}/{tTotal}</span>
                </div>
                :<div style={{fontFamily:F.body,fontSize:11.5,fontWeight:800,color:isOk?C.green:C.soft}}>{isOk?"Conclu\u00edda \u2713":assign.stolen?`+${Math.round(task.coins*2.5)} \uD83E\uDE99 ao concluir`:`+${task.coins} moedas`}</div>}
            </div>
            <div style={{display:"flex",gap:6,flexShrink:0}}>
              {tDone>0&&<button onClick={()=>dispatch({type:"UNDO_COMPLETE",userId:"0",taskId:assign.id,stolen:assign.stolen})} style={{width:36,height:36,borderRadius:"50%",border:"none",cursor:"pointer",background:"#F0ECFF",display:"flex",alignItems:"center",justifyContent:"center"}}><Icon name="remove" size={18} color={C.violet}/></button>}
              <button onClick={()=>{if(!isOk){if(navigator.vibrate)navigator.vibrate(8);dispatch({type:"COMPLETE",userId:"0",taskId:assign.id})}}} disabled={isOk}
                style={{width:38,height:38,borderRadius:"50%",border:"none",cursor:isOk?"default":"pointer",background:isOk?C.green:C.violet,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:isOk?"0 3px 0 #1FA85B":`0 3px 0 ${C.violetSd}`}}>
                <Icon name={isOk?"check":"add"} size={22} color="#fff"/>
              </button>
            </div>
          </div>
        })}
      </div>}
    {history.length>0&&<>
      <div style={{fontFamily:F.body,fontWeight:800,fontSize:12,color:C.soft,letterSpacing:.5,textTransform:"uppercase",margin:"0 4px"}}>{"Hist\u00f3rico completo"}</div>
      <div style={{...C.card,padding:"4px 14px"}}>
        {history.map((h,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"11px 0",borderBottom:i<history.length-1?"1px solid #F2EEFA":"none"}}>
            <Icon name="check_circle" size={20} color={C.green}/>
            <div style={{flex:1,minWidth:0,fontFamily:F.body,fontWeight:700,fontSize:13.5,color:C.text,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{h.taskName}{h.stolen?" \uD83D\uDD25":""}</div>
            <span style={{fontFamily:F.body,fontSize:12,fontWeight:700,color:C.softer,flexShrink:0}}>{h.date}</span>
            <span style={{fontFamily:F.display,fontWeight:800,fontSize:13,color:C.violet,flexShrink:0}}>+{h.pts}</span>
          </div>
        ))}
      </div>
    </>}
  </div>
}

function MarketScreen({state,dispatch,showToast}){
  const mkt=state.market,coins=state.stats["0"].coins
  const nextReward=mkt.filter(r=>coins<r.cost).sort((a,b)=>a.cost-b.cost)[0]
  const featPct=nextReward?Math.min(100,Math.round(coins/nextReward.cost*100)):100
  const[confirmItem,setConfirmItem]=useState(null)
  const handleConfirm=()=>{
    if(!confirmItem||coins<confirmItem.cost)return
    if(navigator.vibrate)navigator.vibrate(12)
    const rId=genId()
    dispatch({type:"REDEEM",userId:"0",rewardId:confirmItem.id,redemptionId:rId})
    showToast(`\uD83C\uDF81 ${confirmItem.name} resgatado!`,"Desfazer",()=>dispatch({type:"UNDO_REDEEM",redemptionId:rId,userId:"0",cost:confirmItem.cost}))
    setConfirmItem(null)
  }
  return<div style={{padding:"calc(env(safe-area-inset-top,20px) + 18px) 16px 100px",display:"flex",flexDirection:"column",gap:16}}>
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
      <span style={{fontFamily:F.display,fontWeight:700,fontSize:25,color:C.text}}>Market</span>
      <div style={{display:"flex",alignItems:"center",gap:6,background:"linear-gradient(135deg,#FFD45C,#FFB323)",borderRadius:999,padding:"8px 14px",boxShadow:"0 4px 0 #E0900A"}}>
        <Icon name="paid" size={20} color="#fff"/><span style={{fontFamily:F.display,fontWeight:800,fontSize:18,color:"#fff"}}>{coins}</span>
      </div>
    </div>
    {nextReward&&<div style={{background:"linear-gradient(135deg,#FF7DB5,#FF4F9A)",borderRadius:22,padding:16,color:"#fff",boxShadow:"0 4px 0 #E02E7D",position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",top:-25,right:-15,width:110,height:110,borderRadius:"50%",background:"rgba(255,255,255,.12)"}}/>
      <div style={{fontFamily:F.body,fontSize:11,fontWeight:800,letterSpacing:.5,opacity:.9}}>{"PR\u00d3XIMA RECOMPENSA"}</div>
      <div style={{display:"flex",alignItems:"center",gap:13,marginTop:8,position:"relative"}}>
        <div style={{width:52,height:52,borderRadius:16,background:"rgba(255,255,255,.22)",display:"flex",alignItems:"center",justifyContent:"center"}}><Icon name={nextReward.icon} size={30} color="#fff"/></div>
        <div style={{flex:1}}>
          <div style={{fontFamily:F.display,fontWeight:700,fontSize:19}}>{nextReward.name}</div>
          <div style={{fontFamily:F.body,fontSize:12.5,fontWeight:700,opacity:.9}}>Faltam {nextReward.cost-coins} moedas</div>
        </div>
      </div>
      <div style={{marginTop:12,height:10,borderRadius:999,background:"rgba(0,0,0,.18)",overflow:"hidden"}}><div style={{height:"100%",width:`${featPct}%`,background:"#fff",borderRadius:999,transition:"width .4s"}}/></div>
      <div style={{display:"flex",justifyContent:"space-between",marginTop:6,fontFamily:F.body,fontSize:12,fontWeight:800}}><span>{coins} / {nextReward.cost}</span><span style={{opacity:.9}}>{featPct}%</span></div>
    </div>}
    {TIER_LIST.map(tier=>{
      const items=mkt.filter(r=>r.tier===tier);if(!items.length)return null
      return<div key={tier}>
        <SectionLabel>{TIER_LBL[tier]}</SectionLabel>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          {items.map(r=>{
            const th=TH[r.th]||TH.violet,can=coins>=r.cost
            return<div key={r.id} style={{...C.card,padding:14,textAlign:"center"}}>
              <div style={{width:48,height:48,borderRadius:15,background:can?th.bg:"#F1EFF6",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 8px",boxShadow:can?`0 3px 0 ${th.sd}`:"none"}}><Icon name={r.icon} size={26} color={can?th.fg:"#A39DB4"}/></div>
              <div style={{fontFamily:F.display,fontWeight:700,fontSize:14.5,color:C.text,marginBottom:8,lineHeight:1.2,minHeight:35,display:"flex",alignItems:"center",justifyContent:"center"}}>{r.name}</div>
              {can
                ?<button onClick={()=>setConfirmItem(r)} style={{width:"100%",background:C.violet,color:"#fff",border:"none",borderRadius:12,padding:9,fontFamily:F.display,fontWeight:800,fontSize:13.5,boxShadow:`0 3px 0 ${C.violetSd}`,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:4}}><Icon name="paid" size={15} color={C.gold}/>{r.cost}</button>
                :<div style={{background:"#EEEAF6",color:"#A39DB4",borderRadius:12,padding:9,fontFamily:F.display,fontWeight:800,fontSize:13.5,display:"flex",alignItems:"center",justifyContent:"center",gap:4}}><Icon name="lock" size={15}/>{r.cost}</div>}
            </div>
          })}
        </div>
      </div>
    })}
    {confirmItem&&<ConfirmSheet title={`Resgatar "${confirmItem.name}"?`} msg={`Vai custar ${confirmItem.cost} moedas. Voc\u00ea tem ${coins}.`} confirmLabel={`Resgatar \u00b7 ${confirmItem.cost} \uD83E\uDE99`} onConfirm={handleConfirm} onCancel={()=>setConfirmItem(null)}/>}
  </div>
}

function ProfileScreen({state,dispatch}){
  const[activeTab,setActiveTab]=useState("perfil")
  const uid=String(state.viewUser),user=state.users[state.viewUser],stats=state.stats[uid]
  const unlocked=state.unlocked?.[uid]||[],isMe=state.viewUser===0,pairIdx=isMe?1:0
  const grad=isMe?ME_GRAD:PAIR_GRAD,sd=isMe?ME_SD:PAIR_SD
  const assigns=state.draft.assigns?.[uid]||[]
  const tot=assigns.reduce((a,x)=>a+x.count,0),don=assigns.reduce((a,x)=>a+(x.done||0),0)
  const commitment=tot>0?Math.round(don/tot*100):100
  const partnerStats=state.stats[String(pairIdx)]
  const hallPos=stats.hall_points>=partnerStats.hall_points?"1\u00ba":"2\u00ba"
  const myRedemptions=(state.redemptions||[]).filter(r=>r.userId===uid).slice().reverse()
  return<div style={{padding:"calc(env(safe-area-inset-top,20px) + 18px) 16px 100px",display:"flex",flexDirection:"column",gap:14}}>
    <Card style={{display:"flex",alignItems:"center",gap:14,padding:18}}>
      <div style={{width:66,height:66,borderRadius:20,background:grad,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 4px 0 ${sd}`,flexShrink:0}}><span style={{fontFamily:F.display,fontWeight:800,fontSize:30,color:"#fff"}}>{ini(user.name)}</span></div>
      <div style={{flex:1,minWidth:0,lineHeight:1.2}}>
        <div style={{fontFamily:F.display,fontWeight:700,fontSize:21,color:C.text}}>{user.name}</div>
        <div style={{display:"inline-flex",alignItems:"center",gap:4,background:"#F0ECFF",color:C.violet,borderRadius:999,padding:"3px 9px",fontFamily:F.body,fontSize:11.5,fontWeight:800,marginTop:3}}><Icon name="military_tech" size={14}/>{getTitle(stats.tasks_done)}</div>
      </div>
      <div style={{width:62,height:62,borderRadius:"50%",background:`conic-gradient(${C.green} ${commitment}%, #ECE7F5 0)`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
        <div style={{width:48,height:48,borderRadius:"50%",background:"#fff",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",lineHeight:1}}>
          <span style={{fontFamily:F.display,fontWeight:800,fontSize:15,color:C.green}}>{commitment}%</span>
          <span style={{fontSize:7.5,fontFamily:F.body,fontWeight:800,color:C.soft}}>COMPROM.</span>
        </div>
      </div>
    </Card>
    <div style={{display:"flex",background:"#E7E2F3",borderRadius:14,padding:4,gap:4}}>
      {[["perfil","Perfil"],["resgates","Resgates"]].map(([id,label])=>(
        <button key={id} onClick={()=>setActiveTab(id)} style={{flex:1,border:"none",borderRadius:11,padding:"9px 0",cursor:"pointer",background:activeTab===id?"#fff":"transparent",color:activeTab===id?C.violet:C.soft,fontFamily:F.body,fontWeight:800,fontSize:13.5,boxShadow:activeTab===id?"0 2px 0 rgba(33,27,51,.05)":"none",transition:"all .2s"}}>{label}</button>
      ))}
    </div>
    {activeTab==="perfil"&&<>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        {[{label:"Tarefas",value:stats.tasks_done,icon:"task_alt",color:C.green},
          {label:"Moedas",value:stats.coins,icon:"paid",color:C.gold},
          {label:"Melhor sequ\u00eancia",value:`${stats.best_streak}d`,icon:"local_fire_department",color:C.fire},
          {label:"Pontos totais",value:stats.hall_points,icon:"bolt",color:C.violet}].map(({label,value,icon,color})=>(
          <div key={label} style={{...C.card,padding:14,display:"flex",alignItems:"center",gap:11}}>
            <Icon name={icon} size={28} color={color}/>
            <div style={{minWidth:0}}><div style={{fontFamily:F.display,fontWeight:800,fontSize:20,color:C.text,lineHeight:1}}>{value}</div><div style={{fontFamily:F.body,fontSize:11,fontWeight:700,color:C.soft}}>{label}</div></div>
          </div>
        ))}
      </div>
      <SectionLabel>Conquistas</SectionLabel>
      <div style={{...C.card,padding:16,marginTop:-4}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"14px 12px"}}>
          {ACHS.map(ach=>{
            const got=unlocked.includes(ach.id)
            return<div key={ach.id} style={{textAlign:"center"}}>
              <div style={{width:54,height:54,borderRadius:"50%",background:got?(GRADS[ach.th]||GRADS.violet):"#F1EFF6",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 5px",boxShadow:got?`0 3px 0 ${GRADSD[ach.th]||GRADSD.violet}`:"none"}}><Icon name={got?ach.icon:"lock"} size={got?27:24} color={got?"#fff":"#C2BBD2"}/></div>
              <div style={{fontFamily:F.body,fontSize:10,fontWeight:800,color:got?"#5a5468":C.softer,lineHeight:1.15}}>{ach.label}</div>
            </div>
          })}
        </div>
      </div>
      <div style={{background:"linear-gradient(135deg,#2A1E4D,#3D2C6E)",borderRadius:22,padding:16,color:"#fff",boxShadow:"0 4px 0 #1B1333",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:-20,right:-10,width:90,height:90,borderRadius:"50%",background:"rgba(255,255,255,.06)"}}/>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12,position:"relative"}}><Icon name="workspace_premium" size={22} color={C.gold}/><span style={{fontFamily:F.display,fontWeight:700,fontSize:16}}>Hall da Fama</span><span style={{fontFamily:F.body,fontSize:11,fontWeight:700,color:"rgba(255,255,255,.6)",marginLeft:"auto"}}>{"hist\u00f3rico de sempre"}</span></div>
        <div style={{display:"flex",alignItems:"center",gap:12,position:"relative"}}>
          <div style={{flex:1}}><div style={{fontFamily:F.body,fontSize:11.5,fontWeight:700,color:"rgba(255,255,255,.7)"}}>Pontos acumulados</div><div style={{fontFamily:F.display,fontWeight:800,fontSize:28}}>{stats.hall_points}</div></div>
          <div style={{textAlign:"center",background:"rgba(255,255,255,.1)",borderRadius:16,padding:"10px 16px"}}><div style={{fontFamily:F.display,fontWeight:800,fontSize:22,color:C.gold}}>{hallPos}</div><div style={{fontFamily:F.body,fontSize:10,fontWeight:800,color:"rgba(255,255,255,.7)"}}>na casa</div></div>
        </div>
      </div>
      <button onClick={()=>dispatch({type:"SWITCH_USER"})} style={{background:"#fff",border:"2px solid #E3DDF1",borderRadius:16,padding:14,display:"flex",alignItems:"center",justifyContent:"center",gap:8,fontFamily:F.display,fontWeight:800,fontSize:15,color:C.violet,cursor:"pointer",width:"100%"}}>
        <Icon name="sync_alt" size={20}/>{"Ver perfil de "}{state.users[pairIdx].name}
      </button>
    </>}
    {activeTab==="resgates"&&<>
      {myRedemptions.length===0
        ?<div style={{...C.card,padding:"32px 20px",textAlign:"center"}}>
          <Icon name="card_giftcard" size={40} color="#C9C3D6"/>
          <div style={{fontFamily:F.display,fontWeight:800,fontSize:17,color:C.text,marginTop:8}}>Nenhuma recompensa resgatada</div>
          <div style={{fontFamily:F.body,fontWeight:700,fontSize:13,color:C.soft,marginTop:4}}>Acumule moedas e v\u00e1 ao Market!</div>
        </div>
        :<>
          <div style={{fontFamily:F.body,fontWeight:700,fontSize:13,color:C.soft}}>{myRedemptions.filter(r=>!r.used).length} pendente{myRedemptions.filter(r=>!r.used).length!==1?"s":""} {"\u00b7"} {myRedemptions.filter(r=>r.used).length} utilizada{myRedemptions.filter(r=>r.used).length!==1?"s":""}</div>
          <div style={{...C.card,padding:"4px 14px"}}>
            {myRedemptions.map((red,i)=>{
              const rItem=state.market.find(r=>r.id===red.rewardId),th=TH[rItem?.th||"violet"]||TH.violet
              return<div key={red.id} style={{display:"flex",alignItems:"center",gap:12,padding:"13px 0",borderBottom:i<myRedemptions.length-1?"1px solid #F2EEFA":"none",opacity:red.used?.65:1}}>
                <div style={{width:42,height:42,borderRadius:13,background:th.bg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,boxShadow:`0 2px 0 ${th.sd}`}}><Icon name={rItem?.icon||"card_giftcard"} size={22} color={th.fg}/></div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontFamily:F.display,fontWeight:700,fontSize:14.5,color:C.text,textDecoration:red.used?"line-through":"none"}}>{red.rewardName}</div>
                  <div style={{fontFamily:F.body,fontSize:11.5,fontWeight:700,color:C.soft,display:"flex",alignItems:"center",gap:4}}>{red.date} {"\u00b7"} <Coin n={red.cost} size={12}/></div>
                </div>
                <button onClick={()=>dispatch({type:"MARK_USED",redemptionId:red.id})} style={{flexShrink:0,background:red.used?"#E9F8EF":"#F0ECFF",border:"none",borderRadius:10,padding:"6px 10px",cursor:"pointer",display:"flex",alignItems:"center",gap:4}}>
                  <Icon name={red.used?"check_circle":"radio_button_unchecked"} size={16} color={red.used?C.green:C.softer}/>
                  <span style={{fontFamily:F.body,fontWeight:800,fontSize:11,color:red.used?C.green:C.softer}}>{red.used?"Usada":"Marcar"}</span>
                </button>
              </div>
            })}
          </div>
        </>}
    </>}
  </div>
}

function reduce(prev,action){
  switch(action.type){
    case "INIT":{
      const{house,myName,pairName,assigns}=action,s=blankState()
      s.house.name=house;s.users[0].name=myName;s.users[1].name=pairName
      s.draft.week_id=sundayWeekId();s.draft.confirmed=true
      s.draft.assigns["0"]=Object.entries(assigns).filter(([,n])=>n>0).map(([id,count])=>({id,count,done:0}))
      return s
    }
    case "DRAFT_SET":{
      const{userId,taskId,count}=action
      const arr=(prev.draft.assigns?.[userId]||[]).filter(a=>!a.stolen)
      const stolen=(prev.draft.assigns?.[userId]||[]).filter(a=>a.stolen)
      const idx=arr.findIndex(a=>a.id===taskId)
      let newArr
      if(count===0)newArr=[...arr.filter(a=>a.id!==taskId),...stolen]
      else if(idx>=0){const na=[...arr];na[idx]={...na[idx],count};newArr=[...na,...stolen]}
      else newArr=[...arr,{id:taskId,count,done:0},...stolen]
      return{...prev,draft:{...prev.draft,assigns:{...prev.draft.assigns,[userId]:newArr}}}
    }
    case "DRAFT_CONFIRM":{
      const wid=sundayWeekId()
      const lib=prev.library||LIB_DEFAULT
      const missing=lib.filter(t=>(t.minCount||0)>0).filter(task=>{
        const t0=(prev.draft.assigns?.["0"]||[]).find(a=>a.id===task.id)?.count||0
        const t1=(prev.draft.assigns?.["1"]||[]).find(a=>a.id===task.id)?.count||0
        return t0+t1<task.minCount
      })
      if(missing.length>0)return{...prev,_draftError:`Faltam: ${missing.map(t=>t.name).join(", ")}`}
      if(prev.draft.week_id!==wid){
        const assigns={}
        for(const[uid,arr]of Object.entries(prev.draft.assigns||{}))assigns[uid]=arr.map(a=>({...a,done:0}))
        return{...prev,draft:{week_id:wid,confirmed:true,bonus_given:false,assigns,steals_used:0}}
      }
      return{...prev,draft:{...prev.draft,confirmed:true}}
    }
    case "COMPLETE":{
      const{userId,taskId}=action
      const lib=prev.library||LIB_DEFAULT,task=lib.find(t=>t.id===taskId);if(!task)return prev
      const myAssigns=prev.draft.assigns?.[userId]||[]
      const myAssign=myAssigns.find(a=>a.id===taskId)
      const stolenMult=myAssign?.stolen?2.5:1
      const s0=applyStreak({...prev.stats[userId]})
      const earned=Math.round(task.coins*stolenMult*(1+sBon(s0.streak)))
      s0.month_points+=task.pts;s0.hall_points+=task.pts;s0.coins+=earned
      s0.tasks_done+=1;s0.task_counts={...(s0.task_counts||{}),[taskId]:(s0.task_counts?.[taskId]||0)+1}
      const assigns={}
      for(const[uid,arr]of Object.entries(prev.draft.assigns||{})){
        if(uid===userId){let found=false;assigns[uid]=arr.map(a=>{if(!found&&a.id===taskId){found=true;return{...a,done:Math.min(a.count,(a.done||0)+1)}}return a})}
        else assigns[uid]=arr
      }
      let bonusGiven=prev.draft.bonus_given,gotBonus=false
      if(!bonusGiven){const mine=assigns[userId]||[];if(mine.length>0&&mine.every(a=>(a.done||0)>=a.count)){s0.coins+=50;bonusGiven=true;gotBonus=true;if(navigator.vibrate)navigator.vibrate([50,30,100,30,200])}}
      const now=new Date(),dateStr=`${now.toLocaleDateString("pt-BR")} ${now.toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"})}`
      const hist={userId,taskId,taskName:task.name,pts:task.pts,coins:earned,date:dateStr,stolen:myAssign?.stolen}
      const curUnl=prev.unlocked?.[userId]||[],newAchs=checkAchs(s0,curUnl)
      return{...prev,stats:{...prev.stats,[userId]:s0},draft:{...prev.draft,assigns,bonus_given:bonusGiven},history:[...(prev.history||[]),hist],unlocked:{...prev.unlocked,[userId]:[...curUnl,...newAchs]},_newAchs:newAchs,_reward:{pts:task.pts,coins:earned,bonus:gotBonus}}
    }
    case "UNDO_COMPLETE":{
      const{userId,taskId}=action
      const arr=prev.draft.assigns?.[userId]||[]
      const aIdx=arr.findIndex(a=>a.id===taskId&&(action.stolen?a.stolen:!a.stolen))
      if(aIdx===-1||(arr[aIdx].done||0)===0)return prev
      const hist=[...(prev.history||[])]
      let ptsRem=0,coinsRem=0
      const lIdx=[...hist].reverse().findIndex(h=>h.userId===userId&&h.taskId===taskId&&!!h.stolen===!!action.stolen)
      if(lIdx>=0){const ri=hist.length-1-lIdx;ptsRem=hist[ri].pts;coinsRem=hist[ri].coins;hist.splice(ri,1)}
      const newArr=arr.map((a,i)=>i===aIdx?{...a,done:Math.max(0,(a.done||0)-1)}:a)
      const assigns={...prev.draft.assigns,[userId]:newArr}
      let bonusGiven=prev.draft.bonus_given,coinsTotal=coinsRem
      if(bonusGiven&&!newArr.every(a=>(a.done||0)>=a.count)){coinsTotal+=50;bonusGiven=false}
      const s0={...prev.stats[userId]}
      s0.month_points=Math.max(0,s0.month_points-ptsRem);s0.hall_points=Math.max(0,s0.hall_points-ptsRem)
      s0.coins=Math.max(0,s0.coins-coinsTotal);s0.tasks_done=Math.max(0,s0.tasks_done-1)
      s0.task_counts={...s0.task_counts,[taskId]:Math.max(0,(s0.task_counts?.[taskId]||1)-1)}
      return{...prev,stats:{...prev.stats,[userId]:s0},draft:{...prev.draft,assigns,bonus_given:bonusGiven},history:hist}
    }
    case "UNASSIGN_TASK":{
      const{userId,taskId}=action
      const lib=prev.library||LIB_DEFAULT,task=lib.find(t=>t.id===taskId);if(!task)return prev
      const assign=(prev.draft.assigns?.[userId]||[]).find(a=>a.id===taskId&&!a.stolen);if(!assign)return prev
      const remaining=assign.count-(assign.done||0),cost=task.coins*remaining
      const s0={...prev.stats[userId]};if(s0.coins<cost)return prev
      s0.coins-=cost
      const newAssigns=(prev.draft.assigns?.[userId]||[]).filter(a=>!(a.id===taskId&&!a.stolen))
      return{...prev,stats:{...prev.stats,[userId]:s0},draft:{...prev.draft,assigns:{...prev.draft.assigns,[userId]:newAssigns}}}
    }
    case "STEAL_TASK":{
      const{userId,partnerId,taskId}=action
      const lib=prev.library||LIB_DEFAULT,task=lib.find(t=>t.id===taskId);if(!task)return prev
      const s0={...prev.stats[userId]};if(s0.coins<task.coins)return prev
      s0.coins-=task.coins
      const pArr=[...(prev.draft.assigns?.[partnerId]||[])],pIdx=pArr.findIndex(a=>a.id===taskId&&!a.stolen)
      if(pIdx===-1)return prev
      const pA=pArr[pIdx]
      if(pA.count<=1)pArr.splice(pIdx,1)
      else pArr[pIdx]={...pA,count:pA.count-1}
      const uArr=[...(prev.draft.assigns?.[userId]||[])]
      const eIdx=uArr.findIndex(a=>a.id===taskId&&a.stolen)
      if(eIdx>=0)uArr[eIdx]={...uArr[eIdx],count:uArr[eIdx].count+1}
      else uArr.push({id:taskId,count:1,done:0,stolen:true})
      return{...prev,stats:{...prev.stats,[userId]:s0},draft:{...prev.draft,assigns:{...prev.draft.assigns,[userId]:uArr,[partnerId]:pArr},steals_used:(prev.draft.steals_used||0)+1}}
    }
    case "REDEEM":{
      const{userId,rewardId,redemptionId}=action
      const r=(prev.market||MKT_DEFAULT).find(x=>x.id===rewardId);if(!r)return prev
      const s0={...prev.stats[userId]};if(s0.coins<r.cost)return prev
      s0.coins-=r.cost
      const now=new Date(),dateStr=`${now.toLocaleDateString("pt-BR")} ${now.toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"})}`
      return{...prev,stats:{...prev.stats,[userId]:s0},redemptions:[...(prev.redemptions||[]),{id:redemptionId||genId(),userId,rewardId,rewardName:r.name,cost:r.cost,date:dateStr,used:false}]}
    }
    case "UNDO_REDEEM":{
      const{redemptionId,userId,cost}=action
      const s0={...prev.stats[userId]};s0.coins+=cost
      return{...prev,stats:{...prev.stats,[userId]:s0},redemptions:(prev.redemptions||[]).filter(r=>r.id!==redemptionId)}
    }
    case "MARK_USED":return{...prev,redemptions:(prev.redemptions||[]).map(r=>r.id===action.redemptionId?{...r,used:!r.used}:r)}
    case "UPDATE_SETTINGS":return{...prev,house:{...prev.house,name:action.house},users:[{...prev.users[0],name:action.name0},{...prev.users[1],name:action.name1}]}
    case "ADD_TASK":   return{...prev,library:[...(prev.library||[]),action.task]}
    case "EDIT_TASK":  return{...prev,library:(prev.library||[]).map(t=>t.id===action.taskId?{...t,...action.updates}:t)}
    case "DELETE_TASK":return{...prev,library:(prev.library||[]).filter(t=>t.id!==action.taskId)}
    case "ADD_REWARD": return{...prev,market:[...(prev.market||[]),action.reward]}
    case "EDIT_REWARD":return{...prev,market:(prev.market||[]).map(r=>r.id===action.rewardId?{...r,...action.updates}:r)}
    case "DELETE_REWARD":return{...prev,market:(prev.market||[]).filter(r=>r.id!==action.rewardId)}
    case "SWITCH_USER":return{...prev,viewUser:prev.viewUser===0?1:0}
    case "RESET_WEEK": return{...prev,draft:blankDraft()}
    case "RESET":return blankState()
    default:return prev
  }
}

const TABS=[{id:"home",icon:"home",label:"In\u00edcio"},{id:"draft",icon:"swap_horiz",label:"Draft"},{id:"tasks",icon:"checklist",label:"Tarefas"},{id:"market",icon:"storefront",label:"Market"},{id:"profile",icon:"person",label:"Perfil"}]

export default function CasaApp(){
  const[state,setState]=useState(loadState),[tab,setTab]=useState("home")
  const[toast,setToast]=useState(null),[achModal,setAchModal]=useState(null)
  const[floats,setFloats]=useState([]),[settingsOpen,setSettingsOpen]=useState(false)

  useEffect(()=>{store.set(state)},[state])
  useEffect(()=>{
    const links=[
      "https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;600;700;800&family=Nunito:wght@600;700;800;900&display=swap",
      "https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,500,1,0&display=block"
    ]
    links.forEach(href=>{const l=document.createElement("link");l.rel="stylesheet";l.href=href;document.head.appendChild(l)})
    const s=document.createElement("style")
    s.textContent=`*{box-sizing:border-box;-webkit-tap-highlight-color:transparent}body{margin:0;background:#dad6ce}.material-symbols-rounded{font-variation-settings:'FILL' 1,'wght' 500,'GRAD' 0,'opsz' 24}::-webkit-scrollbar{width:0;height:0}@keyframes shine{0%{transform:translateX(-120%)}100%{transform:translateX(240%)}}@keyframes floatUp{0%{transform:translateY(0) scale(.7);opacity:0}18%{opacity:1;transform:translateY(-8px) scale(1.05)}100%{transform:translateY(-96px) scale(1);opacity:0}}@keyframes popIn{0%{transform:scale(.6);opacity:0}60%{transform:scale(1.06);opacity:1}100%{transform:scale(1)}}@keyframes badgePulse{0%,100%{transform:scale(1)}50%{transform:scale(1.08)}}@keyframes toastIn{0%{transform:translateY(30px);opacity:0}100%{transform:translateY(0);opacity:1}}@keyframes fadeIn{from{opacity:0}to{opacity:1}}`
    document.head.appendChild(s)
  },[])
  useEffect(()=>{
    if(state.house.name&&state.draft.week_id&&state.draft.week_id!==sundayWeekId()&&state.draft.confirmed)
      dispatch({type:"RESET_WEEK"})
  },[])

  const dispatch=useCallback(action=>{
    setState(prev=>{
      const next=reduce(prev,action)
      if(next._newAchs?.length>0){const ach=ACHS.find(a=>a.id===next._newAchs[0]);setTimeout(()=>setAchModal(ach),500)}
      if(next._reward){const r=next._reward,id=Math.random();setFloats(f=>[...f,{id,pts:r.pts,coins:r.coins}]);setTimeout(()=>setFloats(f=>f.filter(x=>x.id!==id)),1300);if(r.bonus){setToast(null);setTimeout(()=>setToast({msg:"Draft completo! +50 moedas \uD83C\uDF89"}),60)}}
      if(next._draftError){setToast(null);setTimeout(()=>setToast({msg:next._draftError}),60)}
      const clean={...next};delete clean._newAchs;delete clean._reward;delete clean._draftError;return clean
    })
  },[])

  const showToast=(msg,action,onAction)=>{setToast(null);setTimeout(()=>setToast({msg,action,onAction}),50)}

  if(!state.house.name)return<div style={{maxWidth:430,margin:"0 auto",minHeight:"100vh",background:C.bg}}><Onboarding onDone={({house,myName,pairName,assigns})=>dispatch({type:"INIT",house,myName,pairName,assigns})}/></div>

  return<div style={{maxWidth:430,margin:"0 auto",minHeight:"100vh",background:C.bg,position:"relative",overflowX:"hidden",boxShadow:"0 0 60px rgba(0,0,0,.12)"}}>
    <div style={{position:"absolute",inset:0,zIndex:120,pointerEvents:"none",overflow:"hidden"}}>
      {floats.map(f=>(
        <div key={f.id} style={{position:"absolute",top:96,left:"50%",transform:"translateX(-50%)",display:"flex",gap:10,animation:"floatUp 1.3s ease-out forwards"}}>
          <div style={{display:"flex",alignItems:"center",gap:3,background:C.violet,color:"#fff",borderRadius:999,padding:"6px 12px",fontFamily:F.display,fontWeight:800,fontSize:16,boxShadow:"0 4px 12px rgba(123,91,255,.4)"}}><Icon name="bolt" size={18}/>+{f.pts}</div>
          <div style={{display:"flex",alignItems:"center",gap:3,background:C.gold,color:"#fff",borderRadius:999,padding:"6px 12px",fontFamily:F.display,fontWeight:800,fontSize:16,boxShadow:"0 4px 12px rgba(255,179,35,.4)"}}><Icon name="paid" size={18}/>+{f.coins}</div>
        </div>
      ))}
    </div>
    <div style={{overflowY:"auto",minHeight:"100vh",paddingBottom:80}}>
      {tab==="home"   &&<HomeScreen    state={state} dispatch={dispatch} onOpenSettings={()=>setSettingsOpen(true)}/>}
      {tab==="draft"  &&<DraftScreen   state={state} dispatch={dispatch}/>}
      {tab==="tasks"  &&<TasksScreen   state={state} dispatch={dispatch}/>}
      {tab==="market" &&<MarketScreen  state={state} dispatch={dispatch} showToast={showToast}/>}
      {tab==="profile"&&<ProfileScreen state={state} dispatch={dispatch}/>}
    </div>
    <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:430,background:"#fff",borderTop:"1px solid #EFEBF8",display:"flex",justifyContent:"space-around",alignItems:"flex-end",padding:"9px 6px calc(env(safe-area-inset-bottom,0px) + 12px)",boxShadow:"0 -4px 24px rgba(33,27,51,.07)",zIndex:50}}>
      {TABS.map(t=>(
        <button key={t.id} onClick={()=>setTab(t.id)} style={{flex:1,border:"none",background:"none",padding:0,cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:2,color:tab===t.id?C.violet:C.softer}}>
          <Icon name={t.icon} size={26}/><span style={{fontFamily:F.body,fontWeight:800,fontSize:10.5,lineHeight:1}}>{t.label}</span>
        </button>
      ))}
    </div>
    {settingsOpen&&<SettingsScreen state={state} dispatch={dispatch} onClose={()=>setSettingsOpen(false)}/>}
    {toast&&<Toast msg={toast.msg} action={toast.action} onAction={toast.onAction} onClose={()=>setToast(null)}/>}
    <AchModal ach={achModal} onClose={()=>setAchModal(null)}/>
  </div>
}
