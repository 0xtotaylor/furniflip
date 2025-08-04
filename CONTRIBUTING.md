# Contributing to FurniFlip

Thank you for your interest in contributing to FurniFlip! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites

- Node.js 18 or higher
- Yarn 1.22+
- Git
- Supabase account (for full functionality)
- OpenAI API key (for AI features)

### Development Setup

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/yourusername/furniflip.git
   cd furniflip
   ```

2. **Install dependencies**
   ```bash
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   # Copy example files
   cp apps/api/.env.example apps/api/.env
   cp apps/web/.env.example apps/web/.env.local
   
   # Fill in your actual values
   ```

4. **Start development servers**
   ```bash
   yarn dev
   ```

## 📝 Development Guidelines

### Code Style

- **TypeScript**: All code must be written in TypeScript with proper type annotations
- **ESLint**: Follow the configured ESLint rules (`yarn lint`)
- **Prettier**: Code is automatically formatted (`yarn format`)
- **Naming**: Use descriptive, camelCase names for variables and functions

### Documentation

- **JSDoc**: Add JSDoc comments for all public functions and classes
- **README**: Update relevant README files when adding new features
- **Comments**: Add inline comments for complex logic
- **Examples**: Provide usage examples in documentation

### Testing

- **Unit Tests**: Write unit tests for new functionality
- **E2E Tests**: Add end-to-end tests for user workflows
- **Coverage**: Maintain test coverage above 80%
- **CI**: Ensure all CI checks pass before submitting PR

### Security

- **Environment Variables**: Never commit sensitive data
- **Dependencies**: Keep dependencies updated and audit regularly
- **Input Validation**: Validate all user inputs on both client and server
- **Authentication**: Follow secure authentication patterns

## 🛠️ Development Workflow

### Branch Naming

- `feature/feature-name` - New features
- `fix/bug-description` - Bug fixes
- `docs/update-description` - Documentation updates
- `refactor/component-name` - Code refactoring

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): description

feat(inventory): add AI-powered furniture analysis
fix(auth): resolve login redirect issue
docs(api): update endpoint documentation
```

### Pull Request Process

1. **Create feature branch** from `main`
2. **Make changes** following development guidelines
3. **Write/update tests** for your changes
4. **Update documentation** as needed
5. **Run quality checks**:
   ```bash
   yarn lint
   yarn test
   yarn build
   ```
6. **Submit pull request** with clear description
7. **Address review feedback** promptly

### Pull Request Template

```markdown
## Description
Brief description of changes made.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] E2E tests pass
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No sensitive data committed
```

## 🎯 Areas for Contribution

### High Priority
- **AI Model Integration**: Improve furniture recognition accuracy
- **Marketplace Connectors**: Add support for new marketplaces
- **Performance Optimization**: Reduce load times and improve UX
- **Mobile Experience**: Enhance mobile responsiveness
- **Testing**: Increase test coverage across the application

### Medium Priority
- **Documentation**: Improve developer and user documentation
- **Accessibility**: Enhance WCAG compliance
- **Internationalization**: Add multi-language support
- **Analytics**: Improve tracking and insights
- **Error Handling**: Better error messages and recovery

### Low Priority
- **UI/UX Improvements**: Polish existing interfaces
- **Code Refactoring**: Simplify complex components
- **DevOps**: Improve CI/CD pipeline
- **Monitoring**: Enhanced logging and observability

## 🧪 Testing Guidelines

### Unit Tests
```bash
# Run all unit tests
yarn test

# Run tests in watch mode
yarn test:watch

# Run tests with coverage
yarn test:coverage
```

### E2E Tests
```bash
# Run Playwright tests
yarn test:e2e

# Run specific test file
yarn test:e2e tests/login.spec.ts
```

### Test Structure
```typescript
describe('InventoryService', () => {
  describe('analyzeImages', () => {
    it('should analyze furniture images correctly', async () => {
      // Arrange
      const mockImages = [...];
      
      // Act
      const result = await service.analyzeImages(mockImages);
      
      // Assert
      expect(result).toMatchObject({...});
    });
  });
});
```

## 🔒 Security Guidelines

### Sensitive Data
- **Never commit**: API keys, tokens, passwords, or secrets
- **Use environment variables**: For all configuration
- **Validate inputs**: Sanitize all user inputs
- **Audit dependencies**: Regularly check for vulnerabilities

### Authentication
- **JWT tokens**: Implement proper token validation
- **Session management**: Handle expired sessions gracefully
- **Rate limiting**: Implement rate limiting for API endpoints
- **HTTPS**: Always use HTTPS in production

## 📚 Resources

### Documentation
- [Next.js Documentation](https://nextjs.org/docs)
- [NestJS Documentation](https://docs.nestjs.com/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Supabase Documentation](https://supabase.com/docs)

### Tools
- [VS Code Extensions](https://code.visualstudio.com/docs/editor/extension-marketplace)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Jest Testing Framework](https://jestjs.io/docs/getting-started)
- [Playwright Testing](https://playwright.dev/docs/intro)

## 🤝 Community

### Communication
- **GitHub Issues**: Bug reports and feature requests
- **Discussions**: General questions and ideas
- **Pull Requests**: Code contributions and reviews

### Code of Conduct
We follow the [Contributor Covenant Code of Conduct](https://www.contributor-covenant.org/). Please read and adhere to these guidelines in all interactions.

### Recognition
Contributors will be recognized in:
- README contributors section
- Release notes for significant contributions
- GitHub contributor graphs and statistics

## 📋 Issue Templates

### Bug Report
```markdown
**Describe the bug**
A clear description of the bug.

**To Reproduce**
Steps to reproduce the behavior.

**Expected behavior**
What you expected to happen.

**Environment**
- OS: [e.g. macOS, Windows, Linux]
- Browser: [e.g. Chrome, Safari, Firefox]
- Version: [e.g. 1.0.0]
```

### Feature Request
```markdown
**Is your feature request related to a problem?**
A clear description of the problem.

**Describe the solution you'd like**
A clear description of what you want to happen.

**Additional context**
Any other context about the feature request.
```

## 🎉 Getting Help

If you need help or have questions:
1. Check existing [GitHub Issues](https://github.com/yourusername/furniflip/issues)
2. Review the [documentation](./docs)
3. Start a [GitHub Discussion](https://github.com/yourusername/furniflip/discussions)
4. Contact the maintainers through GitHub

Thank you for contributing to FurniFlip! 🪑✨