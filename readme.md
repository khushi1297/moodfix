# MoodFlix

## Project Summary
MoodFlix is a mood-based movie e-commerce platform that helps users discover and purchase movies based on how they feel. Users pick a mood and are shown curated movies to buy. They can add to cart, adjust quantities, and checkout without leaving the page.

## Tech Stack
- Frontend: HTML, CSS, Vanilla JavaScript
- Backend: Node.js + Express.js
- Database: MongoDB + Mongoose
- API: TMDB (The Movie Database)
- Environment: dotenv

## Features
- Mood-based movie discovery (6 moods)
- Shopping cart with add, remove, quantity controls
- Checkout flow
- Hidden admin panel (5 rapid logo clicks) for full CRUD
- Fully responsive mobile design
- Toast notifications and smooth transitions
- RESTful API with Express

## Folder Structure
- public/ - HTML, CSS, JS frontend
- models/ - Mongoose schemas
- routes/ - Express API routes
- seed.js - Database seeder
- server.js - Entry point

## CRUD Operations
- Create: Add movie (admin), add to cart
- Read: Browse movies, filter by mood, view cart
- Update: Edit movie (admin), update cart quantity
- Delete: Delete movie (admin), remove from cart

## Challenges Overcome
Integrating TMDB API data with MongoDB required normalizing the response shape before seeding. Designing mood-filtering logic for moods that don't map directly to TMDB genres required a custom mapping layer. The hidden admin panel needed debounce-style click-timing logic. Managing cart state without a frontend framework required careful manual DOM updates. Ensuring true SPA behavior meant routing all navigation through JavaScript show/hide logic.
