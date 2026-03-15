import { useState, useEffect } from 'react'

/*
This custom hook fetches photos from the Picsum API.

It returns:
photos  -> the list of photo objects
loading -> tells us if the request is still running
error   -> contains a message if something goes wrong

If the API request fails, we show an error message and keep
the photos array empty.
*/
export function useFetchPhotos() {
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // AbortController lets us cancel the request if the component unmounts
    const controller = new AbortController()

    async function fetchPhotos() {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(
          'https://picsum.photos/v2/list?limit=30',
          { signal: controller.signal }
        )

        // If the API returns a bad status code, treat it as an error
        if (!response.ok) {
          throw new Error(`API error: ${response.status} ${response.statusText}`)
        }

        const data = await response.json()
        setPhotos(data)

      } catch (err) {
        // Ignore abort errors (they happen when the component unmounts)
        if (err.name !== 'AbortError') {
          setError('Failed to load photos. Please check your connection and try again.')
        }

      } finally {
        setLoading(false)
      }
    }

    fetchPhotos()

    // Cancel the request if the component unmounts
    return () => controller.abort()
  }, [])

  return { photos, loading, error }
}