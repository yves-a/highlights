/* eslint-disable @typescript-eslint/no-unused-vars */
import { exportDataToDB } from '../../FetchScoreboardData'

export async function GET(request) {
  if (
    request.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return new Response('Unauthorized', { status: 401 })
  }
  try {
    const data = await exportDataToDB()
    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch data' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
