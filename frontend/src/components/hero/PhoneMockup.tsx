import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import { BarChart3, House, Settings2, Smartphone, Wifi, BatteryFull } from 'lucide-react';
import Brand from '../Brand';
import './PhoneMockup.css';

const appliances = [
  { name: 'Air conditioner', watts: 2100 },
  { name: 'Water heater', watts: 2000 },
  { name: 'Refrigerator', watts: 160 },
  { name: 'Workstation', watts: 380 },
];

export function EnergyRing({ watts, name }: { watts: number; name: string }) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const timer = window.setTimeout(() => setReady(true), 120);
    return () => window.clearTimeout(timer);
  }, []);
  const progress = Math.min(1, watts / 4640);
  return <div className="phone-energy-ring" aria-live="polite">
    <svg viewBox="0 0 220 220" aria-hidden="true">
      <circle className="phone-ring-track" cx="110" cy="110" r="94" />
      <circle className="phone-ring-value" cx="110" cy="110" r="94" pathLength="100" strokeDasharray="100" strokeDashoffset={ready ? 100 * (1 - progress) : 100} />
    </svg>
    <div className="phone-ring-reading"><strong>{(watts / 1000).toFixed(2)}</strong><span>kW</span><p>{name}</p></div>
  </div>;
}

export function MiniUsageChart() {
  const bars = [23, 31, 26, 40, 34, 54, 67, 45, 39, 55, 81, 61];
  return <div className="phone-mini-chart" role="img" aria-label="Illustrative energy use across the day, with higher usage in the evening">
    <div className="phone-chart-bars" aria-hidden="true">{bars.map((height, index) => <span key={index} style={{ '--bar-height': `${height}%`, '--bar-delay': `${index * 25}ms` } as CSSProperties} />)}</div>
    <div className="phone-chart-times" aria-hidden="true"><span>Morning</span><span>Evening</span></div>
  </div>;
}

const navigation = [
  { name: 'Home', icon: House },
  { name: 'Analytics', icon: BarChart3 },
  { name: 'Devices', icon: Smartphone },
  { name: 'Settings', icon: Settings2 },
] as const;
type PhoneTab = typeof navigation[number]['name'];

export function PhoneNavigation({ active, onChange }: { active: PhoneTab; onChange: (tab: PhoneTab) => void }) {
  return <nav className="phone-navigation" aria-label="Dashboard preview navigation">{navigation.map(({ name, icon: Icon }) =>
    <button key={name} type="button" aria-pressed={active === name} onClick={() => onChange(name)} className={active === name ? 'is-active' : ''}><Icon size={17} strokeWidth={1.6} aria-hidden="true" /><span>{name}</span></button>
  )}</nav>;
}

export default function PhoneMockup() {
  const [selected, setSelected] = useState(0);
  const [active, setActive] = useState<PhoneTab>('Home');
  const appliance = appliances[selected];
  return <figure className="phone-composition" aria-label="Interactive PowerIQ mobile dashboard preview">
    <div className="phone-stage">
      <div className="phone-device">
        <span className="phone-side-button phone-silent" aria-hidden="true" />
        <span className="phone-side-button phone-volume-up" aria-hidden="true" />
        <span className="phone-side-button phone-volume-down" aria-hidden="true" />
        <span className="phone-side-button phone-power" aria-hidden="true" />
        <div className="phone-screen">
          <div className="phone-status-bar" aria-hidden="true"><span>9:41</span><div><Wifi size={13} /><BatteryFull size={17} /></div></div>
          <div className="phone-island" aria-hidden="true"><span /></div>
          <header className="phone-app-header"><Brand /><span className="phone-live"><i />Live</span></header>
          <div className="phone-dashboard">
            {active === 'Home' && <>
              <h2>A closer look at<br />your energy</h2>
              <EnergyRing watts={appliance.watts} name={appliance.name} />
              <label className="phone-appliance" htmlFor="phone-appliance">Explore an appliance<select id="phone-appliance" value={selected} onChange={event => setSelected(Number(event.target.value))}>{appliances.map((item, index) => <option key={item.name} value={index}>{item.name}</option>)}</select></label>
              <div className="phone-usage"><span>Today's usage</span><strong>18.4 <small>kWh</small></strong><p>↓ 12% from yesterday</p></div>
              <MiniUsageChart />
            </>}
            {active === 'Analytics' && <div className="phone-secondary-view"><h2>Your energy,<br />over time.</h2><p>A clearer view of your daily habits.</p><div className="phone-usage"><span>Today's usage</span><strong>18.4 <small>kWh</small></strong><p>↓ 12% from yesterday</p></div><MiniUsageChart /></div>}
            {active === 'Devices' && <div className="phone-secondary-view"><h2>Meet your<br />appliances.</h2><p>A little clarity in every room.</p><div className="phone-device-list">{appliances.map((item, index) => <button key={item.name} onClick={() => { setSelected(index); setActive('Home'); }}><span>{item.name}</span><strong>{(item.watts / 1000).toFixed(2)} kW</strong></button>)}</div></div>}
            {active === 'Settings' && <div className="phone-secondary-view"><h2>Your home.<br />Your preferences.</h2><p>Make your energy picture your own.</p><dl className="phone-settings-list"><div><dt>Electricity rate</dt><dd>₹8 / kWh</dd></div><div><dt>Usage alerts</dt><dd>On</dd></div><div><dt>Currency</dt><dd>INR</dd></div></dl><p className="phone-preview-note">Create an account to set up your home.</p></div>}
          </div>
          <PhoneNavigation active={active} onChange={setActive} />
          <div className="phone-home-indicator" aria-hidden="true" />
        </div>
      </div>
    </div>
    <figcaption>Interactive product preview </figcaption>
  </figure>;
}
