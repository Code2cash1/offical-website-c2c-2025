# 🚀 Code2Cash Deployment Guide

## 📋 Deployment URLs

- **Frontend**: https://code2cash.vercel.app
- **Backend**: https://offical-website-c2c-2025.vercel.app

## 🔧 Environment Variables for Vercel

### Frontend (code2cash.vercel.app)
```
VITE_API_URL=https://offical-website-c2c-2025.vercel.app
```

### Backend (offical-website-c2c-2025.vercel.app)
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=production
```

## 📁 Project Structure

```
├── src/                    # Frontend React app
├── backend_temp/          # Backend Node.js API
├── dist/                  # Built frontend files
├── vercel.json           # Vercel configuration
├── .env.production       # Production environment variables
└── package.json          # Frontend dependencies
```

## 🛠️ Deployment Steps

1. **Push to GitHub**: ✅ Done
2. **Connect to Vercel**: Link GitHub repo to Vercel
3. **Set Environment Variables**: Add VITE_API_URL in Vercel dashboard
4. **Deploy**: Automatic deployment on push to main branch

## 🔍 Features Deployed

✅ **Admin Dashboard** - Real-time statistics and management
✅ **Job Applications** - Apply for positions with resume upload
✅ **Resume Management** - View and download resumes
✅ **Contact System** - Contact form with admin management
✅ **Meeting Scheduler** - Schedule meetings with team
✅ **Authentication** - Secure admin login system

## 🐛 Troubleshooting

- **CORS Issues**: Backend already configured for frontend domain
- **API Calls**: All API calls use production backend URL
- **File Uploads**: Resume uploads working with proper file handling
- **Authentication**: JWT tokens working across domains

## 📞 Support

For any deployment issues, check:
1. Vercel build logs
2. Browser console for errors
3. Network tab for API call failures