import { Link } from 'react-router-dom';
import poweriqLogo from '../assets/poweriq-logo.jpg';

export default function Brand() {
  return <Link to="/" className="poweriq-brand" aria-label="PowerIQ home"><span className="poweriq-logo-frame"><img src={poweriqLogo} alt="PowerIQ" /></span></Link>;
}
