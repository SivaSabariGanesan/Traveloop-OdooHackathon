# Trip Planning Components

## Component Architecture

```
PlanTripPage (Container)
├── Navigation Bar
│   ├── Back Button
│   ├── Page Title
│   └── Theme Toggle
│
├── TripPlanningForm (Left Column - 42%)
│   ├── Trip Basics Section
│   │   ├── Trip Name Input
│   │   └── Destination Search
│   │
│   ├── Travel Details Section
│   │   ├── Date Pickers (Start/End)
│   │   ├── Travelers Stepper
│   │   └── Transportation Selector
│   │
│   ├── Preferences Section
│   │   ├── Budget Range Selector
│   │   ├── Trip Type Chips
│   │   ├── Interests Chips
│   │   └── Accommodation Dropdown
│   │
│   ├── Additional Notes Section
│   │   └── Notes Textarea
│   │
│   ├── Trip Summary Card
│   │   └── Auto-calculated Summary
│   │
│   └── Action Buttons
│       ├── Save Draft (Secondary)
│       └── Create Trip (Primary)
│
└── SuggestionsPanel (Right Column - 58%)
    ├── Header
    │   ├── Title & Subtitle
    │   └── Count Badge
    │
    ├── Controls
    │   ├── Search Bar
    │   ├── Filter Dropdown
    │   └── Sort Dropdown
    │
    ├── Suggestions Grid
    │   └── SuggestionCard (Multiple)
    │       ├── Image with Overlay
    │       ├── Category Badge
    │       ├── Rating Badge
    │       ├── Name & Description
    │       └── Add Button
    │
    └── SmartInsightWidget
        ├── AI Badge Header
        ├── Insight Cards Grid
        │   ├── Budget Estimate
        │   ├── Weather Forecast
        │   └── Best Season
        ├── Travel Tips List
        └── AI Attribution
```

## Component Files

### 1. TripPlanningForm.tsx
**Purpose**: Main form for collecting trip details
**Props**:
- `tripData`: Current form state
- `setTripData`: State setter function
- `onSaveDraft`: Draft save handler
- `onCreateTrip`: Trip creation handler

**Key Features**:
- 6 organized sections
- Real-time trip summary
- Auto-calculated duration
- Multi-select capabilities
- Stepper controls
- Icon-based transportation selector

### 2. SuggestionsPanel.tsx
**Purpose**: Display and manage activity suggestions
**Props**:
- `destination`: Current destination for filtering

**Key Features**:
- Dynamic suggestion grid
- Search functionality
- Category filtering
- Sort options
- Empty state handling
- Responsive grid layout

### 3. SuggestionCard.tsx
**Purpose**: Individual suggestion display card
**Props**:
- `image`: Activity image URL
- `name`: Activity name
- `rating`: Numeric rating
- `category`: Activity category
- `description`: Short description
- `onAdd`: Add to trip handler

**Key Features**:
- Hover animations
- Image error handling
- Rating display with star
- Category badge
- Smooth transitions

### 4. SmartInsightWidget.tsx
**Purpose**: AI-powered travel insights
**Props**:
- `destination`: Destination for insights

**Key Features**:
- Conditional rendering
- Budget estimation
- Weather forecast
- Best season info
- Travel tips list
- AI branding

## Styling Guidelines

### Color Usage
```css
/* Primary Actions */
background: #C65D3A (primary)
text: white

/* Secondary Actions */
border: 2px solid gray
background: transparent

/* Form Inputs */
background: #FAF6F0 (background)
border: 1px solid gray-200
focus: ring-2 ring-primary/40

/* Cards */
background: white
shadow: lg
border-radius: 2xl (1rem)
```

### Spacing Scale
```
gap-2  = 0.5rem  (chips, small elements)
gap-3  = 0.75rem (buttons, controls)
gap-4  = 1rem    (form fields, cards)
gap-6  = 1.5rem  (sections)
gap-8  = 2rem    (major sections)

p-4    = 1rem    (card content)
p-6    = 1.5rem  (card padding)
p-8    = 2rem    (main containers)
```

### Typography
```
h1: text-xl font-semibold      (Page title)
h2: text-lg font-semibold      (Section headers)
h3: text-base font-semibold    (Card titles)
body: text-sm                  (Regular text)
label: text-sm font-medium     (Form labels)
caption: text-xs               (Badges, hints)
```

## State Management

### Trip Data Structure
```typescript
interface TripData {
  tripName: string;           // Free text
  destination: string;        // Free text (future: autocomplete)
  startDate: string;          // ISO date string
  endDate: string;            // ISO date string
  travelers: number;          // Min: 1, no max
  transportation: string;     // Single select: flight|train|car|bike
  budget: string;             // Single select: Budget|Mid-range|Luxury
  tripType: string[];         // Multi-select array
  interests: string[];        // Multi-select array
  accommodation: string;      // Single select dropdown
  notes: string;              // Free text
}
```

### Form Handlers
```typescript
// Single value update
handleInputChange(field: keyof TripData, value: any)

// Array toggle (for multi-select)
toggleArrayItem(field: "tripType" | "interests", value: string)

// Duration calculation
calculateDuration(): string
```

## Responsive Behavior

### Breakpoints
```typescript
// Mobile: < 640px
- Single column
- Full width cards
- Stacked layout

// Tablet: 640px - 1024px
- 2-column suggestion grid
- Adjusted spacing

// Desktop: > 1024px
- 12-column grid
- 5 cols form (42%)
- 7 cols suggestions (58%)
- Max width: 1600px
```

### Grid Classes
```jsx
// Main container
<div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
  <div className="lg:col-span-5">Form</div>
  <div className="lg:col-span-7">Suggestions</div>
</div>

// Suggestions grid
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  {/* Cards */}
</div>
```

## Animation & Transitions

### Hover Effects
```css
/* Card hover */
transform: translateY(-4px)
shadow: lg shadow-primary/10
border-color: primary/50

/* Image hover */
transform: scale(1.1)

/* Button hover */
background: primary/90 (for primary)
background: gray-100 (for secondary)
```

### Transition Timing
```css
transition-all duration-200  /* Fast interactions */
transition-all duration-300  /* Theme changes */
transition-transform duration-500  /* Image zoom */
```

## Theme Integration

### Using Theme Context
```typescript
import { useTheme } from "../../context/ThemeContext";

const { dark } = useTheme();

// Conditional classes
className={`${dark ? "bg-dark-card" : "bg-white"}`}
```

### Theme-Aware Colors
```typescript
// Background
dark ? "bg-dark-bg" : "bg-background"

// Card
dark ? "bg-dark-card" : "bg-white"

// Text
dark ? "text-dark-text" : "text-text"

// Border
dark ? "border-dark-border" : "border-gray-200"

// Muted text
dark ? "text-dark-text/60" : "text-text/60"
```

## Accessibility Features

### Keyboard Navigation
- All buttons are focusable
- Logical tab order
- Focus rings visible
- Enter/Space activation

### Screen Readers
- Semantic HTML elements
- Label associations
- ARIA labels where needed
- Alt text for images

### Color Contrast
- Text: 4.5:1 minimum
- Large text: 3:1 minimum
- Interactive elements: 3:1 minimum
- Maintained in dark mode

## Performance Tips

### Optimization Strategies
1. **Memoization**: Consider `React.memo` for cards
2. **Lazy Loading**: Add for images if list grows
3. **Debouncing**: Add for search input
4. **Virtual Scrolling**: If suggestions exceed 50+

### Current Performance
- No external UI libraries
- Pure CSS animations
- Minimal re-renders
- Efficient state updates

## Testing Scenarios

### Form Testing
```typescript
// Test input changes
- Type in text fields
- Select dates
- Increment/decrement travelers
- Select transportation
- Toggle chips
- Select dropdown

// Test validation
- End date before start date
- Empty required fields
- Special characters in text
```

### Suggestions Testing
```typescript
// Test interactions
- Search filtering
- Category filtering
- Sort options
- Add to trip button
- Card hover effects

// Test edge cases
- No destination
- Empty search results
- Image load failures
```

### Theme Testing
```typescript
// Test theme switching
- Toggle light/dark
- Check all components
- Verify contrast
- Test transitions
```

## Integration Guide

### Adding to Existing App
```typescript
// 1. Import the page
import PlanTripPage from './pages/PlanTripPage';

// 2. Add route
<Route path="/plan" element={<PlanTripPage />} />

// 3. Navigate to page
navigate('/plan');
```

### Customizing Components
```typescript
// Override colors in tailwind.config.js
colors: {
  primary: "#YOUR_COLOR",
  // ... other colors
}

// Adjust layout proportions
<div className="lg:col-span-5">  // Change to 4 or 6
<div className="lg:col-span-7">  // Change to 8 or 6
```

## API Integration (Future)

### Expected Endpoints
```typescript
// Get suggestions
GET /api/suggestions?destination={dest}&category={cat}

// Create trip
POST /api/trips
Body: TripData

// Save draft
POST /api/trips/draft
Body: TripData

// Get insights
GET /api/insights?destination={dest}
```

### Data Flow
```
User Input → Local State → API Call → Response → Update UI
```

---

**Component Status**: ✅ Production Ready
**Last Updated**: May 2026
**Maintainer**: Development Team
