/* eslint-disable @typescript-eslint/no-unused-vars */
import { fetchNews } from '../../fetchNews'

export async function GET(request) {
  try {
    const data = await fetchNews()
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
