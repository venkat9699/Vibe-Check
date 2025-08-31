import React, { useState } from 'react';
import type { VibeDetails, Coordinates, FoursquarePlace } from '../types';
import MapDisplay from './MapDisplay';

interface VibeResultDisplayProps {
  vibe: VibeDetails;
  location: Coordinates;
  places: FoursquarePlace[];
}

const VibeResultDisplay: React.FC<VibeResultDisplayProps> = ({ vibe, location, places }) => {
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const scoreColorClass = vibe.score >= 7 ? 'text-brand-primary' : vibe.score >= 4 ? 'text-yellow-400' : 'text-blue-400';

  const handlePlaceClick = (placeId: string) => {
    // If the same place is clicked again, deselect it. Otherwise, select the new one.
    setSelectedPlaceId(prevId => prevId === placeId ? null : placeId);
  };

  return (
    <div className="w-full text-center bg-base-200 p-4 sm:p-6 rounded-2xl shadow-lg border border-base-300 animate-fade-in">
      {/* Vibe Details Section */}
      <div className="animate-slide-in">
        <span className="text-6xl" role="img" aria-label="vibe emoji">{vibe.emoji}</span>
        <h2 className="text-2xl font-bold text-text-primary mt-4">{vibe.description}</h2>
        <p className="text-lg text-text-secondary">Vibe Score</p>
        <div className={`text-7xl font-bold my-2 ${scoreColorClass}`}>
          {vibe.score}<span className="text-4xl text-text-secondary">/10</span>
        </div>
      </div>

      {/* Places List Section */}
      <div className="mt-6 animate-slide-in text-left" style={{ animationDelay: '50ms' }}>
        <h3 className="font-bold text-lg mb-3 text-text-primary text-center">Nearby Places:</h3>
        <div className="bg-base-100 rounded-lg p-3 max-h-36 overflow-y-auto">
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-text-secondary text-sm">
            {places.map((place) => (
              <li 
                key={place.fsq_id} 
                className={`truncate list-disc list-inside cursor-pointer hover:text-brand-light transition-colors duration-200 ${selectedPlaceId === place.fsq_id ? 'text-brand-primary font-semibold' : ''}`}
                onClick={() => handlePlaceClick(place.fsq_id)}
              >
                {place.name}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Map Section */}
      <div className="mt-6 animate-slide-in" style={{ animationDelay: '100ms' }}>
         <h3 className="font-bold text-lg mb-3 text-text-primary">Area Map:</h3>
        <MapDisplay location={location} places={places} selectedPlaceId={selectedPlaceId} />
      </div>
    </div>
  );
};

export default VibeResultDisplay;