# Project Overview

This is the Echobox MJML-VTL Editor, a React web application that provides an integrated development environment for creating and editing email templates using MJML (responsive email framework) and VTL (Velocity Template Language). The editor features real-time preview, data injection capabilities, and export functionality for email campaign development.

The application is designed for developers and email marketers who need to create responsive email templates with dynamic content using MJML markup and Velocity template syntax.

# Tech Stack

- **Frontend Framework**: React 18 with functional components and hooks
- **Code Editor**: Monaco Editor (VS Code editor in browser) via @monaco-editor/react
- **Email Framework**: MJML v4.14.1 for responsive email markup
- **Template Engine**: VelocityJS v2.0.6 for dynamic content rendering
- **Build Tool**: Create React App (react-scripts v5.0.1)
- **Package Manager**: Yarn
- **Deployment**: GitHub Pages
- **CI/CD**: GitHub Actions (deploy.yml workflow)

# Coding Guidelines

- Use functional React components with hooks (useState, useEffect, useRef)
- Follow React best practices for state management and component lifecycle
- Use ESLint configuration from Create React App
- Maintain consistent JSX formatting and component structure
- Use camelCase for variable and function names
- Keep components focused and single-responsibility
- Use custom hooks for reusable logic (see useDebounce.js)
- Handle errors gracefully, especially for MJML compilation and VTL rendering
- Use descriptive variable names for data objects and template content

# Project Structure

```
├── src/
│   ├── App.jsx              # Main application component with editor logic
│   ├── Data.jsx             # Data management component for VTL variables
│   ├── Export.jsx           # Export functionality component
│   ├── Preview.jsx          # Live preview component for rendered content
│   ├── Settings.jsx         # Application settings and configuration
│   ├── useDebounce.js       # Custom hook for debounced updates
│   ├── data/                # Example data files for templates
│   │   ├── articleDataExample.js
│   │   ├── editionDataExample.js
│   │   └── example.js
│   ├── index.js             # Application entry point
│   └── styles.css           # Global styles
├── public/
│   └── index.html           # HTML template
├── .github/
│   └── workflows/
│       └── deploy.yml       # GitHub Actions deployment workflow
└── package.json             # Dependencies and scripts
```

# Key Features & Concepts

- **Real-time Rendering**: Uses debounced updates to render MJML and VTL content
- **Data Injection**: Supports dynamic data binding with edition and article data
- **Export Options**: Provides encoded and non-encoded export formats
- **MJML Integration**: Wraps Velocity directives in `<mj-raw>` tags for MJML compatibility
- **Custom Blocks**: Handles special Echobox block types with `@@@` delimiters

# Development Workflow

- Use `yarn start` for development server with hot reloading
- Use `yarn build` for production builds
- Use `yarn test` for running tests (currently minimal test setup)
- Use `yarn deploy` for GitHub Pages deployment
- The app expects data in specific formats for edition and article variables

# References

- [MJML Documentation](https://mjml.io/documentation/)
- [Velocity Template Language Guide](https://velocity.apache.org/engine/2.3/user-guide.html)
- [Monaco Editor API](https://microsoft.github.io/monaco-editor/api/)
- [React Documentation](https://react.dev/)