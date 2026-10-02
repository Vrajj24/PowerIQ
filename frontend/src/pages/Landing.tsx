import { useState } from 'react';
import { Link } from 'react-router-dom';
import Brand from '../components/Brand';
import PhoneMockup from '../components/hero/PhoneMockup';
import './Landing.css';

const appliances = [
  { name: 'Air conditioner', watts: 2100 },
  { name: 'Water heater', watts: 2000 },
  { name: 'Refrigerator', watts: 160 },
  { name: 'Workstation', watts: 380 },
];

export default function Landing() {
  const [hours, setHours] = useState(8);
  const [watts, setWatts] = useState(2100);
  const [tariff, setTariff] = useState(8);
  const monthly = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(watts / 1000 * hours * tariff * 30);

  return (
    <div className="pi-home">
      <a className="pi-skip" href="#main">Skip to content</a>
      <header className="pi-header">
        <Brand />
        <nav className="pi-nav" aria-label="Main navigation">
          <a href="#how-it-works">How it works</a>
          <a href="#calculator">Cost calculator</a>
        </nav>
        <div className="pi-header-actions">
          <Link to="/login" className="pi-login">Log in</Link>
          <Link to="/register" className="pi-button pi-small">Get started</Link>
        </div>
      </header>

      <main id="main">
        <section className="pi-hero" id="overview">
          <div className="pi-hero-copy">
            <h1>GOOD ENERGY.<br /><span>LESS GUESSWORK.</span></h1>
            <p className="pi-description">Understand what your home uses, what it costs, and where you can save.</p>
            <Link to="/register" className="pi-button">Start with your home</Link>
          </div>
          <PhoneMockup />
        </section>

        <section className="pi-story" id="how-it-works">
          <h2>A bill tells you how much.<br /><em>See what’s behind it.</em></h2>
          <div className="pi-feature-grid">
            <article className="pi-feature"><h3>Know your appliances.</h3><p>See which rooms and devices use the most energy.</p></article>
            <article className="pi-feature"><h3>Understand the cost.</h3><p>Turn your electricity usage into rupees with your own tariff.</p></article>
            <article className="pi-feature"><h3>Make better choices.</h3><p>Follow your trends and set alerts to stay on top of your usage.</p></article>
          </div>
        </section>

        <section className="pi-calculator" id="calculator">
          <div className="pi-calc-intro"><h2>Small appliance.<br /><em>Big bill?</em></h2><p>Find out what an everyday habit costs.<br />No account needed.</p></div>
          <div className="pi-calc-panel">
            <label className="pi-field" htmlFor="calc-watts">Appliance power (watts)
              <input id="calc-watts" type="number" min="0" max="100000" value={watts} onChange={event => setWatts(Math.min(100000, Math.max(0, Number(event.target.value))))} />
            </label>
            <div className="pi-presets" aria-label="Appliance power presets">
              {appliances.map(item => <button key={item.name} onClick={() => setWatts(item.watts)} aria-pressed={watts === item.watts} className={watts === item.watts ? 'is-selected' : ''}>{item.name}</button>)}
            </div>
            <label className="pi-hours" htmlFor="calc-hours">Daily use <strong>{hours} hours</strong></label>
            <input id="calc-hours" className="pi-range" type="range" min="0" max="24" step="0.5" value={hours} onChange={event => setHours(Number(event.target.value))} />
            <label className="pi-field pi-tariff" htmlFor="calc-tariff">Electricity rate (₹/kWh)
              <input id="calc-tariff" type="number" min="0" max="1000" step="0.5" value={tariff} onChange={event => setTariff(Math.min(1000, Math.max(0, Number(event.target.value))))} />
            </label>
            <div className="pi-calc-result" aria-live="polite"><span>Estimated monthly cost</span><strong>₹{monthly}<small>/ month</small></strong></div>
            <p className="pi-calc-disclaimer">Based on 30 days at constant power. Actual usage varies; fixed charges and taxes are excluded.</p>
          </div>
        </section>

        <section className="pi-final-cta"><h2>Make yourself<br /><em>power aware.</em></h2><Link to="/register" className="pi-button">Get started with PowerIQ</Link></section>
      </main>
      <footer className="pi-footer"><Brand /><div><Link to="/login">Log in</Link><a href="#overview">Back to top</a></div></footer>
    </div>
  );
}
