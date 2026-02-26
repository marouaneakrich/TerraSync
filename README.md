# 🌍 TerraSync - AI-Powered Circular Economy Platform

> Transform waste into sustainable value through intelligent AI analysis and agentic negotiation with recycling partners.

## 🚀 Live Demo
- **Frontend**: [https://terrsync.app](https://terrasync.app) *(Coming Soon)*
- **API Documentation**: [https://api.terrasync.app/docs](https://api.terrasync.app/docs) *(Coming Soon)*

---

## ✨ Key Features

### 🤖 AI Vision Portal
- **Smart Analysis**: Upload photos for instant AI-powered categorization and valuation
- **Realistic Pricing**: Market-based valuations for electronics, furniture, crops, and more
- **Circular Economy Insights**: Eco-credits, carbon savings, and environmental impact
- **Recommended Paths**: Personalized reuse, recycling, and upcycling suggestions

### 🤝 Agentic Negotiation
- **AI-Powered Trading**: LangChain agents negotiate with NGOs and recycling centers
- **Optimal Matching**: Finds the best partners for your items
- **Smart Terms**: Automated negotiation for maximum eco-credits and convenience
- **Real-time Tracking**: Live updates on negotiation progress

### 📊 Impact Dashboard
- **Environmental Metrics**: Track CO₂ saved, waste diverted, and water conservation
- **Eco-Credits**: Monitor your circular economy contributions
- **Historical Data**: Visualize your environmental impact over time
- **Achievement System**: Gamified sustainability tracking

---

## 🏗️ Technical Architecture

```
TerraSync/
├── 📱 frontend/                 # Next.js 14 + TypeScript
│   ├── src/
│   │   ├── app/             # App Router pages
│   │   │   ├── page.tsx     # Landing page with smooth animations
│   │   │   ├── vision/      # AI Vision Portal
│   │   │   ├── impact/      # Impact Dashboard  
│   │   │   ├── privacy/     # Legal pages
│   │   │   ├── terms/       # Legal pages
│   │   │   └── cookies/     # Legal pages
│   │   ├── components/      # Reusable React components
│   │   │   ├── layout/      # Navbar, Footer with smooth scrolling
│   │   │   ├── sections/    # Hero, Features, Stats, etc.
│   │   │   └── ui/          # Button, GlowCard, AnimatedNumber
│   │   └── lib/             # API client, utilities
│   ├── package.json
│   └── tailwind.config.ts
│
├── 🔧 backend/                  # FastAPI + Python
│   ├── app/
│   │   ├── routers/         # RESTful API endpoints
│   │   │   ├── vision.py    # Image analysis with realistic valuations
│   │   │   ├── trade.py     # AI agent negotiation
│   │   │   └── impact.py    # Impact statistics
│   │   ├── services/        # Core business logic
│   │   │   ├── vision_service.py  # OpenRouter integration
│   │   │   └── agent_service.py # LangChain agents
│   │   ├── middleware/      # Rate limiting, CORS, error handling
│   │   ├── config.py         # Environment configuration
│   │   └── main.py          # FastAPI application
│   ├── tests/               # Comprehensive test suite
│   ├── requirements.txt
│   └── .env.example
│
└── 📚 docs/                   # Documentation and guides
    ├── PRODUCTION_SETUP.md   # Deployment guide
    └── API_DOCS.md         # API documentation
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js 18+** - Frontend development
- **Python 3.11+** - Backend development  
- **OpenRouter API Key** - AI vision and agent services

### Frontend Development
```bash
cd frontend
npm install
npm run dev
```
🌐 **Visit**: http://localhost:3000

### Backend Development
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Linux/Mac
pip install -r requirements.txt

# Environment setup
cp .env.example .env
# Edit .env with your OPENROUTER_API_KEY

# Start development server
uvicorn app.main:app --reload --port 8000
```
📚 **API Docs**: http://localhost:8000/docs

### Testing
```bash
cd backend
pytest -v
```

---

## 🔌 API Reference

### 📸 Vision Analysis
**POST** `/api/analyze-item`
```json
{
  "image": "base64_encoded_image",
  "content_type": "image/jpeg"
}
```
**Response**: Item categorization, realistic market values, eco-credits, and recommended recycling paths

### 🤝 Trade Orchestration  
**POST** `/api/orchestrate-trade`
```json
{
  "item_id": "uuid",
  "user_id": "user-demo", 
  "preferred_path": "recycle"
}
```
**Response**: AI-negotiated best match with eco-credits and pickup details

### 📊 Impact Statistics
**GET** `/api/impact-stats`
**Response**: Real-time environmental impact metrics and historical data

---

## 🛠️ Technology Stack

### Frontend Technologies
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations and transitions
- **Lucide React** - Beautiful icon system

### Backend Technologies  
- **FastAPI** - High-performance async API
- **LangChain/LangGraph** - AI agent orchestration
- **OpenRouter** - Multi-model AI integration (Claude, GPT, Gemini)
- **Pydantic** - Data validation and serialization
- **Python 3.11+** - Modern Python features

### AI Models Used
- **Vision Analysis**: `qwen/qwen3-vl-30b-a3b-thinking` - Advanced image understanding
- **Agent Negotiation**: `anthropic/claude-3.5-sonnet` - Complex reasoning
- **Fallback**: `google/gemini-2.0-flash-exp` - Fast responses

---

## ⚙️ Configuration

### Environment Variables
```env
# OpenRouter API Configuration
OPENROUTER_API_KEY=your-key-here
OPENROUTER_VISION_MODEL=qwen/qwen3-vl-30b-a3b-thinking
OPENROUTER_AGENT_MODEL=anthropic/claude-3.5-sonnet

# CORS Configuration
ALLOWED_ORIGINS=["http://localhost:3000"]

# Rate Limiting
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_PERIOD_SECONDS=60

# Database (Production)
DATABASE_URL=postgresql://user:pass@localhost:5432/terrasync
```

---

## 🌱 Environmental Impact

### Realistic Valuations
- **Electronics**: $20-400 (based on condition and market)
- **Furniture**: $50-500 (quality and type dependent)  
- **Agricultural**: $50-500 per acre yield potential
- **Scrap Metal**: $0.05-0.20 per pound
- **Textiles**: $5-50 (condition dependent)

### Eco-Credits System
- **Electronics**: 20-80 credits (recyclability score)
- **Metals**: 30-70 credits (high recyclability)
- **Organic**: 5-30 credits (composting/biomass value)
- **Furniture**: 15-50 credits (reuse potential)

---

## 🚀 Deployment

### Production Setup
1. **Database**: Configure PostgreSQL or Supabase
2. **Environment**: Set production variables
3. **Frontend**: Deploy to Vercel/Netlify
4. **Backend**: Deploy to Railway/Render
5. **Monitoring**: Set up logging and analytics

📖 **Full Guide**: See [PRODUCTION_SETUP.md](./PRODUCTION_SETUP.md)

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push branch: `git push origin feature/amazing-feature`
5. Open Pull Request

---

## 📝 License

This project is licensed under the MIT License - see [LICENSE](./LICENSE) for details.

---

## ⭐ Star History

Built by Marouane Akrich. If this project inspires you, please give it a ⭐!

---

**📞 Contact**: hello@terrasync.app  
**🐛 Issues**: [GitHub Issues](https://github.com/marouaneakrich/TerraSync/issues)  
**📖 Documentation**: [GitHub Wiki](https://github.com/marouaneakrich/TerraSync/wiki)
