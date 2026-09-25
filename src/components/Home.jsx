import MimiAvatar from './MimiAvatar.jsx';
import PregnancyTracker from './PregnancyTracker.jsx';

const phrases = [
  'Tu cuerpo está haciendo magia, respira y confía en ti.',
  'Eres hermosa, fuerte y la mamá perfecta para nuestro bebé.',
  'Crear vida es un milagro, y tú eres el lienzo más precioso.',
  'Cada pequeño cambio en ti es una prueba del amor infinito que llevas dentro.',
  'No tienes que ser perfecta, solo tienes que ser tú. Y tú eres maravillosa.',
  'Tu belleza brilla más que nunca en esta etapa tan especial.'
];

export default function Home({ onNavigate, user }) {
  const day = new Date().getDate();
  const phrase = phrases[day % phrases.length];
  return (
    <section className="page-section home-page">
      <div className="hero-copy">
        <p className="eyebrow">Bienvenida, mi amada {user?.name || 'Evelin'}</p>
        <h1>Este lugar es solo para ti.</h1>
        <p>Un refugio para acompañarte, abrazarte y recordarte lo valiosa que eres.</p>
      </div>
      <MimiAvatar />
      
      <PregnancyTracker />

      <div className="daily-note soft-card">
        <span>Nota de amor para hoy</span>
        <strong>“{phrase}”</strong>
      </div>
      <div className="home-grid">
        <button className="feature-card" onClick={() => onNavigate('chat')}><span>💬</span><strong>Hablar con Princesa</strong><small>Cuéntale cómo te sientes.</small></button>
        <button className="feature-card" onClick={() => onNavigate('calma')}><span>☁️</span><strong>Volver al presente</strong><small>Respiración y anclaje suave.</small></button>
        <button className="feature-card" onClick={() => onNavigate('musica')}><span>🎷</span><strong>Música para este momento</strong><small>Calma o un poquito de alegría.</small></button>
        <button className="feature-card" onClick={() => onNavigate('diario')}><span>🌷</span><strong>Guardar lo que siento</strong><small>Un diario privado en este dispositivo.</small></button>
      </div>
    </section>
  );
}
