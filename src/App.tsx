import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AppRouter from './router';

const App = () => {
  return (
    <>
      <AppRouter />
      <ToastContainer />
    </>
  );
};

export default App;
