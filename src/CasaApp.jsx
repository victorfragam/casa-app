import { useState, useEffect, useCallback } from "react"

// ══════════════════════════════════════════════
// DESIGN TOKENS
// ══════════════════════════════════════════════
const TH = {
  blue:   { fg:"#2E7BF0", bg:"#EAF3FF", sd:"#D4E6FF" },
  green:  { fg:"#27C26E", bg:"#E9F8EF", sd:"#CFEFD9" },
  purple: { fg:"#A23DD6", bg:"#FBEEFF", sd:"#F0D6FA" },
  orange: { fg:"#FF7A1A", bg:"#FFF1E6", sd:"#FBDEC4" },
  teal:   { fg:"#0FB8B0", bg:"#E4F8F6", sd:"#C7EEEA" },
  pink:   { fg:"#FF4F9A", bg:"#FFEAF3", sd:"#FFD4E6" },
  violet: { fg:"#7B5BFF", bg:"#F0ECFF", sd:"#E0D6FA" },
}
const C = {
  bg:"#F3F1FA", text:"#211B33", soft:"#8A85A0", softer:"#ADA7BE",
  violet:"#7B5BFF", violetSd:"#5A38E0",
  gold:"#FFB323", goldTxt:"#E0900A",
  green:"#27C26E", fire:"#FF7A1A", white:"#fff",
  card:{ background:"#fff", borderRadius:22, boxShadow:"0 3px 0 rgba(33,27,51,.05), 0 10px 24px rgba(33,27,51,.06)" },
}

// ══════════════════════════════════════════════
// DATA
// ══════════════════════════════════════════════
const LIB = [
  { id:"lavar-louca",   name:"Lavar louça",         cat:"Cozinha",    icon:"restaurant",             th:"blue",   pts:20, coins:15, diff:"Fácil"   },
  { id:"tirar-lixo",    name:"Tirar lixo",           cat:"Geral",      icon:"delete",                 th:"green",  pts:15, coins:10, diff:"Fácil"   },
  { id:"limpar-ban",    name:"Limpar banheiro",      cat:"Banheiro",   icon:"bathtub",                th:"purple", pts:50, coins:30, diff:"Difícil" },
  { id:"aspirador",     name:"Passar aspirador",     cat:"Geral",      icon:"cleaning_services",      th:"teal",   pts:35, coins:20, diff:"Média"   },
  { id:"lavar-roupa",   name:"Lavar roupa",          cat:"Lavanderia", icon:"local_laundry_service",  th:"blue",   pts:30, coins:20, diff:"Média"   },
  { id:"dobrar-roupa",  name:"Dobrar roupa",         cat:"Lavanderia", icon:"checkroom",              th:"pink",   pts:20, coins:12, diff:"Fácil"   },
  { id:"mercado",       name:"Fazer mercado",        cat:"Geral",      icon:"shopping_cart",          th:"orange", pts:40, coins:25, diff:"Média"   },
  { id:"limpar-coz",    name:"Limpar cozinha",       cat:"Cozinha",    icon:"countertops",            th:"orange", pts:35, coins:22, diff:"Média"   },
  { id:"cama",          name:"Trocar roupa de cama", cat:"Quarto",     icon:"king_bed",               th:"orange", pts:80, coins:40, diff:"Difícil" },
  { id:"varrer",        name:"Varrer a casa",        cat:"Geral",      icon:"cleaning_services",      th:"teal",   pts:25, coins:15, diff:"Fácil"   },
]
const MKTDATA = [
  { id:"filme",  name:"Escolher o filme",          icon:"movie",            cost:50,  tier:"Baixo" },
  { id:"tv",     name:"Controle da TV",            icon:"settings_remote",  cost:40,  tier:"Baixo" },
  { id:"jantar", name:"Escolher o jantar",         icon:"restaurant_menu",  cost:60,  tier:"Baixo" },
  { id:"cafe",   name:"Café na cama",              icon:"local_cafe",       cost:120, tier:"Médio" },
  { id:"sobre",  name:"Sobremesa especial",        icon:"cake",             cost:100, tier:"Médio" },
  { id:"massa",  name:"Vale massagem",             icon:"spa",              cost:200, tier:"Médio" },
  { id:"date",   name:"Vale date",                 icon:"favorite",         cost:400, tier:"Alto"  },
  { id:"folga",  name:"Folga da louça (1 semana)", icon:"restaurant",       cost:350, tier:"Alto"  },
  { id:"passeio",name:"Passeio do fim de semana",  icon:"hiking",           cost:500, tier:"Alto"  },
]
const ACHS = [
  { id:"first",      label:"1º Lugar",        icon:"emoji_events",           desc:"Ganhe o ranking do mês",       ok:(s)=>s.wins>=1 },
  { id:"streak7",    label:"7 dias seguidos",  icon:"local_fire_department",  desc:"7 dias consecutivos",          ok:(s)=>s.best_streak>=7 },
  { id:"streak30",   label:"30 dias!",         icon:"whatshot",               desc:"30 dias consecutivos",         ok:(s)=>s.best_streak>=30 },
  { id:"t100",       label:"100 tarefas",      icon:"workspace_premium",      desc:"100 tarefas concluídas",       ok:(s)=>s.tasks_done>=100 },
  { id:"t500",       label:"500 tarefas",      icon:"diamond",                desc:"500 tarefas concluídas",       ok:(s)=>s.tasks_done>=500 },
  { id:"louca100",   label:"Chef da Louça",    icon:"restaurant",             desc:"Lavou a louça 100×",           ok:(s)=>(s.task_counts?.["lavar-louca"]||0)>=100 },
  { id:"lixo50",     label:"Lixeiro Pro",      icon:"delete_sweep",           desc:"Tirou o lixo 50×",             ok:(s)=>(s.task_counts?.["tirar-lixo"]||0)>=50 },
  { id:"banheiro10", label:"Banheirista",      icon:"bathtub",                desc:"Limpou o banheiro 10×",        ok:(s)=>(s.task_counts?.["limpar-ban"]||0)>=10 },
]
const TITLES = [
  {min:500,t:"Lenda da Casa"},{min:100,t:"Faxineiro Lendário"},{min:50,t:"Mestre de Casa"},{min:10,t:"Faxineiro Jr."},{min:0,t:"Iniciante"},
]

// ══════════════════════════════════════════════
// HELPERS
// ══════════════════════════════════════════════
const today = () => new Date().toISOString().split("T")[0]
const weekId = () => {
  const d=new Date(), j=new Date(d.getFullYear(),0,1)
  return `${d.getFullYear()}-W${Math.ceil(((d-j)/864e5+j.getDay()+1)/7)}`
}
const daysLeft = () => { const d=new Date(); return new Date(d.getFullYear(),d.getMonth()+1,0).getDate()-d.getDate() }
const monthName = () => ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"][new Date().getMonth()]
const getTitle = td => TITLES.find(t=>td>=t.min)?.t||"Iniciante"
const ini = n => (n||"?")[0].toUpperCase()
const sBon = s => s>=30?.15:s>=15?.10:s>=7?.05:0
const store = {
  get:()=>{ try{ const r=localStorage.getItem("casa_v1"); return r?JSON.parse(r):null }catch{ return null }},
  set:(v)=>{ try{ localStorage.setItem("casa_v1",JSON.stringify(v)) }catch{} }
}
const blankStats = () => ({ month_points:0, hall_points:0, coins:0, streak:0, best_streak:0, last_date:null, tasks_done:0, wins:0, task_counts:{} })
const blankState = () => ({
  house:{name:""},
  users:[{id:0,name:"",color:"blue"},{id:1,name:"",color:"pink"}],
  viewUser:0,
  stats:{"0":blankStats(),"1":blankStats()},
  draft:{week_id:"",confirmed:false,bonus_given:false,assigns:{"0":[],"1":[]}},
  history:[],
  unlocked:{"0":[],"1":[]},
})
const loadState = () => store.get() || blankState()

function applyStreak(s0) {
  const t=today(), s={...s0}
  if (s.last_date===t) return s
  if (s.last_date) {
    const diff=(new Date(t)-new Date(s.last_date))/864e5
    s.streak = diff===1 ? s.streak+1 : 1
  } else { s.streak=1 }
  s.last_date=t; s.best_streak=Math.max(s.best_streak,s.streak)
  return s
}
const checkAchs = (stats, unlocked) =>
  ACHS.filter(a=>!unlocked.includes(a.id)&&a.ok(stats)).map(a=>a.id)

// ══════════════════════════════════════════════
// UI ATOMS
// ══════════════════════════════════════════════
function Icon({ name, size=24, color, style={} }) {
  return <span className="material-symbols-rounded" style={{fontSize:size,color:color||"inherit",lineHeight:1,userSelect:"none",...style}}>{name}</span>
}
function TaskIcon({ task, size=42 }) {
  const th=TH[task.th]
  return (
    <div style={{width:size,height:size,borderRadius:Math.round(size*.31),background:th.bg,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 3px 0 ${th.sd}`,flexShrink:0}}>
      <Icon name={task.icon} size={Math.round(size*.52)} color={th.fg}/>
    </div>
  )
}
function Pill({ icon, value, color=C.violet, bg="#F0ECFF", iconColor }) {
  return (
    <div style={{display:"flex",alignItems:"center",gap:4,background:bg,borderRadius:999,padding:"4px 10px 4px 6px"}}>
      <Icon name={icon} size={16} color={iconColor||color}/>
      <span style={{fontSize:13,fontFamily:"Nunito",fontWeight:800,color}}>{value}</span>
    </div>
  )
}
function Btn3D({ children, onClick, color=C.violet, shadow=C.violetSd, style={}, disabled=false, small=false }) {
  const [p,setP]=useState(false)
  return (
    <button
      onClick={!disabled?onClick:undefined}
      onMouseDown={()=>setP(true)} onMouseUp={()=>setP(false)}
      onTouchStart={()=>setP(true)} onTouchEnd={()=>setP(false)}
      style={{background:disabled?C.softer:color,color:"#fff",border:"none",borderRadius:16,
        padding:small?"8px 16px":"13px 20px",fontFamily:"Nunito",fontWeight:900,
        fontSize:small?13:15,boxShadow:p||disabled?"none":`0 4px 0 ${shadow}`,
        transform:p?"translateY(4px)":"none",cursor:disabled?"not-allowed":"pointer",
        width:"100%",transition:"all .08s",...style}}>
      {children}
    </button>
  )
}
function Card({ children, style={} }) {
  return <div style={{...C.card,padding:20,...style}}>{children}</div>
}
function Toast({ msg, onClose }) {
  useEffect(()=>{ const t=setTimeout(onClose,2500); return ()=>clearTimeout(t) },[])
  return (
    <div style={{position:"fixed",bottom:100,left:"50%",transform:"translateX(-50%)",
      background:"#211B33",color:"#fff",borderRadius:14,padding:"10px 20px",
      fontFamily:"Nunito",fontWeight:700,fontSize:14,zIndex:999,
      boxShadow:"0 4px 20px rgba(0,0,0,.3)",whiteSpace:"nowrap"}}>
      {msg}
    </div>
  )
}
function AchModal({ ach, onClose }) {
  if (!ach) return null
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(33,27,51,.65)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
      <div style={{...C.card,padding:32,textAlign:"center",maxWidth:320,width:"100%"}}>
        <div style={{fontSize:56,marginBottom:8}}>🎉</div>
        <div style={{fontFamily:"Baloo 2",fontWeight:800,fontSize:22,color:C.text,marginBottom:4}}>Conquista desbloqueada!</div>
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,marginBottom:8}}>
          <Icon name={ach.icon} size={22} color={C.violet}/>
          <span style={{fontFamily:"Nunito",fontWeight:800,color:C.violet,fontSize:18}}>{ach.label}</span>
        </div>
        <div style={{fontFamily:"Nunito",color:C.soft,fontSize:14,marginBottom:24}}>{ach.desc}</div>
        <Btn3D onClick={onClose}>Arrasou! 🔥</Btn3D>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════
// ONBOARDING
// ══════════════════════════════════════════════
function Onboarding({ onDone }) {
  const [step,setStep]=useState(0)
  const [house,setHouse]=useState("")
  const [myName,setMyName]=useState("")
  const [pairName,setPairName]=useState("")
  const [assigns,setAssigns]=useState({})

  const totalPts = Object.entries(assigns).reduce((a,[id,n])=>{ const t=LIB.find(t=>t.id===id); return a+(t?t.pts*n:0) },0)
  const taskCount = Object.values(assigns).filter(n=>n>0).length

  const inp = { width:"100%", padding:"14px 16px", borderRadius:14, border:"2px solid #E8E4F4",
    fontFamily:"Nunito", fontWeight:700, fontSize:15, color:C.text, outline:"none", boxSizing:"border-box", background:"#fff" }

  return (
    <div style={{minHeight:"100vh",background:C.bg,display:"flex",flexDirection:"column"}}>
      {step>0 && (
        <div style={{padding:"20px 24px 0"}}>
          <div style={{height:6,borderRadius:99,background:"#E8E4F4",overflow:"hidden"}}>
            <div style={{height:"100%",width:`${(step/2)*100}%`,background:C.violet,borderRadius:99,transition:"width .3s"}}/>
          </div>
          <div style={{fontFamily:"Nunito",fontSize:12,color:C.soft,marginTop:6}}>Passo {step} de 2</div>
        </div>
      )}

      {step===0 && (
        <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:32,gap:20}}>
          <div style={{width:96,height:96,borderRadius:28,background:"linear-gradient(135deg,#7B5BFF,#54A0FF)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 8px 0 #5A38E0"}}>
            <Icon name="home" size={52} color="#fff"/>
          </div>
          <div style={{fontFamily:"Baloo 2",fontWeight:800,fontSize:36,color:C.text,textAlign:"center",lineHeight:1.1}}>Casa</div>
          <div style={{fontFamily:"Nunito",fontSize:16,color:C.soft,textAlign:"center",lineHeight:1.5,maxWidth:280}}>
            Transforme tarefas domésticas em uma competição amigável entre vocês dois
          </div>
          <div style={{display:"flex",gap:10,flexWrap:"wrap",justifyContent:"center"}}>
            {[["emoji_events","Ranking"],["savings","Recompensas"],["local_fire_department","Sequências"]].map(([icon,label])=>(
              <div key={icon} style={{display:"flex",alignItems:"center",gap:6,background:"#fff",borderRadius:999,padding:"6px 14px",boxShadow:"0 2px 8px rgba(0,0,0,.08)"}}>
                <Icon name={icon} size={16} color={C.violet}/><span style={{fontFamily:"Nunito",fontWeight:700,fontSize:13,color:C.text}}>{label}</span>
              </div>
            ))}
          </div>
          <Btn3D onClick={()=>setStep(1)} style={{marginTop:12}}>Criar nossa casa 🏠</Btn3D>
        </div>
      )}

      {step===1 && (
        <div style={{flex:1,padding:24,display:"flex",flexDirection:"column",gap:20}}>
          <div>
            <div style={{fontFamily:"Baloo 2",fontWeight:800,fontSize:26,color:C.text}}>Quem mora aqui?</div>
            <div style={{fontFamily:"Nunito",fontSize:14,color:C.soft,marginTop:4}}>Configure sua casa em 2 passos</div>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <input placeholder="Nome da casa (ex: Apt 42)" value={house} onChange={e=>setHouse(e.target.value)} style={inp}/>
            <div style={{display:"flex",gap:12,alignItems:"center"}}>
              <div style={{width:48,height:48,borderRadius:14,background:"linear-gradient(160deg,#54A0FF,#2E7BF0)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,boxShadow:"0 3px 0 #1F5FCC"}}>
                <span style={{fontFamily:"Baloo 2",fontWeight:800,fontSize:22,color:"#fff"}}>{ini(myName)}</span>
              </div>
              <input placeholder="Seu nome" value={myName} onChange={e=>setMyName(e.target.value)} style={inp}/>
            </div>
            <div style={{display:"flex",gap:12,alignItems:"center"}}>
              <div style={{width:48,height:48,borderRadius:14,background:"linear-gradient(160deg,#FF7DB5,#FF4F9A)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,boxShadow:"0 3px 0 #E02E7D"}}>
                <span style={{fontFamily:"Baloo 2",fontWeight:800,fontSize:22,color:"#fff"}}>{ini(pairName)}</span>
              </div>
              <input placeholder="Nome do(a) parceiro(a)" value={pairName} onChange={e=>setPairName(e.target.value)} style={inp}/>
            </div>
          </div>
          <Btn3D onClick={()=>setStep(2)} disabled={!house.trim()||!myName.trim()||!pairName.trim()}>Continuar →</Btn3D>
        </div>
      )}

      {step===2 && (
        <div style={{flex:1,display:"flex",flexDirection:"column"}}>
          <div style={{padding:"20px 24px 12px"}}>
            <div style={{fontFamily:"Baloo 2",fontWeight:800,fontSize:24,color:C.text}}>Suas tarefas da semana</div>
            <div style={{fontFamily:"Nunito",fontSize:14,color:C.soft,marginTop:4}}>Quais você vai assumir?</div>
          </div>
          <div style={{flex:1,overflowY:"auto",padding:"0 16px",display:"flex",flexDirection:"column",gap:10,paddingBottom:130}}>
            {LIB.map(task=>{
              const n=assigns[task.id]||0
              return (
                <div key={task.id} style={{...C.card,padding:"14px 16px",display:"flex",alignItems:"center",gap:12}}>
                  <TaskIcon task={task} size={44}/>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontFamily:"Nunito",fontWeight:800,fontSize:14,color:C.text}}>{task.name}</div>
                    <div style={{fontFamily:"Nunito",fontSize:12,color:C.soft}}>{task.diff} · {task.pts}pts · {task.coins}🪙</div>
                  </div>
                  {n===0 ? (
                    <button onClick={()=>setAssigns({...assigns,[task.id]:1})} style={{background:C.violet,color:"#fff",border:"none",borderRadius:999,padding:"6px 14px",fontFamily:"Nunito",fontWeight:800,fontSize:13,cursor:"pointer",whiteSpace:"nowrap"}}>
                      + Assumir
                    </button>
                  ) : (
                    <div style={{display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
                      <button onClick={()=>setAssigns({...assigns,[task.id]:Math.max(0,n-1)})} style={{width:28,height:28,borderRadius:999,background:"#F0ECFF",border:"none",cursor:"pointer",fontWeight:900,fontSize:16,color:C.violet,display:"flex",alignItems:"center",justifyContent:"center"}}>−</button>
                      <span style={{fontFamily:"Baloo 2",fontWeight:800,fontSize:16,color:C.text,minWidth:20,textAlign:"center"}}>{n}×</span>
                      <button onClick={()=>setAssigns({...assigns,[task.id]:n+1})} style={{width:28,height:28,borderRadius:999,background:C.violet,border:"none",cursor:"pointer",fontWeight:900,fontSize:16,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center"}}>+</button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
          <div style={{position:"fixed",bottom:0,left:0,right:0,background:"#fff",borderTop:"1px solid #F0ECFF",padding:"16px 24px 32px"}}>
            <div style={{fontFamily:"Nunito",fontWeight:700,fontSize:12,color:C.soft,marginBottom:10,textAlign:"center"}}>
              {taskCount} tarefa{taskCount!==1?"s":""} · {totalPts} pts · bônus de +50🪙 ao zerar tudo
            </div>
            <Btn3D onClick={()=>onDone({house,myName,pairName,assigns})} disabled={taskCount===0}>Começar 🚀</Btn3D>
          </div>
        </div>
      )}
    </div>
  )
}

// ══════════════════════════════════════════════
// HOME
// ══════════════════════════════════════════════
function HomeScreen({ state, dispatch }) {
  const u0=state.stats["0"], u1=state.stats["1"]
  const me=state.users[0], pair=state.users[1]
  const total=u0.month_points+u1.month_points
  const myPct=total>0?u0.month_points/total:.5
  const iLead=u0.month_points>u1.month_points
  const isTie=u0.month_points===u1.month_points
  const diff=Math.abs(u0.month_points-u1.month_points)
  const greeting=()=>{ const h=new Date().getHours(); return h<12?"Bom dia":h<18?"Boa tarde":"Boa noite" }
  const myAssigns=state.draft.assigns?.["0"]||[]
  const nextTask=myAssigns.find(a=>(a.done||0)<a.count)
  const nextTaskData=nextTask?LIB.find(t=>t.id===nextTask.id):null
  const myTotal=myAssigns.reduce((a,x)=>a+x.count,0)
  const myDone=myAssigns.reduce((a,x)=>a+(x.done||0),0)
  const commitment=myTotal>0?Math.round(myDone/myTotal*100):null
  const myUnlocked=state.unlocked?.["0"]||[]
  const lastAch=myUnlocked.length>0?ACHS.find(a=>a.id===myUnlocked[myUnlocked.length-1]):null

  return (
    <div style={{display:"flex",flexDirection:"column",gap:16,paddingBottom:100}}>
      {/* Header hero */}
      <div style={{background:"linear-gradient(160deg,#54A0FF,#2E7BF0)",padding:"52px 24px 24px",borderRadius:"0 0 28px 28px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:44,height:44,borderRadius:14,background:"rgba(255,255,255,.2)",display:"flex",alignItems:"center",justifyContent:"center"}}>
              <span style={{fontFamily:"Baloo 2",fontWeight:800,fontSize:22,color:"#fff"}}>{ini(me.name)}</span>
            </div>
            <div>
              <div style={{fontFamily:"Nunito",fontSize:13,color:"rgba(255,255,255,.8)",fontWeight:600}}>{greeting()},</div>
              <div style={{fontFamily:"Baloo 2",fontWeight:800,fontSize:20,color:"#fff",lineHeight:1.1}}>{me.name}</div>
            </div>
          </div>
          <div style={{display:"flex",gap:8}}>
            <Pill icon="local_fire_department" value={u0.streak} color="#FF7A1A" bg="rgba(255,255,255,.9)"/>
            <Pill icon="savings" value={u0.coins} color="#E0900A" bg="rgba(255,255,255,.9)"/>
          </div>
        </div>
      </div>

      <div style={{padding:"0 16px",display:"flex",flexDirection:"column",gap:14}}>
        {/* Ranking */}
        <Card>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
            <div>
              <div style={{fontFamily:"Baloo 2",fontWeight:800,fontSize:18,color:C.text}}>Ranking de {monthName()}</div>
              <div style={{fontFamily:"Nunito",fontSize:12,color:C.soft}}>{daysLeft()} dias restantes</div>
            </div>
            <Icon name="emoji_events" size={28} color="#FFB323"/>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:14}}>
            {/* Me */}
            <div style={{flex:1,textAlign:"center"}}>
              <div style={{position:"relative",display:"inline-block",marginBottom:6}}>
                <div style={{width:54,height:54,borderRadius:16,background:"linear-gradient(160deg,#54A0FF,#2E7BF0)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto",boxShadow:"0 3px 0 #1F5FCC"}}>
                  <span style={{fontFamily:"Baloo 2",fontWeight:800,fontSize:24,color:"#fff"}}>{ini(me.name)}</span>
                </div>
                {iLead&&<div style={{position:"absolute",top:-10,right:-10,fontSize:20}}>👑</div>}
              </div>
              <div style={{fontFamily:"Nunito",fontWeight:800,fontSize:13,color:C.text}}>{me.name}</div>
              <div style={{fontFamily:"Baloo 2",fontWeight:800,fontSize:24,color:"#2E7BF0"}}>{u0.month_points}</div>
              <div style={{fontFamily:"Nunito",fontSize:11,color:C.soft}}>pts</div>
            </div>
            <div style={{fontFamily:"Baloo 2",fontWeight:800,fontSize:18,color:C.softer}}>VS</div>
            {/* Pair */}
            <div style={{flex:1,textAlign:"center"}}>
              <div style={{position:"relative",display:"inline-block",marginBottom:6}}>
                <div style={{width:54,height:54,borderRadius:16,background:"linear-gradient(160deg,#FF7DB5,#FF4F9A)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto",boxShadow:"0 3px 0 #E02E7D"}}>
                  <span style={{fontFamily:"Baloo 2",fontWeight:800,fontSize:24,color:"#fff"}}>{ini(pair.name)}</span>
                </div>
                {!iLead&&!isTie&&<div style={{position:"absolute",top:-10,right:-10,fontSize:20}}>👑</div>}
              </div>
              <div style={{fontFamily:"Nunito",fontWeight:800,fontSize:13,color:C.text}}>{pair.name}</div>
              <div style={{fontFamily:"Baloo 2",fontWeight:800,fontSize:24,color:"#FF4F9A"}}>{u1.month_points}</div>
              <div style={{fontFamily:"Nunito",fontSize:11,color:C.soft}}>pts</div>
            </div>
          </div>
          {/* Bar */}
          <div style={{height:8,borderRadius:99,background:"#F0ECFF",overflow:"hidden",marginBottom:8}}>
            <div style={{height:"100%",background:"linear-gradient(90deg,#54A0FF,#2E7BF0)",width:`${myPct*100}%`,borderRadius:"99px 0 0 99px",transition:"width .5s"}}/>
          </div>
          <div style={{fontFamily:"Nunito",fontWeight:700,fontSize:13,color:C.soft,textAlign:"center"}}>
            {isTie?"Empate técnico! ⚡":iLead?`Você lidera por ${diff} pts 🔥`:`${pair.name} lidera por ${diff} pts`}
          </div>
        </Card>

        {/* Stats trio */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
          {[
            {icon:"military_tech", label:"Posição",       value:iLead||isTie?"1º":"2º", color:C.violet},
            {icon:"percent",       label:"Comprometimento",value:commitment!=null?`${commitment}%`:"—",  color:C.green},
            {icon:"check_circle",  label:"Esta semana",   value:`${myDone}/${myTotal}`,  color:"#2E7BF0"},
          ].map(({icon,label,value,color})=>(
            <div key={label} style={{...C.card,padding:14,textAlign:"center"}}>
              <Icon name={icon} size={22} color={color}/>
              <div style={{fontFamily:"Baloo 2",fontWeight:800,fontSize:18,color:C.text,marginTop:4}}>{value}</div>
              <div style={{fontFamily:"Nunito",fontSize:10,color:C.soft,lineHeight:1.2,marginTop:2}}>{label}</div>
            </div>
          ))}
        </div>

        {/* Next task */}
        {myTotal>0 && (
          <Card>
            <div style={{fontFamily:"Nunito",fontWeight:700,fontSize:11,color:C.soft,marginBottom:10,textTransform:"uppercase",letterSpacing:.5}}>Próxima tarefa</div>
            {nextTaskData?(
              <>
                <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14}}>
                  <TaskIcon task={nextTaskData} size={50}/>
                  <div style={{flex:1}}>
                    <div style={{fontFamily:"Nunito",fontWeight:800,fontSize:15,color:C.text}}>{nextTaskData.name}</div>
                    <div style={{fontFamily:"Nunito",fontSize:12,color:C.soft}}>{nextTaskData.cat} · {nextTaskData.diff}</div>
                    {nextTask.count>1&&(
                      <div style={{marginTop:6}}>
                        <div style={{height:4,borderRadius:99,background:"#F0ECFF",overflow:"hidden"}}>
                          <div style={{height:"100%",background:C.violet,width:`${(nextTask.done||0)/nextTask.count*100}%`,borderRadius:99}}/>
                        </div>
                        <div style={{fontFamily:"Nunito",fontSize:11,color:C.soft,marginTop:3}}>{nextTask.done||0}/{nextTask.count}× feito</div>
                      </div>
                    )}
                  </div>
                  <div style={{textAlign:"right",flexShrink:0}}>
                    <div style={{fontFamily:"Baloo 2",fontWeight:800,fontSize:15,color:C.violet}}>+{nextTaskData.pts}pts</div>
                    <div style={{fontFamily:"Baloo 2",fontWeight:800,fontSize:13,color:C.goldTxt}}>+{nextTaskData.coins}🪙</div>
                  </div>
                </div>
                <Btn3D onClick={()=>{ if(navigator.vibrate)navigator.vibrate(30); dispatch({type:"COMPLETE",userId:"0",taskId:nextTask.id}) }}>
                  Concluir tarefa ✓
                </Btn3D>
              </>
            ):(
              <div style={{textAlign:"center",padding:"8px 0 4px"}}>
                <Icon name="celebration" size={36} color={C.green}/>
                <div style={{fontFamily:"Baloo 2",fontWeight:800,fontSize:18,color:C.green,marginTop:8}}>Tudo concluído! 🎉</div>
                <div style={{fontFamily:"Nunito",fontSize:13,color:C.soft,marginTop:4}}>Você zerou todas as tarefas da semana!</div>
              </div>
            )}
          </Card>
        )}

        {/* Highlight */}
        {lastAch?(
          <div style={{...C.card,padding:18,background:"linear-gradient(135deg,#7B5BFF,#54A0FF)",borderRadius:22}}>
            <div style={{fontFamily:"Nunito",fontWeight:700,fontSize:11,color:"rgba(255,255,255,.7)",marginBottom:10,textTransform:"uppercase",letterSpacing:.5}}>Última conquista</div>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <div style={{width:44,height:44,borderRadius:14,background:"rgba(255,255,255,.2)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <Icon name={lastAch.icon} size={24} color="#fff"/>
              </div>
              <div>
                <div style={{fontFamily:"Nunito",fontWeight:800,fontSize:15,color:"#fff"}}>{lastAch.label}</div>
                <div style={{fontFamily:"Nunito",fontSize:12,color:"rgba(255,255,255,.75)"}}>{lastAch.desc}</div>
              </div>
            </div>
          </div>
        ):u0.streak>0?(
          <Card style={{background:"#FFF8EE"}}>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <Icon name="local_fire_department" size={32} color="#FF7A1A"/>
              <div>
                <div style={{fontFamily:"Nunito",fontWeight:800,fontSize:15,color:C.text}}>Sequência de {u0.streak} dia{u0.streak>1?"s":""}! 🔥</div>
                <div style={{fontFamily:"Nunito",fontSize:13,color:C.soft}}>Continue hoje para não perder</div>
              </div>
            </div>
          </Card>
        ):(
          <Card>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <Icon name="rocket_launch" size={32} color={C.violet}/>
              <div>
                <div style={{fontFamily:"Nunito",fontWeight:800,fontSize:15,color:C.text}}>Conclua sua 1ª tarefa hoje</div>
                <div style={{fontFamily:"Nunito",fontSize:13,color:C.soft}}>Comece sua sequência e ganhe bônus 🎯</div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════
// DRAFT
// ══════════════════════════════════════════════
function DraftScreen({ state, dispatch }) {
  const [showU,setShowU]=useState(0)
  const a0=state.draft.assigns?.["0"]||[]
  const a1=state.draft.assigns?.["1"]||[]
  const pts0=a0.reduce((a,x)=>a+x.count*(LIB.find(t=>t.id===x.id)?.pts||0),0)
  const pts1=a1.reduce((a,x)=>a+x.count*(LIB.find(t=>t.id===x.id)?.pts||0),0)
  const ptsTot=pts0+pts1
  const cnt0=a0.reduce((a,x)=>a+x.count,0)
  const cnt1=a1.reduce((a,x)=>a+x.count,0)
  const balanced=ptsTot===0||Math.abs(pts0-pts1)<=40

  const getCount=(u,id)=>(u===0?a0:a1).find(a=>a.id===id)?.count||0
  const getDone=(u,id)=>(u===0?a0:a1).find(a=>a.id===id)?.done||0
  const setCount=(u,id,n)=>dispatch({type:"DRAFT_SET",userId:String(u),taskId:id,count:Math.max(getDone(u,id),n)})

  return (
    <div style={{display:"flex",flexDirection:"column",paddingBottom:130}}>
      <div style={{padding:"52px 24px 20px"}}>
        <div style={{fontFamily:"Baloo 2",fontWeight:800,fontSize:26,color:C.text}}>Draft Semanal</div>
        <div style={{fontFamily:"Nunito",fontSize:14,color:C.soft,marginTop:4}}>Distribua as tarefas da semana</div>
      </div>
      <div style={{padding:"0 16px",display:"flex",flexDirection:"column",gap:14}}>
        {/* Balance */}
        <Card>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <div style={{fontFamily:"Nunito",fontWeight:700,fontSize:13,color:C.soft}}>Carga prevista</div>
            <div style={{background:balanced?"#E9F8EF":"#FFF1E6",borderRadius:999,padding:"4px 12px"}}>
              <span style={{fontFamily:"Nunito",fontWeight:800,fontSize:12,color:balanced?C.green:C.fire}}>
                {balanced?"⚡ Equilibrado":"⚠️ Desequilibrado"}
              </span>
            </div>
          </div>
          {[{name:state.users[0].name,pts:pts0,color:"#2E7BF0"},{name:state.users[1].name,pts:pts1,color:"#FF4F9A"}].map(({name,pts,color})=>(
            <div key={name} style={{marginBottom:10}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                <span style={{fontFamily:"Nunito",fontWeight:700,fontSize:13,color:C.text}}>{name}</span>
                <span style={{fontFamily:"Baloo 2",fontWeight:800,fontSize:13,color}}>{pts} pts</span>
              </div>
              <div style={{height:6,borderRadius:99,background:"#F0ECFF",overflow:"hidden"}}>
                <div style={{height:"100%",background:color,width:ptsTot>0?`${pts/ptsTot*100}%`:"0%",borderRadius:99,transition:"width .3s"}}/>
              </div>
            </div>
          ))}
        </Card>
        {/* Toggle */}
        <div style={{display:"flex",background:"#F0ECFF",borderRadius:14,padding:4,gap:4}}>
          {[0,1].map(u=>(
            <button key={u} onClick={()=>setShowU(u)} style={{flex:1,border:"none",borderRadius:10,padding:"9px 0",cursor:"pointer",background:showU===u?C.violet:"transparent",color:showU===u?"#fff":C.soft,fontFamily:"Nunito",fontWeight:800,fontSize:13,transition:"all .2s"}}>
              {state.users[u].name} ({u===0?cnt0:cnt1})
            </button>
          ))}
        </div>
        {/* Library */}
        {LIB.map(task=>{
          const n=getCount(showU,task.id)
          const done=getDone(showU,task.id)
          return (
            <div key={task.id} style={{...C.card,padding:"14px 16px",display:"flex",alignItems:"center",gap:12}}>
              <TaskIcon task={task} size={44}/>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontFamily:"Nunito",fontWeight:800,fontSize:14,color:C.text}}>{task.name}</div>
                <div style={{fontFamily:"Nunito",fontSize:12,color:C.soft}}>{task.diff} · {task.pts}pts · {task.coins}🪙</div>
              </div>
              {n===0?(
                <button onClick={()=>setCount(showU,task.id,1)} style={{background:C.violet,color:"#fff",border:"none",borderRadius:999,padding:"6px 14px",fontFamily:"Nunito",fontWeight:800,fontSize:13,cursor:"pointer",whiteSpace:"nowrap"}}>
                  + Assumir
                </button>
              ):(
                <div style={{display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
                  <button onClick={()=>setCount(showU,task.id,n-1)} style={{width:28,height:28,borderRadius:999,background:"#F0ECFF",border:"none",cursor:"pointer",fontWeight:900,fontSize:16,color:C.violet,display:"flex",alignItems:"center",justifyContent:"center"}}>−</button>
                  <span style={{fontFamily:"Baloo 2",fontWeight:800,fontSize:16,color:C.text,minWidth:20,textAlign:"center"}}>{n}×</span>
                  <button onClick={()=>setCount(showU,task.id,n+1)} style={{width:28,height:28,borderRadius:999,background:C.violet,border:"none",cursor:"pointer",fontWeight:900,fontSize:16,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center"}}>+</button>
                </div>
              )}
            </div>
          )
        })}
      </div>
      {/* Footer */}
      <div style={{position:"fixed",bottom:0,left:0,right:0,background:"#fff",borderTop:"1px solid #F0ECFF",padding:"14px 16px 32px",zIndex:10}}>
        <div style={{fontFamily:"Nunito",fontWeight:700,fontSize:12,color:C.soft,marginBottom:10,textAlign:"center"}}>
          {cnt0+cnt1} tarefas assumidas · {pts0+pts1} pts · bônus +50🪙 ao zerar
        </div>
        <Btn3D onClick={()=>dispatch({type:"DRAFT_CONFIRM"})} disabled={cnt0+cnt1===0}>
          {state.draft.confirmed?"✓ Draft confirmado":"Confirmar Draft"}
        </Btn3D>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════
// TASKS
// ══════════════════════════════════════════════
function TasksScreen({ state, dispatch }) {
  const myAssigns=state.draft.assigns?.["0"]||[]
  const total=myAssigns.reduce((a,x)=>a+x.count,0)
  const done=myAssigns.reduce((a,x)=>a+(x.done||0),0)
  const allDone=total>0&&done>=total
  const bonusGiven=state.draft.bonus_given
  const history=(state.history||[]).filter(h=>h.userId==="0").slice(-5).reverse()

  return (
    <div style={{display:"flex",flexDirection:"column",paddingBottom:100}}>
      <div style={{padding:"52px 24px 0"}}>
        <div style={{fontFamily:"Baloo 2",fontWeight:800,fontSize:26,color:C.text}}>Minhas Tarefas</div>
        <div style={{fontFamily:"Nunito",fontSize:14,color:C.soft,marginTop:4}}>Acompanhe seu progresso semanal</div>
      </div>
      <div style={{padding:"16px 16px 0",display:"flex",flexDirection:"column",gap:14}}>
        {total>0&&(
          <div style={{...C.card,background:C.violet,borderRadius:22,padding:20}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
              <div>
                <div style={{fontFamily:"Nunito",fontWeight:700,fontSize:11,color:"rgba(255,255,255,.75)",textTransform:"uppercase",letterSpacing:.5}}>Progresso da semana</div>
                <div style={{fontFamily:"Baloo 2",fontWeight:800,fontSize:32,color:"#fff",lineHeight:1.1}}>{done}/{total}</div>
              </div>
              <div style={{background:allDone?C.green:"rgba(255,255,255,.2)",borderRadius:999,padding:"6px 14px",transition:"background .3s"}}>
                <span style={{fontFamily:"Nunito",fontWeight:800,fontSize:12,color:"#fff"}}>
                  {allDone&&bonusGiven?"+50🪙 ganho! ✓":"+50🪙 ao zerar"}
                </span>
              </div>
            </div>
            <div style={{height:8,borderRadius:99,background:"rgba(255,255,255,.3)",overflow:"hidden"}}>
              <div style={{height:"100%",background:"#fff",width:`${total>0?done/total*100:0}%`,borderRadius:99,transition:"width .4s"}}/>
            </div>
          </div>
        )}

        {myAssigns.length===0?(
          <Card style={{textAlign:"center",padding:40}}>
            <Icon name="assignment" size={52} color={C.softer}/>
            <div style={{fontFamily:"Baloo 2",fontWeight:800,fontSize:20,color:C.text,marginTop:14}}>Nenhuma tarefa assumida</div>
            <div style={{fontFamily:"Nunito",fontSize:13,color:C.soft,marginTop:6}}>Vá ao Draft Semanal para assumir tarefas desta semana</div>
          </Card>
        ):myAssigns.map(assign=>{
          const task=LIB.find(t=>t.id===assign.id)
          if(!task) return null
          const tDone=assign.done||0
          const tTotal=assign.count
          const isOk=tDone>=tTotal
          return (
            <div key={assign.id} style={{...C.card,padding:16,display:"flex",alignItems:"center",gap:12}}>
              <TaskIcon task={task} size={48}/>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontFamily:"Nunito",fontWeight:800,fontSize:14,color:isOk?C.green:C.text}}>{task.name}</div>
                {tTotal>1?(
                  <>
                    <div style={{height:4,borderRadius:99,background:"#F0ECFF",overflow:"hidden",marginTop:6}}>
                      <div style={{height:"100%",background:isOk?C.green:C.violet,width:`${tDone/tTotal*100}%`,borderRadius:99}}/>
                    </div>
                    <div style={{fontFamily:"Nunito",fontSize:12,color:C.soft,marginTop:3}}>{tDone}/{tTotal}× feito</div>
                  </>
                ):(
                  <div style={{fontFamily:"Nunito",fontSize:12,color:C.soft}}>{isOk?"Concluída ✓":`+${task.pts}pts · +${task.coins}🪙`}</div>
                )}
              </div>
              <button onClick={()=>{ if(!isOk){ if(navigator.vibrate)navigator.vibrate(30); dispatch({type:"COMPLETE",userId:"0",taskId:assign.id}) }}}
                disabled={isOk}
                style={{width:44,height:44,borderRadius:22,border:"none",cursor:isOk?"default":"pointer",background:isOk?C.green:C.violet,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:isOk?"0 3px 0 #1da857":`0 3px 0 ${C.violetSd}`,flexShrink:0,transition:"all .2s"}}>
                <Icon name={isOk?"check":"add"} size={22} color="#fff"/>
              </button>
            </div>
          )
        })}

        {history.length>0&&(
          <div>
            <div style={{fontFamily:"Nunito",fontWeight:800,fontSize:14,color:C.text,marginBottom:10,padding:"0 4px"}}>Histórico recente</div>
            <Card style={{padding:"8px 16px"}}>
              {history.map((h,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 0",borderBottom:i<history.length-1?"1px solid #F8F7FB":"none"}}>
                  <div style={{width:28,height:28,borderRadius:10,background:"#E9F8EF",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    <Icon name="check" size={16} color={C.green}/>
                  </div>
                  <div style={{flex:1}}>
                    <div style={{fontFamily:"Nunito",fontWeight:700,fontSize:13,color:C.text}}>{h.taskName}</div>
                    <div style={{fontFamily:"Nunito",fontSize:11,color:C.soft}}>{h.date}</div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontFamily:"Baloo 2",fontWeight:800,fontSize:13,color:C.violet}}>+{h.pts}</div>
                    <div style={{fontFamily:"Nunito",fontSize:11,color:C.goldTxt}}>+{h.coins}🪙</div>
                  </div>
                </div>
              ))}
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════
// MARKET
// ══════════════════════════════════════════════
function MarketScreen({ state, dispatch, showToast }) {
  const coins=state.stats["0"].coins
  const nextReward=MKTDATA.filter(r=>coins<r.cost).sort((a,b)=>a.cost-b.cost)[0]
  const handle=(r)=>{
    if(coins<r.cost) return
    dispatch({type:"REDEEM",userId:"0",rewardId:r.id})
    showToast(`${r.name} resgatado! 🎉`)
  }
  return (
    <div style={{display:"flex",flexDirection:"column",paddingBottom:100}}>
      <div style={{padding:"52px 24px 16px",display:"flex",justifyContent:"space-between",alignItems:"flex-end"}}>
        <div>
          <div style={{fontFamily:"Baloo 2",fontWeight:800,fontSize:26,color:C.text}}>Market</div>
          <div style={{fontFamily:"Nunito",fontSize:14,color:C.soft,marginTop:2}}>Troque moedas por recompensas</div>
        </div>
        <Pill icon="savings" value={coins} color={C.goldTxt} bg="#FFF8E1" iconColor="#FFB323"/>
      </div>
      <div style={{padding:"0 16px",display:"flex",flexDirection:"column",gap:16}}>
        {nextReward&&(
          <div style={{...C.card,background:"linear-gradient(135deg,#FF7DB5,#FF4F9A)",borderRadius:22,padding:20}}>
            <div style={{fontFamily:"Nunito",fontWeight:700,fontSize:11,color:"rgba(255,255,255,.8)",marginBottom:10,textTransform:"uppercase",letterSpacing:.5}}>Próxima recompensa</div>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <div style={{width:48,height:48,borderRadius:14,background:"rgba(255,255,255,.2)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <Icon name={nextReward.icon} size={26} color="#fff"/>
              </div>
              <div style={{flex:1}}>
                <div style={{fontFamily:"Nunito",fontWeight:800,fontSize:15,color:"#fff"}}>{nextReward.name}</div>
                <div style={{height:4,borderRadius:99,background:"rgba(255,255,255,.3)",marginTop:8}}>
                  <div style={{height:"100%",background:"#fff",width:`${Math.min(coins/nextReward.cost*100,100)}%`,borderRadius:99}}/>
                </div>
                <div style={{fontFamily:"Nunito",fontSize:12,color:"rgba(255,255,255,.9)",marginTop:4}}>Faltam {nextReward.cost-coins}🪙</div>
              </div>
            </div>
          </div>
        )}
        {["Baixo","Médio","Alto"].map(tier=>{
          const items=MKTDATA.filter(r=>r.tier===tier)
          return (
            <div key={tier}>
              <div style={{fontFamily:"Nunito",fontWeight:800,fontSize:14,color:C.text,marginBottom:10,padding:"0 4px"}}>
                {tier==="Baixo"?"🟢 Fácil":tier==="Médio"?"🟡 Médio":"🔴 Premium"}
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                {items.map(r=>{
                  const can=coins>=r.cost
                  return (
                    <div key={r.id} style={{...C.card,padding:16,display:"flex",flexDirection:"column",gap:10}}>
                      <div style={{width:44,height:44,borderRadius:14,background:can?"#FFF8E1":"#F8F7FB",display:"flex",alignItems:"center",justifyContent:"center"}}>
                        <Icon name={r.icon} size={26} color={can?"#FFB323":C.softer}/>
                      </div>
                      <div style={{fontFamily:"Nunito",fontWeight:800,fontSize:13,color:C.text,lineHeight:1.3,flex:1}}>{r.name}</div>
                      {can?(
                        <button onClick={()=>handle(r)} style={{background:C.gold,color:C.goldTxt,border:"none",borderRadius:10,padding:"8px 0",fontFamily:"Nunito",fontWeight:900,fontSize:13,cursor:"pointer",boxShadow:"0 3px 0 #E0900A"}}>
                          Resgatar {r.cost}🪙
                        </button>
                      ):(
                        <div style={{display:"flex",alignItems:"center",gap:4}}>
                          <Icon name="lock" size={14} color={C.softer}/>
                          <span style={{fontFamily:"Nunito",fontWeight:700,fontSize:13,color:C.softer}}>{r.cost}🪙</span>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════
// PROFILE
// ══════════════════════════════════════════════
function ProfileScreen({ state, dispatch }) {
  const uid=String(state.viewUser)
  const user=state.users[state.viewUser]
  const stats=state.stats[uid]
  const unlocked=state.unlocked?.[uid]||[]
  const isMe=state.viewUser===0
  const pairIdx=isMe?1:0
  const gradient=isMe?"linear-gradient(160deg,#54A0FF,#2E7BF0)":"linear-gradient(160deg,#FF7DB5,#FF4F9A)"
  const shadow=isMe?"#1F5FCC":"#E02E7D"
  const assigns=state.draft.assigns?.[uid]||[]
  const tot=assigns.reduce((a,x)=>a+x.count,0)
  const don=assigns.reduce((a,x)=>a+(x.done||0),0)
  const commitment=tot>0?Math.round(don/tot*100):0

  return (
    <div style={{display:"flex",flexDirection:"column",paddingBottom:100}}>
      <div style={{background:gradient,padding:"52px 24px 36px",display:"flex",flexDirection:"column",alignItems:"center",gap:14}}>
        {/* Avatar with ring */}
        <div style={{position:"relative",width:96,height:96}}>
          <svg width="96" height="96" style={{position:"absolute",inset:0,transform:"rotate(-90deg)"}}>
            <circle cx="48" cy="48" r="42" fill="none" stroke="rgba(255,255,255,.25)" strokeWidth="7"/>
            <circle cx="48" cy="48" r="42" fill="none" stroke="#fff" strokeWidth="7"
              strokeDasharray={`${2*Math.PI*42*commitment/100} ${2*Math.PI*42*(1-commitment/100)}`}
              strokeLinecap="round"/>
          </svg>
          <div style={{position:"absolute",inset:7,borderRadius:"50%",background:"rgba(255,255,255,.2)",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <span style={{fontFamily:"Baloo 2",fontWeight:800,fontSize:36,color:"#fff"}}>{ini(user.name)}</span>
          </div>
        </div>
        <div style={{textAlign:"center"}}>
          <div style={{fontFamily:"Baloo 2",fontWeight:800,fontSize:24,color:"#fff"}}>{user.name}</div>
          <div style={{background:"rgba(255,255,255,.2)",borderRadius:999,padding:"4px 16px",marginTop:8,display:"inline-block"}}>
            <span style={{fontFamily:"Nunito",fontWeight:800,fontSize:13,color:"#fff"}}>{getTitle(stats.tasks_done)}</span>
          </div>
        </div>
      </div>

      <div style={{padding:"16px 16px 0",display:"flex",flexDirection:"column",gap:14}}>
        {/* Stats 2×2 */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          {[
            {label:"Tarefas",         value:stats.tasks_done,    icon:"check_circle",          color:C.green},
            {label:"Moedas",          value:stats.coins,         icon:"savings",               color:"#FFB323"},
            {label:"Melhor sequência",value:`${stats.best_streak}d`,icon:"local_fire_department",color:C.fire},
            {label:"Pontos totais",   value:stats.hall_points,   icon:"stars",                 color:C.violet},
          ].map(({label,value,icon,color})=>(
            <Card key={label} style={{textAlign:"center",padding:16}}>
              <Icon name={icon} size={24} color={color}/>
              <div style={{fontFamily:"Baloo 2",fontWeight:800,fontSize:22,color:C.text,marginTop:4}}>{value}</div>
              <div style={{fontFamily:"Nunito",fontSize:12,color:C.soft}}>{label}</div>
            </Card>
          ))}
        </div>

        {/* Achievements */}
        <Card>
          <div style={{fontFamily:"Nunito",fontWeight:800,fontSize:15,color:C.text,marginBottom:14}}>Conquistas</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10}}>
            {ACHS.map(ach=>{
              const got=unlocked.includes(ach.id)
              return (
                <div key={ach.id} style={{textAlign:"center"}}>
                  <div style={{width:52,height:52,borderRadius:16,background:got?"linear-gradient(135deg,#7B5BFF,#54A0FF)":"#F8F7FB",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 5px",boxShadow:got?`0 3px 0 ${C.violetSd}`:"none",transition:"all .3s"}}>
                    {got?<Icon name={ach.icon} size={26} color="#fff"/>:<Icon name="lock" size={20} color={C.softer}/>}
                  </div>
                  <div style={{fontFamily:"Nunito",fontWeight:700,fontSize:10,color:got?C.text:C.softer,lineHeight:1.2}}>{ach.label}</div>
                </div>
              )
            })}
          </div>
        </Card>

        {/* Hall da Fama */}
        <div style={{...C.card,background:"#211B33",borderRadius:22,padding:20}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
            <Icon name="auto_awesome" size={20} color="#FFB323"/>
            <span style={{fontFamily:"Nunito",fontWeight:800,fontSize:15,color:"#fff"}}>Hall da Fama</span>
          </div>
          <div style={{fontFamily:"Baloo 2",fontWeight:800,fontSize:40,color:"#FFB323",lineHeight:1}}>{stats.hall_points}</div>
          <div style={{fontFamily:"Nunito",fontSize:13,color:"rgba(255,255,255,.55)",marginTop:4}}>pontos acumulados · nunca resetam</div>
        </div>

        {/* Switch user */}
        <button onClick={()=>dispatch({type:"SWITCH_USER"})} style={{...C.card,padding:18,display:"flex",alignItems:"center",gap:12,border:"none",cursor:"pointer",width:"100%",textAlign:"left"}}>
          <div style={{width:44,height:44,borderRadius:13,background:isMe?"linear-gradient(160deg,#FF7DB5,#FF4F9A)":"linear-gradient(160deg,#54A0FF,#2E7BF0)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 3px 0 ${isMe?"#E02E7D":"#1F5FCC"}`,flexShrink:0}}>
            <span style={{fontFamily:"Baloo 2",fontWeight:800,fontSize:20,color:"#fff"}}>{ini(state.users[pairIdx].name)}</span>
          </div>
          <div style={{flex:1}}>
            <div style={{fontFamily:"Nunito",fontWeight:800,fontSize:14,color:C.text}}>Ver perfil de {state.users[pairIdx].name}</div>
            <div style={{fontFamily:"Nunito",fontSize:12,color:C.soft}}>Alternar visualização</div>
          </div>
          <Icon name="chevron_right" size={20} color={C.softer}/>
        </button>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════
// REDUCER
// ══════════════════════════════════════════════
function reduce(prev, action) {
  switch(action.type) {
    case "INIT": {
      const { house, myName, pairName, assigns } = action
      const s = blankState()
      s.house.name = house
      s.users[0].name = myName
      s.users[1].name = pairName
      s.draft.week_id = weekId()
      s.draft.assigns["0"] = Object.entries(assigns).filter(([,n])=>n>0).map(([id,count])=>({id,count,done:0}))
      return s
    }
    case "DRAFT_SET": {
      const { userId, taskId, count } = action
      const d = { ...prev.draft, assigns: { ...prev.draft.assigns } }
      const arr = [...(d.assigns[userId]||[])]
      const idx = arr.findIndex(a=>a.id===taskId)
      if (count===0) { d.assigns[userId]=arr.filter(a=>a.id!==taskId) }
      else if (idx>=0) { arr[idx]={...arr[idx],count}; d.assigns[userId]=arr }
      else { d.assigns[userId]=[...arr,{id:taskId,count,done:0}] }
      return { ...prev, draft:d }
    }
    case "DRAFT_CONFIRM": {
      const wid = weekId()
      if (prev.draft.week_id!==wid) {
        // New week – keep assignments, reset done counts
        const assigns = {}
        for (const [uid, arr] of Object.entries(prev.draft.assigns||{})) {
          assigns[uid] = arr.map(a=>({...a,done:0}))
        }
        return { ...prev, draft:{ ...prev.draft, week_id:wid, confirmed:true, bonus_given:false, assigns } }
      }
      return { ...prev, draft:{ ...prev.draft, confirmed:true } }
    }
    case "COMPLETE": {
      const { userId, taskId } = action
      const task = LIB.find(t=>t.id===taskId)
      if (!task) return prev
      const s0 = applyStreak({ ...prev.stats[userId] })
      const earned = Math.round(task.coins * (1 + sBon(s0.streak)))
      s0.month_points += task.pts
      s0.hall_points  += task.pts
      s0.coins        += earned
      s0.tasks_done   += 1
      s0.task_counts   = { ...(s0.task_counts||{}), [taskId]:(s0.task_counts?.[taskId]||0)+1 }

      // Update draft done
      const assigns = {}
      for (const [uid, arr] of Object.entries(prev.draft.assigns||{})) {
        if (uid===userId) assigns[uid]=arr.map(a=>a.id===taskId?{...a,done:Math.min(a.count,(a.done||0)+1)}:a)
        else assigns[uid]=arr
      }
      // Draft bonus
      let bonusGiven = prev.draft.bonus_given
      if (!bonusGiven) {
        const allDone = Object.values(assigns).flat().every(a=>(a.done||0)>=a.count)
        if (allDone && Object.values(assigns).flat().length>0) { s0.coins+=50; bonusGiven=true }
      }
      // History
      const now = new Date()
      const dateStr = `${now.toLocaleDateString("pt-BR")} ${now.toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"})}`
      const hist = { userId, taskId, taskName:task.name, pts:task.pts, coins:earned, date:dateStr }
      // Achievements
      const curUnl = prev.unlocked?.[userId]||[]
      const newAchs = checkAchs(s0, curUnl)
      return {
        ...prev,
        stats:{ ...prev.stats, [userId]:s0 },
        draft:{ ...prev.draft, assigns, bonus_given:bonusGiven },
        history:[ ...(prev.history||[]), hist ],
        unlocked:{ ...prev.unlocked, [userId]:[...curUnl,...newAchs] },
        _newAchs: newAchs,
      }
    }
    case "REDEEM": {
      const { userId, rewardId } = action
      const r = MKTDATA.find(x=>x.id===rewardId)
      if (!r) return prev
      const s0 = { ...prev.stats[userId] }
      if (s0.coins<r.cost) return prev
      s0.coins -= r.cost
      return { ...prev, stats:{ ...prev.stats, [userId]:s0 } }
    }
    case "SWITCH_USER":
      return { ...prev, viewUser:prev.viewUser===0?1:0 }
    case "RESET":
      return blankState()
    default: return prev
  }
}

// ══════════════════════════════════════════════
// APP ROOT
// ══════════════════════════════════════════════
const TABS = [
  { id:"home",    icon:"home",       label:"Início"  },
  { id:"draft",   icon:"swap_horiz", label:"Draft"   },
  { id:"tasks",   icon:"checklist",  label:"Tarefas" },
  { id:"market",  icon:"storefront", label:"Market"  },
  { id:"profile", icon:"person",     label:"Perfil"  },
]

export default function CasaApp() {
  const [state, setState]   = useState(loadState)
  const [tab, setTab]       = useState("home")
  const [toast, setToast]   = useState(null)
  const [achModal, setAchModal] = useState(null)

  useEffect(()=>{ store.set(state) }, [state])

  // Fonts
  useEffect(()=>{
    const links=[
      "https://fonts.googleapis.com/css2?family=Baloo+2:wght@700;800&family=Nunito:wght@600;700;800;900&display=swap",
      "https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,500,1,0&display=swap",
    ]
    links.forEach(href=>{ const l=document.createElement("link"); l.rel="stylesheet"; l.href=href; document.head.appendChild(l) })
    const s=document.createElement("style")
    s.textContent="*{box-sizing:border-box;-webkit-tap-highlight-color:transparent} .material-symbols-rounded{font-variation-settings:'FILL' 1,'wght' 500,'GRAD' 0,'opsz' 24}"
    document.head.appendChild(s)
  },[])

  // Check new week on load
  useEffect(()=>{
    if (state.house.name && state.draft.week_id && state.draft.week_id!==weekId()) {
      dispatch({type:"DRAFT_CONFIRM"}) // resets done counts for new week
    }
  },[])

  const dispatch = useCallback((action) => {
    setState(prev => {
      const next = reduce(prev, action)
      if (next._newAchs?.length>0) {
        const ach = ACHS.find(a=>a.id===next._newAchs[0])
        setTimeout(()=>setAchModal(ach), 400)
        delete next._newAchs
      }
      return next
    })
  }, [])

  const showToast = (msg) => { setToast(null); setTimeout(()=>setToast(msg),50) }

  if (!state.house.name) return (
    <div style={{maxWidth:430,margin:"0 auto",minHeight:"100vh",background:C.bg}}>
      <Onboarding onDone={({house,myName,pairName,assigns})=>dispatch({type:"INIT",house,myName,pairName,assigns})}/>
    </div>
  )

  return (
    <div style={{maxWidth:430,margin:"0 auto",minHeight:"100vh",background:C.bg,position:"relative",overflowX:"hidden"}}>
      <div style={{overflowY:"auto",minHeight:"100vh",paddingBottom:80}}>
        {tab==="home"    && <HomeScreen    state={state} dispatch={dispatch}/>}
        {tab==="draft"   && <DraftScreen   state={state} dispatch={dispatch}/>}
        {tab==="tasks"   && <TasksScreen   state={state} dispatch={dispatch}/>}
        {tab==="market"  && <MarketScreen  state={state} dispatch={dispatch} showToast={showToast}/>}
        {tab==="profile" && <ProfileScreen state={state} dispatch={dispatch}/>}
      </div>

      {/* Tab bar */}
      <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:430,background:"#fff",borderTop:"1px solid #F0ECFF",display:"flex",boxShadow:"0 -4px 24px rgba(33,27,51,.07)",zIndex:50}}>
        {TABS.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{flex:1,border:"none",background:"none",padding:"9px 0 10px",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
            <Icon name={t.icon} size={24} color={tab===t.id?C.violet:C.softer}/>
            <span style={{fontFamily:"Nunito",fontWeight:700,fontSize:10,color:tab===t.id?C.violet:C.softer,lineHeight:1}}>{t.label}</span>
          </button>
        ))}
      </div>

      {toast && <Toast msg={toast} onClose={()=>setToast(null)}/>}
      <AchModal ach={achModal} onClose={()=>setAchModal(null)}/>
    </div>
  )
}
