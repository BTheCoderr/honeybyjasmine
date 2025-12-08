# Deploying HoneyByJasmine to Netlify

## Quick Deploy Steps

### 1. Push to GitHub

```bash
# If you haven't initialized git yet
git init
git add .
git commit -m "Ready for Netlify deployment"

# Add your GitHub remote (you already have the repo)
git remote add origin git@github.com:BTheCoderr/honeybyjasmine.git
git branch -M main
git push -u origin main
```

### 2. Deploy to Netlify

1. Go to [Netlify](https://app.netlify.com) and sign in
2. Click **"Add new site"** → **"Import an existing project"**
3. Connect to **GitHub** and select your `honeybyjasmine` repository
4. Netlify will auto-detect settings from `netlify.toml`:
   - **Build command**: `npm run build`
   - **Publish directory**: `build`
   - **Functions directory**: `netlify/functions`

### 3. Set Environment Variables

In Netlify dashboard:
1. Go to **Site settings** → **Environment variables**
2. Add these variables:

```
RESEND_API_KEY=re_your_api_key_here
RESEND_FROM_EMAIL=HoneyByJasmine <your-email@yourdomain.com>
RESEND_NOTIFICATION_EMAIL=your-email@yourdomain.com
RESEND_JASMINE_EMAIL=jasmine-email@yourdomain.com
```

### 4. Deploy!

- Click **"Deploy site"**
- Netlify will build and deploy automatically
- Your site will be live at `https://your-site-name.netlify.app`

## What's Configured

✅ **Netlify Functions** - Email subscription API (`netlify/functions/subscribe.js`)
✅ **Build Settings** - Auto-detected from `netlify.toml`
✅ **Client-side Routing** - All routes redirect to `index.html`
✅ **Environment Variables** - Ready for your Resend API key

## After Deployment

1. **Test the email form** - Submit a test subscription
2. **Check your Resend dashboard** - Verify emails are sending
3. **Update domain** (optional) - Add custom domain in Netlify settings

## Troubleshooting

- **Build fails?** Check Netlify build logs
- **Email not working?** Verify environment variables are set correctly
- **Images not showing?** Make sure images are in `public/images/` folder

## Continuous Deployment

Once connected, every push to `main` branch will automatically deploy! 🚀

