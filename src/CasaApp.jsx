import { useState, useEffect, useCallback } from "react"

const F = { display:"'Baloo 2', system-ui, sans-serif", body:"'Nunito', system-ui, sans-serif" }

const TH = {
  blue:   { fg:"#2E7BF0", bg:"#EAF3FF", sd:"#D4E6FF" },
  green:  { fg:"#27C26E", bg:"#E9F8EF", sd:"#CFEFD9" },
  purple: { fg:"#A23DD6", bg:"#FBEEFF", sd:"#F0D6FA" },
  orange: { fg:"#FF7A1A", bg:"#FFF1E6", sd:"#FBDEC4" },
  teal:   { fg:"#0FB8B0", bg:"#E4F8F6", sd:"#C7EEEA" },
  pink:   { fg:"#FF4F9A", bg:"#FFEAF3", sd:"#FFD4E6" },
  violet: { fg:"#7B5BFF", bg:"#F0ECFF", sd:"#E0D6FA" },
}
const GRADS = {
  blue:"linear-gradient(160deg,#7DBDFF,#2E7BF0)", green:"linear-gradient(160deg,#5BE39A,#1FA85B)",
  purple:"linear-gradient(160deg,#C77DF0,#8B2FC9)", orange:"linear-gradient(160deg,#FFB05C,#FF7A1A)",
  teal:"linear-gradient(160deg,#4FD8D0,#0FB8B0)", pink:"linear-gradient(160deg,#FF9BC7,#FF4F9A)",
  violet:"linear-gradient(160deg,#A98CFF,#6A3DF0)",
}
const GRADSD = { blue:"#1F5FCC", green:"#1FA85B", purple:"#5A28C0", orange:"#E0900A", teal:"#0A8F88", pink:"#E02E7D", violet:"#5A38E0" }
const C = {
  bg:"#F3F1FA", text:"#211B33", soft:"#8A85A0", softer:"#ADA7BE",
  violet:"#7B5BFF", violetSd:"#5A38E0",
  gold:"#FFB323", goldTxt:"#E0900A",
  green:"#27C26E", fire:"#FF7A1A", white:"#fff",
  card:{ background:"#fff", borderRadius:22, boxShadow:"0 3px 0 rgba(33,27,51,.05), 0 10px 24px rgba(33,27,51,.06)" },
}
const ME_GRAD="linear-gradient(160deg,#54A0FF,#2E7BF0)", ME_SD="#1F5FCC"
const PAIR_GRAD="linear-gradient(160deg,#FF7DB5,#FF4F9A)", PAIR_SD="#E02E7D"
const diffColor = d => d==="Fácil"?C.green:d==="Difícil"?C.fire:C.goldTxt

// ── DEFAULT DATA ──────────────────────────────────────────
const LIB_DEFAULT = [
  { id:"lavar-louca",  name:"Lavar louça",         cat:"Cozinha",    icon:"restaurant",            th:"blue",   pts:20, coins:15, diff:"Fácil"   },
  { id:"tirar-lixo",   name:"Tirar lixo",           cat:"Geral",      icon:"delete",                th:"green",  pts:15, coins:10, diff:"Fácil"   },
  { id:"limpar-ban",   name:"Limpar banheiro",      cat:"Banheiro",   icon:"bathtub",               th:"purple", pts:50, coins:30, diff:"Difícil" },
  { id:"aspirador",    name:"Passar aspirador",     cat:"Geral",      icon:"cleaning_services",     th:"teal",   pts:35, coins:20, diff:"Média"   },
  { id:"lavar-roupa",  name:"Lavar roupa",          cat:"Lavanderia", icon:"local_laundry_service", th:"blue",   pts:30, coins:20, diff:"Média"   },
  { id:"dobrar-roupa", name:"Dobrar roupa",         cat:"Lavanderia", icon:"checkroom",             th:"pink",   pts:20, coins:12, diff:"Fácil"   },
  { id:"mercado",      name:"Fazer mercado",        cat:"Geral",      icon:"shopping_cart",         th:"orange", pts:40, coins:25, diff:"Média"   },
  { id:"limpar-coz",   name:"Limpar cozinha",       cat:"Cozinha",    icon:"countertops",           th:"orange", pts:35, coins:22, diff:"Média"   },
  { id:"cama",         name:"Trocar roupa de cama", cat:"Quarto",     icon:"king_bed",              th:"orange", pts:80, coins:40, diff:"Difícil" },
  { id:"varrer",       name:"Varrer a casa",        cat:"Geral",      icon:"cleaning_services",     th:"teal",   pts:25, coins:15, diff:"Fácil"   },
]
const MKT_DEFAULT = [
  { id:"filme",   name:"Escolher o filme",          icon:"movie",           th:"violet", cost:50,  tier:"Baixo" },
  { id:"tv",      name:"Controle da TV",            icon:"settings_remote", th:"blue",   cost:40,  tier:"Baixo" },
  { id:"jantar",  name:"Escolher o jantar",         icon:"restaurant_menu", th:"orange", cost:60,  tier:"Baixo" },
  { id:"cafe",    name:"Café na cama",              icon:"local_cafe",      th:"orange", cost:120, tier:"Médio" },
  { id:"sobre",   name:"Sobremesa especial",        icon:"cake",            th:"pink",   cost:100, tier:"Médio" },
  { id:"massa",   name:"Vale massagem",             icon:"spa",             th:"purple", cost:200, tier:"Médio" },
  { id:"date",    name:"Vale date",                 icon:"favorite",        th:"pink",   cost:400, tier:"Alto"  },
  { id:"folga",   name:"Folga da louça (1 sem.)",   icon:"restaurant",      th:"violet", cost:350, tier:"Alto"  },
  { id:"passeio", name:"Passeio do fim de semana",  icon:"hiking",          th:"teal",   cost:500, tier:"Alto"  },
]
const ACHS = [
  { id:"first",      label:"1º Lugar",        icon:"emoji_events",          th:"violet", desc:"Ganhe o ranking do mês",  ok:(s)=>s.wins>=1 },
  { id:"streak7",    label:"7 dias seguidos",  icon:"local_fire_department", th:"orange", desc:"7 dias consecutivos",     ok:(s)=>s.best_streak>=7 },
  { id:"streak30",   label:"30 dias!",         icon:"local_fire_department", th:"pink",   desc:"30 dias consecutivos",    ok:(s)=>s.best_streak>=30 },
  { id:"t100",       label:"100 tarefas",      icon:"task_alt",              th:"blue",   desc:"100 tarefas concluídas",  ok:(s)=>s.tasks_done>=100 },
  { id:"t500",       label:"500 tarefas",      icon:"workspace_premium",     th:"violet", desc:"500 tarefas concluídas",  ok:(s)=>s.tasks_done>=500 },
  { id:"louca100",   label:"Chef da Louça",    icon:"restaurant",            th:"blue",   desc:"Lavou a louça 100×",      ok:(s)=>(s.task_counts?.["lavar-louca"]||0)>=100 },
  { id:"lixo50",     label:"Lixeiro Pro",      icon:"delete",                th:"green",  desc:"Tirou o lixo 50×",        ok:(s)=>(s.task_counts?.["tirar-lixo"]||0)>=50 },
  { id:"banheiro10", label:"Banheirista",      icon:"bathtub",               th:"purple", desc:"Limpou o banheiro 10×",   ok:(s)=>(s.task_counts?.["limpar-ban"]||0)>=10 },
]
const TITLES = [{min:500,t:"Lenda da Casa"},{min:100,t:"Faxineiro Lendário"},{min:50,t:"Mestre de Casa"},{min:10,t:"Faxineiro Jr."},{min:0,t:"Iniciante"}]
const THEMES_LIST = ["blue","green","purple","orange","teal","pink","violet"]
const DIFF_LIST   = ["Fácil","Média","Difícil"]
const TIER_LIST   = ["Baixo","Médio","Alto"]

// ── HELPERS ──────────────────────────────────────────────
const today = () => new Date().toISOString().split("T")[0]
const weekId = () => { const d=new Date(),j=new Date(d.getFullYear(),0,1); return `${d.getFullYear()}-W${Math.ceil(((d-j)/864e5+j.getDay()+1)/7)}` }
const daysLeft = () => { const d=new Date(); return new Date(d.getFullYear(),d.getMonth()+1,0).getDate()-d.getDate() }
const monthName = () => ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"][new Date().getMonth()]
const getTitle = td => TITLES.find(t=>td>=t.min)?.t||"Iniciante"
const ini = n => (n||"?")[0].toUpperCase()
const sBon = s => s>=30?.15:s>=15?.10:s>=7?.05:0
const genId = () => `id_${Date.now()}_${Math.random().toString(36).slice(2,6)}`
const store = {
  get:()=>{ try{ const r=localStorage.getItem("casa_v1"); return r?JSON.parse(r):null }catch{ return null } },
  set:(v)=>{ try{ localStorage.setItem("casa_v1",JSON.stringify(v)) }catch{} }
}
const blankStats = () => ({ month_points:0, hall_points:0, coins:0, streak:0, best_streak:0, last_date:null, tasks_done:0, wins:0, task_counts:{} })
const blankState = () => ({
  house:{name:""},
  users:[{id:0,name:"",color:"blue"},{id:1,name:"",color:"pink"}],
  viewUser:0,
  stats:{"0":blankStats(),"1":blankStats()},
  draft:{week_id:"",confirmed:false,bonus_given:false,assigns:{"0":[],"1":[]}},
  history:[], unlocked:{"0":[],"1":[]},
  redemptions:[], library:LIB_DEFAULT, market:MKT_DEFAULT,
})
const loadState = () => {
  const s = store.get() || blankState()
  if (!s.library)     s.library = LIB_DEFAULT
  if (!s.market)      s.market  = MKT_DEFAULT
  if (!s.redemptions) s.redemptions = []
  return s
}
function applyStreak(s0) {
  const t=today(), s={...s0}
  if (s.last_date===t) return s
  if (s.last_date) { const diff=(new Date(t)-new Date(s.last_date))/864e5; s.streak=diff===1?s.streak+1:1 }
  else s.streak=1
  s.last_date=t; s.best_streak=Math.max(s.best_streak,s.streak); return s
}
const checkAchs = (stats, unlocked) => ACHS.filter(a=>!unlocked.includes(a.id)&&a.ok(stats)).map(a=>a.id)

// ── UI ATOMS ─────────────────────────────────────────────
function Icon({ name, size=24, color, style={} }) {
  return <span className="material-symbols-rounded" style={{fontSize:size,color:color||"inherit",lineHeight:1,userSelect:"none",...style}}>{name}</span>
}
function TaskIcon({ task, size=44 }) {
  const th=TH[task?.th]||TH.violet
  return (
    <div style={{width:size,height:size,borderRadius:Math.round(size*.3),background:th.bg,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 3px 0 ${th.sd}`,flexShrink:0}}>
      <Icon name={task?.icon||"task_alt"} size={Math.round(size*.54)} color={th.fg}/>
    </div>
  )
}
function Coin({ n, size=14, color=C.goldTxt }) {
  return <span style={{display:"inline-flex",alignItems:"center",gap:3,fontFamily:F.display,fontWeight:800,color}}><Icon name="paid" size={size} color={C.gold}/>{n}</span>
}
function PtsBolt({ n, size=14, color=C.violet }) {
  return <span style={{display:"inline-flex",alignItems:"center",gap:2,fontFamily:F.display,fontWeight:800,color}}><Icon name="bolt" size={size} color={color}/>{n}</span>
}
function TaskMeta({ task }) {
  return (
    <div style={{display:"flex",alignItems:"center",gap:8,fontFamily:F.body,fontWeight:800,fontSize:11.5,color:C.soft}}>
      <span style={{color:diffColor(task.diff)}}>{task.diff}</span>
      <PtsBolt n={task.pts} size={13}/><Coin n={task.coins} size={13}/>
    </div>
  )
}
function Pill({ icon, value, color=C.violet, bg="#fff", iconColor }) {
  return (
    <div style={{display:"flex",alignItems:"center",gap:5,background:bg,borderRadius:999,padding:"7px 12px",boxShadow:"0 2px 0 rgba(33,27,51,.05)"}}>
      <Icon name={icon} size={19} color={iconColor||color}/>
      <span style={{fontSize:15,fontFamily:F.display,fontWeight:700,color}}>{value}</span>
    </div>
  )
}
function Btn3D({ children, onClick, color=C.violet, shadow=C.violetSd, style={}, disabled=false, small=false }) {
  const [p,setP]=useState(false)
  return (
    <button onClick={!disabled?onClick:undefined}
      onMouseDown={()=>setP(true)} onMouseUp={()=>setP(false)} onMouseLeave={()=>setP(false)}
      onTouchStart={()=>setP(true)} onTouchEnd={()=>setP(false)}
      style={{background:disabled?C.softer:color,color:"#fff",border:"none",borderRadius:16,
        padding:small?"8px 16px":"14px 20px",fontFamily:F.display,fontWeight:800,
        fontSize:small?13:17,letterSpacing:.2,boxShadow:p||disabled?"none":`0 4px 0 ${shadow}`,
        transform:p?"translateY(4px)":"none",cursor:disabled?"not-allowed":"pointer",
        width:"100%",transition:"all .08s",...style}}>
      {children}
    </button>
  )
}
function Card({ children, style={} }) { return <div style={{...C.card,padding:18,...style}}>{children}</div> }
function SectionLabel({ children }) {
  return (
    <div style={{display:"flex",alignItems:"center",gap:8,margin:"0 2px 10px"}}>
      <span style={{fontFamily:F.display,fontWeight:700,fontSize:15,color:C.text}}>{children}</span>
      <div style={{flex:1,height:2,background:"#E7E2F3",borderRadius:2}}/>
    </div>
  )
}
function Toast({ msg, action, onAction, onClose }) {
  useEffect(()=>{ const t=setTimeout(onClose,action?5000:2400); return ()=>clearTimeout(t) },[])
  return (
    <div style={{position:"fixed",bottom:104,left:"50%",transform:"translateX(-50%)",
      background:"#211B33",color:"#fff",borderRadius:14,padding:"12px 16px",fontFamily:F.display,
      fontWeight:700,fontSize:15,zIndex:999,boxShadow:"0 8px 24px rgba(0,0,0,.25)",
      display:"flex",alignItems:"center",gap:12,whiteSpace:"nowrap",animation:"toastIn .3s ease-out"}}>
      <span>{msg}</span>
      {action&&<button onClick={()=>{onAction();onClose()}} style={{background:"rgba(255,255,255,.22)",border:"none",borderRadius:9,padding:"5px 11px",color:"#fff",fontFamily:F.display,fontWeight:800,fontSize:13,cursor:"pointer"}}>{action}</button>}
    </div>
  )
}
function AchModal({ ach, onClose }) {
  if (!ach) return null
  const grad=GRADS[ach.th]||GRADS.violet, sd=GRADSD[ach.th]||GRADSD.violet
  return (
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(20,12,40,.55)",backdropFilter:"blur(4px)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:32,animation:"fadeIn .25s ease-out"}}>
      <div style={{...C.card,padding:"30px 24px 24px",textAlign:"center",maxWidth:300,width:"100%",animation:"popIn .45s cubic-bezier(.34,1.56,.64,1)"}}>
        <div style={{fontSize:12,fontFamily:F.body,fontWeight:800,letterSpacing:1,color:C.gold}}>CONQUISTA DESBLOQUEADA</div>
        <div style={{width:96,height:96,borderRadius:"50%",background:grad,display:"flex",alignItems:"center",justifyContent:"center",margin:"16px auto",boxShadow:`0 8px 0 ${sd}`,animation:"badgePulse 1.4s ease-in-out infinite"}}>
          <Icon name={ach.icon} size={50} color="#fff"/>
        </div>
        <div style={{fontFamily:F.display,fontWeight:800,fontSize:23,color:C.text}}>{ach.label}</div>
        <div style={{fontFamily:F.body,fontWeight:700,fontSize:13.5,color:C.soft,marginTop:4}}>{ach.desc}</div>
        <Btn3D onClick={onClose} style={{marginTop:20}}>Mandou bem!</Btn3D>
      </div>
    </div>
  )
}
function ConfirmSheet({ title, msg, confirmLabel="Confirmar", onConfirm, onCancel, danger=false }) {
  return (
    <div onClick={onCancel} style={{position:"fixed",inset:0,background:"rgba(20,12,40,.45)",zIndex:800,display:"flex",alignItems:"flex-end",justifyContent:"center",animation:"fadeIn .2s ease-out"}}>
      <div onClick={e=>e.stopPropagation()} style={{...C.card,width:"100%",maxWidth:430,borderRadius:"22px 22px 0 0",padding:"24px 20px 40px",animation:"toastIn .25s ease-out"}}>
        <div style={{fontFamily:F.display,fontWeight:800,fontSize:19,color:C.text,marginBottom:msg?6:20}}>{title}</div>
        {msg&&<div style={{fontFamily:F.body,fontWeight:700,fontSize:14,color:C.soft,marginBottom:20}}>{msg}</div>}
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          <Btn3D onClick={onConfirm} color={danger?"#D93434":C.violet} shadow={danger?"#A02828":C.violetSd}>{confirmLabel}</Btn3D>
          <button onClick={onCancel} style={{border:"none",background:"none",fontFamily:F.display,fontWeight:800,fontSize:16,color:C.soft,padding:10,cursor:"pointer"}}>Cancelar</button>
        </div>
      </div>
    </div>
  )
}
function BottomSheet({ title, onClose, children }) {
  return (
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(20,12,40,.45)",zIndex:850,display:"flex",alignItems:"flex-end",justifyContent:"center",animation:"fadeIn .2s ease-out"}}>
      <div onClick={e=>e.stopPropagation()} style={{...C.card,width:"100%",maxWidth:430,borderRadius:"22px 22px 0 0",padding:"20px 20px 40px",maxHeight:"90vh",overflowY:"auto",animation:"toastIn .25s ease-out"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18}}>
          <div style={{fontFamily:F.display,fontWeight:800,fontSize:18,color:C.text}}>{title}</div>
          <button onClick={onClose} style={{background:"#F0ECFF",border:"none",borderRadius:999,width:32,height:32,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}><Icon name="close" size={18} color={C.violet}/></button>
        </div>
        {children}
      </div>
    </div>
  )
}
// ── FORM HELPERS ─────────────────────────────────────────
const inp = { width:"100%", padding:"13px 14px", borderRadius:14, border:"2px solid #E3DDF1", fontFamily:"'Nunito', system-ui", fontWeight:700, fontSize:15, color:"#211B33", outline:"none", boxSizing:"border-box", background:"#fff", marginBottom:12 }
const lbl = { fontFamily:"'Nunito', system-ui", fontSize:12, fontWeight:800, color:"#6E6688", margin:"0 0 5px 3px", display:"block" }
function Select({ value, onChange, options }) {
  return (
    <select value={value} onChange={e=>onChange(e.target.value)} style={{...inp,appearance:"none",marginBottom:12}}>
      {options.map(o=><option key={o} value={o}>{o}</option>)}
    </select>
  )
}
function TaskForm({ initial={}, onSave, onCancel }) {
  const [v,setV]=useState({ name:"", cat:"Geral", icon:"task_alt", th:"blue", pts:20, coins:12, diff:"Fácil", ...initial })
  const set = k => e => setV(p=>({...p,[k]:e.target?.value??e}))
  return (
    <div style={{display:"flex",flexDirection:"column"}}>
      <label style={lbl}>NOME</label>
      <input value={v.name} onChange={set("name")} placeholder="Ex: Lavar louça" style={inp}/>
      <label style={lbl}>CATEGORIA</label>
      <input value={v.cat} onChange={set("cat")} placeholder="Ex: Cozinha" style={inp}/>
      <label style={lbl}>ÍCONE (Material Symbols)</label>
      <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:12}}>
        <div style={{width:46,height:46,borderRadius:14,background:TH[v.th]?.bg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,boxShadow:`0 3px 0 ${TH[v.th]?.sd}`}}>
          <Icon name={v.icon||"task_alt"} size={26} color={TH[v.th]?.fg}/>
        </div>
        <input value={v.icon} onChange={set("icon")} placeholder="Ex: restaurant" style={{...inp,marginBottom:0,flex:1}}/>
      </div>
      <label style={lbl}>TEMA</label>
      <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:14}}>
        {THEMES_LIST.map(t=>(
          <button key={t} onClick={()=>setV(p=>({...p,th:t}))} style={{width:32,height:32,borderRadius:10,background:GRADS[t],border:v.th===t?"3px solid #211B33":"3px solid transparent",cursor:"pointer",boxShadow:`0 3px 0 ${GRADSD[t]}`}}/>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
        <div><label style={lbl}>PONTOS</label><input type="number" value={v.pts} onChange={set("pts")} style={{...inp,marginBottom:0}}/></div>
        <div><label style={lbl}>MOEDAS</label><input type="number" value={v.coins} onChange={set("coins")} style={{...inp,marginBottom:0}}/></div>
      </div>
      <label style={lbl}>DIFICULDADE</label>
      <Select value={v.diff} onChange={d=>setV(p=>({...p,diff:d}))} options={DIFF_LIST}/>
      <Btn3D onClick={()=>v.name.trim()&&onSave({...v,pts:+v.pts,coins:+v.coins})} disabled={!v.name.trim()}>Salvar tarefa</Btn3D>
    </div>
  )
}
function RewardForm({ initial={}, onSave, onCancel }) {
  const [v,setV]=useState({ name:"", icon:"card_giftcard", th:"violet", cost:100, tier:"Médio", ...initial })
  const set = k => e => setV(p=>({...p,[k]:e.target?.value??e}))
  return (
    <div style={{display:"flex",flexDirection:"column"}}>
      <label style={lbl}>NOME</label>
      <input value={v.name} onChange={set("name")} placeholder="Ex: Escolher o filme" style={inp}/>
      <label style={lbl}>ÍCONE (Material Symbols)</label>
      <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:12}}>
        <div style={{width:46,height:46,borderRadius:14,background:TH[v.th]?.bg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,boxShadow:`0 3px 0 ${TH[v.th]?.sd}`}}>
          <Icon name={v.icon||"card_giftcard"} size={26} color={TH[v.th]?.fg}/>
        </div>
        <input value={v.icon} onChange={set("icon")} placeholder="Ex: movie" style={{...inp,marginBottom:0,flex:1}}/>
      </div>
      <label style={lbl}>TEMA</label>
      <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:14}}>
        {THEMES_LIST.map(t=>(
          <button key={t} onClick={()=>setV(p=>({...p,th:t}))} style={{width:32,height:32,borderRadius:10,background:GRADS[t],border:v.th===t?"3px solid #211B33":"3px solid transparent",cursor:"pointer",boxShadow:`0 3px 0 ${GRADSD[t]}`}}/>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
        <div><label style={lbl}>CUSTO (moedas)</label><input type="number" value={v.cost} onChange={set("cost")} style={{...inp,marginBottom:0}}/></div>
        <div><label style={lbl}>NÍVEL</label>
          <select value={v.tier} onChange={e=>setV(p=>({...p,tier:e.target.value}))} style={{...inp,appearance:"none",marginBottom:0}}>
            {TIER_LIST.map(t=><option key={t}>{t}</option>)}
          </select>
        </div>
      </div>
      <Btn3D onClick={()=>v.name.trim()&&onSave({...v,cost:+v.cost})} disabled={!v.name.trim()}>Salvar recompensa</Btn3D>
    </div>
  )
}

// ── ONBOARDING ───────────────────────────────────────────
function Onboarding({ onDone }) {
  const [step,setStep]=useState(0)
  const [house,setHouse]=useState(""), [myName,setMyName]=useState(""), [pairName,setPairName]=useState("")
  const [assigns,setAssigns]=useState({})
  const totalPts=Object.entries(assigns).reduce((a,[id,n])=>{const t=LIB_DEFAULT.find(t=>t.id===id);return a+(t?t.pts*n:0)},0)
  const taskCount=Object.values(assigns).filter(n=>n>0).length
  const fi={width:"100%",padding:"15px 16px",borderRadius:16,border:"2px solid #E3DDF1",fontFamily:"'Nunito', system-ui",fontWeight:700,fontSize:16,color:C.text,outline:"none",boxSizing:"border-box",background:"#fff"}
  const fl={fontFamily:"'Nunito', system-ui",fontSize:12.5,fontWeight:800,color:"#6E6688",margin:"0 0 7px 4px"}
  return (
    <div style={{minHeight:"100vh",background:C.bg,display:"flex",flexDirection:"column"}}>
      {step>0&&(
        <div style={{padding:"24px 24px 0"}}>
          <div style={{display:"flex",gap:6}}>
            <div style={{flex:1,height:6,borderRadius:99,background:C.violet}}/>
            <div style={{flex:1,height:6,borderRadius:99,background:step>=2?C.violet:"#DDD6EC"}}/>
          </div>
          <div style={{fontFamily:F.body,fontSize:12,fontWeight:700,color:C.soft,marginTop:8}}>Passo {step} de 2</div>
        </div>
      )}
      {step===0&&(
        <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"40px 28px",textAlign:"center"}}>
          <div style={{width:108,height:108,borderRadius:32,background:"linear-gradient(160deg,#8B6BFF,#6A3DF0)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 8px 0 #5A28C0, 0 18px 40px rgba(106,61,240,.35)",marginBottom:28}}>
            <Icon name="home" size={58} color="#fff"/>
          </div>
          <div style={{fontFamily:F.display,fontWeight:800,fontSize:34,color:C.text,lineHeight:1.1}}>Casa</div>
          <div style={{fontFamily:F.body,fontWeight:700,fontSize:16,color:"#6E6688",marginTop:8,maxWidth:280,lineHeight:1.4}}>Transforme as tarefas da casa numa competição divertida entre vocês dois.</div>
          <div style={{display:"flex",gap:18,margin:"34px 0"}}>
            {[["emoji_events","Ranking",C.violet],["paid","Recompensas",C.gold],["local_fire_department","Sequências",C.fire]].map(([icon,label,col])=>(
              <div key={label} style={{textAlign:"center"}}>
                <div style={{width:54,height:54,borderRadius:16,background:"#fff",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 3px 0 rgba(0,0,0,.06)",marginBottom:6}}><Icon name={icon} size={28} color={col}/></div>
                <div style={{fontFamily:F.body,fontSize:11,fontWeight:800,color:C.soft}}>{label}</div>
              </div>
            ))}
          </div>
          <Btn3D onClick={()=>setStep(1)} style={{maxWidth:320}}>Criar nossa casa</Btn3D>
        </div>
      )}
      {step===1&&(
        <div style={{flex:1,padding:24,display:"flex",flexDirection:"column"}}>
          <div style={{fontFamily:F.display,fontWeight:800,fontSize:26,color:C.text,marginTop:4}}>Quem mora aqui?</div>
          <div style={{fontFamily:F.body,fontWeight:700,fontSize:14,color:C.soft,marginTop:4,marginBottom:24}}>Vamos configurar a casa de vocês.</div>
          <div style={fl}>NOME DA CASA</div>
          <input placeholder="Ex: Casa do Victor & Ingrid" value={house} onChange={e=>setHouse(e.target.value)} style={{...fi,marginBottom:18}}/>
          <div style={fl}>VOCÊ</div>
          <div style={{display:"flex",gap:11,alignItems:"center",marginBottom:18}}>
            <div style={{width:50,height:50,borderRadius:15,background:ME_GRAD,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,boxShadow:`0 4px 0 ${ME_SD}`}}><span style={{fontFamily:F.display,fontWeight:800,fontSize:22,color:"#fff"}}>{ini(myName)}</span></div>
            <input placeholder="Seu nome" value={myName} onChange={e=>setMyName(e.target.value)} style={fi}/>
          </div>
          <div style={fl}>SEU PAR</div>
          <div style={{display:"flex",gap:11,alignItems:"center"}}>
            <div style={{width:50,height:50,borderRadius:15,background:PAIR_GRAD,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,boxShadow:`0 4px 0 ${PAIR_SD}`}}><span style={{fontFamily:F.display,fontWeight:800,fontSize:22,color:"#fff"}}>{ini(pairName)}</span></div>
            <input placeholder="Nome do seu par" value={pairName} onChange={e=>setPairName(e.target.value)} style={fi}/>
          </div>
          <div style={{flex:1}}/>
          <Btn3D onClick={()=>setStep(2)} disabled={!house.trim()||!myName.trim()||!pairName.trim()}>Continuar</Btn3D>
        </div>
      )}
      {step===2&&(
        <div style={{flex:1,display:"flex",flexDirection:"column"}}>
          <div style={{padding:"4px 24px 14px"}}>
            <div style={{fontFamily:F.display,fontWeight:800,fontSize:26,color:C.text,lineHeight:1.15}}>O que você assume<br/>esta semana?</div>
            <div style={{fontFamily:F.body,fontWeight:700,fontSize:14,color:C.soft,marginTop:4}}>Toque para adicionar. Ajuste a quantidade depois.</div>
          </div>
          <div style={{flex:1,overflowY:"auto",padding:"0 16px",display:"flex",flexDirection:"column",gap:10,paddingBottom:130}}>
            {LIB_DEFAULT.map(task=>{
              const n=assigns[task.id]||0
              return (
                <div key={task.id} style={{...C.card,padding:"13px 16px",display:"flex",alignItems:"center",gap:12}}>
                  <TaskIcon task={task}/>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontFamily:F.display,fontWeight:700,fontSize:15.5,color:C.text}}>{task.name}</div>
                    <TaskMeta task={task}/>
                  </div>
                  {n===0?(
                    <button onClick={()=>setAssigns({...assigns,[task.id]:1})} style={{background:"none",color:C.violet,border:`2px solid ${C.violet}`,borderRadius:12,padding:"7px 12px",fontFamily:F.display,fontWeight:800,fontSize:13,cursor:"pointer",whiteSpace:"nowrap"}}>+ Assumir</button>
                  ):(
                    <div style={{display:"flex",alignItems:"center",background:C.violet,borderRadius:12,boxShadow:`0 3px 0 ${C.violetSd}`,flexShrink:0}}>
                      <button onClick={()=>setAssigns({...assigns,[task.id]:Math.max(0,n-1)})} style={{width:30,height:32,background:"none",border:"none",cursor:"pointer",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center"}}><Icon name="remove" size={18}/></button>
                      <span style={{fontFamily:F.display,fontWeight:800,fontSize:15,color:"#fff",minWidth:26,textAlign:"center"}}>{n}×</span>
                      <button onClick={()=>setAssigns({...assigns,[task.id]:n+1})} style={{width:30,height:32,background:"none",border:"none",cursor:"pointer",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center"}}><Icon name="add" size={18}/></button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
          <div style={{position:"fixed",bottom:0,left:0,right:0,maxWidth:430,margin:"0 auto",background:"#fff",borderTop:"1px solid #EFEBF8",padding:"12px 16px 28px",display:"flex",alignItems:"center",gap:10}}>
            <div style={{flex:1,lineHeight:1.2}}>
              <div style={{fontFamily:F.display,fontWeight:800,fontSize:16,color:C.text}}>{taskCount} tarefa{taskCount!==1?"s":""} · {totalPts} pts</div>
              <div style={{fontFamily:F.body,fontWeight:700,fontSize:12,color:C.soft}}>previstos na sua semana</div>
            </div>
            <Btn3D onClick={()=>onDone({house,myName,pairName,assigns})} disabled={taskCount===0} style={{width:"auto",padding:"14px 22px"}}>Começar</Btn3D>
          </div>
        </div>
      )}
    </div>
  )
}

// ── HOME ─────────────────────────────────────────────────
function HomeScreen({ state, dispatch, onOpenSettings }) {
  const u0=state.stats["0"], u1=state.stats["1"]
  const me=state.users[0], pair=state.users[1]
  const total=u0.month_points+u1.month_points
  let myPct=total>0?Math.round(u0.month_points/total*100):50
  myPct=Math.max(12,Math.min(88,myPct))
  const iLead=u0.month_points>=u1.month_points, isTie=u0.month_points===u1.month_points
  const diff=Math.abs(u0.month_points-u1.month_points)
  const greeting=()=>{ const h=new Date().getHours(); return h<12?"Bom dia":h<18?"Boa tarde":"Boa noite" }
  const myAssigns=state.draft.assigns?.["0"]||[]
  const nextTask=myAssigns.find(a=>(a.done||0)<a.count)
  const nextTaskData=nextTask?state.library.find(t=>t.id===nextTask.id):null
  const myTotal=myAssigns.reduce((a,x)=>a+x.count,0)
  const myDone=myAssigns.reduce((a,x)=>a+(x.done||0),0)
  const commitment=myTotal>0?Math.round(myDone/myTotal*100):null
  const myUnlocked=state.unlocked?.["0"]||[]
  const lastAch=myUnlocked.length>0?ACHS.find(a=>a.id===myUnlocked[myUnlocked.length-1]):null

  const Avatar=({grad,sd,name,size=64,fs=28,crown})=>(
    <div style={{position:"relative",width:size,margin:"0 auto 6px"}}>
      {crown&&<Icon name="crown" size={Math.round(size*.34)} color={C.gold} style={{position:"absolute",top:-Math.round(size*.27),left:"50%",transform:"translateX(-50%)"}}/>}
      <div style={{width:size,height:size,borderRadius:Math.round(size*.31),background:grad,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 4px 0 ${sd}`}}>
        <span style={{fontFamily:F.display,fontWeight:800,fontSize:fs,color:"#fff"}}>{name}</span>
      </div>
    </div>
  )

  return (
    <div style={{padding:"calc(env(safe-area-inset-top,20px) + 18px) 16px 100px",display:"flex",flexDirection:"column",gap:14}}>
      {/* Header */}
      <div style={{display:"flex",alignItems:"center",gap:11}}>
        <div style={{width:46,height:46,borderRadius:15,background:ME_GRAD,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 4px 0 ${ME_SD}`}}>
          <span style={{fontFamily:F.display,fontWeight:800,fontSize:21,color:"#fff"}}>{ini(me.name)}</span>
        </div>
        <div style={{flex:1,minWidth:0,lineHeight:1.1}}>
          <div style={{fontFamily:F.body,fontSize:12.5,fontWeight:700,color:C.soft}}>{greeting()},</div>
          <div style={{fontFamily:F.display,fontWeight:700,fontSize:19,color:C.text}}>{me.name}</div>
        </div>
        <Pill icon="local_fire_department" value={u0.streak} color={C.fire}/>
        <Pill icon="paid" value={u0.coins} color={C.goldTxt} iconColor={C.gold}/>
        <button onClick={onOpenSettings} style={{width:42,height:42,borderRadius:13,background:"#fff",border:"none",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 2px 0 rgba(33,27,51,.06)",cursor:"pointer",flexShrink:0}}>
          <Icon name="settings" size={22} color={C.soft}/>
        </button>
      </div>

      {/* Ranking */}
      <Card>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <div style={{display:"flex",alignItems:"center",gap:7}}>
            <Icon name="emoji_events" size={22} color={C.violet}/>
            <span style={{fontFamily:F.display,fontWeight:700,fontSize:17,color:C.text}}>Ranking de {monthName()}</span>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:4,background:C.bg,borderRadius:999,padding:"5px 10px"}}>
            <Icon name="schedule" size={15} color={C.soft}/><span style={{fontFamily:F.body,fontSize:12.5,fontWeight:800,color:C.soft}}>{daysLeft()} dias</span>
          </div>
        </div>
        <div style={{display:"flex",alignItems:"flex-end",justifyContent:"space-between",gap:8}}>
          <div style={{flex:1,textAlign:"center"}}>
            <Avatar grad={ME_GRAD} sd={ME_SD} name={ini(me.name)} crown={iLead}/>
            <div style={{fontFamily:F.body,fontWeight:800,fontSize:13.5,color:C.text}}>Você</div>
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
          <div style={{width:`${myPct}%`,background:ME_GRAD,transition:"width .5s"}}/>
          <div style={{flex:1,background:PAIR_GRAD}}/>
        </div>
        <div style={{textAlign:"center",marginTop:9,fontFamily:F.body,fontSize:12.5,fontWeight:800,color:C.violet}}>
          {total===0?"A disputa começa agora!":isTie?"Empate técnico!":iLead?`Você lidera por ${diff} pts 🔥`:`${pair.name} lidera por ${diff} pts`}
        </div>
      </Card>

      {/* Stats trio */}
      <div style={{display:"flex",gap:10}}>
        {[
          {icon:"military_tech",label:"Posição",       value:iLead||isTie?"1º":"2º",              color:C.gold},
          {icon:"verified",     label:"Comprometimento",value:commitment!=null?`${commitment}%`:"—", color:C.green},
          {icon:"check_circle", label:"Esta semana",   value:`${myDone}/${myTotal}`,               color:C.violet},
        ].map(({icon,label,value,color})=>(
          <div key={label} style={{flex:1,...C.card,padding:"13px 10px",textAlign:"center"}}>
            <Icon name={icon} size={22} color={color}/>
            <div style={{fontFamily:F.display,fontWeight:800,fontSize:19,color:C.text,marginTop:2}}>{value}</div>
            <div style={{fontFamily:F.body,fontSize:11,fontWeight:700,color:C.soft}}>{label}</div>
          </div>
        ))}
      </div>

      {/* Próxima tarefa */}
      {myTotal>0&&(nextTaskData?(
        <Card>
          <div style={{fontFamily:F.body,fontWeight:800,fontSize:12,color:C.soft,marginBottom:10,textTransform:"uppercase",letterSpacing:.5}}>Próxima tarefa</div>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14}}>
            <TaskIcon task={nextTaskData} size={48}/>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontFamily:F.display,fontWeight:700,fontSize:17,color:C.text}}>{nextTaskData.name}</div>
              <div style={{fontFamily:F.body,fontSize:12.5,fontWeight:700,color:C.soft}}>{nextTaskData.cat} · {nextTaskData.diff}{nextTask.count>1?` · ${nextTask.done||0}/${nextTask.count}`:""}</div>
            </div>
            <div style={{textAlign:"right",display:"flex",flexDirection:"column",gap:3,alignItems:"flex-end"}}>
              <PtsBolt n={`+${nextTaskData.pts}`} size={16}/><Coin n={`+${nextTaskData.coins}`} size={16}/>
            </div>
          </div>
          <Btn3D onClick={()=>{ if(navigator.vibrate)navigator.vibrate(8); dispatch({type:"COMPLETE",userId:"0",taskId:nextTask.id}) }}>Concluir tarefa</Btn3D>
        </Card>
      ):(
        <div style={{background:"linear-gradient(135deg,#E9F8EF,#D2F3DF)",borderRadius:22,padding:20,textAlign:"center",boxShadow:"0 3px 0 #C0ECCF"}}>
          <Icon name="task_alt" size={40} color={C.green}/>
          <div style={{fontFamily:F.display,fontWeight:800,fontSize:18,color:"#1B8F52",marginTop:4}}>Tudo concluído! 🎉</div>
          <div style={{fontFamily:F.body,fontWeight:700,fontSize:13,color:"#4FA877",marginTop:2}}>Você zerou suas tarefas da semana.</div>
        </div>
      ))}

      {/* Destaque */}
      <div style={{background:"linear-gradient(135deg,#FFF3D6,#FFE6A8)",borderRadius:22,padding:"14px 16px",display:"flex",alignItems:"center",gap:13,boxShadow:"0 3px 0 #F2D27E",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:0,bottom:0,width:40,background:"linear-gradient(90deg,transparent,rgba(255,255,255,.7),transparent)",animation:"shine 2.8s infinite"}}/>
        <div style={{width:46,height:46,borderRadius:14,background:"#fff",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 3px 0 #F2D27E",zIndex:1}}>
          <Icon name={lastAch?lastAch.icon:"local_fire_department"} size={26} color={C.gold}/>
        </div>
        <div style={{flex:1,zIndex:1,lineHeight:1.25}}>
          <div style={{fontFamily:F.body,fontSize:11,fontWeight:800,color:"#B7892A",letterSpacing:.5}}>{lastAch?"CONQUISTA DESBLOQUEADA":"SUA META"}</div>
          <div style={{fontFamily:F.display,fontWeight:700,fontSize:16,color:"#7A5A12"}}>
            {lastAch?lastAch.label:u0.streak>0?`Mantenha sua sequência de ${u0.streak} dia${u0.streak>1?"s":""}`:"Conclua sua 1ª tarefa hoje"}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── SETTINGS ─────────────────────────────────────────────
function SettingsScreen({ state, dispatch, onClose }) {
  const [house,setHouse]=useState(state.house.name)
  const [name0,setName0]=useState(state.users[0].name)
  const [name1,setName1]=useState(state.users[1].name)
  const [taskSheet,setTaskSheet]=useState(null)  // null | "new" | task obj
  const [rewardSheet,setRewardSheet]=useState(null)
  const [confirmDel,setConfirmDel]=useState(null) // {type,id}

  const saveNames=()=>{
    dispatch({type:"UPDATE_SETTINGS",house:house.trim()||state.house.name,name0:name0.trim()||state.users[0].name,name1:name1.trim()||state.users[1].name})
  }

  return (
    <div style={{position:"fixed",inset:0,background:C.bg,zIndex:900,overflowY:"auto",maxWidth:430,margin:"0 auto"}}>
      <div style={{padding:"calc(env(safe-area-inset-top,20px) + 14px) 16px 100px",display:"flex",flexDirection:"column",gap:16}}>
        {/* Header */}
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <button onClick={onClose} style={{width:40,height:40,borderRadius:12,background:"#fff",border:"none",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 2px 0 rgba(33,27,51,.06)",cursor:"pointer"}}><Icon name="arrow_back" size={22} color={C.text}/></button>
          <span style={{fontFamily:F.display,fontWeight:700,fontSize:22,color:C.text}}>Configurações</span>
        </div>

        {/* CASA */}
        <SectionLabel>Casa</SectionLabel>
        <Card style={{padding:16,display:"flex",flexDirection:"column",gap:0}}>
          <label style={lbl}>NOME DA CASA</label>
          <input value={house} onChange={e=>setHouse(e.target.value)} style={inp}/>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <div>
              <label style={lbl}>VOCÊ</label>
              <div style={{display:"flex",gap:8,alignItems:"center"}}>
                <div style={{width:36,height:36,borderRadius:11,background:ME_GRAD,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><span style={{fontFamily:F.display,fontWeight:800,fontSize:16,color:"#fff"}}>{ini(name0)}</span></div>
                <input value={name0} onChange={e=>setName0(e.target.value)} style={{...inp,marginBottom:0,flex:1}}/>
              </div>
            </div>
            <div>
              <label style={lbl}>SEU PAR</label>
              <div style={{display:"flex",gap:8,alignItems:"center"}}>
                <div style={{width:36,height:36,borderRadius:11,background:PAIR_GRAD,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><span style={{fontFamily:F.display,fontWeight:800,fontSize:16,color:"#fff"}}>{ini(name1)}</span></div>
                <input value={name1} onChange={e=>setName1(e.target.value)} style={{...inp,marginBottom:0,flex:1}}/>
              </div>
            </div>
          </div>
          <div style={{marginTop:14}}>
            <Btn3D onClick={saveNames} small>Salvar</Btn3D>
          </div>
        </Card>

        {/* TAREFAS */}
        <SectionLabel>Biblioteca de tarefas</SectionLabel>
        <div style={{...C.card,padding:"4px 14px"}}>
          {state.library.map((task,i)=>(
            <div key={task.id} style={{display:"flex",alignItems:"center",gap:10,padding:"11px 0",borderBottom:i<state.library.length-1?"1px solid #F2EEFA":"none"}}>
              <TaskIcon task={task} size={38}/>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontFamily:F.display,fontWeight:700,fontSize:14,color:C.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{task.name}</div>
                <div style={{fontFamily:F.body,fontSize:11,fontWeight:700,color:C.soft}}>{task.cat} · {task.pts}pts</div>
              </div>
              <button onClick={()=>setTaskSheet(task)} style={{width:32,height:32,borderRadius:10,background:"#F0ECFF",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><Icon name="edit" size={16} color={C.violet}/></button>
              <button onClick={()=>setConfirmDel({type:"task",id:task.id})} style={{width:32,height:32,borderRadius:10,background:"#FFF0F0",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><Icon name="delete" size={16} color="#D93434"/></button>
            </div>
          ))}
        </div>
        <button onClick={()=>setTaskSheet("new")} style={{background:"#fff",border:`2px dashed ${C.violet}`,borderRadius:16,padding:"13px 0",fontFamily:F.display,fontWeight:800,fontSize:15,color:C.violet,cursor:"pointer",width:"100%",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
          <Icon name="add" size={20} color={C.violet}/>Adicionar tarefa
        </button>

        {/* MARKET */}
        <SectionLabel>Recompensas do Market</SectionLabel>
        <div style={{...C.card,padding:"4px 14px"}}>
          {state.market.map((r,i)=>{
            const th=TH[r.th]||TH.violet
            return (
              <div key={r.id} style={{display:"flex",alignItems:"center",gap:10,padding:"11px 0",borderBottom:i<state.market.length-1?"1px solid #F2EEFA":"none"}}>
                <div style={{width:38,height:38,borderRadius:12,background:th.bg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,boxShadow:`0 2px 0 ${th.sd}`}}><Icon name={r.icon||"card_giftcard"} size={20} color={th.fg}/></div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontFamily:F.display,fontWeight:700,fontSize:14,color:C.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.name}</div>
                  <Coin n={r.cost} size={12}/>
                </div>
                <button onClick={()=>setRewardSheet(r)} style={{width:32,height:32,borderRadius:10,background:"#F0ECFF",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><Icon name="edit" size={16} color={C.violet}/></button>
                <button onClick={()=>setConfirmDel({type:"reward",id:r.id})} style={{width:32,height:32,borderRadius:10,background:"#FFF0F0",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><Icon name="delete" size={16} color="#D93434"/></button>
              </div>
            )
          })}
        </div>
        <button onClick={()=>setRewardSheet("new")} style={{background:"#fff",border:`2px dashed ${C.violet}`,borderRadius:16,padding:"13px 0",fontFamily:F.display,fontWeight:800,fontSize:15,color:C.violet,cursor:"pointer",width:"100%",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
          <Icon name="add" size={20} color={C.violet}/>Adicionar recompensa
        </button>
      </div>

      {/* Editors */}
      {taskSheet&&(
        <BottomSheet title={taskSheet==="new"?"Nova tarefa":"Editar tarefa"} onClose={()=>setTaskSheet(null)}>
          <TaskForm
            initial={taskSheet==="new"?{}:taskSheet}
            onSave={data=>{ dispatch(taskSheet==="new"?{type:"ADD_TASK",task:{...data,id:genId()}}:{type:"EDIT_TASK",taskId:taskSheet.id,updates:data}); setTaskSheet(null) }}
            onCancel={()=>setTaskSheet(null)}
          />
        </BottomSheet>
      )}
      {rewardSheet&&(
        <BottomSheet title={rewardSheet==="new"?"Nova recompensa":"Editar recompensa"} onClose={()=>setRewardSheet(null)}>
          <RewardForm
            initial={rewardSheet==="new"?{}:rewardSheet}
            onSave={data=>{ dispatch(rewardSheet==="new"?{type:"ADD_REWARD",reward:{...data,id:genId()}}:{type:"EDIT_REWARD",rewardId:rewardSheet.id,updates:data}); setRewardSheet(null) }}
            onCancel={()=>setRewardSheet(null)}
          />
        </BottomSheet>
      )}
      {confirmDel&&(
        <ConfirmSheet
          title={confirmDel.type==="task"?"Excluir tarefa?":"Excluir recompensa?"}
          msg="Essa ação não pode ser desfeita."
          confirmLabel="Excluir" danger
          onConfirm={()=>{ dispatch(confirmDel.type==="task"?{type:"DELETE_TASK",taskId:confirmDel.id}:{type:"DELETE_REWARD",rewardId:confirmDel.id}); setConfirmDel(null) }}
          onCancel={()=>setConfirmDel(null)}
        />
      )}
    </div>
  )
}

// ── DRAFT ─────────────────────────────────────────────────
function DraftScreen({ state, dispatch }) {
  const [showU,setShowU]=useState(0)
  const lib=state.library
  const a0=state.draft.assigns?.["0"]||[], a1=state.draft.assigns?.["1"]||[]
  const pts0=a0.reduce((a,x)=>a+x.count*(lib.find(t=>t.id===x.id)?.pts||0),0)
  const pts1=a1.reduce((a,x)=>a+x.count*(lib.find(t=>t.id===x.id)?.pts||0),0)
  const cnt0=a0.reduce((a,x)=>a+x.count,0), cnt1=a1.reduce((a,x)=>a+x.count,0)
  const ptsMax=Math.max(pts0,pts1,1), balanced=Math.abs(pts0-pts1)<=40
  const getCount=(u,id)=>(u===0?a0:a1).find(a=>a.id===id)?.count||0
  const getDone=(u,id)=>(u===0?a0:a1).find(a=>a.id===id)?.done||0
  const setCount=(u,id,n)=>dispatch({type:"DRAFT_SET",userId:String(u),taskId:id,count:Math.max(getDone(u,id),n)})

  return (
    <div style={{padding:"calc(env(safe-area-inset-top,20px) + 18px) 16px 140px",display:"flex",flexDirection:"column",gap:14}}>
      <div>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <Icon name="swap_horiz" size={26} color={C.violet}/>
          <span style={{fontFamily:F.display,fontWeight:700,fontSize:25,color:C.text}}>Draft Semanal</span>
        </div>
        <div style={{fontFamily:F.body,fontSize:13,fontWeight:700,color:C.soft,marginTop:2}}>Escolha quais tarefas você assume nesta semana.</div>
      </div>
      <Card>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <span style={{fontFamily:F.display,fontWeight:700,fontSize:15,color:C.text}}>Carga prevista</span>
          <div style={{display:"flex",alignItems:"center",gap:4,background:balanced?"#E6F8EF":"#FFF1E6",borderRadius:999,padding:"4px 9px"}}>
            <Icon name="balance" size={14} color={balanced?C.green:C.fire}/>
            <span style={{fontFamily:F.body,fontWeight:800,fontSize:12,color:balanced?C.green:C.fire}}>{balanced?"Equilibrado":"Desequilibrado"}</span>
          </div>
        </div>
        {[{name:state.users[0].name,pts:pts0,grad:ME_GRAD,trk:"#EEF4FF",txt:"#2E7BF0",i:ini(state.users[0].name)},
          {name:state.users[1].name,pts:pts1,grad:PAIR_GRAD,trk:"#FFEAF3",txt:"#FF4F9A",i:ini(state.users[1].name)}].map((r,idx)=>(
          <div key={idx} style={{display:"flex",alignItems:"center",gap:8,marginBottom:idx===0?7:0}}>
            <div style={{width:26,height:26,borderRadius:8,background:r.grad,display:"flex",alignItems:"center",justifyContent:"center"}}>
              <span style={{fontFamily:F.display,fontWeight:800,fontSize:13,color:"#fff"}}>{r.i}</span>
            </div>
            <div style={{flex:1,height:14,borderRadius:999,background:r.trk,overflow:"hidden"}}>
              <div style={{height:"100%",width:`${Math.round(r.pts/ptsMax*100)}%`,background:r.grad,transition:"width .3s"}}/>
            </div>
            <div style={{fontFamily:F.display,fontWeight:800,fontSize:14,color:r.txt,width:64,textAlign:"right"}}>{r.pts} pts</div>
          </div>
        ))}
      </Card>
      <div style={{display:"flex",background:"#E7E2F3",borderRadius:14,padding:4,gap:4}}>
        {[0,1].map(u=>(
          <button key={u} onClick={()=>setShowU(u)} style={{flex:1,border:"none",borderRadius:11,padding:"9px 0",cursor:"pointer",background:showU===u?"#fff":"transparent",color:showU===u?C.violet:C.soft,fontFamily:F.body,fontWeight:800,fontSize:13.5,boxShadow:showU===u?"0 2px 0 rgba(33,27,51,.05)":"none",transition:"all .2s"}}>
            {state.users[u].name} · {u===0?cnt0:cnt1}
          </button>
        ))}
      </div>
      <SectionLabel>Biblioteca de tarefas</SectionLabel>
      <div style={{...C.card,padding:"4px 14px",marginTop:-4}}>
        {lib.map((task,i)=>{
          const n=getCount(showU,task.id)
          return (
            <div key={task.id} style={{display:"flex",alignItems:"center",gap:11,padding:"13px 0",borderBottom:i<lib.length-1?"1px solid #F2EEFA":"none"}}>
              <TaskIcon task={task}/>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontFamily:F.display,fontWeight:700,fontSize:15.5,color:C.text}}>{task.name}</div>
                <TaskMeta task={task}/>
              </div>
              {n===0?(
                <button onClick={()=>setCount(showU,task.id,1)} style={{background:"none",color:C.violet,border:`2px solid ${C.violet}`,borderRadius:12,padding:"7px 12px",fontFamily:F.display,fontWeight:800,fontSize:13,cursor:"pointer",whiteSpace:"nowrap"}}>+ Assumir</button>
              ):(
                <div style={{display:"flex",alignItems:"center",background:C.violet,borderRadius:12,boxShadow:`0 3px 0 ${C.violetSd}`,flexShrink:0}}>
                  <button onClick={()=>setCount(showU,task.id,n-1)} style={{width:30,height:32,background:"none",border:"none",cursor:"pointer",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center"}}><Icon name="remove" size={18}/></button>
                  <span style={{fontFamily:F.display,fontWeight:800,fontSize:15,color:"#fff",minWidth:26,textAlign:"center"}}>{n}×</span>
                  <button onClick={()=>setCount(showU,task.id,n+1)} style={{width:30,height:32,background:"none",border:"none",cursor:"pointer",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center"}}><Icon name="add" size={18}/></button>
                </div>
              )}
            </div>
          )
        })}
      </div>
      <div style={{position:"fixed",bottom:0,left:0,right:0,maxWidth:430,margin:"0 auto",background:"#fff",borderTop:"1px solid #EFEBF8",padding:"12px 16px 28px",display:"flex",alignItems:"center",gap:10,zIndex:10}}>
        <div style={{flex:1,lineHeight:1.2}}>
          <div style={{fontFamily:F.display,fontWeight:800,fontSize:16,color:C.text}}>{cnt0+cnt1} tarefas assumidas</div>
          <div style={{fontFamily:F.body,fontWeight:700,fontSize:12,color:C.soft,display:"flex",alignItems:"center",gap:4}}>
            {pts0+pts1} pts · bônus de <Coin n="+50" size={13}/> ao concluir tudo
          </div>
        </div>
        <Btn3D onClick={()=>dispatch({type:"DRAFT_CONFIRM"})} disabled={cnt0+cnt1===0} style={{width:"auto",padding:"13px 18px",fontSize:15}}>
          {state.draft.confirmed?"Confirmado ✓":"Confirmar"}
        </Btn3D>
      </div>
    </div>
  )
}

// ── TASKS ─────────────────────────────────────────────────
function TasksScreen({ state, dispatch }) {
  const lib=state.library
  const myAssigns=state.draft.assigns?.["0"]||[]
  const total=myAssigns.reduce((a,x)=>a+x.count,0)
  const done=myAssigns.reduce((a,x)=>a+(x.done||0),0)
  const allDone=total>0&&done>=total
  const bonusGiven=state.draft.bonus_given
  const history=(state.history||[]).filter(h=>h.userId==="0").slice().reverse()

  return (
    <div style={{padding:"calc(env(safe-area-inset-top,20px) + 18px) 16px 100px",display:"flex",flexDirection:"column",gap:14}}>
      <div>
        <span style={{fontFamily:F.display,fontWeight:700,fontSize:25,color:C.text}}>Minhas Tarefas</span>
        <div style={{fontFamily:F.body,fontSize:13,fontWeight:700,color:C.soft,marginTop:2}}>Ranking de {monthName()} · faltam {daysLeft()} dias</div>
      </div>

      {total>0&&(
        <div style={{background:C.violet,borderRadius:22,padding:16,color:"#fff",boxShadow:`0 4px 0 ${C.violetSd}, 0 10px 24px rgba(123,91,255,.25)`,position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",top:-30,right:-20,width:120,height:120,borderRadius:"50%",background:"rgba(255,255,255,.1)"}}/>
          <div style={{display:"flex",alignItems:"flex-end",justifyContent:"space-between",position:"relative"}}>
            <div>
              <div style={{fontFamily:F.body,fontSize:12.5,fontWeight:800,opacity:.85}}>Progresso da semana</div>
              <div style={{fontFamily:F.display,fontWeight:800,fontSize:30,lineHeight:1.1}}>{done}<span style={{fontSize:18,opacity:.75}}> / {total}</span></div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:6,background:"rgba(0,0,0,.18)",borderRadius:999,padding:"6px 11px"}}>
              {allDone&&bonusGiven
                ?<><Icon name="check_circle" size={18} color="#5BE39A"/><span style={{fontFamily:F.display,fontWeight:800,fontSize:14}}>+50 ganho!</span></>
                :<><Icon name="paid" size={18} color={C.gold}/><span style={{fontFamily:F.display,fontWeight:800,fontSize:14}}>+50 ao zerar</span></>}
            </div>
          </div>
          <div style={{marginTop:12,height:12,borderRadius:999,background:"rgba(0,0,0,.2)",overflow:"hidden",position:"relative"}}>
            <div style={{height:"100%",width:`${total>0?done/total*100:0}%`,background:"linear-gradient(90deg,#FFD45C,#FFB323)",borderRadius:999,transition:"width .4s"}}/>
          </div>
        </div>
      )}

      {myAssigns.length===0?(
        <div style={{...C.card,padding:"28px 20px",textAlign:"center"}}>
          <Icon name="inbox" size={40} color="#C9C3D6"/>
          <div style={{fontFamily:F.display,fontWeight:800,fontSize:17,color:C.text,marginTop:6}}>Nenhuma tarefa assumida</div>
          <div style={{fontFamily:F.body,fontWeight:700,fontSize:13,color:C.soft,marginTop:2}}>Vá ao <span style={{color:C.violet}}>Draft</span> e escolha suas tarefas da semana.</div>
        </div>
      ):(
        <div style={{...C.card,padding:"4px 14px"}}>
          {myAssigns.map((assign,i)=>{
            const task=lib.find(t=>t.id===assign.id); if(!task) return null
            const tDone=assign.done||0, tTotal=assign.count, isOk=tDone>=tTotal
            return (
              <div key={assign.id} style={{display:"flex",alignItems:"center",gap:11,padding:"13px 0",borderBottom:i<myAssigns.length-1?"1px solid #F2EEFA":"none"}}>
                <TaskIcon task={task}/>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontFamily:F.display,fontWeight:700,fontSize:15.5,color:isOk?C.soft:C.text,textDecoration:isOk?"line-through":"none"}}>{task.name}</div>
                  {tTotal>1?(
                    <div style={{display:"flex",alignItems:"center",gap:6}}>
                      <div style={{flex:1,maxWidth:100,height:7,borderRadius:999,background:"#EEEAF6",overflow:"hidden"}}>
                        <div style={{height:"100%",width:`${tDone/tTotal*100}%`,background:isOk?C.green:C.violet,borderRadius:999}}/>
                      </div>
                      <span style={{fontFamily:F.body,fontSize:11.5,fontWeight:800,color:C.soft}}>{tDone} / {tTotal}</span>
                    </div>
                  ):(
                    <div style={{fontFamily:F.body,fontSize:11.5,fontWeight:800,color:isOk?C.green:C.soft,display:"flex",alignItems:"center",gap:4}}>
                      {isOk?"Concluída":<><PtsBolt n={`+${task.pts}`} size={13}/></>}
                    </div>
                  )}
                </div>
                {/* Botões de ação */}
                <div style={{display:"flex",gap:6,flexShrink:0}}>
                  {tDone>0&&(
                    <button onClick={()=>dispatch({type:"UNDO_COMPLETE",userId:"0",taskId:assign.id})}
                      style={{width:36,height:36,borderRadius:"50%",border:"none",cursor:"pointer",background:"#F0ECFF",display:"flex",alignItems:"center",justifyContent:"center"}}>
                      <Icon name="remove" size={18} color={C.violet}/>
                    </button>
                  )}
                  <button onClick={()=>{ if(!isOk){ if(navigator.vibrate)navigator.vibrate(8); dispatch({type:"COMPLETE",userId:"0",taskId:assign.id}) }}} disabled={isOk}
                    style={{width:38,height:38,borderRadius:"50%",border:"none",cursor:isOk?"default":"pointer",background:isOk?C.green:C.violet,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:isOk?"0 3px 0 #1FA85B":`0 3px 0 ${C.violetSd}`}}>
                    <Icon name={isOk?"check":"add"} size={22} color="#fff"/>
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {history.length>0&&(
        <>
          <div style={{fontFamily:F.body,fontWeight:800,fontSize:12,color:C.soft,letterSpacing:.5,textTransform:"uppercase",margin:"0 4px"}}>Histórico completo</div>
          <div style={{...C.card,padding:"4px 14px"}}>
            {history.map((h,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"11px 0",borderBottom:i<history.length-1?"1px solid #F2EEFA":"none"}}>
                <Icon name="check_circle" size={20} color={C.green}/>
                <div style={{flex:1,minWidth:0,fontFamily:F.body,fontWeight:700,fontSize:13.5,color:C.text,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{h.taskName}</div>
                <span style={{fontFamily:F.body,fontSize:12,fontWeight:700,color:C.softer}}>{h.date}</span>
                <span style={{fontFamily:F.display,fontWeight:800,fontSize:13,color:C.violet}}>+{h.pts}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

// ── MARKET ────────────────────────────────────────────────
function MarketScreen({ state, dispatch, showToast }) {
  const mkt=state.market
  const coins=state.stats["0"].coins
  const nextReward=mkt.filter(r=>coins<r.cost).sort((a,b)=>a.cost-b.cost)[0]
  const featPct=nextReward?Math.min(100,Math.round(coins/nextReward.cost*100)):100
  const [confirmItem,setConfirmItem]=useState(null)
  const TIERS=[["Baixo","Baixo custo"],["Médio","Médio custo"],["Alto","Alto custo"]]

  const handleConfirm=()=>{
    if(!confirmItem||coins<confirmItem.cost) return
    if(navigator.vibrate) navigator.vibrate(12)
    const redemptionId=genId()
    dispatch({type:"REDEEM",userId:"0",rewardId:confirmItem.id,redemptionId})
    showToast(`🎁 ${confirmItem.name} resgatado!`,"Desfazer",()=>dispatch({type:"UNDO_REDEEM",redemptionId,userId:"0",cost:confirmItem.cost}))
    setConfirmItem(null)
  }

  return (
    <div style={{padding:"calc(env(safe-area-inset-top,20px) + 18px) 16px 100px",display:"flex",flexDirection:"column",gap:16}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <span style={{fontFamily:F.display,fontWeight:700,fontSize:25,color:C.text}}>Market</span>
        <div style={{display:"flex",alignItems:"center",gap:6,background:"linear-gradient(135deg,#FFD45C,#FFB323)",borderRadius:999,padding:"8px 14px",boxShadow:"0 4px 0 #E0900A"}}>
          <Icon name="paid" size={20} color="#fff"/><span style={{fontFamily:F.display,fontWeight:800,fontSize:18,color:"#fff"}}>{coins}</span>
        </div>
      </div>

      {nextReward&&(
        <div style={{background:"linear-gradient(135deg,#FF7DB5,#FF4F9A)",borderRadius:22,padding:16,color:"#fff",boxShadow:"0 4px 0 #E02E7D, 0 10px 24px rgba(255,79,154,.22)",position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",top:-25,right:-15,width:110,height:110,borderRadius:"50%",background:"rgba(255,255,255,.12)"}}/>
          <div style={{fontFamily:F.body,fontSize:11,fontWeight:800,letterSpacing:.5,opacity:.9}}>PRÓXIMA RECOMPENSA</div>
          <div style={{display:"flex",alignItems:"center",gap:13,marginTop:8,position:"relative"}}>
            <div style={{width:52,height:52,borderRadius:16,background:"rgba(255,255,255,.22)",display:"flex",alignItems:"center",justifyContent:"center"}}><Icon name={nextReward.icon} size={30} color="#fff"/></div>
            <div style={{flex:1}}>
              <div style={{fontFamily:F.display,fontWeight:700,fontSize:19}}>{nextReward.name}</div>
              <div style={{fontFamily:F.body,fontSize:12.5,fontWeight:700,opacity:.9}}>Faltam {nextReward.cost-coins} moedas</div>
            </div>
          </div>
          <div style={{marginTop:12,height:10,borderRadius:999,background:"rgba(0,0,0,.18)",overflow:"hidden"}}>
            <div style={{height:"100%",width:`${featPct}%`,background:"#fff",borderRadius:999,transition:"width .4s"}}/>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",marginTop:6,fontFamily:F.body,fontSize:12,fontWeight:800}}><span>{coins} / {nextReward.cost}</span><span style={{opacity:.9}}>{featPct}%</span></div>
        </div>
      )}

      {TIERS.map(([tier,label])=>{
        const items=mkt.filter(r=>r.tier===tier)
        if(!items.length) return null
        return (
          <div key={tier}>
            <SectionLabel>{label}</SectionLabel>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              {items.map(r=>{
                const th=TH[r.th]||TH.violet, can=coins>=r.cost
                return (
                  <div key={r.id} style={{...C.card,padding:14,textAlign:"center"}}>
                    <div style={{width:48,height:48,borderRadius:15,background:can?th.bg:"#F1EFF6",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 8px",boxShadow:can?`0 3px 0 ${th.sd}`:"none"}}>
                      <Icon name={r.icon} size={26} color={can?th.fg:"#A39DB4"}/>
                    </div>
                    <div style={{fontFamily:F.display,fontWeight:700,fontSize:14.5,color:C.text,marginBottom:8,lineHeight:1.2,minHeight:35,display:"flex",alignItems:"center",justifyContent:"center"}}>{r.name}</div>
                    {can?(
                      <button onClick={()=>setConfirmItem(r)} style={{width:"100%",background:C.violet,color:"#fff",border:"none",borderRadius:12,padding:9,fontFamily:F.display,fontWeight:800,fontSize:13.5,boxShadow:`0 3px 0 ${C.violetSd}`,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:4}}>
                        <Icon name="paid" size={15} color={C.gold}/>{r.cost}
                      </button>
                    ):(
                      <div style={{background:"#EEEAF6",color:"#A39DB4",borderRadius:12,padding:9,fontFamily:F.display,fontWeight:800,fontSize:13.5,display:"flex",alignItems:"center",justifyContent:"center",gap:4}}>
                        <Icon name="lock" size={15}/>{r.cost}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}

      {confirmItem&&(
        <ConfirmSheet
          title={`Resgatar "${confirmItem.name}"?`}
          msg={`Vai custar ${confirmItem.cost} moedas. Você tem ${coins}.`}
          confirmLabel={`Resgatar · ${confirmItem.cost} 🪙`}
          onConfirm={handleConfirm}
          onCancel={()=>setConfirmItem(null)}
        />
      )}
    </div>
  )
}

// ── PROFILE ──────────────────────────────────────────────
function ProfileScreen({ state, dispatch }) {
  const [activeTab,setActiveTab]=useState("perfil")
  const uid=String(state.viewUser)
  const user=state.users[state.viewUser]
  const stats=state.stats[uid]
  const unlocked=state.unlocked?.[uid]||[]
  const isMe=state.viewUser===0
  const pairIdx=isMe?1:0
  const grad=isMe?ME_GRAD:PAIR_GRAD, sd=isMe?ME_SD:PAIR_SD
  const assigns=state.draft.assigns?.[uid]||[]
  const tot=assigns.reduce((a,x)=>a+x.count,0), don=assigns.reduce((a,x)=>a+(x.done||0),0)
  const commitment=tot>0?Math.round(don/tot*100):100
  const partnerStats=state.stats[String(pairIdx)]
  const hallPos=stats.hall_points>=partnerStats.hall_points?"1º":"2º"
  const myRedemptions=(state.redemptions||[]).filter(r=>r.userId===uid).slice().reverse()

  return (
    <div style={{padding:"calc(env(safe-area-inset-top,20px) + 18px) 16px 100px",display:"flex",flexDirection:"column",gap:14}}>
      {/* Head compacto */}
      <Card style={{display:"flex",alignItems:"center",gap:14,padding:18}}>
        <div style={{width:66,height:66,borderRadius:20,background:grad,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 4px 0 ${sd}`,flexShrink:0}}>
          <span style={{fontFamily:F.display,fontWeight:800,fontSize:30,color:"#fff"}}>{ini(user.name)}</span>
        </div>
        <div style={{flex:1,minWidth:0,lineHeight:1.2}}>
          <div style={{fontFamily:F.display,fontWeight:700,fontSize:21,color:C.text}}>{user.name}</div>
          <div style={{display:"inline-flex",alignItems:"center",gap:4,background:"#F0ECFF",color:C.violet,borderRadius:999,padding:"3px 9px",fontFamily:F.body,fontSize:11.5,fontWeight:800,marginTop:3}}>
            <Icon name="military_tech" size={14}/>{getTitle(stats.tasks_done)}
          </div>
        </div>
        <div style={{width:62,height:62,borderRadius:"50%",background:`conic-gradient(${C.green} ${commitment}%, #ECE7F5 0)`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
          <div style={{width:48,height:48,borderRadius:"50%",background:"#fff",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",lineHeight:1}}>
            <span style={{fontFamily:F.display,fontWeight:800,fontSize:15,color:C.green}}>{commitment}%</span>
            <span style={{fontSize:7.5,fontFamily:F.body,fontWeight:800,color:C.soft}}>COMPROM.</span>
          </div>
        </div>
      </Card>

      {/* Tab switcher */}
      <div style={{display:"flex",background:"#E7E2F3",borderRadius:14,padding:4,gap:4}}>
        {[["perfil","Perfil"],["resgates","Resgates"]].map(([id,label])=>(
          <button key={id} onClick={()=>setActiveTab(id)} style={{flex:1,border:"none",borderRadius:11,padding:"9px 0",cursor:"pointer",background:activeTab===id?"#fff":"transparent",color:activeTab===id?C.violet:C.soft,fontFamily:F.body,fontWeight:800,fontSize:13.5,boxShadow:activeTab===id?"0 2px 0 rgba(33,27,51,.05)":"none",transition:"all .2s"}}>{label}</button>
        ))}
      </div>

      {activeTab==="perfil"&&(
        <>
          {/* Stats 2×2 */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            {[
              {label:"Tarefas concluídas", value:stats.tasks_done,        icon:"task_alt",              color:C.green},
              {label:"Moedas",             value:stats.coins,             icon:"paid",                  color:C.gold},
              {label:"Melhor sequência",   value:`${stats.best_streak} dias`, icon:"local_fire_department", color:C.fire},
              {label:"Pontos totais",      value:stats.hall_points,       icon:"bolt",                  color:C.violet},
            ].map(({label,value,icon,color})=>(
              <div key={label} style={{...C.card,padding:14,display:"flex",alignItems:"center",gap:11}}>
                <Icon name={icon} size={28} color={color}/>
                <div style={{minWidth:0}}>
                  <div style={{fontFamily:F.display,fontWeight:800,fontSize:20,color:C.text,lineHeight:1}}>{value}</div>
                  <div style={{fontFamily:F.body,fontSize:11,fontWeight:700,color:C.soft}}>{label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Conquistas */}
          <SectionLabel>Conquistas</SectionLabel>
          <div style={{...C.card,padding:16,marginTop:-4}}>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"14px 12px"}}>
              {ACHS.map(ach=>{
                const got=unlocked.includes(ach.id)
                return (
                  <div key={ach.id} style={{textAlign:"center"}}>
                    <div style={{width:54,height:54,borderRadius:"50%",background:got?(GRADS[ach.th]||GRADS.violet):"#F1EFF6",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 5px",boxShadow:got?`0 3px 0 ${GRADSD[ach.th]||GRADSD.violet}`:"none"}}>
                      <Icon name={got?ach.icon:"lock"} size={got?27:24} color={got?"#fff":"#C2BBD2"}/>
                    </div>
                    <div style={{fontFamily:F.body,fontSize:10,fontWeight:800,color:got?"#5a5468":C.softer,lineHeight:1.15}}>{ach.label}</div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Hall da Fama */}
          <div style={{background:"linear-gradient(135deg,#2A1E4D,#3D2C6E)",borderRadius:22,padding:16,color:"#fff",boxShadow:"0 4px 0 #1B1333",position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",top:-20,right:-10,width:90,height:90,borderRadius:"50%",background:"rgba(255,255,255,.06)"}}/>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12,position:"relative"}}>
              <Icon name="workspace_premium" size={22} color={C.gold}/>
              <span style={{fontFamily:F.display,fontWeight:700,fontSize:16}}>Hall da Fama</span>
              <span style={{fontFamily:F.body,fontSize:11,fontWeight:700,color:"rgba(255,255,255,.6)",marginLeft:"auto"}}>histórico de sempre</span>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:12,position:"relative"}}>
              <div style={{flex:1}}>
                <div style={{fontFamily:F.body,fontSize:11.5,fontWeight:700,color:"rgba(255,255,255,.7)"}}>Pontos acumulados</div>
                <div style={{fontFamily:F.display,fontWeight:800,fontSize:28}}>{stats.hall_points}</div>
              </div>
              <div style={{textAlign:"center",background:"rgba(255,255,255,.1)",borderRadius:16,padding:"10px 16px"}}>
                <div style={{fontFamily:F.display,fontWeight:800,fontSize:22,color:C.gold}}>{hallPos}</div>
                <div style={{fontFamily:F.body,fontSize:10,fontWeight:800,color:"rgba(255,255,255,.7)"}}>na casa</div>
              </div>
            </div>
          </div>

          {/* Trocar usuário */}
          <button onClick={()=>dispatch({type:"SWITCH_USER"})} style={{background:"#fff",border:`2px solid #E3DDF1`,borderRadius:16,padding:14,display:"flex",alignItems:"center",justifyContent:"center",gap:8,fontFamily:F.display,fontWeight:800,fontSize:15,color:C.violet,cursor:"pointer",width:"100%"}}>
            <Icon name="sync_alt" size={20}/>Ver perfil de {state.users[pairIdx].name}
          </button>
          <div style={{textAlign:"center",fontFamily:F.body,fontSize:11,fontWeight:700,color:C.softer}}>{state.house.name} · versão local</div>
        </>
      )}

      {activeTab==="resgates"&&(
        <>
          {myRedemptions.length===0?(
            <div style={{...C.card,padding:"32px 20px",textAlign:"center"}}>
              <Icon name="card_giftcard" size={40} color="#C9C3D6"/>
              <div style={{fontFamily:F.display,fontWeight:800,fontSize:17,color:C.text,marginTop:8}}>Nenhuma recompensa resgatada</div>
              <div style={{fontFamily:F.body,fontWeight:700,fontSize:13,color:C.soft,marginTop:4}}>Acumule moedas e vá ao Market!</div>
            </div>
          ):(
            <>
              <div style={{fontFamily:F.body,fontWeight:700,fontSize:13,color:C.soft}}>
                {myRedemptions.filter(r=>!r.used).length} pendente{myRedemptions.filter(r=>!r.used).length!==1?"s":""} · {myRedemptions.filter(r=>r.used).length} utilizada{myRedemptions.filter(r=>r.used).length!==1?"s":""}
              </div>
              <div style={{...C.card,padding:"4px 14px"}}>
                {myRedemptions.map((red,i)=>{
                  const rItem=state.market.find(r=>r.id===red.rewardId)
                  const th=TH[rItem?.th||"violet"]||TH.violet
                  return (
                    <div key={red.id} style={{display:"flex",alignItems:"center",gap:12,padding:"13px 0",borderBottom:i<myRedemptions.length-1?"1px solid #F2EEFA":"none",opacity:red.used?.65:1}}>
                      <div style={{width:42,height:42,borderRadius:13,background:th.bg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,boxShadow:`0 2px 0 ${th.sd}`}}>
                        <Icon name={rItem?.icon||"card_giftcard"} size={22} color={th.fg}/>
                      </div>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontFamily:F.display,fontWeight:700,fontSize:14.5,color:C.text,textDecoration:red.used?"line-through":"none"}}>{red.rewardName}</div>
                        <div style={{fontFamily:F.body,fontSize:11.5,fontWeight:700,color:C.soft}}>{red.date} · <Coin n={red.cost} size={12}/></div>
                      </div>
                      <button onClick={()=>dispatch({type:"MARK_USED",redemptionId:red.id})}
                        style={{flexShrink:0,background:red.used?"#E9F8EF":"#F0ECFF",border:"none",borderRadius:10,padding:"6px 10px",cursor:"pointer",display:"flex",alignItems:"center",gap:4}}>
                        <Icon name={red.used?"check_circle":"radio_button_unchecked"} size={16} color={red.used?C.green:C.softer}/>
                        <span style={{fontFamily:F.body,fontWeight:800,fontSize:11,color:red.used?C.green:C.softer}}>{red.used?"Usada":"Marcar"}</span>
                      </button>
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}

// ── REDUCER ──────────────────────────────────────────────
function reduce(prev, action) {
  switch(action.type) {
    case "INIT": {
      const { house, myName, pairName, assigns } = action
      const s = blankState()
      s.house.name=house; s.users[0].name=myName; s.users[1].name=pairName
      s.draft.week_id=weekId(); s.draft.confirmed=true
      s.draft.assigns["0"]=Object.entries(assigns).filter(([,n])=>n>0).map(([id,count])=>({id,count,done:0}))
      return s
    }
    case "DRAFT_SET": {
      const {userId,taskId,count}=action
      const d={...prev.draft,assigns:{...prev.draft.assigns}}
      const arr=[...(d.assigns[userId]||[])], idx=arr.findIndex(a=>a.id===taskId)
      if(count===0) d.assigns[userId]=arr.filter(a=>a.id!==taskId)
      else if(idx>=0) { arr[idx]={...arr[idx],count}; d.assigns[userId]=arr }
      else d.assigns[userId]=[...arr,{id:taskId,count,done:0}]
      return {...prev,draft:d}
    }
    case "DRAFT_CONFIRM": {
      const wid=weekId()
      if(prev.draft.week_id!==wid) {
        const assigns={}
        for(const [uid,arr] of Object.entries(prev.draft.assigns||{})) assigns[uid]=arr.map(a=>({...a,done:0}))
        return {...prev,draft:{...prev.draft,week_id:wid,confirmed:true,bonus_given:false,assigns}}
      }
      return {...prev,draft:{...prev.draft,confirmed:true}}
    }
    case "COMPLETE": {
      const {userId,taskId}=action
      const task=(prev.library||LIB_DEFAULT).find(t=>t.id===taskId); if(!task) return prev
      const s0=applyStreak({...prev.stats[userId]})
      const earned=Math.round(task.coins*(1+sBon(s0.streak)))
      s0.month_points+=task.pts; s0.hall_points+=task.pts; s0.coins+=earned
      s0.tasks_done+=1; s0.task_counts={...(s0.task_counts||{}),[taskId]:(s0.task_counts?.[taskId]||0)+1}
      const assigns={}
      for(const [uid,arr] of Object.entries(prev.draft.assigns||{})) {
        assigns[uid]=uid===userId?arr.map(a=>a.id===taskId?{...a,done:Math.min(a.count,(a.done||0)+1)}:a):arr
      }
      let bonusGiven=prev.draft.bonus_given, gotBonus=false
      if(!bonusGiven) {
        const mine=assigns[userId]||[]
        if(mine.length>0&&mine.every(a=>(a.done||0)>=a.count)) {
          s0.coins+=50; bonusGiven=true; gotBonus=true
          if(navigator.vibrate) navigator.vibrate([50,30,100,30,200])
        }
      }
      const now=new Date()
      const dateStr=`${now.toLocaleDateString("pt-BR")} ${now.toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"})}`
      const hist={userId,taskId,taskName:task.name,pts:task.pts,coins:earned,date:dateStr}
      const curUnl=prev.unlocked?.[userId]||[]
      const newAchs=checkAchs(s0,curUnl)
      return {
        ...prev,stats:{...prev.stats,[userId]:s0},draft:{...prev.draft,assigns,bonus_given:bonusGiven},
        history:[...(prev.history||[]),hist],unlocked:{...prev.unlocked,[userId]:[...curUnl,...newAchs]},
        _newAchs:newAchs,_reward:{pts:task.pts,coins:earned,bonus:gotBonus},
      }
    }
    case "UNDO_COMPLETE": {
      const {userId,taskId}=action
      const arr=(prev.draft.assigns?.[userId]||[]), aIdx=arr.findIndex(a=>a.id===taskId)
      if(aIdx===-1||(arr[aIdx].done||0)===0) return prev
      const hist=[...(prev.history||[])]
      let ptsRem=0, coinsRem=0
      const lIdx=[...hist].reverse().findIndex(h=>h.userId===userId&&h.taskId===taskId)
      if(lIdx>=0) { const ri=hist.length-1-lIdx; ptsRem=hist[ri].pts; coinsRem=hist[ri].coins; hist.splice(ri,1) }
      const newArr=arr.map((a,i)=>i===aIdx?{...a,done:Math.max(0,(a.done||0)-1)}:a)
      const assigns={...prev.draft.assigns,[userId]:newArr}
      let bonusGiven=prev.draft.bonus_given, coinsTotal=coinsRem
      if(bonusGiven&&!newArr.every(a=>(a.done||0)>=a.count)) { coinsTotal+=50; bonusGiven=false }
      const s0={...prev.stats[userId]}
      s0.month_points=Math.max(0,s0.month_points-ptsRem); s0.hall_points=Math.max(0,s0.hall_points-ptsRem)
      s0.coins=Math.max(0,s0.coins-coinsTotal); s0.tasks_done=Math.max(0,s0.tasks_done-1)
      s0.task_counts={...s0.task_counts,[taskId]:Math.max(0,(s0.task_counts?.[taskId]||1)-1)}
      return {...prev,stats:{...prev.stats,[userId]:s0},draft:{...prev.draft,assigns,bonus_given:bonusGiven},history:hist}
    }
    case "REDEEM": {
      const {userId,rewardId,redemptionId}=action
      const r=(prev.market||MKT_DEFAULT).find(x=>x.id===rewardId); if(!r) return prev
      const s0={...prev.stats[userId]}; if(s0.coins<r.cost) return prev
      s0.coins-=r.cost
      const now=new Date()
      const dateStr=`${now.toLocaleDateString("pt-BR")} ${now.toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"})}`
      const red={id:redemptionId||genId(),userId,rewardId,rewardName:r.name,cost:r.cost,date:dateStr,used:false}
      return {...prev,stats:{...prev.stats,[userId]:s0},redemptions:[...(prev.redemptions||[]),red]}
    }
    case "UNDO_REDEEM": {
      const {redemptionId,userId,cost}=action
      const s0={...prev.stats[userId]}; s0.coins+=cost
      return {...prev,stats:{...prev.stats,[userId]:s0},redemptions:(prev.redemptions||[]).filter(r=>r.id!==redemptionId)}
    }
    case "MARK_USED": {
      const {redemptionId}=action
      return {...prev,redemptions:(prev.redemptions||[]).map(r=>r.id===redemptionId?{...r,used:!r.used}:r)}
    }
    case "UPDATE_SETTINGS": {
      const {house,name0,name1}=action
      const users=[{...prev.users[0],name:name0||prev.users[0].name},{...prev.users[1],name:name1||prev.users[1].name}]
      return {...prev,house:{...prev.house,name:house||prev.house.name},users}
    }
    case "ADD_TASK":    return {...prev,library:[...(prev.library||[]),action.task]}
    case "EDIT_TASK":   return {...prev,library:(prev.library||[]).map(t=>t.id===action.taskId?{...t,...action.updates}:t)}
    case "DELETE_TASK": return {...prev,library:(prev.library||[]).filter(t=>t.id!==action.taskId)}
    case "ADD_REWARD":  return {...prev,market:[...(prev.market||[]),action.reward]}
    case "EDIT_REWARD": return {...prev,market:(prev.market||[]).map(r=>r.id===action.rewardId?{...r,...action.updates}:r)}
    case "DELETE_REWARD": return {...prev,market:(prev.market||[]).filter(r=>r.id!==action.rewardId)}
    case "SWITCH_USER": return {...prev,viewUser:prev.viewUser===0?1:0}
    case "RESET":       return blankState()
    default: return prev
  }
}

// ── APP ROOT ─────────────────────────────────────────────
const TABS = [
  {id:"home",   icon:"home",      label:"Início" },
  {id:"draft",  icon:"swap_horiz",label:"Draft"  },
  {id:"tasks",  icon:"checklist", label:"Tarefas"},
  {id:"market", icon:"storefront",label:"Market" },
  {id:"profile",icon:"person",    label:"Perfil" },
]

export default function CasaApp() {
  const [state,setState]=useState(loadState)
  const [tab,setTab]=useState("home")
  const [toast,setToast]=useState(null)   // {msg, action?, onAction?}
  const [achModal,setAchModal]=useState(null)
  const [floats,setFloats]=useState([])
  const [settingsOpen,setSettingsOpen]=useState(false)

  useEffect(()=>{ store.set(state) },[state])

  useEffect(()=>{
    const links=[
      "https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;600;700;800&family=Nunito:wght@600;700;800;900&display=swap",
      "https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,500,1,0&display=block",
    ]
    links.forEach(href=>{ const l=document.createElement("link"); l.rel="stylesheet"; l.href=href; document.head.appendChild(l) })
    const s=document.createElement("style")
    s.textContent=`
      *{box-sizing:border-box;-webkit-tap-highlight-color:transparent}
      body{margin:0;font-family:'Nunito',system-ui,sans-serif;background:#dad6ce}
      .material-symbols-rounded{font-variation-settings:'FILL' 1,'wght' 500,'GRAD' 0,'opsz' 24;font-feature-settings:'liga'}
      ::-webkit-scrollbar{width:0;height:0}
      @keyframes shine{0%{transform:translateX(-120%)}100%{transform:translateX(240%)}}
      @keyframes floatUp{0%{transform:translateY(0) scale(.7);opacity:0}18%{opacity:1;transform:translateY(-8px) scale(1.05)}100%{transform:translateY(-96px) scale(1);opacity:0}}
      @keyframes popIn{0%{transform:scale(.6);opacity:0}60%{transform:scale(1.06);opacity:1}100%{transform:scale(1)}}
      @keyframes badgePulse{0%,100%{transform:scale(1)}50%{transform:scale(1.08)}}
      @keyframes toastIn{0%{transform:translateY(30px);opacity:0}100%{transform:translateY(0);opacity:1}}
      @keyframes fadeIn{from{opacity:0}to{opacity:1}}
    `
    document.head.appendChild(s)
  },[])

  useEffect(()=>{
    if(state.house.name&&state.draft.week_id&&state.draft.week_id!==weekId()) dispatch({type:"DRAFT_CONFIRM"})
  },[])

  const dispatch=useCallback((action)=>{
    setState(prev=>{
      const next=reduce(prev,action)
      if(next._newAchs?.length>0) {
        const ach=ACHS.find(a=>a.id===next._newAchs[0])
        setTimeout(()=>setAchModal(ach),500)
      }
      if(next._reward) {
        const r=next._reward, id=Math.random()
        setFloats(f=>[...f,{id,pts:r.pts,coins:r.coins}])
        setTimeout(()=>setFloats(f=>f.filter(x=>x.id!==id)),1300)
        if(r.bonus) { setToast(null); setTimeout(()=>setToast({msg:"Draft completo! +50 moedas 🎉"}),60) }
      }
      const clean={...next}; delete clean._newAchs; delete clean._reward
      return clean
    })
  },[])

  const showToast=(msg,action,onAction)=>{ setToast(null); setTimeout(()=>setToast({msg,action,onAction}),50) }

  if(!state.house.name) return (
    <div style={{maxWidth:430,margin:"0 auto",minHeight:"100vh",background:C.bg}}>
      <Onboarding onDone={({house,myName,pairName,assigns})=>dispatch({type:"INIT",house,myName,pairName,assigns})}/>
    </div>
  )

  return (
    <div style={{maxWidth:430,margin:"0 auto",minHeight:"100vh",background:C.bg,position:"relative",overflowX:"hidden",boxShadow:"0 0 60px rgba(0,0,0,.12)"}}>
      {/* Floats de recompensa */}
      <div style={{position:"absolute",inset:0,zIndex:120,pointerEvents:"none",overflow:"hidden"}}>
        {floats.map(f=>(
          <div key={f.id} style={{position:"absolute",top:96,left:"50%",transform:"translateX(-50%)",display:"flex",gap:10,animation:"floatUp 1.3s ease-out forwards"}}>
            <div style={{display:"flex",alignItems:"center",gap:3,background:C.violet,color:"#fff",borderRadius:999,padding:"6px 12px",fontFamily:F.display,fontWeight:800,fontSize:16,boxShadow:"0 4px 12px rgba(123,91,255,.4)"}}><Icon name="bolt" size={18}/>+{f.pts}</div>
            <div style={{display:"flex",alignItems:"center",gap:3,background:C.gold,color:"#fff",borderRadius:999,padding:"6px 12px",fontFamily:F.display,fontWeight:800,fontSize:16,boxShadow:"0 4px 12px rgba(255,179,35,.4)"}}><Icon name="paid" size={18}/>+{f.coins}</div>
          </div>
        ))}
      </div>

      <div style={{overflowY:"auto",minHeight:"100vh",paddingBottom:80}}>
        {tab==="home"    && <HomeScreen    state={state} dispatch={dispatch} onOpenSettings={()=>setSettingsOpen(true)}/>}
        {tab==="draft"   && <DraftScreen   state={state} dispatch={dispatch}/>}
        {tab==="tasks"   && <TasksScreen   state={state} dispatch={dispatch}/>}
        {tab==="market"  && <MarketScreen  state={state} dispatch={dispatch} showToast={showToast}/>}
        {tab==="profile" && <ProfileScreen state={state} dispatch={dispatch}/>}
      </div>

      {/* Tab bar */}
      <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:430,background:"#fff",borderTop:"1px solid #EFEBF8",display:"flex",justifyContent:"space-around",alignItems:"flex-end",padding:"9px 6px calc(env(safe-area-inset-bottom,0px) + 12px)",boxShadow:"0 -4px 24px rgba(33,27,51,.07)",zIndex:50}}>
        {TABS.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{flex:1,border:"none",background:"none",padding:0,cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:2,color:tab===t.id?C.violet:C.softer}}>
            <Icon name={t.icon} size={26}/>
            <span style={{fontFamily:F.body,fontWeight:800,fontSize:10.5,lineHeight:1}}>{t.label}</span>
          </button>
        ))}
      </div>

      {settingsOpen&&<SettingsScreen state={state} dispatch={dispatch} onClose={()=>setSettingsOpen(false)}/>}
      {toast&&<Toast msg={toast.msg} action={toast.action} onAction={toast.onAction} onClose={()=>setToast(null)}/>}
      <AchModal ach={achModal} onClose={()=>setAchModal(null)}/>
    </div>
  )
}
