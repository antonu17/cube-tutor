import { MetadataRoute } from 'next'
import { loadAllPuzzles } from '@/src/lib/data-loader/puzzles'
import { loadAllMethods } from '@/src/lib/data-loader/methods'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cubetutor.com'
  
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${baseUrl}/puzzles`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
  ]

  try {
    // Add puzzle pages
    const puzzles = await loadAllPuzzles()
    for (const puzzle of puzzles) {
      routes.push({
        url: `${baseUrl}/puzzles/${puzzle.id}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.8,
      })

      // Add method pages
      try {
        const methods = await loadAllMethods(puzzle.id)
        for (const method of methods) {
          routes.push({
            url: `${baseUrl}/puzzles/${puzzle.id}/${method.method}`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
          })

          // Add stage pages
          if (method.stages) {
            for (const stage of method.stages) {
              routes.push({
                url: `${baseUrl}/puzzles/${puzzle.id}/${method.method}/${stage.id}`,
                lastModified: new Date(),
                changeFrequency: 'monthly',
                priority: 0.6,
              })
            }
          }
        }
      } catch (error) {
        console.error(`Error loading methods for puzzle ${puzzle.id}:`, error)
      }
    }
  } catch (error) {
    console.error('Error generating sitemap:', error)
  }

  return routes
}
