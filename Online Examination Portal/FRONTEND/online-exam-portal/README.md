# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Project Structure (Professional/MNC Standard)

```
online-exam-portal/
│
├── public/                # Static assets (favicon, images, etc.)
│
├── src/
│   ├── api/               # Axios instances, API calls
│   ├── assets/            # Images, SVGs, etc.
│   ├── components/        # Reusable UI components
│   ├── features/          # Feature-based folders (auth, dashboard, etc.)
│   ├── hooks/             # Custom React hooks
│   ├── layouts/           # Layout components (Sidebar, Navbar, etc.)
│   ├── routes/            # Route definitions and guards
│   ├── store/             # Zustand global stores
│   ├── utils/             # Utility functions/helpers
│   ├── App.jsx
│   ├── main.jsx
│   ├── index.css
│   └── ...
├── tailwind.config.js
├── postcss.config.js
├── package.json
├── vite.config.js
└── README.md
```

---

## Authentication & Role-Based Routing

- **Login/Register**: Pages under `src/features/auth/`
- **Role-based Dashboards**: Each role gets its own dashboard component under `src/features/dashboard/`
- **Routing**: Use React Router v6+ in `src/routes/`, with a `ProtectedRoute` component to check authentication and role.
- **State Management**: Use Zustand for auth/user state.
- **API**: Use Axios for all API calls, with a central instance in `src/api/axios.js`.

---

## Implementation Plan

1. **Setup folders** as above.
2. **Create Axios instance** in `src/api/axios.js`.
3. **Create Zustand store** for auth in `src/features/auth/authSlice.js`.
4. **Build Login/Register pages** in `src/features/auth/`.
5. **Implement role-based routing** in `src/routes/`.
6. **Create dashboard components** for each role.
7. **Protect routes** using a `ProtectedRoute` component.
8. **Style with Tailwind**.

---

## Next Steps

- Start with folder setup and boilerplate files.
- Build login/register pages.
- Set up Zustand store and API.
- Implement routing and role-based dashboard logic.

Feel free to follow this structure for scalable, maintainable, and professional-grade React projects.
