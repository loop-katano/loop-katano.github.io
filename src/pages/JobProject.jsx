import { useEffect, useMemo, useState } from 'react';
import { MockMark } from '../components/Common';
import { JobDashboard, JobDetail, JobExplorer, JDIntelligence, ResumeMatch, Workflow } from '../components/JobPanels';
import { jobs } from '../data/jobData';

const tabs = [['dashboard','总览'],['explorer','岗位库'],['jd','JD 解析'],['match','简历匹配'],['workflow','产品流程']];

export function JobProject() {
  const [tab, setTab] = useState('dashboard');
  const [statuses, setStatuses] = useState(() => Object.fromEntries(jobs.map(job => [job.id,'未标记'])));
  const jobIdFromPath = () => window.location.pathname.split('/jobs/')[1] || null;
  const [selectedId, setSelectedId] = useState(jobIdFromPath());
  useEffect(() => { const onPop = () => setSelectedId(jobIdFromPath()); window.addEventListener('popstate', onPop); return () => window.removeEventListener('popstate', onPop); }, []);
  const selectedJob = useMemo(() => jobs.find(job => job.id === selectedId), [selectedId]);
  const openJob = id => { window.history.pushState({}, '', `/projects/job-intelligence/jobs/${id}`); setSelectedId(id); window.scrollTo({ top: 110, behavior: 'smooth' }); };
  const closeJob = () => { window.history.pushState({}, '', '/projects/job-intelligence'); setSelectedId(null); window.scrollTo({ top: 110, behavior: 'smooth' }); };
  const chooseTab = id => { if (selectedId) closeJob(); setTab(id); };
  const changeStatus = (id, status) => setStatuses(current => ({...current,[id]:status}));
  const panels = { dashboard:<JobDashboard onOpen={openJob} onExplore={() => setTab('explorer')} statuses={statuses} onStatusChange={changeStatus}/>, explorer:<JobExplorer onOpen={openJob} statuses={statuses} onStatusChange={changeStatus}/>, jd:<JDIntelligence job={jobs[0]}/>, match:<ResumeMatch job={jobs[0]}/>, workflow:<Workflow/> };
  return <main className="product-page">
    <section className="product-hero container"><div><span className="project-kicker">项目 01 · 核心作品</span><h1>招聘情报中心</h1><p>收集、理解并比较值得投入时间的真实岗位。</p></div><MockMark /></section>
    {selectedJob ? <div className="job-detail-shell container"><JobDetail job={selectedJob} onBack={closeJob} status={statuses[selectedJob.id]} onStatusChange={changeStatus}/></div> : <div className="product-shell container"><aside className="product-nav"><div className="nav-label"><span>AI 求职</span><b>决策工作台</b></div>{tabs.map(([id,label],i)=><button key={id} className={tab===id?'active':''} onClick={()=>chooseTab(id)}><span>{String(i+1).padStart(2,'0')}</span>{label}</button>)}</aside><section className="product-content">{panels[tab]}</section></div>}
  </main>;
}
