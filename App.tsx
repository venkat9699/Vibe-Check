import React, { useState } from 'react';
import type { VibeDetails, Coordinates, FoursquarePlace } from './types';
import { calculateVibe } from './services/vibeService';
import { fetchPlaces } from './services/foursquareService';
import LoadingSpinner from './components/LoadingSpinner';
import VibeResultDisplay from './components/VibeResultDisplay';
import ErrorMessage from './components/ErrorMessage';
import HeroSection from './components/HeroSection';

type ViewState = 'home' | 'loading' | 'results' | 'error';

const App: React.FC = () => {
  const [vibeDetails, setVibeDetails] = useState<VibeDetails | null>(null);
  const [userCoords, setUserCoords] = useState<Coordinates | null>(null);
  const [places, setPlaces] = useState<FoursquarePlace[]>([]);
  const [view, setView] = useState<ViewState>('home');
  const [error, setError] = useState<string | null>(null);

  const handleCheckVibe = async () => {
    setView('loading');
    setError(null);

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      setView('error');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const coords = { latitude, longitude };
          setUserCoords(coords);

          // Fetch live data from the Foursquare API
          const fetchedPlaces = await fetchPlaces(coords);
          
          if (fetchedPlaces.length === 0) {
            setError("No places found nearby. The vibe is a mystery!");
            setView('error');
            return;
          }

          const result = calculateVibe(fetchedPlaces);
          setVibeDetails(result);
          setPlaces(fetchedPlaces);
          setView('results');
        } catch (apiError: any) {
            console.error("API Error:", apiError);
            setError(apiError.message || "Failed to fetch data from Foursquare API.");
            setView('error');
        }
      },
      (err) => {
        let message = "Could not retrieve your location.";
        if (err.code === err.PERMISSION_DENIED) {
          message = "Location permission denied. Please enable it in your browser settings to use this feature.";
        }
        setError(message);
        setView('error');
      }
    );
  };
  
  const handleTryAgain = () => {
    setView('home');
    setError(null);
  }

  const renderContent = () => {
    switch (view) {
      case 'home':
        return (
          <div className="text-center animate-fade-in">
            <button
              onClick={handleCheckVibe}
              className="px-8 py-4 bg-brand-primary text-white font-bold text-lg rounded-full hover:bg-brand-secondary focus:outline-none focus:ring-4 focus:ring-brand-primary/50 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Check My Vibe
            </button>
          </div>
        );
      case 'loading':
        return <LoadingSpinner />;
      case 'error':
        return (
            <div className="text-center animate-fade-in">
                <ErrorMessage message={error!} />
                <button
                    onClick={handleTryAgain}
                    className="mt-6 px-6 py-2 bg-base-200 text-text-primary font-semibold rounded-lg hover:bg-base-300 transition-colors"
                >
                    Try Again
                </button>
            </div>
        );
      case 'results':
        if (vibeDetails && userCoords) {
          return <VibeResultDisplay vibe={vibeDetails} location={userCoords} places={places} />;
        }
        return null; // Should not happen in 'results' state
      default:
        return null;
    }
  };

  return (
    <div className="bg-base-100 text-text-primary min-h-screen font-sans flex flex-col items-center p-4 sm:p-6 md:p-8">
      <main className="w-full max-w-3xl mx-auto flex flex-col items-center text-center">
        <HeroSection />

        <div className="w-full max-w-lg mt-8 min-h-[400px] flex items-center justify-center">
          {renderContent()}
        </div>
      </main>
      <footer className="text-center py-6 mt-auto text-text-secondary text-sm">
        <p>Vibe Check Demo</p>
      </footer>
    </div>
  );
};

export default App;
