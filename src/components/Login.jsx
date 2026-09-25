import { useState } from 'react';
import MimiAvatar from './MimiAvatar.jsx';
import { api } from '../api.js';

export default function Login({ onLogin }) {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function submit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);
    
    // Verificación directa en el código de la web (sin usar backend para entrar)
    const passwordOk = password.trim().toLowerCase() === 'tulipanes';
    
    setTimeout(() => { // Pequeña pausa para el efecto de carga
      if (passwordOk) {
        sessionStorage.setItem('mimi-token', 'local-token-seguro');
        onLogin({ name: 'Evelin' });
      } else {
        setError('Esa no es la palabra correcta, intenta de nuevo.');
      }
      setLoading(false);
    }, 800);
  }

  return (
    <main className="login-screen">
      <section className="login-card soft-card">
        <MimiAvatar size="medium" />
        <p className="eyebrow" style={{ color: '#d2264e' }}>Bienvenida a tu rinconcito</p>
        <h1 style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', color: '#e93f66' }}>Hola, hermosa Evelin</h1>
        <p className="login-copy" style={{ fontSize: '1.05rem', color: '#555', marginBottom: '20px' }}>
          Este lugar ha sido creado con muchísimo amor solo para ti y nuestro bebé. 
          Un espacio donde puedes respirar profundo, estar tranquila y sentirte acompañada.
        </p>

        <form onSubmit={submit} className="login-form" style={{ marginTop: '0' }}>
          <label style={{ textAlign: 'center', color: '#ad5e80', fontSize: '0.9rem' }}>
            Pon nuestra palabra clave para entrar
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              style={{ textAlign: 'center', marginTop: '8px' }}
              placeholder="Escribe aquí..."
            />
          </label>
          <button className="primary-button" disabled={loading} style={{ background: 'linear-gradient(135deg, #e93f66, #ffaaa5)', borderRadius: '25px', color: '#fff', fontSize: '1.1rem', marginTop: '10px' }}>
            {loading ? 'Abriendo nuestro refugio…' : 'Entrar con Princesa'}
          </button>
        </form>

        {error && <p className="form-message" role="status" style={{ background: '#ffe4e1', color: '#d2264e', border: '1px solid #ffb6c1' }}>{error}</p>}

        <p className="tiny-note" style={{ marginTop: '20px', color: '#999' }}>Tu conversación es un espacio completamente privado y seguro.</p>
      </section>
    </main>
  );
}
