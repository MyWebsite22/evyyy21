import { useMemo, useState } from 'react';

const moods = [
  { value: 'muy-bajo', label: 'Muy difícil', icon: '🌧️' },
  { value: 'bajo', label: 'Bajito', icon: '☁️' },
  { value: 'neutral', label: 'Tranquilo', icon: '🌿' },
  { value: 'mejor', label: 'Un poco mejor', icon: '🌤️' },
  { value: 'alegre', label: 'Alegre', icon: '🌸' }
];

function loadEntries() {
  try { return JSON.parse(localStorage.getItem('mimi-journal') || '[]'); } catch { return []; }
}

export default function Journal() {
  const [entries, setEntries] = useState(loadEntries);
  const [mood, setMood] = useState('neutral');
  const [text, setText] = useState('');
  const [gratitude, setGratitude] = useState('');
  const recent = useMemo(() => [...entries].reverse().slice(0, 10), [entries]);

  function save(event) {
    event.preventDefault();
    if (!text.trim() && !gratitude.trim()) return;
    const next = [...entries, { id: crypto.randomUUID(), createdAt: new Date().toISOString(), mood, text: text.trim(), gratitude: gratitude.trim() }];
    localStorage.setItem('mimi-journal', JSON.stringify(next));
    setEntries(next);
    setText('');
    setGratitude('');
  }

  function remove(id) {
    const next = entries.filter((entry) => entry.id !== id);
    localStorage.setItem('mimi-journal', JSON.stringify(next));
    setEntries(next);
  }

  function exportJournal() {
    const body = entries.map((entry) => {
      const moodLabel = moods.find((item) => item.value === entry.mood)?.label || entry.mood;
      return `${new Date(entry.createdAt).toLocaleString('es-PE')}\nÁnimo: ${moodLabel}\nLo que sentí: ${entry.text || '—'}\nAlgo amable: ${entry.gratitude || '—'}\n`;
    }).join('\n------------------------------\n');
    const blob = new Blob([`EL REFUGIO DE MIMI · DIARIO PRIVADO\n\n${body}`], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `diario-mimi-${new Date().toISOString().slice(0, 10)}.txt`;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  return (
    <section className="page-section journal-page">
      <header className="section-heading"><p className="eyebrow">Solo para ti</p><h2>Mi diario suave</h2><p>Se guarda únicamente en este dispositivo.</p></header>
      <form className="journal-form soft-card" onSubmit={save}>
        <fieldset><legend>¿Cómo se siente hoy?</legend><div className="mood-grid">{moods.map((item) => <button type="button" key={item.value} className={mood === item.value ? 'selected' : ''} onClick={() => setMood(item.value)}><span>{item.icon}</span>{item.label}</button>)}</div></fieldset>
        <label>Lo que tengo dentro<textarea rows="5" value={text} onChange={(e) => setText(e.target.value)} placeholder="No tiene que sonar bonito. Solo tiene que ser verdad para ti." /></label>
        <label>Una cosa pequeña que me sostuvo<textarea rows="2" value={gratitude} onChange={(e) => setGratitude(e.target.value)} placeholder="Una llamada, una canción, Mimi, una taza caliente…" /></label>
        <button className="primary-button">Guardar este momento</button>
      </form>
      <div className="journal-history">
        <div className="history-heading"><h3>Momentos guardados</h3>{entries.length > 0 && <button className="text-button" onClick={exportJournal}>Descargar diario</button>}</div>
        {recent.length === 0 && <p className="empty-state">Aún no hay entradas. El primer renglón puede ser muy pequeño.</p>}
        {recent.map((entry) => {
          const item = moods.find((m) => m.value === entry.mood);
          return <article className="journal-entry" key={entry.id}><div className="entry-top"><span>{item?.icon} {new Date(entry.createdAt).toLocaleDateString('es-PE', { day: 'numeric', month: 'long', year: 'numeric' })}</span><button aria-label="Eliminar entrada" onClick={() => remove(entry.id)}>×</button></div>{entry.text && <p>{entry.text}</p>}{entry.gratitude && <small>Algo amable: {entry.gratitude}</small>}</article>;
        })}
      </div>
    </section>
  );
}
