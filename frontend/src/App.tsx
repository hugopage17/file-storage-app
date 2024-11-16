import React from 'react';
import { fetchAuthSession, signInWithRedirect } from 'aws-amplify/auth';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { DialogsProvider } from '@toolpad/core/useDialogs';
import CurrentDirectoryDisplay from './components/CurrentDirectoryDisplay';
import appTheme from './AppTheme';

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

    const theme = appTheme(true)

    return (
        <ThemeProvider theme={theme}>
            <DialogsProvider>
                <Router>
                    <Routes>
                        <Route path="*" element={<CurrentDirectoryDisplay />} />
                    </Routes>
                </Router>
            </DialogsProvider>
        </ThemeProvider>
    );
}

export default App;
