import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Get all regions
export const getRegions = async () => {
  const response = await api.get("/regions");
  return response.data;
};

// Get activities for a specific region
export const getActivitiesByRegion = async (region) => {
  const response = await api.get(`/regions/${region}/activities`);
  return response.data;
};

// Get all activities (for search)
export const getAllActivities = async () => {
  const response = await api.get("/activities/all");
  return response.data;
};

// Get activity details by ID
export const getActivityById = async (id) => {
  const response = await api.get(`/activities/${id}`);
  return response.data;
};

// Get live status for an activity
export const getActivityLiveStatus = async (id) => {
  const response = await api.get(`/activities/${id}/live-status`);
  return response.data;
};

export default api;
