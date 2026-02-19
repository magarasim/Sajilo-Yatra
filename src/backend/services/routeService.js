import supabase from '../config/supabaseClient.js'

/**
 * Find all routes between two stops (may be multiple vehicles for same from/to)
 * @param {string} fromStop - Name of the starting stop
 * @param {string} toStop - Name of the destination stop
 * @returns {Array|null} Array of route objects or null if none found
 */
export async function findRoute(fromStop, toStop) {
  try {
    const { data: fromStops, error: fromError } = await supabase
      .from('stops')
      .select('id, name')
      .ilike('name', fromStop)
      .limit(1)

    const fromStopData = fromStops?.[0]
    if (fromError || !fromStopData) {
      return null
    }

    const { data: toStops, error: toError } = await supabase
      .from('stops')
      .select('id, name')
      .ilike('name', toStop)
      .limit(1)

    const toStopData = toStops?.[0]
    if (toError || !toStopData) {
      return null
    }

    const { data: routesData, error: routeError } = await supabase
      .from('routes')
      .select(`
        id,
        fare,
        vehicles (
          id,
          name,
          image_url
        )
      `)
      .eq('from_stop_id', fromStopData.id)
      .eq('to_stop_id', toStopData.id)

    if (routeError) {
      console.error('Route query error:', routeError)
      return null
    }

    const list = Array.isArray(routesData) ? routesData : routesData ? [routesData] : []
    if (list.length === 0) {
      return null
    }

    return list.map((routeData) => ({
      pickup: fromStopData.name,
      destination: toStopData.name,
      vehicle: routeData.vehicles?.name ?? 'Unknown',
      fare: routeData.fare,
      vehicle_image: routeData.vehicles?.image_url ?? null
    }))

  } catch (error) {
    console.error('Error finding route:', error)
    return null
  }
}