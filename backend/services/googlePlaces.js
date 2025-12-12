import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const PLACE_DETAILS_URL = 'https://maps.googleapis.com/maps/api/place/details/json';
const PLACE_SEARCH_URL = 'https://maps.googleapis.com/maps/api/place/textsearch/json';

// Search for a place by name and address
export async function searchPlace(name, address) {
  if (!GOOGLE_PLACES_API_KEY) {
    console.warn('Google Places API key not configured');
    return null;
  }

  try {
    const query = `${name} ${address}`;
    const response = await axios.get(PLACE_SEARCH_URL, {
      params: {
        query,
        key: GOOGLE_PLACES_API_KEY,
      },
    });

    if (response.data.results && response.data.results.length > 0) {
      return response.data.results[0].place_id;
    }
    return null;
  } catch (error) {
    console.error('Error searching for place:', error.message);
    return null;
  }
}

// Get place details including hours, rating, reviews
export async function getPlaceDetails(placeId) {
  if (!GOOGLE_PLACES_API_KEY) {
    console.warn('Google Places API key not configured');
    return null;
  }

  try {
    const response = await axios.get(PLACE_DETAILS_URL, {
      params: {
        place_id: placeId,
        fields: 'name,rating,user_ratings_total,opening_hours,reviews,photos,formatted_address',
        key: GOOGLE_PLACES_API_KEY,
      },
    });

    if (response.data.result) {
      const result = response.data.result;
      return {
        rating: result.rating || null,
        review_count: result.user_ratings_total || 0,
        hours: result.opening_hours?.weekday_text || null,
        is_open: result.opening_hours?.open_now !== undefined ? result.opening_hours.open_now : null,
        reviews: result.reviews?.slice(0, 5) || [],
        photos: result.photos?.slice(0, 5).map(photo => ({
          reference: photo.photo_reference,
          url: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${photo.photo_reference}&key=${GOOGLE_PLACES_API_KEY}`,
        })) || [],
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching place details:', error.message);
    return null;
  }
}

// Find nearby places
export async function findNearbyPlaces(latitude, longitude, radius = 5000) {
  if (!GOOGLE_PLACES_API_KEY) {
    console.warn('Google Places API key not configured');
    return [];
  }

  try {
    const response = await axios.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json', {
      params: {
        location: `${latitude},${longitude}`,
        radius,
        type: 'tourist_attraction|restaurant|point_of_interest',
        key: GOOGLE_PLACES_API_KEY,
      },
    });

    if (response.data.results) {
      return response.data.results.slice(0, 5).map(place => ({
        name: place.name,
        address: place.vicinity,
        rating: place.rating,
        place_id: place.place_id,
      }));
    }
    return [];
  } catch (error) {
    console.error('Error finding nearby places:', error.message);
    return [];
  }
}

