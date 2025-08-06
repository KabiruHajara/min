// API Base URL
const API_BASE = "https://api.escuelajs.co/api/v1";

// Get from localStorage (returns empty array if no cart exists)
function getCart() {
  const cart = localStorage.getItem("cart");
  return cart ? JSON.parse(cart) : [];
}

//  save cart to localStorage
function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Get favorites from localStorage
function getFavorites() {
  const favorites = localStorage.getItem("favorites");
  return favorites ? JSON.parse(favorites) : [];
}

// Save favorites to localStorage
function saveFavorites(favorites) {
  localStorage.setItem("favorites", JSON.stringify(favorites));
}

// Update cart count in navigation
function updateCartCount() {
  const cart = getCart();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartCountElements = document.querySelectorAll("#cartCount");
  cartCountElements.forEach((element) => {
    element.textContent = totalItems;
    if (totalItems > 0) {
      element.classList.add("pulse-ring");
    } else {
      element.classList.remove("pulse-ring");
    }
  });
}

// Update favorites count in navigation
function updateFavCount() {
  const favorites = getFavorites();
  const favCountElements = document.querySelectorAll("#favCount");
  favCountElements.forEach((element) => {
    element.textContent = favorites.length;
  });
}

// Add product to cart with animation
function addToCart(product) {
  const cart = getCart();

  // Check if product already exists in cart
  const existingItem = cart.find((item) => item.id === product.id);

  if (existingItem) {
    // If exists, increase quantity
    existingItem.quantity += 1;
  } else {
    // If new, add to cart with quantity 1
    cart.push({
      id: product.id,
      title: product.title,
      price: product.price,
      images: product.images,
      quantity: 1,
    });
  }

  saveCart(cart);
  updateCartCount();

  // Show success notification
  showNotification("🛍️ Added to cart!", "success");
}

// Remove product from cart
function removeFromCart(productId) {
  let cart = getCart();
  cart = cart.filter((item) => item.id !== productId);
  saveCart(cart);
  updateCartCount();

  // Reload cart page if we're on it
  if (window.location.pathname.includes("cart.html")) {
    loadCart();
  }

  showNotification("🗑️ Removed from cart", "info");
}

// Add/remove product from favorites
function toggleFavorite(product) {
  const favorites = getFavorites();
  const existingIndex = favorites.findIndex((item) => item.id === product.id);

  if (existingIndex > -1) {
    // Remove from favorites
    favorites.splice(existingIndex, 1);
    showNotification("💔 Removed from favorites", "info");
  } else {
    // Add to favorites
    favorites.push({
      id: product.id,
      title: product.title,
      price: product.price,
      images: product.images,
    });
    showNotification("❤️ Added to favorites!", "success");
  }

  saveFavorites(favorites);
  updateFavCount();

  // Reload favorites page if we're on it
  if (window.location.pathname.includes("favorites.html")) {
    loadFavorites();
  }
}

// Show notification
function showNotification(message, type = "success") {
  const notification = document.createElement("div");
  notification.className = `fixed top-20 right-6 z-50 px-6 py-4 rounded-xl shadow-2xl transform translate-x-full transition-all duration-300 ${
    type === "success" ? "bg-green-500" : "bg-blue-500"
  } text-white font-medium`;
  notification.textContent = message;

  document.body.appendChild(notification);

  // Slide in
  setTimeout(() => {
    notification.classList.remove("translate-x-full");
  }, 100);

  // Slide out and remove
  setTimeout(() => {
    notification.classList.add("translate-x-full");
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}

// Check if product is in favorites
function isInFavorites(productId) {
  const favorites = getFavorites();
  return favorites.some((item) => item.id === productId);
}

// Generate random discount percentage
function getRandomDiscount() {
  const discounts = [10, 15, 20, 25, 30];
  return discounts[Math.floor(Math.random() * discounts.length)];
}

// Generate random rating
function getRandomRating() {
  return (Math.random() * 2 + 3).toFixed(1); // Between 3.0 and 5.0
}

// Create premium product card HTML
function createProductCard(product) {
  const isFavorite = isInFavorites(product.id);
  const heartIcon = isFavorite
    ? "fas fa-heart text-red-500"
    : "far fa-heart text-gray-400";
  const discount = getRandomDiscount();
  const rating = getRandomRating();
  const originalPrice = (product.price * (1 + discount / 100)).toFixed(2);

  return `
        <div class="bg-white rounded-2xl shadow-lg overflow-hidden card-hover group relative">
            <!-- Discount Badge -->
            <div class="absolute top-4 left-4 z-10 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                -${discount}%
            </div>
            
            <!-- Favorite Button -->
            <button onclick="toggleFavorite(${JSON.stringify(product).replace(
              /"/g,
              "&quot;"
            )})" 
                    class="absolute top-4 right-4 z-10 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all duration-200 group-hover:scale-110">
                <i class="${heartIcon} text-lg"></i>
            </button>
            
            <!-- Product Image -->
            <div class="relative overflow-hidden cursor-pointer" onclick="viewProductDetails(${
              product.id
            })">
                <img src="${product.images[0]}" alt="${product.title}" 
                     class="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500">
                <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <!-- Quick View Button -->
                <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <button class="bg-white text-gray-800 px-6 py-2 rounded-full font-semibold shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        <i class="fas fa-eye mr-2"></i>Quick View
                    </button>
                </div>
            </div>
            
            <!-- Product Info -->
            <div class="p-6">
                <!-- Rating -->
                <div class="flex items-center mb-2">
                    <div class="flex text-yellow-400 text-sm">
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                    </div>
                    <span class="text-gray-600 text-sm ml-2">${rating} (${Math.floor(
    Math.random() * 200 + 50
  )} reviews)</span>
                </div>
                
                <h3 class="font-bold text-lg mb-2 cursor-pointer hover:text-purple-600 transition-colors line-clamp-2" 
                    onclick="viewProductDetails(${product.id})">${
    product.title
  }</h3>
                <p class="text-gray-600 text-sm mb-4 line-clamp-2">${product.description.substring(
                  0,
                  100
                )}...</p>
                
                <!-- Price -->
                <div class="flex items-center mb-4">
                    <span class="text-2xl font-bold text-purple-600">$${
                      product.price
                    }</span>
                    <span class="text-gray-400 line-through ml-2">$${originalPrice}</span>
                    <span class="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full ml-2 font-semibold">
                        Save $${(originalPrice - product.price).toFixed(2)}
                    </span>
                </div>
                
                <!-- Action Buttons -->
                <div class="space-y-3">
                    <button onclick="addToCart(${JSON.stringify(
                      product
                    ).replace(/"/g, "&quot;")})" 
                            class="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg">
                        <i class="fas fa-cart-plus mr-2"></i>Add to Cart
                    </button>
                    
                    <div class="flex space-x-2">
                        <button onclick="viewProductDetails(${product.id})" 
                                class="flex-1 bg-gray-100 text-gray-800 py-2 px-4 rounded-xl font-medium hover:bg-gray-200 transition-colors">
                            <i class="fas fa-eye mr-1"></i>Details
                        </button>
                        <button onclick="buyNowFromCard(${JSON.stringify(
                          product
                        ).replace(/"/g, "&quot;")})" 
                                class="flex-1 bg-green-500 text-white py-2 px-4 rounded-xl font-medium hover:bg-green-600 transition-colors">
                            <i class="fas fa-bolt mr-1"></i>Buy Now
                        </button>
                    </div>
                </div>
                
                <!-- Trust Indicators -->
                <div class="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500">
                    <span><i class="fas fa-shipping-fast mr-1"></i>Free Shipping</span>
                    <span><i class="fas fa-shield-alt mr-1"></i>Secure</span>
                    <span><i class="fas fa-undo mr-1"></i>Easy Return</span>
                </div>
            </div>
        </div>
    `;
}

// Buy now from card
function buyNowFromCard(product) {
  // Clear current cart and add this product
  const cart = [
    {
      id: product.id,
      title: product.title,
      price: product.price,
      images: product.images,
      quantity: 1,
    },
  ];

  saveCart(cart);
  updateCartCount();
  showNotification("🚀 Proceeding to checkout!", "success");
  setTimeout(() => {
    window.location.href = "checkout.html";
  }, 1000);
}

// Navigate to product details page
function viewProductDetails(productId) {
  window.location.href = `product-details.html?id=${productId}`;
}

// Get product ID from URL parameters
function getProductIdFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("id");
}

// Load single product details
async function loadProductDetails() {
  const productId = getProductIdFromUrl();

  if (!productId) {
    document.getElementById("productDetails").innerHTML =
      '<p class="text-red-600">Product not found</p>';
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/products/${productId}`);
    const product = await response.json();

    const productDetails = document.getElementById("productDetails");
    const loading = document.getElementById("loading");

    loading.style.display = "none";

    const isFavorite = isInFavorites(product.id);
    const heartIcon = isFavorite
      ? "fas fa-heart text-red-500"
      : "far fa-heart text-gray-400";
    const discount = getRandomDiscount();
    const rating = getRandomRating();
    const originalPrice = (product.price * (1 + discount / 100)).toFixed(2);

    productDetails.innerHTML = `
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <!-- Product Images -->
        <div>
          <div class="relative mb-6 group">
            <img id="mainImage" src="${product.images[0]}" alt="${
      product.title
    }" 
                 class="w-full h-96 object-cover rounded-2xl shadow-2xl group-hover:scale-105 transition-transform duration-500">
            <div class="absolute top-6 left-6 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                -${discount}%
            </div>
          </div>
          <div class="grid grid-cols-4 gap-3">
            ${product.images
              .map(
                (image, index) => `
              <img src="${image}" alt="${product.title}" 
                   class="w-full h-20 object-cover rounded-xl cursor-pointer hover:opacity-75 transition-opacity ${
                     index === 0 ? "ring-2 ring-purple-500" : ""
                   }"
                   onclick="changeMainImage('${image}', this)">
            `
              )
              .join("")}
          </div>
        </div>

        <!-- Product Info -->
        <div>
          <!-- Rating and Reviews -->
          <div class="flex items-center mb-4">
            <div class="flex text-yellow-400 text-lg">
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
            </div>
            <span class="text-gray-600 ml-3">${rating} (${Math.floor(
      Math.random() * 500 + 100
    )} reviews)</span>
          </div>

          <h1 class="text-4xl font-bold mb-6 text-gray-800">${
            product.title
          }</h1>
          
          <!-- Price -->
          <div class="flex items-center mb-8">
            <span class="text-5xl font-bold text-purple-600">$${
              product.price
            }</span>
            <div class="ml-4">
              <span class="text-gray-400 line-through text-xl">$${originalPrice}</span>
              <div class="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full font-semibold inline-block ml-2">
                Save $${(originalPrice - product.price).toFixed(2)}
              </div>
            </div>
          </div>
          
          <!-- Description -->
          <div class="mb-8">
            <h3 class="text-xl font-semibold mb-3 text-gray-800">Description</h3>
            <p class="text-gray-700 leading-relaxed text-lg">${
              product.description
            }</p>
          </div>

          <!-- Category -->
          <div class="mb-8">
            <h3 class="text-xl font-semibold mb-3 text-gray-800">Category</h3>
            <span class="bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium">${
              product.category.name
            }</span>
          </div>

          <!-- Quantity Selector -->
          <div class="mb-8">
            <h3 class="text-xl font-semibold mb-3 text-gray-800">Quantity</h3>
            <div class="flex items-center space-x-4">
              <button onclick="decreaseQuantity()" class="w-12 h-12 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors flex items-center justify-center text-xl font-bold">-</button>
              <span id="quantity" class="text-2xl font-bold bg-gray-100 px-6 py-2 rounded-xl">1</span>
              <button onclick="increaseQuantity()" class="w-12 h-12 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors flex items-center justify-center text-xl font-bold">+</button>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="space-y-4">
            <button onclick="addToCartWithQuantity(${JSON.stringify(
              product
            ).replace(/"/g, "&quot;")})" 
                    class="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 px-8 rounded-2xl hover:from-purple-700 hover:to-blue-700 text-xl font-bold transform hover:scale-105 transition-all duration-200 shadow-2xl">
              <i class="fas fa-cart-plus mr-3"></i>Add to Cart
            </button>
            
            <div class="grid grid-cols-2 gap-4">
              <button onclick="toggleFavorite(${JSON.stringify(product).replace(
                /"/g,
                "&quot;"
              )})" 
                      class="border-2 border-gray-300 py-3 px-6 rounded-2xl hover:bg-gray-100 text-lg font-semibold transition-all duration-200 hover:scale-105">
                <i class="${heartIcon} mr-2"></i>${
      isFavorite ? "Remove from" : "Add to"
    } Favorites
              </button>
              
              <button onclick="buyNow(${JSON.stringify(product).replace(
                /"/g,
                "&quot;"
              )})" 
                      class="bg-green-500 text-white py-3 px-6 rounded-2xl hover:bg-green-600 text-lg font-semibold transform hover:scale-105 transition-all duration-200 shadow-lg">
                <i class="fas fa-bolt mr-2"></i>Buy Now
              </button>
            </div>
          </div>

          <!-- Trust Badges -->
          <div class="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-gray-200">
            <div class="text-center">
              <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <i class="fas fa-shipping-fast text-green-600"></i>
              </div>
              <p class="text-sm font-medium text-gray-700">Free Shipping</p>
            </div>
            <div class="text-center">
              <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <i class="fas fa-shield-alt text-blue-600"></i>
              </div>
              <p class="text-sm font-medium text-gray-700">Secure Payment</p>
            </div>
            <div class="text-center">
              <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <i class="fas fa-undo text-purple-600"></i>
              </div>
              <p class="text-sm font-medium text-gray-700">Easy Returns</p>
            </div>
          </div>
        </div>
      </div>
    `;
  } catch (error) {
    console.error("Error loading product details:", error);
    document.getElementById("loading").innerHTML =
      '<p class="text-red-600">Error loading product details</p>';
  }
}

// Change main product image
function changeMainImage(imageSrc, clickedImg) {
  document.getElementById("mainImage").src = imageSrc;

  // Remove ring from all thumbnails
  document.querySelectorAll(".grid img").forEach((img) => {
    img.classList.remove("ring-2", "ring-purple-500");
  });

  // Add ring to clicked thumbnail
  clickedImg.classList.add("ring-2", "ring-purple-500");
}

// Quantity controls
let currentQuantity = 1;

function increaseQuantity() {
  currentQuantity++;
  document.getElementById("quantity").textContent = currentQuantity;
}

function decreaseQuantity() {
  if (currentQuantity > 1) {
    currentQuantity--;
    document.getElementById("quantity").textContent = currentQuantity;
  }
}

// Add to cart with specific quantity
function addToCartWithQuantity(product) {
  const cart = getCart();
  const existingItem = cart.find((item) => item.id === product.id);

  if (existingItem) {
    existingItem.quantity += currentQuantity;
  } else {
    cart.push({
      id: product.id,
      title: product.title,
      price: product.price,
      images: product.images,
      quantity: currentQuantity,
    });
  }

  saveCart(cart);
  updateCartCount();
  showNotification(`🛍️ ${currentQuantity} item(s) added to cart!`, "success");
}

// Buy now function
function buyNow(product) {
  // Clear current cart and add this product
  const cart = [
    {
      id: product.id,
      title: product.title,
      price: product.price,
      images: product.images,
      quantity: currentQuantity,
    },
  ];

  saveCart(cart);
  updateCartCount();
  showNotification("🚀 Proceeding to checkout!", "success");
  setTimeout(() => {
    window.location.href = "checkout.html";
  }, 1000);
}


// Load all products
async function loadAllProducts() {
  try {
    const response = await fetch(`${API_BASE}/products`);
    const products = await response.json();

    // console.log(products);

    const productsGrid = document.getElementById("productsGrid");
    const loading = document.getElementById("loading");

    loading.style.display = "none";
    let allProduct = products
      .map((product) => createProductCard(product))
      .join("");
    
    // console.log(allProduct);
    
    productsGrid.innerHTML = allProduct;
  } catch (error) {
    console.error("Error loading products:", error);
    document.getElementById("loading").innerHTML =
      '<p class="text-red-600">Error loading products</p>';
  }
}

// Load categories
async function loadCategories() {
  try {
    const response = await fetch(`${API_BASE}/categories`);
    const categories = await response.json();

    const categoriesGrid = document.getElementById("categoriesGrid");
    const loading = document.getElementById("loading");

    loading.style.display = "none";

    categoriesGrid.innerHTML = categories
      .map(
        (category) => `
            <div class="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer hover:shadow-2xl transform hover:scale-105 transition-all duration-300 group" 
                 onclick="loadCategoryProducts(${category.id}, '${category.name}')">
                <div class="relative overflow-hidden">
                    <img src="${category.image}" alt="${category.name}" class="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500">
                    <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <div class="absolute bottom-4 left-4 text-white">
                        <h3 class="text-2xl font-bold">${category.name}</h3>
                        <p class="text-white/80">Explore Collection</p>
                    </div>
                </div>
            </div>
        `
      )
      .join("");
  } catch (error) {
    console.error("Error loading categories:", error);
    document.getElementById("loading").innerHTML =
      '<p class="text-red-600">Error loading categories</p>';
  }
}

// Load products in a specific category
async function loadCategoryProducts(categoryId, categoryName) {
  try {
    const response = await fetch(
      `${API_BASE}/categories/${categoryId}/products`
    );
    const products = await response.json();

    const categoryProducts = document.getElementById("categoryProducts");
    const categoryTitle = document.getElementById("categoryTitle");
    const categoryProductsGrid = document.getElementById(
      "categoryProductsGrid"
    );

    categoryTitle.textContent = categoryName;
    categoryProducts.classList.remove("hidden");
    categoryProductsGrid.innerHTML = products
      .map((product) => createProductCard(product))
      .join("");

    // Scroll to category products
    categoryProducts.scrollIntoView({ behavior: "smooth" });
  } catch (error) {
    console.error("Error loading category products:", error);
  }
}

// Load cart items
function loadCart() {
  const cart = getCart();
  const cartItems = document.getElementById("cartItems");
  const emptyCart = document.getElementById("emptyCart");
  const cartTotal = document.getElementById("cartTotal");
  const totalAmount = document.getElementById("totalAmount");

  if (cart.length === 0) {
    emptyCart.classList.remove("hidden");
    cartTotal.classList.add("hidden");
    cartItems.innerHTML = "";
    return;
  }

  emptyCart.classList.add("hidden");
  cartTotal.classList.remove("hidden");

  // Calculate total
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  totalAmount.textContent = total.toFixed(2);

  // Display cart items
  cartItems.innerHTML = cart
    .map(
      (item) => `
        <div class="bg-white p-6 rounded-2xl shadow-lg flex items-center space-x-6 hover:shadow-xl transition-shadow duration-300">
            <img src="${item.images[0]}" alt="${
        item.title
      }" class="w-20 h-20 object-cover rounded-xl">
            <div class="flex-1">
                <h3 class="font-bold text-lg text-gray-800">${item.title}</h3>
                <p class="text-gray-600">$${item.price} × ${item.quantity}</p>
                <div class="flex items-center mt-2">
                    <span class="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">In Stock</span>
                </div>
            </div>
            <div class="text-right">
                <p class="font-bold text-xl text-purple-600">$${(
                  item.price * item.quantity
                ).toFixed(2)}</p>
                <button onclick="removeFromCart(${item.id})" 
                        class="text-red-500 hover:text-red-700 mt-2 bg-red-50 px-3 py-1 rounded-lg hover:bg-red-100 transition-colors">
                    <i class="fas fa-trash mr-1"></i>Remove
                </button>
            </div>
        </div>
    `
    )
    .join("");
}

// Load favorites
function loadFavorites() {
  const favorites = getFavorites();
  const favoritesGrid = document.getElementById("favoritesGrid");
  const emptyFavorites = document.getElementById("emptyFavorites");

  if (favorites.length === 0) {
    emptyFavorites.classList.remove("hidden");
    favoritesGrid.innerHTML = "";
    return;
  }

  emptyFavorites.classList.add("hidden");
  favoritesGrid.innerHTML = favorites
    .map((product) => createProductCard(product))
    .join("");
}

// Proceed to checkout
function proceedToCheckout() {
  const cart = getCart();
  if (cart.length === 0) {
    showNotification("🛒 Your cart is empty!", "info");
    return;
  }
  showNotification("🚀 Proceeding to checkout!", "success");
  setTimeout(() => {
    window.location.href = "checkout.html";
  }, 1000);
}

// Load order summary for checkout
function loadOrderSummary() {
  const cart = getCart();
  const orderSummary = document.getElementById("orderSummary");
  const orderTotal = document.getElementById("orderTotal");

  if (cart.length === 0) {
    window.location.href = "cart.html";
    return;
  }

  // Calculate total
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  orderTotal.textContent = total.toFixed(2);

  // Display order items
  orderSummary.innerHTML = cart
    .map(
      (item) => `
        <div class="flex justify-between items-center py-2">
            <span class="text-gray-700">${item.title} × ${item.quantity}</span>
            <span class="font-semibold text-purple-600">$${(
              item.price * item.quantity
            ).toFixed(2)}</span>
        </div>
    `
    )
    .join("");
}

// Complete order
function completeOrder() {
  // Clear cart
  localStorage.removeItem("cart");

  showNotification("🎉 Order placed successfully!", "success");

  // Redirect to success page
  setTimeout(() => {
    window.location.href = "success.html";
  }, 1500);
}
