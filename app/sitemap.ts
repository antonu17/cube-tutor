import { MetadataRoute } from 'next'
import { loadAllPuzzles } from '@/src/lib/data-loader/puzzles'
import { loadAlgorithmSetsForPuzzle } from '@/src/lib/data-loader/algorithm-sets'

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
    {
      url: `${baseUrl}/learn/algorithms`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
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

      // Add algorithm set pages
      try {
        const algorithmSets = await loadAlgorithmSetsForPuzzle(puzzle.id)
        for (const algSet of algorithmSets) {
          routes.push({
            url: `${baseUrl}/puzzles/${puzzle.id}/${algSet.id}`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
          })
        }
      } catch (error) {
        console.error(`Error loading algorithm sets for puzzle ${puzzle.id}:`, error)
      }
    }
  } catch (error) {
    console.error('Error generating sitemap:', error)
  }

  return routes
}
