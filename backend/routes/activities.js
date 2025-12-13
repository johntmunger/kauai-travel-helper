import express from 'express';
import {
  getActivityById,
  getCachedActivityDetails,
  cacheActivityDetails,
  isCacheStale,
} from '../services/database.js';
import { getPlaceDetails, searchPlace, findNearbyPlaces } from '../services/googlePlaces.js';
import { getBusinessDetails, searchBusiness } from '../services/yelpFusion.js';

const router = express.Router();

// GET /api/activities/:id - Get activity details with caching
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get basic activity info
    const activity = await getActivityById(id);
    if (!activity) {
      return res.status(404).json({
        success: false,
        error: 'Activity not found',
      });
    }

    // Check for cached details
    const cachedDetails = await getCachedActivityDetails(id);
    
    // If cache exists and is fresh, return it
    if (cachedDetails && !isCacheStale(cachedDetails.last_fetched)) {
      return res.json({
        success: true,
        data: {
          ...activity,
          details: {
            hours: cachedDetails.hours_json ? JSON.parse(cachedDetails.hours_json) : null,
            rating: cachedDetails.rating,
            review_count: cachedDetails.review_count,
            is_open: cachedDetails.is_open === 1,
            nearby_activities: cachedDetails.nearby_activities_json 
              ? JSON.parse(cachedDetails.nearby_activities_json) 
              : [],
          },
          cached: true,
        },
      });
    }

    // Cache is stale or doesn't exist, automatically fetch fresh data
    let details = null;
    let nearbyActivities = [];

    // Try Google Places first
    let placeId = activity.google_place_id;
    if (!placeId) {
      placeId = await searchPlace(activity.name, activity.address);
    }

    if (placeId) {
      const googleDetails = await getPlaceDetails(placeId);
      if (googleDetails) {
        details = googleDetails;
        
        // Get nearby places
        if (activity.latitude && activity.longitude) {
          nearbyActivities = await findNearbyPlaces(activity.latitude, activity.longitude);
        }
      }
    }

    // Fallback to Yelp if Google Places failed
    if (!details) {
      let yelpId = activity.yelp_business_id;
      if (!yelpId) {
        yelpId = await searchBusiness(activity.name, activity.address);
      }

      if (yelpId) {
        const yelpDetails = await getBusinessDetails(yelpId);
        if (yelpDetails) {
          details = yelpDetails;
        }
      }
    }

    // Cache the results if we got any
    if (details) {
      await cacheActivityDetails(id, {
        hours_json: JSON.stringify(details.hours),
        rating: details.rating,
        review_count: details.review_count,
        is_open: details.is_open ? 1 : 0,
        nearby_activities_json: JSON.stringify(nearbyActivities),
      });
    }

    // Return with fresh data
    res.json({
      success: true,
      data: {
        ...activity,
        details: details ? {
          ...details,
          nearby_activities: nearbyActivities,
        } : null,
        cached: false,
      },
    });
  } catch (error) {
    console.error('Error fetching activity:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch activity',
    });
  }
});

// GET /api/activities/:id/live-status - Force refresh from APIs
router.get('/:id/live-status', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get basic activity info
    const activity = await getActivityById(id);
    if (!activity) {
      return res.status(404).json({
        success: false,
        error: 'Activity not found',
      });
    }

    let details = null;
    let nearbyActivities = [];

    // Try Google Places first
    let placeId = activity.google_place_id;
    if (!placeId) {
      placeId = await searchPlace(activity.name, activity.address);
    }

    if (placeId) {
      const googleDetails = await getPlaceDetails(placeId);
      if (googleDetails) {
        details = googleDetails;
        
        // Get nearby places
        if (activity.latitude && activity.longitude) {
          nearbyActivities = await findNearbyPlaces(activity.latitude, activity.longitude);
        }
      }
    }

    // Fallback to Yelp if Google Places failed
    if (!details) {
      let yelpId = activity.yelp_business_id;
      if (!yelpId) {
        yelpId = await searchBusiness(activity.name, activity.address);
      }

      if (yelpId) {
        const yelpDetails = await getBusinessDetails(yelpId);
        if (yelpDetails) {
          details = yelpDetails;
        }
      }
    }

    // Cache the results
    if (details) {
      await cacheActivityDetails(id, {
        hours_json: JSON.stringify(details.hours),
        rating: details.rating,
        review_count: details.review_count,
        is_open: details.is_open ? 1 : 0,
        nearby_activities_json: JSON.stringify(nearbyActivities),
      });
    }

    res.json({
      success: true,
      data: {
        ...activity,
        details: details || null,
        nearby_activities: nearbyActivities,
        cached: false,
      },
    });
  } catch (error) {
    console.error('Error fetching live status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch live status',
    });
  }
});

export default router;

