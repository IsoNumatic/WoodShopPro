# WoodShopPro Frontend

A React + TypeScript application for millwork project management.

## Local Mock Testing

For offline testing without Firebase or Google Auth:

1. Ensure `VITE_MOCK_MODE=true` in `.env`
2. Run `npm run dev`
3. Open http://localhost:5173
4. Click "Mock Login as Admin" to sign in instantly
5. Test all features with local data storage

Mock mode includes:
- Simulated authentication
- In-browser data persistence with localforage
- Sample projects and phases
- Debug panel for resetting data and toggling roles

## Development

```bash
npm install
npm run dev
```

## Building

```bash
npm run build
```

## Testing

```bash
npm test
```

Tests run in mock mode by default.
