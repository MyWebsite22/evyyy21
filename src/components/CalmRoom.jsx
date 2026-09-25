import { useEffect, useState } from 'react';
import CrisisCard from './CrisisCard.jsx';

const phases = [
  { label: 'Inhala despacito', seconds: 4, className: 'inhale' },
  { label: 'Sostén con suavidad', seconds: 2, className: 'hold' },
  { label: 'Exhala lentamente', seconds: 6, className: 'exhale' }
];

export default function CalmRoom() {
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState(0);
  const [remaining, setRemaining] = useState(phases[0].seconds);
  const [grounding, setGrounding] = useState(Array(5).fill(''));

  useEffect(() => {
    if (!running) return;
    const timer = setInterval(() => {
      setRemaining((value) => {
        if (value > 1) return value - 1;
        const next = (phase + 1) % phases.length;
        setPhase(next);
        return phases[next].seconds;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [running, phase]);

  function toggle() {
    if (!running) {
      setPhase(0);
      setRemaining(phases[0].seconds);
    }
    setRunning(!running);
  }

  const prompts = ['5 cosas que ves', '4 cosas que puedes tocar', '3 sonidos que escuchas', '2 aromas que notas', '1 sabor o sensación amable'];

  return (
    <section className="page-section calm-page">
      <header className="section-heading"><p className="eyebrow">Sin prisa</p><h2>Respira con Mimi</h2><p>No tienes que hacerlo perfecto. Solo acompaña el círculo.</p></header>
      <div className="breathing-card soft-card">
        <div className={`breathing-orb ${running ? phases[phase].className : ''}`}><span>{running ? remaining : '♡'}</span></div>
        <h3>{running ? phases[phase].label : 'Cuando estés lista'}</h3>
        <button className="primary-button" onClick={toggle}>{running ? 'Pausar' : 'Comenzar respiración 4–2–6'}</button>
      </div>
      <div className="grounding-card soft-card">
        <h3>Regresa poquito a poquito</h3>
        <p>Completa solo lo que te haga sentir cómoda.</p>
        {prompts.map((prompt, index) => (
          <label key={prompt}>{prompt}<input value={grounding[index]} onChange={(e) => setGrounding((current) => current.map((v, i) => i === index ? e.target.value : v))} /></label>
        ))}
        <button className="secondary-button" onClick={() => setGrounding(Array(5).fill(''))}>Limpiar y volver a empezar</button>
      </div>
      <CrisisCard />
    </section>
  );
}
