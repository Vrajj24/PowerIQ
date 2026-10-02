import { Link } from 'react-router-dom';
export default function TelemetryEmpty({ hasDevices = false }: { hasDevices?: boolean }) {
  return <div className="flex h-full min-h-32 flex-col items-center justify-center gap-2 text-center text-sm text-muted">
    <p>{hasDevices ? 'Waiting for your first simulated reading.' : 'No energy data yet.'}</p>
    {hasDevices ? <p className="text-xs">Readings appear as your devices are monitored.</p> : <Link to="/devices" className="text-ink underline underline-offset-4">Add your first appliance</Link>}
  </div>;
}
