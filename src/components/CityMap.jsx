import { useState } from 'react';
import data from '../data/xianMap.json';
const [west,south,east,north]=data.bounds;
const ratio=(east-west)*Math.cos((south+north)/2*Math.PI/180)/(north-south);
const width=1000, height=1000/ratio;
export const projectPoint = p => [(p.lon-west)/(east-west)*width,(north-p.lat)/(north-south)*height];
const coordinates=p=>p.map(([lon,lat])=>projectPoint({lon,lat}).join(',')).join(' ');

export function CityMap({a,b,places=[],selected,onSelect,onPick,picking,mini=false}) {
  const [zoom,setZoom]=useState(1);
  const [center,setCenter]=useState([width/2,height/2]);
  const w=width/zoom,h=height/zoom;
  const origins=[a,b].filter(Boolean);
  const pick=e=>{
    if(!picking || !onPick) return;
    const point=new DOMPoint(e.clientX,e.clientY).matrixTransform(e.currentTarget.getScreenCTM().inverse());
    const lon=west+point.x/width*(east-west),lat=north-point.y/height*(north-south);
    if(lon>=west&&lon<=east&&lat>=south&&lat<=north) onPick({lon,lat,name:'地图选点'});
  };
  const shift=(dx,dy)=>setCenter(([x,y])=>[Math.min(width-w/2,Math.max(w/2,x+dx*w*.2)),Math.min(height-h/2,Math.max(h/2,y+dy*h*.2))]);
  const named=[...new Map(data.roads.filter(r=>r.name&&['primary','secondary','tertiary'].includes(r.type)).map(r=>[r.name,r])).values()];
  return <div className={`city-map ${mini?'mini':''} ${picking?'picking':''}`}>
    <svg viewBox={`${center[0]-w/2} ${center[1]-h/2} ${w} ${h}`} onClick={pick} role="img" aria-label="西安南大街片区地图，显示真实道路、出发点和候选会合点">
      <rect width={width} height={height} fill="#e9e9df"/>
      <defs><pattern id={mini?'small-grid':'city-grid'} width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" stroke="#e2e3d8" strokeWidth=".6"/></pattern></defs>
      <rect width={width} height={height} fill={`url(#${mini?'small-grid':'city-grid'})`}/>
      {data.parks.map((p,i)=><polygon key={i} points={coordinates(p)} fill="#cfdbc2"/>)}
      {data.roads.map(r=><polyline key={r.id} points={coordinates(r.points)} fill="none" stroke="#fbfcf7" strokeWidth={['primary','secondary'].includes(r.type)?16:['tertiary','residential'].includes(r.type)?9:3.5} strokeLinecap="round"/>)}
      {named.slice(0,10).map(r=>{const p=r.points[Math.floor(r.points.length/2)];const [x,y]=projectPoint({lon:p[0],lat:p[1]});return <text key={r.name} x={x} y={y} fontSize="12" fill="#92968a" textAnchor="middle">{r.name}</text>})}
      {selected&&origins.map((p,i)=>{const from=projectPoint(p),to=projectPoint(selected);return <line key={i} x1={from[0]} y1={from[1]} x2={to[0]} y2={to[1]} stroke={i?'#be7353':'#354d3f'} strokeWidth="2.5" strokeDasharray="7 7"/>})}
      {places.slice(0,30).map((p,i)=>{const [x,y]=projectPoint(p);const active=p.id===selected?.id;return <g key={p.id} transform={`translate(${x},${y})`} className="map-point" onClick={e=>{e.stopPropagation();onSelect?.(p)}} role={mini?undefined:'button'} tabIndex={mini?undefined:0} aria-label={`选择 ${p.name}`} onKeyDown={e=>{if(e.key==='Enter')onSelect?.(p)}}><circle r={active?18:10} fill={active?'#c9f04a':'#fff'} stroke="#405047" strokeWidth="2"/><text y="4" textAnchor="middle" fontSize={active?13:9} fontWeight="700" fill="#263328">{i+1}</text><title>{p.name}</title>{active&&<g><rect x="-85" y="-56" width="170" height="28" rx="7" fill="#243e30"/><text y="-37" textAnchor="middle" fontSize="13" fill="#fff">{p.name.length>12?p.name.slice(0,12)+'…':p.name}</text></g>}</g>})}
      {origins.map((p,i)=>{const [x,y]=projectPoint(p);return <g key={i} transform={`translate(${x},${y})`}><circle r="21" fill={i?'#be7353':'#354d3f'} stroke="#fff" strokeWidth="3"/><text y="6" textAnchor="middle" fontSize="18" fontWeight="700" fill="#fff">{i?'B':'A'}</text></g>})}
    </svg>
    {!mini&&<><div className="map-label">西安 · 南大街片区 <span>WGS84</span></div><div className="map-controls"><button onClick={()=>setZoom(z=>Math.min(3,z+.5))} aria-label="放大地图">+</button><button onClick={()=>{setZoom(z=>Math.max(1,z-.5));setCenter([width/2,height/2])}} aria-label="缩小地图">−</button><button onClick={()=>{setZoom(1);setCenter([width/2,height/2])}} aria-label="重置地图">⌂</button>{zoom>1&&<><button onClick={()=>shift(0,-1)} aria-label="向北平移">↑</button><button onClick={()=>shift(-1,0)} aria-label="向西平移">←</button><button onClick={()=>shift(1,0)} aria-label="向东平移">→</button><button onClick={()=>shift(0,1)} aria-label="向南平移">↓</button></>}</div><div className="map-note">{picking?`点击地图设置出发点 ${picking}`:'虚线为直线连接，不是出行路线'} · N ↑</div></>}
    <a className="map-credit" href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">© OpenStreetMap contributors · ODbL</a>
  </div>;
}
