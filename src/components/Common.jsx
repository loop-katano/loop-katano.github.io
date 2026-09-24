export function go(path) {
  window.history.pushState({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

export function Tag({ children, tone = '' }) { return <span className={`tag ${tone}`}>{children}</span>; }
export function MockMark() { return <span className="mock-mark">交互式作品集 · 2027 校招</span>; }

export function SiteHeader({ route }) {
  return <header className="site-header">
    <button className="wordmark" onClick={() => go('/')} aria-label="返回首页"><span>LH</span><b>LOOPHOW</b></button>
    <nav aria-label="主要导航">
      <button className={route === 'home' ? 'active' : ''} onClick={() => go('/')}>作品集</button>
      <button className={route === 'jobs' ? 'active' : ''} onClick={() => go('/projects/job-intelligence')}>招聘情报</button>
      <button className={route === 'football' ? 'active' : ''} onClick={() => go('/projects/football-analytics')}>足球数据</button>
    </nav>
    <span className="availability">2027 校招</span>
  </header>;
}
