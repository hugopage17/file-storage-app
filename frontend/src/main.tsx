import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Amplify } from 'aws-amplify';
import './index.css';
import App from './App.tsx';

Amplify.configure({
    Auth: {
        Cognito: {
            userPoolId: 'ap-southeast-2_RqECyO3r4',
            userPoolClientId: '3kbd9u6a2ugum01rq2rb5dlvf3',
            identityPoolId: '',
            loginWith: {
                email: true,
                oauth: {
                    domain: 'file-storage-app.auth.ap-southeast-2.amazoncognito.com',
                    scopes: ['openid', 'email', 'profile'],
                    redirectSignIn: ['http://localhost:5173/auth/callback'],
                    redirectSignOut: ['http://localhost:5173/signin'],
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
