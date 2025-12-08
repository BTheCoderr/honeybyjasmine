# HoneyByJasmine

A modern, conversion-focused landing page for HoneyByJasmine, a personal healthy meal prep brand.

## Features

- 🎨 Modern, mobile-first design with Tailwind CSS
- 📧 Email subscription with Resend integration
- 🖼️ Image optimization with lazy loading
- ♿ Accessibility features (ARIA labels, keyboard navigation)
- 🎯 SEO optimized with meta tags
- 🛒 Order flow functionality
- 📱 Fully responsive design

## Tech Stack

- React 18.2.0
- Tailwind CSS 3.4.1
- React Router 6.20.0
- Resend (for email)
- Netlify Functions (for serverless API)

## Getting Started

### Local Development

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
Create a `.env` file in the root directory:
```env
RESEND_API_KEY=re_your_api_key_here
RESEND_FROM_EMAIL=HoneyByJasmine <hello@honeybyjasmine.com>
RESEND_NOTIFICATION_EMAIL=jasmine@honeybyjasmine.com
PORT=3001
```

3. Run the development servers:
```bash
npm run dev
```

This will start:
- Backend API on `http://localhost:3001`
- React app on `http://localhost:3002`

### Building for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## Deployment to Netlify

1. **Push to GitHub:**
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin git@github.com:BTheCoderr/honeybyjasmine.git
git push -u origin main
```

2. **Connect to Netlify:**
   - Go to [Netlify](https://app.netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect your GitHub repository
   - Netlify will auto-detect the settings from `netlify.toml`

3. **Set Environment Variables in Netlify:**
   - Go to Site settings → Environment variables
   - Add:
     - `RESEND_API_KEY`
     - `RESEND_FROM_EMAIL`
     - `RESEND_NOTIFICATION_EMAIL`

4. **Deploy:**
   - Netlify will automatically deploy on every push to main
   - Or click "Deploy site" to deploy immediately

## Project Structure

```
honeybyjasmine/
├── netlify/
│   └── functions/
│       └── subscribe.js      # Netlify serverless function for email
├── public/
│   ├── images/
│   │   ├── meals/            # Meal photos
│   │   ├── hero/             # Hero section image
│   │   └── about/            # About section image
│   └── index.html
├── src/
│   ├── components/
│   │   └── LandingPage.js    # Main landing page component
│   ├── App.js
│   └── index.css
├── netlify.toml              # Netlify configuration
├── server.js                 # Local development server
└── package.json
```

## Environment Variables

### Development (.env file)
- `RESEND_API_KEY` - Your Resend API key
- `RESEND_FROM_EMAIL` - Sender email address
- `RESEND_NOTIFICATION_EMAIL` - Email to receive subscriber notifications
- `PORT` - Backend server port (default: 3001)

### Production (Netlify)
Set the same variables in Netlify's environment variables settings.

## Scripts

- `npm start` - Start React development server (port 3002)
- `npm run server` - Start backend API server (port 3001)
- `npm run dev` - Run both servers concurrently
- `npm run build` - Build for production
- `npm run organize-images` - Organize meal images
- `npm run auto-match` - Auto-match images to meals

## Image Setup

Place your images in:
- `public/images/hero/hero-main.jpg` - Hero section
- `public/images/meals/` - Meal photos (see images/README.md)
- `public/images/about/jasmine-photo.jpg` - About section

## License

Private project - All rights reserved
