# Smart Closet — Frontend 👗

The web client for **Smart Closet**, an intelligent wardrobe manager that digitizes your clothes and recommends personalized outfit combinations. Built with React, it handles authentication, item uploads, color extraction, and the recommendation UI.

> 🔗 This is one half of a full-stack project. The API lives in the companion repo: **[Smart-Closet-Backend](https://github.com/NgnMsv/Smart-Closet-Backend)** (Django REST + Celery + scikit-learn).

## Features

- **Authentication** — sign up and log in with JWT-based sessions
- **Closet management** — create and organize virtual closets
- **Add wearables** — upload clothing photos with automatic image processing
- **Color recognition** — dominant color extracted from each item via [ColorThief](https://lokeshdhakar.com/projects/color-thief/)
- **Cloud image hosting** — uploads stored on Cloudinary
- **Outfit generation** — request recommended combinations, optionally filtered by usage (formal / casual / sport / general)
- **Feedback loop** — like or dislike generated outfits to train your personal recommendation model
- **Taste profiling** — "Know Your Taste" flow to seed your preferences
- **Wardrobe view** — browse all saved wearables in one place

## Tech Stack

- **React 18** (bootstrapped with Create React App)
- **React Router 6** (`react-router-dom`) for routing
- **Material UI 6** (`@mui/material`, `@mui/icons-material`) + **Font Awesome** for UI
- **Axios** for API requests
- **ColorThief** for client-side dominant-color extraction
- **cloudinary-react** for image handling
- Custom font asset (B-Nazanin, for Persian/RTL text)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16+ recommended)
- npm
- A running instance of the [Smart Closet backend](https://github.com/NgnMsv/Smart-Closet-Backend)

### Installation

```bash
# Clone the repository
git clone https://github.com/NgnMsv/Smart-Closet-Frontend.git
cd Smart-Closet-Frontend/smart-closet_frontend

# Install dependencies
npm install

# Start the development server
npm start
```

The app runs at [http://localhost:3000](http://localhost:3000).

> **Note:** The actual React app lives in the `smart-closet_frontend/` subfolder of this repo.

### Configuration

Point the app at your backend API and Cloudinary account. Create a `.env` file in `smart-closet_frontend/`:

```env
REACT_APP_API_BASE_URL=http://localhost:8000
REACT_APP_CLOUDINARY_CLOUD_NAME=your_cloud_name
REACT_APP_CLOUDINARY_UPLOAD_PRESET=your_unsigned_preset
```

*(Adjust names to match how the code reads its config.)*

## Available Scripts

| Command | Description |
| --- | --- |
| `npm start` | Run in development mode at `localhost:3000` |
| `npm test` | Launch the interactive test runner |
| `npm run build` | Build for production into the `build/` folder |
| `npm run eject` | Eject from CRA (one-way operation) |

## Routes

| Path | Page | Description |
| --- | --- | --- |
| `/` | — | Redirects to Dashboard |
| `/Login` | Login | User sign-in |
| `/sign-up` | SignUp | New account registration |
| `/Dashboard` | Dashboard | Main landing page |
| `/create-new-closet` | CreateNewCloset | Create a new closet |
| `/add-new-item` | AddNewItem | Upload and tag a new wearable |
| `/generate-combination` | GenerateCombination | Get outfit recommendations |
| `/check-if-liked` | CheckIfLiked | Record outfit feedback (like/dislike) |
| `/show-all-werable` | ShowAllWearables | Browse the full wardrobe |
| `/Know-your-taste` | KnowYourTaste | Set up your style profile |

## Project Structure

```
smart-closet_frontend/
├── public/
└── src/
    ├── App.js              # App routes
    ├── index.js            # Entry point
    ├── assets/             # Fonts and static assets
    └── pages/
        ├── Login/
        ├── SignUp/
        ├── Dashboard/
        ├── NewCloset/
        ├── AddNewItem/
        ├── GenerateCombination/
        ├── CheckIfLiked/
        ├── ShowAllWearables/
        └── KnowYourTaste/
```

## Related

- **Backend API:** [Smart-Closet-Backend](https://github.com/NgnMsv/Smart-Closet-Backend)

## License

Distributed under the MIT License. See `LICENSE` for details.

---

*Built with React · 2024*
