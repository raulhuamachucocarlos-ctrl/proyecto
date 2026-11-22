// =============================================
// DATA.JS - Base de datos del restaurante
// Contiene toda la información estática:
// menú, categorías, y respuestas del asistente
// =============================================

// --- Información general del restaurante ---
const RESTAURANT = {
  name: "Sabor Digital",           // Nombre del restaurante
  slogan: "Una experiencia gastronómica inteligente", // Eslogan
  logo: "🍽️",                     // Emoji usado como logo
  tables: 20,                      // Número total de mesas disponibles
  currency: "$",                   // Símbolo de moneda para precios
};

// --- Categorías del menú ---
// Cada categoría tiene un id único, nombre, icono y emoji
const CATEGORIES = [
  { id: "entradas", name: "Entradas", icon: "🥗", emoji: "🥗" },        // Platos de entrada
  { id: "principales", name: "Platos Fuertes", icon: "🥩", emoji: "🍖" }, // Platos principales
  { id: "postres", name: "Postres", icon: "🍰", emoji: "🧁" },          // Postres y dulces
  { id: "bebidas", name: "Bebidas", icon: "🍹", emoji: "🥤" },          // Bebidas y cócteles
];

// --- Menú completo del restaurante ---
// Cada plato contiene: id, nombre, descripción, precio, categoría,
// imagen (emoji), etiquetas, calificación, tiempo de preparación,
// calorías y alérgenos
const MENU = [

  // ========== ENTRADAS ==========

  {
    id: 1,                          // Identificador único del plato
    name: "Bruschetta Mediterránea", // Nombre del plato
    description: "Pan artesanal tostado con tomates cherry, albahaca fresca, mozzarella y reducción de balsámico.", // Descripción detallada
    price: 12.50,                   // Precio en la moneda del restaurante
    category: "entradas",           // Categoría a la que pertenece
    image: "🫓",                    // Emoji representativo del plato
    tags: ["vegetariano", "popular"], // Etiquetas para filtrar y destacar
    rating: 4.7,                    // Calificación promedio (de 1 a 5)
    prepTime: 10,                   // Tiempo de preparación en minutos
    calories: 280,                  // Calorías del plato
    allergens: ["gluten", "lácteos"], // Lista de alérgenos
  },
  {
    id: 2,
    name: "Ceviche Tropical",
    description: "Corvina fresca marinada en limón con mango, cilantro, cebolla morada y un toque de ají.",
    price: 16.00,
    category: "entradas",
    image: "🐟",
    tags: ["mariscos", "picante", "popular"], // Tiene múltiples etiquetas
    rating: 4.9,                    // Uno de los platos mejor calificados
    prepTime: 15,
    calories: 190,
    allergens: ["mariscos"],        // Contiene alérgeno de mariscos
  },
  {
    id: 3,
    name: "Tabla de Quesos Artesanales",
    description: "Selección de 5 quesos premium acompañados de frutos secos, miel de trufa y crackers.",
    price: 18.00,
    category: "entradas",
    image: "🧀",
    tags: ["vegetariano", "para compartir"], // Ideal para compartir
    rating: 4.5,
    prepTime: 8,
    calories: 450,
    allergens: ["lácteos", "frutos secos"], // Múltiples alérgenos
  },
  {
    id: 4,
    name: "Gyozas de Cerdo",
    description: "Empanadillas japonesas rellenas de cerdo y verduras, servidas con salsa ponzu.",
    price: 14.00,
    category: "entradas",
    image: "🥟",
    tags: ["asiático"],             // Etiqueta de cocina asiática
    rating: 4.6,
    prepTime: 12,
    calories: 320,
    allergens: ["gluten", "soja"],
  },
  {
    id: 5,
    name: "Ensalada César Imperial",
    description: "Lechuga romana, crutones de ajo, parmesano, anchoas y aderezo césar casero.",
    price: 13.50,
    category: "entradas",
    image: "🥬",
    tags: ["clásico"],              // Plato clásico del menú
    rating: 4.3,
    prepTime: 7,                    // Rápido de preparar
    calories: 350,
    allergens: ["gluten", "lácteos", "mariscos"],
  },

  // ========== PLATOS FUERTES ==========

  {
    id: 6,
    name: "Filete Angus Premium",
    description: "300g de res Angus a la parrilla con puré trufado, espárragos y salsa de vino tinto.",
    price: 38.00,                   // Plato premium, precio más alto
    category: "principales",
    image: "🥩",
    tags: ["premium", "popular", "chef recomienda"], // Recomendado por el chef
    rating: 4.9,                    // Máxima calificación
    prepTime: 25,                   // Mayor tiempo de preparación
    calories: 680,
    allergens: ["lácteos"],
  },
  {
    id: 7,
    name: "Salmón Glaseado con Miso",
    description: "Filete de salmón noruego glaseado con miso blanco, arroz jazmín y vegetales al wok.",
    price: 32.00,
    category: "principales",
    image: "🍣",
    tags: ["saludable", "popular", "mariscos"], // Opción saludable y popular
    rating: 4.8,
    prepTime: 20,
    calories: 520,
    allergens: ["mariscos", "soja"],
  },
  {
    id: 8,
    name: "Risotto de Hongos Silvestres",
    description: "Arroz arborio cremoso con mix de hongos silvestres, parmesano y aceite de trufa.",
    price: 26.00,
    category: "principales",
    image: "🍄",
    tags: ["vegetariano", "chef recomienda"], // Vegetariano recomendado
    rating: 4.7,
    prepTime: 22,
    calories: 480,
    allergens: ["lácteos"],
  },
  {
    id: 9,
    name: "Pollo Tikka Masala",
    description: "Pechuga de pollo en salsa cremosa de especias indias con arroz basmati y naan.",
    price: 24.00,
    category: "principales",
    image: "🍗",
    tags: ["picante", "asiático"],  // Plato picante de cocina asiática
    rating: 4.6,
    prepTime: 20,
    calories: 590,
    allergens: ["lácteos", "gluten"],
  },
  {
    id: 10,
    name: "Pasta Truffle Carbonara",
    description: "Spaghetti al dente con guanciale crujiente, yema de huevo, pecorino y trufa negra.",
    price: 28.00,
    category: "principales",
    image: "🍝",
    tags: ["premium", "popular"],   // Plato premium popular
    rating: 4.8,
    prepTime: 18,
    calories: 620,
    allergens: ["gluten", "lácteos", "huevo"],
  },
  {
    id: 11,
    name: "Bowl Vegano Power",
    description: "Quinoa, aguacate, garbanzos crispy, kale, hummus, semillas y aderezo tahini.",
    price: 20.00,
    category: "principales",
    image: "🥑",
    tags: ["vegano", "saludable"],  // 100% vegano y saludable
    rating: 4.4,
    prepTime: 12,
    calories: 410,
    allergens: ["sésamo"],          // Solo contiene sésamo
  },

  // ========== POSTRES ==========

  {
    id: 12,
    name: "Lava Cake de Chocolate",
    description: "Bizcocho tibio de chocolate 70% con centro fundido, helado de vainilla y frutos rojos.",
    price: 14.00,
    category: "postres",
    image: "🍫",
    tags: ["popular", "chef recomienda"], // Postre estrella del restaurante
    rating: 4.9,
    prepTime: 15,                   // Necesita tiempo por el horneado
    calories: 520,
    allergens: ["gluten", "lácteos", "huevo"],
  },
  {
    id: 13,
    name: "Tiramisú Clásico",
    description: "Capas de bizcocho empapado en espresso, crema de mascarpone y cacao amargo.",
    price: 12.00,
    category: "postres",
    image: "☕",
    tags: ["clásico", "popular"],   // Postre clásico italiano
    rating: 4.7,
    prepTime: 5,                    // Ya está preparado, solo servir
    calories: 380,
    allergens: ["gluten", "lácteos", "huevo"],
  },
  {
    id: 14,
    name: "Cheesecake de Maracuyá",
    description: "Base de galleta, crema de queso suave y coulis de maracuyá fresco.",
    price: 13.00,
    category: "postres",
    image: "🍰",
    tags: ["tropical"],             // Sabor tropical
    rating: 4.6,
    prepTime: 5,
    calories: 420,
    allergens: ["gluten", "lácteos"],
  },
  {
    id: 15,
    name: "Crème Brûlée",
    description: "Clásica crema de vainilla con costra de caramelo crujiente recién caramelizada.",
    price: 11.00,                   // Postre más accesible
    category: "postres",
    image: "🍮",
    tags: ["clásico"],
    rating: 4.5,
    prepTime: 5,
    calories: 310,
    allergens: ["lácteos", "huevo"],
  },

  // ========== BEBIDAS ==========

  {
    id: 16,
    name: "Mojito Clásico",
    description: "Ron blanco, lima fresca, hierbabuena, azúcar de caña y soda.",
    price: 10.00,
    category: "bebidas",
    image: "🍸",
    tags: ["cóctel", "popular"],    // Cóctel más pedido
    rating: 4.6,
    prepTime: 5,
    calories: 180,
    allergens: [],                  // Sin alérgenos
  },
  {
    id: 17,
    name: "Limonada de Lavanda",
    description: "Limonada artesanal infusionada con lavanda y un toque de miel.",
    price: 7.00,
    category: "bebidas",
    image: "🍋",
    tags: ["sin alcohol", "refrescante"], // Opción sin alcohol
    rating: 4.4,
    prepTime: 3,
    calories: 120,
    allergens: [],
  },
  {
    id: 18,
    name: "Smoothie Tropical",
    description: "Mango, piña, maracuyá y leche de coco. Pura energía natural.",
    price: 9.00,
    category: "bebidas",
    image: "🥤",
    tags: ["sin alcohol", "saludable", "vegano"], // Vegano y saludable
    rating: 4.5,
    prepTime: 4,
    calories: 210,
    allergens: [],
  },
  {
    id: 19,
    name: "Vino Tinto Reserva",
    description: "Copa de Malbec reserva, notas de frutos negros y roble. Mendoza, Argentina.",
    price: 12.00,
    category: "bebidas",
    image: "🍷",
    tags: ["vino", "premium"],      // Vino premium
    rating: 4.8,
    prepTime: 2,                    // Solo servir
    calories: 125,
    allergens: ["sulfitos"],        // Contiene sulfitos (alérgeno del vino)
  },
  {
    id: 20,
    name: "Espresso Doble",
    description: "Doble shot de café de especialidad, origen Colombia. Intenso y aromático.",
    price: 5.00,                    // Producto más económico del menú
    category: "bebidas",
    image: "☕",
    tags: ["café", "sin alcohol"],
    rating: 4.3,
    prepTime: 3,
    calories: 10,                   // Casi sin calorías
    allergens: [],
  },
];

// =============================================
// RESPUESTAS DEL ASISTENTE VIRTUAL
// Organizadas por categoría/intención del usuario
// Cada categoría tiene un array de respuestas posibles
// para dar variedad a las conversaciones
// =============================================
const ASSISTANT_RESPONSES = {

  // --- Respuestas de saludo ---
  // Se activan cuando el usuario saluda
  greetings: [
    "¡Hola! 👋 Soy tu asistente virtual de Sabor Digital. ¿En qué puedo ayudarte hoy?",
    "¡Bienvenido! 🎉 Estoy aquí para ayudarte a elegir los mejores platos. ¿Qué te apetece?",
  ],

  // --- Recomendaciones generales ---
  // Se activan cuando el usuario pide sugerencias
  recommend: [
    "Te recomiendo nuestros platos más populares: 🥩 **Filete Angus Premium** y 🍣 **Salmón Glaseado con Miso**. ¡Son los favoritos de nuestros clientes!",
    "Hoy el chef recomienda el 🍄 **Risotto de Hongos Silvestres** y el 🍫 **Lava Cake de Chocolate** de postre. ¡Una combinación perfecta!",
  ],

  // --- Opciones vegetarianas ---
  // Se activan con palabras clave como "vegetariano", "vegano"
  vegetarian: [
    "¡Tenemos opciones vegetarianas deliciosas! 🥗 **Bruschetta Mediterránea**, 🧀 **Tabla de Quesos**, 🍄 **Risotto de Hongos** y el 🥑 **Bowl Vegano Power**.",
  ],

  // --- Opciones picantes ---
  // Se activan con palabras clave como "picante", "ají"
  spicy: [
    "Si te gusta el picante, prueba el 🐟 **Ceviche Tropical** con ají o el 🍗 **Pollo Tikka Masala** con especias indias. ¡Fuego puro! 🔥",
  ],

  // --- Sugerencias de postres ---
  // Se activan con palabras clave como "postre", "dulce"
  dessert: [
    "¡Nuestros postres son irresistibles! El favorito es el 🍫 **Lava Cake de Chocolate** con centro fundido. También el ☕ **Tiramisú** es espectacular.",
  ],

  // --- Opciones económicas ---
  // Se activan con palabras clave como "barato", "económico"
  cheap: [
    "Excelentes opciones a buen precio: ☕ **Espresso Doble** ($5), 🍋 **Limonada de Lavanda** ($7) y 🍮 **Crème Brûlée** ($11). ¡Calidad sin romper el bolsillo!",
  ],

  // --- Sugerencias de bebidas ---
  // Se activan con palabras clave como "bebida", "trago"
  drinks: [
    "En bebidas te sugiero el 🍸 **Mojito Clásico** o la 🍋 **Limonada de Lavanda** si prefieres sin alcohol. También tenemos un excelente 🍷 **Malbec Reserva**.",
  ],

  // --- Opciones saludables ---
  // Se activan con palabras clave como "saludable", "fit"
  healthy: [
    "Para opciones saludables: 🥑 **Bowl Vegano Power** (410 cal), 🐟 **Ceviche Tropical** (190 cal) y el 🍣 **Salmón Glaseado** (520 cal). ¡Nutritivos y deliciosos!",
  ],

  // --- Respuestas por defecto ---
  // Se usan cuando no se detecta ninguna intención específica
  default: [
    "No estoy seguro de entender. ¿Te gustaría que te recomiende algo? Puedes preguntarme por: 🍽️ recomendaciones, 🥗 opciones vegetarianas, 🌶️ platos picantes, 🍰 postres, 🍹 bebidas o 💰 opciones económicas.",
    "Puedo ayudarte con recomendaciones de platos, opciones vegetarianas, postres, bebidas y más. ¿Qué te gustaría saber?",
  ],
};
