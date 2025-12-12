import express from 'express';
import { getAllRegions, getActivitiesByRegion } from '../services/database.js';

const router = express.Router();

// GET /api/regions - Get all regions
router.get('/', async (req, res) => {
  try {
    const regions = await getAllRegions();
    res.json({
      success: true,
      data: regions,
    });
  } catch (error) {
    console.error('Error fetching regions:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch regions',
    });
  }
});

// GET /api/regions/:region/activities - Get activities for a specific region
router.get('/:region/activities', async (req, res) => {
  try {
    const { region } = req.params;
    
    // Validate region
    const validRegions = ['North', 'East', 'South', 'West'];
    if (!validRegions.includes(region)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid region. Must be North, East, South, or West',
      });
    }

    const activities = await getActivitiesByRegion(region);
    res.json({
      success: true,
      data: activities,
    });
  } catch (error) {
    console.error('Error fetching activities for region:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch activities',
    });
  }
});

export default router;

