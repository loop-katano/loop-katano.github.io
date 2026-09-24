import crawledRichMatches from './footballRichMatches.json';

export const leagues = [
  { id: 'premier-league', name: '英格兰足球超级联赛', short: '英超', logo: '/football/leagues/premier-league.png', active: true },
  { id: 'champions-league', name: '欧洲冠军联赛', short: '欧冠', logo: '/football/leagues/champions-league.png' },
  { id: 'laliga', name: '西班牙足球甲级联赛', short: '西甲', logo: '/football/leagues/laliga.png' },
  { id: 'bundesliga', name: '德国足球甲级联赛', short: '德甲', logo: '/football/leagues/bundesliga.png' },
  { id: 'serie-a', name: '意大利足球甲级联赛', short: '意甲', logo: '/football/leagues/serie-a.png' },
];

const team = (id, name, shortName = name) => ({ id, name, shortName, logo: `/football/teams/fotmob/${id}.png` });

export const teams = {
  manCity: team(8456, 'Manchester City', 'Man City'), arsenal: team(9825, 'Arsenal'),
  brighton: team(10204, 'Brighton & Hove Albion', 'Brighton'), brentford: team(9937, 'Brentford'),
  leeds: team(8463, 'Leeds United', 'Leeds'), liverpool: team(8650, 'Liverpool'),
  everton: team(8668, 'Everton'), hull: team(8667, 'Hull City', 'Hull'),
  newcastle: team(10261, 'Newcastle United', 'Newcastle'), chelsea: team(8455, 'Chelsea'),
  ipswich: team(9902, 'Ipswich Town', 'Ipswich'), manUnited: team(10260, 'Manchester United', 'Man United'),
  forest: team(10203, 'Nottingham Forest', 'Nottm Forest'), sunderland: team(8472, 'Sunderland'),
  palace: team(9826, 'Crystal Palace'), villa: team(10252, 'Aston Villa'),
  bournemouth: team(8678, 'AFC Bournemouth', 'Bournemouth'), coventry: team(8669, 'Coventry City', 'Coventry'),
  fulham: team(9879, 'Fulham'), tottenham: team(8586, 'Tottenham Hotspur', 'Tottenham'),
};

export const standings = [
  ['manCity',5,8,15],['arsenal',5,4,12],['brighton',5,11,10],['brentford',5,6,9],['leeds',5,4,9],
  ['liverpool',5,3,9],['everton',5,3,9],['hull',5,2,8],['newcastle',5,0,8],['chelsea',5,-2,7],
  ['ipswich',5,-4,6],['manUnited',5,0,5],['forest',5,-1,5],['sunderland',5,-4,4],['palace',5,-5,4],
  ['villa',5,-5,4],['bournemouth',5,-2,3],['coventry',5,-9,3],['fulham',5,-3,2],['tottenham',5,-6,2],
].map(([team, played, goalDifference, points], index) => ({ position:index+1, team, played, goalDifference, points }));

const result = (id, home, away, date, time, score, sourcePath, extra = {}) => {
  const [homeScore, awayScore] = score ? score.split('-').map(Number) : [null, null];
  return { id, round:5, home, away, date, time, status:score ? 'FT' : 'NS', homeScore, awayScore, sourcePath, ...extra };
};

export const roundFive = [
  result('5795456','brentford','chelsea','2026-09-19','03:00','3-0','/matches/chelsea-vs-brentford/2spihp#5795456',{rich:true,venue:'Gtech Community Stadium'}),
  result('5795464','tottenham','villa','2026-09-19','19:30','2-3','/matches/tottenham-hotspur-vs-aston-villa/2xnfpj#5795464',{rich:true}),
  result('5795457','brighton','arsenal','2026-09-19','22:00','3-0','/matches/arsenal-vs-brighton-hove-albion/3bfk5g#5795457',{rich:true,venue:'American Express Stadium'}),
  result('5795458','everton','ipswich','2026-09-19','22:00','1-0','/matches/everton-vs-ipswich-town/2uo0th#5795458'),
  result('5795462','newcastle','hull','2026-09-19','22:00','2-1','/matches/hull-city-vs-newcastle-united/2ynv4j#5795462'),
  result('5795463','forest','coventry','2026-09-20','00:30','0-1','/matches/coventry-city-vs-nottingham-forest/2y16ft#5795463'),
  result('5795455','bournemouth','liverpool','2026-09-20','21:00','0-1','/matches/liverpool-vs-afc-bournemouth/2he69q#5795455'),
  result('5795460','leeds','palace','2026-09-20','21:00','0-0','/matches/leeds-united-vs-crystal-palace/2rl0qz#5795460'),
  result('5795461','manCity','sunderland','2026-09-20','21:00','5-3','/matches/manchester-city-vs-sunderland/2dbbjc#5795461',{rich:true}),
  result('5795459','fulham','manUnited','2026-09-20','23:30','1-1','/matches/fulham-vs-manchester-united/3cqww9#5795459'),
];

const teamKeyByFotmobId = Object.fromEntries(Object.entries(teams).map(([key,value]) => [String(value.id),key]));
export const roundFour = Object.entries(crawledRichMatches)
  .filter(([,data]) => data.match?.round === 4)
  .map(([id,data]) => result(
    id,
    teamKeyByFotmobId[data.match.homeTeamId],
    teamKeyByFotmobId[data.match.awayTeamId],
    data.match.date,
    data.match.time,
    `${data.match.homeScore}-${data.match.awayScore}`,
    `/matches/premier-league#${id}`,
    { rich:true, round:4 },
  ));

export const roundSix = [
  result('5795465','arsenal','leeds','2026-10-10','19:30',null,'/matches/leeds-united-vs-arsenal/2rkmmx#5795465'),
  result('5795466','villa','brentford','2026-10-10','22:00',null,'/matches/brentford-vs-aston-villa/3dciw4#5795466'),
  result('5795467','chelsea','bournemouth','2026-10-10','22:00',null,'/matches/chelsea-vs-afc-bournemouth/2fe5n5#5795467'),
  result('5795471','ipswich','fulham','2026-10-10','22:00',null,'/matches/fulham-vs-ipswich-town/38hr4t#5795471'),
  result('5795474','sunderland','brighton','2026-10-10','22:00',null,'/matches/sunderland-vs-brighton-hove-albion/2vuaxm#5795474'),
  result('5795473','manUnited','tottenham','2026-10-11','00:30',null,'/matches/tottenham-hotspur-vs-manchester-united/2xqo0r#5795473'),
  result('5795469','palace','forest','2026-10-11','21:00',null,'/matches/crystal-palace-vs-nottingham-forest/3bfk5h#5795469'),
  result('5795470','hull','everton','2026-10-11','21:00',null,'/matches/hull-city-vs-everton/2hgrvk#5795470'),
  result('5795472','liverpool','manCity','2026-10-11','23:30',null,'/matches/manchester-city-vs-liverpool/2f48yd#5795472'),
  result('5795468','coventry','newcastle','2026-10-13','03:00',null,'/matches/coventry-city-vs-newcastle-united/2yooc8#5795468'),
].map(match => ({...match, round:6}));

export const recentFifteen = [...roundFour, ...roundFive]
  .sort((a,b) => `${b.date} ${b.time}`.localeCompare(`${a.date} ${a.time}`));

export const matches = [...roundFour, ...roundFive.map(match => ({...match, rich:true})), ...roundSix];

const player = (id,name,number,rating,x,y,minutes,touches,passes,chances,defactions,duels,distance,speed,extra={}) => ({
  id:String(id),name,number:String(number),rating,position:{x,y},minutes,touches,passes,chances,defactions,duels,distance,speed,
  image:`/football/players/brentford-chelsea/${id}.png`,...extra,
});

const substitute = (id,name,number,minute,replaced,rating,distance,speed,extra={}) => ({
  id:String(id),name,number:String(number),minute,replaced,rating,distance,speed,
  minutes:minute ? 95-minute : 0,touches:null,passes:null,chances:null,defactions:null,duels:null,
  role:'SUB',image:`/football/players/brentford-chelsea/${id}.png`,...extra,
});

export const lineups = {
  brentford: { formation:'4-2-3-1', players:[
    player(776689,'Caoimhín Kelleher',1,7.78,50,10,90,43,'27/34',0,2,1,5304,20.2,{role:'GK'}),
    player(1429912,'Michael Kayode',33,6.72,12,29,69,32,'12/19',0,2,2,8425,30.8,{role:'RB'}),
    player(1572340,'Jannik Schuster',44,8.18,38,29,90,49,'25/31',1,16,5,10416,32.5,{role:'CB',assists:1}),
    player(552718,'Kristoffer Ajer',20,7.28,62,29,90,62,'43/46',1,9,0,10188,32.9,{role:'CB'}),
    player(1010426,'Keane Lewis-Potter',23,7.45,88,29,81,52,'17/29',1,9,4,9383,30.2,{role:'LB',xg:.15,shots:2}),
    player(1157236,'Yehor Yarmoliuk',6,6.98,30,48,69,49,'30/36',1,10,2,8736,29.4,{role:'CM',xg:.03,shots:1}),
    player(688273,'Vitaly Janelt',27,7.19,70,48,90,56,'39/44',0,9,4,11260,30.7,{role:'CM',xg:.03,shots:1}),
    player(1171140,'Jaidon Anthony',19,7.87,16,68,81,25,'9/12',1,2,4,10067,30.7,{role:'LW',goals:1,xg:.96,shots:1}),
    player(888912,'Mikkel Damsgaard',24,7.38,50,68,87,68,'35/48',1,10,7,10847,30.9,{role:'AM',xg:.04,shots:1}),
    player(1083796,'Kevin Schade',7,6.97,84,68,90,40,'13/18',0,7,5,10413,34,{role:'RW',xg:.54,shots:3}),
    player(1302005,'Igor Thiago',9,7.73,50,87,90,39,'19/22',1,3,2,10833,33.3,{role:'ST',goals:1,xg:.72,shots:3,shotmap:[{x:91.6,y:31.94,min:5,type:'miss'},{x:80.46,y:33.31,min:59,type:'miss'},{x:94.29,y:31.1,min:83,type:'goal'}]}),
  ], substitutes:[
    substitute(1002039,'Aaron Hickey',2,69,'Michael Kayode',6.5,2927,27.7),
    substitute(1185211,'Mamadou Sangaré',18,69,'Yehor Yarmoliuk',6.4,3209,30.2),
    substitute(1451265,'Malick Diouf',25,81,'Keane Lewis-Potter',null,1684,31),
    substitute(1250253,'Dango Ouattara',11,81,'Jaidon Anthony',null,1667,27.4),
    substitute(963965,'Fábio Carvalho',14,87,'Mikkel Damsgaard',null,1289,29.7,{goals:1}),
    substitute(806579,'Ellery Balcombe',31,null,null,null,null,null),
    substitute(1478706,'Benjamin Fredrick',48,null,null,null,null,null),
    substitute(562892,'Rico Henry',3,null,null,null,null,null),
    substitute(184321,'Callum Wilson',13,null,null,null,null,null),
  ]},
  chelsea: { formation:'3-4-2-1', players:[
    player(268375,'Emiliano Martínez',1,6.84,50,10,90,41,'22/32',1,0,1,5241,26.9,{role:'GK'}),
    player(917802,'Wesley Fofana',3,7.42,21,29,71,45,'19/21',0,15,6,7380,32.7,{role:'CB'}),
    player(950485,'Maxence Lacroix',5,6.21,50,29,90,79,'56/63',0,12,6,9899,29.6,{role:'CB',xg:.13,shots:1}),
    player(1096400,'Levi Colwill',6,6.17,79,29,90,82,'61/70',0,7,2,9918,31.6,{role:'CB'}),
    player(843040,'Pedro Neto',7,6.10,12,48,87,41,'16/19',0,6,4,8979,33.3,{role:'RWB',xg:.16,shots:2}),
    player(156008,'Jordan Henderson',14,6.80,38,48,90,92,'68/76',0,10,2,11625,30.2,{role:'CM'}),
    player(1272440,'Valentín Barco',4,6.89,62,48,87,65,'48/52',0,9,6,10658,30.2,{role:'CM',xg:.03,shots:1}),
    player(988805,'Pep Chavarría',29,7.05,88,48,90,91,'52/59',2,9,5,11681,33.8,{role:'LWB',xg:.04,shots:1}),
    player(1096353,'Cole Palmer',10,6.54,30,68,90,55,'25/30',2,6,8,10159,31,{role:'AM',xg:.13,shots:2}),
    player(883080,'Morgan Rogers',17,7.21,70,68,90,66,'35/42',1,8,8,11212,32.5,{role:'AM',xg:.33,shots:4}),
    player(113836,'Danny Welbeck',18,6.64,50,87,71,17,'12/14',2,4,2,8062,29.8,{role:'ST'}),
  ], substitutes:[
    substitute(1400216,'Josh Acheampong',34,71,'Wesley Fofana',6.0,2443,25.2),
    substitute(1530314,'Geovany Quenda',23,71,'Danny Welbeck',6.0,2691,30.4),
    substitute(1720243,'Mahdi Nicoll-Jazuli',32,87,'Valentín Barco',null,1291,25.4),
    substitute(1580774,'Estêvão',41,87,'Pedro Neto',null,1029,25.1),
    substitute(1319972,'Mike Penders',39,null,null,null,null,null),
    substitute(1413846,'Jorrel Hato',21,null,null,null,null,null),
    substitute(1197250,'Malo Gusto',27,null,null,null,null,null),
    substitute(1190867,'Roméo Lavia',45,null,null,null,null,null),
    substitute(1113692,'Jamie Gittens',11,null,null,null,null,null),
  ]},
};

export const richMatch = {
  id:'5795456', scorers:{home:[{name:'Jaidon Anthony',minute:"61'",assist:'Jannik Schuster 助攻'},{name:'Igor Thiago',minute:"83'"},{name:'Fábio Carvalho',minute:"90+4'"}],away:[]},
  goals:[61,83,94],
  stats:[
    {label:'控球率',home:40,away:60,suffix:'%'},{label:'预期进球',home:2.65,away:.83},
    {label:'射门',home:13,away:12},{label:'射正',home:6,away:2},{label:'对方禁区触球',home:24,away:29},
    {label:'绝佳机会',home:4,away:1},{label:'传球成功率',home:79,away:87,suffix:'%'},{label:'角球',home:4,away:12},
  ],
  momentum:[-30,-30,0,35,-19,-30,-35,-14,-30,-11,14,43,52,19,-41,-27,11,22,14,-22,-38,3,-11,14,34,100,100,41,16,27,22,-11,-14,-3,52,76,98,60,-33,-19,-14,-38,-54,-33,27,49,43,-5,-14,-79,0],
  events:[
    {minute:"61'",team:'home',type:'goal',player:'Jaidon Anthony',detail:'头球 · Jannik Schuster 助攻 · 1–0'},
    {minute:"83'",team:'home',type:'goal',player:'Igor Thiago',detail:'快速反击 · 2–0'},
    {minute:"90+4'",team:'home',type:'goal',player:'Fábio Carvalho',detail:'定位球进攻 · 3–0'},
  ],
};

export const richMatches = {...crawledRichMatches,'5795456':{...crawledRichMatches['5795456'],...richMatch}};
