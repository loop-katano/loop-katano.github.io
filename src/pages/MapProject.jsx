import { useMemo, useState } from 'react';
import data from '../data/xianMap.json';
import { CityMap } from '../components/CityMap';
import { rankPlaces } from '../lib/spatial';
import { downloadText } from '../lib/storage';

export const initialA={lon:108.937,lat:34.2588,name:'西北侧出发点'};
export const initialB={lon:108.948,lat:34.252,name:'东南侧出发点'};
const initial={a:initialA,b:initialB,category:'全部',radius:1.5,strategy:'fair'};
const key='loophow-meetpoint-v1';
function load(){try {const d=JSON.parse(localStorage.getItem(key));if(d&&[d.a,d.b].every(p=>p&&Number.isFinite(p.lon)&&Number.isFinite(p.lat)&&p.lon>=data.bounds[0]&&p.lon<=data.bounds[2]&&p.lat>=data.bounds[1]&&p.lat<=data.bounds[3])&&['全部','饮品','餐饮','阅读'].includes(d.category)&&['fair','total'].includes(d.strategy)&&d.radius>=.3&&d.radius<=2)return d;}catch{}return initial;}
const km=n=>`${n.toFixed(2)} km`;
export function MapProject(){
 const [form,setForm]=useState(load),[picking,setPicking]=useState(''),[selectedId,setSelectedId]=useState(null),[notice,setNotice]=useState('');
 const patch=p=>{setForm(f=>({...f,...p}));setNotice('')};
 const results=useMemo(()=>rankPlaces(data.pois,form.a,form.b,form.category,form.radius,form.strategy),[form]);
 const selected=results.find(p=>p.id===selectedId)||results[0];
 const pick=p=>{patch({[picking.toLowerCase()]:p});setPicking('')};
 const save=()=>{try{localStorage.setItem(key,JSON.stringify(form));setNotice('方案已保存在此浏览器')}catch{setNotice('浏览器不允许保存，请导出比较结果')}};
 const exportResult=()=>{
  const quote=s=>'"'+String(s).replaceAll('"','""')+'"';
  const rows=[['场所','类别','A直线距离km','B直线距离km','合计km','差距km','来源'],...results.map(p=>[p.name,p.category,p.da.toFixed(3),p.db.toFixed(3),p.total.toFixed(3),p.gap.toFixed(3),`https://www.openstreetmap.org/${p.osmType}/${p.id}`])];
  downloadText('会合点比较.csv','\ufeff'+rows.map(r=>r.map(quote).join(',')).join('\n'),'text/csv;charset=utf-8');
 };
 return <main className="product-page map-page"><section className="product-hero container"><div><span className="project-kicker">01 / LOCATION INTELLIGENCE</span><h1>城市会合点</h1><p>两个人，从不同地方出发。找一个都方便的位置。</p></div><span className="quiet-tag">西安 · 南大街片区</span></section>
 <div className="meet-layout container"><aside className="meet-form"><div className="section-overline">MEET HALFWAY</div><h2>在哪里见面？</h2>
 {['a','b'].map((key,i)=><div className="origin-field" key={key}><label htmlFor={`origin-${key}`}><i className={key}>{key.toUpperCase()}</i>{i?'另一位的出发点':'你的出发点'}</label><select id={`origin-${key}`} value={form[key].id||'custom'} onChange={e=>{const p=data.pois.find(p=>p.id===e.target.value);if(p)patch({[key]:p})}}><option value="custom">{form[key].id?'选择已知场所':form[key].name}</option>{data.pois.map(p=><option value={p.id} key={p.id}>{p.name} · {p.id.slice(-4)}</option>)}</select><button className={picking===key.toUpperCase()?'pick-button active':'pick-button'} onClick={()=>setPicking(picking===key.toUpperCase()?'':key.toUpperCase())}>{picking===key.toUpperCase()?'取消选点':'在地图上选点'} ↗</button></div>)}
 <label className="field-title">会合场所</label><div className="segmented">{['全部',...new Set(data.pois.map(p=>p.category))].map(c=><button key={c} className={form.category===c?'active':''} onClick={()=>patch({category:c})}>{c}</button>)}</div>
 <label className="field-title" htmlFor="meet-radius">每人直线距离上限 <strong>{form.radius.toFixed(1)} km</strong></label><input id="meet-radius" type="range" min="0.3" max="2" step="0.1" value={form.radius} onChange={e=>patch({radius:Number(e.target.value)})}/>
 <label className="field-title" htmlFor="meet-strategy">排序偏好</label><select id="meet-strategy" value={form.strategy} onChange={e=>patch({strategy:e.target.value})}><option value="fair">优先缩短较远一方的距离</option><option value="total">优先缩短双方总距离</option></select>
 <button className="solid-button save-plan" onClick={save}>保存当前方案</button><p className="status-note" role="status">{notice||'选点和方案仅保存在本机，不上传位置。'}</p></aside>
 <section className="meet-main"><CityMap a={form.a} b={form.b} places={results} selected={selected} onSelect={p=>setSelectedId(p.id)} onPick={pick} picking={picking}/>
 {selected?<div className="meet-recommendation"><div><span>当前候选</span><h2>{selected.name}</h2><small>{selected.category} · <a href={`https://www.openstreetmap.org/${selected.osmType}/${selected.id}`} target="_blank" rel="noreferrer">查看原始地点 ↗</a></small></div><div className="distance-pair"><p><span>A 出发</span><b>{km(selected.da)}</b></p><p><span>B 出发</span><b>{km(selected.db)}</b></p><p><span>距离差</span><b>{km(selected.gap)}</b></p></div></div>:<div className="empty-state"><h3>当前范围内没有共同候选</h3><p>请放宽距离上限、更换类别或调整出发点。</p><button onClick={()=>patch({radius:2,category:'全部'})}>放宽条件</button></div>}
 <div className="results-heading"><h3>{results.length} 个候选地点</h3><button onClick={exportResult} disabled={!results.length}>导出比较结果 ↓</button></div><div className="place-results">{results.map((p,i)=><button key={p.id} className={p.id===selected?.id?'place-row active':'place-row'} onClick={()=>setSelectedId(p.id)}><span>{String(i+1).padStart(2,'0')}</span><b>{p.name}<small>{p.category}</small></b><span>A {km(p.da)}</span><span>B {km(p.db)}</span></button>)}</div>
 </section></div><div className="product-footnote container"><p>数据：OpenStreetMap · {data.timestamp?.slice(0,10)} 快照 · {data.pois.length} 个已命名场所。覆盖范围有限，营业状态未核验。</p><p>距离按 WGS84 坐标计算，不代表步行、骑行距离或到达时间；不提供道路导航。本人实现：空间筛选、双点排序、地图交互和方案保存。</p></div></main>
}
