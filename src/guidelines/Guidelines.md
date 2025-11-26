# HUGRxyz Design Guidelines

## General Principles
*   **Mobile-First**: Primary viewport is 320px–480px. All designs must be responsive for mobile.
*   **Single-Column Layout**: Strictly enforce a single-column vertical stack layout. No sidebars or multi-column grids unless explicitly requested for specific data visualizations.
*   **Swiss Design**: Minimalist, typography-focused, high information density, flat design (no drop shadows).
*   **Tech Stack**: React 18+, Tailwind CSS v3.4+, Shadcn UI.

## Design System Tokens

### Colors
*   **Primary**: `#feee7d` (Bright Yellow) - Use for primary actions and highlights.
*   **Neutrals**: Black (`#000`) for text/contrast, White (`#FFF`) for backgrounds, Gray-100 (`#F2F2F2`) for secondary backgrounds.
*   **Functional**: Success (`#10B981`), Error (`#ef5285`).

### Typography
*   **Font**: Inter or Roboto Flex.
*   **Scale**: H1 (24px/1.5rem), H2 (20px/1.25rem), Body (16px/1rem).
*   **Line Height**: Generous (1.5-1.7) for readability.

### Spacing & Radius
*   **Grid**: 8pt grid system. Margins/Padding should be multiples of 8px (e.g., 16px, 24px).
*   **Radius**:
    *   Cards/Containers: `rounded-xl` (12px).
    *   Buttons: `rounded-full` (99em).
    *   Inputs: `rounded-md` (6px).

## Component Guidelines

### Buttons
*   **Primary**: Yellow background, Black text, Rounded-full. Use for the main action on the screen.
*   **Secondary**: Transparent background, Gray border, Rounded-md. Use for cancel/back actions.
*   **Placement**: Primary actions typically at the bottom or top-right.

### Cards (Bento Grid)
*   **Style**: Flat design, `border border-gray-200`, no drop shadow (unless hover).
*   **Interaction**: `hover:scale-[1.01]` and `hover:shadow-md` for interactive cards.

### Inputs & Forms
*   **Validation**: Use inline validation. Show errors immediately after input focus is lost.
*   **Labels**: Clear, descriptive labels above inputs.
*   **Touch Targets**: Minimum 44px height for all interactive elements.

### Loading States
*   **Skeleton Screens**: Use shimmering skeleton loaders instead of blank screens or simple spinners for content loading.
*   **Feedback**: Provide immediate feedback for all user actions (toasts, button state changes).