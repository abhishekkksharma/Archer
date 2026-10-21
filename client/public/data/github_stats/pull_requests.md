# Pull Request Process

We welcome pull requests from everyone! Follow this guide to ensure a smooth and timely review.

## Pull Request Checklist

Before opening your pull request, please ensure:

1. **Branch Naming**: Use descriptive branch names (`feat/feature-name`, `fix/issue-description`, `docs/doc-updates`).
2. **Build Verification**: Run `npm run build` locally in both `client` and `server` directories to verify there are no compilation errors.
3. **Linting**: Ensure code conforms to ESLint rules without warnings or errors.
4. **Focused Scope**: Avoid combining multiple unrelated features into a single PR. Small, atomic PRs are reviewed and merged much faster.
5. **Documentation**: Update markdown docs or inline comments if your changes alter user workflows or API contracts.

## Review Lifecycle

1. **Submission**: Open a pull request against the `main` branch.
2. **Automated Checks**: CI workflows verify build and lint status.
3. **Code Review**: Maintainers review changes, provide constructive feedback, and suggest optimizations.
4. **Merge**: Once approved, your pull request is merged into `main`!
