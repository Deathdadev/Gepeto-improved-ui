// src/components/SignInWithGitHubButton.tsx
import React from 'react';
import { Button } from '@/components/ui/button';

// Function to generate a random string for the state parameter (CSRF protection)
const generateRandomString = (length: number): string => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};

const SignInWithGitHubButton: React.FC = () => {
    const handleGitHubLogin = () => {
        const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
        const redirectUri = 'http://localhost:5173/auth/github/callback/'; // Ensure this matches the callback URL registered on GitHub AND the route for your callback component
        const scope = 'read:user user:email'; // Request basic user info and email
        const state = generateRandomString(16); // Generate random state

        if (!clientId) {
            console.error("VITE_GITHUB_CLIENT_ID is not defined in your .env file.");
            // Optionally, disable the button or show an error message to the user
            return;
        }

        // Store the state in localStorage to verify it on callback
        localStorage.setItem('oauth_state', state);

        // Construct the GitHub authorization URL
        const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&state=${state}&response_type=code`;

        // Redirect the user's browser to GitHub
        window.location.href = authUrl;
    };

    return (
        <Button onClick={handleGitHubLogin} variant="outline">
            {/* You can add a GitHub icon here */}
            Sign in with GitHub
        </Button>
    );
};

export default SignInWithGitHubButton;