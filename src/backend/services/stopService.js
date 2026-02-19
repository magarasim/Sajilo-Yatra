import supabase from '../config/supabaseClient.js'

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param {number} lat1 - Latitude of first point
 * @param {number} lon1 - Longitude of first point
 * @param {number} lat2 - Latitude of second point
 * @param {number} lon2 - Longitude of second point
 * @returns {number}
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}

/**
 * Find the nearest stop to given coordinates
 * @param {number} latitude - User's latitude
 * @param {number} longitude - User's longitude
 * @returns {Object|null} Nearest stop information or null if no stops found
 */
export async function findNearestStop(latitude, longitude) {
  try {
    const { data: stops, error } = await supabase
      .from('stops')
      .select('id, name, latitude, longitude')

    if (error || !stops || stops.length === 0) {
      return null
    }

    let nearestStop = null
    let minDistance = Infinity

    for (const stop of stops) {
      const distance = calculateDistance(
        latitude,
        longitude,
        stop.latitude,
        stop.longitude
      )

      if (distance < minDistance) {
        minDistance = distance
        nearestStop = {
          ...stop,
          distance: Math.round(distance * 1000) // Convert to meters and round
        }
      }
    }

    return nearestStop

  } catch (error) {
    console.error('Error finding nearest stop:', error)
    return null
  }
}

/**
 * Find stop by name (case-insensitive partial match)
 * @param {string} stopName - Name of the stop to search for
 * @returns {Object|null} Stop information or null if not found
 */
export async function findStopByName(stopName) {
  try {
    const { data: stop, error } = await supabase
      .from('stops')
      .select('id, name, latitude, longitude')
      .ilike('name', `%${stopName}%`)
      .single()

    if (error || !stop) {
      return null
    }

    return stop

  } catch (error) {
    console.error('Error finding stop by name:', error)
    return null
  }
}