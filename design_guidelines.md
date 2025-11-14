# Design Guidelines: Worship Mixer App

## Design Approach

**Selected Framework:** Material Design (Utility-Focused)

**Rationale:** This is a function-critical application used during live worship services and rehearsals. The design prioritizes speed, clarity, and touch-friendly interactions over visual flourishes. Material Design provides excellent touch target sizing and clear interaction patterns for high-pressure environments.

**Core Principles:**
- Maximum clarity and legibility from any viewing distance
- Large, unmistakable touch targets for performance environments
- Instant visual feedback for all interactions
- Minimal cognitive load - users should act on instinct
- Zero learning curve for new musicians

## Typography

**Font Family:** Roboto (via Google Fonts CDN)

**Type Scale:**
- Page Headers: 2xl font-bold (24px)
- Section Labels: lg font-semibold (18px)
- Button Text/Body: base font-medium (16px)
- List Items: base font-normal (16px)
- Helper Text: sm font-normal (14px)

**Hierarchy Strategy:** Keep text minimal. Rely on iconography and spatial relationships to communicate function.

## Layout System

**Spacing Primitives:** Tailwind units of 2, 4, 6, 8, 12, and 16

**Container Strategy:**
- Mobile-first approach (this is primarily a mobile/tablet app)
- Full viewport layouts - no constrained containers
- px-4 for screen edge padding
- py-6 for vertical section spacing

**Grid System:**
- Name Entry: Single column, centered vertical layout
- Instrument/Singer Grid: 2 columns on mobile (grid-cols-2), 3-4 columns on tablet (md:grid-cols-3 lg:grid-cols-4)
- Adjustment Screen: Single centered column
- Mixer View (Engineer): Single column list with full-width items

## Component Library

### 1. Name Entry Screen
- Centered vertical layout with logo/title at top
- Large text input field (h-14, text-lg)
- Prominent "Continue" button below input (h-14, w-full, text-lg font-semibold)
- Simple, distraction-free interface

### 2. Visual Grid (Instruments & Singers)
- Card-based grid layout with gap-4
- Each card contains:
  - Large icon at top (h-16 w-16)
  - Label below icon (text-base font-medium)
  - Subtle border and rounded corners (rounded-xl)
  - Touch target minimum: 100px × 120px
- Icons from Heroicons or Font Awesome:
  - Drums: Drum icon
  - Bass: Guitar/music note icon
  - Electric Guitar: Electric guitar/bolt icon
  - Acoustic Guitar: Acoustic guitar icon
  - Piano: Piano/keyboard icon
  - Female singers (Ruby, Anaissa): User icon with feminine styling
  - Male singers (Alvaro, Isaias, Guti): User icon with masculine styling
- Section headers: "INSTRUMENTS" and "SINGERS" (text-sm uppercase tracking-wide)

### 3. Adjustment Screen
- Header showing selected item name (text-2xl font-bold)
- Counter display showing current adjustment (text-6xl font-bold, centered)
- Two large circular buttons for +1/-1 (h-28 w-28):
  - Plus icon inside circle
  - Minus icon inside circle
  - Positioned side by side with gap-8
- "Send Request" button at bottom (h-14, w-full, prominent styling)
- Back button in top-left corner (icon-only, h-10 w-10)

### 4. Mixer View (Sound Engineer)
- Fixed header: "Incoming Requests" (text-2xl font-bold, py-4)
- Scrollable list of request cards:
  - Each card shows:
    - Requester name (text-lg font-semibold)
    - Item requested (instrument/singer name, text-base)
    - Adjustment value with +/- (text-2xl font-bold)
    - Timestamp (text-sm)
  - Clear visual separation between cards (border, rounded-lg, p-4, mb-3)
  - Newest requests appear at top
- Empty state when no requests: "No pending requests" centered message

### 5. Navigation Elements
- Back buttons: Left-pointing arrow icon (h-6 w-6)
- Positioned top-left with p-3 touch target
- Fixed positioning for consistent placement

### 6. Buttons
**Primary Action Buttons:**
- Height: h-14
- Full width on mobile: w-full
- Rounded: rounded-xl
- Bold text: font-semibold text-lg
- Clear press states

**Icon Buttons:**
- Circular or square with adequate padding (min h-10 w-10)
- Clear icon sizing (h-6 w-6)
- Touch target compliant

## Interactions & States

**Touch Feedback:**
- All interactive elements have clear active states
- Visual feedback within 50ms of touch
- No hover states (touch-first design)

**Loading States:**
- Minimal - requests send near-instantly
- Brief success confirmation after sending request

**Error Handling:**
- Inline validation for name entry (minimum 2 characters)
- Toast notifications for connection errors

## Accessibility

- Minimum touch target size: 44px × 44px (WCAG AAA)
- Semantic HTML throughout
- Clear focus indicators for keyboard navigation
- ARIA labels for icon-only buttons
- High contrast text (no pure grays)

## Performance Considerations

- Real-time updates via WebSocket connection
- Optimistic UI updates
- Minimal animations (fade-ins only, duration-200)
- Icon font loaded via CDN for instant availability

## Images

**No images required.** This is an icon-driven utility interface. All visual elements use icon fonts or simple geometric shapes.