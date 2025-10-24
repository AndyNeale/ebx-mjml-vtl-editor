# GitHub Copilot Instructions for ebx-mjml-vtl-editor

## Project Overview

This is a React-based MJML-VTL Editor application that provides a web interface for creating and editing email templates using MJML (Mailjet Markup Language) and VTL (Velocity Template Language). The application allows users to:

- Edit MJML templates with syntax highlighting
- Preview rendered email templates in real-time
- Test templates with JSON data for edition and article content
- Export compiled VTL files for use in email campaigns
- Toggle between MJML and VTL rendering modes

## Technology Stack

- **Frontend Framework**: React 18 with functional components and hooks
- **Build Tool**: Vite 7.x
- **Code Editor**: Monaco Editor (@monaco-editor/react)
- **Email Markup**: MJML (mjml-browser)
- **Template Engine**: Velocity Template Language (velocityjs)
- **Package Manager**: npm (with bun.lock for reference)
- **Deployment**: GitHub Pages via GitHub Actions
- **Styling**: CSS with custom classes

## Project Structure

```
├── src/
│   ├── index.jsx              # React app entry point
│   ├── App.jsx                # Main application component
│   ├── Data.jsx               # JSON data input component
│   ├── Export.jsx             # Export functionality component
│   ├── Preview.jsx            # Template preview component
│   ├── Settings.jsx           # Render settings component
│   ├── useDebounce.js         # Custom hook for debouncing
│   ├── styles.css             # Application styles
│   └── data/                  # Example data files
├── .github/
│   └── workflows/
│       └── deploy.yml         # GitHub Pages deployment
├── package.json               # Dependencies and scripts
├── vite.config.js             # Vite configuration
└── index.html                 # HTML template
```

## Development Workflow

### Building and Testing
- **Install dependencies**: `npm install`
- **Development server**: `npm run dev` or `npm start`
- **Production build**: `npm run build`
- **Preview build**: `npm run preview`
- **Deploy**: `npm run deploy` (builds and deploys to GitHub Pages)

### Code Style and Conventions

1. **React Components**: Use functional components with hooks
2. **State Management**: Use React hooks (useState, useEffect, useRef)
3. **File Naming**: Use PascalCase for components, camelCase for utilities
4. **Import Order**: External libraries first, then local imports
5. **Event Handlers**: Prefix with `on` (e.g., `onEditorChange`, `onDataChange`)
6. **Constants**: Use UPPER_SNAKE_CASE for constants
7. **CSS Classes**: Use kebab-case and semantic naming

### Key Application Logic

- **Debouncing**: Content changes are debounced (500ms) before rendering
- **Dual Rendering**: Templates can be rendered with both VTL and MJML processing
- **Data Context**: Supports edition data and article data for template variables
- **Error Handling**: Graceful handling of VTL and MJML compilation errors
- **Export Process**: Wraps VTL directives in `<mj-raw>` tags for MJML compatibility

## Appropriate Tasks for Copilot

### ✅ Good Tasks (Well-Suited for Copilot)
- **Bug fixes**: Simple logic errors, typos, missing imports
- **UI improvements**: CSS styling, layout adjustments, accessibility fixes
- **Feature additions**: New buttons, form fields, settings toggles
- **Code cleanup**: Refactoring small functions, removing dead code
- **Documentation**: Adding JSDoc comments, updating README
- **Testing**: Adding unit tests for individual components
- **Configuration**: Updating package.json, Vite config, or GitHub Actions
- **Performance**: Optimizing renders, adding memoization, improving debouncing
- **Validation**: Adding input validation, error boundaries

### ❌ Complex Tasks (Require Human Oversight)
- **Core editor integration**: Major changes to Monaco Editor setup
- **MJML/VTL parsing logic**: Complex template engine modifications  
- **State architecture**: Fundamental changes to data flow
- **Build system overhaul**: Major Vite or deployment configuration changes
- **Security-critical**: Authentication, data sanitization, XSS prevention
- **Performance profiling**: Deep optimization requiring measurement
- **Integration**: Adding new external services or APIs

## File-Specific Guidelines

### `src/App.jsx`
- Main application logic - be careful with state dependencies
- The useEffect with rendering logic is critical - test thoroughly
- Export functionality has specific MJML wrapping logic - preserve it

### `src/useDebounce.js`
- Simple custom hook - safe for modifications
- Changes here affect all editor performance

### Component Files (`Data.jsx`, `Export.jsx`, etc.)
- Self-contained components - generally safe to modify
- Maintain prop interface consistency

### Configuration Files
- `vite.config.js`: Simple config, safe for minor changes
- `package.json`: Be careful with dependency versions
- `.github/workflows/deploy.yml`: Test deployment changes carefully

## Common Patterns and APIs

### State Updates
```javascript
const [state, setState] = useState(initialValue);
// Always use functional updates for state that depends on previous state
setState(prev => ({ ...prev, newProperty: value }));
```

### Error Handling
```javascript
try {
  const result = mjml2html(template);
  // Process result
} catch (error) {
  console.log("Specific error context", error);
  // Graceful fallback
}
```

### Event Handlers
```javascript
const onSomethingChange = (event) => {
  // Extract value first
  const value = event.target.value;
  // Then update state
  setSomething(value);
};
```

## Testing Strategy

Since this is a UI-heavy application:
- **Manual testing**: Always test in browser after changes
- **Build verification**: Run `npm run build` to ensure no build errors
- **Cross-browser**: Test in Chrome/Firefox for Monaco Editor compatibility
- **Template testing**: Use example JSON data to verify rendering pipeline

## Troubleshooting Common Issues

### Build Failures
- Check for missing imports or exports
- Verify all React components have proper default exports
- Ensure no syntax errors in JSX

### Runtime Errors
- Check browser console for JavaScript errors
- Verify JSON data format in data inputs
- Test with simpler MJML templates first

### Rendering Issues
- VTL errors often indicate data structure mismatches
- MJML errors usually point to invalid markup
- Check that VTL directives are properly escaped

## Dependencies and Updates

### Core Dependencies (Handle with Care)
- `react` and `react-dom`: Test thoroughly after updates
- `@monaco-editor/react`: Editor functionality - test extensively
- `mjml-browser`: Email compilation - verify output
- `velocityjs`: Template processing - test with existing templates

### Safe to Update
- `file-saver`: Simple utility
- `pretty`: Code formatting utility
- Build tools (Vite, Babel) - usually safe with testing

## Security Considerations

- **Template injection**: Be aware that VTL templates execute code
- **File downloads**: Export functionality should be XSS-safe
- **JSON parsing**: User-provided JSON should be validated
- **Dependencies**: Keep packages updated for security patches

## Issue Writing Guidelines

When creating issues for this repository:

1. **Be specific about the component**: Mention which file/component needs changes
2. **Include context**: Explain the current behavior vs. expected behavior
3. **Provide examples**: Include sample MJML/VTL code if relevant
4. **Specify testing**: Mention if changes need testing with specific data
5. **Consider impact**: Note if changes affect the rendering pipeline

### Example Good Issue
```
## Bug: VTL rendering fails with nested objects

**Current behavior**: When using nested objects in article data like `$article.metadata.author.name`, the template fails to render.

**Expected behavior**: Nested object properties should be accessible in VTL templates.

**To reproduce**: 
1. Use example article JSON
2. Add template code: `$article.metadata.author.name`  
3. Enable VTL rendering
4. Observe error in console

**Files likely affected**: `src/App.jsx` (VTL rendering logic)
```

## Deployment

The application deploys automatically to GitHub Pages when changes are pushed to the main branch. The deployment:
- Builds the application with `npm run build`
- Publishes the `build` directory to GitHub Pages
- Uses Node.js 24.x in the CI environment

Any changes should be tested locally before merging to ensure successful deployment.