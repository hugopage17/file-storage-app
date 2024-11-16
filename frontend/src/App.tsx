import React from 'react';
import { fetchAuthSession, signInWithRedirect } from 'aws-amplify/auth';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { DialogsProvider } from '@toolpad/core/useDialogs';
import CurrentDirectoryDisplay from './components/CurrentDirectoryDisplay';
import appTheme from './AppTheme';
import AppContext from './AppContext';

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

    const [darkMode, toggleDarkMode] = React.useState<boolean>(false);
    const [displayView, toggleDisplayView] = React.useState<string>('tile');

    const theme = appTheme(darkMode)

    return (
        <AppContext.Provider value={{ darkMode, toggleDarkMode, displayView, toggleDisplayView }}>
            <ThemeProvider theme={theme}>
                <DialogsProvider>
                    <Router>
                        <Routes>
                            <Route path="*" element={<CurrentDirectoryDisplay />} />
                        </Routes>
                    </Router>
                </DialogsProvider>
            </ThemeProvider>
        </AppContext.Provider>
    );
}

export default App;
