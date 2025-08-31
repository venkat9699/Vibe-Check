import type { FoursquarePlace, Coordinates, FoursquareApiResult } from '../types';

// This helper function maps a single result from the Foursquare API 
// to the internal FoursquarePlace format used by the application.
const mapApiResultToPlace = (apiResult: FoursquareApiResult): FoursquarePlace => {
    return {
        fsq_id: apiResult.fsq_place_id,
        name: apiResult.name,
        categories: apiResult.categories.map(cat => ({ name: cat.name })),
        location: {
            address: apiResult.location.address || apiResult.location.formatted_address,
            locality: apiResult.location.locality || 'Unknown',
        },
        geocodes: {
            main: {
                latitude: apiResult.latitude,
                longitude: apiResult.longitude,
            },
        },
    };
};

/**
 * Fetches nearby places from the Foursquare API based on user coordinates.
 * @param coords - The user's latitude and longitude.
 * @returns A promise that resolves with an array of FoursquarePlace objects.
 */
export const fetchPlaces = async (
  coords: Coordinates
): Promise<FoursquarePlace[]> => {
  const PROXY_URL = 'https://thingproxy.freeboard.io/fetch/';
  const FOURSQUARE_API_URL = 'https://places-api.foursquare.com/places/search';

  const params = new URLSearchParams({
    ll: `${coords.latitude},${coords.longitude}`,
    radius: '3000', // search within a 3km radius
    limit: '10',   // limit to 10 results for a clean map
  });

  const targetUrl = `${FOURSQUARE_API_URL}?${params.toString()}`;

  const headers = {
    "accept": "application/json",
    "X-Places-Api-Version": "2025-06-17",
    "authorization": "Bearer FLJIEKCKNWJFVNZ1CKD5SXU2SYOMKXYGRVYTPUHNGF23JPKF"
  };

  try {
    const response = await fetch(`${PROXY_URL}${targetUrl}`, { headers });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        `Foursquare API error: ${response.status} ${response.statusText}. ${errorData?.message || ''}`
      );
    }

    const data: { results: FoursquareApiResult[] } = await response.json();

    if (!data.results || data.results.length === 0) {
        return [];
    }

    // Filter and map the results to our internal format
    const places = data.results
      .filter(place => place && place.name && place.categories && place.categories.length > 0)
      .map(mapApiResultToPlace);

    return places;

  } catch (error) {
    console.error("Failed to fetch from Foursquare API:", error);
    throw new Error("Could not connect to the Foursquare service. Please check your network connection and try again.");
  }
};
