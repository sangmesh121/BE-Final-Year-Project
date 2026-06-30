# Project Structure

This project follows a scalable React Native directory structure.

## Directory Layout relative to `src/`

- **`components/`**: Reusable UI components (Buttons, Cards, Container, etc.).
- **`screens/`**: Application screens (pages). Each screen should be a component.
- **`navigation/`**: Navigation configuration (Stack, Tab, Drawer navigators).
- **`services/`**: API calls and external service integrations.
- **`hooks/`**: Custom React hooks.
- **`utils/`**: Helper functions and utilities.
- **`constants/`**: Global constants (Configuration, strings).
- **`theme/`**: Design tokens (Colors, Spacing, Typography).
- **`assets/`**: Images, fonts, and other static assets (can be at root or src).
- **`types/`**: TypeScript type definitions.

## Entry Point

`App.tsx` is the application entry point. It imports the root navigator from `src/navigation`.

## Getting Started

1. Run `npm install`
2. Run `npm start` (or `npx expo start`)
