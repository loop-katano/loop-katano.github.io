import { jobs } from '../data/jobData';
import { roundFive, standings, teams } from '../data/footballData';
import { go, Tag, MockMark } from '../components/Common';

function MiniRecruitment() {
  const companyCount = new Set(jobs.map(job => job.company)).size;
  const highestMatch = Math.max(...jobs.map(job => job.match));
  return <div className="mini-window recruitment-mini">
    <div className="mini-top"><span>招聘情报中心</span><span>今日更新 8</span></div>
    <div className="mini-metrics"><b>{jobs.length}<small>真实岗位</small></b><b>{companyCount}<small>覆盖企业</small></b><b className="accent-number">{highestMatch}%<small>最高匹配</small></b></div>
    <div className="mini-table">{jobs.slice(0, 3).map(job => <div key={job.id}><span className="company-dot"><img src={job.logo} alt={`${job.company} 标识`}/></span><b>{job.company}<small>{job.role}</small></b><em>{job.match}%</em></div>)}</div>
  </div>;
}

function MiniFootball() {
  return <div className="mini-window football-mini">
    <div className="mini-top"><span>英超 · 第 5 轮</span><span>10 场比赛</span></div>
    <div className="mini-football-grid"><div><b>积分榜</b>{standings.slice(0,4).map(row=><span key={row.team}><i>{row.position}</i><img src={teams[row.team].logo} alt=""/><em>{teams[row.team].shortName}</em><strong>{row.points}</strong></span>)}</div><div><b>本轮赛果</b>{roundFive.slice(0,4).map(match=><span key={match.id}><em>{teams[match.home].shortName}</em><strong>{match.homeScore}–{match.awayScore}</strong><em>{teams[match.away].shortName}</em></span>)}</div></div>
  </div>;
}

const productMethod = [
  ['01','需求分析','拆解用户任务、业务反馈与决策成本，明确场景边界和成功标准。'],
  ['02','方案产出','把问题转成信息架构、核心流程、数据口径与可交互原型。'],
  ['03','数据分析','用真实来源和对比指标验证判断，同时标注数据边界。'],
  ['04','推进落地','拆分优先级与验收点，完成开发、测试和跨页面联调。'],
  ['05','反馈迭代','记录问题、定位机制缺口，再回到流程和方案中修正。'],
];

function ProjectRow({ number, title, cn, evidence, outcomes, tags, type }) {
  return <article className={`project-row ${type}`}>
    <div className="project-copy">
      <span className="project-number">PROJECT {number}</span><h2>{title}</h2><h3>{cn}</h3>
      <dl className="project-evidence">{evidence.map(([label, text]) => <div key={label}><dt>{label}</dt><dd>{text}</dd></div>)}</dl>
      <div className="outcome-row">{outcomes.map(([value,label]) => <span key={label}><b>{value}</b><small>{label}</small></span>)}</div>
      <div className="tag-row">{tags.map(t => <Tag key={t}>{t}</Tag>)}</div>
      <button className="project-link" onClick={() => go(type === 'jobs' ? '/projects/job-intelligence' : '/projects/football-analytics')}>查看完整方案 <span aria-hidden="true">→</span></button>
    </div>
    <div className="project-preview">{type === 'jobs' ? <MiniRecruitment /> : <MiniFootball />}</div>
  </article>;
}

export function Home() {
  return <main>
    <section className="hero container">
      <div className="eyebrow"><span>AI 产品 · 解决方案 · 数据分析</span><MockMark /></div>
      <h1>把需求、方案与数据<br/><em>做成可验证的产品。</em></h1>
      <div className="hero-bottom"><p>从场景梳理到交互落地，关注体验、收益与问题闭环。<br/><span>Loophow · 2027 届校园招聘作品集</span></p><div className="hero-note"><b>02</b><span>可交互项目<br/>完整解决方案</span></div></div>
    </section>
    <section className="method container" aria-labelledby="method-title">
      <div className="method-heading"><span>PRODUCT APPROACH</span><h2 id="method-title">从问题判断到方案落地</h2><p>不是展示页面数量，而是呈现每个关键决策如何形成。</p></div>
      <div className="method-grid">{productMethod.map(([number,title,copy]) => <article key={title}><span>{number}</span><h3>{title}</h3><p>{copy}</p></article>)}</div>
    </section>
    <section className="projects container" id="projects">
      <div className="section-heading"><span>SELECTED WORK</span><p>两项完整案例，均可进入产品继续操作与核验。</p></div>
      <ProjectRow number="01" title="AI 招聘情报中心" cn="真实岗位、JD 解析与简历匹配工作台" evidence={[
        ['需求分析','校招入口分散、JD 结构不一，比较岗位与判断投入优先级的成本过高。'],
        ['方案产出','串联岗位采集、结构化拆解、简历匹配与投递状态，形成连续决策路径。'],
        ['数据分析','统一岗位字段与匹配维度，并保留企业岗位原始来源供人工核验。'],
        ['落地闭环','总览与岗位库可下钻到详情；状态由使用者自主选择，不冒充真实投递记录。'],
      ]} outcomes={[[30,'真实岗位'],[15,'覆盖企业'],['4 层','决策路径']]} tags={['AI 产品','JD 解析','岗位数据库','简历匹配']} type="jobs" />
      <ProjectRow number="02" title="Football Data Lab" cn="真实赛程的数据统计与可视化" evidence={[
        ['需求分析','仅看比分无法解释比赛过程，赛程、阵容和球员表现之间缺少连续阅读路径。'],
        ['方案产出','以联赛总览为入口，下钻到比赛详情、阵型、替补与球员数据。'],
        ['数据分析','统一赛程、积分、事件与关键统计口径，用中线对齐和球队色增强可比性。'],
        ['落地闭环','近期比赛均可进入详情；丰富场次支持阵型、换人、进球时刻和球员面板。'],
      ]} outcomes={[[15,'近期比赛'],[20,'积分榜球队'],['4 层','分析路径']]} tags={['数据产品','真实赛程','可视化','交互分析']} type="football" />
    </section>
    <section className="about-strip"><div className="container"><span>BACKGROUND</span><p>西南大学 地理信息科学本科<br/>陕西师范大学 地理学硕士</p><p>Python · SQL · GIS<br/>Agent 评测 · GUI 数据采集</p><p>Product Design · Prompt<br/>Vibe Coding · Testing</p></div></section>
  </main>;
}
