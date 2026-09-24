import { useState } from 'react';
import { jobs, jobSources } from '../data/jobData';
import { Tag } from './Common';

function MetricBlock({ value, label, primary }) {
  return <div className={`metric-block ${primary ? 'primary' : ''}`}><strong>{value}</strong><span>{label}</span></div>;
}

function JobLogo({ job, size = '' }) {
  return <span className={`job-logo ${size}`}><img src={job.logo} alt={`${job.company} 标识`}/></span>;
}

const statusOptions = ['未标记','考虑中','准备投递','已投递','不再考虑'];

function ApplicationStatus({ job, value, onChange, compact = false }) {
  return <label className={`application-status ${compact ? 'compact' : ''}`} onClick={event=>event.stopPropagation()}>
    {!compact && <span>投递状态</span>}
    <select aria-label={`${job.company} ${job.role} 投递状态`} value={value} onChange={event=>onChange(job.id,event.target.value)} onKeyDown={event=>event.stopPropagation()}>
      {statusOptions.map(option=><option value={option} key={option}>{option}</option>)}
    </select>
  </label>;
}

const openFromKeyboard = (event, callback) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); callback(); } };

function JobTable({ list = jobs, onOpen, statuses, onStatusChange }) {
  return <div className="data-table" role="table" aria-label="真实岗位列表">
    <div className="table-head" role="row"><span>公司 / 岗位</span><span>地点</span><span>方向</span><span>匹配度</span><span>状态</span><span>更新</span></div>
    {list.map(job => <div className="table-row" role="row" tabIndex="0" key={job.id} onClick={() => onOpen(job.id)} onKeyDown={event=>openFromKeyboard(event,()=>onOpen(job.id))} aria-label={`查看 ${job.company} ${job.role}`}>
      <span className="job-title"><JobLogo job={job}/><b>{job.company}<small>{job.role}</small></b></span>
      <span>{job.city.split(' / ')[0]}</span><span><Tag>{job.track}</Tag></span>
      <span className="match-cell"><b>{job.match}%</b><i><u style={{width:`${job.match}%`}} /></i></span>
      <span><ApplicationStatus job={job} value={statuses[job.id]} onChange={onStatusChange} compact/></span><span>{job.updated.slice(5)}</span>
    </div>)}
  </div>;
}

export function JobDashboard({ onOpen, onExplore, statuses, onStatusChange }) {
  const priorityCount = jobs.filter(job => job.match >= 85).length;
  return <div className="panel-stack">
    <section className="metric-layout"><MetricBlock value={jobs.length} label="岗位详情" primary/><MetricBlock value={`${jobs.length}/${jobs.length}`} label="已完成岗位解析"/><MetricBlock value={priorityCount} label="优先处理"/><MetricBlock value={`${Math.max(...jobs.map(job => job.match))}%`} label="最高匹配度"/></section>
    <section className="content-card table-card"><div className="card-heading"><div><span>近期核验</span><h2>目标岗位</h2></div><button className="text-button" onClick={onExplore}>查看岗位库</button></div><JobTable onOpen={onOpen} statuses={statuses} onStatusChange={onStatusChange}/></section>
    <section className="dashboard-bottom"><div className="content-card focus-card"><span>本周优先级</span><h3>先处理高相关岗位</h3><p>华测解决方案培训生与地信、水利背景最直接匹配；海尔与美团更适合用 AI 产品原型和评测经历证明能力。</p><button className="solid-button" onClick={() => onOpen('huace-solution-trainee')}>查看最高匹配岗位</button></div><div className="signal-list"><span>岗位构成</span><p><b>{jobs.length}</b> 个具体岗位页</p><p><b>{jobs.filter(job=>job.track==='AI 产品').length}</b> 个 AI 产品岗位</p><p><b>{jobs.filter(job=>['解决方案','空间技术'].includes(job.track)).length}</b> 个空间相关岗位</p></div></section>
    <p className="job-data-boundary">岗位职责来自对应详情页；匹配度基于示例能力模型。投递状态仅在当前页面会话中生效，不读取或保存真实投递记录。</p>
  </div>;
}

export function JobExplorer({ onOpen, statuses, onStatusChange }) {
  const [filter, setFilter] = useState('全部');
  const filters = ['全部',...new Set(jobs.map(job => job.track))];
  const visible = filter === '全部' ? jobs : jobs.filter(job => job.track === filter);
  return <div className="explorer-layout"><aside className="filter-panel"><span>筛选条件</span><h3>岗位筛选</h3><label>岗位方向</label>{filters.map(item => <button key={item} onClick={() => setFilter(item)} className={filter === item ? 'selected' : ''}>{item}<span>{item === '全部' ? jobs.length : jobs.filter(job => job.track === item).length}</span></button>)}<hr/><label>数据说明</label><p className="filter-note">当前共 {jobs.length} 个具体岗位，均可进入岗位概览、岗位解析与简历匹配。状态为本次浏览的临时选择。</p></aside><section className="job-list"><div className="list-header"><div><span>岗位库</span><h2>{filter === '全部' ? '全部岗位' : filter}</h2></div><b>{visible.length} 条结果</b></div>{visible.map(job => <article className="job-row-card" role="button" tabIndex="0" key={job.id} onClick={() => onOpen(job.id)} onKeyDown={event=>openFromKeyboard(event,()=>onOpen(job.id))}><JobLogo job={job} size="large"/><div className="job-main"><span>{job.company} · {job.city}</span><h3>{job.role}</h3><div className="tag-row"><Tag>{job.track}</Tag><Tag>{job.degree}</Tag><Tag>{job.major}</Tag></div></div><div className="job-score"><strong>{job.match}%</strong><span>当前匹配度</span><ApplicationStatus job={job} value={statuses[job.id]} onChange={onStatusChange}/></div></article>)}</section></div>;
}

export function JDIntelligence({ job = jobs[0] }) {
  const parsed = [
    { title: '基本门槛', items: [{label:'学历',value:job.degree},{label:'专业',value:job.major},{label:'城市',value:job.city}] },
    { title: '核心工作', items: job.responsibilities.slice(0,3).map((value,index) => ({label:`职责 ${index + 1}`,value})) },
    { title: '能力关键词', items: job.keywords.map((value,index) => ({label:`关键词 ${index + 1}`,value})) },
    { title: '证据边界', items: [{label:'来源',value:job.sourceLabel},{label:'核验',value:'2026-09-23'},{label:'提醒',value:'投递前重新打开官网确认状态'}] },
  ];
  return <div className="split-workspace job-jd-workspace"><section className="jd-raw"><div className="card-heading"><div><span>岗位原文摘要</span><h2>岗位说明</h2></div><Tag>{job.sourceUrl?'来源已保存':'资料待补链接'}</Tag></div><div className="jd-company-line"><JobLogo job={job} size="large"/><div><h3>{job.role}</h3><p className="jd-company">{job.company} · {job.city}</p></div></div><p className="jd-summary">{job.summary}</p><div className="jd-copy"><b>岗位职责</b><ol>{job.responsibilities.map(item => <li key={item}>{item}</li>)}</ol><b>任职要求</b><ol>{job.requirements.map(item => <li key={item}>{item}</li>)}</ol></div>{job.sourceUrl?<a className="source-link" href={job.sourceUrl} target="_blank" rel="noreferrer">{job.sourceAction||'打开岗位详情'}</a>:<p className="source-missing">原岗位详情链接待补，不提供泛招聘入口。</p>}</section><section className="parsed-panel"><div className="parsed-head"><div><span>辅助整理</span><h2>结构化解析</h2></div><div className="confidence"><b>{job.confidence}%</b><span>解析置信度</span></div></div>{parsed.map((section, index) => <div className="parsed-section" key={section.title}><span>{String(index+1).padStart(2,'0')}</span><div><h3>{section.title}</h3><div className="parsed-items">{section.items.map(item => <p key={item.label}><b>{item.label}</b><span>{item.value}</span></p>)}</div></div></div>)}</section></div>;
}

export function ResumeMatch({ job = jobs[0] }) {
  const groups = [
    { label:'已有证据', items:job.fit.matched, tone:'strong' },
    { label:'部分匹配', items:job.fit.partial, tone:'partial' },
    { label:'仍需补齐', items:job.fit.gaps, tone:'missing' },
  ];
  return <div className="match-workspace"><section className="profile-column"><span>示例能力档案</span><h2>当前能力证据</h2><p>地理信息科学 × 数据分析 × AI Coding</p><div className="skill-stack">{['Python','数据分析','地理信息系统','Agent 评测','提示词设计','产品原型'].map((skill,index) => <div key={skill}><span>{skill}</span><i><u style={{width:`${92-index*6}%`}}/></i></div>)}</div><small>能力条仅用于展示当前材料覆盖程度，不代表标准化测评结果。</small></section><section className="match-result"><div className="score-ring"><strong>{job.match}<small>%</small></strong><span>当前简历匹配度</span></div>{groups.map(group => <div className={`match-group ${group.tone}`} key={group.label}><span>{group.label}</span><p>{group.items.join(' · ')}</p></div>)}</section><section className="suggestions"><span>针对这份 JD</span><h2>简历修改建议</h2>{job.fit.strengths.map((item,index) => <article key={item}><b>{index === 0 ? '建议突出' : '可以证明'}</b><p>{item}</p></article>)}{job.fit.improvements.map((item,index) => <article key={item}><b>{index === 0 ? '优先补充' : '表达调整'}</b><p>{item}</p></article>)}<article className="boundary-advice"><b>表达边界</b><p>没有真实用户、上线数据或商业结果时，明确写“个人原型 / 离线评测”，不要包装成生产成果。</p></article></section></div>;
}

function JobOverview({ job }) {
  return <div className="job-overview-grid"><section className="job-summary-card"><span>岗位判断</span><h2>{job.summary}</h2><div className="tag-row">{job.keywords.map(item => <Tag key={item}>{item}</Tag>)}</div></section><section className="job-facts"><p><span>学历</span><b>{job.degree}</b></p><p><span>专业</span><b>{job.major}</b></p><p><span>工作地点</span><b>{job.city}</b></p><p><span>页面更新</span><b>{job.updated}</b></p></section><section className="job-why"><span>为什么值得看</span>{job.fit.strengths.map(item => <p key={item}>{item}</p>)}</section><section className="job-risk"><span>投递前核对</span><p>招聘页面可能更新或关闭；请重新确认职位状态、团队、城市与毕业时间范围。</p>{job.sourceUrl?<a href={job.sourceUrl} target="_blank" rel="noreferrer">{job.sourceAction||'前往岗位详情'}</a>:<small>原岗位详情链接待补</small>}</section></div>;
}

export function JobDetail({ job, onBack, status, onStatusChange }) {
  const [view, setView] = useState('overview');
  return <section className="job-detail"><button className="job-back" onClick={onBack}>返回招聘情报中心</button><header className="job-detail-head"><JobLogo job={job} size="detail"/><div><span>{job.company} · {job.city}</span><h1>{job.role}</h1><div className="tag-row"><Tag>{job.track}</Tag><Tag>{job.degree}</Tag><Tag>{job.major}</Tag></div></div><div className="job-detail-score"><strong>{job.match}%</strong><span>当前匹配度</span><ApplicationStatus job={job} value={status} onChange={onStatusChange}/></div></header><div className="job-source-strip"><span>来源：{job.sourceLabel}</span>{job.sourceUrl?<a href={job.sourceUrl} target="_blank" rel="noreferrer">{job.sourceAction||'查看岗位详情'}</a>:<small>链接待补</small>}</div><nav className="job-detail-tabs" aria-label="岗位详情"><button className={view==='overview'?'active':''} onClick={()=>setView('overview')}>岗位概览</button><button className={view==='jd'?'active':''} onClick={()=>setView('jd')}>岗位解析</button><button className={view==='match'?'active':''} onClick={()=>setView('match')}>简历匹配</button></nav>{view === 'overview' ? <JobOverview job={job}/> : view === 'jd' ? <JDIntelligence job={job}/> : <ResumeMatch job={job}/>}</section>;
}

export function Workflow() {
  const steps = ['招聘官网','岗位收集','JD 解析','结构化字段','岗位数据库','简历匹配','投递决策'];
  return <div className="workflow-view"><div className="workflow-intro"><span>产品流程</span><h2>从分散信息到可解释决策</h2><p>数据采集、结构化和匹配结果都保留来源与置信度，避免把模型输出包装成招聘事实。</p></div><div className="flow-line">{steps.map((step,index) => <div className="flow-step" key={step}><span>{String(index+1).padStart(2,'0')}</span><b>{step}</b></div>)}</div><div className="workflow-notes"><p><b>输入可追溯</b><span>保存官网来源、核验时间与岗位摘要</span></p><p><b>解析可复核</b><span>低置信字段明确提示回到官网确认</span></p><p><b>建议有边界</b><span>区分招聘事实、个人匹配判断和缺失证据</span></p></div><div className="workflow-sources"><span>本轮数据来源</span>{jobSources.map(source => <a href={source.url} target="_blank" rel="noreferrer" key={source.url}>{source.label}</a>)}</div></div>;
}
