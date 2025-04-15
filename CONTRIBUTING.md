# Contributing to Emergency Portal

Thank you for your interest in contributing to Emergency Portal! This document provides guidelines and instructions for contributing to the project.

## 🤝 Code of Conduct

Please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md) in all your interactions with the project.

## 🚀 Getting Started

1. **Fork** the repository
2. **Clone** your fork:
   ```bash
   git clone https://github.com/your-username/emergency-portal.git
   cd emergency-portal
   ```
3. **Install** dependencies:
   ```bash
   pnpm install
   ```
4. **Set up** environment variables:

   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your configuration values.

5. **Initialize** the database:
   ```bash
   pnpm prisma:generate
   pnpm prisma:migrate
   ```

## 🔧 Development Workflow

1. **Create** a new branch:

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make** your changes

3. **Test** your changes:

   ```bash
   pnpm test
   pnpm lint
   ```

4. **Commit** your changes:

   ```bash
   git commit -m "feat: add your feature"
   ```

5. **Push** to your fork:

   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create** a Pull Request

## 📝 Pull Request Guidelines

- Use clear, descriptive titles
- Include a detailed description of changes
- Reference any related issues
- Ensure all tests pass
- Update documentation if necessary
- Follow the commit message convention

## 💬 Commit Message Convention

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

Types:

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Test-related changes
- `chore`: Maintenance tasks

## 🧪 Testing

- Write tests for new features
- Ensure all existing tests pass
- Follow the testing guidelines in the project

## 📚 Documentation

- Update README.md if necessary
- Add comments to complex code
- Document new features
- Keep documentation up to date

## 🔍 Code Review Process

1. Pull Request is created
2. Automated checks run
3. Reviewers provide feedback
4. Changes are made if needed
5. Pull Request is merged

## 🐛 Reporting Bugs

1. Check if the bug has already been reported
2. Create a new issue
3. Provide detailed information:
   - Steps to reproduce
   - Expected behavior
   - Actual behavior
   - Environment details
   - Screenshots if applicable

## 💡 Feature Requests

1. Check if the feature has already been requested
2. Create a new issue
3. Describe the feature
4. Explain why it would be useful
5. Provide any relevant examples

## 📦 Release Process

1. Version bump
2. Changelog update
3. Tag creation
4. Release notes
5. Deployment

## ❓ Questions?

Feel free to open an issue or contact the maintainers if you have any questions!
