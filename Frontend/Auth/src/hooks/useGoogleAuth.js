import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginUser } from '../store/authSlice';

const useGoogleAuth = () => {
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    // Check if Google Identity Services is loaded
    const checkGoogleLoaded = () => {
      if (window.google && window.google.accounts) {
        setIsGoogleLoaded(true);
        initializeGoogleAuth();
      } else {
        // Retry after a short delay
        setTimeout(checkGoogleLoaded, 100);
      }
    };

    checkGoogleLoaded();
  }, []);

  const initializeGoogleAuth = () => {
    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID, // We'll add this to .env
      callback: handleGoogleResponse,
      auto_select: false,
      cancel_on_tap_outside: true,
    });
  };

  const handleGoogleResponse = async (response) => {
    try {
      // Send the Google credential token to your backend using the new endpoint
      const result = await dispatch(loginUser({
        googleToken: response.credential,
        authType: 'google',
        isGoogleAuth: true // Flag to use different endpoint
      }));
      
      if (result.type === 'auth/login/fulfilled') {
        console.log('Google login successful');
      }
    } catch (error) {
      console.error('Google login error:', error);
    }
  };

  const signInWithGoogle = () => {
    if (isGoogleLoaded && window.google) {
      window.google.accounts.id.prompt();
    }
  };

  const renderGoogleButton = (elementId) => {
    if (isGoogleLoaded && window.google) {
      window.google.accounts.id.renderButton(
        document.getElementById(elementId),
        {
          theme: 'filled_black',
          size: 'large',
          type: 'standard',
          shape: 'rectangular',
          text: 'signin_with',
          logo_alignment: 'left',
        }
      );
    }
  };

  return {
    isGoogleLoaded,
    signInWithGoogle,
    renderGoogleButton,
  };
};

export default useGoogleAuth;