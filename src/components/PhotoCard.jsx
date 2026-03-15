/*
This component displays a single photo card.

Each card shows:
- the photo itself
- the author's name
- a heart button to mark or unmark the photo as a favourite

Props:
photo -> photo object received from the Picsum API
isFavourite -> tells whether the photo is already favourited
onToggle -> function that runs when the heart button is clicked
*/

export default function PhotoCard({ photo, isFavourite, onToggle }) {
  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
      
      {/* Photo container */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={`https://picsum.photos/id/${photo.id}/400/400`}
          alt={`Photo by ${photo.author}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Heart button for toggling favourites */}
        <button
          onClick={() => onToggle(photo.id)}
          aria-label={isFavourite ? 'Remove from favourites' : 'Add to favourites'}
          className={`
            absolute top-3 right-3
            w-9 h-9 rounded-full
            flex items-center justify-center
            transition-all duration-200
            backdrop-blur-sm
            ${isFavourite
              ? 'bg-rose-500 text-white scale-110 shadow-lg'
              : 'bg-white/80 text-gray-400 hover:bg-white hover:text-rose-400 hover:scale-110'
            }
          `}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="w-4 h-4"
            fill={isFavourite ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth={isFavourite ? 0 : 2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
            />
          </svg>
        </button>
      </div>

      {/* Author information */}
      <div className="px-4 py-3">
        <p className="text-sm font-medium text-gray-800 truncate">
          {photo.author}
        </p>
        <p className="text-xs text-gray-400 mt-0.5">
          {photo.width} × {photo.height}
        </p>
      </div>
    </div>
  )
}