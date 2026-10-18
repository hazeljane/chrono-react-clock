import { X, Settings2, RotateCcw } from "lucide-react";

export const defaultSettings = {
  theme: "caramel",
  timeFormat: "12",
  showHour: true,
  showMinute: true,
  showSecond: true,
  showDigital: true,
  showDate: true,
  showNumbers: true,
};

export default function SettingsPanel({ settings, onChange, onReset, onClose }) {
  const update = (key, value) => onChange((current) => ({ ...current, [key]: value }));

  return (
    <div className="settings-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <aside className="settings-panel" id="settingsPanel" aria-label="Clock settings">
        <div className="panel-header">
          <div className="panel-title-icon"><Settings2 size={20} /></div>
          <div className="panel-title"><h2>Settings</h2><p>Personalize your clock</p></div>
          <button className="icon-button close-btn" onClick={onClose} type="button" aria-label="Close settings"><X size={20} /></button>
        </div>

        <div className="setting-group">
          <label htmlFor="themeSelect">Appearance</label>
          <select id="themeSelect" value={settings.theme} onChange={(e) => update("theme", e.target.value)}>
            <option value="caramel">Caramel</option>
            <option value="dark">Dark mode</option>
            <option value="light">Light mode</option>
          </select>
        </div>

        <div className="setting-group">
          <label htmlFor="formatSelect">Time format</label>
          <select id="formatSelect" value={settings.timeFormat} onChange={(e) => update("timeFormat", e.target.value)}>
            <option value="12">12-hour (AM/PM)</option>
            <option value="24">24-hour</option>
          </select>
        </div>

        <div className="setting-group">
          <p className="group-label">Clock hands</p>
          {[
            ["showHour", "Hour hand"],
            ["showMinute", "Minute hand"],
            ["showSecond", "Second hand"],
          ].map(([key, label]) => (
            <label className="switch-row" key={key} htmlFor={key}>
              <span>{label}</span><input id={key} type="checkbox" checked={settings[key]} onChange={(e) => update(key, e.target.checked)} />
            </label>
          ))}
        </div>

        <div className="setting-group">
          {[
            ["showDigital", "Digital time"],
            ["showDate", "Date"],
            ["showNumbers", "Clock numbers"],
          ].map(([key, label]) => (
            <label className="switch-row" key={key} htmlFor={key}>
              <span>{label}</span><input id={key} type="checkbox" checked={settings[key]} onChange={(e) => update(key, e.target.checked)} />
            </label>
          ))}
        </div>

        <div className="panel-actions">
          <button className="secondary-button" type="button" onClick={onReset}><RotateCcw size={16} /> Reset defaults</button>
          <button className="primary-button" type="button" onClick={onClose}>Done</button>
        </div>
      </aside>
    </div>
  );
}
