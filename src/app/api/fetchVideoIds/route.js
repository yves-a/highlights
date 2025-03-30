/* eslint-disable @typescript-eslint/no-unused-vars */
import { getVideoIds } from '../../FetchScoreboardData'

export async function GET(request) {
  try {
    const data = await getVideoIds()
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
