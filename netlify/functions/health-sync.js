const fs = require('fs')
const path = require('path')

const DATA_PATH = '/tmp/health-data.json'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
}

function readStored() {
  try {
    if (fs.existsSync(DATA_PATH)) {
      return JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'))
    }
  } catch {}
  return null
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS, body: '' }
  }

  // GET — return whatever is stored
  if (event.httpMethod === 'GET') {
    const stored = readStored()
    if (!stored) {
      return {
        statusCode: 200,
        headers: CORS,
        body: JSON.stringify({ data: null }),
      }
    }
    return {
      statusCode: 200,
      headers: CORS,
      body: JSON.stringify({ data: stored }),
    }
  }

  // POST — receive HealthKit payload and persist it
  if (event.httpMethod === 'POST') {
    let body
    try {
      body = JSON.parse(event.body || '{}')
    } catch {
      return {
        statusCode: 400,
        headers: CORS,
        body: JSON.stringify({ error: 'Invalid JSON body' }),
      }
    }

    const { steps, activeCalories, weight, sleep } = body

    const record = {
      steps: typeof steps === 'number' ? steps : null,
      activeCalories: typeof activeCalories === 'number' ? activeCalories : null,
      weight: typeof weight === 'number' ? weight : null,
      sleep: typeof sleep === 'number' ? sleep : null,
      syncedAt: new Date().toISOString(),
    }

    try {
      fs.writeFileSync(DATA_PATH, JSON.stringify(record, null, 2))
    } catch (err) {
      return {
        statusCode: 500,
        headers: CORS,
        body: JSON.stringify({ error: 'Failed to write health data', detail: err.message }),
      }
    }

    return {
      statusCode: 200,
      headers: CORS,
      body: JSON.stringify({ ok: true, data: record }),
    }
  }

  return {
    statusCode: 405,
    headers: CORS,
    body: JSON.stringify({ error: 'Method Not Allowed' }),
  }
}
