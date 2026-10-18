
import { X, Settings2, RotateCcw } from "lucide-react";
import CustomDropdown from "./CustomDropdown.jsx";

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

const themeOptions = [
  {
    value: "caramel",
    label: "Caramel",
    description: "Warm and elegant",
    color: "#D6A56C",
  },
  {
    value: "dark",
    label: "Dark mode",
    description: "Clean and minimal",
    color: "#818CF8",
  },
  {
    value: "light",
    label: "Light mode",
    description: "Bright and simple",
    color: "#FBBF24",
  },
];

const timeFormatOptions = [
  {
    value: "12",
    label: "12-hour format",
    description: "Example: 10:30:45 PM",
    color: "#D6A56C",
  },
  {
    value: "24",
    label: "24-hour format",
    description: "Example: 22:30:45",
    color: "#60A5FA",
  },
];

export default function SettingsPanel({
  settings,
  onChange,
  onReset,
  onClose,
}) {
  const update = (key, value) => {
    onChange((current) => ({
      ...current,
      [key]: value,
    }));
  };

  return (
    <div
      className="settings-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <aside
        className="settings-panel"
        id="settingsPanel"
        aria-label="Clock settings"
      >
        <div className="panel-header">
          <div className="panel-title-icon">
            <Settings2 size={20} />
          </div>

          <div className="panel-title">
            <h2>Settings</h2>
            <p>Personalize your clock</p>
          </div>

          <button
            className="icon-button close-btn"
            onClick={onClose}
            type="button"
            aria-label="Close settings"
          >
            <X size={20} />
          </button>
        </div>

        {/* Appearance dropdown */}
        <div className="setting-group">
          <CustomDropdown
            label="Appearance"
            value={settings.theme}
            options={themeOptions}
            onChange={(value) => update("theme", value)}
          />
        </div>

        {/* Time format dropdown */}
        <div className="setting-group">
          <CustomDropdown
            label="Time format"
            value={settings.timeFormat}
            options={timeFormatOptions}
            onChange={(value) => update("timeFormat", value)}
          />
        </div>

        {/* Clock hands */}
        <div className="setting-group">
          <p className="group-label">Clock hands</p>

          {[
            ["showHour", "Hour hand"],
            ["showMinute", "Minute hand"],
            ["showSecond", "Second hand"],
          ].map(([key, label]) => (
            <label
              className="switch-row"
              key={key}
              htmlFor={key}
            >
              <span>{label}</span>

              <input
                id={key}
                type="checkbox"
                checked={settings[key]}
                onChange={(event) =>
                  update(key, event.target.checked)
                }
              />
            </label>
          ))}
        </div>

        {/* Other clock options */}
        <div className="setting-group">
          {[
            ["showDigital", "Digital time"],
            ["showDate", "Date"],
            ["showNumbers", "Clock numbers"],
          ].map(([key, label]) => (
            <label
              className="switch-row"
              key={key}
              htmlFor={key}
            >
              <span>{label}</span>

              <input
                id={key}
                type="checkbox"
                checked={settings[key]}
                onChange={(event) =>
                  update(key, event.target.checked)
                }
              />
            </label>
          ))}
        </div>

        {/* Panel actions */}
        <div className="panel-actions">
          <button
            className="secondary-button"
            type="button"
            onClick={onReset}
          >
            <RotateCcw size={16} />
            Reset defaults
          </button>

          <button
            className="primary-button"
            type="button"
            onClick={onClose}
          >
            Done
          </button>
        </div>
      </aside>
    </div>
  );
}
