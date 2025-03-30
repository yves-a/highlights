import { neon } from '@neondatabase/serverless'
const getYouTubeSearchLink = (team1: string, team2: string, date: string) => {
  const query = encodeURIComponent(
    `${team1} at ${team2} | FULL GAME HIGHLIGHTS | ${date}`
  )
  return query
}

const fetchYouTubeLink = async (query: string) => {
  const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY
  console.log(apiKey)
  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${query}&key=${apiKey}`
  )
  const result = await response.json()
  const videoId = result.items[0]?.id?.videoId
  const videoUrl = `https://www.youtube.com/watch?v=${videoId}`
  console.log(videoUrl)
  return videoUrl
}
export const fetchData = async () => {
  const sql = neon(process.env.NEXT_PUBLIC_DATABASE_URL)
  // Will have to check the night before because every night at 1 am the data will be fetched
  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  try {
    const checkData = await sql`
            SELECT * FROM games WHERE game_date = ${today};
            `
    if (checkData.length > 0) {
      console.log('Data already exists for today')
      return
    }
    console.log(checkData)
  } catch (error) {}
  const response = await fetch(
    'http://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard'
  )
  if (!response.ok) {
    throw new Error('Network response was not ok')
  }
  const result = await response.json()
  const finalEvents = result.events.filter(
    (event: any) => event.status.type.name === 'STATUS_FINAL'
  )
  /*
   * home team logo = event.competitions[0].competitors[0].team.logo
   * home team name = event.competitions[0].competitors[0].team.displayName
   * home team score = event.competitions[0].competitors[0].score
   * away team logo = event.competitions[0].competitors[1].team.logo
   * away team name = event.competitions[0].competitors[1].team.displayName
   * away team score = event.competitions[0].competitors[1].score
   * date = event.date
   */

  // Go through each of the finalEvents and extract all the info from above and store it in an array of objects
  // Then use the getYouTubeSearchLink function to get the query for the YouTube search
  // Then use the fetchYouTubeLink function to get the YouTube link
  const youtubeLinks = await Promise.all(
    finalEvents.map(async (event: any) => {
      const searchUrl = getYouTubeSearchLink(
        event.competitions[0].competitors[0].team.name,
        event.competitions[0].competitors[1].team.name,
        new Date(event.date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      )
      return await fetchYouTubeLink(searchUrl)
    })
  )

  const formattedData = finalEvents.map((event: any, index: number) => {
    return {
      home_logo: event.competitions[0].competitors[0].team.logo,
      home_team: event.competitions[0].competitors[0].team.displayName,
      home_score: event.competitions[0].competitors[0].score,
      away_logo: event.competitions[0].competitors[1].team.logo,
      away_team: event.competitions[0].competitors[1].team.displayName,
      away_score: event.competitions[0].competitors[1].score,
      game_date: new Date(event.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      highlight_link: youtubeLinks[index],
    }
  })

  return { formattedData }
}

export async function exportDataToDB() {
  const sql = neon(process.env.NEXT_PUBLIC_DATABASE_URL)

  // First check if the table has any data with today's date
  // If it does, then return
  // If it doesn't, then fetch the data and insert it into the table

  const data = await fetchData()
  console.log('data')
  if (!data) {
    return
  }
  const formattedData = data.formattedData

  await sql`
    CREATE TABLE IF NOT EXISTS games (
        id SERIAL PRIMARY KEY,
        home_logo VARCHAR(255) NOT NULL,
        home_team VARCHAR(255) NOT NULL,
        home_score INT NOT NULL,
        away_logo VARCHAR(255) NOT NULL,
        away_team VARCHAR(255) NOT NULL,
        away_score INT NOT NULL,
        game_date DATE NOT NULL,
        highlight_link VARCHAR(255) NOT NULL
    );
    `

  for (const game of formattedData) {
    await sql`
    INSERT INTO games (
      home_team, 
      away_team, 
      home_logo, 
      away_logo, 
      home_score, 
      away_score, 
      highlight_link, 
      game_date
    ) VALUES (
      ${game.home_team}, 
      ${game.away_team}, 
      ${game.home_logo}, 
      ${game.away_logo}, 
      ${game.home_score}, 
      ${game.away_score}, 
      ${game.highlight_link}, 
      ${game.game_date}
    )
  `
  }
}

export async function fetchDataFromDB() {
  const sql = neon(process.env.NEXT_PUBLIC_DATABASE_URL)

  const data = await sql`SELECT * FROM games;`
  console.log(data)
  return data
}
