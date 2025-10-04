# 🚦 Development Rules & Constraints

## General Rules
- The UI must be built using **custom HTML-based React components**.
- **Do not install or use** any prebuilt component libraries (Material UI, ShadCN, Chakra, etc.).
- Style all elements using **Tailwind CSS classes only**.

## App Flow (3-Step MVP)
1. **Project Description** → textarea input
2. **Project Details** → fields for time, delivery, and team
3. **Results Visualization** → show AI results + CSV export

Each step should be implemented as a **separate React component** and connected through simple linear navigation.

## Scope Control
- Keep implementation minimal.
- Avoid adding routing libraries, complex state management, or design systems.
- Use plain React state (`useState`, `useEffect`).

## Cursor AI Instructions
- When generating code, always reference both `project-overview.md` and `tech-stack-guidelines.md`.
- Follow the conventions and UI restrictions strictly.
te