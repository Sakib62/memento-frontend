import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import './i18n';
import AppRouter from './router';

const App = () => {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
};

export default App;
