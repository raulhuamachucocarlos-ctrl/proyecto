// =============================================
// APP.JS - Lógica principal de la aplicación
// Sabor Digital - Restaurante Inteligente
//
// Este archivo contiene toda la lógica de:
// - Navegación entre pantallas (SPA)
// - Generación de código QR
// - Renderizado dinámico del menú
// - Filtrado por categoría y búsqueda
// - Modal de detalle con efecto 3D
// - Gestión del carrito de pedidos
// - Asistente virtual (chatbot)
// - Proceso de pago
// - Confirmación y seguimiento del pedido
// - Sistema de calificación
// =============================================

// =============================================
// ESTADO GLOBAL DE LA APLICACIÓN
// Almacena toda la información actual del usuario
// =============================================
const APP = {
  currentScreen: "welcome",   // Pantalla actualmente visible
  cart: [],                    // Array de items en el carrito [{dish, quantity}]
  tableNumber: null,           // Número de mesa seleccionada
  selectedCategory: "all",     // Categoría del menú actualmente filtrada
  searchQuery: "",             // Texto de búsqueda actual
  selectedPayment: null,       // Método de pago seleccionado
  orderNumber: null,           // Número de orden generado
  currentDish: null,           // Plato actualmente visualizado en el modal
  currentQty: 1,               // Cantidad seleccionada en el modal
  rating: 0,                   // Calificación dada por el usuario (1-5)
};

// =============================================
// INICIALIZACIÓN
// Se ejecuta cuando el DOM está completamente cargado
// =============================================
document.addEventListener("DOMContentLoaded", () => {
  generateQR();         // Genera el código QR en la pantalla de bienvenida
  renderMenu();          // Renderiza las tarjetas del menú
  setupEventListeners(); // Configura los event listeners
  updateCartBadge();     // Actualiza el badge del carrito (inicialmente 0)
});

// =============================================
// GENERACIÓN DEL CÓDIGO QR
// Usa la librería QRCode.js para crear el QR
// que el cliente escanearía en la mesa
// =============================================
function generateQR() {
  // Obtiene el contenedor donde se insertará el QR
  const qrContainer = document.getElementById("qr-code");

  // Verifica que exista el contenedor y la librería esté cargada
  if (qrContainer && typeof QRCode !== "undefined") {
    new QRCode(qrContainer, {
      text: (() => { const url = new URL(window.location.href); url.search = ""; url.hash = ""; url.searchParams.set("mesa", APP.tableNumber || document.getElementById("table-select")?.value || "1"); return url.toString(); })(),
      width: 180,              // Ancho del QR en píxeles
      height: 180,             // Alto del QR en píxeles
      colorDark: "#1A1A2E",    // Color de los módulos (oscuro para contraste)
      colorLight: "#ffffff",   // Color del fondo (blanco)
      correctLevel: QRCode.CorrectLevel.H, // Nivel alto de corrección de errores
    });
  }
}

// =============================================
// NAVEGACIÓN ENTRE PANTALLAS (SPA)
// Sistema de Single Page Application
// Solo una pantalla se muestra a la vez
// =============================================
function showScreen(screenId) {
  // Oculta todas las pantallas removiendo la clase 'active'
  document.querySelectorAll(".screen").forEach((s) => s.classList.remove("active"));

  // Muestra la pantalla solicitada agregando la clase 'active'
  const screen = document.getElementById(screenId);
  if (screen) {
    screen.classList.add("active");
    APP.currentScreen = screenId; // Actualiza el estado
  }

  // Actualiza la navegación inferior (resalta el tab activo)
  document.querySelectorAll(".nav-item").forEach((n) => n.classList.remove("active"));
  const navItem = document.querySelector(`.nav-item[data-screen="${screenId}"]`);
  if (navItem) navItem.classList.add("active");

  // Muestra u oculta la barra de navegación inferior
  // Solo se muestra en menú, asistente y carrito
  const nav = document.getElementById("bottom-nav");
  if (nav) {
    const showNav = ["menu", "assistant", "cart"].includes(screenId);
    nav.style.display = showNav ? "flex" : "none";
  }

  // Vuelve al tope de la página al cambiar de pantalla
  window.scrollTo(0, 0);
}

// =============================================
// ENTRAR AL MENÚ
// Se ejecuta al presionar "Ver Carta Digital"
// Obtiene la mesa seleccionada y navega al menú
// =============================================
function enterMenu() {
  // Lee el número de mesa del selector
  const select = document.getElementById("table-select");
  APP.tableNumber = select ? select.value : 1;

  // Navega a la pantalla del menú
  showScreen("menu");

  // Muestra un toast de bienvenida con el número de mesa
  showToast(`¡Bienvenido! Mesa ${APP.tableNumber}`, "success");
}

// =============================================
// RENDERIZADO DEL MENÚ
// Genera las tarjetas HTML de los platos
// según la categoría y búsqueda actual
// =============================================
function renderMenu(category = "all", query = "") {
  // Obtiene el contenedor del grid del menú
  const grid = document.getElementById("menu-grid");
  if (!grid) return;

  // Empieza con todos los platos
  let items = MENU;

  // Filtra por categoría si no es "all" (todos)
  if (category !== "all") {
    items = items.filter((d) => d.category === category);
  }

  // Filtra por texto de búsqueda (en nombre, descripción y tags)
  if (query) {
    const q = query.toLowerCase(); // Convierte a minúsculas para comparación
    items = items.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||           // Busca en el nombre
        d.description.toLowerCase().includes(q) ||     // Busca en la descripción
        d.tags.some((t) => t.toLowerCase().includes(q)) // Busca en las etiquetas
    );
  }

  // Genera el HTML de las tarjetas usando template literals
  grid.innerHTML = items
    .map(
      (dish, i) => `
    <div class="menu-card" onclick="showDishDetail(${dish.id})" style="animation-delay: ${i * 0.05}s">
      <!-- Imagen/emoji del plato con efecto 3D -->
      <div class="card-image">
        <span class="dish-3d">${dish.image}</span>
        <!-- Badge de "Popular" si el plato tiene esa etiqueta -->
        ${dish.tags.includes("popular") ? '<span class="card-tag">⭐ Popular</span>' : ""}
        <!-- Badge de "Chef recomienda" si aplica -->
        ${dish.tags.includes("chef recomienda") ? '<span class="card-tag" style="background:var(--accent);color:#333">👨‍🍳 Chef</span>' : ""}
      </div>
      <!-- Información del plato: nombre, precio y rating -->
      <div class="card-body">
        <h3>${dish.name}</h3>
        <div class="card-meta">
          <span class="card-price">${RESTAURANT.currency}${dish.price.toFixed(2)}</span>
          <span class="card-rating">⭐ ${dish.rating}</span>
        </div>
      </div>
    </div>
  `
    )
    .join(""); // Une todas las tarjetas en un solo string

  // Muestra mensaje si no se encontraron platos
  if (items.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1/-1; text-align:center; padding:40px; color:var(--text-muted);">
        <div style="font-size:48px; margin-bottom:12px;">🔍</div>
        <p>No se encontraron platos</p>
      </div>
    `;
  }
}

// =============================================
// FILTRO POR CATEGORÍA
// Se ejecuta al hacer click en un tab de categoría
// =============================================
function selectCategory(catId) {
  APP.selectedCategory = catId; // Guarda la categoría seleccionada

  // Actualiza visualmente los tabs (quita 'active' de todos, agrega al seleccionado)
  document.querySelectorAll(".cat-tab").forEach((t) => t.classList.remove("active"));
  event.currentTarget.classList.add("active");

  // Re-renderiza el menú con el filtro aplicado
  renderMenu(catId, APP.searchQuery);
}

// =============================================
// BÚSQUEDA DE PLATOS
// Filtra el menú en tiempo real según el texto
// =============================================
function searchMenu(query) {
  APP.searchQuery = query; // Guarda la consulta de búsqueda
  renderMenu(APP.selectedCategory, query); // Re-renderiza con el filtro
}

// =============================================
// MODAL DE DETALLE DEL PLATO
// Muestra información completa del plato
// con efecto 3D, info nutricional y botón de agregar
// =============================================
function showDishDetail(dishId) {
  // Busca el plato por su ID en el menú
  const dish = MENU.find((d) => d.id === dishId);
  if (!dish) return; // Si no existe, sale

  // Guarda el plato actual y resetea la cantidad
  APP.currentDish = dish;
  APP.currentQty = 1;

  // Obtiene los elementos del modal
  const modal = document.getElementById("dish-modal");
  const content = document.getElementById("dish-modal-content");

  // Genera el HTML completo del modal
  content.innerHTML = `
    <!-- Área de la imagen con efecto 3D interactivo -->
    <div class="modal-image">
      <span class="dish-3d-detail" id="dish-3d-el" style="font-size:100px">${dish.image}</span>
      <!-- Botón para cerrar el modal -->
      <button class="modal-close" onclick="closeDishModal()">✕</button>
      <!-- Indicador de que se puede rotar -->
      <div class="view-3d-badge">
        <span>🔄</span> Arrastra para rotar 3D
      </div>
    </div>
    <div class="modal-body">
      <!-- Nombre del plato -->
      <h2>${dish.name}</h2>

      <!-- Tags del plato (vegetariano, picante, etc.) y alérgenos -->
      <div class="dish-tags">
        ${dish.tags.map((t) => `<span class="dish-tag">${t}</span>`).join("")}
        ${dish.allergens.map((a) => `<span class="dish-tag" style="border-color:var(--warning);color:var(--warning)">⚠️ ${a}</span>`).join("")}
      </div>

      <!-- Descripción detallada -->
      <p class="dish-description">${dish.description}</p>

      <!-- Grid de información: tiempo, calorías y rating -->
      <div class="dish-info-grid">
        <div class="dish-info-item">
          <span class="info-icon">⏱️</span>
          <span class="info-value">${dish.prepTime} min</span>
          <span class="info-label">Preparación</span>
        </div>
        <div class="dish-info-item">
          <span class="info-icon">🔥</span>
          <span class="info-value">${dish.calories}</span>
          <span class="info-label">Calorías</span>
        </div>
        <div class="dish-info-item">
          <span class="info-icon">⭐</span>
          <span class="info-value">${dish.rating}</span>
          <span class="info-label">Rating</span>
        </div>
      </div>

      <!-- Selector de cantidad (- 1 +) -->
      <div class="quantity-selector">
        <button class="qty-btn" onclick="changeQty(-1)">−</button>
        <span class="qty-value" id="qty-display">1</span>
        <button class="qty-btn" onclick="changeQty(1)">+</button>
      </div>

      <!-- Footer con precio total y botón de agregar -->
      <div class="modal-footer">
        <div class="modal-price">
          <span class="price-currency">${RESTAURANT.currency}</span>${(dish.price * APP.currentQty).toFixed(2)}
        </div>
        <button class="btn btn-primary" onclick="addToCart()">
          🛒 Agregar
        </button>
      </div>
    </div>
  `;

  // Muestra el modal activando la clase
  modal.classList.add("active");

  // Configura el efecto de rotación 3D interactivo
  setup3DRotation();
}

// =============================================
// CERRAR MODAL DE DETALLE
// Oculta el modal quitando la clase 'active'
// =============================================
function closeDishModal() {
  document.getElementById("dish-modal").classList.remove("active");
}

// =============================================
// EFECTO DE ROTACIÓN 3D INTERACTIVA
// Permite al usuario rotar el emoji del plato
// arrastrando con el mouse o el dedo (touch)
// =============================================
function setup3DRotation() {
  // Obtiene el elemento emoji del plato
  const el = document.getElementById("dish-3d-el");
  if (!el) return;

  let isDragging = false;    // Estado: ¿está arrastrando?
  let startX = 0;            // Posición X inicial del arrastre
  let currentRotation = 0;   // Ángulo de rotación actual en grados

  // Función al iniciar el arrastre
  const onStart = (x) => {
    isDragging = true;
    startX = x;
    el.style.transition = "none"; // Desactiva transición para respuesta inmediata
  };

  // Función durante el arrastre (calcula rotación)
  const onMove = (x) => {
    if (!isDragging) return;
    const diff = x - startX;        // Diferencia de posición
    currentRotation += diff * 0.5;   // Aplica factor de suavizado (0.5)
    // Aplica la transformación 3D con perspectiva
    el.style.transform = `perspective(600px) rotateY(${currentRotation}deg)`;
    startX = x;                      // Actualiza posición para el próximo frame
  };

  // Función al soltar (terminar arrastre)
  const onEnd = () => {
    isDragging = false;
    el.style.transition = "transform 0.5s ease"; // Reactiva transición suave
  };

  // --- Eventos de mouse (desktop) ---
  el.addEventListener("mousedown", (e) => onStart(e.clientX));
  document.addEventListener("mousemove", (e) => onMove(e.clientX));
  document.addEventListener("mouseup", onEnd);

  // --- Eventos táctiles (móvil) ---
  el.addEventListener("touchstart", (e) => onStart(e.touches[0].clientX), { passive: true });
  document.addEventListener("touchmove", (e) => onMove(e.touches[0].clientX), { passive: true });
  document.addEventListener("touchend", onEnd);
}

// =============================================
// SELECTOR DE CANTIDAD
// Incrementa o decrementa la cantidad del plato
// (mínimo 1, máximo 10)
// =============================================
function changeQty(delta) {
  // Clamp: mantiene el valor entre 1 y 10
  APP.currentQty = Math.max(1, Math.min(10, APP.currentQty + delta));

  // Actualiza el número mostrado
  document.getElementById("qty-display").textContent = APP.currentQty;

  // Recalcula y actualiza el precio total
  const priceEl = document.querySelector(".modal-price");
  if (priceEl && APP.currentDish) {
    priceEl.innerHTML = `<span class="price-currency">${RESTAURANT.currency}</span>${(APP.currentDish.price * APP.currentQty).toFixed(2)}`;
  }
}

// =============================================
// GESTIÓN DEL CARRITO
// Funciones para agregar, eliminar y modificar
// items en el carrito del pedido
// =============================================

// --- Agregar al carrito ---
// Agrega el plato actual con la cantidad seleccionada
function addToCart() {
  if (!APP.currentDish) return; // Verifica que hay un plato seleccionado

  // Busca si el plato ya existe en el carrito
  const existing = APP.cart.find((item) => item.dish.id === APP.currentDish.id);

  if (existing) {
    // Si ya existe, suma la cantidad nueva a la existente
    existing.quantity += APP.currentQty;
  } else {
    // Si no existe, lo agrega como nuevo item
    APP.cart.push({ dish: APP.currentDish, quantity: APP.currentQty });
  }

  updateCartBadge();  // Actualiza el contador del carrito
  closeDishModal();   // Cierra el modal

  // Muestra notificación de éxito
  showToast(`${APP.currentDish.image} ${APP.currentDish.name} agregado al pedido`, "success");
}

// --- Eliminar del carrito ---
// Elimina un item por su índice en el array
function removeFromCart(index) {
  APP.cart.splice(index, 1); // Remueve 1 elemento en la posición 'index'
  updateCartBadge();         // Actualiza el badge
  renderCart();              // Re-renderiza la vista del carrito
}

// --- Actualizar cantidad de un item ---
// Incrementa o decrementa la cantidad de un item específico
function updateCartItemQty(index, delta) {
  APP.cart[index].quantity = Math.max(1, APP.cart[index].quantity + delta); // Mínimo 1
  updateCartBadge(); // Actualiza el badge
  renderCart();      // Re-renderiza el carrito
}

// --- Calcular total del carrito ---
// Suma precio × cantidad de todos los items
function getCartTotal() {
  return APP.cart.reduce((sum, item) => sum + item.dish.price * item.quantity, 0);
}

// --- Contar items totales ---
// Suma todas las cantidades
function getCartCount() {
  return APP.cart.reduce((sum, item) => sum + item.quantity, 0);
}

// --- Actualizar badge del carrito ---
// Muestra u oculta el contador numérico
function updateCartBadge() {
  const badge = document.getElementById("cart-badge");
  const count = getCartCount();
  if (badge) {
    badge.textContent = count;                           // Actualiza el número
    badge.classList.toggle("hidden", count === 0);       // Oculta si es 0
  }
}

// --- Renderizar vista del carrito ---
// Genera todo el HTML de la pantalla del carrito
function renderCart() {
  const container = document.getElementById("cart-items");
  const summary = document.getElementById("cart-summary");
  if (!container) return;

  // Si el carrito está vacío, muestra mensaje
  if (APP.cart.length === 0) {
    container.innerHTML = `
      <div class="cart-empty">
        <div class="empty-icon">🛒</div>
        <h3>Tu pedido está vacío</h3>
        <p>Explora nuestro menú y agrega platos deliciosos</p>
        <button class="btn btn-primary" onclick="showScreen('menu')" style="margin-top:16px">
          Ver Menú 📖
        </button>
      </div>
    `;
    if (summary) summary.style.display = "none"; // Oculta el resumen
    return;
  }

  // Genera HTML para cada item del carrito
  container.innerHTML = APP.cart
    .map(
      (item, i) => `
    <div class="cart-item">
      <!-- Emoji del plato -->
      <div class="cart-item-emoji">${item.dish.image}</div>
      <!-- Nombre y precio -->
      <div class="cart-item-info">
        <h4>${item.dish.name}</h4>
        <span class="item-price">${RESTAURANT.currency}${(item.dish.price * item.quantity).toFixed(2)}</span>
      </div>
      <!-- Controles de cantidad -->
      <div class="cart-item-qty">
        <button onclick="updateCartItemQty(${i}, -1)">−</button>
        <span>${item.quantity}</span>
        <button onclick="updateCartItemQty(${i}, 1)">+</button>
      </div>
      <!-- Botón eliminar -->
      <button class="cart-item-remove" onclick="removeFromCart(${i})">🗑️</button>
    </div>
  `
    )
    .join("");

  // Genera el resumen con subtotal, impuestos y total
  if (summary) {
    const subtotal = getCartTotal();         // Suma de todos los items
    const tax = subtotal * 0.1;              // Impuesto del 10%
    const total = subtotal + tax;            // Total final

    summary.style.display = "block";          // Muestra el resumen
    summary.innerHTML = `
      <div class="summary-row">
        <span>Subtotal</span>
        <span>${RESTAURANT.currency}${subtotal.toFixed(2)}</span>
      </div>
      <div class="summary-row">
        <span>Impuestos (10%)</span>
        <span>${RESTAURANT.currency}${tax.toFixed(2)}</span>
      </div>
      <div class="summary-row">
        <span>Mesa</span>
        <span>#${APP.tableNumber || 1}</span>
      </div>
      <div class="summary-row total">
        <span>Total</span>
        <span class="total-price">${RESTAURANT.currency}${total.toFixed(2)}</span>
      </div>
      <!-- Botón para ir al pago -->
      <button class="btn btn-primary btn-block" onclick="goToPayment()" style="margin-top:16px">
        Proceder al Pago 💳
      </button>
    `;
  }
}

// =============================================
// PROCESO DE PAGO
// Maneja la selección del método de pago
// y la confirmación de la transacción
// =============================================

// --- Ir a la pantalla de pago ---
function goToPayment() {
  // Verifica que el carrito no esté vacío
  if (APP.cart.length === 0) {
    showToast("Tu pedido está vacío", "error");
    return;
  }
  renderPayment();      // Renderiza el resumen del pedido
  showScreen("payment"); // Navega a la pantalla de pago
}

// --- Renderizar resumen del pago ---
function renderPayment() {
  const orderSummary = document.getElementById("payment-order-summary");
  const subtotal = getCartTotal();
  const tax = subtotal * 0.1;         // 10% de impuestos
  const total = subtotal + tax;

  if (orderSummary) {
    orderSummary.innerHTML = `
      <h3>📋 Resumen del pedido</h3>
      <!-- Lista de items con nombre, cantidad y precio -->
      ${APP.cart.map((item) => `
        <div class="order-item-row">
          <span>${item.dish.image} ${item.dish.name} x${item.quantity}</span>
          <span>${RESTAURANT.currency}${(item.dish.price * item.quantity).toFixed(2)}</span>
        </div>
      `).join("")}
      <!-- Total con impuestos -->
      <div class="order-item-row" style="margin-top:8px; padding-top:8px; border-top:1px solid var(--glass-border); font-weight:600; color:var(--text-primary);">
        <span>Total (inc. impuestos)</span>
        <span style="color:var(--primary)">${RESTAURANT.currency}${total.toFixed(2)}</span>
      </div>
    `;
  }
}

// --- Seleccionar método de pago ---
// Marca visualmente la opción seleccionada
function selectPayment(method) {
  APP.selectedPayment = method; // Guarda el método seleccionado

  // Actualiza las clases CSS de todas las opciones
  document.querySelectorAll(".payment-option").forEach((opt) => {
    opt.classList.toggle("selected", opt.dataset.method === method);
  });
}

// --- Procesar el pago ---
// Simula el procesamiento del pago con loading
function processPayment() {
  // Verifica que se haya seleccionado un método
  if (!APP.selectedPayment) {
    showToast("Selecciona un método de pago", "error");
    return;
  }

  // Muestra overlay de carga
  showLoading("Procesando pago...");

  // Simula un tiempo de procesamiento (2 segundos)
  setTimeout(() => {
    hideLoading(); // Oculta el loading

    // Genera un número de orden aleatorio (ej: SD-4582)
    APP.orderNumber = "SD-" + Math.floor(1000 + Math.random() * 9000);

    showScreen("confirmation");   // Navega a la pantalla de confirmación
    renderConfirmation();         // Muestra el número de orden
    simulateOrderProgress();      // Inicia la simulación del progreso
  }, 2000);
}

// =============================================
// CONFIRMACIÓN DEL PEDIDO
// Muestra el número de orden y simula
// el progreso de preparación en tiempo real
// =============================================

// --- Renderizar número de orden ---
function renderConfirmation() {
  const el = document.getElementById("order-num");
  if (el) el.textContent = APP.orderNumber; // Muestra el número generado
}

// --- Simular progreso del pedido ---
// Activa los pasos uno por uno con delays
function simulateOrderProgress() {
  const steps = document.querySelectorAll(".status-step");

  // Resetea todos los pasos
  steps.forEach((s) => s.classList.remove("active", "completed"));

  // Paso 1: Pedido recibido (inmediato)
  if (steps[0]) steps[0].classList.add("active");

  // Paso 2: En preparación (3 segundos después)
  setTimeout(() => {
    if (steps[0]) steps[0].classList.replace("active", "completed"); // Paso 1 completado
    if (steps[1]) steps[1].classList.add("active");                   // Paso 2 activo
  }, 3000);

  // Paso 3: Listo para servir (6 segundos después)
  setTimeout(() => {
    if (steps[1]) steps[1].classList.replace("active", "completed");
    if (steps[2]) steps[2].classList.add("active");
  }, 6000);

  // Paso 4: Entregado (9 segundos después)
  setTimeout(() => {
    if (steps[2]) steps[2].classList.replace("active", "completed");
    if (steps[3]) steps[3].classList.add("active");
    // Notificación de que el pedido está listo
    showToast("🍽️ ¡Tu pedido está listo!", "success");
  }, 9000);
}

// --- Ir a la pantalla de calificación ---
function goToRating() {
  showScreen("rating");
}

// =============================================
// ASISTENTE VIRTUAL (CHATBOT)
// Chat interactivo con "Chef Digital"
// Responde según palabras clave del usuario
// =============================================

// --- Inicializar el asistente ---
// Muestra el mensaje de bienvenida y navega a la pantalla
function initAssistant() {
  const messages = document.getElementById("chat-messages");

  // Solo muestra el saludo si el chat está vacío
  if (messages && messages.children.length === 0) {
    addBotMessage(randomFrom(ASSISTANT_RESPONSES.greetings));
  }

  showScreen("assistant"); // Navega a la pantalla del asistente
}

// --- Enviar mensaje del usuario ---
function sendChatMessage() {
  const input = document.getElementById("chat-input");
  const text = input.value.trim(); // Elimina espacios al inicio y final
  if (!text) return;               // No envía mensajes vacíos

  addUserMessage(text);  // Agrega el mensaje del usuario al chat
  input.value = "";      // Limpia el input

  // Muestra indicador de "escribiendo..."
  showTyping();

  // Simula un delay de respuesta (1-2 segundos para parecer real)
  setTimeout(() => {
    hideTyping();                              // Oculta el indicador
    const response = getAssistantResponse(text); // Obtiene la respuesta
    addBotMessage(response);                    // Muestra la respuesta del bot
  }, 1000 + Math.random() * 1000);              // Delay aleatorio entre 1 y 2 segundos
}

// --- Enviar respuesta rápida ---
// Se ejecuta al hacer click en un botón de respuesta rápida
function sendQuickReply(text) {
  document.getElementById("chat-input").value = text; // Pone el texto en el input
  sendChatMessage();                                   // Lo envía como mensaje normal
}

// --- Agregar mensaje del usuario al chat ---
function addUserMessage(text) {
  const container = document.getElementById("chat-messages");
  // Obtiene la hora actual formateada (ej: 14:30)
  const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  // Agrega la burbuja del usuario (alineada a la derecha)
  container.innerHTML += `
    <div class="chat-bubble user">
      ${text}
      <span class="bubble-time">${time}</span>
    </div>
  `;

  // Hace scroll al último mensaje
  container.scrollTop = container.scrollHeight;
}

// --- Agregar mensaje del bot al chat ---
function addBotMessage(text) {
  const container = document.getElementById("chat-messages");
  const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  // Agrega la burbuja del bot (alineada a la izquierda)
  container.innerHTML += `
    <div class="chat-bubble bot">
      ${text}
      <span class="bubble-time">${time}</span>
    </div>
  `;

  // Hace scroll al último mensaje
  container.scrollTop = container.scrollHeight;
}

// --- Mostrar indicador de "escribiendo..." ---
function showTyping() {
  const container = document.getElementById("chat-messages");

  // Agrega los 3 puntos animados
  container.innerHTML += `
    <div class="typing-indicator" id="typing">
      <span></span><span></span><span></span>
    </div>
  `;

  // Hace scroll para ver el indicador
  container.scrollTop = container.scrollHeight;
}

// --- Ocultar indicador de "escribiendo..." ---
function hideTyping() {
  const typing = document.getElementById("typing");
  if (typing) typing.remove(); // Elimina el elemento del DOM
}

// =============================================
// LÓGICA DE RESPUESTAS DEL ASISTENTE
// Analiza el texto del usuario con expresiones
// regulares para detectar la intención y
// devolver la respuesta apropiada
// =============================================
function getAssistantResponse(text) {
  const lower = text.toLowerCase(); // Convierte a minúsculas para comparación

  // Detecta saludos
  if (lower.match(/hola|hey|buenas|saludos|hi|hello/)) {
    return randomFrom(ASSISTANT_RESPONSES.greetings);
  }

  // Detecta pedido de recomendaciones
  if (lower.match(/recomien|mejor|sugier|popular|favorit|qué.*pedir|que.*pedir/)) {
    return randomFrom(ASSISTANT_RESPONSES.recommend);
  }

  // Detecta interés en opciones vegetarianas/veganas
  if (lower.match(/vegetarian|vegano|vegana|sin carne|verdura|ensalad/)) {
    return randomFrom(ASSISTANT_RESPONSES.vegetarian);
  }

  // Detecta interés en comida picante
  if (lower.match(/picante|spicy|ají|chile|fuerte/)) {
    return randomFrom(ASSISTANT_RESPONSES.spicy);
  }

  // Detecta interés en postres
  if (lower.match(/postre|dulce|chocolate|pastel|torta|cake/)) {
    return randomFrom(ASSISTANT_RESPONSES.dessert);
  }

  // Detecta búsqueda de opciones económicas
  if (lower.match(/barato|económic|precio|presupuesto|oferta|promoción/)) {
    return randomFrom(ASSISTANT_RESPONSES.cheap);
  }

  // Detecta interés en bebidas
  if (lower.match(/bebida|trago|cóctel|cocktail|vino|cerveza|jugo|limonada|café/)) {
    return randomFrom(ASSISTANT_RESPONSES.drinks);
  }

  // Detecta interés en opciones saludables
  if (lower.match(/salud|saludable|fit|diet|calor|ligero|light|bajo en/)) {
    return randomFrom(ASSISTANT_RESPONSES.healthy);
  }

  // Detecta agradecimiento
  if (lower.match(/gracias|thanks|genial|perfecto|excelente/)) {
    return "¡De nada! 😊 Estoy aquí para lo que necesites. ¡Que disfrutes tu comida!";
  }

  // Detecta petición de ver el menú
  if (lower.match(/carta|menú|menu|ver platos/)) {
    return "Puedes ver toda nuestra carta en la sección de **Menú** 📖. Tenemos entradas, platos fuertes, postres y bebidas. ¿Quieres que te recomiende algo en particular?";
  }

  // Respuesta por defecto si no se detecta ninguna intención
  return randomFrom(ASSISTANT_RESPONSES.default);
}

// =============================================
// SISTEMA DE CALIFICACIÓN
// Estrellas interactivas con emojis dinámicos
// y envío de comentarios
// =============================================

// --- Establecer calificación ---
// Se ejecuta al hacer click en una estrella
function setRating(stars) {
  APP.rating = stars; // Guarda la calificación

  // Activa las estrellas hasta la seleccionada
  document.querySelectorAll(".star").forEach((s, i) => {
    s.classList.toggle("active", i < stars); // Activa las estrellas de 0 a stars-1
  });

  // Labels descriptivos para cada nivel
  const labels = ["", "Muy malo 😞", "Malo 😕", "Regular 😐", "Bueno 😊", "Excelente 🤩"];
  // Emojis correspondientes
  const emojis = ["", "😞", "😕", "😐", "😊", "🤩"];

  // Actualiza el label de texto
  document.getElementById("rating-label").textContent = labels[stars] || "";
  // Actualiza el emoji grande
  document.getElementById("rating-emoji").textContent = emojis[stars] || "🍽️";
}

// --- Enviar calificación ---
function submitRating() {
  // Verifica que se haya seleccionado al menos una estrella
  if (APP.rating === 0) {
    showToast("Por favor selecciona una calificación", "error");
    return;
  }

  // Obtiene el comentario opcional
  const comment = document.getElementById("rating-comment").value;

  // Muestra overlay de carga
  showLoading("Enviando calificación...");

  // Simula el envío (1.5 segundos)
  setTimeout(() => {
    hideLoading();

    // Oculta el formulario y muestra el agradecimiento
    document.getElementById("rating-form").style.display = "none";
    document.getElementById("rating-thanks").classList.add("active");

    // Notificación de éxito
    showToast("¡Gracias por tu calificación!", "success");
  }, 1500);
}

// =============================================
// REINICIAR EXPERIENCIA
// Resetea todo el estado para empezar de nuevo
// =============================================
function restartExperience() {
  // Resetea el estado del carrito y pedido
  APP.cart = [];
  APP.rating = 0;
  APP.selectedPayment = null;
  APP.orderNumber = null;

  // Actualiza el badge del carrito
  updateCartBadge();

  // Limpia el historial del chat
  const messages = document.getElementById("chat-messages");
  if (messages) messages.innerHTML = "";

  // Resetea la pantalla de calificación
  document.getElementById("rating-form").style.display = "block";       // Muestra el formulario
  document.getElementById("rating-thanks").classList.remove("active");   // Oculta el agradecimiento
  document.querySelectorAll(".star").forEach((s) => s.classList.remove("active")); // Desactiva estrellas
  document.getElementById("rating-label").textContent = "";              // Limpia label
  document.getElementById("rating-emoji").textContent = "🍽️";          // Emoji por defecto
  document.getElementById("rating-comment").value = "";                  // Limpia comentario

  // Vuelve a la pantalla de bienvenida
  showScreen("welcome");
}

// =============================================
// UTILIDADES
// Funciones auxiliares reutilizables
// =============================================

// --- Seleccionar elemento aleatorio de un array ---
// Usado para dar variedad a las respuestas del chatbot
function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// --- Mostrar notificación toast ---
// Crea un mensaje temporal en la esquina superior derecha
function showToast(message, type = "info") {
  const container = document.getElementById("toast-container");

  // Iconos según el tipo de notificación
  const icons = { success: "✅", error: "❌", info: "ℹ️" };

  // Crea el elemento del toast
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${icons[type] || ""}</span> ${message}`;
  container.appendChild(toast);

  // Elimina el toast después de 3 segundos con animación de salida
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(100px)";     // Se desliza a la derecha
    setTimeout(() => toast.remove(), 300);            // Lo remueve del DOM
  }, 3000);
}

// --- Mostrar overlay de carga ---
// Bloquea la pantalla con un spinner y mensaje
function showLoading(text = "Cargando...") {
  const overlay = document.getElementById("loading-overlay");
  const loadingText = overlay.querySelector("p");
  if (loadingText) loadingText.textContent = text; // Actualiza el texto
  overlay.classList.add("active");                   // Muestra el overlay
}

// --- Ocultar overlay de carga ---
function hideLoading() {
  document.getElementById("loading-overlay").classList.remove("active");
}

// =============================================
// EVENT LISTENERS
// Configura todos los eventos de la aplicación
// Se ejecuta una sola vez al iniciar
// =============================================
function setupEventListeners() {

  // --- Búsqueda en tiempo real ---
  // Escucha cada tecla en el input de búsqueda
  const searchInput = document.getElementById("search-input");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => searchMenu(e.target.value));
  }

  // --- Enviar mensaje con Enter ---
  // Escucha la tecla Enter en el input del chat
  const chatInput = document.getElementById("chat-input");
  if (chatInput) {
    chatInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") sendChatMessage();
    });
  }

  // --- Cerrar modal al hacer click fuera ---
  // Si se hace click en el overlay (no en el contenido), cierra el modal
  const modalOverlay = document.getElementById("dish-modal");
  if (modalOverlay) {
    modalOverlay.addEventListener("click", (e) => {
      if (e.target === modalOverlay) closeDishModal();
    });
  }

  // --- Navegación al carrito ---
  // Renderiza el carrito antes de mostrarlo
  const cartNavItem = document.querySelector('.nav-item[data-screen="cart"]');
  if (cartNavItem) {
    cartNavItem.addEventListener("click", () => {
      renderCart();
      showScreen("cart");
    });
  }
}
