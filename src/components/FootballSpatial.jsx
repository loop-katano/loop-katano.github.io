import { useMemo, useState } from 'react';
import data from '../data/footballSpatial.json';

const names={network:'传球网络',progress:'向前推进',heat:'持球事件热区'};
const periods=[[1,'上半场'],[2,'下半场'],[3,'加时上半场'],[4,'加时下半场'],[0,'全场 · 含加时']];
const short=name=>name.includes('Messi')?'Messi':name.includes('Mbappé')?'Mbappé':name.split(' ').slice(-1)[0];
function PitchLines(){return <g fill="none" stroke="#76877b" strokeWidth=".35"><rect x="0" y="0" width="120" height="80"/><path d="M60 0V80M0 18H18V62H0M120 18H102V62H120M0 30H6V50H0M120 30H114V50H120"/><circle cx="60" cy="40" r="9.15"/><circle cx="60" cy="40" r=".45" fill="#76877b"/><path d="M18 32A9.15 9.15 0 0 1 18 48M102 32A9.15 9.15 0 0 0 102 48"/></g>}
export function FootballSpatial(){
 const [team,setTeam]=useState(779),[period,setPeriod]=useState(1),[player,setPlayer]=useState(0),[view,setView]=useState('network'),[minPass,setMinPass]=useState(3),[hover,setHover]=useState('');
 const roster=data.players.filter(p=>p.team===team);
 const snapshot=data.aggregates[`${team}:${period}:${player}`];
 const network=data.aggregates[`${team}:${period}:0`].network;
 const byId=useMemo(()=>new Map(data.players.map(p=>[p.id,p])),[]);
 const nodes=new Map(network.nodes.map(n=>[n.id,n]));
 const edges=network.edges.filter(e=>e.count>=minPass);
 const cells=view==='heat'?snapshot.heat:snapshot.advanceCells;
 const max=Math.max(1,...cells);
 const leader=roster.map(p=>({...p,...data.aggregates[`${team}:${period}:${p.id}`]})).sort((a,b)=>(b.passCount+b.carryCount)-(a.passCount+a.carryCount)).slice(0,6);
 const name=team===779?'阿根廷':'法国';
 const changeTeam=t=>{setTeam(t);setPlayer(0);setHover('')};
 return <section className="spatial-football">
 <div className="spatial-match-head"><div><span>2022 WORLD CUP · FINAL</span><h2>阿根廷 <b>3 — 3</b> 法国</h2><p>2022.12.18 · 点球决胜不计入空间分析</p></div><a href={data.source} target="_blank" rel="noreferrer">查看事件数据 ↗</a></div>
 <div className="spatial-toolbar"><div className="segmented dark">{[779,771].map(t=><button key={t} className={team===t?'active':''} onClick={()=>changeTeam(t)}>{t===779?'阿根廷':'法国'}</button>)}</div><label>时段<select aria-label="比赛时段" value={period} onChange={e=>{setPeriod(Number(e.target.value));setHover('')}}>{periods.map(([id,name])=><option key={id} value={id}>{name}</option>)}</select></label><label>球员<select aria-label="球员筛选" value={player} onChange={e=>{setPlayer(Number(e.target.value));setHover('')}}><option value={0}>全队</option>{roster.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select></label></div>
 <div className="spatial-analysis-grid"><div className="pitch-card"><nav className="analysis-tabs" aria-label="空间分析类型">{Object.entries(names).map(([id,name])=><button key={id} className={view===id?'active':''} onClick={()=>{setView(id);setHover('')}}>{name}</button>)}</nav><div className="pitch-caption"><span>{name} · {player?byId.get(player)?.name:'全队'}</span><span>进攻方向 →</span></div>
 <svg className="analysis-pitch" viewBox="-4 -5 128 90" role="img" aria-label={`${name}${names[view]}，进攻方向由左向右`}><rect x="-4" y="-5" width="128" height="90" rx="2" fill="#243c30"/>
 {view!=='network'&&cells.map((count,i)=>count?<g key={i} onMouseEnter={()=>setHover(`${view==='heat'?'持球事件':'向前推进'}：该区域 ${count} 次`)}><rect x={i%12*10} y={Math.floor(i/12)*10} width="10" height="10" fill={view==='heat'?'#c9f04a':'#eea66f'} opacity={.12+.7*count/max}/>{view==='progress'&&<text x={i%12*10+5} y={Math.floor(i/12)*10+6} textAnchor="middle" fontSize="2.5" fill="#fff">{count} →</text>}<title>{count} 次</title></g>:null)}
 <PitchLines/>
 {view==='network'&&<>{edges.map(e=>{const a=nodes.get(e.a),b=nodes.get(e.b),focus=!player||[e.a,e.b].includes(player);return <line key={`${e.a}-${e.b}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#c9f04a" strokeWidth={Math.min(1.8,.2+e.count*.065)} opacity={focus?.55:.12} onMouseEnter={()=>setHover(`${byId.get(e.a)?.name} ↔ ${byId.get(e.b)?.name}：${e.count} 次成功传球`)}><title>{e.count} 次成功传球</title></line>})}{network.nodes.filter(n=>n.n>=2).map(n=><g key={n.id} transform={`translate(${n.x},${n.y})`} role="button" tabIndex="0" aria-label={`查看 ${byId.get(n.id)?.name}`} onClick={()=>setPlayer(player===n.id?0:n.id)} onKeyDown={e=>{if(e.key==='Enter')setPlayer(player===n.id?0:n.id)}} onMouseEnter={()=>setHover(`${byId.get(n.id)?.name} · ${n.n} 次运动战传球发起位置均值`)}><circle r={1.7+Math.min(1.2,n.n/40)} fill={player===n.id?'#f4ae79':'#e2edbe'} stroke="#243c30" strokeWidth=".4"/><text y=".85" textAnchor="middle" fontSize="2.5" fill="#23362b" fontWeight="700">{byId.get(n.id)?.number||'·'}</text><text y="5" textAnchor="middle" fontSize="2.1" fill="#fff" stroke="#243c30" strokeWidth=".6" paintOrder="stroke">{short(byId.get(n.id)?.name||'')}</text></g>)}</>}
 </svg><div className="pitch-status" role="status">{hover||(view==='network'?'点击球员，突出其传球连接。节点不是跟踪数据平均站位。':view==='heat'?'颜色越亮，持球事件越集中。不是逐次触球或跑动轨迹。':'网格数字为从该区域发起的推进次数。不是 xT。')}</div>
 {view==='network'?<label className="network-threshold">显示至少 {minPass} 次的连接<input aria-label="最小传球连接次数" type="range" min="1" max="12" value={minPass} onChange={e=>setMinPass(Number(e.target.value))}/></label>:<div className="heat-legend"><span>0 次</span><i style={{background:view==='heat'?'linear-gradient(90deg,#314932,#c9f04a)':'linear-gradient(90deg,#334536,#eea66f)'}}/><span>{max} 次</span></div>}
 </div><aside className="spatial-insights"><span className="section-overline">当前选择 · 实际计算</span><h3>{player?short(byId.get(player)?.name||''):name}</h3><div className="spatial-metrics"><p><b>{snapshot.passCount}</b><span>向前传球</span></p><p><b>{snapshot.carryCount}</b><span>向前带球</span></p><p><b>{snapshot.eventCount}</b><span>持球事件</span></p></div><h4>推进贡献</h4><p className="subtle-copy">当前时段 · 全队球员</p><div className="progress-leaders">{leader.map(p=><button key={p.id} className={player===p.id?'selected':''} onClick={()=>{setPlayer(p.id);setView('progress')}}><span>{short(p.name)}</span><b>{p.passCount+p.carryCount}</b><i><u style={{width:`${(p.passCount+p.carryCount)/Math.max(1,leader[0].passCount+leader[0].carryCount)*100}%`}}/></i></button>)}</div>{player>0&&<button className="reset-player" onClick={()=>setPlayer(0)}>返回全队</button>}</aside></div>
 <details className="analysis-notes"><summary>数据来源与统计口径</summary><p>StatsBomb Open Data，比赛 3869685；源数据 {data.rawCount} 条事件。页面仅分发聚合分析，不附带原始事件库。传球网络使用运动战成功传球，双向合并计数，节点为各球员传球发起位置均值；全场视图包含换人前后球员。</p><p>向前推进为本产品口径：在标准化105×68米球场上，向对方底线纵向推进至少10米的成功运动战传球或带球；不等同于其他供应商的 Progressive Pass/Carry 定义。热区统计 Pass、Carry、Shot、Ball Receipt、Dribble 的事件起点；不同事件可能属于同一控球序列，不代表独立触球次数。所有时段均排除点球大战。</p><p>原坐标120×80统一以左至右为进攻方向。界面支持球队、球员、时段筛选；没有真实用户增长或商业效果数据。</p></details>
 <div className="football-source"><img src="/football/statsbomb.png" alt="StatsBomb"/><span>Data: StatsBomb Open Data · 本人实现数据处理、空间聚合和交互分析</span><a href="/football/StatsBomb-LICENSE.pdf" target="_blank" rel="noreferrer">数据使用条款 ↗</a></div>
 </section>
}
