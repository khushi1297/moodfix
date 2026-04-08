# MoodFlix 🎭

A mood-based movie e-commerce platform where users discover and purchase movies based on how they feel.

## Project Summary

MoodFlix solves the problem of choice overload on streaming platforms. Instead of browsing endless categories, users pick a mood and are instantly shown curated movies to purchase. They can add to cart, adjust quantities, and checkout without ever leaving the page.

## Tech Stack

- Frontend: HTML, CSS, Vanilla JavaScript
- Backend: Node.js + Express.js
- Database: MongoDB + Mongoose
- Environment: dotenv

## Features

- Mood-based movie discovery (6 moods: Date Night, Feeling Hyped, Need a Laugh, Scare Me, 3AM Vibes, Feeling Sad)
- Shopping cart drawer (slides in from right)
- Add, remove, and update quantity of cart items
- Checkout flow that clears the cart
- Hidden admin panel (click logo 5 times rapidly) for full CRUD
- Fully responsive mobile design
- Toast notifications for user feedback
- Smooth transitions and hover animations
- RESTful API with Express
- Single-page application — no page reloads

## Folder Structure

- public/ — HTML, CSS, JS frontend (index.html, style.css, app.js)
- models/ — Mongoose schemas (Movie.js, Cart.js)
- routes/ — Express API routes (movies.js, cart.js)
- seed.js — Database seeder with sample movies
- server.js — Express entry point
- movies_export.json — Database export for submission

## CRUD Operations

- Create: Admin adds a movie / User adds item to cart
- Read: Browse all movies, filter by mood, view cart
- Update: Admin edits movie details / User updates cart quantity
- Delete: Admin deletes a movie / User removes item from cart

## How to Run Locally

1. Clone the repository
```bash
git clone https://github.com/khushi1297/moodfix.git
cd moodfix
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file in the root folder
4. Seed the database
```bash
npm run seed
```

5. Start the server
```bash
npm start
```

6. Open browser at `http://localhost:3000`

## Database Export

This repository includes `movies_export.json` as the database export file for submission.

## MongoDB Requirement

This project requires a MongoDB Atlas connection string in the `.env` file. Create a free cluster at mongodb.com/cloud/atlas and paste the connection string as `MONGO_URI`.

## Challenges Overcome

Building a true single-page application without a frontend framework required careful DOM manipulation and show/hide logic across all views. Managing cart state entirely in MongoDB while keeping the UI responsive was solved by re-fetching after every cart operation. Designing a mood-to-genre mapping layer connected user emotions to database queries cleanly without exposing backend logic to the frontend. The hidden admin panel required debounce-style click-timing logic to detect 5 rapid clicks on the logo. Styling a premium dark cinematic UI without any CSS libraries pushed creative use of CSS variables, transitions, and glass-morphism effects.
