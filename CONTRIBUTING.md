# Contributing to TerraSync

Thank you for your interest in contributing to TerraSync! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- Python 3.11+ and pip
- Git

### Development Setup
1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/TerraSync.git
   cd TerraSync
   ```
3. Install dependencies:
   ```bash
   # Frontend
   cd frontend
   npm install
   
   # Backend
   cd ../backend
   pip install -r requirements.txt
   ```
4. Set up environment variables:
   ```bash
   # Backend
   cd backend
   cp .env.example .env
   # Add your OpenRouter API key to .env
   
   # Frontend
   cd ../frontend
   cp .env.example .env.local
   ```

## 📋 How to Contribute

### Reporting Bugs
- Use [GitHub Issues](https://github.com/marouaneakrich/TerraSync/issues)
- Provide detailed description of the bug
- Include steps to reproduce
- Add screenshots if applicable

### Suggesting Features
- Open an issue with "Feature Request" label
- Describe the feature and its benefits
- Provide use cases and examples

### Code Contributions

#### 1. Create a Branch
```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

#### 2. Make Changes
- Follow existing code style and patterns
- Add tests for new functionality
- Update documentation as needed
- Ensure all tests pass

#### 3. Commit Changes
```bash
git add .
git commit -m "feat: add your feature description"
```

#### 4. Push and Create PR
```bash
git push origin feature/your-feature-name
```
Then create a Pull Request on GitHub.

## 🎯 Development Guidelines

### Code Style
- **Frontend**: Use ESLint and Prettier configurations
- **Backend**: Follow PEP 8 Python style guide
- Use meaningful variable and function names
- Add comments for complex logic

### Testing
- Write unit tests for new features
- Ensure existing tests pass
- Test both frontend and backend integration

### Documentation
- Update README.md if needed
- Add inline documentation for complex functions
- Update API documentation for new endpoints

## 🏗️ Project Structure

```
TerraSync/
├── frontend/          # Next.js frontend application
│   ├── src/
│   │   ├── app/      # App router pages
│   │   ├── components/ # React components
│   │   └── lib/      # Utilities and configurations
│   └── public/       # Static assets
├── backend/           # FastAPI backend application
│   ├── app/
│   │   ├── api/      # API endpoints
│   │   ├── core/     # Core configurations
│   │   ├── models/   # Pydantic models
│   │   └── services/ # Business logic
│   └── tests/        # Backend tests
└── docs/             # Additional documentation
```

## 🔄 Development Workflow

### Frontend Development
```bash
cd frontend
npm run dev
# Starts on http://localhost:3000
```

### Backend Development
```bash
cd backend
uvicorn app.main:app --reload
# Starts on http://localhost:8000
```

### API Documentation
- Visit `http://localhost:8000/docs` for interactive API docs
- Use `http://localhost:8000/redoc` for alternative documentation

## 🐛 Bug Fix Process

1. **Identify the Issue**
   - Reproduce the bug consistently
   - Check existing issues for duplicates

2. **Create a Branch**
   ```bash
   git checkout -b fix/bug-description
   ```

3. **Fix the Bug**
   - Write minimal, focused changes
   - Add tests to prevent regression
   - Verify the fix works

4. **Test Thoroughly**
   - Run all existing tests
   - Test edge cases
   - Verify no new issues introduced

## ✨ Feature Development

### Before Starting
- Check if feature already exists
- Discuss the approach in an issue
- Consider impact on existing functionality

### Implementation
1. Design the solution
2. Implement incrementally
3. Test each component
4. Update documentation
5. Add comprehensive tests

### Review Process
- Self-review your code
- Ensure tests pass
- Update documentation
- Submit for review

## 📝 Commit Message Guidelines

Use [Conventional Commits](https://www.conventionalcommits.org/) format:

```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

Examples:
```
feat(vision): add image upload functionality
fix(api): resolve CORS issues
docs(readme): update installation instructions
```

## 🎨 UI/UX Guidelines

### Design Principles
- Clean, modern interface
- Consistent color scheme (eco-friendly theme)
- Responsive design for all devices
- Accessibility compliance

### Component Guidelines
- Use existing components when possible
- Follow established patterns
- Maintain consistency
- Test on multiple screen sizes

## 🔧 Technical Guidelines

### Frontend
- Use TypeScript for type safety
- Follow React best practices
- Optimize for performance
- Ensure accessibility

### Backend
- Use Pydantic for data validation
- Implement proper error handling
- Follow RESTful API principles
- Add comprehensive logging

### Security
- Never commit API keys or secrets
- Validate all inputs
- Use HTTPS in production
- Follow OWASP guidelines

## 📊 Performance Guidelines

### Frontend Optimization
- Lazy load components when appropriate
- Optimize images and assets
- Minimize bundle size
- Use React.memo for expensive components

### Backend Optimization
- Implement caching where appropriate
- Optimize database queries
- Use connection pooling
- Monitor API response times

## 🌍 Environment Variables

### Required for Development
```env
# Backend (.env)
OPENROUTER_API_KEY=your_api_key_here
OPENROUTER_VISION_MODEL=qwen/qwen2.5-vl-32b-instruct:free
OPENROUTER_AGENT_MODEL=qwen/qwen2.5-vl-32b-instruct:free

# Frontend (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Production Variables
```env
# Production
NEXT_PUBLIC_API_URL=https://your-backend-url.com
```

## 📋 Release Process

1. **Preparation**
   - Update version numbers
   - Update changelog
   - Ensure all tests pass

2. **Release**
   - Create release branch
   - Tag the release
   - Deploy to production

3. **Post-Release**
   - Monitor for issues
   - Update documentation
   - Announce changes

## 🤝 Community Guidelines

### Code of Conduct
- Be respectful and inclusive
- Welcome newcomers
- Provide constructive feedback
- Focus on what is best for the community

### Getting Help
- Check existing documentation
- Search existing issues
- Ask questions in discussions
- Join our community channels

## 🏆 Recognition

Contributors will be:
- Listed in our contributors section
- Mentioned in release notes
- Invited to our contributor community
- Eligible for contributor rewards

## 📞 Contact

- **Issues**: [GitHub Issues](https://github.com/marouaneakrich/TerraSync/issues)
- **Discussions**: [GitHub Discussions](https://github.com/marouaneakrich/TerraSync/discussions)
- **Email**: y.brox95@gmail.com

---

Thank you for contributing to TerraSync! Your contributions help make sustainable waste management more accessible and effective. 🌱
