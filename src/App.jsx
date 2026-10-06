import { useEffect, useState } from 'react';
import { Home } from './pages/Home';
import { JobProject } from './pages/JobProject';
import { FootballProject } from './pages/FootballProject';
import { SiteHeader } from './components/Common';
import { MapProject } from './pages/MapProject';

const getRoute = path => path.startsWith('/projects/meetpoint') ? 'map' : path.startsWith('/projects/job-intelligence') ? 'jobs' : path.startsWith('/projects/football-analytics') ? 'football' : 'home';

export function App() {
  const [route, setRoute] = useState(getRoute(window.location.pathname));
  useEffect(() => {
    const onPop = () => setRoute(getRoute(window.location.pathname));
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);
  return <>
    <SiteHeader route={route}/>
    {route === 'home' ? <Home/> : route === 'map' ? <MapProject/> : route === 'jobs' ? <JobProject/> : <FootballProject/>}
    <footer><div className="container"><b>LOOPHOW</b><span>时空信息 · 数据产品 · AI应用</span><span>个人作品集 · 2027</span></div></footer>
  </>;
}
