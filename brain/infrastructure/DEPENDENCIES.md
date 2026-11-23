# Dependencies & Third-Party Library Inventory

> **Scope**: Package manifests, licensing, version constraints, and audit status.  
> **Status**: `VERIFIED`

---

## 1. Production Dependencies

| Package Name | Specified Version | Resolved Version | License | Security & Maintenance Notes |
| :--- | :--- | :--- | :--- | :--- |
| `react` | `^18.3.1` | `18.3.1` | MIT | Core UI framework; concurrent rendering enabled. |
| `react-dom` | `^18.3.1` | `18.3.1` | MIT | DOM mounting engine. |
| `lucide-react` | `^0.475.0` | `0.475.0` | ISC | Tree-shaken icons; zero external dependencies. |
| `clsx` | `^2.1.1` | `2.1.1` | MIT | Lightweight string concatenation utility (0.4KB). |
| `@neondatabase/serverless` | `^1.2.0` | `1.2.0` | Apache-2.0 | High-performance serverless HTTP PostgreSQL driver. |
| `@neon/config` | `^1.14.0` | `1.14.0` | MIT | Configuration bindings for Neon projects. |
| `@neon/env` | `^2.1.3` | `2.1.3` | MIT | Dynamic environment synchronization. |
| `pdfjs-dist` | `^4.10.38` | `4.10.38` | Apache-2.0 | Mozilla PDF text parser executing strictly client-side. |

---

## 2. Development Tooling & Compilers

| Package Name | Specified Version | License | Responsibility |
| :--- | :--- | :--- | :--- |
| `vite` | `^6.0.7` | MIT | ES module dev server and Rollup bundler. |
| `typescript` | `^5.7.2` | Apache-2.0 | Static type checker. |
| `tailwindcss` | `^3.4.17` | MIT | Utility-first CSS generation. |
| `postcss` | `^8.5.30` | MIT | CSS transform pipeline. |
| `autoprefixer` | `^10.6.1` | MIT | Vendor prefix injection. |
| `@vitejs/plugin-react` | `^4.3.4` | MIT | React fast refresh and Babel JSX transforms. |
| `@types/node` | `^22.13.4` | MIT | Node.js typings for crypto, fs, and path. |

