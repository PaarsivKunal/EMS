# EMS-Main

Employee Management System (server + Vite client)

## Contents
- `server/` - Node.js + Express server
- `vite_client/` - Vite React client

## Requirements
- Node.js >= 16
- npm or yarn

## Quick start

1. Install server dependencies

```powershell
cd server
npm install
```

2. Install client dependencies

```powershell
cd ../vite_client
npm install
```

3. Run server and client (in two terminals)

```powershell
# Terminal A
cd server
npm run dev

# Terminal B
cd vite_client
npm run dev
```

## Environment variables
- Copy `server/env.example` to `server/.env` and fill values.
- Copy `vite_client/.env` from `.env.example` if present.
- Do NOT commit `.env` files (a `.gitignore` is included).

## Running tests
- Server tests (if any):

```powershell
cd server
npm test
```

- Client tests:

```powershell
cd vite_client
npm test
```

## Contributing
- Create a branch: `git checkout -b feature/your-feature`
- Commit and push, open a Pull Request.

## Notes
- Avoid committing `node_modules/` and `.env`. Use the provided `.gitignore`.
- If you need help setting up GitHub (push auth or SSH keys), see the repo’s CONTRIBUTING or contact the maintainer.

## License
Add license details here (MIT, Apache-2.0, etc.)
