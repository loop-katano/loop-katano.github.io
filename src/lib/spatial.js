export const haversine = (a, b) => {
  const rad = Math.PI / 180;
  const dLat = (b.lat-a.lat)*rad, dLon = (b.lon-a.lon)*rad;
  const h = Math.sin(dLat/2)**2 + Math.cos(a.lat*rad)*Math.cos(b.lat*rad)*Math.sin(dLon/2)**2;
  return 6371 * 2 * Math.asin(Math.sqrt(Math.min(1,h)));
};
export function rankPlaces(places, a, b, category='全部', radius=5, strategy='fair') {
  return places.filter(p=>category==='全部'||p.category===category).map(p=>{
    const da=haversine(a,p), db=haversine(b,p);
    return {...p,da,db,total:da+db,max:Math.max(da,db),gap:Math.abs(da-db)};
  }).filter(p=>p.max<=radius).sort((x,y)=>strategy==='total'?x.total-y.total || x.gap-y.gap:x.max-y.max || x.gap-y.gap);
}
export function filterEvents(events, team, period=0, player=0) {
  return events.filter(e=>e.team===Number(team) && (!Number(period)||e.period===Number(period)) && (!Number(player)||e.player===Number(player)));
}
export function passNetwork(events) {
  const nodes=new Map(), edges=new Map();
  // Each node is the mean location of that player's pass origins, not tracking position.
  for(const e of events.filter(e=>e.type==='Pass' && !e.setPiece)) {
    const n=nodes.get(e.player)||{id:e.player,x:0,y:0,n:0};n.x+=e.start[0];n.y+=e.start[1];n.n++;nodes.set(e.player,n);
    if(e.complete && e.recipient){const key=[e.player,e.recipient].sort((a,b)=>a-b).join('-');const edge=edges.get(key)||{a:e.player,b:e.recipient,count:0};edge.count++;edges.set(key,edge);}
  }
  return {nodes:[...nodes.values()].map(n=>({...n,x:n.x/n.n,y:n.y/n.n})),edges:[...edges.values()].filter(e=>nodes.has(e.a)&&nodes.has(e.b))};
}
export function progressiveActions(events) {
  // Displayed explicitly as product-defined longitudinal gain >=10m on a 105x68m pitch.
  return events.filter(e=>(e.type==='Carry'||(e.type==='Pass'&&e.complete&&!e.setPiece))&&e.end&&(e.end[0]-e.start[0])*105/120>=10);
}
export function eventHeatmap(events) {
  const counts=Array.from({length:96},()=>0);
  for(const e of events){const x=Math.max(0,Math.min(11,Math.floor(e.start[0]/10)));const y=Math.max(0,Math.min(7,Math.floor(e.start[1]/10)));counts[y*12+x]++;}
  return counts;
}
