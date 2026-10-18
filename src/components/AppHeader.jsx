import { Settings, Clock3 } from "lucide-react";

export default function AppHeader({ onOpenSettings }) {
  return (
    <header className="app-header">
      <div className="brand">
        <div className="brand-icon"><Clock3 size={25} /></div>
        <div>
          <h1>Chrono</h1>
          <p>Your personal clock</p>
        </div>
      </div>
      <button
        className="icon-button settings-btn"
        type="button"
        onClick={onOpenSettings}
        aria-label="Open clock settings"
      >
        <Settings size={21} />
      </button>
    </header>
  );
}
