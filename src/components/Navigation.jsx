import { Clock3, Timer, BellRing } from "lucide-react";

const items = [
  { id: "clock", label: "Clock", Icon: Clock3 },
  { id: "stopwatch", label: "Stopwatch", Icon: Timer },
  { id: "alarm", label: "Alarm", Icon: BellRing },
];

export default function Navigation({ activeSection, onChange }) {
  return (
    <nav className="app-navigation" aria-label="App sections">
      {items.map(({ id, label, Icon }) => (
        <button
          key={id}
          className={`nav-btn ${activeSection === id ? "active" : ""}`}
          type="button"
          aria-current={activeSection === id ? "page" : undefined}
          onClick={() => onChange(id)}
        >
          <Icon size={17} />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );
}
