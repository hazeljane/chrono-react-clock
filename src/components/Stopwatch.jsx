import { useEffect, useRef, useState } from "react";
import { Timer, Play, Pause, RotateCcw, Flag } from "lucide-react";

function formatTime(ms) {
  const centiseconds = Math.floor(ms / 10);
  const cs = centiseconds % 100;
  const totalSeconds = Math.floor(centiseconds / 100);
  const seconds = totalSeconds % 60;
  const minutes = Math.floor(totalSeconds / 60) % 60;
  const hours = Math.floor(totalSeconds / 3600);
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${String(cs).padStart(2, "0")}`;
}

export default function Stopwatch() {
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [laps, setLaps] = useState([]);
  const startedAt = useRef(0);
  const elapsedRef = useRef(0);
  const frame = useRef(null);

  useEffect(() => {
    if (!running) return undefined;
    const tick = () => {
      const value = elapsedRef.current + performance.now() - startedAt.current;
      setElapsed(value);
      frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame.current);
  }, [running]);

  const startPause = () => {
    if (running) {
      elapsedRef.current = elapsed;
      setRunning(false);
    } else {
      startedAt.current = performance.now();
      setRunning(true);
    }
  };

  const reset = () => {
    setRunning(false);
    elapsedRef.current = 0;
    setElapsed(0);
    setLaps([]);
  };

  const addLap = () => {
    if (!running) return;
    const previousTotal = laps[0]?.totalMs ?? 0;
    setLaps((old) => [{ id: `${Date.now()}-${old.length}`, totalMs: elapsed, splitMs: elapsed - (old[0]?.totalMs ?? 0) }, ...old]);
  };

  return (
    <section className="tool-section stopwatch-panel app-section">
      <div className="tool-heading">
        <span className="tool-icon"><Timer size={23} /></span>
        <div><h2>Stopwatch</h2><p>Track every second</p></div>
      </div>
      <div className="stopwatch-display" role="timer" aria-label="Elapsed time">{formatTime(elapsed)}</div>
      <div className="stopwatch-controls">
        <button className="primary-button" onClick={startPause} type="button">
          {running ? <Pause size={17} /> : <Play size={17} />} {running ? "Pause" : elapsed ? "Resume" : "Start"}
        </button>
        <button className="secondary-button" onClick={addLap} type="button" disabled={!running}>
          <Flag size={16} /> Lap
        </button>
        <button className="secondary-button" onClick={reset} type="button">
          <RotateCcw size={16} /> Reset
        </button>
      </div>
      <div className="laps-container">
        <div className="laps-heading"><h3>Lap history</h3><span>{laps.length} laps</span></div>
        {laps.length === 0 ? (
          <p className="empty-state">Your lap times will appear here.</p>
        ) : (
          <ol className="lap-list">
            {laps.map((lap, index) => (
              <li key={lap.id}>
                <span>Lap {laps.length - index}</span>
                <strong>{formatTime(lap.splitMs)}</strong>
                <span className="lap-total">{formatTime(lap.totalMs)}</span>
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  );
}
