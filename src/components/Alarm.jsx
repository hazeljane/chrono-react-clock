import { useEffect, useRef, useState } from "react";
import { BellRing, Music2, Play, Square, Volume2, Clock3 } from "lucide-react";

const melodies = {
  gentle: [523.25, 659.25, 783.99, 659.25],
  classic: [880, 0, 880, 0, 698.46, 0, 880, 0],
  bells: [659.25, 783.99, 987.77, 783.99],
};

export default function Alarm({ onAlarmLabelChange }) {
  const [alarmTime, setAlarmTime] = useState("");
  const [sound, setSound] = useState("gentle");
  const [repeat, setRepeat] = useState(false);
  const [alarmTarget, setAlarmTarget] = useState(null);
  const [status, setStatus] = useState("No alarm set");
  const [ringing, setRinging] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [volume, setVolume] = useState(25);
  const audioRef = useRef(null);
  const loopRef = useRef(null);
  const musicRef = useRef(false);
  const ringingRef = useRef(false);
  const firedTarget = useRef(null);

  function getAudioContext() {
    if (!audioRef.current) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) audioRef.current = new AudioContextClass();
    }
    return audioRef.current;
  }

  function playTone(frequency, duration = 0.24, gain = 0.12) {
    const ctx = getAudioContext();
    if (!ctx || !frequency) return;
    if (ctx.state === "suspended") ctx.resume();
    const oscillator = ctx.createOscillator();
    const volumeNode = ctx.createGain();
    oscillator.type = sound === "classic" ? "square" : "sine";
    oscillator.frequency.value = frequency;
    volumeNode.gain.setValueAtTime(Math.max(0.001, gain * volume / 100), ctx.currentTime);
    volumeNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    oscillator.connect(volumeNode);
    volumeNode.connect(ctx.destination);
    oscillator.start();
    oscillator.stop(ctx.currentTime + duration);
  }

  function playMelody(isAlarm = false) {
    const sequence = melodies[sound] || melodies.gentle;
    sequence.forEach((frequency, index) => {
      window.setTimeout(() => {
        if (isAlarm ? ringingRef.current : musicRef.current) {
          playTone(frequency, isAlarm ? 0.38 : 0.28, isAlarm ? 0.2 : 0.08);
        }
      }, index * (isAlarm ? 430 : 380));
    });
  }

  useEffect(() => {
    const id = window.setInterval(() => {
      if (!alarmTarget || ringingRef.current) return;
      const now = Date.now();
      if (now >= alarmTarget && firedTarget.current !== alarmTarget) {
        firedTarget.current = alarmTarget;
        ringingRef.current = true;
        setRinging(true);
        setStatus("Alarm is ringing!");
        onAlarmLabelChange?.("Ringing");
        playMelody(true);
        loopRef.current = window.setInterval(() => playMelody(true), 1900);
        if (repeat) {
          const next = alarmTarget + 24 * 60 * 60 * 1000;
          setAlarmTarget(next);
        } else {
          setAlarmTarget(null);
        }
      }
    }, 500);
    return () => window.clearInterval(id);
  }, [alarmTarget, repeat, sound, volume]);

  useEffect(() => {
    if (!musicPlaying) return undefined;
    musicRef.current = true;
    playMelody(false);
    const id = window.setInterval(() => playMelody(false), 1900);
    return () => {
      musicRef.current = false;
      window.clearInterval(id);
    };
  }, [musicPlaying, sound, volume]);

  function setAlarm(event) {
    event.preventDefault();
    if (!alarmTime) return;
    const [hours, minutes] = alarmTime.split(":").map(Number);
    const now = new Date();
    const target = new Date(now);
    target.setHours(hours, minutes, 0, 0);
    if (target.getTime() <= now.getTime()) target.setDate(target.getDate() + 1);
    setAlarmTarget(target.getTime());
    firedTarget.current = null;
    setRinging(false);
    ringingRef.current = false;
    setStatus(`Set for ${alarmTime}${repeat ? " · repeats daily" : ""}`);
    onAlarmLabelChange?.(alarmTime);
  }

  function stopAlarm() {
    ringingRef.current = false;
    setRinging(false);
    window.clearInterval(loopRef.current);
    setStatus(alarmTarget ? `Next alarm is scheduled` : "Alarm stopped");
    onAlarmLabelChange?.(alarmTarget ? alarmTime : "Ready");
  }

  function snooze() {
    stopAlarm();
    const target = Date.now() + 5 * 60 * 1000;
    setAlarmTarget(target);
    setStatus("Snoozed for 5 minutes");
    onAlarmLabelChange?.("Snoozed");
  }

  return (
    <section className="tool-section alarm-panel app-section">
      <div className="tool-heading">
        <span className="tool-icon"><BellRing size={23} /></span>
        <div><h2>Alarm Clock</h2><p>Wake up to your favorite sound</p></div>
      </div>

      <form className="alarm-form" onSubmit={setAlarm}>
        <label htmlFor="alarmTime">Alarm time</label>
        <input id="alarmTime" type="time" value={alarmTime} onChange={(e) => setAlarmTime(e.target.value)} required />

        <label htmlFor="alarmSound">Alarm sound</label>
        <select id="alarmSound" value={sound} onChange={(e) => setSound(e.target.value)}>
          <option value="gentle">Gentle melody</option>
          <option value="classic">Classic alarm</option>
          <option value="bells">Soft bells</option>
        </select>

        <label className="switch-row" htmlFor="alarmRepeat">
          <span>Repeat every day</span>
          <input id="alarmRepeat" type="checkbox" checked={repeat} onChange={(e) => setRepeat(e.target.checked)} />
        </label>

        <button className="primary-button full-button" type="submit"><Clock3 size={17} /> Set alarm</button>
      </form>

      <div className="alarm-status" role="status" aria-live="polite">{status}</div>

      <div className="music-card">
        <div className="music-card-heading">
          <span className="tool-icon small"><Music2 size={20} /></span>
          <div><h3>Background music</h3><p>Play a relaxing generated melody.</p></div>
        </div>
        <button className="secondary-button full-button" type="button" onClick={() => setMusicPlaying((value) => !value)}>
          {musicPlaying ? <Square size={16} /> : <Play size={16} />} {musicPlaying ? "Stop music" : "Play music"}
        </button>
        <label className="volume-label" htmlFor="musicVolume"><Volume2 size={16} /> Music volume <span>{volume}%</span></label>
        <input id="musicVolume" type="range" min="0" max="100" value={volume} onChange={(e) => setVolume(Number(e.target.value))} />
      </div>

      {ringing && (
        <div className="ringing-panel">
          <p>⏰ Your alarm is ringing!</p>
          <div className="ringing-actions">
            <button className="secondary-button" type="button" onClick={snooze}>Snooze 5 min</button>
            <button className="primary-button" type="button" onClick={stopAlarm}>Stop alarm</button>
          </div>
        </div>
      )}
    </section>
  );
}
