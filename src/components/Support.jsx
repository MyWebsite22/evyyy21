import { useState } from 'react';
import CrisisCard from './CrisisCard.jsx';

function loadContact() {
  try { return JSON.parse(localStorage.getItem('mimi-trusted-contact') || '{}'); } catch { return {}; }
}

export default function Support() {
  const [contact, setContact] = useState(loadContact);
  const [saved, setSaved] = useState(false);

  function save(event) {
    event.preventDefault();
    localStorage.setItem('mimi-trusted-contact', JSON.stringify(contact));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <section className="page-section support-page">
      <header className="section-heading"><p className="eyebrow">Una red que te sostenga</p><h2>Personas y ayuda</h2><p>Pedir compañía no es molestar. Es cuidarte.</p></header>
      <CrisisCard />
      <form className="trusted-contact soft-card" onSubmit={save}>
        <h3>Mi persona de confianza</h3>
        <p>Guarda a quien quisieras llamar cuando hablar se vuelva difícil.</p>
        <label>Nombre<input value={contact.name || ''} onChange={(e) => setContact({ ...contact, name: e.target.value })} placeholder="Ej. Gustavo, hermana, amiga" /></label>
        <label>Teléfono<input type="tel" value={contact.phone || ''} onChange={(e) => setContact({ ...contact, phone: e.target.value })} placeholder="+51…" /></label>
        <button className="primary-button">Guardar contacto</button>
        {saved && <p className="form-message success">Contacto guardado en este dispositivo.</p>}
      </form>
      <div className="care-reminder soft-card">
        <h3>Para el equipo que la acompaña</h3>
        <p>Si los bajones se vuelven más intensos, frecuentes o interfieren con su seguridad, conviene comunicarlo directamente a su psiquiatra o profesional tratante. Esta aplicación puede acompañar, pero no ajustar tratamientos ni reemplazar atención clínica.</p>
      </div>
    </section>
  );
}
