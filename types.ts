export interface VibeDetails {
  score: number;
  description: string;
  emoji: string;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

// Represents the data structure of a single item from the live Foursquare API response
export interface FoursquareApiResult {
  fsq_place_id: string;
  name: string;
  categories: {
    fsq_category_id: string;
    name: string;
    short_name: string;
    plural_name: string;
    icon: {
      prefix: string;
      suffix: string;
    };
  }[];
  location: {
    address?: string;
    locality?: string;
    // FIX: Added missing properties to the location object to match the API response data.
    region?: string;
    postcode?: string;
    country?: string;
    formatted_address: string;
  };
  latitude: number;
  longitude: number;
}

// Represents the internal data structure used by the application components
export interface FoursquarePlace {
  fsq_id: string;
  name: string;
  categories: {
    name: string;
  }[];
  location: {
    address: string;
    locality: string;
  };
  geocodes: {
    main: {
      latitude: number;
      longitude: number;
    };
  };
}
