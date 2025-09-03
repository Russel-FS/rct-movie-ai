/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,ts,tsx}', './src/**/*.{js,ts,tsx}', './components/**/*.{js,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Colores de fondo principales
        'primary-dark': '#030712', // bg-gray-950
        'secondary-dark': '#111827', // bg-gray-900
        'card-bg': '#1f2937', // bg-gray-800

        // Colores de texto
        'text-primary': '#ffffff', // text-white
        'text-secondary': '#9ca3af', // text-gray-400
        'text-muted': '#6b7280', // text-gray-500
        'text-accent': '#6366f1', // text-indigo-500

        // Colores de bordes
        'border-primary': '#374151', // border-gray-700
        'border-secondary': '#4b5563', // border-gray-600
        'border-accent': '#6366f1', // border-indigo-500

        // Colores de estado/badges
        success: '#16a34a', // bg-green-500/600
        warning: '#eab308', // bg-yellow-500
        'hot-badge': '#f97316', // bg-orange-500

        // Gradientes personalizados (como valores CSS)
        'gradient-primary': 'linear-gradient(to right, #6366f1, #8b5cf6)', // from-indigo-500 to-purple-600
        'gradient-card': 'linear-gradient(to bottom right, #374151, #4b5563)', // from-gray-700 to-gray-600

        // Colores con opacidad personalizados
        overlay: 'rgba(31, 41, 55, 0.7)', // bg-gray-800 bg-opacity-70
        glass: 'rgba(255, 255, 255, 0.05)', // bg-white bg-opacity-5
        'accent-overlay': 'rgba(99, 102, 241, 0.2)', // bg-indigo-500 bg-opacity-20
        'accent-border': 'rgba(99, 102, 241, 0.3)', // border-indigo-500 border-opacity-30
      },

      // Espaciado personalizado para tu diseño
      spacing: {
        13: '3.25rem', // h-13 para el input
        15: '3.75rem', // w-15 para el poster pequeño
        22: '5.5rem', // h-22 para el poster pequeño
        50: '12.5rem', // h-50 para posters medianos
        55: '13.75rem', // h-55 para posters grandes
      },

      // Radius personalizados
      borderRadius: {
        '2xl': '1rem', // rounded-2xl
        '3xl': '1.5rem', // rounded-3xl
      },
    },
  },
  plugins: [],
};