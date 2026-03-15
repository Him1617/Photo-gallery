/*
This reducer keeps track of the photo IDs that the user has marked as favourites.

The state is a Set of photo ID strings.

Supported actions:

TOGGLE_FAVOURITE
If the ID already exists in the Set, it will be removed.
If it does not exist, it will be added.

INIT
Replaces the entire favourites state. This is useful when loading
saved favourites from localStorage when the app first starts.

We use useReducer instead of useState because the state has clear
actions like toggling and initialization. Keeping that logic inside
a reducer makes the code cleaner and easier to extend later.
*/

export function favouritesReducer(state, action) {
  switch (action.type) {
    case "TOGGLE_FAVOURITE": {
      const next = new Set(state)

      if (next.has(action.payload)) {
        next.delete(action.payload)
      } else {
        next.add(action.payload)
      }

      return next
    }

    case "INIT": {
      return new Set(action.payload)
    }

    default:
      return state
  }
}

// This key is used to store favourites in localStorage
export const STORAGE_KEY = "photo-gallery-favourites"