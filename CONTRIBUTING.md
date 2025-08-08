# Contributing to Sustainovate

First off — thanks for taking the time to contribute!  
We welcome contributions that improve the project while keeping the quality high.

---
## 📜 Contribution Rules

1. **No Direct Pushes to `main`**
   - All changes must be made via a Pull Request (PR).
   - `main` is always production-ready.

2. **Fork & Branch Workflow**
   - **Fork** this repo to your own GitHub account.
   - Create a new branch for your change:
     ```bash
     git checkout -b feature/short-description
     ```
   - Never commit directly to `main`.

3. **Code Style & Standards**
   - Follow the existing code structure.
   - Use **Prettier** + **ESLint** for formatting and linting.
   - Use meaningful commit messages:
     ```
     feat(api): add event registration endpoint
     fix(web): correct leaderboard sorting
     docs: update README for new setup
     ```

4. **Commit Message Format**
   - Types: `new`,`feat`, `fix`, `chore`, `docs`, `refactor`, `style`, `test`.
   - Format:  
     ```
     <type>(<scope>): <short description>
     ```
   - Example:
     ```
     feat(quiz): add timer and scoring system
     ```

5. **Pull Request Requirements**
   - PR title should match commit style:
     ```
     feat(web): implement QR login system
     ```
   - Describe **what** and **why** in the PR description.
   - Link any related issues:  
     ```
     Closes #42
     ```
   - All PRs must pass:
     - ✅ Code review by at least 1 maintainer.
     - ✅ CI checks (lint, tests, build).

6. **Testing**
   - Write or update unit/integration tests when applicable.
   - Run all tests locally before submitting:
     ```bash
     npm run lint
     npm run test
     ```

---

## 🚀 Local Development Setup

```bash
# 1. Clone your fork
git clone https://github.com/<your-username>/Sustainovate-Web.git

# 2. Install dependencies
cd Sustainovate-Web/apps/web
npm install
cd ../../api
npm install

# 3. Run dev environment
docker-compose up --build
```
---

## 📝 Code of Conduct
We follow the Contributor Covenant.
Be respectful, constructive, and professional in all interactions.

