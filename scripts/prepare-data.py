"""Normalize downloaded public data. No invented coordinates or model outputs.
Usage: python3 scripts/prepare-data.py EVENTS MATCHES OSM
"""
import json, sys, hashlib
import xml.etree.ElementTree as ET
from pathlib import Path

root = Path(__file__).resolve().parents[1]
out = root / 'src/data'
raw = Path(sys.argv[1]).read_bytes()
events = json.loads(raw)
match = next(m for m in json.loads(Path(sys.argv[2]).read_text()) if m['match_id'] == 3869685)
players = {}
for e in events:
    if 'player' in e:
        players[e['player']['id']] = {**players.get(e['player']['id'],{}), 'id': e['player']['id'], 'name': e['player']['name'], 'team': e['team']['id']}
    for p in e.get('tactics', {}).get('lineup', []):
        players[p['player']['id']] = {**players.get(p['player']['id'], {}), 'id': p['player']['id'], 'name': p['player']['name'], 'team': e['team']['id'], 'number': p['jersey_number']}
slim = []
for e in events:
    if e['period'] > 4 or e['type']['name'] not in ['Pass', 'Carry', 'Shot', 'Ball Receipt*', 'Dribble'] or not e.get('location'):
        continue
    p = e.get('pass', {})
    slim.append({'id': e['id'], 'type': e['type']['name'], 'team': e['team']['id'], 'player': e.get('player', {}).get('id'), 'period': e['period'], 'minute': e['minute'], 'second': e['second'], 'start': e['location'], 'end': p.get('end_location', e.get('carry', {}).get('end_location', e.get('shot', {}).get('end_location'))), 'recipient': p.get('recipient', {}).get('id'), 'complete': e['type']['name'] == 'Pass' and 'outcome' not in p, 'setPiece': p.get('type', {}).get('name') in ['Corner', 'Free Kick', 'Throw-in', 'Kick Off', 'Goal Kick'], 'xg': e.get('shot', {}).get('statsbomb_xg')})
def aggregate(rows):
    nodes, edges, heat, advances = {}, {}, [0]*96, {}
    pc=cc=0
    for e in rows:
        x,y=e['start'][:2]
        cell=max(0,min(7,int(y/10)))*12+max(0,min(11,int(x/10)))
        heat[cell]+=1
        if e['type']=='Pass' and not e['setPiece']:
            n=nodes.setdefault(e['player'],{'id':e['player'],'x':0,'y':0,'n':0})
            n['x']+=x;n['y']+=y;n['n']+=1
            if e['complete'] and e['recipient']:
                a,b=sorted([e['player'],e['recipient']]);key=f'{a}-{b}'
                edge=edges.setdefault(key,{'a':a,'b':b,'count':0});edge['count']+=1
        if e['end'] and (e['end'][0]-x)*105/120>=10 and (e['type']=='Carry' or e['type']=='Pass' and e['complete'] and not e['setPiece']):
            if e['type']=='Pass': pc+=1
            else: cc+=1
            advances[cell]=advances.get(cell,0)+1
    net=[{**n,'x':round(n['x']/n['n'],2),'y':round(n['y']/n['n'],2)} for n in nodes.values()]
    return {'eventCount':len(rows),'passCount':pc,'carryCount':cc,'heat':heat,'advanceCells':[advances.get(i,0) for i in range(96)],'network':{'nodes':net,'edges':[e for e in edges.values() if e['a'] in nodes and e['b'] in nodes]}}
aggregates={}
for team in [779,771]:
    for period in [0,1,2,3,4]:
        rows=[e for e in slim if e['team']==team and (not period or e['period']==period)]
        aggregates[f'{team}:{period}:0']=aggregate(rows)
        for p in players.values():
            if p['team']==team: aggregates[f'{team}:{period}:{p["id"]}']=aggregate([e for e in rows if e['player']==p['id']])
payload = {'matchId': 3869685, 'date': match['match_date'], 'home': {'id':779,'name':'阿根廷'}, 'away':{'id':771,'name':'法国'}, 'score':'3–3', 'source':'https://github.com/statsbomb/open-data/blob/master/data/events/3869685.json', 'sourceUpdated':match['last_updated'], 'rawCount':len(events), 'sha256':hashlib.sha256(raw).hexdigest(), 'players': list(players.values()), 'aggregates':aggregates}
(out/'footballSpatial.json').write_text(json.dumps(payload, ensure_ascii=False, separators=(',',':')))
print('Football:',len(events),'raw;',len(slim),'located possession events')
if len(sys.argv) > 3:
    raw = Path(sys.argv[3]).read_bytes()
    bounds = [108.91,34.235,108.98,34.285]
    if raw.lstrip().startswith(b'<?xml') or raw.lstrip().startswith(b'<osm'):
        tree=ET.fromstring(raw)
        nodes={n.attrib['id']:{'lon':float(n.attrib['lon']),'lat':float(n.attrib['lat'])} for n in tree.findall('node')}
        elements=[]
        b=tree.find('bounds')
        bounds=[float(b.attrib[k]) for k in ['minlon','minlat','maxlon','maxlat']]
        for e in list(tree.findall('node'))+list(tree.findall('way')):
            t={v.attrib['k']:v.attrib['v'] for v in e.findall('tag')}
            item={'id':e.attrib['id'],'type':e.tag,'tags':t}
            if e.tag=='node': item.update(nodes[e.attrib['id']])
            else:
                geom=[nodes[n.attrib['ref']] for n in e.findall('nd') if n.attrib['ref'] in nodes]
                item['geometry']=geom
                if geom: item['center']={k:sum(p[k] for p in geom)/len(geom) for k in ['lon','lat']}
            elements.append(item)
        osm={'elements':elements,'osm3s':{'timestamp_osm_base':'2026-10-06'}}
    else:
        osm = json.loads(raw)
    roads, parks, pois = [], [], []
    for e in osm['elements']:
        t = e.get('tags', {})
        geom = [[p['lon'],p['lat']] for p in e.get('geometry',[]) if 'lon' in p]
        if t.get('highway') and geom:
            roads.append({'id':e['id'],'name':t.get('name',''),'type':t['highway'],'points':geom})
        if t.get('leisure') == 'park' and geom:
            parks.append(geom)
        category = {'cafe':'饮品','restaurant':'餐饮','library':'阅读'}.get(t.get('amenity'))
        center = e.get('center', e)
        name = t.get('name:zh',t.get('name'))
        if category and name and 'lat' in center and bounds[1]<=center['lat']<=bounds[3] and bounds[0]<=center['lon']<=bounds[2]:
            pois.append({'id':str(e['id']),'osmType':e['type'],'name':name,'category':category,'lat':center['lat'],'lon':center['lon']})
    payload={'city':'西安','bounds':bounds,'timestamp':osm.get('osm3s',{}).get('timestamp_osm_base'),'source':'https://www.openstreetmap.org/copyright','sha256':hashlib.sha256(raw).hexdigest(),'roads':roads,'parks':parks,'pois':pois}
    (out/'xianMap.json').write_text(json.dumps(payload,ensure_ascii=False,separators=(',',':')))
    print('Map:',len(roads),'roads;',len(pois),'named places')
