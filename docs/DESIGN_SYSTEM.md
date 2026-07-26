# hackpack Design System

## Mission
Create implementation-ready, token-driven UI guidance for hackpack that is optimized for consistency, accessibility, and fast iteration across all surfaces (landing, CLI, documentation, dashboards).

## Brand
- **Product:** hackpack — Full-stack project scaffolding CLI
- **Audience:** Developers, hackers, builders (technical, ship-fast mindset)
- **Primary surface:** Marketing site + CLI output guides
- **Visual philosophy:** Clean, direct, outcome-focused. No decorative complexity. Speed and clarity over visual embellishment.

---

## Design Tokens & Foundations

### Typography
```
font.family.primary = -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif
font.family.mono = 'Monaco', 'Courier New', monospace

font.size.xs = 12px       (small labels, secondary text)
font.size.sm = 14px       (body small, form labels)
font.size.md = 16px       (body base, default)
font.size.lg = 18px       (subheadings, emphasis)
font.size.xl = 24px       (section headings)
font.size.2xl = 28px      (page subheadings)
font.size.3xl = 32px      (page headings)
font.size.4xl = 42px      (hero headlines)
font.size.5xl = 56px      (major headlines)

font.weight.regular = 400
font.weight.semibold = 600
font.weight.bold = 700
font.weight.black = 900

line.height.tight = 1.2   (headlines)
line.height.base = 1.6    (body text)
line.height.loose = 1.8   (long-form content)

letter.spacing.tight = -0.02em
letter.spacing.normal = 0em
letter.spacing.wide = 0.03em
```

### Color Palette
```
# Text
color.text.primary = #f1f5f9       (primary text, high contrast)
color.text.secondary = #cbd5e1     (secondary text, reduced emphasis)
color.text.tertiary = #94a3b8      (tertiary text, lowest priority)
color.text.disabled = #64748b       (disabled state text)
color.text.inverse = #0f172a       (text on light/bright backgrounds)

# Surfaces
color.surface.base = #0f172a       (dark background, primary)
color.surface.elevated = #1a2a4a   (elevated surfaces, cards, modals)
color.surface.muted = #1e293b      (muted background, sidebars)
color.surface.overlay = rgba(15, 23, 42, 0.9)  (semi-transparent overlay)

# Semantic Colors
color.primary = #3b82f6            (blue: action, speed, primary CTA)
color.primary.dark = #1e40af       (blue darker: active state)
color.primary.light = #60a5fa      (blue lighter: hover state)

color.success = #10b981            (green: ready, deployed, success)
color.success.dark = #059669       (green darker: active)
color.success.light = #6ee7b7      (green lighter: hover)

color.warning = #f59e0b            (amber: caution, attention)
color.warning.dark = #d97706       (amber darker: active)
color.warning.light = #fbbf24      (amber lighter: hover)

color.error = #ef4444              (red: error, destructive)
color.error.dark = #dc2626         (red darker: active)
color.error.light = #f87171        (red lighter: hover)

color.accent.pink = #ec4899        (pink: emphasis, gradient)
color.accent.purple = #8b5cf6      (purple: features, composability)
color.accent.orange = #f97316      (orange: custom, special)
color.accent.indigo = #6366f1      (indigo: advanced)

# Glass/Frosted effect
color.glass.bg = rgba(15, 23, 42, 0.5)
color.glass.border = rgba(59, 130, 246, 0.2)
```

### Spacing Scale
```
space.0 = 0px
space.1 = 4px
space.2 = 8px
space.3 = 12px
space.4 = 16px
space.5 = 24px
space.6 = 32px
space.7 = 48px
space.8 = 64px

# Composed spacing for common patterns
space.gutter = space.4         (horizontal padding/gap)
space.section = space.8        (vertical section spacing)
space.stack = space.3          (vertical item spacing)
```

### Border Radius
```
radius.none = 0px
radius.xs = 4px              (form inputs, small components)
radius.sm = 6px              (buttons, cards)
radius.md = 8px              (modal, large components)
radius.lg = 12px             (hero sections, major containers)
radius.full = 9999px         (pills, badges, rounded avatars)
```

### Motion & Transitions
```
motion.duration.instant = 0ms        (instant feedback, no delay)
motion.duration.fast = 150ms         (micro-interactions, transitions)
motion.duration.normal = 300ms       (page transitions, modals)
motion.duration.slow = 500ms         (hero animations, reveals)

motion.easing.ease-in = cubic-bezier(0.4, 0, 1, 1)
motion.easing.ease-out = cubic-bezier(0, 0, 0.2, 1)
motion.easing.ease-in-out = cubic-bezier(0.4, 0, 0.2, 1)

# Specific transitions
motion.fade = opacity motion.duration.fast ease-out
motion.slide-up = transform motion.duration.normal ease-out
motion.scale = transform motion.duration.fast ease-out
```

### Shadows
```
shadow.sm = 0 1px 2px rgba(0, 0, 0, 0.05)
shadow.md = 0 4px 6px rgba(0, 0, 0, 0.1)
shadow.lg = 0 10px 15px rgba(0, 0, 0, 0.1)
shadow.xl = 0 20px 25px rgba(0, 0, 0, 0.15)

shadow.glow.blue = 0 0 20px rgba(59, 130, 246, 0.3)
shadow.glow.green = 0 0 20px rgba(16, 185, 129, 0.3)
```

---

## Component Library

### Button

**Intent:** Primary, secondary, tertiary, ghost interactions with clear state feedback.

**Anatomy:**
```
Button
├── Icon (optional, leading)
├── Label (text)
└── Icon (optional, trailing)
```

**Variants:**
- **Primary** (solid blue) — Main actions, "Try Now", "Deploy Now", "Get Started"
- **Secondary** (blue outline) — Alternative actions, less urgent
- **Ghost** (transparent) — Tertiary actions, navigation-like
- **Danger** (solid red) — Destructive actions only

**States:**
```
Default
├── bg: color.primary
├── text: color.text.tertiary
├── cursor: pointer

Hover
├── bg: color.primary.dark
├── shadow: shadow.md
├── scale: 1.02 (subtle)

Focus-Visible
├── outline: 2px solid color.primary
├── outline-offset: 2px
├── no keyboard-only hide

Active (Pressed)
├── bg: color.primary.dark
├── scale: 0.98 (press feedback)

Disabled
├── bg: color.surface.muted
├── text: color.text.disabled
├── cursor: not-allowed
├── opacity: 0.5

Loading
├── show spinner icon
├── disable pointer-events
├── text opacity: 0.7
```

**Sizing:**
```
Small:    padding.x=space.3, padding.y=space.1, font.size=font.size.sm
Default:  padding.x=space.4, padding.y=space.2, font.size=font.size.md
Large:    padding.x=space.5, padding.y=space.3, font.size=font.size.lg
```

**Keyboard & Touch:**
- **Keyboard:** Must be focusable (tabindex=0 if needed), activate on Enter or Space
- **Touch:** Minimum 44px tap target height (WCAG 2.5.5)
- **Pointer:** Must support both click and keyboard activation

**Typography Rules:**
- Must use font.weight.semibold
- Text must be all caps for primary actions OR Title Case for secondary
- No long labels (max 24 chars); use tooltips for context

**Accessibility Criteria:**
- ✓ Contrast ratio ≥ 4.5:1 (color.primary on color.surface.base)
- ✓ Focus indicator clearly visible (2px outline, 2px offset)
- ✓ Disabled buttons announced as disabled (aria-disabled or disabled attr)
- ✓ Loading state must be announced (aria-busy or aria-label="Loading...")
- ✓ Form submit buttons must have type="submit"

**Anti-Patterns:**
- ❌ Do NOT use gray buttons (low contrast, unclear intent)
- ❌ Do NOT remove focus indicators
- ❌ Do NOT use multiple primary buttons on one page
- ❌ Do NOT use buttons for navigation (use links instead)
- ❌ Do NOT disable buttons without clear reason

**QA Checklist:**
- [ ] Button has text label or aria-label
- [ ] Focus outline is visible at 200% zoom
- [ ] Hover state shows clear feedback
- [ ] Click/keyboard activation both work
- [ ] Disabled state prevents interaction
- [ ] Loading spinner shows while loading
- [ ] Contrast passes WCAG AA (≥4.5:1)

---

### Link

**Intent:** Navigate between pages or sections. Lighter-weight than buttons.

**Anatomy:**
```
Link
├── Icon (optional, leading)
├── Text
└── Icon (optional, trailing: external, arrow)
```

**Variants:**
- **Inline** — Within body text
- **Standalone** — Navigation links, call-to-action links
- **External** — Links to external sites (show icon)

**States:**
```
Default
├── color: color.primary
├── text-decoration: none
├── cursor: pointer

Visited
├── color: color.primary.dark
├── opacity: 0.8

Hover
├── color: color.primary.dark
├── text-decoration: underline
├── opacity: 1

Focus-Visible
├── outline: 2px solid color.primary
├── outline-offset: 2px
├── border-radius: radius.xs

Active
├── color: color.primary.light (lighter on hover release)

Disabled
├── color: color.text.disabled
├── cursor: not-allowed
├── opacity: 0.5
```

**Typography:**
- Inline links must inherit parent font size
- Standalone links should use font.size.md or font.size.lg
- Never use font.weight.bold (conflicts with link color for detection)

**Keyboard & Touch:**
- Must be keyboard focusable
- Activate on Enter key
- Minimum 44px tap target (padding if needed)
- Never keyboard-trap

**Accessibility Criteria:**
- ✓ Link purpose is clear from text alone (or aria-label)
- ✓ Underline or other visual indicator visible (not color alone)
- ✓ Focus outline clearly visible
- ✓ External links announced (aria-label="... (opens external site)" or icon with aria-label)
- ✓ Contrast ≥ 4.5:1 against background

**Anti-Patterns:**
- ❌ Do NOT use "Click here" or "Read more" (unclear purpose)
- ❌ Do NOT rely on color alone to indicate links (use underline)
- ❌ Do NOT open links in new tabs without warning (aria-label)
- ❌ Do NOT style links to look like buttons

**QA Checklist:**
- [ ] Link text is descriptive (3+ words)
- [ ] Focus indicator visible
- [ ] Underline or visual distinction present
- [ ] External links have icon + warning
- [ ] Contrast ≥ 4.5:1
- [ ] Visited state visually different

---

### Card / Glass Component

**Intent:** Container for grouped content with subtle visual separation.

**Anatomy:**
```
Card (Glass)
├── Background (frosted: color.glass.bg)
├── Border (color.glass.border)
├── Content (padding: space.5)
└── Footer (optional)
```

**Variants:**
- **Default** — Frosted glass effect, dark background
- **Elevated** — Subtle shadow, slightly lighter
- **Interactive** — Hover state, pointer cursor

**States:**
```
Default
├── bg: color.glass.bg
├── border: 1px solid color.glass.border
├── backdrop-filter: blur(10px)
├── border-radius: radius.md
├── padding: space.5

Hover (Interactive only)
├── border: 1px solid color.primary light
├── shadow: shadow.md
├── transform: scale(1.01)
├── transition: motion.duration.fast

Focus-Visible (Interactive only)
├── outline: 2px solid color.primary
├── outline-offset: 2px
```

**Responsive:**
- Mobile: Full width, padding space.4
- Tablet: max-width 600px, padding space.5
- Desktop: max-width 800px, padding space.6

**Anti-Patterns:**
- ❌ Do NOT use solid backgrounds (use glass effect)
- ❌ Do NOT stack cards without spacing (min space.4 gap)
- ❌ Do NOT make interactive cards without hover feedback

**QA Checklist:**
- [ ] Blur effect visible on modern browsers
- [ ] Border color meets contrast requirements
- [ ] Hover feedback clear and smooth
- [ ] Content readable on all backgrounds
- [ ] No content overflow hidden without scroll

---

### Typography / Text Styles

**Intent:** Consistent text hierarchy and readability across all surfaces.

**Heading Levels:**
```
h1 (Hero)
├── font.size: font.size.5xl
├── font.weight: font.weight.black
├── line.height: line.height.tight
├── letter.spacing: letter.spacing.tight
├── color: color.text.primary
├── margin-bottom: space.4

h2 (Section)
├── font.size: font.size.3xl
├── font.weight: font.weight.bold
├── line.height: line.height.tight
├── color: color.text.primary
├── margin-bottom: space.3

h3 (Subsection)
├── font.size: font.size.2xl
├── font.weight: font.weight.bold
├── line.height: line.height.tight
├── color: color.text.primary
├── margin-bottom: space.3

h4, h5, h6 (Minor)
├── font.size: font.size.lg
├── font.weight: font.weight.semibold
├── line.height: line.height.base
├── color: color.text.primary
├── margin-bottom: space.2
```

**Body Text:**
```
Body (Default)
├── font.size: font.size.md
├── font.weight: font.weight.regular
├── line.height: line.height.base
├── color: color.text.primary
├── max-width: 65 characters (optimal reading)

Body Small
├── font.size: font.size.sm
├── color: color.text.secondary
├── line.height: line.height.base

Body Xsmall (Labels, captions)
├── font.size: font.size.xs
├── color: color.text.tertiary
├── font.weight: font.weight.semibold
├── letter.spacing: letter.spacing.wide
```

**Emphasis & Special:**
```
Bold          → font.weight: font.weight.bold, inherit size
Code Inline   → font.family.mono, bg: color.surface.muted, padding: space.1, border-radius: radius.xs
Code Block    → font.family.mono, bg: color.surface.base, padding: space.4, border-radius: radius.md, overflow-x: auto
```

**Accessibility:**
- ✓ Maintain max 65 characters per line for readability
- ✓ Use semantic heading hierarchy (don't skip levels)
- ✓ Ensure 4.5:1 contrast for body text
- ✓ Avoid ALL CAPS for body text (harder to read)
- ✓ Line height ≥ 1.5 for body text (WCAG)

---

### Form Input

**Intent:** Accessible, clear form fields with state feedback.

**Anatomy:**
```
FormInput
├── Label (always present, associated via htmlFor)
├── Input field
├── Helper text (optional)
├── Error message (optional)
└── Character counter (optional)
```

**States:**
```
Default
├── bg: color.surface.base
├── border: 1px solid color.text.tertiary
├── color: color.text.primary
├── padding: space.3
├── border-radius: radius.xs

Hover
├── border: 1px solid color.primary.light
├── cursor: text

Focus-Visible
├── border: 2px solid color.primary
├── outline: none (use border instead)
├── box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1)

Filled
├── bg: color.surface.elevated
├── color: color.text.primary

Disabled
├── bg: color.surface.muted
├── border: 1px solid color.text.disabled
├── color: color.text.disabled
├── cursor: not-allowed

Error
├── border: 2px solid color.error
├── error-message: color.error, font.size.sm
├── bg: rgba(239, 68, 68, 0.05)

Success
├── border: 2px solid color.success
├── bg: rgba(16, 185, 129, 0.05)
```

**Label Requirements:**
- Must have explicit `<label>` element
- Must have `htmlFor` or `aria-labelledby`
- Font: font.size.sm, font.weight.semibold, color.text.secondary
- Margin-bottom: space.2

**Helper Text:**
- Font: font.size.xs, color.text.tertiary
- Margin-top: space.1
- Use for hints, examples, constraints

**Error States:**
- Always show error message below field
- Announce error to screen readers: `role="alert"`
- Prevent form submission

**Keyboard & Touch:**
- Tab key must move through fields
- Enter key submits form (only on last field or button)
- Arrow keys for date/select inputs
- Minimum 44px height for touch

**Accessibility Criteria:**
- ✓ Label associated via htmlFor (not aria-label alone)
- ✓ Error messages linked via aria-describedby
- ✓ Focus outline clearly visible (2px border)
- ✓ Contrast ≥ 4.5:1 for all text
- ✓ Required fields marked with asterisk (*) AND aria-required="true"
- ✓ Error messages in plain language (not codes)

**Anti-Patterns:**
- ❌ Do NOT use placeholder as label
- ❌ Do NOT remove focus outlines
- ❌ Do NOT make fields required without indication
- ❌ Do NOT use color alone for error/success state

**QA Checklist:**
- [ ] Label visible and associated
- [ ] Focus indicator clear
- [ ] Error message shows with alert role
- [ ] Placeholder text is hint only (not label)
- [ ] Helper text explains constraints
- [ ] Contrast ≥ 4.5:1
- [ ] Keyboard navigation works

---

## Content & Tone Standards

**Voice:** Direct, confident, outcome-focused. No marketing fluff. Speak to builders.

**Guidelines:**
- Use active voice: "Deploy now" not "Can be deployed"
- Use numbers: "90 seconds" not "very fast"
- Avoid jargon unless audience-specific
- Be specific: "No boilerplate. No LLM guessing." not "Simple and fast"
- Emphasize outcomes: "Ship features" not "Write less code"

**Examples:**

✓ **Good:**
- "Full-stack project in 90 seconds"
- "Deploy to Cloudflare Workers with one command"
- "Type-safe from the start—catch bugs at compile time"

✗ **Bad:**
- "Quick and easy scaffolding solution"
- "Enterprise-grade framework flexibility"
- "Next-generation development experience"

**Button Labels:**
- Use imperative verbs: "Deploy", "Start Building", "Try Now", "View Docs"
- Avoid generic: "Click Here", "Submit", "OK"
- Include outcome if needed: "Deploy Now" (implies result)

**Error Messages:**
- Be specific: "Email already in use" not "Error: invalid input"
- Suggest fix: "Use 8+ characters" not "Password too weak"
- Plain language: No error codes

---

## Anti-Patterns & Prohibited

**Never:**
- ❌ Use low-contrast text (< 4.5:1) — violates WCAG AA
- ❌ Hide focus indicators — breaks keyboard navigation
- ❌ Use color alone to indicate state — not accessible
- ❌ Create one-off spacing exceptions — use space scale only
- ❌ Use multiple primary buttons on one page — confuses hierarchy
- ❌ Open external links without warning — breaks user expectation
- ❌ Stack interactive elements without spacing — causes mis-clicks
- ❌ Use placeholder text as label — it disappears when typing
- ❌ Assume fixed viewport width — design responsive
- ❌ Skip heading hierarchy (e.g., h1 → h3) — breaks outline

**Avoid:**
- ⚠️ Animations longer than motion.duration.slow (500ms) — feels slow
- ⚠️ Text smaller than font.size.xs (12px) — hard to read
- ⚠️ Line length > 80 characters — hurts readability
- ⚠️ Form fields without clear labels — confusing
- ⚠️ Modals that trap keyboard — frustrating

---

## Migration & Versioning

**When to update tokens:**
- Breaking changes: Major version bump (e.g., 1.0 → 2.0)
- New tokens: Minor bump (e.g., 1.0 → 1.1)
- Bug fixes: Patch bump (e.g., 1.0.1)

**Deprecation process:**
1. Announce in changelog (2 weeks notice)
2. Mark deprecated in component guidance
3. Remove in next major version only

---

## QA Checklist (System-wide)

**Every component must pass:**
- [ ] All state variations documented (default, hover, focus, active, disabled, error, loading)
- [ ] Keyboard navigation works end-to-end
- [ ] Focus indicators visible at 200% zoom
- [ ] Contrast ≥ 4.5:1 for all text
- [ ] Touch targets ≥ 44px (WCAG 2.5.5)
- [ ] Screen reader announces component purpose
- [ ] Mobile responsive (tested at 320px, 768px, 1200px)
- [ ] Animations under 500ms
- [ ] No hard-coded colors (use tokens)
- [ ] Typography uses scale (no one-off sizes)
- [ ] Spacing uses scale (no arbitrary values)

**Before shipping any component:**
- [ ] Accessibility audit (manual + automated)
- [ ] Cross-browser testing (Chrome, Firefox, Safari, Edge)
- [ ] Mobile device testing (iOS Safari, Android Chrome)
- [ ] Screen reader testing (NVDA, JAWS, VoiceOver)
- [ ] Keyboard-only navigation verified
- [ ] High-contrast mode tested (Windows)
- [ ] Internationalization ready (text sizing, RTL safe)

---

## Reference

**Accessibility Standards:**
- WCAG 2.2 Level AA (required minimum)
- WCAG 2.2 Level AAA (target for high-priority components)

**Testing Tools:**
- Axe DevTools (automated a11y scanning)
- WebAIM Contrast Checker (color validation)
- Lighthouse (performance + a11y audit)
- NVDA / JAWS / VoiceOver (screen reader testing)

**Token Naming Convention:**
```
[category].[aspect].[state] = value

Examples:
color.text.primary = #f1f5f9
color.primary.dark = #1e40af
space.gutter = space.4
motion.duration.fast = 150ms
shadow.glow.blue = ...
```

**Component Density Guidelines:**
Based on typical hackpack marketing site:
- Links: ~73 (navigation, footer, body)
- Buttons: ~33 (CTAs, form actions)
- Navigation components: ~9 (header, sidebar, breadcrumbs)
- Lists: ~1-3 (feature lists, framework lists)

---

**Version:** 1.0
**Last Updated:** 2026-07-27
**Status:** Active
