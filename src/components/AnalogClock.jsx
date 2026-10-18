import { useEffect, useState } from "react";

function getManilaTime() {
  return new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Manila" }));
}

export default function AnalogClock({ settings, running }) {
  const [now, setNow] = useState(() => getManilaTime());

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => setNow(getManilaTime()), 250);
    return () => window.clearInterval(id);
  }, [running]);

  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  const milliseconds = now.getMilliseconds();
  const hourAngle = ((hours % 12) + minutes / 60) * 30;
  const minuteAngle = (minutes + seconds / 60) * 6;
  const secondAngle = (seconds + milliseconds / 1000) * 6;

  const digitalTime = new Intl.DateTimeFormat("en-PH", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: settings.timeFormat === "12",
    timeZone: "Asia/Manila",
  }).format(new Date());

  const date = new Intl.DateTimeFormat("en-PH", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Manila",
  }).format(new Date());

  return (
    <section className="clock-section app-section">
      <p className="eyebrow">CURRENT TIME</p>
      <div className="clock" role="img" aria-label={`Analog clock, ${digitalTime}`}>
        <div className="clock-ticks" aria-hidden="true">
          {Array.from({ length: 60 }, (_, i) => (
            <span key={i} className={i % 5 === 0 ? "major-tick" : ""} style={{ "--i": i }} />
          ))}
        </div>

        {settings.showNumbers && (
          <div className="clock-numbers" aria-hidden="true">
            {Array.from({ length: 12 }, (_, i) => {
              const number = i + 1;
              return <span key={number} style={{ "--i": number }}><b>{number}</b></span>;
            })}
          </div>
        )}

        {settings.showHour && <div className="hand hour-hand" style={{ transform: `translateX(-50%) rotate(${hourAngle}deg)` }} />}
        {settings.showMinute && <div className="hand minute-hand" style={{ transform: `translateX(-50%) rotate(${minuteAngle}deg)` }} />}
        {settings.showSecond && <div className="hand second-hand" style={{ transform: `translateX(-50%) rotate(${secondAngle}deg)` }} />}
        <div className="center-dot" />
      </div>

      {settings.showDigital && <div className="digital-time">{digitalTime}</div>}
      {settings.showDate && <p className="date">{date}</p>}
      <p className="timezone"><span className="live-dot" /> Philippines Standard Time · UTC+08:00</p>
      <p className={`clock-state ${running ? "" : "paused"}`} role="status">
        {running ? "Clock is running" : "Clock display paused"}
      </p>
    </section>
  );
}
