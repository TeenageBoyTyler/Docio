import { ThemeProvider } from 'styled-components';
import theme from './styles/theme';
import GlobalStyles from './styles/globalStyles';
import MainLayout from './components/layouts/MainLayout';
import { ToastProvider } from './context/ToastContext';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <ToastProvider>
        <GlobalStyles />
        <MainLayout />
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;