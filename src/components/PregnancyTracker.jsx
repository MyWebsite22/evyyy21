import { useState, useEffect } from 'react';

export default function PregnancyTracker() {
  const [gestation, setGestation] = useState({ weeks: 0, days: 0 });

  useEffect(() => {
    // Cálculo de la gestación: 
    // Fecha base ecografía: 21 Agosto 2026 = 13 semanas y 5 días (96 días)
    const baseDate = new Date('2026-08-21T00:00:00');
    const baseDays = 96; // 13 * 7 + 5

    const now = new Date();
    const diffTime = Math.abs(now - baseDate);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    // Si 'now' es posterior a la base
    let totalDays = baseDays;
    if (now >= baseDate) {
      totalDays += diffDays;
    } else {
      totalDays -= diffDays;
    }

    const currentWeeks = Math.floor(totalDays / 7);
    const currentDays = totalDays % 7;

    setGestation({ weeks: currentWeeks, days: currentDays });
  }, []);

  return (
    <div className="pregnancy-tracker soft-card" style={{ marginTop: '20px', textAlign: 'center', background: 'linear-gradient(135deg, #ffd3b6, #ffaaa5)', color: '#fff', border: 'none' }}>
      <p style={{ margin: '0', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600' }}>Nuestro Milagro</p>
      <h2 style={{ fontSize: '2rem', margin: '10px 0', fontFamily: '"Georgia", serif', fontStyle: 'italic', fontWeight: 'normal', color: '#fff', textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        {gestation.weeks} Semanas y {gestation.days} Días
      </h2>
      <p style={{ margin: '0', fontSize: '1rem', fontWeight: '500' }}>creando vida, creando amor.</p>
    </div>
  );
}
