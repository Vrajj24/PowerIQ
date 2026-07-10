import { BrowserRouter } from 'react-router-dom';
import AppRouter from './router';
import { AuthProvider } from './context/AuthContext';
import { DeviceProvider } from './context/DeviceContext';

export default function App() {
  return (
    <AuthProvider>
      <DeviceProvider>
        <BrowserRouter>
          <AppRouter />
        </BrowserRouter>
      </DeviceProvider>
    </AuthProvider>
  );
}



