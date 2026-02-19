import { findRoute } from '../services/routeService.js'
import { findNearestStop, findStopByName } from '../services/stopService.js'

/**
 * Handle route lookup API endpoint
 * GET /api/route?from=<stop>&to=<stop>&lat=<lat>&lng=<lng>
 */
export async function getRoute(req, res) {
  try {
    const { from, to, lat, lng } = req.query

    if (!from || !to) {
      return res.status(400).json({
        error: 'Missing required parameters: from and to are required'
      })
    }

    let fromStop = from
    let toStop = to
    let nearestFromStop = null

    if (lat && lng) {
      const userLat = parseFloat(lat)
      const userLng = parseFloat(lng)

      if (isNaN(userLat) || isNaN(userLng)) {
        return res.status(400).json({
          error: 'Invalid latitude or longitude values'
        })
      }

      nearestFromStop = await findNearestStop(userLat, userLng)

      if (nearestFromStop) {
        fromStop = nearestFromStop.name
      }
    }

    const routes = await findRoute(fromStop, toStop)

    if (!routes || routes.length === 0) {
      const fromStopInfo = await findStopByName(from)
      const toStopInfo = await findStopByName(to)

      let errorMessage = 'Route not found'

      if (!fromStopInfo && !toStopInfo) {
        errorMessage = `Stops "${from}" and "${to}" not found`
      } else if (!fromStopInfo) {
        errorMessage = `Starting stop "${from}" not found`
      } else if (!toStopInfo) {
        errorMessage = `Destination stop "${to}" not found`
      } else {
        errorMessage = `No route available from ${fromStopInfo.name} to ${toStopInfo.name}`
      }

      return res.status(404).json({
        error: errorMessage,
        available_stops: ['Ratnapark', 'Pulchowk', 'Koteshwor', 'Baneshwor']
      })
    }

    const nearestStopPayload = nearestFromStop
      ? {
          id: nearestFromStop.id,
          name: nearestFromStop.name,
          distance_m: nearestFromStop.distance
        }
      : null

    const routesPayload = routes.map((route) => ({
      ...route,
      from_input: from,
      to_input: to,
      pickup_resolved: fromStop,
      destination_resolved: toStop,
      nearest_pickup_stop: nearestStopPayload
    }))

    res.json({ routes: routesPayload })

  } catch (error) {
    console.error('Error in route controller:', error)
    res.status(500).json({
      error: 'Internal server error'
    })
  }
}