# 🚀 TerraSync Deployment Guide

Complete guide for deploying TerraSync to production environments.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [Database Setup](#database-setup)
- [Backend Deployment](#backend-deployment)
- [Frontend Deployment](#frontend-deployment)
- [Domain Configuration](#domain-configuration)
- [Monitoring & Maintenance](#monitoring--maintenance)
- [Troubleshooting](#troubleshooting)

## 🔧 Prerequisites

### Required Accounts
- **GitHub**: Repository hosting
- **Railway**: Backend deployment
- **Vercel/Netlify**: Frontend deployment
- **Supabase**: Database (optional)
- **OpenRouter**: AI API access

### Required Tools
- Git CLI
- Node.js 18+
- Python 3.11+
- Railway CLI (optional)

## 🌍 Environment Setup

### Backend Environment Variables

Create `.env` file in backend directory:

```env
# OpenRouter API (Required)
OPENROUTER_API_KEY=sk-or-v1-your-api-key-here
OPENROUTER_VISION_MODEL=qwen/qwen2.5-vl-32b-instruct:free
OPENROUTER_AGENT_MODEL=qwen/qwen2.5-vl-32b-instruct:free
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1

# Railway Auto-set
PORT=8000
PYTHON_VERSION=3.11

# Optional - Rate Limiting
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_PERIOD_SECONDS=60

# CORS Origins (Add your frontend URL)
ALLOWED_ORIGINS=["https://your-domain.com","https://www.your-domain.com"]
```

### Frontend Environment Variables

Create `.env.local` file in frontend directory:

```env
# Production API URL
NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app

# Optional Analytics
NEXT_PUBLIC_GA_ID=your-google-analytics-id

# Supabase (if using)
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## 🗄️ Database Setup

### Option 1: Supabase (Recommended)

1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create new project
   - Choose region closest to your users

2. **Get Connection Details**
   ```env
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_KEY=your-service-key
   ```

3. **Create Tables**
   ```sql
   -- Users table
   CREATE TABLE users (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     email VARCHAR(255) UNIQUE NOT NULL,
     created_at TIMESTAMP DEFAULT NOW()
   );

   -- Analyses table
   CREATE TABLE analyses (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     user_id UUID REFERENCES users(id),
     image_url VARCHAR(500),
     analysis_data JSONB,
     created_at TIMESTAMP DEFAULT NOW()
   );

   -- Negotiations table
   CREATE TABLE negotiations (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     user_id UUID REFERENCES users(id),
     analysis_id UUID REFERENCES analyses(id),
     negotiation_data JSONB,
     status VARCHAR(50) DEFAULT 'active',
     created_at TIMESTAMP DEFAULT NOW()
   );
   ```

### Option 2: PostgreSQL

1. **Choose Provider**
   - Railway PostgreSQL
   - Heroku PostgreSQL
   - AWS RDS
   - DigitalOcean Database

2. **Connection String**
   ```env
   DATABASE_URL=postgresql://user:password@host:port/database
   ```

## 🚀 Backend Deployment (Railway)

### Step 1: Prepare Repository

```bash
# Ensure all changes are committed
git add .
git commit -m "Ready for production deployment"
git push origin main
```

### Step 2: Create Railway Project

1. **Sign Up/Login**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose `TerraSync` repository

3. **Configure Deployment**
   - **Root Directory**: `backend`
   - **Build Command**: (auto-detected)
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Health Check**: `/health`

### Step 3: Add Environment Variables

In Railway dashboard → Settings → Variables:

```env
OPENROUTER_API_KEY=sk-or-v1-your-api-key
OPENROUTER_VISION_MODEL=qwen/qwen2.5-vl-32b-instruct:free
OPENROUTER_AGENT_MODEL=qwen/qwen2.5-vl-32b-instruct:free
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
PORT=8000
PYTHON_VERSION=3.11
```

### Step 4: Deploy

1. **Trigger Deployment**
   - Railway will automatically deploy on push
   - Monitor build logs in Railway dashboard

2. **Verify Deployment**
   ```bash
   # Test health endpoint
   curl https://your-app-name.railway.app/health
   
   # Test API docs
   # Visit: https://your-app-name.railway.app/docs
   ```

### Step 5: Get Backend URL

Your backend URL will be: `https://your-app-name.railway.app`

## 🌐 Frontend Deployment (Vercel)

### Step 1: Prepare Frontend

```bash
cd frontend

# Update environment variables
echo "NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app" > .env.local

# Build test
npm run build
```

### Step 2: Deploy to Vercel

1. **Connect to Vercel**
   ```bash
   npx vercel login
   npx vercel link
   ```

2. **Deploy**
   ```bash
   npx vercel --prod
   ```

3. **Configure Environment Variables**
   - In Vercel dashboard → Settings → Environment Variables
   - Add `NEXT_PUBLIC_API_URL`

### Alternative: Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build and deploy
cd frontend
npm run build
netlify deploy --prod --dir=.next
```

## 🌍 Domain Configuration

### Custom Domain Setup

#### Backend (Railway)
1. Railway Dashboard → Settings → Domains
2. Add custom domain: `api.yourdomain.com`
3. Update DNS records (CNAME to `railway.app`)

#### Frontend (Vercel)
1. Vercel Dashboard → Domains
2. Add custom domain: `yourdomain.com`
3. Update DNS records (CNAME to `cname.vercel-dns.com`)

#### Update CORS Origins
```env
# In Railway environment variables
ALLOWED_ORIGINS=["https://yourdomain.com","https://www.yourdomain.com"]
```

## 📊 Monitoring & Maintenance

### Railway Monitoring

1. **Logs**
   ```bash
   railway logs
   ```

2. **Metrics**
   - CPU usage
   - Memory usage
   - Response times
   - Error rates

3. **Health Checks**
   - Automatic health checks enabled
   - Restart on failure

### Frontend Monitoring

1. **Vercel Analytics**
   - Page views
   - Performance metrics
   - Error tracking

2. **Google Analytics** (Optional)
   ```env
   NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
   ```

### Database Monitoring

1. **Supabase Dashboard**
   - Query performance
   - Storage usage
   - User activity

2. **Backup Strategy**
   - Automatic daily backups
   - Point-in-time recovery

## 🔧 Troubleshooting

### Common Issues

#### Backend Issues

**Build Fails**
```bash
# Check Python version
python --version  # Should be 3.11+

# Check dependencies
pip install -r requirements.txt
```

**API Key Issues**
```bash
# Test API key
curl -H "Authorization: Bearer $OPENROUTER_API_KEY" \
     https://openrouter.ai/api/v1/models
```

**CORS Issues**
```bash
# Check CORS configuration
curl -H "Origin: https://yourdomain.com" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     https://your-backend.railway.app/health
```

#### Frontend Issues

**Build Errors**
```bash
# Clean build
rm -rf .next node_modules
npm install
npm run build
```

**API Connection Issues**
```bash
# Test API connection
curl https://your-backend.railway.app/health
```

### Debug Commands

```bash
# Backend health check
curl https://your-backend.railway.app/health

# API documentation
# Visit: https://your-backend.railway.app/docs

# Debug configuration
curl https://your-backend.railway.app/api/debug/config

# Frontend build check
npm run build && npm run start
```

### Performance Optimization

#### Backend
1. **Enable Caching**
   ```python
   # Add Redis for caching
   pip install redis
   ```

2. **Database Optimization**
   - Add indexes
   - Optimize queries
   - Use connection pooling

#### Frontend
1. **Image Optimization**
   ```bash
   npm install next-optimized-images
   ```

2. **Bundle Optimization**
   - Code splitting
   - Lazy loading
   - Tree shaking

## 🔒 Security Checklist

### Backend Security
- [ ] API keys in environment variables
- [ ] HTTPS enforced
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Input validation
- [ ] SQL injection prevention

### Frontend Security
- [ ] Environment variables secured
- [ ] CSP headers configured
- [ ] Dependencies updated
- [ ] XSS prevention
- [ ] Authentication tokens secured

### Database Security
- [ ] Connection strings secured
- [ ] Access controls configured
- [ ] Backups enabled
- [ ] Encryption at rest
- [ ] Network access restricted

## 📈 Scaling Guide

### When to Scale

**Backend Indicators**
- CPU > 80% for sustained periods
- Memory > 80% usage
- Response times > 2 seconds
- Error rate > 5%

**Frontend Indicators**
- Build times > 5 minutes
- Bundle size > 1MB
- Page load > 3 seconds

### Scaling Options

**Railway Scaling**
- Enable auto-scaling
- Increase instance size
- Add load balancer

**Database Scaling**
- Upgrade compute tier
- Add read replicas
- Implement caching

## 🔄 CI/CD Pipeline

### GitHub Actions Setup

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Railway
        uses: railway-app/railway-action@v1
        with:
          api-token: ${{ secrets.RAILWAY_TOKEN }}
          service: backend

  frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## 📞 Support

### Getting Help

1. **Documentation**
   - [Railway Docs](https://docs.railway.app)
   - [Vercel Docs](https://vercel.com/docs)
   - [Supabase Docs](https://supabase.com/docs)

2. **Community**
   - GitHub Issues
   - Discord communities
   - Stack Overflow

3. **Emergency Contacts**
   - Email: y.brox95@gmail.com
   - GitHub Issues: [Create Issue](https://github.com/marouaneakrich/TerraSync/issues)

---

## 🎉 Deployment Complete!

Your TerraSync application is now live in production! 

**Next Steps:**
1. Monitor performance
2. Set up alerts
3. Regular backups
4. Security updates

Happy deploying! 🚀
