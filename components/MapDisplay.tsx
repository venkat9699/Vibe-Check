import React, { useEffect, useRef } from 'react';
import type { Coordinates, FoursquarePlace } from '../types';

interface MapDisplayProps {
  location: Coordinates;
  places: FoursquarePlace[];
  selectedPlaceId: string | null;
}

const MapDisplay: React.FC<MapDisplayProps> = ({ location, places, selectedPlaceId }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<{ [key: string]: any }>({});
  const clusterGroupRef = useRef<any>(null);

  useEffect(() => {
    if (!mapContainerRef.current || !location) return;

    if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
    }
    
    const L = (window as any).L;
    if (!L || !L.markerClusterGroup) {
      console.error("Leaflet or Leaflet MarkerCluster is not loaded");
      if (mapContainerRef.current) {
        mapContainerRef.current.innerHTML = '<div class="flex items-center justify-center h-full text-red-400">Error: Map library failed to load.</div>';
      }
      return;
    }
    
    // Define custom blue icon for user's location
    const blueIcon = new L.Icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    // Define custom red icon for nearby places
    const redIcon = new L.Icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    const map = L.map(mapContainerRef.current, { attributionControl: false }).setView([location.latitude, location.longitude], 13);
    mapInstanceRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

    const markerBounds = L.latLngBounds([]);
    
    // Use the custom blue icon for the user marker
    const userMarker = L.marker([location.latitude, location.longitude], { icon: blueIcon })
      .addTo(map)
      .bindPopup(`<b>Your Location</b>`);
    markerBounds.extend(userMarker.getLatLng());

    const markers = L.markerClusterGroup();
    clusterGroupRef.current = markers;
    markersRef.current = {};

    places.forEach(place => {
      const { latitude, longitude } = place.geocodes.main;
      // Use the custom red icon for place markers
      const placeMarker = L.marker([latitude, longitude], { icon: redIcon })
        .bindPopup(`<b>${place.name}</b>`);
      markers.addLayer(placeMarker);
      markerBounds.extend(placeMarker.getLatLng());
      markersRef.current[place.fsq_id] = placeMarker;
    });
    
    map.addLayer(markers);

    if (markerBounds.isValid()) {
        map.fitBounds(markerBounds, { padding: [50, 50] });
    }

    return () => {
      if (map) {
        map.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [location, places]);

  // Effect to handle selecting a place from the list
  useEffect(() => {
    if (selectedPlaceId && markersRef.current[selectedPlaceId] && clusterGroupRef.current) {
      const marker = markersRef.current[selectedPlaceId];
      const clusterGroup = clusterGroupRef.current;
      
      clusterGroup.zoomToShowLayer(marker, () => {
        marker.openPopup();
      });
    }
  }, [selectedPlaceId]);

  return (
    <div 
        ref={mapContainerRef} 
        className="h-64 md:h-80 w-full rounded-lg shadow-md border-2 border-base-300 z-0"
        aria-label="Map showing your current location and nearby places"
    />
  );
};

export default MapDisplay;