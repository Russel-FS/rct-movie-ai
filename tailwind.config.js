/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,ts,tsx}', './src/**/*.{js,ts,tsx}', './components/**/*.{js,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        apple: {
          blue: '#007AFF',
          gray: {
            50: '#F9FAFB',
            100: '#F3F4F6',
            200: '#E5E7EB',
            300: '#D1D5DB',
            400: '#9CA3AF',
            500: '#6B7280',
            600: '#4B5563',
            700: '#374151',
            800: '#1F2937',
            900: '#111827',
          },
          system: {
            background: '#FFFFFF',
            secondaryBackground: '#F2F2F7',
            tertiaryBackground: '#FFFFFF',
            groupedBackground: '#F2F2F7',
            separator: '#C6C6C8',
            label: '#000000',
            secondaryLabel: '#3C3C43',
            tertiaryLabel: '#3C3C43',
            quaternaryLabel: '#3C3C43',
          },
        },
      },
      fontFamily: {
        'sf-pro': ['SF Pro Display', 'system-ui', 'sans-serif'],
        'sf-pro-text': ['SF Pro Text', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'apple-title1': ['28px', { lineHeight: '34px', fontWeight: '700' }],
        'apple-title2': ['22px', { lineHeight: '28px', fontWeight: '700' }],
        'apple-title3': ['20px', { lineHeight: '25px', fontWeight: '600' }],
        'apple-headline': ['17px', { lineHeight: '22px', fontWeight: '600' }],
        'apple-body': ['17px', { lineHeight: '22px', fontWeight: '400' }],
        'apple-callout': ['16px', { lineHeight: '21px', fontWeight: '400' }],
        'apple-subhead': ['15px', { lineHeight: '20px', fontWeight: '400' }],
        'apple-footnote': ['13px', { lineHeight: '18px', fontWeight: '400' }],
        'apple-caption1': ['12px', { lineHeight: '16px', fontWeight: '400' }],
        'apple-caption2': ['11px', { lineHeight: '13px', fontWeight: '400' }],
      },
      borderRadius: {
        apple: '10px',
        'apple-lg': '16px',
        'apple-xl': '20px',
      },
      boxShadow: {
        apple: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'apple-lg': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
    },
  },
  plugins: [],
};