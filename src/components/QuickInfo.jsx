import { Globe2, Timer, CalendarDays, BellRing, ArrowUpRight } from "lucide-react";

export default function QuickInfo({ running, alarmLabel }) {
  const date = new Intl.DateTimeFormat("en-PH", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Manila",
  }).format(new Date());

  const cards = [
    { label: "TIMEZONE", value: "Manila", detail: "UTC +08:00", Icon: Globe2 },
    { label: "CLOCK STATUS", value: running ? "Running" : "Paused", detail: running ? "Live time display" : "Display paused", Icon: Timer },
    { label: "DATE", value: date, detail: "Philippines local date", Icon: CalendarDays },
    { label: "ALARM", value: alarmLabel || "Ready", detail: "Alarm settings", Icon: BellRing },
  ];

  return (
    <section className="quick-info">
      <div className="quick-info-heading">
        <div>
          <span className="section-eyebrow">AT A GLANCE</span>
          <h2>Quick Overview</h2>
          <p>Your clock, your way.</p>
        </div>
        <span className="overview-icon">✦</span>
      </div>
      <div className="info-grid">
        {cards.map(({ label, value, detail, Icon }) => (
          <article className="info-card" key={label}>
            <div className="info-card-top">
              <span className="info-icon"><Icon size={19} /></span>
              <span className="info-label">{label}</span>
              <ArrowUpRight className="info-arrow" size={15} />
            </div>
            <h3>{value}</h3>
            <p>{detail}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
