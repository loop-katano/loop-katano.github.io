import { useState } from 'react';
import { jobs, jobSources } from '../data/jobData';
import { Tag } from './Common';
import { evaluateJob, summarizeJD } from '../lib/matching';
import { downloadText } from '../lib/storage';

const statusOptions=['未标记','考虑中','准备投递','已投递','不再考虑'];
function Logo({job}){return <img className="clean-job-logo" src={job.logo} alt={`${job.company}标识`}/>}
function Status({job,value,onChange}){return <select aria-label={`${job.company} ${job.role} 投递状态`} value={value||'未标记'} onClick={e=>e.stopPropagation()} onChange={e=>onChange(job.id,e.target.value)}>{statusOptions.map(s=><option key={s}>{s}</option>)}</select>}
function EvidenceGroups({groups}){return <div className="evidence-groups">{[['matched','已有证据'],['partial','部分匹配'],['gaps','待补齐']].map(([key,label])=><section key={key} className={`evidence-group ${key}`}><h3>{label}<span>{groups[key].length}</span></h3>{groups[key].length?groups[key].map(item=><div key={item.requirement}><b>{item.requirement}</b><p>{item.proof}</p></div>):<p>暂无条目</p>}</section>)}</div>}
function JobRows({list,onOpen,statuses,onStatusChange}){return <div className="clean-job-list">{list.map(job=>{const fit=evaluateJob(job);return <article className="clean-job-row" key={job.id}><button className="job-open-main" onClick={()=>onOpen(job.id)}><Logo job={job}/><span><small>{job.company} · {job.city}</small><b>{job.role}</b><em>{job.track}</em></span></button><span className="evidence-count">{fit.matched.length} 项已有证据<small>{fit.partial.length} 项部分匹配</small></span><Status job={job} value={statuses[job.id]} onChange={onStatusChange}/></article>})}</div>}
export function JobDashboard({onOpen,onExplore,statuses,onStatusChange}){
 const companies=new Set(jobs.map(j=>j.company)).size,submitted=Object.values(statuses).filter(s=>s==='已投递').length;
 return <div className="panel-stack"><section className="metric-layout">{[[jobs.length,'已收录岗位'],[companies,'覆盖企业'],[Object.values(statuses).filter(s=>s==='准备投递').length,'准备投递'],[submitted,'自己标记已投递']].map(([n,label])=><div className="metric-block" key={label}><strong>{n}</strong><span>{label}</span></div>)}</section><section className="content-card"><div className="card-heading"><div><span>YOUR SHORTLIST</span><h2>从证据开始比较岗位</h2></div><button className="text-button" onClick={onExplore}>打开岗位库 →</button></div><JobRows list={jobs.slice(0,8)} onOpen={onOpen} statuses={statuses} onStatusChange={onStatusChange}/></section><p className="job-data-boundary">岗位为历史收录快照，投递前请回到原链接核实。匹配结果由本地关键词规则生成，重要条件仍需人工复核；不是录用概率。</p></div>
}
export function JobExplorer({onOpen,statuses,onStatusChange}){
 const [filter,setFilter]=useState('全部'),[search,setSearch]=useState('');
 const visible=jobs.filter(j=>(filter==='全部'||j.track===filter)&&[j.company,j.role,j.city,...j.keywords].join(' ').toLowerCase().includes(search.toLowerCase()));
 return <section className="content-card"><div className="card-heading"><div><span>JOB LIBRARY</span><h2>岗位库 <small>{visible.length}</small></h2></div><button className="text-button" onClick={()=>downloadText('投递记录.json',JSON.stringify(jobs.map(j=>({id:j.id,company:j.company,role:j.role,status:statuses[j.id]||'未标记',source:j.sourceUrl})),null,2))}>导出记录 ↓</button></div><div className="job-search"><input aria-label="搜索岗位" value={search} onChange={e=>setSearch(e.target.value)} placeholder="搜索公司、岗位、城市或技能"/><select aria-label="岗位方向" value={filter} onChange={e=>setFilter(e.target.value)}>{['全部',...new Set(jobs.map(j=>j.track))].map(t=><option key={t}>{t}</option>)}</select></div><JobRows list={visible} onOpen={onOpen} statuses={statuses} onStatusChange={onStatusChange}/>{!visible.length&&<div className="empty-state">没有匹配的岗位，请更换关键词。</div>}</section>
}
export function JDIntelligence({job=jobs[0]}){
 const [input,setInput]=useState(''),[result,setResult]=useState(null);
 return <div className="panel-stack"><section className="content-card"><div className="card-heading"><div><span>JD READER</span><h2>岗位要点</h2></div><Tag>本地规则辅助</Tag></div><p>{job.company} · {job.role}</p><div className="jd-summary-columns"><div><h3>核心职责</h3>{job.responsibilities.map(s=><p key={s}>{s}</p>)}</div><div><h3>任职要求</h3>{job.requirements.map(s=><p key={s}>{s}</p>)}</div></div><a href={job.sourceUrl} target="_blank" rel="noreferrer">查看岗位原始来源 ↗</a></section><section className="content-card"><h3>粘贴另一份JD</h3><textarea className="jd-input" aria-label="粘贴JD" value={input} onChange={e=>setInput(e.target.value)} placeholder="粘贴岗位职责和要求，提取本地规则能识别的能力词。不会发送到服务器。"/><button className="solid-button" disabled={!input.trim()} onClick={()=>setResult(summarizeJD(input))}>提取能力词</button>{result&&<><p className="subtle-copy">识别到 {result.terms.length} 个能力词；未识别的专业限制、年限、否定和复杂语义请人工检查。未调用LLM。</p><EvidenceGroups groups={result.evaluation}/></>}</section></div>
}
export function ResumeMatch({job=jobs[0]}){
 const groups=evaluateJob(job);
 return <section className="content-card"><div className="card-heading"><div><span>EVIDENCE MATCH</span><h2>{groups.matched.length?'已有相关证据':'需要补充证据'}</h2></div><Tag>{job.company}</Tag></div><h3>{job.role}</h3><p className="subtle-copy">基于岗位要求与简历证据覆盖情况综合评估 · 本地规则辅助，需人工复核</p><EvidenceGroups groups={groups}/><div className="match-caution">这里只对已收录的能力关键词做证据映射，未自动判断学历、专业、毕业时间等硬性门槛。没有经验的条目不自动包装为“了解”或“熟悉”。</div></section>
}
export function JobDetail({job,onBack,status,onStatusChange}){
 const [view,setView]=useState('overview');
 return <section className="job-detail"><button className="job-back" onClick={onBack}>← 返回招聘情报中心</button><header className="clean-job-detail"><Logo job={job}/><div><span>{job.company} · {job.city}</span><h1>{job.role}</h1><p>{job.degree} · {job.major}</p></div><Status job={job} value={status} onChange={onStatusChange}/></header><div className="job-source-strip"><span>来源：{job.sourceLabel} · 收录 {job.updated}</span><a href={job.sourceUrl} target="_blank" rel="noreferrer">打开原链接 ↗</a></div><nav className="job-detail-tabs">{[['overview','岗位概览'],['jd','岗位要点'],['match','证据匹配']].map(([id,name])=><button key={id} className={view===id?'active':''} onClick={()=>setView(id)}>{name}</button>)}</nav>{view==='match'?<ResumeMatch job={job}/>:view==='jd'?<JDIntelligence job={job}/>:<section className="content-card"><h2>这个岗位做什么</h2><p>{job.summary}</p>{job.responsibilities.map(s=><p key={s}>{s}</p>)}<div className="tag-row">{job.keywords.map(k=><Tag key={k}>{k}</Tag>)}</div></section>}
 </section>;
}
export function Workflow(){return <section className="content-card"><h2>数据来源</h2><p>公开岗位链接 → 本地整理 → 证据核对 → 投递记录</p><div className="workflow-sources">{jobSources.map(s=><a key={s.url} href={s.url} target="_blank" rel="noreferrer">{s.label}</a>)}</div></section>}
