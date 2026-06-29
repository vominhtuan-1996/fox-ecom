# Fox eCommerce SDK - Documentation

Complete documentation for Fox eCommerce SDK development.

## 📚 Documentation Index

This directory contains 5 comprehensive guides covering all aspects of SDK development:

### 1️⃣ [01_convention.md](01_convention.md) - Naming & Code Conventions
**What**: How to name files, folders, functions, types, and variables  
**Use when**: Starting a new file or wondering what to call something  
**Covers**:
- File and folder naming patterns
- TypeScript naming conventions
- Entity, use case, and repository naming
- Component and hook naming
- Import path conventions
- Barrel exports

👉 **Start here if you're creating new files**

---

### 2️⃣ [02_structure.md](02_structure.md) - Project Structure & Organization
**What**: How the project is organized and what goes where  
**Use when**: Confused about where to put code or how layers interact  
**Covers**:
- Complete directory tree
- Presentation layer (components, hooks, styles)
- Domain layer (entities, use cases, repositories)
- Data layer (datasources, models, repositories)
- Common layer (utilities, constants, errors)
- Dependency injection setup
- Import dependencies (what can import what)
- Test file structure

👉 **Start here if you're adding a new feature**

---

### 3️⃣ [03_tech.md](03_tech.md) - Technology Stack & Setup
**What**: Tools, libraries, and how to set them up  
**Use when**: Setting up development environment or debugging build issues  
**Covers**:
- Technology stack and versions
- Project setup and installation
- NPM scripts (build, test, lint, etc.)
- Configuration files (tsconfig, jest, babel, metro, etc.)
- Build process and output
- Development workflow
- Environment configuration
- Dependency management
- Publishing to npm
- CI/CD integration
- Troubleshooting

👉 **Start here for setup and build questions**

---

### 4️⃣ [04_rule.md](04_rule.md) - Development Rules & Guidelines
**What**: Must-follow rules to maintain code quality and architecture  
**Use when**: Making architectural decisions or during code review  
**Covers**:
- Core architecture rules (dependency rule, no business logic in UI, etc.)
- Code quality rules (TypeScript strict mode, error handling, validation)
- Testing rules (coverage, integration tests, mocking)
- File and module rules (barrel exports, file sizes, models conversion)
- API design rules (repositories, use cases)
- Documentation requirements
- Security rules
- Git and commit rules
- Performance guidelines

👉 **Start here for code review checklist**

---

### 5️⃣ [05_csoc.md](05_csoc.md) - Code Style & Organization Convention
**What**: How code should look and be formatted  
**Use when**: Writing code and wanting consistent style  
**Covers**:
- Prettier formatting configuration
- TypeScript style guide (variables, types, null handling, classes)
- React/React Native style guide
- Component structure and organization
- Hooks usage patterns
- Array and object methods
- Error handling patterns
- Module organization and imports
- Comment style and JSDoc
- Naming conventions in detail
- Spacing and indentation
- Code complexity guidelines
- IDE setup recommendations

👉 **Start here for code formatting and style**

---

### 6️⃣ [06_design_rules.md](06_design_rules.md) - Design Compliance & UI/UX Guidelines
**What**: Design tokens, component specs, and UI/UX compliance rules  
**Use when**: Building components or reviewing design implementation  
**Covers**:
- Color system tokens and usage (primary, semantic, neutral)
- Typography scale and rules
- Spacing & layout grid (4px base)
- Border radius tokens
- Button states and component design
- Icon and asset guidelines
- Responsive & safe area rules
- Animation and transition rules
- Accessibility standards (WCAG AA)
- Testing & QA checklist for design compliance
- Design system version tracking

**Source**: [Fox-Eco-Design.md](Fox-Eco-Design.md) (design specification)

👉 **Start here for UI component implementation**

---

## 🎯 Quick Reference

### By Task

#### I'm starting a new component
1. Read [02_structure.md](02_structure.md) - Where to put it
2. Read [01_convention.md](01_convention.md) - What to name it
3. Read [05_csoc.md](05_csoc.md) - How to structure it
4. Read [04_rule.md](04_rule.md) - Rules to follow

#### I'm implementing a use case
1. Read [02_structure.md](02_structure.md) - Where to put it
2. Read [04_rule.md](04_rule.md) - Dependency rule & business logic rules
3. Read [05_csoc.md](05_csoc.md) - Naming and style

#### I'm setting up development
1. Read [03_tech.md](03_tech.md) - All setup steps
2. Run: `npm install && npm run type-check && npm test`

#### I'm reviewing a PR
1. Use [04_rule.md](04_rule.md) - Checklist at end of file
2. Verify layering using [02_structure.md](02_structure.md)
3. Check naming using [01_convention.md](01_convention.md)

#### I'm fixing a build error
1. Read [03_tech.md](03_tech.md) - Configuration files section
2. Check [03_tech.md](03_tech.md) - Troubleshooting section

#### I need to format code
1. Run `npm run lint:fix`
2. Read [05_csoc.md](05_csoc.md) for style details

---

## 📋 Core Principles

### Clean Architecture
- **Dependency Rule**: Source code dependencies point inward only
- **Layers**: Presentation → Domain ← Data ← Common (DI connects all)
- **Testability**: Each layer independently testable
- **Framework-independent**: Domain layer has no framework dependencies

### Code Quality
- **Type Safety**: TypeScript strict mode enabled
- **Immutability**: Never mutate objects or arrays
- **Error Handling**: Always handle errors, validate inputs
- **Testing**: Domain layer 80%+ coverage minimum

### Organization
- **Barrel Exports**: Each folder has index.ts
- **File Size**: Keep files small (components < 300 lines, hooks < 150 lines)
- **Single Responsibility**: One use case per file, one operation per class
- **Consistency**: Naming and structure consistent across codebase

---

## 🚀 Getting Started Checklist

- [ ] Read [03_tech.md](03_tech.md) - Installation section
- [ ] Run `npm install`
- [ ] Run `npm run lint:fix && npm run type-check && npm test`
- [ ] Read [02_structure.md](02_structure.md) - Understand layer organization
- [ ] Read [01_convention.md](01_convention.md) - Understand naming
- [ ] Read [04_rule.md](04_rule.md) - Know the rules
- [ ] Set up IDE using [05_csoc.md](05_csoc.md)
- [ ] Create first feature branch
- [ ] Make your first contribution

---

## 📞 Quick Commands Reference

```bash
# Setup
npm install

# Check code
npm run lint              # Lint
npm run lint:fix          # Auto-fix
npm run type-check        # Type check
npm test                  # Tests

# Build
npm run build             # Build + pack
npm run clean             # Remove dist and tgz
npm pack                  # Create tarball
npm publish              # Publish to npm

# Development
npm start                 # Start Metro
git checkout -b feature/my-feature  # New branch
npm run lint:fix && npm test        # Pre-commit checks
```

---

## 🎓 Learning Path

**Day 1: Understand the Architecture**
1. Read [02_structure.md](02_structure.md) - Understand layers
2. Examine `src/` directory structure
3. Read `STRUCTURE.md` in project root

**Day 2: Learn the Conventions**
1. Read [01_convention.md](01_convention.md) - Naming rules
2. Read [05_csoc.md](05_csoc.md) - Code style
3. Look at example files in `src/`

**Day 3: Understand the Rules**
1. Read [04_rule.md](04_rule.md) - Development rules
2. Review architecture dependency diagram
3. Understand use case pattern

**Day 4: Setup Environment**
1. Follow [03_tech.md](03_tech.md) - Complete setup
2. Run all commands successfully
3. Understand build process

**Day 5: Make First Change**
1. Create new feature branch
2. Add simple component or utility
3. Follow conventions and rules
4. Submit PR for review

---

## 🐛 Troubleshooting by Document

### Setup Issues → [03_tech.md](03_tech.md)
- Installation problems
- Port conflicts
- Dependency issues
- Environment setup

### Architecture Questions → [02_structure.md](02_structure.md)
- Where to put code
- Layer organization
- Import dependencies
- Folder structure

### Naming Questions → [01_convention.md](01_convention.md)
- File naming
- Function naming
- Class naming
- Variable naming

### Code Quality Issues → [04_rule.md](04_rule.md)
- Test coverage
- Error handling
- Business logic placement
- Rule violations

### Style & Formatting → [05_csoc.md](05_csoc.md)
- Code formatting
- Component structure
- Import organization
- Comment style

---

## 📊 Documentation Statistics

| Document | Lines | Topics | Covers |
|----------|-------|--------|--------|
| 01_convention.md | ~300 | 15+ | Naming patterns, imports, exports |
| 02_structure.md | ~400 | 12+ | Directory tree, layers, dependencies |
| 03_tech.md | ~500 | 18+ | Setup, config, build, CI/CD |
| 04_rule.md | ~600 | 32 rules | Architecture, quality, testing, security |
| 05_csoc.md | ~500 | 20+ | Formatting, style, organization |
| **Total** | **~2300** | **100+** | **Complete SDK documentation** |

---

## 🔄 Keeping Docs Updated

**Update docs when**:
- Adding new conventions
- Changing layer structure
- Updating tech stack versions
- Adding new rules or guidelines
- Changing build process
- Adding new patterns

**How to update**:
1. Identify which document to update
2. Make changes
3. Test with `npm run type-check`
4. Commit with descriptive message
5. Notify team of changes

---

## 📖 Related Files

In project root:
- **CLAUDE.md** - High-level SDK guidance
- **STRUCTURE.md** - Clean Architecture overview
- **README.md** - User-facing SDK documentation
- **CHANGELOG.md** - Version history
- **package.json** - Dependencies and scripts
- **.eslintrc.json** - Linting rules
- **.prettierrc** - Formatting rules
- **tsconfig.json** - TypeScript config

---

## 💡 Pro Tips

1. **Use Ctrl+F** in docs to find specific topics
2. **Keep 04_rule.md** checklist visible during reviews
3. **Run `npm run lint:fix`** before every commit
4. **Reference conventions** when naming new things
5. **Check 02_structure.md** before creating new files
6. **Read 05_csoc.md** when unsure about formatting
7. **Review 04_rule.md** before architecture decisions

---

## 📝 Document Versions

- **Created**: 2024-06-23
- **Last Updated**: 2024-06-23
- **Applies to SDK Version**: 0.1.0+
- **Requires Node**: 16.0.0+
- **Requires React Native**: 0.72.0+

---

## 🤝 Contributing

When contributing to this SDK:
1. Read all 5 documents thoroughly
2. Follow conventions and rules
3. Update documentation if you change anything
4. Include tests for all new features
5. Run `npm run lint:fix && npm test` before PR
6. Reference relevant doc sections in PR description

---

## 📚 Document Index by Topic

### Architecture & Organization
- [02_structure.md](02_structure.md) - Full structure
- [04_rule.md](04_rule.md) - Dependency rule (#1)

### Naming & Conventions  
- [01_convention.md](01_convention.md) - All naming rules
- [05_csoc.md](05_csoc.md) - Naming details

### Code Quality
- [04_rule.md](04_rule.md) - Quality rules (#7-10)
- [05_csoc.md](05_csoc.md) - Style guidelines

### Testing
- [04_rule.md](04_rule.md) - Testing rules (#11-14)
- [03_tech.md](03_tech.md) - Jest configuration

### Setup & Tooling
- [03_tech.md](03_tech.md) - Complete setup guide
- [05_csoc.md](05_csoc.md) - IDE configuration

### Security
- [04_rule.md](04_rule.md) - Security rules (#24-26)

---

## ✅ Validation Checklist

Before publishing changes:

**Documentation**
- [ ] All 5 docs up-to-date
- [ ] Examples are correct
- [ ] No broken links or references
- [ ] Formatting is consistent

**Code**
- [ ] Follows [01_convention.md](01_convention.md)
- [ ] Respects [02_structure.md](02_structure.md)
- [ ] Uses tech from [03_tech.md](03_tech.md)
- [ ] Follows rules in [04_rule.md](04_rule.md)
- [ ] Styled per [05_csoc.md](05_csoc.md)

**Quality**
- [ ] `npm run lint:fix` passes
- [ ] `npm run type-check` passes
- [ ] `npm test` passes
- [ ] Tests have 80%+ coverage

---

**Happy coding! 🚀**

For questions or suggestions about documentation, please create an issue or PR.
