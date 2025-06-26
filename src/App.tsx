import { Toaster } from 'react-hot-toast';
import AuthProvider from './context/AuthProvider';
import './i18n';
import AppRouter from './router';

const App = () => {
  return (
    <AuthProvider>
      <AppRouter />
      <Toaster position='top-right' reverseOrder={false} />
    </AuthProvider>
  );
};

export default App;
