import React, { useEffect, useRef } from "react";
import useGoogleAuth from "../hooks/useGoogleAuth";

const GoogleLoginButton = ({ className = "" }) => {
  const { isGoogleLoaded, renderGoogleButton, signInWithGoogle } =
    useGoogleAuth();
  const buttonRef = useRef(null);
  const googleButtonId = "google-signin-button";

  useEffect(() => {
    if (isGoogleLoaded && buttonRef.current) {
      // Clear any existing button
      buttonRef.current.innerHTML = "";

      // Create the Google button container
      const googleButtonContainer = document.createElement("div");
      googleButtonContainer.id = googleButtonId;
      buttonRef.current.appendChild(googleButtonContainer);

      // Render the Google button
      renderGoogleButton(googleButtonId);
    }
  }, [isGoogleLoaded, renderGoogleButton]);

  // Fallback button if Google services aren't loaded
  const handleFallbackClick = () => {
    if (isGoogleLoaded) {
      signInWithGoogle();
    } else {
      console.log("Google services not loaded yet");
    }
  };

  return (
    <div className={`google-login-container ${className}`}>
      {isGoogleLoaded ? (
        <div ref={buttonRef} className="google-button-wrapper" />
      ) : (
        <button
          onClick={handleFallbackClick}
          className="btn btn-outline btn-primary w-full flex items-center gap-3"
          disabled={!isGoogleLoaded}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          {isGoogleLoaded ? "Sign in with Google" : "Loading Google..."}
        </button>
      )}
    </div>
  );
};

export default GoogleLoginButton;
