import { useEffect, useState } from 'react';
import Login from './components/Login.jsx';
import Home from './components/Home.jsx';
import ChatRoom from './components/ChatRoom.jsx';
import CalmRoom from './components/CalmRoom.jsx';
import MusicRoom from './components/MusicRoom.jsx';
import Journal from './components/Journal.jsx';
import Support from './components/Support.jsx';
import GiftGarden from './components/GiftGarden.jsx';

const tabs = [
  { id: 'inicio', icon: '⌂', label: 'Inicio' },
  { id: 'chat', icon: '♡', label: 'Princesa' },
  { id: 'regalo', icon: '🎁', label: 'Regalo' },
  { id: 'calma', icon: '☁', label: 'Calma' },
  { id: 'musica', icon: '♫', label: 'Música' },
  { id: 'diario', icon: '✎', label: 'Diario' },
  { id: 'apoyo', icon: '✦', label: 'Ayuda' }
];

export default function App() {
  const [user, setUser] = useState(() => sessionStorage.getItem('mimi-token') ? { name: 'Evelin' } : null);
  const [tab, setTab] = useState('inicio');
  const [night, setNight] = useState(() => localStorage.getItem('mimi-night') === 'true');
  const [largeText, setLargeText] = useState(() => localStorage.getItem('mimi-large-text') === 'true');

  useEffect(() => {
    document.documentElement.dataset.theme = night ? 'night' : 'day';
    document.documentElement.dataset.text = largeText ? 'large' : 'normal';
    localStorage.setItem('mimi-night', String(night));
    localStorage.setItem('mimi-large-text', String(largeText));
  }, [night, largeText]);

  function logout() {
    sessionStorage.removeItem('mimi-token');
    sessionStorage.removeItem('mimi-chat');
    setUser(null);
  }

  if (!user) return <Login onLogin={setUser} />;

  const views = {
    inicio: <Home onNavigate={setTab} user={user} />,
    chat: <ChatRoom onNavigate={setTab} />,
    regalo: <GiftGarden onClose={() => setTab('inicio')} />,
    calma: <CalmRoom />,
    musica: <MusicRoom />,
    diario: <Journal />,
    apoyo: <Support />
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="brand" onClick={() => setTab('inicio')}><span>♡</span> El Refugio de Princesa</button>
        <div className="top-actions">
          <button aria-label="Cambiar tamaño de texto" title="Cambiar tamaño de texto" onClick={() => setLargeText(!largeText)}>Aa</button>
          <button aria-label="Cambiar tema" title="Cambiar tema" onClick={() => setNight(!night)}>{night ? '☀' : '☾'}</button>
          <button className="logout" onClick={logout}>Salir</button>
        </div>
      </header>
      <main>{views[tab]}</main>
      <nav className="bottom-nav" aria-label="Navegación principal">
        {tabs.map((item) => <button key={item.id} className={tab === item.id ? 'active' : ''} onClick={() => setTab(item.id)}><span>{item.icon}</span><small>{item.label}</small></button>)}
      </nav>
    </div>
  );
}
