# HoneyByJasmine Setup Guide

## Backend Setup (Resend Email Integration)

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```env
# Resend API Configuration
RESEND_API_KEY=re_your_api_key_here
RESEND_FROM_EMAIL=HoneyByJasmine <hello@honeybyjasmine.com>
RESEND_NOTIFICATION_EMAIL=jasmine@honeybyjasmine.com

# Server Configuration
PORT=3001
```

**Important:** 
- Get your Resend API key from [resend.com](https://resend.com)
- Replace `re_your_api_key_here` with your actual API key
- Update the email addresses to match your domain

### 3. Running the Application

#### Development Mode (Both Frontend and Backend)

```bash
npm run dev
```

This will start:
- Backend server on `http://localhost:3001`
- React app on `http://localhost:3000`

#### Running Separately

**Backend only:**
```bash
npm run server
```

**Frontend only:**
```bash
npm start
```

## Image Setup

### Adding Food Photography

1. Place hero image at: `public/images/hero/hero-main.jpg`
2. Place meal photos in: `public/images/meals/`
   - `salmon-bowl.jpg`
   - `chicken-wrap.jpg`
   - `veggie-bowl.jpg`
   - `turkey-meatballs.jpg`
   - `thai-curry.jpg`
   - `bbq-chicken.jpg`
3. Place Jasmine's photo at: `public/images/about/jasmine-photo.jpg`

**Image Recommendations:**
- Format: WebP or JPG
- Hero: 1200x1200px (square) or 1600x900px
- Meals: 800x600px (4:3 ratio)
- About: 800x800px (square) or 600x800px (portrait)
- Optimize file sizes to under 200KB each

The site will display gradient placeholders until images are added.

## Features Implemented

✅ **Resend Email Integration**
- Email subscription form connected to Resend API
- Welcome emails sent to subscribers
- Notification emails to Jasmine (optional)

✅ **SEO Meta Tags**
- Complete Open Graph tags for social sharing
- Twitter Card support
- Comprehensive meta descriptions

✅ **Image Structure**
- Organized image directories
- Fallback placeholders for missing images
- Lazy loading implemented

✅ **Order Flow**
- React Router navigation
- Order page with menu and cart
- Checkout and confirmation pages
- All "Order Now" buttons connected

## Testing the Email Form

1. Start the backend server: `npm run server`
2. Start the frontend: `npm start`
3. Fill out the email subscription form on the landing page
4. Check your email for the welcome message
5. Check the notification email (if configured) for new subscriber alerts

## Troubleshooting

### Email Not Sending
- Verify your Resend API key is correct
- Check that your domain is verified in Resend
- Ensure the `RESEND_FROM_EMAIL` uses a verified domain
- Check server console for error messages

### Images Not Showing
- Verify image paths match the expected filenames
- Check that images are in the `public/images/` directory
- Ensure file extensions match (.jpg, .png, .webp)

### Routing Issues
- Clear browser cache
- Ensure React Router is properly installed
- Check browser console for errors

## Next Steps

- Add real food photography
- Configure production environment variables
- Set up domain and email verification in Resend
- Add analytics tracking
- Implement payment processing (Stripe, etc.)

