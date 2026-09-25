import { useEffect, useRef, useState } from 'react';

export default function useGentleAudio() {
  const ctxRef = useRef(null);
  const nodesRef = useRef([]);
  const timerRef = useRef(null);
  const [mode, setMode] = useState(null);

  function stop() {
    nodesRef.current.forEach((node) => {
      try { node.stop?.(); } catch {}
      try { node.disconnect?.(); } catch {}
    });
    nodesRef.current = [];
    clearInterval(timerRef.current);
    timerRef.current = null;
    setMode(null);
  }

  function getContext() {
    if (!ctxRef.current) ctxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    if (ctxRef.current.state === 'suspended') ctxRef.current.resume();
    return ctxRef.current;
  }

  function tone(ctx, frequency, start, duration, gainValue = 0.025, type = 'sine') {
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.type = type;
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(gainValue, start + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    oscillator.connect(gain).connect(ctx.destination);
    oscillator.start(start);
    oscillator.stop(start + duration + 0.05);
    nodesRef.current.push(oscillator, gain);
  }

  function playCalm() {
    stop();
    const ctx = getContext();
    const playChord = () => {
      const now = ctx.currentTime;
      [196, 246.94, 293.66].forEach((f, i) => tone(ctx, f, now + i * 0.12, 5.8, 0.018));
      tone(ctx, 392, now + 2.8, 2.5, 0.009, 'triangle');
    };
    playChord();
    timerRef.current = setInterval(playChord, 6000);
    setMode('calma');
  }

  function playJoy() {
    stop();
    const ctx = getContext();
    const notes = [261.63, 329.63, 392, 440, 392, 329.63, 293.66, 349.23];
    const playPhrase = () => {
      const now = ctx.currentTime;
      notes.forEach((f, i) => tone(ctx, f, now + i * 0.42, 0.36, 0.025, i % 2 ? 'triangle' : 'sine'));
      [130.81, 146.83, 164.81, 146.83].forEach((f, i) => tone(ctx, f, now + i * 0.84, 0.7, 0.012, 'triangle'));
    };
    playPhrase();
    timerRef.current = setInterval(playPhrase, 3600);
    setMode('alegria');
  }

  useEffect(() => () => stop(), []);
  return { mode, playCalm, playJoy, stop };
}
