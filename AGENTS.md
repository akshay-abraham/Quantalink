# Repository guidance

## Structure

- `src/app/page.tsx` is the current home cover. The old `ProfileSection` component is not rendered there.
- `src/components/main-nav.tsx` places the brand and both responsive menus in one header. Keep their 48px control height and shared vertical alignment when editing them.
- `src/components/nav-links.ts` is the source of truth for navigation labels and routes.
- `src/app/globals.css` holds most layout and motion rules. Check later selectors before changing earlier ones because this file contains some overrides near the end.
- `src/lib/projects-data.ts`, `src/lib/skills-data.tsx`, and `src/lib/journey-data.ts` contain displayed content.

## Interaction and copy

- Keep hover movement and hover triggered effects inside fine pointer rules, or explicitly neutralize them on touch devices. Touch users should still be able to tap skill cards for details and use the animated mobile menu.
- Keep motion brief and purposeful. Respect `prefers-reduced-motion` for new animations.
- Write UI copy in a direct, slightly playful voice. Avoid em dashes, generic slogans, boastful claims, and lists of three used as a writing habit.
- Keep the home cover free of the full legal name, the student and builder label, and a primary focus line.

## Checks

Run `npm run lint`, `npx tsc --noEmit --incremental false`, and `npm run format:check` after changes. Run `npm run build` when changing build behavior or metadata.
