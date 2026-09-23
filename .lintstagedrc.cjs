module.exports = {
  "web/src/**/*.{ts,tsx}": [
    "pnpm --dir web exec eslint",
    "pnpm --dir web exec prettier --write",
  ],
  "web/src/**/*.css": ["pnpm --dir web exec prettier --write"],
  "api/src/**/*.java": [
    () => "pnpm format:api",
    () => "pnpm lint:api",
  ],
};
