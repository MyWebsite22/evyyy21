import { useEffect, useRef, useState } from 'react';
import { api } from '../api.js';
import MimiAvatar from './MimiAvatar.jsx';
import CrisisCard from './CrisisCard.jsx';

const opening = {
  role: 'assistant',
  content: 'Hola, mi hermosa mami Evelin. Soy Princesa virtual. Estoy aquí para acompañarte, darte mucho amor en este hermoso momento y recordarte lo fuerte que eres. 🐾'
};

export default function ChatRoom({ onNavigate }) {
  const [messages, setMessages] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem('mimi-chat')) || [opening]; } catch { return [opening]; }
  });
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [crisis, setCrisis] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    sessionStorage.setItem('mimi-chat', JSON.stringify(messages.slice(-20)));
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function send(text = input) {
    const clean = text.trim();
    if (!clean || loading) return;
    const userMessage = { role: 'user', content: clean };
    const next = [...messages, userMessage];
    setMessages(next);
    setInput('');
    setLoading(true);
    try {
      const data = await api.chat(clean, next.slice(-10));
      setMessages((current) => [...current, { role: 'assistant', content: data.reply }]);
      setCrisis(Boolean(data.crisis));
    } catch (err) {
      setMessages((current) => [...current, { role: 'assistant', content: `No pude conectarme ahora, pero sigo aquí contigo, mami. ${err.message}` }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="page-section chat-page">
      <header className="section-heading chat-heading">
        <MimiAvatar size="small" />
        <div><p className="eyebrow">Princesa te acompaña</p><h2>Cuéntame, mami hermosa</h2></div>
      </header>

      {crisis && <CrisisCard compact />}

      <div className="quick-actions" aria-label="Acciones rápidas">
        <button onClick={() => onNavigate('calma')}>Respirar juntas</button>
        <button onClick={() => onNavigate('musica')}>Poner música suave</button>
        <button onClick={() => send('Hoy necesito sentirme acompañada y recordar lo fuerte que soy.')}>Necesito compañía</button>
      </div>

      <div className="chat-window" aria-live="polite">
        {messages.map((message, index) => (
          <div key={`${index}-${message.role}`} className={`message ${message.role}`}>
            {message.role === 'assistant' && <span className="message-name">Princesa</span>}
            <p>{message.content}</p>
          </div>
        ))}
        {loading && <div className="message assistant typing"><span></span><span></span><span></span></div>}
        <div ref={endRef} />
      </div>

      <form className="chat-composer" onSubmit={(e) => { e.preventDefault(); send(); }}>
        <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Escribe lo que sientes…" rows="2" maxLength="1200" />
        <button className="primary-button" disabled={loading || !input.trim()}>Enviar</button>
      </form>
      <p className="tiny-note center">Princesa te acompaña con muchísimo cariño, pero recuerda apoyarte siempre en tu médico o familia si nos necesitas.</p>
    </section>
  );
}
