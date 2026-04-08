// Base API URL — update this if deploying to a remote server
const API = 'http://localhost:3000/api';

// Tracks which movie is being edited in the admin panel (null = adding new)
let editingId = null;

// Used to detect 5 rapid logo clicks to unlock the admin panel
let logoClickCount = 0;
let logoClickTimer = null;

// ============================================================
// LOGO CLICK — secret admin access (5 clicks within 2 seconds)
// ============================================================
function handleLogoClick() {
  logoClickCount++;
  clearTimeout(logoClickTimer);
  logoClickTimer = setTimeout(() => { logoClickCount = 0; }, 2000);

  if (logoClickCount >= 5) {
    logoClickCount = 0;
    showPage('admin');
    showToast('Admin mode unlocked 🔐');
  } else {
    showPage('mood');
  }
}

// ============================================================
// PAGE NAVIGATION — swap visible page by id
// ============================================================
function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const page = document.getElementById('page-' + name);
  if (!page) return;
  page.classList.add('active');

  // Load page-specific data when navigating
  if (name === 'admin') loadAdminMovies();
  if (name === 'movies') loadAllMovies();
}

// ============================================================
// CART DRAWER — open and close the slide-in panel
// ============================================================
function openCart() {
  document.getElementById('cart-drawer').classList.add('active');
  document.getElementById('cart-overlay').classList.add('active');
  document.body.style.overflow = 'hidden'; // prevent background scroll
  loadCart();
}

function closeCart() {
  document.getElementById('cart-drawer').classList.remove('active');
  document.getElementById('cart-overlay').classList.remove('active');
  document.body.style.overflow = '';
}

// ============================================================
// MOOD SELECTION — filter movies by mood and show the grid
// ============================================================
function selectMood(mood) {
  document.getElementById('mood-title').textContent = mood + ' 🎬';
  showPage('movies');
  loadMovies(mood);
}

// ============================================================
// LOAD ALL MOVIES (Browse All button)
// ============================================================
async function loadAllMovies() {
  const grid = document.getElementById('movies-grid');
  document.getElementById('mood-title').textContent = 'All Movies 🎬';
  grid.innerHTML = '<p class="empty-msg">Loading movies...</p>';

  try {
    const res = await fetch(`${API}/movies`);
    if (!res.ok) throw new Error('Server error');
    const movies = await res.json();

    if (movies.length === 0) {
      grid.innerHTML = '<p class="empty-msg">No movies found.</p>';
      return;
    }

    grid.innerHTML = movies.map(m => buildMovieCard(m)).join('');
  } catch (err) {
    grid.innerHTML = '<p class="empty-msg">Failed to load movies. Is the server running?</p>';
  }
}

// ============================================================
// LOAD MOVIES BY MOOD
// ============================================================
async function loadMovies(mood) {
  const grid = document.getElementById('movies-grid');
  grid.innerHTML = '<p class="empty-msg">Loading movies...</p>';

  try {
    const res = await fetch(`${API}/movies?mood=${encodeURIComponent(mood)}`);
    if (!res.ok) throw new Error('Server error');
    const movies = await res.json();

    if (movies.length === 0) {
      grid.innerHTML = '<p class="empty-msg">No movies found for this mood.</p>';
      return;
    }

    grid.innerHTML = movies.map(m => buildMovieCard(m)).join('');
  } catch (err) {
    grid.innerHTML = '<p class="empty-msg">Failed to load movies. Is the server running?</p>';
  }
}

// Shared helper — builds a movie card HTML string
function buildMovieCard(m) {
  const placeholder = `https://placehold.co/200x300/1a1a2e/c77dff?text=${encodeURIComponent(m.title)}`;
  const img = m.image || placeholder;
  const safeTitle = m.title.replace(/'/g, "\\'");
  return `
    <div class="movie-card">
      <img src="${img}" alt="${m.title}"
           onerror="this.src='${placeholder}'" />
      <div class="movie-info">
        <h3>${m.title}</h3>
        <p class="movie-meta">${m.year} • ⭐ ${m.rating}</p>
        <p class="movie-genre-tag">${m.genre || m.mood}</p>
        <p class="movie-meta">${m.description ? m.description.substring(0, 65) + '...' : ''}</p>
        <p class="movie-price">$${parseFloat(m.price).toFixed(2)}</p>
        <button class="add-cart-btn"
          onclick="addToCart('${m._id}', '${safeTitle}', ${m.price}, '${m.image}')">
          + Add to Cart
        </button>
      </div>
    </div>
  `;
}

// ============================================================
// CART — add, load, update, remove, checkout
// ============================================================

// Add a movie to the cart (or increment its quantity if already present)
async function addToCart(movieId, title, price, image) {
  try {
    const res = await fetch(`${API}/cart`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ movieId, title, price, image })
    });
    if (!res.ok) throw new Error('Failed');
    updateCartCount();
    showToast('Added to cart! 🛒');
  } catch (err) {
    showToast('Could not add to cart ❌');
  }
}

// Fetch and render all cart items in the drawer
async function loadCart() {
  const container = document.getElementById('cart-items');
  const footer = document.getElementById('cart-footer');
  container.innerHTML = '<p class="empty-msg">Loading...</p>';

  try {
    const res = await fetch(`${API}/cart`);
    if (!res.ok) throw new Error('Failed');
    const items = await res.json();

    if (items.length === 0) {
      container.innerHTML = '<p class="empty-msg">Your cart is empty 🎬<br>Browse movies to get started!</p>';
      footer.classList.add('hidden');
      return;
    }

    container.innerHTML = items.map(item => `
      <div class="cart-item">
        <img src="${item.image || 'https://placehold.co/55x78/1a1a2e/c77dff?text=🎬'}"
             alt="${item.title}"
             onerror="this.src='https://placehold.co/55x78/1a1a2e/c77dff?text=🎬'" />
        <div class="cart-item-info">
          <h3>${item.title}</h3>
          <p>$${item.price.toFixed(2)}</p>
          <div class="qty-controls">
            <button class="qty-btn" onclick="updateQty('${item._id}', ${item.quantity - 1})">−</button>
            <span>${item.quantity}</span>
            <button class="qty-btn" onclick="updateQty('${item._id}', ${item.quantity + 1})">+</button>
          </div>
        </div>
        <button class="remove-btn" onclick="removeFromCart('${item._id}')">Remove</button>
      </div>
    `).join('');

    // Calculate and display the total price
    const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    document.getElementById('cart-total').textContent = total.toFixed(2);
    footer.classList.remove('hidden');
    updateCartCount();
  } catch (err) {
    container.innerHTML = '<p class="empty-msg">Failed to load cart.</p>';
  }
}

// Update quantity — if qty drops to 0 or below, remove the item instead
async function updateQty(id, qty) {
  if (qty < 1) return removeFromCart(id);
  try {
    await fetch(`${API}/cart/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity: qty })
    });
    loadCart();
  } catch (err) {
    showToast('Could not update quantity ❌');
  }
}

// Remove a single item from the cart
async function removeFromCart(id) {
  try {
    await fetch(`${API}/cart/${id}`, { method: 'DELETE' });
    loadCart();
    updateCartCount();
  } catch (err) {
    showToast('Could not remove item ❌');
  }
}

// Checkout — clears the entire cart and closes the drawer
async function checkout() {
  if (!confirm('Confirm your purchase? 🎬')) return;
  try {
    await fetch(`${API}/cart`, { method: 'DELETE' });
    loadCart();
    updateCartCount();
    closeCart();
    showToast('Purchase complete! Enjoy your movies 🎉');
  } catch (err) {
    showToast('Checkout failed. Please try again ❌');
  }
}

// Update the cart count badge in the navbar
async function updateCartCount() {
  try {
    const res = await fetch(`${API}/cart`);
    const items = await res.json();
    const count = items.reduce((sum, i) => sum + i.quantity, 0);
    document.getElementById('cart-count').textContent = count;
  } catch (err) {
    // Silently fail — badge just won't update
  }
}

// ============================================================
// ADMIN — movie management (CRUD)
// ============================================================

// Load all movies into the admin list
async function loadAdminMovies() {
  const list = document.getElementById('admin-list');
  list.innerHTML = '<p class="empty-msg">Loading...</p>';

  try {
    const res = await fetch(`${API}/movies`);
    const movies = await res.json();
    list.innerHTML = movies.map(m => `
      <div class="admin-movie-item">
        <img src="${m.image || 'https://placehold.co/45x63/1a1a2e/c77dff?text=🎬'}"
             alt="${m.title}"
             onerror="this.src='https://placehold.co/45x63/1a1a2e/c77dff?text=🎬'" />
        <div class="admin-movie-info">
          <h4>${m.title}</h4>
          <p>${m.mood} • $${m.price}</p>
        </div>
        <div class="admin-btns">
          <button class="edit-btn"
            onclick="editMovie('${m._id}', '${m.title.replace(/'/g,"\\'")}', '${m.genre}', '${m.mood}', '${m.description ? m.description.replace(/'/g,"\\'") : ''}', ${m.price}, ${m.year}, ${m.rating}, '${m.image}')">
            Edit
          </button>
          <button class="delete-btn" onclick="deleteMovie('${m._id}')">Delete</button>
        </div>
      </div>
    `).join('');
  } catch (err) {
    list.innerHTML = '<p class="empty-msg">Failed to load movies.</p>';
  }
}

// Save movie — handles both create (POST) and update (PUT)
async function saveMovie() {
  const data = {
    title:       document.getElementById('a-title').value.trim(),
    genre:       document.getElementById('a-genre').value.trim(),
    mood:        document.getElementById('a-mood').value,
    description: document.getElementById('a-description').value.trim(),
    price:       parseFloat(document.getElementById('a-price').value),
    year:        parseInt(document.getElementById('a-year').value),
    rating:      parseFloat(document.getElementById('a-rating').value),
    image:       document.getElementById('a-image').value.trim()
  };

  // Basic validation before hitting the API
  if (!data.title || !data.mood || !data.price || isNaN(data.price)) {
    showToast('Please fill in title, mood, and a valid price ❌');
    return;
  }

  try {
    const url    = editingId ? `${API}/movies/${editingId}` : `${API}/movies`;
    const method = editingId ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Save failed');
    showToast(editingId ? 'Movie updated! ✅' : 'Movie added! ✅');
    resetForm();
    loadAdminMovies();
  } catch (err) {
    showToast('Failed to save movie ❌');
  }
}

// Populate the form with an existing movie's data for editing
function editMovie(id, title, genre, mood, description, price, year, rating, image) {
  editingId = id;
  document.getElementById('a-title').value       = title;
  document.getElementById('a-genre').value       = genre;
  document.getElementById('a-mood').value        = mood;
  document.getElementById('a-description').value = description;
  document.getElementById('a-price').value       = price;
  document.getElementById('a-year').value        = year;
  document.getElementById('a-rating').value      = rating;
  document.getElementById('a-image').value       = image;
  document.getElementById('form-title').textContent = 'Edit Movie ✏️';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Delete a movie after confirmation
async function deleteMovie(id) {
  if (!confirm('Delete this movie? This cannot be undone.')) return;
  try {
    await fetch(`${API}/movies/${id}`, { method: 'DELETE' });
    showToast('Movie deleted 🗑️');
    loadAdminMovies();
  } catch (err) {
    showToast('Failed to delete movie ❌');
  }
}

// Reset the admin form back to "add new" state
function resetForm() {
  editingId = null;
  ['a-title','a-genre','a-mood','a-description','a-price','a-year','a-rating','a-image']
    .forEach(id => document.getElementById(id).value = '');
  document.getElementById('form-title').textContent = 'Add New Movie';
}

// ============================================================
// TOAST NOTIFICATIONS — non-blocking feedback messages
// ============================================================
function showToast(msg) {
  const toast = document.createElement('div');
  toast.textContent = msg;
  toast.style.cssText = `
    position: fixed;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%);
    background: #c77dff;
    color: #000;
    padding: 0.8rem 1.5rem;
    border-radius: 10px;
    font-size: 0.9rem;
    z-index: 9999;
    box-shadow: 0 4px 20px #c77dff55;
    font-weight: 600;
    white-space: nowrap;
    font-family: 'Inter', sans-serif;
    animation: fadeIn 0.2s ease;
  `;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// ============================================================
// INIT — run on page load
// ============================================================
updateCartCount();