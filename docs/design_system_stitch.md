# Finança Pró Design System

### 1. Overview & Creative North Star
**Creative North Star: The Sovereign Ledger**
Finança Pró is a high-end financial design system that rejects the cluttered, "spreadsheet-style" density of traditional fintech. It embraces a "Sovereign Ledger" aesthetic—combining the weight of institutional finance with the fluidity of a modern luxury interface. The system prioritizes breathing room, deep tonal contrast, and editorial typographic scales to create an environment that feels secure yet effortless.

Asymmetry is used intentionally in sidebar navigation and card layouts to break the rigid grid, guiding the eye toward "Primary Anchors" (like current balance) while letting secondary data (budgets and goals) sit in a supportive, layered hierarchy.

### 2. Colors
The palette is built on a "Deep Night" foundation (`#131313`) punctuated by "Electric Periwinkle" (`#b0c6ff`) and "Copper Ember" (`#ffb59b`).

- **The "No-Line" Rule:** Visual separation is achieved through background shifts (e.g., `#131313` to `#1c1b1b`) or 10% opacity overlays. Never use 1px solid borders for sectioning; boundaries must be felt, not seen.
- **Surface Hierarchy & Nesting:** Use `surface_container_low` for the primary sidebar, `surface` for the main canvas, and `surface_container_highest` for interactive card states.
- **The "Glass & Gradient" Rule:** Use `rgba(57, 57, 57, 0.4)` with a 20px backdrop blur for floating navigation or mobile top bars.
- **Signature Textures:** Primary CTAs should utilize a subtle `linear-gradient(to bottom right, #b0c6ff, #0058cb)` to provide tactile depth against the flat dark background.

### 3. Typography
The system utilizes a dual-font approach: **DM Sans** (mapped to Plus Jakarta Sans) for high-impact headlines and **Source Sans 3** (mapped to Public Sans) for technical data and labels.

**Typographic Rhythm (Extracted Ground Truth):**
- **Display/Hero:** `2.25rem` (36px) with `-0.05em` tracking for balances.
- **Headline Large:** `1.875rem` (30px) for section headers.
- **Title/Body:** `1.125rem` (18px) to `1.25rem` (20px) for primary navigation and card titles.
- **Standard Body:** `0.875rem` (14px) for descriptions.
- **Micro-Labels:** `10px` (0.625rem) with bold weights and `0.1em` tracking for status updates and meta-data.

### 4. Elevation & Depth
Elevation is expressed through **Tonal Stacking** and **Long Ambient Shadows** rather than Z-axis displacement.

- **The Layering Principle:**
- Base: `surface` (#131313)
- Level 1: `surface_container_low` (#1c1b1b) for sidebars.
- Level 2: `surface_container` (#201f1f) for main content cards.
- **Ambient Shadows:** The "Editorial Shadow" is defined as `0px 24px 48px rgba(0, 0, 0, 0.4)`. It is reserved for high-priority containers like the primary balance card or active sidebars.
- **Glassmorphism:** Use `backdrop-filter: blur(20px)` on mobile bottom bars to allow content to "ghost" through, maintaining a sense of spatial awareness.

### 5. Components
- **Buttons:** Primary buttons are pill-shaped (rounded-full) with high-contrast gradients. Secondary buttons use `surface_container_highest` with no border.
- **Cards:** Financial cards use `1.5rem` (xl) corner radius. The "Primary Anchor" card uses a 10% opacity glow effect (`#b0c6ff/10`) to distinguish it from standard data cards.
- **Progress Indicators:** Use thin (`0.375rem`) tracks with high-saturation fills (`#b0c6ff` or `#ffb59b`) to indicate goal progress without overwhelming the layout.
- **Navigation:** Side navigation uses a "Bar & Scale" active state—a 4px left-accent border combined with a subtle `scale(0.98)` to simulate a physical "pressed" feel.

### 6. Do's and Don'ts
- **Do:** Use opacity (e.g., 60%) for secondary labels instead of choosing a different hex value to maintain tonal harmony.
- **Do:** Use large-format icons (24px) with `Material Symbols Outlined` at a 400 weight.
- **Don't:** Use pure white (`#FFFFFF`) for text. Stick to `on_surface` (`#e5e2e1`) to reduce eye strain in dark mode.
- **Don't:** Mix corner radii. Everything from cards to buttons should follow the `rounded-full` or `rounded-xl` logic. No sharp corners.