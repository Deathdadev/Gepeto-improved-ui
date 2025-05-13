// src/pages/OAuthCallbackPage.tsx
import React, { useEffect, useState, useRef } from 'react'; // Import useRef
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth'; // Corrected import path

const OAuthCallbackPage: React.FC = () => {
    const [message, setMessage] = useState<string>('Processing GitHub login...');
    const [error, setError] = useState<string | null>(null);
    const location = useLocation();
    const navigate = useNavigate();
    const { login, reAuthenticate } = useAuth(); // Get login and reAuthenticate functions from context
    const processed = useRef(false); // Ref to track if processing has occurred

    useEffect(() => {
        // Prevent processing twice due to StrictMode
        if (processed.current) {
            return;
        }
        processed.current = true;

        const processCallback = async () => {
            const searchParams = new URLSearchParams(location.search);
            const returnedStateFromUrl = searchParams.get('state');
            const code = searchParams.get('code');

            // Retrieve state *before* removing it (Note: This was using localStorage, but backend uses session. State validation happens backend now)
            // const storedState = localStorage.getItem('oauth_state'); // Keep client-side validation? Or rely solely on backend? Backend does validate.

            // Remove state regardless of success to prevent reuse
            // if (storedState) {
            //     localStorage.removeItem('oauth_state');
            // }

            // Client-side state validation is technically redundant if backend does it, but can provide quicker feedback.
            // However, the primary validation MUST happen on the backend as client-side checks can be bypassed.
            // The backend already validates state against the session value. Let's remove the client-side check for simplicity.
            // if (!returnedStateFromUrl || !storedState || storedState !== returnedStateFromUrl) {
            //     console.error('State mismatch:', { storedState, returnedState: returnedStateFromUrl });
            //     throw new Error('Invalid state parameter. Potential CSRF attack detected.');
            // }

            if (!code) {
                // setError state will be handled in the catch block below
                throw new Error('Authorization code not found in callback URL.');
            }
            if (!returnedStateFromUrl) {
                // setError state will be handled in the catch block below
                throw new Error('State parameter not found in callback URL.');
            }


            // State and code are present, exchange code with backend
            try {
                const response = await fetch('/api/auth/github/exchange-code', { // Actual backend endpoint
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    // *** Include both code and state in the body ***
                    body: JSON.stringify({ code: code, state: returnedStateFromUrl }),
                });

                const data = await response.json();

                // Expected backend response structure:
                // { success: boolean, token?: string, user?: { login: string, id: string, avatar_url: string }, message?: string }
                if (response.ok && data.success && data.user && data.token) {
                    setMessage('Login successful! Redirecting...');
                    // The User interface in AuthContext expects id, login, avatar_url which should be provided by the backend.
                    login(data.user, data.token); // Update auth state
                    navigate('/'); // Redirect on success
                } else {
                    const errorMessage = data.message || 'Failed to exchange code with backend or invalid response structure.';
                    console.error("GitHub login failed:", errorMessage, data);
                    throw new Error(errorMessage); // Let the catch block handle setting error state
                }
            } catch (fetchError: unknown) { // Catch fetch/network errors or errors from the above logic
                console.error("Error during backend code exchange:", fetchError);
                let errorMessage = 'An unknown error occurred during login.';
                if (fetchError instanceof Error) {
                    errorMessage = `Failed to communicate with the server during login: ${fetchError.message}`;
                } else if (typeof fetchError === 'string') {
                    errorMessage = `Failed to communicate with the server during login: ${fetchError}`;
                }
                // Re-throw to be caught by the outer .catch() for centralized handling
                throw new Error(errorMessage);
            }
        };

        processCallback().catch(err => {
            // Centralized error handling
            console.error("Error during OAuth callback processing:", err);
            setError(err.message || 'An unexpected error occurred during login.');
            setMessage('Login failed.');
            // Navigate away or show a more specific error message
            // Consider delaying navigation slightly to allow user to see the error message
             setTimeout(() => navigate('/?error=oauth_processing_failed'), 3000); // Example delay
        });
    }, [location.search, navigate, login]); // Dependencies remain the same

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <h1>GitHub Login Callback</h1>
            <p>{message}</p>
            {error && <p style={{ color: 'red' }}>Error: {error}</p>}
            {/* Removed button, moved to ProfileSetupWizard */}
            {/* You might want a spinner here */}
          </div>
        );
      };

export default OAuthCallbackPage;