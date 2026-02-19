import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import process from 'process'
import multer from 'multer'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import bcrypt from 'bcryptjs'
import supabase from './config/supabaseClient.js'
import { getRoute } from './controllers/routeController.js'
import { findRoute } from './services/routeService.js'

dotenv.config()

const app = express()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const uploadsDir = path.join(__dirname, 'uploads', 'vehicles')
const proposedUploadsDir = path.join(__dirname, 'uploads', 'proposed')
fs.mkdirSync(uploadsDir, { recursive: true })
fs.mkdirSync(proposedUploadsDir, { recursive: true })

const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => {
      cb(null, uploadsDir)
    },
    filename: (_req, file, cb) => {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
      const safeOriginalName = file.originalname.replace(/\s+/g, '-')
      cb(null, `${uniqueSuffix}-${safeOriginalName}`)
    }
  })
})

const uploadProposed = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => {
      cb(null, proposedUploadsDir)
    },
    filename: (_req, file, cb) => {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
      const safeOriginalName = file.originalname.replace(/\s+/g, '-')
      cb(null, `${uniqueSuffix}-${safeOriginalName}`)
    }
  })
})

app.use(cors())
app.use(express.json())

app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.get('/', (req, res) => {
  res.send('Sajilo Yatra Backend Running')
})

app.get('/api/route', getRoute)

// --- SY Assistant chat ---
// To use OpenAI: add OPENAI_API_KEY=sk-... to src/backend/.env and use it below (install: npm install openai).
const STATIC_ROUTE_FARES = [
  { vehicle: 'Micro Bus', from: 'Ratnapark', to: 'Baneshwor', fare: 25 },
  { vehicle: 'Tempo', from: 'Ratnapark', to: 'Baneshwor', fare: 25 },
  { vehicle: 'Mahanagar Yatayat', from: 'Ratnapark', to: 'Baneshwor', fare: 30 },
  { vehicle: 'Baba Gokarneshwor', from: 'Ratnapark', to: 'Baneshwor', fare: 25 },
  { vehicle: 'Nepal Yatayat', from: 'Ratnapark', to: 'Baneshwor', fare: 25 },
  { vehicle: 'Sanyukta Yatayat', from: 'Ratnapark', to: 'Baneshwor', fare: 25 },

  { vehicle: 'Micro Bus', from: 'Ratnapark', to: 'Tinkune', fare: 25 },
  { vehicle: 'Tempo', from: 'Ratnapark', to: 'Tinkune', fare: 25 },
  { vehicle: 'Mahanagar Yatayat', from: 'Ratnapark', to: 'Tinkune', fare: 25 },
  { vehicle: 'Baba Gokarneshwor', from: 'Ratnapark', to: 'Tinkune', fare: 25 },
  { vehicle: 'Nepal Yatayat', from: 'Ratnapark', to: 'Tinkune', fare: 25 },
  { vehicle: 'Sanyukta Yatayat', from: 'Ratnapark', to: 'Tinkune', fare: 25 },

  { vehicle: 'Micro Bus', from: 'Ratnapark', to: 'Koteshwor', fare: 30 },
  { vehicle: 'Micro Bus', from: 'Balaju', to: 'Thamel', fare: 20 },
  { vehicle: 'Micro Bus', from: 'Gongabu', to: 'Thamel', fare: 25 },
  { vehicle: 'Sajha Yatayat', from: 'Gongabu', to: 'Thamel', fare: 25 },
  { vehicle: 'Mahanagar Yatayat', from: 'Balaju', to: 'Ratnapark', fare: 25 },
  { vehicle: 'Baba Gokarneshwor', from: 'Balkhu', to: 'Kalimati', fare: 20 }
]

function normStop(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/→/g, ' to ')
    .replace(/[–—-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function extractFromTo(text) {
  const t = String(text || '')
  // from X to Y
  const m1 = t.match(/\bfrom\s+(.+?)\s+to\s+(.+?)(?:\?|\.|!|,|$)/i)
  if (m1) return { fromRaw: m1[1], toRaw: m1[2] }
  // X to Y (or X → Y)
  const t2 = t.replace(/→/g, ' to ')
  const m2 = t2.match(/\b([a-z][a-z\s]{1,40}?)\s+to\s+([a-z][a-z\s]{1,40}?)(?:\?|\.|!|,|$)/i)
  if (m2) return { fromRaw: m2[1], toRaw: m2[2] }
  return null
}

function lookupStaticRoutes(fromStop, toStop) {
  const f = normStop(fromStop)
  const t = normStop(toStop)
  return STATIC_ROUTE_FARES.filter(
    (r) => normStop(r.from) === f && normStop(r.to) === t
  )
}

function formatStaticReply(fromStop, toStop, routes) {
  const uniqueFares = Array.from(new Set(routes.map((r) => r.fare))).sort(
    (a, b) => a - b
  )
  const vehicles = Array.from(new Set(routes.map((r) => r.vehicle)))
  const fareText =
    uniqueFares.length === 1
      ? `Fare: Rs ${uniqueFares[0]}.`
      : `Fares: ${uniqueFares.map((f) => `Rs ${f}`).join(', ')}.`
  return `From ${fromStop} to ${toStop}: Vehicles: ${vehicles.join(
    ', '
  )}. ${fareText}`
}

app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body
    const text = (message && String(message).trim()) || ''
    if (!text) {
      return res.status(400).json({ reply: 'Please send a message.' })
    }

    const lower = text.toLowerCase()
    const transportKeywords = ['route', 'fare', 'bus', 'vehicle', 'stop', 'transport', 'travel', 'go', 'from', 'to', 'price', 'cost', 'how much', 'which bus', 'ratnapark', 'koteshwor', 'pulchowk', 'baneshwor']
    const isOnTopic = transportKeywords.some((k) => lower.includes(k))

    if (!isOnTopic) {
      return res.json({
        reply: "I'm SY Assistant and I only help with transportation in Nepal — routes, fares, and which vehicle to take. Try asking something like: 'How do I get from Ratnapark to Koteshwor?' or 'What's the fare to Pulchowk?'"
      })
    }

    // Fast-path for the specific hackathon MVP fare/vehicle list (fallback even if DB is empty)
    const extracted = extractFromTo(text)
    if (extracted) {
      const fromRaw = extracted.fromRaw.trim()
      const toRaw = extracted.toRaw.trim()
      const matches = lookupStaticRoutes(fromRaw, toRaw)
      if (matches.length) {
        return res.json({
          reply: formatStaticReply(fromRaw, toRaw, matches)
        })
      }
    }

    // Try to find a route from DB when user asks about "from X to Y" or "X to Y"
    const { data: stops } = await supabase.from('stops').select('id, name')
    if (stops && stops.length >= 2) {
      const sortedStops = [...stops].sort((a, b) => b.name.length - a.name.length)
      const mentioned = sortedStops.filter((s) => lower.includes(s.name.toLowerCase()))
      let fromName = null
      let toName = null
      const fromToMatch = text.match(/\bfrom\s+(.+?)\s+to\s+(.+?)(?:\?|\.|!|$)/i)
      if (fromToMatch) {
        const fromText = fromToMatch[1].trim()
        const toText = fromToMatch[2].trim()
        fromName = mentioned.find((s) => fromText.toLowerCase().includes(s.name.toLowerCase()))?.name
        toName = mentioned.find((s) => toText.toLowerCase().includes(s.name.toLowerCase()))?.name
      }
      if ((!fromName || !toName) && mentioned.length >= 2) {
        fromName = fromName || mentioned[0].name
        toName = toName || mentioned[1].name
      }
      if (fromName && toName) {
        let routes = await findRoute(fromName, toName)
        if (!routes?.length) routes = await findRoute(toName, fromName)
        if (routes && routes.length > 0) {
          const parts = routes.map((r) => `${r.vehicle} — Rs ${r.fare}`)
          const reply = `From ${routes[0].pickup} to ${routes[0].destination}: ${parts.join('; ')}.`
          return res.json({ reply })
        }
        // DB miss: try the static list using the matched stop names
        const fallback = lookupStaticRoutes(fromName, toName)
        if (fallback.length) {
          return res.json({
            reply: formatStaticReply(fromName, toName, fallback)
          })
        }
        return res.json({
          reply: `I don't have a route from ${fromName} to ${toName} in my database yet. Try the search box above, or ask about another pair of stops.`
        })
      }
    }

    return res.json({
      reply: "Use the search box above to find routes between stops. Or ask me something like: 'How much is the fare from Ratnapark to Koteshwor?' and I'll look it up if we have it."
    })
  } catch (err) {
    console.error('Chat error:', err)
    res.status(500).json({ reply: 'Service unavailable right now.' })
  }
})

app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, full_name } = req.body
    if (!email || !password || !full_name) {
      return res.status(400).json({ error: 'Email, password and full name are required' })
    }
    const password_hash = await bcrypt.hash(password, 10)
    const { data, error } = await supabase
      .from('users')
      .insert({ email: email.trim().toLowerCase(), password_hash, full_name: full_name.trim() })
      .select('id, email, full_name, reward_points')
      .single()
    if (error) {
      if (error.code === '23505') {
        return res.status(400).json({ error: 'An account with this email already exists' })
      }
      console.error('Register error:', error)
      return res.status(500).json({ error: 'Failed to create account' })
    }
    res.status(201).json({ user: data })
  } catch (err) {
    console.error('Register error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, full_name, password_hash, reward_points')
      .ilike('email', email.trim().toLowerCase())
      .limit(1)
    const row = user?.[0]
    if (error || !row) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }
    const match = await bcrypt.compare(password, row.password_hash)
    if (!match) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }
    const { password_hash: _, ...safe } = row
    res.json({ user: safe })
  } catch (err) {
    console.error('Login error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

app.get('/api/user/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { data, error } = await supabase
      .from('users')
      .select('id, email, full_name, reward_points')
      .eq('id', id)
      .single()
    if (error || !data) {
      return res.status(404).json({ error: 'User not found' })
    }
    res.json(data)
  } catch (err) {
    console.error('User fetch error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

app.get('/api/contributions', async (req, res) => {
  try {
    const user_id = req.query.user_id || req.headers['x-user-id']
    if (!user_id) {
      return res.status(400).json({ error: 'user_id required (query or X-User-Id header)' })
    }
    const { data, error } = await supabase
      .from('proposed_routes')
      .select('id, from_stop_id, to_stop_id, bus_name, image_url, remarks, status, created_at')
      .eq('user_id', user_id)
      .order('created_at', { ascending: false })
    if (error) {
      console.error('Contributions fetch error:', error)
      return res.status(500).json({ error: 'Failed to load contributions' })
    }
    res.json(data || [])
  } catch (err) {
    console.error('Contributions error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

app.post('/api/contributions', uploadProposed.single('photo'), async (req, res) => {
  try {
    const user_id = req.body.user_id || req.headers['x-user-id']
    if (!user_id) {
      return res.status(400).json({ error: 'user_id required' })
    }
    const { from_stop_id, to_stop_id, bus_name, remarks } = req.body
    if (!from_stop_id || !to_stop_id || !bus_name) {
      return res.status(400).json({ error: 'from_stop_id, to_stop_id and bus_name are required' })
    }
    let image_url = null
    if (req.file) {
      const baseUrl = `${req.protocol}://${req.get('host')}`
      image_url = `${baseUrl}/uploads/proposed/${req.file.filename}`
    }
    const { data, error } = await supabase
      .from('proposed_routes')
      .insert({
        user_id: Number(user_id),
        from_stop_id: Number(from_stop_id),
        to_stop_id: Number(to_stop_id),
        bus_name: bus_name.trim(),
        image_url,
        remarks: remarks ? String(remarks).trim() : null,
        status: 'pending'
      })
      .select('id, from_stop_id, to_stop_id, bus_name, image_url, remarks, status, created_at')
      .single()
    if (error) {
      console.error('Contribution create error:', error)
      return res.status(500).json({ error: 'Failed to submit contribution' })
    }
    res.status(201).json(data)
  } catch (err) {
    console.error('Contribution error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

app.get('/api/admin/vehicles', async (_req, res) => {
  try {
    const { data, error } = await supabase
      .from('vehicles')
      .select('id, name, image_url')
      .order('id', { ascending: true })

    if (error) {
      console.error('Error fetching vehicles:', error)
      return res.status(500).json({ error: 'Failed to fetch vehicles' })
    }

    res.json(data)
  } catch (err) {
    console.error('Unexpected error fetching vehicles:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

app.post(
  '/api/admin/vehicles',
  upload.single('image'),
  async (req, res) => {
    try {
      const { name } = req.body

      if (!name) {
        return res.status(400).json({ error: 'Vehicle name is required' })
      }

      let imageUrl = null
      if (req.file) {
        const baseUrl = `${req.protocol}://${req.get('host')}`
        imageUrl = `${baseUrl}/uploads/vehicles/${req.file.filename}`
      }

      const { data, error } = await supabase
        .from('vehicles')
        .insert({ name, image_url: imageUrl })
        .select('id, name, image_url')
        .single()

      if (error) {
        console.error('Error creating vehicle:', error)
        return res.status(500).json({ error: 'Failed to create vehicle' })
      }

      res.status(201).json(data)
    } catch (err) {
      console.error('Unexpected error creating vehicle:', err)
      res.status(500).json({ error: 'Internal server error' })
    }
  }
)

app.put(
  '/api/admin/vehicles/:id',
  upload.single('image'),
  async (req, res) => {
    try {
      const { id } = req.params
      const { name } = req.body

      if (!name && !req.file) {
        return res.status(400).json({
          error: 'Nothing to update; provide name and/or image'
        })
      }

      const updatePayload = {}
      if (name) updatePayload.name = name
      if (req.file) {
        const baseUrl = `${req.protocol}://${req.get('host')}`
        updatePayload.image_url = `${baseUrl}/uploads/vehicles/${req.file.filename}`
      }

      const { data, error } = await supabase
        .from('vehicles')
        .update(updatePayload)
        .eq('id', id)
        .select('id, name, image_url')
        .single()

      if (error) {
        console.error('Error updating vehicle:', error)
        return res.status(500).json({ error: 'Failed to update vehicle' })
      }

      if (!data) {
        return res.status(404).json({ error: 'Vehicle not found' })
      }

      res.json(data)
    } catch (err) {
      console.error('Unexpected error updating vehicle:', err)
      res.status(500).json({ error: 'Internal server error' })
    }
  }
)

app.delete('/api/admin/vehicles/:id', async (req, res) => {
  try {
    const { id } = req.params

    const { error } = await supabase
      .from('vehicles')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting vehicle:', error)
      return res.status(500).json({ error: 'Failed to delete vehicle' })
    }

    res.status(204).send()
  } catch (err) {
    console.error('Unexpected error deleting vehicle:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Stops
app.get('/api/admin/stops', async (_req, res) => {
  try {
    const { data, error } = await supabase
      .from('stops')
      .select('id, name, latitude, longitude')
      .order('id', { ascending: true })

    if (error) {
      console.error('Error fetching stops:', error)
      return res.status(500).json({ error: 'Failed to fetch stops' })
    }

    res.json(data)
  } catch (err) {
    console.error('Unexpected error fetching stops:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

app.post('/api/admin/stops', async (req, res) => {
  try {
    const { name, latitude, longitude } = req.body

    if (!name || latitude == null || longitude == null) {
      return res.status(400).json({
        error: 'Name, latitude, and longitude are required'
      })
    }

    const latNum = Number(latitude)
    const lonNum = Number(longitude)

    if (Number.isNaN(latNum) || Number.isNaN(lonNum)) {
      return res.status(400).json({
        error: 'Latitude and longitude must be valid numbers'
      })
    }

    const { data, error } = await supabase
      .from('stops')
      .insert({ name, latitude: latNum, longitude: lonNum })
      .select('id, name, latitude, longitude')
      .single()

    if (error) {
      console.error('Error creating stop:', error)
      return res.status(500).json({ error: 'Failed to create stop' })
    }

    res.status(201).json(data)
  } catch (err) {
    console.error('Unexpected error creating stop:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

app.put('/api/admin/stops/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { name, latitude, longitude } = req.body

    const updatePayload = {}
    if (name) updatePayload.name = name
    if (latitude != null) {
      const latNum = Number(latitude)
      if (Number.isNaN(latNum)) {
        return res.status(400).json({ error: 'Invalid latitude value' })
      }
      updatePayload.latitude = latNum
    }
    if (longitude != null) {
      const lonNum = Number(longitude)
      if (Number.isNaN(lonNum)) {
        return res.status(400).json({ error: 'Invalid longitude value' })
      }
      updatePayload.longitude = lonNum
    }

    if (Object.keys(updatePayload).length === 0) {
      return res.status(400).json({
        error: 'Nothing to update; provide at least one field'
      })
    }

    const { data, error } = await supabase
      .from('stops')
      .update(updatePayload)
      .eq('id', id)
      .select('id, name, latitude, longitude')
      .single()

    if (error) {
      console.error('Error updating stop:', error)
      return res.status(500).json({ error: 'Failed to update stop' })
    }

    if (!data) {
      return res.status(404).json({ error: 'Stop not found' })
    }

    res.json(data)
  } catch (err) {
    console.error('Unexpected error updating stop:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

app.delete('/api/admin/stops/:id', async (req, res) => {
  try {
    const { id } = req.params

    const { error } = await supabase
      .from('stops')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting stop:', error)
      return res.status(500).json({ error: 'Failed to delete stop' })
    }

    res.status(204).send()
  } catch (err) {
    console.error('Unexpected error deleting stop:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

app.get('/api/admin/routes', async (_req, res) => {
  try {
    const { data, error } = await supabase
      .from('routes')
      .select(`
        id,
        fare,
        vehicle_id,
        from_stop_id,
        to_stop_id,
        vehicles ( id, name ),
        from_stop:stops!routes_from_stop_id_fkey ( id, name ),
        to_stop:stops!routes_to_stop_id_fkey ( id, name )
      `)
      .order('id', { ascending: true })

    if (error) {
      console.error('Error fetching routes:', error)
      return res.status(500).json({ error: 'Failed to fetch routes' })
    }

    res.json(data)
  } catch (err) {
    console.error('Unexpected error fetching routes:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

app.post('/api/admin/routes', async (req, res) => {
  try {
    const { vehicle_id, from_stop_id, to_stop_id, fare } = req.body

    if (!vehicle_id || !from_stop_id || !to_stop_id || fare == null) {
      return res.status(400).json({
        error: 'vehicle_id, from_stop_id, to_stop_id, and fare are required'
      })
    }

    const fareNum = Number(fare)
    if (Number.isNaN(fareNum)) {
      return res.status(400).json({ error: 'Fare must be a valid number' })
    }

    const { data, error } = await supabase
      .from('routes')
      .insert({
        vehicle_id,
        from_stop_id,
        to_stop_id,
        fare: fareNum
      })
      .select('id, vehicle_id, from_stop_id, to_stop_id, fare')
      .single()

    if (error) {
      console.error('Error creating route:', error)
      return res.status(500).json({ error: 'Failed to create route' })
    }

    res.status(201).json(data)
  } catch (err) {
    console.error('Unexpected error creating route:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

app.put('/api/admin/routes/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { vehicle_id, from_stop_id, to_stop_id, fare } = req.body

    const updatePayload = {}
    if (vehicle_id) updatePayload.vehicle_id = vehicle_id
    if (from_stop_id) updatePayload.from_stop_id = from_stop_id
    if (to_stop_id) updatePayload.to_stop_id = to_stop_id
    if (fare != null) {
      const fareNum = Number(fare)
      if (Number.isNaN(fareNum)) {
        return res.status(400).json({ error: 'Fare must be a valid number' })
      }
      updatePayload.fare = fareNum
    }

    if (Object.keys(updatePayload).length === 0) {
      return res.status(400).json({
        error: 'Nothing to update; provide at least one field'
      })
    }

    const { data, error } = await supabase
      .from('routes')
      .update(updatePayload)
      .eq('id', id)
      .select('id, vehicle_id, from_stop_id, to_stop_id, fare')
      .single()

    if (error) {
      console.error('Error updating route:', error)
      return res.status(500).json({ error: 'Failed to update route' })
    }

    if (!data) {
      return res.status(404).json({ error: 'Route not found' })
    }

    res.json(data)
  } catch (err) {
    console.error('Unexpected error updating route:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

app.delete('/api/admin/routes/:id', async (req, res) => {
  try {
    const { id } = req.params

    const { error } = await supabase
      .from('routes')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting route:', error)
      return res.status(500).json({ error: 'Failed to delete route' })
    }

    res.status(204).send()
  } catch (err) {
    console.error('Unexpected error deleting route:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

app.get('/api/admin/proposed-routes', async (_req, res) => {
  try {
    const { data, error } = await supabase
      .from('proposed_routes')
      .select('id, user_id, from_stop_id, to_stop_id, bus_name, image_url, remarks, status, created_at')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching proposed routes:', error)
      return res.status(500).json({ error: 'Failed to fetch proposed routes' })
    }
    res.json(data || [])
  } catch (err) {
    console.error('Unexpected error fetching proposed routes:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

app.put('/api/admin/proposed-routes/:id/approve', async (req, res) => {
  try {
    const { id } = req.params
    const { data: prop, error: fetchErr } = await supabase
      .from('proposed_routes')
      .select('id, user_id, from_stop_id, to_stop_id, bus_name, image_url')
      .eq('id', id)
      .eq('status', 'pending')
      .single()

    if (fetchErr || !prop) {
      return res.status(404).json({ error: 'Proposed route not found or already processed' })
    }

    const imageUrl = prop.image_url || null

    const { data: vehicle, error: vehicleErr } = await supabase
      .from('vehicles')
      .insert({ name: prop.bus_name, image_url: imageUrl })
      .select('id')
      .single()

    if (vehicleErr || !vehicle) {
      console.error('Error creating vehicle:', vehicleErr)
      return res.status(500).json({ error: 'Failed to create vehicle' })
    }

    const { error: routeErr } = await supabase
      .from('routes')
      .insert({
        vehicle_id: vehicle.id,
        from_stop_id: prop.from_stop_id,
        to_stop_id: prop.to_stop_id,
        fare: 0
      })

    if (routeErr) {
      console.error('Error creating route:', routeErr)
      return res.status(500).json({ error: 'Failed to create route' })
    }

    const { error: updateErr } = await supabase
      .from('proposed_routes')
      .update({ status: 'approved' })
      .eq('id', id)

    if (updateErr) {
      return res.status(500).json({ error: 'Failed to update proposal status' })
    }

    const { data: userRow } = await supabase
      .from('users')
      .select('reward_points')
      .eq('id', prop.user_id)
      .single()

    await supabase
      .from('users')
      .update({ reward_points: (userRow?.reward_points || 0) + 1 })
      .eq('id', prop.user_id)

    res.json({ ok: true, message: 'Approved; 1 reward point added to contributor' })
  } catch (err) {
    console.error('Approve error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

app.delete('/api/admin/proposed-routes/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { error } = await supabase
      .from('proposed_routes')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting proposed route:', error)
      return res.status(500).json({ error: 'Failed to delete' })
    }
    res.status(204).send()
  } catch (err) {
    console.error('Unexpected error deleting proposed route:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

// PUBLIC – create complaint
app.post('/api/complaints', async (req, res) => {
  try {
    const { type, vehicle_number, organization, description } = req.body

    if (!type || !vehicle_number || !organization) {
      return res
        .status(400)
        .json({ error: 'type, vehicle_number and organization are required' })
    }

    const payload = {
      type: String(type).trim(),
      vehicle_number: String(vehicle_number).trim(),
      organization: String(organization).trim(),
      description: description ? String(description).trim() : null,
      status: 'pending'
    }

    const { data, error } = await supabase
      .from('complaints')
      .insert(payload)
      .select('id, type, vehicle_number, organization, description, status, created_at, updated_at')
      .single()

    if (error) {
      console.error('Create complaint error:', error)
      return res.status(500).json({ error: 'Failed to submit complaint' })
    }

    return res.status(201).json(data)
  } catch (err) {
    console.error('Create complaint error:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
})

// PUBLIC – get one complaint by ID (for viewer status check)
app.get('/api/complaints/:id', async (req, res) => {
  try {
    const id = Number(req.params.id)
    if (!id || Number.isNaN(id)) {
      return res.status(400).json({ error: 'Invalid complaint id' })
    }

    const { data, error } = await supabase
      .from('complaints')
      .select('id, type, vehicle_number, organization, description, status, created_at, updated_at')
      .eq('id', id)
      .single()

    if (error || !data) {
      return res.status(404).json({ error: 'Complaint not found' })
    }

    return res.json(data)
  } catch (err) {
    console.error('Get complaint error:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
})

// ADMIN – list all complaints
app.get('/api/admin/complaints', async (_req, res) => {
  try {
    const { data, error } = await supabase
      .from('complaints')
      .select('id, type, vehicle_number, organization, description, status, created_at, updated_at')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Admin complaints list error:', error)
      return res.status(500).json({ error: 'Failed to fetch complaints' })
    }

    return res.json(data || [])
  } catch (err) {
    console.error('Admin complaints list error:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
})

// ADMIN – change status (pending / solved / removed)
app.put('/api/admin/complaints/:id/status', async (req, res) => {
  try {
    const id = Number(req.params.id)
    const { status } = req.body
    const allowed = ['pending', 'solved', 'removed']

    if (!id || Number.isNaN(id)) {
      return res.status(400).json({ error: 'Invalid complaint id' })
    }
    if (!allowed.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' })
    }

    const { data, error } = await supabase
      .from('complaints')
      .update({
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select('id, type, vehicle_number, organization, description, status, created_at, updated_at')
      .single()

    if (error) {
      console.error('Update complaint status error:', error)
      return res.status(500).json({ error: 'Failed to update status' })
    }

    if (!data) {
      return res.status(404).json({ error: 'Complaint not found' })
    }

    return res.json(data)
  } catch (err) {
    console.error('Update complaint status error:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
})

// ADMIN – delete complaint
app.delete('/api/admin/complaints/:id', async (req, res) => {
  try {
    const id = Number(req.params.id)
    if (!id || Number.isNaN(id)) {
      return res.status(400).json({ error: 'Invalid complaint id' })
    }

    const { error } = await supabase
      .from('complaints')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Delete complaint error:', error)
      return res.status(500).json({ error: 'Failed to delete complaint' })
    }

    return res.status(204).send()
  } catch (err) {
    console.error('Delete complaint error:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
})
