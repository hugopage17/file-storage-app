import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Amplify } from 'aws-amplify';
import './index.css';
import App from './App.tsx';

Amplify.configure({
    Auth: {
        Cognito: {
            userPoolId: import.meta.env.VITE_USER_POOL_ID,
            userPoolClientId: import.meta.env.VITE_APP_CLIENT,
            identityPoolId: '',
            loginWith: {
                email: true,
                oauth: {
                    domain: import.meta.env.VITE_AUTH_DOMAIN,
                    scopes: ['openid', 'email', 'profile'],
                    redirectSignIn: [`${import.meta.env.VITE_APP_URL}/auth/callback`],
                    redirectSignOut: [`${import.meta.env.VITE_APP_URL}/signout`],
                    responseType: 'code',
                },
            },
            signUpVerificationMethod: 'code',
            userAttributes: {
                email: {
                    required: true,
                },
            },
            allowGuestAccess: false,
            passwordFormat: {
                minLength: 8,
                requireLowercase: true,
                requireUppercase: true,
                requireNumbers: true,
                requireSpecialCharacters: true,
            },
        },
    },
});

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App />
    </StrictMode>
);
