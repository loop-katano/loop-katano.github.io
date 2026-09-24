import { useEffect, useMemo, useState } from 'react';
import { leagues, matches, recentFifteen, richMatches, roundFive, roundSix, standings, teams } from '../data/footballData';

const matchFromPath = () => window.location.pathname.split('/matches/')[1] || null;
const displayDate = value => value.replace('2026-', '').replace('-', ' 月 ') + ' 日';

function Crest({ team, size = 'md' }) {
  const info = teams[team];
  return <img className={`fb-crest ${size}`} src={info.logo} alt={`${info.name} 队徽`} />;
}

function LeagueNav() {
  const [notice, setNotice] = useState('');
  const choose = league => {
    if (league.active) return;
    setNotice(`${league.name}暂未开放`);
    window.setTimeout(() => setNotice(''), 1800);
  };
  return <div className="fb-league-nav" aria-label="联赛筛选">
    {leagues.map(league => <button key={league.id} className={league.active ? 'active' : ''} onClick={() => choose(league)} aria-current={league.active ? 'page' : undefined}><img src={league.logo} alt=""/><b>{league.short}</b><span>{league.name}</span></button>)}
    {notice && <p role="status">{notice}</p>}
  </div>;
}

function StandingsTable() {
  return <section className="fb-table-card">
    <div className="fb-panel-head"><div><span>2026/27</span><h2>积分榜</h2></div><small>截至第 5 轮</small></div>
    <div className="fb-table-head"><span>#</span><span>球队</span><span>赛</span><span>净胜</span><span>积分</span></div>
    <div className="fb-table-body">{standings.map(row => <div className={`fb-table-row ${row.position <= 4 ? 'champions' : row.position >= 18 ? 'relegation' : ''}`} key={row.team}>
      <span>{row.position}</span><span><Crest team={row.team} size="xxs"/><b>{teams[row.team].shortName}</b></span><span>{row.played}</span><span>{row.goalDifference > 0 ? `+${row.goalDifference}` : row.goalDifference}</span><strong>{row.points}</strong>
    </div>)}</div>
    <div className="fb-table-key"><span><i className="champions"/>欧冠</span><span><i className="relegation"/>降级区</span></div>
  </section>;
}

function FixtureRow({ match, onOpen }) {
  return <button className="fb-fixture-row" onClick={() => onOpen(match.id)}>
    <time>{match.time}</time>
    <span className="fb-fixture-team home"><b>{teams[match.home].shortName}</b><Crest team={match.home} size="xs"/></span>
    <strong className={match.status === 'FT' ? '' : 'future'}>{match.status === 'FT' ? `${match.homeScore}–${match.awayScore}` : '—'}</strong>
    <span className="fb-fixture-team"><Crest team={match.away} size="xs"/><b>{teams[match.away].shortName}</b></span>
    <span className="fb-fixture-state">{match.status === 'FT' ? '已结束' : '未开始'}</span>
  </button>;
}

function Fixtures({ onOpen }) {
  const [round, setRound] = useState('recent');
  const list = round === 'recent' ? recentFifteen : round === 5 ? roundFive : roundSix;
  const groups = list.reduce((all, match) => ({...all,[match.date]:[...(all[match.date] || []),match]}),{});
  return <section className="fb-fixtures-card">
    <div className="fb-panel-head"><div><span>PREMIER LEAGUE</span><h2>{round === 'recent' ? '近期 15 场' : round === 5 ? '第 5 轮赛果' : '下一轮赛程'}</h2></div><div className="fb-round-switch"><button className={round==='recent'?'active':''} onClick={()=>setRound('recent')}>近期</button><button className={round===5?'active':''} onClick={()=>setRound(5)}>第 5 轮</button><button className={round===6?'active':''} onClick={()=>setRound(6)}>第 6 轮</button></div></div>
    {Object.entries(groups).map(([date, games]) => <div className="fb-fixture-day" key={date}><div className="fb-day-label"><b>{displayDate(date)}</b><span>北京时间</span></div>{games.map(match => <FixtureRow key={match.id} match={match} onOpen={onOpen}/>)}</div>)}
  </section>;
}

function MatchCenter({ onOpen }) {
  return <><LeagueNav/><div className="fb-league-heading"><div><span>ENGLAND · 2026/27</span><h1>英格兰足球超级联赛</h1></div><div><b>近期赛果</b><span>15 场比赛 · 可查看详情</span></div></div><div className="fb-overview-grid"><StandingsTable/><Fixtures onOpen={onOpen}/></div></>;
}

function MatchScore({ match }) {
  return <div className="fb-score">
    <div><Crest team={match.home} size="lg"/><b>{teams[match.home].name}</b></div>
    <strong>{match.status === 'FT' ? <>{match.homeScore}<i>–</i>{match.awayScore}</> : <time>{match.time}</time>}<small>{match.status === 'FT' ? '全场' : '未开始'}</small></strong>
    <div><Crest team={match.away} size="lg"/><b>{teams[match.away].name}</b></div>
  </div>;
}

function GoalColumns({ scorers }) {
  if (!scorers || (!scorers.home?.length && !scorers.away?.length)) return null;
  const format = entry => typeof entry === 'string' ? entry : `${entry.name} ${entry.minute}`;
  return <div className="fb-goal-columns"><div>{scorers.home?.map(item => <span key={format(item)}>{format(item)}{item.assist && <small>{item.assist}</small>}</span>)}</div><img src="/football/icons/futbol.svg" alt="进球"/><div>{scorers.away?.map(item => <span key={format(item)}>{format(item)}</span>)}</div></div>;
}

function DetailHeader({ match, scorers }) {
  return <section className="fb-detail-score"><div className="fb-detail-meta"><span>英超第 {match.round} 轮</span><time>{match.date} · {match.time} · 北京时间</time>{match.venue && <small>{match.venue}</small>}</div><MatchScore match={match}/><GoalColumns scorers={scorers}/></section>;
}

function StatCompare({ stat }) {
  const max = stat.suffix === '%' ? 100 : Math.max(Number(stat.home),Number(stat.away),1);
  return <div className="fb-stat-row">
    <b className="home">{stat.home}{stat.suffix}</b>
    <div className="home"><span style={{width:`${Number(stat.home)/max*100}%`}}/></div>
    <p>{stat.label}</p>
    <div className="away"><span style={{width:`${Number(stat.away)/max*100}%`}}/></div>
    <b className="away">{stat.away}{stat.suffix}</b>
  </div>;
}

function MatchTeams({ match, compact = false }) {
  return <div className={compact ? 'fb-match-teams compact' : 'fb-match-teams'}>
    <span><Crest team={match.home} size="xxs"/><b>{teams[match.home].shortName}</b><small>主队</small></span>
    <i>对阵</i>
    <span><Crest team={match.away} size="xxs"/><b>{teams[match.away].shortName}</b><small>客队</small></span>
  </div>;
}

const eventMinute = value => String(value).replace("'",'').split('+').reduce((sum,part)=>sum+Number(part || 0),0);

function Momentum({ values, events, match }) {
  const width = 720, baseline = 105, amplitude = 78;
  const points = values.map((value,index)=>`${index/(values.length-1)*width},${baseline-value/100*amplitude}`).join(' ');
  const area = `0,${baseline} ${points} ${width},${baseline}`;
  return <div className="fb-momentum"><svg className="fb-momentum-plot" viewBox="0 0 720 210" role="img" aria-label={`${teams[match.home].name} 与 ${teams[match.away].name} 比赛动量及双方进球时间`}><defs><clipPath id="momentum-home"><rect width="720" height="105"/></clipPath><clipPath id="momentum-away"><rect y="105" width="720" height="105"/></clipPath></defs><line x1="0" y1={baseline} x2="720" y2={baseline}/><polygon points={area} className="home" clipPath="url(#momentum-home)"/><polygon points={area} className="away" clipPath="url(#momentum-away)"/><line className="half" x1="360" y1="0" x2="360" y2="210"/>{events.map(event => {const x=Math.min(eventMinute(event.minute),95)/95*width;const home=event.team==='home';return <g className={`fb-momentum-goal ${event.team}`} key={`${event.minute}-${event.player}`}><image href="/football/icons/futbol.svg" x={x-7} y={home?8:188} width="14" height="14"/><line x1={x} y1={home?25:185} x2={x} y2={baseline}/></g>})}</svg><div className="fb-axis"><span>0'</span><span>半场</span><span>全场</span></div><MatchTeams match={match} compact/></div>;
}

function MatchEvent({ event }) {
  const body = <p><strong>{event.player}</strong><span>{event.detail}</span></p>;
  return <div className={`fb-event ${event.team}`}>
    {event.team === 'home' ? <>{body}<img src="/football/icons/futbol.svg" alt="进球"/><b>{event.minute}</b><i/></> : <><i/><b>{event.minute}</b><img src="/football/icons/futbol.svg" alt="进球"/>{body}</>}
  </div>;
}

function MatchOverview({ match, data, onPlayer, fullPlayers = false }) {
  const squad = data.lineups ? [...data.lineups.home.players,...data.lineups.home.substitutes,...data.lineups.away.players,...data.lineups.away.substitutes] : [];
  const topPlayers = (data.topPlayers || squad.filter(player=>player.rating != null).sort((a,b)=>b.rating-a.rating).slice(0,4)).map(player=>squad.find(item=>item.id===player.id) || player);
  const crestFor = player => Object.values(teams).find(team=>String(team.id)===String(player.teamId))?.logo;
  return <div className="fb-detail-grid"><section className="fb-match-facts"><div className="fb-momentum-pane"><div className="fb-card-title"><span>MOMENTUM</span><h2>比赛动量</h2></div><Momentum values={data.momentum} events={data.events} match={match}/></div><div className="fb-stats-pane"><div className="fb-card-title"><span>TOP STATS</span><h2>关键统计</h2></div><MatchTeams match={match}/>{data.stats.map(stat=><StatCompare stat={stat} key={stat.label}/>)}</div></section><section className="fb-events-card"><div className="fb-card-title"><span>MATCH EVENTS</span><h2>进球事件</h2></div>{data.events.length ? data.events.map(event=><MatchEvent event={event} key={`${event.minute}-${event.player}`}/>) : <p className="fb-empty-event">本场没有进球</p>}</section><section className="fb-players-card"><div className="fb-card-title"><span>TOP PLAYERS</span><h2>本场评分</h2></div>{topPlayers.map(player=><button key={player.id} disabled={!fullPlayers} onClick={()=>fullPlayers&&onPlayer(player)}><img src={player.image} alt={`${player.name} 头像`} onError={event=>{event.currentTarget.src=crestFor(player)}}/><span><b>{player.name}</b><small>{player.summary || (player.goals ? `${player.goals} 球` : player.assists ? `${player.assists} 助攻` : `${player.touches} 次触球`)}</small></span><strong>{player.rating != null ? player.rating.toFixed(1) : '—'}</strong></button>)}</section></div>;
}

function Formation({ match, data, onPlayer }) {
  const [side,setSide] = useState('home');
  const lineup = data.lineups[side];
  const teamKey = match[side];
  return <section className="fb-lineup-layout"><div className="fb-lineup-toolbar"><div><span>LINEUP</span><h2>阵型与替补席</h2></div><div>{['home','away'].map(key=><button key={key} className={side===key?'active':''} onClick={()=>setSide(key)}><Crest team={match[key]} size="xs"/>{teams[match[key]].shortName}<b>{data.lineups[key].formation}</b></button>)}</div></div><div className="fb-pitch-wrap"><div className="fb-pitch" style={{backgroundImage:"url('/football/icons/pitch.svg')"}}>{lineup.players.map(player => <button key={player.id} className="fb-pitch-player" style={{left:`${player.position.x}%`,top:`${player.position.y}%`}} onClick={()=>onPlayer(player)}><span className={player.rating>=7.5?'high':player.rating!=null&&player.rating<6.5?'low':''}>{player.rating != null ? player.rating.toFixed(1) : '—'}</span><img src={player.image} alt={`${player.name} 头像`} onError={event=>{event.currentTarget.src=teams[teamKey].logo}}/><b>{player.name.split(' ').slice(-1)}</b><small>#{player.number} · {player.role}</small></button>)}</div><p>{lineup.coach ? `主教练：${lineup.coach} · ` : ''}点击球员查看本场详细数据</p></div><div className="fb-bench"><div className="fb-bench-head"><div><span>SUBSTITUTES</span><h3>替补席</h3></div><small>绿色为上场时间</small></div><div className="fb-bench-grid">{lineup.substitutes.map(player=><button key={player.id} className={player.minute?'played':''} onClick={()=>onPlayer(player)}><img src={player.image} alt={`${player.name} 头像`} onError={event=>{event.currentTarget.src=teams[teamKey].logo}}/><span><b>{player.name}</b><small>#{player.number} · {player.minute ? `${player.minute}' 换下 ${player.replaced}` : '未出场'}</small></span>{player.minute&&<strong>{player.minute}'</strong>}</button>)}</div></div></section>;
}

function ActivityMap({ player }) {
  const seed = Number(player.id.slice(-4));
  const points = Array.from({length:18},(_,i)=>({x:15+((seed*(i+3)*17)%70),y:12+((seed*(i+7)*11)%76),r:4+((seed+i*9)%7)}));
  return <div className="fb-activity-map" style={{backgroundImage:"url('/football/icons/pitch.svg')"}}>{points.map((p,i)=><i key={i} style={{left:`${p.x}%`,top:`${p.y}%`,width:p.r*2,height:p.r*2}}/>)}</div>;
}

function ShotMap({ player }) {
  if (!player.shotmap) return null;
  return <div className="fb-shot-section"><div className="fb-player-section"><span>SHOT MAP</span><h3>射门分布</h3></div><div className="fb-shot-map" style={{backgroundImage:"url('/football/icons/pitch.svg')"}}>{player.shotmap.map(shot=><span key={shot.min} className={shot.type} style={{left:`${shot.x/105*100}%`,top:`${shot.y/68*100}%`}}><b>{shot.min}'</b></span>)}</div></div>;
}

function PlayerDrawer({ player, onClose }) {
  useEffect(()=>{const onKey=e=>e.key==='Escape'&&onClose();window.addEventListener('keydown',onKey);return()=>window.removeEventListener('keydown',onKey)},[onClose]);
  if (!player) return null;
  const metrics = [['评分',player.rating != null ? player.rating.toFixed(2) : '—'],['出场',player.minute ? `${player.minute}' 替补上场` : player.minutes ? `${player.minutes} 分钟` : '未出场'],['进球',player.goals || 0],['助攻',player.assists || 0],['预期进球',player.xg ?? '—'],['预期助攻',player.xa ?? '—'],['射门',player.shots ?? '—'],['触球',player.touches ?? '—'],['成功传球',player.passes ?? '—'],['创造机会',player.chances ?? '—'],['防守动作',player.defactions ?? '—'],['抢断',player.tackles ?? '—'],['拦截',player.interceptions ?? '—'],['解围',player.clearances ?? '—'],['恢复球权',player.recoveries ?? '—'],['赢得对抗',player.duels ?? '—'],['跑动距离',player.distance != null ? `${(player.distance/1000).toFixed(2)} km` : '—'],['最高速度',player.speed != null ? `${player.speed.toFixed(1)} km/h` : '—']];
  const teamLogo = Object.values(teams).find(team=>String(team.id)===String(player.teamId))?.logo;
  return <div className="fb-drawer-backdrop" onMouseDown={event=>event.target===event.currentTarget&&onClose()}><aside className="fb-player-drawer" role="dialog" aria-modal="true" aria-label={`${player.name} 球员详情`}><button className="fb-close" onClick={onClose}>关闭</button><div className="fb-player-head"><img src={player.image} alt={`${player.name} 头像`} onError={event=>{event.currentTarget.src=teamLogo}}/><div><span>{player.role} · #{player.number}{player.captain ? ' · 队长' : ''}</span><h2>{player.name}</h2><p>{player.teamName}{player.country ? ` · ${player.country}` : ''}</p></div></div><div className="fb-player-metrics">{metrics.map(([label,value])=><p key={label}><b>{value}</b><span>{label}</span></p>)}</div><ShotMap player={player}/><div className="fb-player-section"><span>ACTIVITY</span><h3>活动区域</h3><p>活动区域为阵型与角色示意；评分、传球、攻防与跑动指标来自本场比赛数据。</p></div><ActivityMap player={player}/></aside></div>;
}

function BasicDetail({ match, onBack }) {
  return <section className="fb-basic-detail"><button className="fb-back" onClick={onBack}>返回联赛首页</button><DetailHeader match={match} scorers={match.scorers}/></section>;
}

function MatchDetail({ match, onBack }) {
  const [tab,setTab] = useState('overview');
  const [player,setPlayer] = useState(null);
  const data = richMatches[match.id];
  if (!data) return <BasicDetail match={match} onBack={onBack}/>;
  const hasFullLineup = Boolean(data.lineups?.home?.players?.length && data.lineups?.away?.players?.length);
  return <section className="fb-detail"><button className="fb-back" onClick={onBack}>返回联赛首页</button><DetailHeader match={match} scorers={data.scorers}/><nav className="fb-detail-tabs"><button className={tab==='overview'?'active':''} onClick={()=>setTab('overview')}>比赛概览</button>{hasFullLineup&&<button className={tab==='lineup'?'active':''} onClick={()=>setTab('lineup')}>阵容与球员</button>}</nav>{tab==='overview'?<MatchOverview match={match} data={data} onPlayer={setPlayer} fullPlayers={hasFullLineup}/>:<Formation match={match} data={data} onPlayer={setPlayer}/>}<PlayerDrawer player={player} onClose={()=>setPlayer(null)}/></section>;
}

export function FootballProject() {
  const [selectedId,setSelectedId] = useState(matchFromPath());
  useEffect(()=>{const onPop=()=>setSelectedId(matchFromPath());window.addEventListener('popstate',onPop);return()=>window.removeEventListener('popstate',onPop)},[]);
  const selectedMatch = useMemo(()=>matches.find(match=>match.id===selectedId),[selectedId]);
  const openMatch = id => {window.history.pushState({},'',`/projects/football-analytics/matches/${id}`);setSelectedId(id);window.scrollTo({top:90,behavior:'smooth'})};
  const backToHub = () => {window.history.pushState({},'','/projects/football-analytics');setSelectedId(null);window.scrollTo({top:90,behavior:'smooth'})};
  return <main className="product-page football-page"><section className="product-hero dark container"><div><span className="project-kicker">FOOTBALL DATA</span><h1>Premier League</h1><p>真实赛程的数据统计与可视化</p></div><span className="fb-verified">2026/27 · 第 5 轮</span></section><div className="fb-app container"><section className="fb-main">{selectedMatch?<MatchDetail match={selectedMatch} onBack={backToHub}/>:<MatchCenter onOpen={openMatch}/>}</section></div></main>;
}
