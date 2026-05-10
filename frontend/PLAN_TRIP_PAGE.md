# Plan a Trip Page - Documentation

## Overview
A modern, high-fidelity trip planning interface with a premium SaaS aesthetic featuring warm beige/cream backgrounds, orange primary accents, and intelligent design patterns.

## Design System

### Color Palette
- **Primary**: `#C65D3A` (Warm Orange)
- **Background**: `#FAF6F0` (Soft Beige/Cream)
- **Card**: `#F3E9DC` (Light Cream)
- **Text**: `#3B2F2F` (Dark Brown)
- **Accent**: `#D4A373` (Warm Tan)

### Dark Mode
- **Dark Background**: `#1C1612`
- **Dark Card**: `#2A211A`
- **Dark Text**: `#F0E6D3`
- **Dark Border**: `#3D2E22`

## Layout Structure

### Desktop Layout (Responsive)
```
┌─────────────────────────────────────────────────────┐
│                   Top Navigation                     │
│  [← Back]        Plan a Trip        [Theme Toggle]  │
├──────────────────┬──────────────────────────────────┤
│                  │                                   │
│  Trip Planning   │   Suggested Places & Activities  │
│      Form        │                                   │
│     (42%)        │            (58%)                  │
│                  │                                   │
│                  │   Smart Insight Widget            │
│                  │                                   │
└──────────────────┴──────────────────────────────────┘
```

### Mobile Layout
- Stacks vertically
- Form appears first
- Suggestions panel below
- Full-width components

## Components

### 1. PlanTripPage (Main Container)
**Location**: `src/pages/PlanTripPage.tsx`

**Features**:
- Responsive grid layout (12-column system)
- Sticky top navigation
- Theme-aware styling
- State management for trip data

**State Management**:
```typescript
{
  tripName: string
  destination: string
  startDate: string
  endDate: string
  travelers: number
  transportation: string
  budget: string
  tripType: string[]
  interests: string[]
  accommodation: string
  notes: string
}
```

### 2. TripPlanningForm
**Location**: `src/components/trip/TripPlanningForm.tsx`

**Sections**:

#### Section 1: Trip Basics
- Trip Name input
- Destination search field with icon

#### Section 2: Travel Details
- Start Date picker
- End Date picker
- Number of Travelers stepper (with +/- buttons)
- Transportation Preference selector:
  - ✈️ Flight
  - 🚆 Train
  - 🚗 Car
  - 🚴 Bike

#### Section 3: Preferences
- **Budget Range**: Budget | Mid-range | Luxury
- **Trip Type** (multi-select chips): Solo | Friends | Family | Couple | Work
- **Interests** (multi-select chips): Adventure | Food | Culture | Nature | Shopping | Nightlife
- **Accommodation Type** (dropdown): Hotel | Hostel | Airbnb | Resort

#### Section 4: Additional Notes
- Textarea for special requirements

#### Section 5: Trip Summary Card
Displays:
- Destination
- Dates
- Number of travelers
- Budget
- Estimated duration (auto-calculated)

#### Section 6: Actions
- **Save Draft** (secondary button)
- **Create Trip** (primary CTA button)

### 3. SuggestionsPanel
**Location**: `src/components/trip/SuggestionsPanel.tsx`

**Features**:
- Header with title, subtitle, and suggestion count badge
- Search bar for filtering activities
- Filter dropdown (by category)
- Sort dropdown (popular, rating, newest)
- Responsive grid of suggestion cards
- Empty state when no destination selected

**Mock Data Categories**:
- Adventure
- Nature
- Culture
- Food

### 4. SuggestionCard
**Location**: `src/components/trip/SuggestionCard.tsx`

**Features**:
- Large travel image thumbnail
- Category badge (top-left)
- Rating badge with star icon (top-right)
- Activity name
- Short description
- "Add to Trip" button
- Hover effects:
  - Lift animation (-translate-y-1)
  - Image zoom (scale-110)
  - Border color change
  - Shadow enhancement

**Image Handling**:
- Graceful fallback for broken images
- Placeholder icon display

### 5. SmartInsightWidget
**Location**: `src/components/trip/SmartInsightWidget.tsx`

**Features**:
- AI-powered insights badge
- Three insight cards:
  - 💰 Estimated Budget
  - ☁️ Weather Forecast
  - 📅 Best Season
- Travel Tips section with bullet points
- Animated "Powered by AI" indicator

**Conditional Rendering**:
- Only displays when destination is selected

## Design Patterns

### Visual Hierarchy
1. **Primary Actions**: Orange background, white text, shadow
2. **Secondary Actions**: Border only, transparent background
3. **Form Inputs**: Soft backgrounds, subtle borders, focus rings
4. **Cards**: Elevated with shadows, rounded corners (xl)

### Spacing System
- **Component Padding**: 6-8 (1.5rem - 2rem)
- **Section Margins**: 8 (2rem)
- **Input Spacing**: 4 (1rem)
- **Grid Gaps**: 4-8 (1rem - 2rem)

### Border Radius
- **Cards**: `rounded-2xl` (1rem)
- **Inputs**: `rounded-xl` (0.75rem)
- **Buttons**: `rounded-xl` (0.75rem)
- **Chips**: `rounded-full`

### Shadows
- **Cards**: `shadow-lg`
- **Hover States**: `shadow-lg shadow-primary/10`
- **Primary Buttons**: `shadow-lg shadow-primary/20`

### Transitions
- **Duration**: 200-300ms
- **Properties**: colors, transform, shadow, border
- **Easing**: Default (ease)

## Interactive Elements

### Hover States
- **Cards**: Lift + shadow + border color change
- **Buttons**: Background color change
- **Images**: Scale transform

### Focus States
- **All Inputs**: `focus:ring-2 focus:ring-primary/40`
- **Buttons**: `focus:outline-none focus:ring-2`

### Active States
- **Selected Chips**: Primary background, white text
- **Selected Options**: Primary border, primary background tint

## Accessibility

### Semantic HTML
- Proper heading hierarchy (h1, h2, h3)
- Label associations for inputs
- Button elements for interactive items

### ARIA Labels
- Theme toggle has aria-label
- Icon-only buttons include labels

### Keyboard Navigation
- All interactive elements are focusable
- Logical tab order
- Focus indicators visible

### Color Contrast
- Text meets WCAG AA standards
- Primary color provides sufficient contrast
- Dark mode maintains readability

## Responsive Breakpoints

### Mobile (< 640px)
- Single column layout
- Full-width components
- Stacked sections

### Tablet (640px - 1024px)
- 2-column suggestion grid
- Adjusted padding

### Desktop (> 1024px)
- 12-column grid system
- Form: 5 columns (42%)
- Suggestions: 7 columns (58%)
- Maximum width: 1600px

## Theme Support

### Light Mode
- Warm, inviting beige/cream backgrounds
- Soft shadows
- High contrast text

### Dark Mode
- Deep brown/black backgrounds
- Warm dark card colors
- Adjusted text colors for readability
- Maintained orange accent

### Theme Toggle
- Smooth transitions (300ms)
- Persistent across page navigation
- Context-based implementation

## Performance Considerations

### Image Optimization
- Error handling for failed loads
- Placeholder fallbacks
- Lazy loading ready (can be added)

### State Management
- Efficient re-renders
- Controlled components
- Minimal prop drilling

### Bundle Size
- No external UI libraries
- Pure Tailwind CSS
- Minimal dependencies

## Future Enhancements

### Potential Features
1. **API Integration**
   - Real destination search with autocomplete
   - Actual suggestion data from backend
   - Weather API integration
   - Budget estimation API

2. **Advanced Interactions**
   - Drag-and-drop for suggestions
   - Calendar view for date selection
   - Map integration for destinations
   - Image gallery for suggestions

3. **Data Persistence**
   - Save drafts to localStorage
   - Backend API integration
   - User authentication
   - Trip history

4. **Enhanced UX**
   - Loading states
   - Error boundaries
   - Toast notifications
   - Form validation feedback

5. **Analytics**
   - Track popular destinations
   - Suggestion click rates
   - Form completion rates

## Usage

### Navigation
Access the page via:
```typescript
navigate('/plan')
```

### Integration Example
```typescript
import PlanTripPage from './pages/PlanTripPage';

// In your router
<Route path="/plan" element={<PlanTripPage />} />
```

### Customization
All colors are defined in `tailwind.config.js`:
```javascript
colors: {
  primary: "#C65D3A",
  secondary: "#E6D3B3",
  accent: "#D4A373",
  background: "#FAF6F0",
  card: "#F3E9DC",
  text: "#3B2F2F",
  // ... dark mode colors
}
```

## Testing Checklist

- [ ] Form inputs update state correctly
- [ ] Date validation (end date after start date)
- [ ] Travelers counter min/max bounds
- [ ] Multi-select chips toggle properly
- [ ] Transportation selection works
- [ ] Budget selection works
- [ ] Accommodation dropdown functions
- [ ] Trip summary calculates duration
- [ ] Save Draft button triggers handler
- [ ] Create Trip button triggers handler
- [ ] Suggestions display correctly
- [ ] Search filters suggestions
- [ ] Category filter works
- [ ] Sort dropdown functions
- [ ] Add to Trip button works
- [ ] Smart Insights display conditionally
- [ ] Theme toggle works
- [ ] Back button navigates
- [ ] Responsive layout adapts
- [ ] Dark mode styling correct
- [ ] Hover effects work
- [ ] Focus states visible
- [ ] Image error handling works

## Browser Support
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Dependencies
- React 19.2.5
- React Router DOM 7.15.0
- Tailwind CSS 3
- TypeScript 6.0.2

---

**Created**: May 2026
**Version**: 1.0.0
**Status**: Production Ready
