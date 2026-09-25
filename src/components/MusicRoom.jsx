import { useEffect, useRef, useState } from 'react';
import useGentleAudio from '../hooks/useGentleAudio.js';

export default function MusicRoom() {
  const { mode, playCalm, playJoy, stop } = useGentleAudio();
  const audioRef = useRef(null);
  const [localTracks, setLocalTracks] = useState([]);
  const [current, setCurrent] = useState(null);

  useEffect(() => () => localTracks.forEach((track) => URL.revokeObjectURL(track.url)), []);

  function addFiles(event) {
    const files = [...event.target.files];
    const tracks = files.map((file) => ({ name: file.name.replace(/\.[^.]+$/, ''), url: URL.createObjectURL(file) }));
    setLocalTracks((currentTracks) => [...currentTracks, ...tracks]);
  }

  function playTrack(track) {
    stop();
    setCurrent(track);
    setTimeout(() => audioRef.current?.play(), 0);
  }

  return (
    <section className="page-section music-page">
      <header className="section-heading"><p className="eyebrow">Sonidos sin exigencias</p><h2>El rincón de la música</h2><p>Dos melodías originales del refugio y tus canciones privadas del teléfono.</p></header>
      <div className="music-modes">
        <button className={`music-card calm ${mode === 'calma' ? 'active' : ''}`} onClick={playCalm}><span>☁️</span><strong>Modo calma</strong><small>Acordes suaves para bajar el ritmo.</small></button>
        <button className={`music-card joy ${mode === 'alegria' ? 'active' : ''}`} onClick={playJoy}><span>✨</span><strong>Modo alegría</strong><small>Una melodía ligera para mover hombros o pies.</small></button>
      </div>
      {mode && <button className="secondary-button full" onClick={stop}>Detener melodía</button>}

      <div className="local-music soft-card">
        <h3>Sus canciones para bailar</h3>
        <p>Elige canciones guardadas en su teléfono o computadora. No se suben a ningún servidor.</p>
        <label className="file-button">Añadir canciones<input type="file" accept="audio/*" multiple onChange={addFiles} /></label>
        <div className="track-list">
          {localTracks.length === 0 && <p className="empty-state">Todavía no hay canciones. Puedes agregar las que le traen recuerdos bonitos.</p>}
          {localTracks.map((track) => <button key={track.url} onClick={() => playTrack(track)} className={current?.url === track.url ? 'active' : ''}>▶ {track.name}</button>)}
        </div>
        <audio ref={audioRef} src={current?.url || ''} controls className={current ? 'visible' : ''} />
      </div>
      <p className="tiny-note center">Las melodías incorporadas son originales y se generan en el navegador; no contienen anuncios.</p>
    </section>
  );
}
