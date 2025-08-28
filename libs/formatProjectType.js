/**
 * Utility functions for formatting project types
 */

// Mapping from internal project type values to display labels
export const projectTypeLabels = {
  "bathroom-renovation": "Bathroom Renovation",
  "kitchen-renovation": "Kitchen Renovation",
  "electrical-rewiring": "Electrical Rewiring",
  "boiler-installation": "Boiler Installation",
  "full-home-renovation": "Full Home Renovation",
  "home-extension": "Home Extension",
  "loft-conversion": "Loft Conversion",
  "garden-work": "Garden Work",
  custom: "Custom Project",
};

/**
 * Format a project type value for display
 * @param {string} projectType - The internal project type value
 * @returns {string} The formatted display label
 */
export function formatProjectType(projectType) {
  return projectTypeLabels[projectType] || projectType;
}

/**
 * Get all available project types with their values and labels
 * @returns {Array} Array of objects with value and label properties
 */
export function getProjectTypes() {
  return Object.entries(projectTypeLabels).map(([value, label]) => ({
    value,
    label,
  }));
}

/**
 * Check if a project type value is valid
 * @param {string} projectType - The project type value to validate
 * @returns {boolean} True if valid, false otherwise
 */
export function isValidProjectType(projectType) {
  return Object.keys(projectTypeLabels).includes(projectType);
}
