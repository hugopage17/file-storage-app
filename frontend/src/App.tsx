import React from 'react';
import { fetchAuthSession, signInWithRedirect } from 'aws-amplify/auth';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import AppFrame from './components/AppFrame';
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
                    <Route path="*" element={<AppFrame />} />
                </Routes>
            </Router>
        </ThemeProvider>
    );
}

export default App;
