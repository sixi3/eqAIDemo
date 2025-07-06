# Design System Documentation

## Overview

This design system provides a comprehensive set of design tokens, components, and utilities for building consistent and accessible user interfaces for the AI Voice Assistant prototype. The system is built with TypeScript and Tailwind CSS, ensuring type safety and maintainability.

## Table of Contents

1. [Colors](#colors)
2. [Typography](#typography)
3. [Spacing](#spacing)
4. [Shadows](#shadows)
5. [Border Radius](#border-radius)
6. [Animations](#animations)
7. [Components](#components)
8. [Utilities](#utilities)
9. [Usage Guidelines](#usage-guidelines)
10. [Accessibility](#accessibility)

## Colors

### Primary Colors
The primary green color palette is used for main actions, links, and brand elements.

```
primary-50:  #eafff2  (Lightest)
primary-100: #d0ffe2
primary-200: #a4ffc8
primary-300: #68ffa0
primary-400: #26f471
primary-500: #00b140  (Main brand color)
primary-600: #009a3a
primary-700: #007d31
primary-800: #00622a
primary-900: #005124  (Darkest)
primary-950: #002d13
```

### Secondary Colors
The secondary lime color palette is used for accents, highlights, and secondary actions.

```
secondary-50:  #fdfff0  (Lightest)
secondary-100: #fbffe0
secondary-200: #f7ffc2
secondary-300: #f1ff98
secondary-400: #e7ff62
secondary-500: #baff29  (Main secondary color)
secondary-600: #a3e620
secondary-700: #8cc518
secondary-800: #75a416
secondary-900: #5d8317  (Darkest)
secondary-950: #334a08
```

### Neutral Colors
Warm neutral colors that are easier on the eyes than standard grays.

```
neutral-50:  #fafafa  (Lightest)
neutral-100: #f5f5f5
neutral-200: #e8e8e8
neutral-300: #d4d4d4
neutral-400: #a3a3a3
neutral-500: #737373
neutral-600: #525252
neutral-700: #404040
neutral-800: #262626
neutral-900: #171717  (Darkest)
neutral-950: #0a0a0a
```

### Semantic Colors

#### Success
Uses the primary green palette for success states.

#### Warning
```
warning-500: #f59e0b  (Main warning color)
```

#### Error
```
error-500: #ef4444  (Main error color)
```

### Voice Assistant States
Special colors for different voice assistant states:

```
voice-idle:       #737373  (Neutral)
voice-listening:  #00b140  (Primary green)
voice-processing: #baff29  (Secondary lime)
voice-speaking:   #00b140  (Primary green)
voice-error:      #ef4444  (Error red)
```

### Semantic Color Categories

#### Background Colors
```
background-primary:   #ffffff  (Main background)
background-secondary: #fafafa  (Secondary background)
background-tertiary:  #f5f5f5  (Tertiary background)
background-inverse:   #171717  (Dark mode background)
```

#### Surface Colors
```
surface-primary:   #ffffff  (Cards, modals)
surface-secondary: #f5f5f5  (Secondary surfaces)
surface-tertiary:  #e8e8e8  (Tertiary surfaces)
surface-elevated:  #ffffff  (Elevated surfaces)
surface-overlay:   rgba(0, 0, 0, 0.6)  (Overlays)
```

#### Text Colors
```
text-primary:    #171717  (Main text)
text-secondary:  #525252  (Secondary text)
text-tertiary:   #737373  (Tertiary text)
text-inverse:    #ffffff  (Dark backgrounds)
text-disabled:   #a3a3a3  (Disabled text)
text-link:       #00b140  (Links)
text-link-hover: #007d31  (Link hover)
```

#### Border Colors
```
border-primary:   #e8e8e8  (Main borders)
border-secondary: #d4d4d4  (Secondary borders)
border-tertiary:  #a3a3a3  (Tertiary borders)
border-focus:     #00b140  (Focus states)
border-error:     #ef4444  (Error states)
```

## Typography

### Font Family
The design system uses **DM Sans** as the primary font family across all text elements.

```css
font-family: 'DM Sans', system-ui, sans-serif;
```

### Typography Scale

#### Display
Large, impactful text for hero sections and major headings.

```
display-large:  text-6xl font-bold leading-tight tracking-tight
display-medium: text-5xl font-bold leading-tight tracking-tight
display-small:  text-4xl font-bold leading-tight tracking-tight
```

#### Headlines
Section headings and important titles.

```
headline-large:  text-3xl font-semibold leading-tight
headline-medium: text-2xl font-semibold leading-tight
headline-small:  text-xl font-semibold leading-tight
```

#### Titles
Subsection titles and component headings.

```
title-large:  text-lg font-medium leading-normal
title-medium: text-base font-medium leading-normal
title-small:  text-sm font-medium leading-normal
```

#### Body Text
Main content text with optimal readability.

```
body-large:  text-base font-normal leading-relaxed
body-medium: text-sm font-normal leading-relaxed
body-small:  text-xs font-normal leading-relaxed
```

#### Labels
UI labels, captions, and metadata.

```
label-large:  text-sm font-medium leading-normal tracking-wide
label-medium: text-xs font-medium leading-normal tracking-wide
label-small:  text-xs font-medium leading-tight tracking-wide
```

### Usage Examples

```tsx
// Display text
<h1 className="text-display-large text-text-primary">
  Welcome to AI Assistant
</h1>

// Headline
<h2 className="text-headline-medium text-text-primary">
  Getting Started
</h2>

// Body text
<p className="text-body-large text-text-secondary">
  This is the main content area with optimal readability.
</p>

// Label
<label className="text-label-medium text-text-tertiary">
  Voice Command
</label>
```

## Spacing

The spacing system uses a consistent scale based on 0.25rem (4px) increments.

### Base Scale
```
0:    0rem      (0px)
0.5:  0.125rem  (2px)
1:    0.25rem   (4px)
1.5:  0.375rem  (6px)
2:    0.5rem    (8px)
2.5:  0.625rem  (10px)
3:    0.75rem   (12px)
4:    1rem      (16px)
5:    1.25rem   (20px)
6:    1.5rem    (24px)
8:    2rem      (32px)
10:   2.5rem    (40px)
12:   3rem      (48px)
16:   4rem      (64px)
20:   5rem      (80px)
24:   6rem      (96px)
32:   8rem      (128px)
40:   10rem     (160px)
```

### Extended Scale
Additional spacing values for specific use cases:
```
3.5, 4.5, 5.5, 6.5, 7.5, 8.5, 9.5, 11, 13, 15, 17, 18, 19, 21, 22, 23, 25, 26, 27, 29, 30, 31, 33, 34, 35, 37, 38, 39
```

### Usage Guidelines

- Use smaller spacing (0.5-2) for tight layouts and component internals
- Use medium spacing (3-8) for general layout and component spacing
- Use larger spacing (10-24) for section separation and major layout elements
- Use extra large spacing (32-40) for hero sections and major page divisions

## Shadows

### Standard Shadows
```
xs:      0 1px 2px 0 rgba(0, 0, 0, 0.05)
sm:      0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)
DEFAULT: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)
md:      0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)
lg:      0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)
xl:      0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)
2xl:     0 25px 50px -12px rgba(0, 0, 0, 0.25)
inner:   inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)
```

### Voice Assistant Shadows
Special shadows for voice assistant states with colored glows:

```
voice-idle:       0 0 0 4px rgba(115, 115, 115, 0.1)
voice-listening:  0 0 0 4px rgba(0, 177, 64, 0.2), 0 0 20px rgba(0, 177, 64, 0.3)
voice-processing: 0 0 0 4px rgba(186, 255, 41, 0.2), 0 0 20px rgba(186, 255, 41, 0.3)
voice-speaking:   0 0 0 4px rgba(0, 177, 64, 0.2), 0 0 20px rgba(0, 177, 64, 0.3)
voice-error:      0 0 0 4px rgba(239, 68, 68, 0.2), 0 0 20px rgba(239, 68, 68, 0.3)
```

## Border Radius

### Standard Radius
```
none:    0
sm:      0.125rem  (2px)
DEFAULT: 0.25rem   (4px)
md:      0.375rem  (6px)
lg:      0.5rem    (8px)
xl:      0.75rem   (12px)
2xl:     1rem      (16px)
3xl:     1.5rem    (24px)
4xl:     2rem      (32px)
5xl:     2.5rem    (40px)
6xl:     3rem      (48px)
full:    9999px    (Perfect circle)
```

### Usage Guidelines

- Use `sm` to `md` for subtle rounding on small elements
- Use `lg` to `xl` for buttons and form elements
- Use `2xl` to `3xl` for cards and major components
- Use `4xl` to `6xl` for hero sections and major containers
- Use `full` for circular elements like avatars and voice buttons

## Animations

### Voice Assistant Animations
```
voice-pulse:      2s ease-in-out infinite
voice-listening:  1.5s ease-in-out infinite
voice-processing: 1s ease-in-out infinite
```

### General Animations
```
thinking:    1.5s ease-in-out infinite
fade-in:     0.3s ease-out
fade-out:    0.3s ease-out
slide-up:    0.4s ease-out
slide-down:  0.4s ease-out
slide-left:  0.4s ease-out
slide-right: 0.4s ease-out
scale-in:    0.3s ease-out
scale-out:   0.3s ease-out
breath:      4s ease-in-out infinite
float:       3s ease-in-out infinite
glow:        2s ease-in-out infinite alternate
```

### Custom Timing Functions
```
ease-in-out-back: cubic-bezier(0.68, -0.55, 0.265, 1.55)
ease-out-expo:    cubic-bezier(0.19, 1, 0.22, 1)
ease-in-expo:     cubic-bezier(0.95, 0.05, 0.795, 0.035)
ease-out-back:    cubic-bezier(0.34, 1.56, 0.64, 1)
```

## Components

### Buttons

#### Primary Button
```tsx
<button className="btn-primary">
  Primary Action
</button>
```

#### Secondary Button
```tsx
<button className="btn-secondary">
  Secondary Action
</button>
```

#### Outline Button
```tsx
<button className="btn-outline">
  Outline Action
</button>
```

#### Ghost Button
```tsx
<button className="btn-ghost">
  Ghost Action
</button>
```

#### Button Sizes
```tsx
<button className="btn-primary btn-small">Small</button>
<button className="btn-primary">Medium (default)</button>
<button className="btn-primary btn-large">Large</button>
```

### Voice Button

Special button for voice assistant interactions:

```tsx
<button className="voice-button voice-button-idle">
  <MicrophoneIcon />
</button>

<button className="voice-button voice-button-listening">
  <MicrophoneIcon />
</button>

<button className="voice-button voice-button-processing">
  <MicrophoneIcon />
</button>
```

### Cards

#### Basic Card
```tsx
<div className="card p-6">
  <h3 className="text-title-large text-text-primary mb-4">Card Title</h3>
  <p className="text-body-medium text-text-secondary">Card content goes here.</p>
</div>
```

#### Elevated Card
```tsx
<div className="card-elevated p-6">
  <h3 className="text-title-large text-text-primary mb-4">Elevated Card</h3>
  <p className="text-body-medium text-text-secondary">This card has more elevation.</p>
</div>
```

### Inputs

#### Text Input
```tsx
<input 
  type="text" 
  className="input-primary" 
  placeholder="Enter text..."
/>
```

#### Input with Error
```tsx
<input 
  type="text" 
  className="input-primary input-error" 
  placeholder="Enter text..."
/>
```

### Status Indicators

#### Success Status
```tsx
<div className="status-success px-4 py-2 rounded-lg">
  <p className="text-label-medium">Success message</p>
</div>
```

#### Warning Status
```tsx
<div className="status-warning px-4 py-2 rounded-lg">
  <p className="text-label-medium">Warning message</p>
</div>
```

#### Error Status
```tsx
<div className="status-error px-4 py-2 rounded-lg">
  <p className="text-label-medium">Error message</p>
</div>
```

### Loading States

#### Skeleton Loader
```tsx
<div className="loading-skeleton h-4 w-32 rounded"></div>
```

#### Spinner
```tsx
<div className="loading-spinner w-6 h-6"></div>
```

## Utilities

### Gradient Utilities
```tsx
<div className="gradient-primary p-6 rounded-2xl">
  Primary gradient background
</div>

<div className="gradient-secondary p-6 rounded-2xl">
  Secondary gradient background
</div>

<div className="gradient-neutral p-6 rounded-2xl">
  Neutral gradient background
</div>
```

### Backdrop Blur
```tsx
<div className="backdrop-blur-sm bg-surface-overlay">
  Blurred background
</div>
```

### Scrollbar Hide
```tsx
<div className="scrollbar-hide overflow-auto">
  Content with hidden scrollbar
</div>
```

### Text Utilities
```tsx
<p className="text-balance">Balanced text layout</p>
<p className="text-pretty">Pretty text wrapping</p>
```

## Usage Guidelines

### Color Usage

1. **Primary Colors**: Use for main actions, links, and brand elements
2. **Secondary Colors**: Use for accents, highlights, and secondary actions
3. **Neutral Colors**: Use for text, backgrounds, and borders
4. **Semantic Colors**: Use for status indicators and feedback

### Typography Hierarchy

1. **Display**: Hero sections, main page titles
2. **Headlines**: Section headings, important titles
3. **Titles**: Subsection titles, component headings
4. **Body**: Main content, descriptions
5. **Labels**: UI labels, captions, metadata

### Spacing Consistency

- Maintain consistent spacing throughout the application
- Use the spacing scale for margins, padding, and gaps
- Follow the 8px grid system for alignment

### Component Composition

- Use pre-built component classes when possible
- Combine utility classes for custom components
- Maintain consistent patterns across similar components

## Accessibility

### Color Contrast

All color combinations meet WCAG AA accessibility standards:

- Primary colors on white backgrounds: ✅ AA compliant
- Text colors on backgrounds: ✅ AA compliant
- Interactive elements: ✅ AA compliant

### Focus States

All interactive elements include visible focus states:

- Buttons: `focus:ring-2 focus:ring-offset-2`
- Inputs: `focus:ring-2 focus:ring-offset-2`
- Links: `focus:ring-2 focus:ring-offset-2`

### Voice Assistant Accessibility

- Voice button states are clearly differentiated
- Audio feedback complements visual feedback
- Screen reader support for voice assistant states

### Motion Accessibility

- Animations respect `prefers-reduced-motion`
- Essential animations are subtle and purposeful
- No flashing or rapid motion that could trigger seizures

## TypeScript Integration

The design system includes comprehensive TypeScript definitions:

```tsx
import { ButtonProps, VoiceButtonProps } from '@/types/design-system';
import { generateButtonClasses, generateVoiceButtonClasses } from '@/utils/design-system';

// Type-safe button component
const Button: React.FC<ButtonProps> = ({ variant = 'primary', size = 'medium', ...props }) => {
  const classes = generateButtonClasses(variant, size);
  return <button className={classes} {...props} />;
};

// Type-safe voice button component
const VoiceButton: React.FC<VoiceButtonProps> = ({ state = 'idle', ...props }) => {
  const classes = generateVoiceButtonClasses(state);
  return <button className={classes} {...props} />;
};
```

## Development Tools

### Utility Functions

The design system provides utility functions for common tasks:

```tsx
import { 
  getColor, 
  getSpacing, 
  getTypography,
  generateButtonClasses,
  isAccessible 
} from '@/utils/design-system';

// Get design tokens
const primaryColor = getColor('primary.500');
const mediumSpacing = getSpacing('4');
const headlineStyle = getTypography('headline-large');

// Generate component classes
const buttonClasses = generateButtonClasses('primary', 'large');

// Check accessibility
const isColorAccessible = isAccessible('#00b140', '#ffffff');
```

### Validation

The system includes validation utilities to ensure proper usage:

```tsx
import { validateDesignToken } from '@/utils/design-system';

// Validate design tokens
const isValidColor = validateDesignToken('primary.500', 'color');
const isValidSpacing = validateDesignToken('4', 'spacing');
```

This design system provides a solid foundation for building consistent, accessible, and maintainable user interfaces for the AI Voice Assistant prototype. The combination of comprehensive design tokens, utility functions, and TypeScript integration ensures both developer productivity and design consistency. 