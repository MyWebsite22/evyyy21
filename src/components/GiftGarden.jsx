import { useEffect, useRef } from 'react';

export default function GiftGarden({ onClose }) {
  const containerRef = useRef(null);

  useEffect(() => {
    // Evitar scroll en el body mientras se ve el jardín (hasta llegar a la carta final)
    document.body.style.overflow = 'hidden';

    const canvas = document.getElementById('garden');
    const ctx = canvas.getContext('2d');
    let w, h, dpr;
    let animFrame;

    function resize() {
      dpr = window.devicePixelRatio || 1;
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.scale(dpr, dpr);
    }
    window.addEventListener('resize', resize);
    resize();

    const palettes = [
      { main: '#99d4f9', mainLight: '#bce3fb', side: '#7ebce6', leaf: '#89c79f', leafDark: '#6eb387' }, 
      { main: '#ffd230', mainLight: '#ffe23e', side: '#f5c324', leaf: '#89c79f', leafDark: '#6eb387' }, 
      { main: '#d2264e', mainLight: '#e93f66', side: '#b01d3f', leaf: '#89c79f', leafDark: '#6eb387' }, 
      { main: '#faa1c6', mainLight: '#fcb8d3', side: '#e889b2', leaf: '#89c79f', leafDark: '#6eb387' }  
    ];

    function createTulipImage(p) {
      const cvs = document.createElement('canvas');
      cvs.width = 120; cvs.height = 900; 
      const c = cvs.getContext('2d');
      
      c.fillStyle = p.leaf;
      c.beginPath(); c.roundRect(57, 80, 6, 820, 3); c.fill(); 
      
      const leafGrad = c.createLinearGradient(0, 100, 0, 200);
      leafGrad.addColorStop(0, p.leaf); leafGrad.addColorStop(1, p.leafDark);
      c.fillStyle = leafGrad;
      c.beginPath(); c.moveTo(57, 210); c.quadraticCurveTo(20, 190, 15, 120); c.quadraticCurveTo(40, 150, 57, 160); c.fill();
      c.beginPath(); c.moveTo(63, 190); c.quadraticCurveTo(100, 170, 105, 110); c.quadraticCurveTo(80, 140, 63, 150); c.fill();
      
      c.fillStyle = p.side;
      c.beginPath(); c.moveTo(60, 80); c.bezierCurveTo(25, 80, 15, 50, 22, 30); c.bezierCurveTo(30, 20, 35, 20, 40, 30); c.bezierCurveTo(45, 40, 50, 50, 60, 60); c.fill();
      c.beginPath(); c.moveTo(60, 80); c.bezierCurveTo(95, 80, 105, 50, 98, 30); c.bezierCurveTo(90, 20, 85, 20, 80, 30); c.bezierCurveTo(75, 40, 70, 50, 60, 60); c.fill();
      
      const mainGrad = c.createLinearGradient(0, 30, 0, 90);
      mainGrad.addColorStop(0, p.mainLight); mainGrad.addColorStop(1, p.main);
      c.fillStyle = mainGrad;
      c.beginPath(); c.moveTo(60, 95); c.bezierCurveTo(30, 95, 25, 55, 30, 35); c.bezierCurveTo(35, 25, 45, 25, 50, 32); c.quadraticCurveTo(60, 42, 70, 32); c.bezierCurveTo(75, 25, 85, 25, 90, 35); c.bezierCurveTo(95, 55, 90, 95, 60, 95); c.fill();
      
      return cvs;
    }

    const tulipImages = palettes.map(p => createTulipImage(p));

    const tulips = [];
    for(let i=0; i<250; i++) { 
      tulips.push({
        x: (Math.random() - 0.5) * w * 4, 
        yOffset: Math.random() * 80 - 40, 
        z: Math.random() * 6000,
        img: tulipImages[Math.floor(Math.random() * tulipImages.length)]
      });
    }

    const motes = Array.from({length: 40}, () => ({
      x: Math.random() * w, y: Math.random() * h,
      size: Math.random() * 3 + 1,
      speedY: Math.random() * 1.5 + 0.5,
      speedX: (Math.random() - 0.5) * 1.5
    }));

    let speed = 2;
    let targetSpeed = 2;
    let totalProgress = 0;
    const maxProgress = 14000; 
    let scenePhase = 1;
    let isHolding = false;

    function startMoving(e) { 
      if(e.target.closest('a') || e.target.closest('.creator-badge')) return;
      if (scenePhase === 1) isHolding = true; 
    }
    function stopMoving() { isHolding = false; }
    
    window.addEventListener('mousedown', startMoving);
    window.addEventListener('mouseup', stopMoving);
    window.addEventListener('touchstart', startMoving, {passive: true});
    window.addEventListener('touchend', stopMoving);
    window.addEventListener('touchcancel', stopMoving);

    function loop() {
      if (scenePhase !== 1) return;
      ctx.clearRect(0, 0, w, h);

      targetSpeed = isHolding ? 55 : 2;
      speed += (targetSpeed - speed) * 0.1; 
      totalProgress += speed;

      let progressPercent = Math.min((totalProgress / maxProgress) * 100, 100);
      const fillEl = document.getElementById('progressFill');
      if(fillEl) fillEl.style.width = progressPercent + '%';

      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      motes.forEach(m => {
        m.y -= m.speedY; m.x += m.speedX;
        if (m.y < -20) m.y = h + 20;
        if (m.x > w + 20) m.x = -20; if (m.x < -20) m.x = w + 20;
        ctx.beginPath(); ctx.arc(m.x, m.y, m.size, 0, Math.PI*2); ctx.fill();
      });

      tulips.sort((a, b) => b.z - a.z);
      let cameraY = h * 0.35; 
      let perspective = 1000; 

      tulips.forEach(t => {
        t.z -= speed;
        if (t.z < -200) { 
          t.z += 6000; 
          t.x = (Math.random() - 0.5) * w * 4; 
        }
        if (t.z > -perspective + 100) {
          let scale = perspective / (perspective + t.z);
          let screenX = w/2 + (t.x * scale);
          let screenY = (h * 0.4) + ((cameraY + t.yOffset) * scale);
          
          let drawW = 120 * scale * 2.2; 
          let drawH = 900 * scale * 2.2; 
          
          if (screenX > -drawW && screenX < w + drawW && scale < 12) {
            let headOffsetY = 95 * scale * 2.2; 
            ctx.drawImage(t.img, screenX - drawW/2, screenY - headOffsetY, drawW, drawH);
          }
        }
      });

      if (totalProgress > maxProgress) {
        scenePhase = 2;
        const gScene = document.getElementById('gardenScene');
        if(gScene) gScene.style.opacity = 0;
        setTimeout(() => {
          if(gScene) gScene.style.display = 'none';
          const wScene = document.getElementById('waterScene');
          if(wScene) {
            wScene.style.display = 'flex';
            void wScene.offsetWidth; 
            wScene.style.opacity = 1;
          }
        }, 1000);
        return;
      }
      animFrame = requestAnimationFrame(loop);
    }
    animFrame = requestAnimationFrame(loop);

    // Limpieza
    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousedown', startMoving);
      window.removeEventListener('mouseup', stopMoving);
      window.removeEventListener('touchstart', startMoving);
      window.removeEventListener('touchend', stopMoving);
      window.removeEventListener('touchcancel', stopMoving);
      cancelAnimationFrame(animFrame);
      document.body.style.overflow = '';
    };
  }, []);

  let hasWatered = false;

  function startWatering() {
    if (hasWatered) return;
    hasWatered = true;
    
    const can = document.getElementById('can');
    if(!can) return;
    can.classList.add('pouring');
    let rect = can.getBoundingClientRect();
    
    for(let i=0; i<30; i++) {
      setTimeout(() => {
        const wScene = document.getElementById('waterScene');
        if(!wScene) return;
        let drop = document.createElement('div');
        drop.className = 'drop';
        drop.style.left = (rect.left + 5 + Math.random() * 20) + 'px';
        drop.style.top = (rect.top + 70) + 'px';
        wScene.appendChild(drop);
        drop.style.animation = 'dropFall 0.7s ease-in forwards';
        
        if(i % 5 === 0) {
          const seedling = document.getElementById('seedling');
          if(seedling) {
            seedling.style.transform = `scale(1.15) rotate(${Math.random() * 10 - 5}deg)`;
            setTimeout(() => seedling.style.transform = 'scale(1) rotate(0deg)', 200);
          }
        }
        setTimeout(() => drop.remove(), 700);
      }, 400 + i * 50); 
    }
    
    setTimeout(() => {
      const flash = document.getElementById('flashOverlay');
      if(flash) flash.style.opacity = 1; 
      
      setTimeout(() => {
        const intScenes = document.getElementById('interactiveScenes');
        if(intScenes) intScenes.style.display = 'none';
        
        const fScene = document.getElementById('finalScene');
        if(fScene) {
          fScene.style.display = 'flex';
          void fScene.offsetWidth;
        }
        
        if(flash) flash.style.opacity = 0; 
        
        document.querySelector('.f-stem')?.classList.add('grow');
        document.querySelector('.f-leaf-l')?.classList.add('grow');
        document.querySelector('.f-leaf-r')?.classList.add('grow');
        document.querySelector('.f-petals')?.classList.add('bloom');
        
        document.getElementById('letterBox')?.classList.add('show');
        
        // Habilitar scroll para la escena final
        document.body.style.overflow = 'auto';
      }, 1500);
    }, 3000); 
  }

  return (
    <div className="gift-garden-wrapper" ref={containerRef}>
      <style>{`
        .gift-garden-wrapper {
          position: absolute;
          inset: 0;
          width: 100%; height: 100%;
          z-index: 1000;
          background: #a8e6cf;
          font-family: 'Montserrat', sans-serif;
        }
        .creator-badge {
          position: fixed; top: 15px; left: 50%; transform: translateX(-50%);
          display: flex; align-items: center; gap: 12px;
          background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(10px);
          padding: 10px 22px; border-radius: 50px; z-index: 1001;
          font-size: 0.85rem; color: #555; box-shadow: 0 4px 15px rgba(0,0,0,0.06); 
          border: 1px solid rgba(255,255,255,1); font-weight: 600; white-space: nowrap;
        }
        .creator-badge .social-link {
          display: flex; align-items: center; gap: 6px; color: #e93f66; text-decoration: none;
          transition: transform 0.2s, color 0.2s;
        }
        .creator-badge .social-link:hover { transform: scale(1.08); color: #d2264e; }
        
        .interactive-container {
          position: fixed; inset: 0; width: 100%; height: 100%;
          overflow: hidden; z-index: 1000;
        }
        .sky {
          position: absolute; inset: 0; z-index: 0;
          background: linear-gradient(180deg, #ffd3b6 0%, #ffaaa5 40%, #a8e6cf 100%);
        }
        .sun {
          position: absolute; left: 50%; top: 40%; width: 90vmin; height: 90vmin; transform: translate(-50%, -50%);
          background: radial-gradient(circle, #ffffff 0%, rgba(255, 255, 255, 0.5) 30%, transparent 70%);
          border-radius: 50%; z-index: 1; pointer-events: none; filter: blur(20px);
        }
        #flashOverlay {
          position: absolute; inset: 0; background: #fff; z-index: 1100;
          opacity: 0; pointer-events: none; transition: opacity 1.5s ease;
        }
        #gardenScene { position: absolute; inset: 0; z-index: 2; transition: opacity 1s ease; user-select: none; }
        .gift-garden-wrapper canvas { display: block; width: 100%; height: 100%; }
        
        .hint-bar-container {
          position: absolute; bottom: 8vh; left: 50%; transform: translateX(-50%);
          width: 85%; max-width: 350px; display: flex; flex-direction: column; align-items: center;
          z-index: 5; pointer-events: none;
        }
        .hint-text {
          color: #d2264e; font-size: 0.85rem; letter-spacing: 0.15em; text-transform: uppercase;
          text-align: center; margin-bottom: 12px; font-weight: 700;
          animation: pulseText 2s infinite; text-shadow: 0 2px 8px rgba(255,255,255,0.9);
        }
        .progress-bar {
          width: 100%; height: 6px; background: rgba(0,0,0,0.1); border-radius: 10px; overflow: hidden;
        }
        .progress-fill {
          height: 100%; width: 0%; background: linear-gradient(90deg, #ffaaa5, #e93f66); 
          border-radius: 10px; transition: width 0.1s linear;
        }
        @keyframes pulseText { 0%, 100% { opacity: 0.6; } 50% { opacity: 1; transform: scale(1.02); } }

        #waterScene {
          position: absolute; inset: 0; z-index: 3; display: none; opacity: 0; transition: opacity 1s ease;
          flex-direction: column; align-items: center; justify-content: center; padding-bottom: 10vh;
        }
        .water-instruction {
          font-family: 'Georgia', serif; font-style: italic; color: #d2264e; 
          font-size: 2.2rem; text-align: center; margin-bottom: 5vh; 
          text-shadow: 0 2px 10px rgba(255,255,255,0.8); padding: 0 20px; line-height: 1.2; font-weight: 600;
        }
        .interaction-area {
          position: relative; width: 100%; max-width: 350px; height: 350px;
          display: flex; justify-content: center;
        }
        .watering-can {
          position: absolute; top: 10px; right: 10%; width: 120px; height: 120px;
          cursor: pointer; z-index: 10;
          transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
          animation: floatCan 3s ease-in-out infinite;
          filter: drop-shadow(0 15px 15px rgba(0,0,0,0.15));
        }
        @keyframes floatCan { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
        .watering-can.pouring { 
          transform: rotate(-35deg) translate(-25px, 15px) !important; 
          animation: none; 
        }
        .drop {
          position: absolute; width: 6px; height: 16px; background: #7ebce6;
          border-radius: 5px; opacity: 0; z-index: 9;
        }
        @keyframes dropFall {
          0% { transform: translateY(0) scale(1); opacity: 1; }
          100% { transform: translateY(220px) scale(0.6); opacity: 0; }
        }
        .pot-area {
          position: absolute; bottom: 40px; left: 50%; transform: translateX(-50%);
          display: flex; flex-direction: column; align-items: center;
        }
        .seedling-svg {
          width: 80px; height: 80px; filter: drop-shadow(0 10px 10px rgba(0,0,0,0.1));
          transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); transform-origin: bottom center;
        }

        #finalScene {
          position: absolute; inset: 0; width: 100%; height: 100%;
          overflow-y: auto; overflow-x: hidden; -webkit-overflow-scrolling: touch;
          display: none; opacity: 1; z-index: 4;
          flex-direction: column; align-items: center; justify-content: flex-start;
          background: linear-gradient(180deg, #ffd3b6 0%, #ffaaa5 40%, #a8e6cf 100%);
        }
        .final-tulip-wrapper {
          flex-shrink: 0; display: flex; justify-content: center; align-items: flex-end;
          min-height: 45vh; width: 100%; margin-top: 50px; margin-bottom: 20px;
        }
        .special-tulip-svg {
          width: 220px; height: 350px; overflow: visible; z-index: 5;
          animation: gentleSway 5s ease-in-out infinite; transform-origin: bottom center;
          filter: drop-shadow(0 15px 25px rgba(0,0,0,0.1));
        }
        @keyframes gentleSway { 0%, 100% { transform: rotate(-2deg); } 50% { transform: rotate(2deg); } }

        .stems { stroke-dasharray: 400; stroke-dashoffset: 400; }
        .stems.grow { animation: drawStem 2.5s ease-out forwards; }
        @keyframes drawStem { to { stroke-dashoffset: 0; } }

        .f-leaf-l { transform: scale(0); transform-origin: 60px 210px; }
        .f-leaf-r { transform: scale(0); transform-origin: 60px 190px; }
        .f-leaf-l.grow, .f-leaf-r.grow { animation: popPart 1.5s cubic-bezier(0.34, 1.56, 0.64, 1) 1.5s forwards; }
        
        .f-petals { transform: scale(0); transform-origin: 60px 95px; }
        .f-petals.bloom { animation: popPart 2s cubic-bezier(0.34, 1.56, 0.64, 1) 2s forwards; }
        @keyframes popPart { to { transform: scale(1); } }

        .letter-container {
          flex-shrink: 0;
          background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
          border: 2px solid rgba(255, 255, 255, 1); border-radius: 28px;
          padding: 40px 35px; width: 90%; max-width: 550px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.06);
          transform: translateY(40px); opacity: 0; z-index: 6;
          margin-bottom: 60px;
        }
        .letter-container.show { animation: slideUp 1.8s cubic-bezier(0.2, 0.8, 0.2, 1) 3.5s forwards; }
        @keyframes slideUp { to { transform: translateY(0); opacity: 1; } }

        .letter-title {
          font-family: 'Georgia', serif; font-style: italic; font-size: 2.8rem; 
          color: #d2264e; text-align: center; margin-bottom: 20px; 
          font-weight: 700; line-height: 1.1; text-shadow: 0 1px 2px rgba(255,255,255,0.8);
        }
        .letter-body {
          font-family: 'Montserrat', sans-serif; font-size: 1rem; font-weight: 500;
          color: #555; line-height: 1.7; text-align: justify;
        }
        .letter-body p { margin-bottom: 16px; }
        .letter-sign {
          font-family: 'Georgia', serif; font-style: italic; font-size: 2rem; 
          color: #e93f66; text-align: right; margin-top: 30px; font-weight: 700;
        }
      `}</style>

      <div className="creator-badge">
        <span>Creado por</span>
        <a href="https://instagram.com/gatm_2210" target="_blank" rel="noreferrer" className="social-link" title="Instagram">
          <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
          @gatm_2210
        </a>
        <span style={{color: '#ccc'}}>|</span>
        <a href="https://wa.me/" target="_blank" rel="noreferrer" className="social-link" title="WhatsApp">
          <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a5.22 5.22 0 00-.571-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
        </a>
      </div>

      <div className="interactive-container" id="interactiveScenes">
        <div className="sky"></div>
        <div className="sun"></div>
        <div id="flashOverlay"></div>

        <div id="gardenScene">
          <canvas id="garden"></canvas>
          <div className="hint-bar-container" id="hintBox">
            <div className="hint-text">Mantén presionado para acelerar al final</div>
            <div className="progress-bar">
              <div className="progress-fill" id="progressFill"></div>
            </div>
          </div>
        </div>

        <div id="waterScene">
          <div className="water-instruction">Evelin, mi reina...<br/>Ayúdame a regar el fruto de nuestro amor.</div>
          <div className="interaction-area">
            <svg className="watering-can" id="can" viewBox="0 0 120 120" onClick={startWatering}>
              <path d="M 90 30 C 120 30 120 80 90 80" fill="none" stroke="#7ebce6" strokeWidth="8" strokeLinecap="round"/>
              <path d="M 50 30 L 90 30 C 95 30 100 35 100 40 L 100 90 C 100 95 95 100 90 100 L 50 100 C 45 100 40 95 40 90 L 40 40 C 40 35 45 30 50 30 Z" fill="#99d4f9"/>
              <path d="M 40 80 L 10 40 L 15 35 L 45 70 Z" fill="#7ebce6"/>
              <ellipse cx="10" cy="35" rx="5" ry="12" fill="#fcb8d3" transform="rotate(-35 10 35)"/>
            </svg>
            <div className="pot-area">
              <svg id="seedling" className="seedling-svg" viewBox="0 0 100 100">
                <path d="M 50 100 Q 45 70 50 50" fill="none" stroke="#6eb387" strokeWidth="6" strokeLinecap="round"/>
                <path d="M 50 80 Q 20 70 10 40 Q 30 60 50 75" fill="#89c79f"/>
                <path d="M 50 70 Q 80 60 90 30 Q 70 50 50 65" fill="#89c79f"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div id="finalScene">
        <div className="final-tulip-wrapper">
          <svg className="special-tulip-svg" viewBox="0 0 120 250">
            <path className="f-stem stems" d="M 60 250 L 60 95" fill="none" stroke="#6eb387" strokeWidth="6" strokeLinecap="round"/>
            <g className="f-leaf-l">
              <path d="M 60 210 C 20 190 15 120 20 90 C 40 120 57 150 60 160 Z" fill="#89c79f" />
            </g>
            <g className="f-leaf-r">
              <path d="M 60 190 C 100 170 105 110 100 80 C 80 110 63 140 60 150 Z" fill="#89c79f" />
            </g>
            <g className="f-petals">
              <path className="f-petal-side p-left" d="M 60 80 C 25 80 15 50 22 30 C 30 20 35 20 40 30 C 45 40 50 50 60 60 Z" fill="#e889b2" />
              <path className="f-petal-side p-right" d="M 60 80 C 95 80 105 50 98 30 C 90 20 85 20 80 30 C 75 40 70 50 60 60 Z" fill="#e889b2" />
              <path className="f-petal-center p-center" d="M 60 95 C 30 95 25 55 30 35 C 35 25 45 25 50 32 Q 60 42 70 32 C 75 25 85 25 90 35 C 95 55 90 95 60 95 Z" fill="#fcb8d3" />
            </g>
          </svg>
        </div>

        <div className="letter-container" id="letterBox">
          <div className="letter-title">Para ti, mi vida entera</div>
          <div className="letter-body">
            <p>Mi amada Evelin,</p>
            <p>Hoy 21 de septiembre, quería regalarte algo que perdurara, un jardín digital creado exclusivamente para ti. En lugar de los tradicionales girasoles, diseñé estos tulipanes pasteles, tan únicos, delicados y hermosos como tú.</p>
            <p>Eres el amor de mi vida, mi refugio y mi mayor inspiración. Al verte cada día, y ahora sabiendo que llevas en tu vientre el milagro de nuestro bebé, mi corazón se llena de un orgullo y una gratitud infinitos. Vas a ser la mamá más maravillosa de este mundo.</p>
            <p>Quiero darte siempre lo mejor de lo mejor, cuidarte, protegerte y amarte en cada paso de nuestro camino juntos. Eres el arte más precioso que la vida me ha dejado contemplar. Tu cuerpo es mágico, y estoy enamorado de ti más que ayer.</p>
            <p>Feliz 21 de septiembre, mi futura mamá hermosa.</p>
          </div>
          <div className="letter-sign">Te amo infinitamente...</div>
          <button 
            onClick={() => {
              if (onClose) onClose();
            }} 
            style={{marginTop: '30px', background: '#e93f66', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '25px', cursor: 'pointer', fontFamily: 'Montserrat', fontWeight: 'bold', boxShadow: '0 4px 10px rgba(233, 63, 102, 0.3)'}}
          >
            Volver a mi refugio
          </button>
        </div>
      </div>
    </div>
  );
}
