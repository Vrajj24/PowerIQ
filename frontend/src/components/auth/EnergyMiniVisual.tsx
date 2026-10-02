export default function EnergyMiniVisual({ mode }: { mode: 'login' | 'register' }) {
  const isLogin = mode === 'login';
  return <figure className="auth-energy-visual">
    <figcaption>{isLogin ? 'LIVE ENERGY' : "TODAY'S USAGE"}</figcaption>
    <div className="auth-energy-reading"><strong>{isLogin ? '2.10' : '18.4'}</strong><span>{isLogin ? 'kW' : 'kWh'}</span></div>
    <p>{isLogin ? 'Air conditioner' : '↓ 12% from yesterday'}</p>
    <svg viewBox="0 0 260 64" aria-hidden="true">
      <path className="auth-energy-baseline" d="M0 61 H260" />
      {isLogin ? <path className="auth-energy-line" d="M1 46 L24 46 L42 35 L65 40 L87 21 L109 29 L129 15 L153 23 L175 10 L196 17 L219 31 L241 24 L259 29" /> : [18, 25, 18, 36, 44, 56, 36, 25].map((height, index) => <rect key={index} x={index * 33} y={61 - height} width="20" height={height} rx="1" className={index === 5 ? 'is-peak' : ''} />)}
    </svg>
    <span className="auth-energy-example">Example energy data</span>
  </figure>;
}
