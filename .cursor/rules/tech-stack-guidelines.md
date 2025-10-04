# ⚙️ Tech Stack Guidelines

## Stack
- **Framework:** React (Vite setup already initialized)
- **Language:** TypeScript
- **Styling:** Tailwind CSS (utility-first approach)
- **HTTP Requests:** Native `fetch`
- **State Management:** Minimal (React useState/useEffect)
- **Package Manager:** pnpm
- **Environment:** Node.js 18+ compatible

> ⚠️ Important:
> - The project is already initialized with **Vite + React + TypeScript**.  
> - Do **not** reinitialize or modify the environment setup.  
> - When installing new dependencies, use only:
>   ```
>   pnpm add <package-name>
>   ```
> - To run the dev server:
>   ```
>   pnpm dev
>   ```

---

## 🧩 UI Components
- Build **custom UI components manually** using plain React and HTML elements.  
- Use **Tailwind CSS** classes for styling.  
- **Do NOT** install or use any external UI/component libraries, including but not limited to:
  - Material UI (MUI)
  - ShadCN
  - Chakra UI
  - Ant Design
  - Bootstrap
- All buttons, inputs, and layout elements must be written from scratch as **custom vanilla components**.

---

## Coding Conventions
- **PascalCase** → React components and classes.  
- **camelCase** → functions, variables, hooks.  
- **kebab-case** → file and folder names.  
- Avoid `any` type; define explicit TypeScript interfaces.  
- Organize components inside `/components`, utilities inside `/utils`.  
- Use **functional components** (`function ComponentName() {}`) only.

---

## Best Practices
- Follow React and TypeScript best practices.
- Use async/await with try/catch for `fetch` requests.
- Validate and handle API responses safely.
- Comment only where necessary for clarity.
- Keep components small, focused, and easy to test.

---

## Import/Export Rules
- Use **named exports** unless a single default makes sense.  
- Keep imports sorted and consistent.  
- No unused imports or variables.

---

## Code Style
- 2-space indentation.  
- Single quotes for strings.  
- Prefer template literals.  
- No inline `style` props — use Tailwind utilities.  

---

## Build & Run Notes
- The project uses **Vite** — never use CRA or Next.js commands.  
- Ensure Tailwind is configured in `tailwind.config.ts`.  
- Verify styles by running `pnpm dev`.  
