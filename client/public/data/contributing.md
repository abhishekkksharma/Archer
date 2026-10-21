# Contributing to Archer

Thank you for your interest in contributing to Archer! Community contributions make this project better for everyone.

## Getting Started

1. **Fork the Repository**: Create a personal fork of the [Archer GitHub repository](https://github.com/abhishekkksharma/Archer).
2. **Clone your Fork**:
   ```bash
   git clone https://github.com/<your-username>/Archer.git
   cd Archer
   ```
3. **Install Dependencies**:
   ```bash
   # In the server directory
   cd server && npm install

   # In the client directory
   cd ../client && npm install
   ```
4. **Set Up Environment Variables**: Configure `.env` in `server/` and `.env.local` in `client/` following the guidelines in the root README.

## Contribution Guidelines

### Bug Reports & Feature Requests
- Check existing GitHub issues before opening a new one to prevent duplicates.
- Provide detailed steps to reproduce issues, including error logs, screenshots, and environment details.
- When proposing new features, explain the use-case and why it benefits Archer users.

### Pull Requests
1. Create a dedicated branch for your work: `git checkout -b feat/your-feature-name` or `fix/issue-description`.
2. Follow existing code style and formatting standards.
3. Ensure TypeScript types compile without errors.
4. Keep pull requests focused on a single change or feature.
5. Provide a descriptive title and summary in your PR.
