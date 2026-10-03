import { Link } from 'react-router-dom';

export default function Brand() {
  return <Link to="/" className="poweriq-brand" aria-label="PowerIQ home">
    <span className="poweriq-logo-frame">
      <img src={`${import.meta.env.BASE_URL}poweriq-logo-transparent.png`} alt="PowerIQ" />
    </span>
  </Link>;
}
