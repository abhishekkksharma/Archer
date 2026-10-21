# Commit Guidelines

Archer follows structured commit practices to ensure a readable, traceable git history.

## Conventional Commits

We follow the Conventional Commits specification:

```
<type>(<scope>): <short description>

[optional body]

[optional footer(s)]
```

### Commit Types

- **`feat`**: A new user-facing or platform feature.
- **`fix`**: A bug fix.
- **`docs`**: Documentation changes only.
- **`style`**: Code formatting, whitespace, missing semicolons, etc. (no production code change).
- **`refactor`**: Code restructuring without altering existing functionality.
- **`perf`**: Performance optimizations.
- **`test`**: Adding missing tests or correcting existing tests.
- **`chore`**: Maintenance tasks, dependency updates, and build tool configuration.

### Examples

```bash
git commit -m "feat(roadmap): add automated task difficulty estimation"
git commit -m "fix(docs): resolve layout shift on document navigation"
git commit -m "docs(api): document OpenRouter JSON repair service"
```
