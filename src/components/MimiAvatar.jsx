export default function MimiAvatar({ size = 'large', calm = true }) {
  return (
    <div className={`mimi-avatar ${size} ${calm ? 'breathing' : ''}`} aria-label="Ilustración de Princesa">
      <svg viewBox="0 0 320 320" role="img" aria-hidden="true">
        <ellipse cx="160" cy="174" rx="106" ry="103" fill="#fffdfc" />
        <ellipse cx="75" cy="142" rx="45" ry="75" transform="rotate(20 75 142)" fill="#d4a373" />
        <ellipse cx="245" cy="142" rx="45" ry="75" transform="rotate(-20 245 142)" fill="#d4a373" />
        <ellipse cx="160" cy="171" rx="92" ry="84" fill="#fae1c5" />
        <path d="M136 104c29-18 58-16 86 4-15 22-43 32-68 24-13-4-20-13-18-28Z" fill="#d4a373" />
        <circle cx="124" cy="168" r="10" fill="#4a3b32" />
        <circle cx="196" cy="168" r="10" fill="#4a3b32" />
        <circle cx="120" cy="164" r="3" fill="#fff" />
        <circle cx="192" cy="164" r="3" fill="#fff" />
        <ellipse cx="160" cy="201" rx="22" ry="16" fill="#4a3b32" />
        <path d="M132 223c18 19 38 21 57 1" fill="none" stroke="#4a3b32" strokeWidth="7" strokeLinecap="round" />
        <rect x="149" y="226" width="11" height="16" rx="3" fill="#fff" stroke="#c4b5a2" />
        <rect x="162" y="226" width="11" height="16" rx="3" fill="#fff" stroke="#c4b5a2" />
        <circle cx="108" cy="204" r="14" fill="#f6c9d8" opacity=".6" />
        <circle cx="212" cy="204" r="14" fill="#f6c9d8" opacity=".6" />
        <path className="tail" d="M252 224c48 3 43 55 7 50" fill="none" stroke="#d4a373" strokeWidth="23" strokeLinecap="round" />
      </svg>
      <span className="avatar-heart" aria-hidden="true">♡</span>
    </div>
  );
}
