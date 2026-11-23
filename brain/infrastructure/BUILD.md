# Build Pipeline & Asset Compilation

> **Scope**: Compilation phases, bundle budgets, Rollup output chunks, and asset optimization.  
> **Status**: `VERIFIED`

---

## 1. Production Build Lifecycle

Executing `npm run build` triggers a 3-phase verification and packaging process:

```
                  npm run build
                        │
                        ▼
            [Phase 1: Client Typecheck]
            tsc (tsconfig.json)
                        │
                        ▼
            [Phase 2: Serverless Typecheck]
            tsc -p tsconfig.api.json
                        │
                        ▼
            [Phase 3: Rollup Asset Bundling]
            vite build
                        │
                        ▼
            [Distribution: dist/]
```

---

## 2. Bundle Partitioning & Chunk Breakdown

Output generated in `dist/`:

| Output Chunk File | Estimated Size | Gzip Size | Cache Policy |
| :--- | :--- | :--- | :--- |
| `vendor-core-*.js` | ~140 KB | ~45 KB | `Cache-Control: public, max-age=31536000, immutable` |
| `vendor-icons-*.js` | ~35 KB | ~10 KB | `Cache-Control: public, max-age=31536000, immutable` |
| `module-flagship-valuation-*.js`| ~48 KB | ~14 KB | `Cache-Control: public, max-age=31536000, immutable` |
| `module-case-studies-*.js` | ~62 KB | ~18 KB | `Cache-Control: public, max-age=31536000, immutable` |
| `index-*.css` | ~28 KB | ~6 KB | `Cache-Control: public, max-age=31536000, immutable` |
| `index.html` | ~6 KB | ~2 KB | `Cache-Control: public, max-age=0, must-revalidate` |

