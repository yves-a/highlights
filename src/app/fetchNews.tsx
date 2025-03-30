/* eslint-disable @typescript-eslint/no-explicit-any */
const timeAgo = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  let interval = Math.floor(seconds / 31536000)
  if (interval > 1) return `${interval} years ago`

  interval = Math.floor(seconds / 2592000)
  if (interval > 1) return `${interval} months ago`

  interval = Math.floor(seconds / 86400)
  if (interval > 1) return `${interval} days ago`

  interval = Math.floor(seconds / 3600)
  if (interval > 1) return `${interval} hours ago`

  interval = Math.floor(seconds / 60)
  if (interval > 1) return `${interval} minutes ago`

  return `${Math.floor(seconds)} seconds ago`
}
export const fetchNews = async () => {
  const response = await fetch(
    'https://site.api.espn.com/apis/site/v2/sports/basketball/nba/news'
  )
  if (!response.ok) {
    throw new Error('Failed to fetch news')
  }
  const fetchedData = await response.json()
  const articles = fetchedData.articles

  const formattedData = articles.map((article: any) => {
    return {
      title: article.headline,
      description: article.description,
      link: article.links.web.href,
      image: article.images[0].url,
      time: timeAgo(article.published),
    }
  })
  return { formattedData }
}
