import React from 'react';
import { fetchAuthSession, signInWithRedirect } from 'aws-amplify/auth';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CurrentDirectoryDisplay from './components/CurrentDirectoryDisplay';
import AppTheme from './AppTheme';

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

    return (
        <ThemeProvider theme={AppTheme}>
            <Router>
                <Routes>
                    <Route path="*" element={<CurrentDirectoryDisplay />} />
                    <Route path="/auth/callback" element={<div>Auth Successful</div>} />
                </Routes>
            </Router>
        </ThemeProvider>
    );
}

export default App;
