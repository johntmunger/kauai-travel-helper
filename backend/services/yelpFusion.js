import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const YELP_API_KEY = process.env.YELP_API_KEY;
const YELP_API_URL = 'https://api.yelp.com/v3';

// Search for a business by name and location
export async function searchBusiness(name, address) {
  if (!YELP_API_KEY) {
    console.warn('Yelp API key not configured');
    return null;
  }

  try {
    const response = await axios.get(`${YELP_API_URL}/businesses/search`, {
      headers: {
        Authorization: `Bearer ${YELP_API_KEY}`,
      },
      params: {
        term: name,
        location: address,
        limit: 1,
      },
    });

    if (response.data.businesses && response.data.businesses.length > 0) {
      return response.data.businesses[0].id;
    }
    return null;
  } catch (error) {
    console.error('Error searching Yelp business:', error.message);
    return null;
  }
}

// Get business details
export async function getBusinessDetails(businessId) {
  if (!YELP_API_KEY) {
    console.warn('Yelp API key not configured');
    return null;
  }

  try {
    const [detailsResponse, reviewsResponse] = await Promise.all([
      axios.get(`${YELP_API_URL}/businesses/${businessId}`, {
        headers: {
          Authorization: `Bearer ${YELP_API_KEY}`,
        },
      }),
      axios.get(`${YELP_API_URL}/businesses/${businessId}/reviews`, {
        headers: {
          Authorization: `Bearer ${YELP_API_KEY}`,
        },
      }),
    ]);

    const business = detailsResponse.data;
    const reviews = reviewsResponse.data.reviews || [];

    return {
      rating: business.rating || null,
      review_count: business.review_count || 0,
      hours: business.hours?.[0]?.open || null,
      is_open: business.hours?.[0]?.is_open_now !== undefined ? business.hours[0].is_open_now : null,
      reviews: reviews.slice(0, 5).map(review => ({
        author_name: review.user.name,
        rating: review.rating,
        text: review.text,
        time_created: review.time_created,
      })),
      photos: business.photos || [],
      price: business.price || null,
      phone: business.phone || null,
    };
  } catch (error) {
    console.error('Error fetching Yelp business details:', error.message);
    return null;
  }
}

