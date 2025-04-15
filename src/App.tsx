import AuthProvider from './context/AuthProvider';
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
