import { useEffect, useState } from "react";
import AppHeader from "./components/AppHeader.jsx";
import Navigation from "./components/Navigation.jsx";
import AnalogClock from "./components/AnalogClock.jsx";
import QuickInfo from "./components/QuickInfo.jsx";
import Stopwatch from "./components/Stopwatch.jsx";
import Alarm from "./components/Alarm.jsx";
import SettingsPanel, { defaultSettings } from "./components/SettingsPanel.jsx";
import { Heart, Play, Pause } from "lucide-react";
import CustomDropdown from "./components/CustomDropdown.jsx";
const themes = [
  {
    value: "caramel",
    label: "Caramel",
    description: "Warm and elegant",
    color: "#D6A56C",
  },
  {
    value: "ocean",
    label: "Ocean",
    description: "Cool and refreshing",
    color: "#60A5FA",
  },
  {
    value: "violet",
    label: "Midnight Violet",
    description: "Bold and modern",
    color: "#D6A56C",
  },
  {
    value: "emerald",
    label: "Emerald",
    description: "Fresh and balanced",
    color: "#34D399",
  },
];
function readSettings() {
  try {
    const saved = localStorage.getItem("chrono-settings");
    return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
  } catch {
    return defaultSettings;
  }
}

export default function App() {
  const [activeSection, setActiveSection] = useState("clock");
  const [settings, setSettings] = useState(readSettings);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [clockRunning, setClockRunning] = useState(true);
  const [alarmLabel, setAlarmLabel] = useState("Ready");

 useEffect(() => {
  localStorage.setItem("chrono-settings", JSON.stringify(settings));
  document.documentElement.dataset.theme = settings.theme;
}, [settings]);

  const resetSettings = () => setSettings({ ...defaultSettings });

  return (
    <main className="app-shell">
      <div className="app">
        <AppHeader onOpenSettings={() => setSettingsOpen(true)} />
        <Navigation activeSection={activeSection} onChange={setActiveSection} />

        <div className="section-switcher">
          {activeSection === "clock" && (
            <>
              <AnalogClock settings={settings} running={clockRunning} />
              <div className="clock-actions">
                <button className="secondary-button" type="button" onClick={() => setClockRunning((value) => !value)}>
                  {clockRunning ? <Pause size={16} /> : <Play size={16} />}
                  {clockRunning ? "Pause clock display" : "Resume clock display"}
                </button>
              </div>
              <QuickInfo running={clockRunning} alarmLabel={alarmLabel} />
            </>
          )}
          {activeSection === "stopwatch" && <Stopwatch />}
          {activeSection === "alarm" && (
  <Alarm
    settings={settings}
    onAlarmLabelChange={setAlarmLabel}
  />
)}
        </div>

        <footer className="app-footer">Made for your time <Heart size={14} fill="currentColor" /></footer>
      </div>

      {settingsOpen && (
        <SettingsPanel
          settings={settings}
          onChange={setSettings}
          onReset={resetSettings}
          onClose={() => setSettingsOpen(false)}
        />
      )}
    </main>
  );
}
