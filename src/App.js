import React from 'react';
import './App.css';
import { BrowserRouter } from "react-router-dom";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Router from './router/router';
import store from './store/store';
import { Provider } from 'react-redux';
import './assets/fonts/Net-Avenir-Light.ttf'

const theme = createTheme({
  typography: {
    fontFamily: 'Net-Avenir-Light, sans-serif',
    fontWeight: 'bold'
  },
  palette: {
    primary: {
      main: "#FFBB00",
      light: "#D8345478",
    },
    secondary: {
      light: '#FFFFFF',
      main: '#8E8E8E',
      dark: '#262626',
    },
  },
});

export default function App() {
  // React.useEffect(() => {
  //   i18next.changeLanguage("de");
  // }, []);

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <BrowserRouter basename={process.env.REACT_APP_BASE_NAME}>
          <Router />
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  );
}