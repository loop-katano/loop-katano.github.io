import { useEffect, useMemo, useState } from 'react';
import { MockMark } from '../components/Common';
import { JobDashboard, JobDetail, JobExplorer, JDIntelligence, ResumeMatch, Workflow } from '../components/JobPanels';
import { jobs } from '../data/jobData';
import { loadStatuses } from '../lib/storage';

const tabs = [['dashboard','总览'],['explorer','岗位库'],['jd','岗位要点'],['match','证据匹配'],['workflow','数据来源']];

export function JobProject() {
  const [tab, setTab] = useState('dashboard');
  const [statuses, setStatuses] = useState(() => loadStatuses(jobs));
  const [saveError,setSaveError]=useState('');
  useEffect(()=>{try{localStorage.setItem('loophow-jobs-v1',JSON.stringify(statuses));setSaveError('')}catch{setSaveError('当前浏览器无法保存投递状态，请使用岗位库导出记录。')}},[statuses]);
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
    <section className="product-hero container"><div><span className="project-kicker">02 / JOB INTELLIGENCE</span><h1>招聘情报中心</h1><p>把分散的岗位，整理成有依据的投递选择。</p></div><MockMark /></section>
    {saveError&&<p className="container" role="alert">{saveError}</p>}
    {selectedJob ? <div className="job-detail-shell container"><JobDetail job={selectedJob} onBack={closeJob} status={statuses[selectedJob.id]} onStatusChange={changeStatus}/></div> : <div className="product-shell container"><aside className="product-nav"><div className="nav-label"><span>AI 求职</span><b>决策工作台</b></div>{tabs.map(([id,label],i)=><button key={id} className={tab===id?'active':''} onClick={()=>chooseTab(id)}><span>{String(i+1).padStart(2,'0')}</span>{label}</button>)}</aside><section className="product-content">{panels[tab]}</section></div>}
    <div className="product-footnote container"><p>实现：React岗位库、JS本地规则提取与证据映射、浏览器本地投递记录。当前版本未接入在线LLM；不展示人工预设的匹配百分比或解析置信度。</p></div>
  </main>;
}
