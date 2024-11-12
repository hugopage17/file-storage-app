import React from 'react';
import { fetchAuthSession, signInWithRedirect } from 'aws-amplify/auth';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppFrame from './components/AppFrame';

function App() {
    React.useEffect(() => {
        fetchAuthSession()
            .then((user) => {
                if (user.tokens?.idToken?.payload) {
                    console.log(user);
                } else {
                    signInWithRedirect();
                }
            })
            .catch(() => signInWithRedirect());
    }, []);

    return (
        <Router>
            <Routes>
                <Route path="*" element={<AppFrame />} />
            </Routes>
        </Router>
    );
}

export default App;
