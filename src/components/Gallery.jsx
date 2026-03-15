import { useState, useReducer, useEffect, useCallback, useMemo } from 'react'
import { useFetchPhotos } from '../hooks/useFetchPhotos'
import { favouritesReducer, STORAGE_KEY } from '../hooks/favouritesReducer.js'
import PhotoCard from './PhotoCard'

/*
  Gallery Component

  This is the main component of the app. It brings together:
  - photo fetching
  - favourites state management
  - localStorage persistence
  - searching photos by author
*/
export default function Gallery() {

  // ─ Fetch photos using custom hook 
  const { photos, loading, error } = useFetchPhotos()


  // Favourites state (managed with useReducer) 
  // We store favourite photo IDs in a Set.
  // The initializer runs only once before the first render.
  const [favourites, dispatch] = useReducer(
    favouritesReducer,
    undefined,
    () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY)
        return stored ? new Set(JSON.parse(stored)) : new Set()
      } catch {
        return new Set()
      }
    }
  )


  // Save favourites to localStorage whenever they change 
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...favourites]))
    } catch {
      // If saving fails, we simply ignore it
    }
  }, [favourites])


  // Search input state
  const [searchQuery, setSearchQuery] = useState('')


  // Keep search handler stable between renders
  const handleSearchChange = useCallback((e) => {
    setSearchQuery(e.target.value)
  }, [])


  // Toggle favourite photos
  const handleToggleFavourite = useCallback((id) => {
    dispatch({ type: 'TOGGLE_FAVOURITE', payload: id })
  }, [])


  // Filter photos by author name
  // Only recalculates when photos or searchQuery change
  const filteredPhotos = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()

    if (!q) return photos

    return photos.filter((p) =>
      p.author.toLowerCase().includes(q)
    )
  }, [photos, searchQuery])


  // Number of favourite photos
  const favouriteCount = favourites.size


  // UI Rendering
  return (
    <div className="min-h-screen bg-[#f8f7f4]">

      {/* Header */}
      <header className="sticky top-0 z-10 bg-[#f8f7f4]/90 backdrop-blur-sm border-b border-gray-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">

          <div className="flex flex-col sm:flex-row sm:items-center gap-3">

            {/* Page title */}
            <div className="flex-1">
              <h1
                className="text-2xl font-semibold tracking-tight text-gray-900"
                style={{ fontFamily: "'DM Serif Display', serif" }}
              >
                Gallery
              </h1>

              {!loading && !error && (
                <p className="text-xs text-gray-400 mt-0.5">
                  {filteredPhotos.length} photo{filteredPhotos.length !== 1 ? 's' : ''}
                  {favouriteCount > 0 &&
                    ` · ${favouriteCount} favourite${favouriteCount !== 1 ? 's' : ''}`}
                </p>
              )}
            </div>


            {/* Search box */}
            <div className="relative w-full sm:w-72">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                  />
                </svg>
              </div>

              <input
                type="text"
                placeholder="Search by author…"
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent placeholder-gray-400 transition"
              />
            </div>

          </div>
        </div>
      </header>


      {/* Main section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">


        {/* Loading state */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <div className="w-10 h-10 border-4 border-gray-200 border-t-rose-400 rounded-full animate-spin" />
            <p className="text-sm text-gray-400">Loading photos…</p>
          </div>
        )}


        {/* Error state */}
        {error && (
          <div className="flex flex-col items-center justify-center py-32 gap-3 text-center">

            <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 text-rose-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                />
              </svg>
            </div>

            <p className="text-sm font-medium text-gray-700">
              Something went wrong
            </p>

            <p className="text-xs text-gray-400 max-w-xs">
              {error}
            </p>

          </div>
        )}


        {/* No results after search */}
        {!loading && !error && filteredPhotos.length === 0 && (
          <div className="flex flex-col items-center justify-center py-32 gap-3 text-center">
            <p className="text-sm font-medium text-gray-600">
              No photos match "{searchQuery}"
            </p>
            <p className="text-xs text-gray-400">
              Try a different author name
            </p>
          </div>
        )}


        {/* Photo grid */}
        {!loading && !error && filteredPhotos.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">

            {filteredPhotos.map((photo) => (
              <PhotoCard
                key={photo.id}
                photo={photo}
                isFavourite={favourites.has(photo.id)}
                onToggle={handleToggleFavourite}
              />
            ))}

          </div>
        )}

      </main>
    </div>
  )
}