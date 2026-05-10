# Plan a Trip - Design Showcase

## 🎨 Visual Design System

### Color Palette

#### Light Mode
```
┌─────────────────────────────────────────────────────────┐
│ Primary (Actions)     │ #C65D3A │ ████████████████████ │
│ Background (Page)     │ #FAF6F0 │ ░░░░░░░░░░░░░░░░░░░░ │
│ Card (Elevated)       │ #FFFFFF │ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │
│ Text (Primary)        │ #3B2F2F │ ████████████████████ │
│ Accent (Highlights)   │ #D4A373 │ ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ │
└─────────────────────────────────────────────────────────┘
```

#### Dark Mode
```
┌─────────────────────────────────────────────────────────┐
│ Primary (Actions)     │ #C65D3A │ ████████████████████ │
│ Background (Page)     │ #1C1612 │ ████████████████████ │
│ Card (Elevated)       │ #2A211A │ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │
│ Text (Primary)        │ #F0E6D3 │ ░░░░░░░░░░░░░░░░░░░░ │
│ Border (Subtle)       │ #3D2E22 │ ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ │
└─────────────────────────────────────────────────────────┘
```

## 📐 Layout Structure

### Desktop View (1920px)
```
┌────────────────────────────────────────────────────────────────────────┐
│  ← Back              Plan a Trip                    [Theme Toggle]     │
├──────────────────────────────┬─────────────────────────────────────────┤
│                              │                                         │
│  ┌────────────────────────┐  │  ┌───────────────────────────────────┐ │
│  │  TRIP PLANNING FORM    │  │  │  SUGGESTED PLACES & ACTIVITIES    │ │
│  │                        │  │  │                                   │ │
│  │  ┌──────────────────┐  │  │  │  [Search] [Filter] [Sort]        │ │
│  │  │ Trip Basics      │  │  │  │                                   │ │
│  │  │ • Trip Name      │  │  │  │  ┌─────────┐  ┌─────────┐        │ │
│  │  │ • Destination    │  │  │  │  │ Card 1  │  │ Card 2  │        │ │
│  │  └──────────────────┘  │  │  │  │ [Image] │  │ [Image] │        │ │
│  │                        │  │  │  │ ⭐ 4.8  │  │ ⭐ 4.9  │        │ │
│  │  ┌──────────────────┐  │  │  │  └─────────┘  └─────────┘        │ │
│  │  │ Travel Details   │  │  │  │                                   │ │
│  │  │ • Dates          │  │  │  │  ┌─────────┐  ┌─────────┐        │ │
│  │  │ • Travelers      │  │  │  │  │ Card 3  │  │ Card 4  │        │ │
│  │  │ • Transport      │  │  │  │  │ [Image] │  │ [Image] │        │ │
│  │  │   ✈️ 🚆 🚗 🚴    │  │  │  │ ⭐ 4.7  │  │ ⭐ 4.9  │        │ │
│  │  └──────────────────┘  │  │  │  └─────────┘  └─────────┘        │ │
│  │                        │  │  │                                   │ │
│  │  ┌──────────────────┐  │  │  │  ┌─────────┐  ┌─────────┐        │ │
│  │  │ Preferences      │  │  │  │  │ Card 5  │  │ Card 6  │        │ │
│  │  │ • Budget         │  │  │  │  │ [Image] │  │ [Image] │        │ │
│  │  │ • Trip Type      │  │  │  │  │ ⭐ 4.6  │  │ ⭐ 4.8  │        │ │
│  │  │ • Interests      │  │  │  │  └─────────┘  └─────────┘        │ │
│  │  │ • Accommodation  │  │  │  └───────────────────────────────────┘ │
│  │  └──────────────────┘  │  │                                         │
│  │                        │  │  ┌───────────────────────────────────┐ │
│  │  ┌──────────────────┐  │  │  │  SMART INSIGHTS                   │ │
│  │  │ Additional Notes │  │  │  │  💡 AI-Powered                    │ │
│  │  │ [Textarea]       │  │  │  │                                   │ │
│  │  └──────────────────┘  │  │  │  💰 Budget  ☁️ Weather  📅 Season │ │
│  │                        │  │  │                                   │ │
│  │  ┌──────────────────┐  │  │  │  ℹ️ Travel Tips                   │ │
│  │  │ Trip Summary     │  │  │  │  • Tip 1                          │ │
│  │  │ • Destination    │  │  │  │  • Tip 2                          │ │
│  │  │ • Dates          │  │  │  │  • Tip 3                          │ │
│  │  │ • Travelers      │  │  │  └───────────────────────────────────┘ │
│  │  │ • Budget         │  │  │                                         │
│  │  │ • Duration       │  │  │                                         │
│  │  └──────────────────┘  │  │                                         │
│  │                        │  │                                         │
│  │  [Save Draft]          │  │                                         │
│  │  [Create Trip]         │  │                                         │
│  └────────────────────────┘  │                                         │
│         42% Width            │            58% Width                    │
└──────────────────────────────┴─────────────────────────────────────────┘
```

### Mobile View (375px)
```
┌─────────────────────────────────┐
│  ← Back    Plan a Trip    [🌙]  │
├─────────────────────────────────┤
│                                 │
│  ┌───────────────────────────┐  │
│  │  TRIP PLANNING FORM       │  │
│  │                           │  │
│  │  Trip Basics              │  │
│  │  Travel Details           │  │
│  │  Preferences              │  │
│  │  Notes                    │  │
│  │  Summary                  │  │
│  │                           │  │
│  │  [Save Draft]             │  │
│  │  [Create Trip]            │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │  SUGGESTIONS              │  │
│  │                           │  │
│  │  [Search] [Filter] [Sort] │  │
│  │                           │  │
│  │  ┌─────────────────────┐  │  │
│  │  │ Card 1              │  │  │
│  │  │ [Full Width Image]  │  │  │
│  │  │ ⭐ 4.8              │  │  │
│  │  └─────────────────────┘  │  │
│  │                           │  │
│  │  ┌─────────────────────┐  │  │
│  │  │ Card 2              │  │  │
│  │  │ [Full Width Image]  │  │  │
│  │  │ ⭐ 4.9              │  │  │
│  │  └─────────────────────┘  │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │  SMART INSIGHTS           │  │
│  │  💡 AI-Powered            │  │
│  └───────────────────────────┘  │
└─────────────────────────────────┘
```

## 🎯 Component Anatomy

### Suggestion Card
```
┌─────────────────────────────────────┐
│  ┌─────────────────────────────┐   │
│  │                             │   │
│  │     [Travel Image]          │   │
│  │                             │   │
│  │  [Nature]          ⭐ 4.8   │   │
│  └─────────────────────────────┘   │
│                                     │
│  Rice Terraces                      │
│  Explore stunning terraced rice... │
│                                     │
│  ┌─────────────────────────────┐   │
│  │      + Add to Trip          │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘

Hover State:
┌─────────────────────────────────────┐ ↑ Lifts 4px
│  ┌─────────────────────────────┐   │
│  │                             │   │ 
│  │  [Image Zoomed 110%]        │   │ Image scales
│  │                             │   │
│  │  [Nature]          ⭐ 4.8   │   │
│  └─────────────────────────────┘   │
│                                     │
│  Rice Terraces                      │
│  Explore stunning terraced rice... │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  + Add to Trip (Hover)      │   │ Button changes
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
   Shadow: lg + primary/10
   Border: primary/50
```

### Transportation Selector
```
┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐
│  ✈️  │  │  🚆  │  │  🚗  │  │  🚴  │
│Flight│  │Train │  │ Car  │  │ Bike │
└──────┘  └──────┘  └──────┘  └──────┘
  Normal    Normal    Normal    Normal

Selected State:
┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐
│  ✈️  │  │  🚆  │  │  🚗  │  │  🚴  │
│Flight│  │Train │  │ Car  │  │ Bike │
└──────┘  └──────┘  └──────┘  └──────┘
  ████      Normal    Normal    Normal
  Primary   Border    Border    Border
  Border    Only      Only      Only
```

### Budget Selector
```
┌──────────┐  ┌──────────┐  ┌──────────┐
│  Budget  │  │Mid-range │  │  Luxury  │
└──────────┘  └──────────┘  └──────────┘
   Normal       ████████       Normal
                Selected
```

### Multi-Select Chips
```
Unselected:
┌──────┐ ┌─────────┐ ┌────────┐ ┌────────┐
│ Solo │ │ Friends │ │ Family │ │ Couple │
└──────┘ └─────────┘ └────────┘ └────────┘
 Border    Border      Border     Border

Selected:
┌──────┐ ┌─────────┐ ┌────────┐ ┌────────┐
│ Solo │ │ Friends │ │ Family │ │ Couple │
└──────┘ └─────────┘ └────────┘ └────────┘
 ████     ████████     Border     Border
 Primary  Primary      Border     Border
 White    White        Text       Text
```

### Travelers Stepper
```
┌────┐    ┌────┐    ┌────┐
│ −  │    │ 2  │    │ +  │
└────┘    └────┘    └────┘
 Button   Display   Button
```

### Trip Summary Card
```
┌─────────────────────────────────┐
│  Trip Summary                   │
│                                 │
│  Destination:        Bali       │
│  Dates:         May 15 - May 22 │
│  Travelers:              2      │
│  Budget:           Mid-range    │
│  Duration:           7 days     │
└─────────────────────────────────┘
```

### Smart Insight Widget
```
┌─────────────────────────────────────────┐
│  💡  Smart Insights                     │
│      AI-powered recommendations         │
│                                         │
│  ┌───────────┐ ┌───────────┐ ┌───────┐ │
│  │ 💰 Budget │ │ ☁️ Weather│ │📅 Best│ │
│  │ $1.2-2.5K │ │ Sunny 28°C│ │Apr-Oct│ │
│  └───────────┘ └───────────┘ └───────┘ │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │ ℹ️ Travel Tips                    │  │
│  │ • Book 2-3 months in advance     │  │
│  │ • Use local currency             │  │
│  │ • Respect temple customs         │  │
│  └───────────────────────────────────┘  │
│                                         │
│  ● ● ●  Powered by AI                  │
└─────────────────────────────────────────┘
```

## 🎭 Interactive States

### Button States
```
Primary Button:
┌─────────────────┐
│  Create Trip    │  Normal: bg-primary, text-white
└─────────────────┘

┌─────────────────┐
│  Create Trip    │  Hover: bg-primary/90, shadow-lg
└─────────────────┘

┌─────────────────┐
│  Create Trip    │  Focus: ring-2 ring-primary/40
└─────────────────┘

Secondary Button:
┌─────────────────┐
│  Save Draft     │  Normal: border-2, transparent
└─────────────────┘

┌─────────────────┐
│  Save Draft     │  Hover: bg-background
└─────────────────┘
```

### Input States
```
Normal:
┌─────────────────────────────────┐
│ Enter destination...            │
└─────────────────────────────────┘
  border-gray-200

Focus:
┌─────────────────────────────────┐
│ Bali, Indonesia▊                │
└─────────────────────────────────┘
  ring-2 ring-primary/40

Filled:
┌─────────────────────────────────┐
│ Bali, Indonesia                 │
└─────────────────────────────────┘
  border-gray-200
```

## 🌈 Animation Showcase

### Card Hover Animation
```
Frame 1 (0ms):
┌─────────┐
│  Card   │  Y: 0, Scale: 1.0
└─────────┘

Frame 2 (100ms):
┌─────────┐
│  Card   │  Y: -2px, Scale: 1.05
└─────────┘

Frame 3 (200ms):
┌─────────┐
│  Card   │  Y: -4px, Scale: 1.1
└─────────┘  Shadow: lg + primary/10
```

### Theme Toggle Animation
```
Light Mode:
┌──────────────────┐
│ ☀️  ○           │
└──────────────────┘

Transition (150ms):
┌──────────────────┐
│ ☀️     ○        │
└──────────────────┘

Dark Mode:
┌──────────────────┐
│          ○  🌙  │
└──────────────────┘
```

### Loading State (Future)
```
┌─────────────────────────────────┐
│  ● ● ●  Loading suggestions...  │
└─────────────────────────────────┘
  Pulsing animation
```

## 📏 Spacing Scale

```
Gap Scale:
gap-2  ▪▪ (0.5rem)  - Chips, small elements
gap-3  ▪▪▪ (0.75rem) - Button groups
gap-4  ▪▪▪▪ (1rem)   - Form fields
gap-6  ▪▪▪▪▪▪ (1.5rem) - Sections
gap-8  ▪▪▪▪▪▪▪▪ (2rem) - Major sections

Padding Scale:
p-3   ▪▪▪ (0.75rem)  - Small buttons
p-4   ▪▪▪▪ (1rem)    - Card content
p-6   ▪▪▪▪▪▪ (1.5rem)  - Cards
p-8   ▪▪▪▪▪▪▪▪ (2rem)  - Main containers
```

## 🎨 Typography Scale

```
h1 (Page Title):
  Plan a Trip
  text-xl (1.25rem), font-semibold

h2 (Section Headers):
  Trip Basics
  text-lg (1.125rem), font-semibold

h3 (Card Titles):
  Sunset Cruise
  text-base (1rem), font-semibold

Body Text:
  Explore stunning terraced rice fields
  text-sm (0.875rem), regular

Labels:
  Destination
  text-sm (0.875rem), font-medium

Captions:
  6 ideas
  text-xs (0.75rem), font-semibold
```

## 🎯 Shadow System

```
shadow-sm:
┌─────────┐
│  Card   │  Subtle elevation
└─────────┘  0 1px 2px rgba(0,0,0,0.05)

shadow-lg:
┌─────────┐
│  Card   │  Prominent elevation
└─────────┘  0 10px 15px rgba(0,0,0,0.1)

shadow-lg shadow-primary/10:
┌─────────┐
│  Card   │  Colored shadow (hover)
└─────────┘  0 10px 15px rgba(198,93,58,0.1)

shadow-lg shadow-primary/20:
┌─────────┐
│ Button  │  Strong colored shadow
└─────────┘  0 10px 15px rgba(198,93,58,0.2)
```

## 🔄 Transition Timing

```
Fast (200ms):
- Button hover
- Input focus
- Chip selection
- Border changes

Medium (300ms):
- Theme switching
- Card hover
- Shadow changes
- Color transitions

Slow (500ms):
- Image zoom
- Complex animations
- Page transitions
```

## 🎨 Border Radius System

```
rounded-lg (0.5rem):
┌────────┐
│ Button │
└────────┘

rounded-xl (0.75rem):
┌─────────┐
│  Input  │
└─────────┘

rounded-2xl (1rem):
┌──────────┐
│   Card   │
└──────────┘

rounded-full:
┌──────┐
│ Chip │
└──────┘
```

## 🌟 Premium Details

### Glassmorphism (Navigation)
```
┌─────────────────────────────────┐
│  ← Back    Plan a Trip    [🌙]  │  backdrop-blur-md
└─────────────────────────────────┘  bg-white/80
```

### Gradient (AI Badge)
```
┌────┐
│ 💡 │  gradient: primary → accent
└────┘
```

### Animated Dots (AI Indicator)
```
● ● ●  Powered by AI
^   ^   ^
|   |   |
0ms 200ms 400ms (staggered pulse)
```

---

**Design System Version**: 1.0.0
**Last Updated**: May 10, 2026
**Design Language**: Modern Premium SaaS
**Aesthetic**: Warm, Inviting, Intelligent
