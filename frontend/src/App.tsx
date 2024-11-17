import React from 'react';
import { fetchAuthSession, signInWithRedirect } from 'aws-amplify/auth';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { DialogsProvider } from '@toolpad/core/useDialogs';
import CurrentDirectoryDisplay from './components/CurrentDirectoryDisplay';
import AuthCallback from './components/auth/Callback';
import appTheme from './AppTheme';
import AppContext from './AppContext';
import AppLayout from './components/AppLayout';

function App() {
    React.useEffect(() => {
        fetchAuthSession()
            .then((user) => {
                if (!user.tokens?.idToken?.payload) {
                    signInWithRedirect();
                }
            })
            .catch(() => signInWithRedirect());
    }, []);

    let themeInitState = false;

    if (localStorage.getItem('dark_mode')) {
        themeInitState = JSON.parse(localStorage.getItem('dark_mode')!);
    }

    const [darkMode, toggleDarkMode] = React.useState<boolean>(themeInitState);
    const [displayView, toggleDisplayView] = React.useState<string>(localStorage.getItem('view_mode') ?? 'tile');

    const theme = appTheme(darkMode);

    return (
        <AppContext.Provider value={{ darkMode, toggleDarkMode, displayView, toggleDisplayView }}>
            <ThemeProvider theme={theme}>
                <DialogsProvider>
                    <Router>
                        <Routes>
                            <Route path="/" element={<Navigate to="/storage" replace />} />
                            <Route path="/storage" element={<AppLayout />}>
                                <Route index element={<CurrentDirectoryDisplay />} />
                                <Route path="*" element={<CurrentDirectoryDisplay />} />
                            </Route>
                            <Route path="/auth/callback" element={<AuthCallback />} />
                            <Route path="/signout" element={<></>} />
                        </Routes>
                    </Router>
                </DialogsProvider>
            </ThemeProvider>
        </AppContext.Provider>
    );
}

export default App;
