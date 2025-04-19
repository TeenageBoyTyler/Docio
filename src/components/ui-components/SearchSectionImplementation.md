# Search Section Transition System Implementation

## Overview

This document details the implementation of the transition system in the Search section of the Docio application. The transitions have been designed to create a fluid, intuitive user experience that guides users through the search workflow with spatial awareness and visual hierarchy.

## Core Components and Patterns

The Search section implements the transition system using the following standardized components:

1. **PageTransition**: For main transitions between search steps (input → results → actions → PDF creation)
2. **SlideTransition**: For element entries/exits with directional movement
3. **FadeTransition**: For subtle element appearances
4. **ModalTransition**: For modal dialogs, like the selected items preview

## Implementation Details

### SearchSection.tsx

The main container implements a spatial navigation model where each step has a defined position:

```javascript
const stepPositionMap: Record<string, number> = {
  input: 0,
  results: 1,
  actions: 2,
  pdfCreation: 3,
};
```

This allows the `useTransitionDirection` hook to automatically determine the animation direction based on navigation:

- Moving forward in the flow (e.g., input → results): Slides left
- Moving backward in the flow (e.g., results → input): Slides right

Enhanced parameters for different steps create a distinct feeling for each transition:

```javascript
const getTransitionParams = (step: string) => {
  // Customize transition based on step
  switch (step) {
    case "input":
      return {
        ...baseParams,
        duration: 0.5, // slightly longer for the main search screen
        distance: 100, // more dramatic slide for the main transition
      };
    case "pdfCreation":
      return {
        ...baseParams,
        duration: 0.4,
        distance: 80, // more noticeable for the final step
      };
    default:
      return {
        ...baseParams,
        duration: 0.35,
        distance: 60,
      };
  }
};
```

### SearchResults.tsx

This component implements several animation patterns:

1. **Staggered Grid**: Results appear with a staggered delay based on index:

   ```javascript
   animate={{
     opacity: 1,
     scale: 1,
     y: 0,
     transition: {
       delay: index * 0.05,
       duration: 0.3,
       ease: "easeOut"
     }
   }}
   ```

2. **Selection Indicator**: Uses a spring-based animation for responsive feedback:

   ```javascript
   animate={{
     opacity: 1,
     scale: 1,
     transition: {
       type: "spring",
       stiffness: 500,
       damping: 25
     }
   }}
   ```

3. **Floating Action Button**: Subtle attention-grabbing animation and enhanced hover state:
   ```javascript
   animate={{
     rotate: [0, 5, 0, -5, 0],
     transition: {
       duration: 0.5,
       delay: 1,
       repeat: 1,
       repeatType: "reverse"
     }
   }}
   ```

### SearchInput.tsx

Implements several transition patterns:

1. **Selected Items Indicator**: Slides in from the top with subtle pulsing animation
2. **Modal Preview**: Uses `ModalTransition` for a standardized modal appearance
3. **Staggered Item Preview**: Thumbnail items appear with a staggered delay

### SelectionActions.tsx

1. **ThumbnailStrip**: Implements staggered entry animation with hover effects

   ```javascript
   initial={{ opacity: 0, scale: 0.9, x: -10 }}
   animate={{
     opacity: 1,
     scale: 1,
     x: 0,
     transition: {
       delay: index * 0.05,
       duration: 0.3,
       ease: "easeOut"
     }
   }}
   whileHover={{
     scale: 1.05,
     y: -5,
     boxShadow: "0 5px 10px rgba(0, 0, 0, 0.1)",
     transition: { duration: 0.2 }
   }}
   ```

2. **Orientation Options**: Uses subtle animation to highlight selection

   ```javascript
   animate={{
     scale: orientation === "portrait" ? [1, 1.05, 1] : 1,
     transition: { duration: 0.3 }
   }}
   ```

3. **Action Buttons**: Enhanced hover states and attention animation
   ```javascript
   animate={{
     boxShadow: ["0px 0px 0px rgba(0,0,0,0)", "0px 4px 8px rgba(0,0,0,0.1)", "0px 0px 0px rgba(0,0,0,0)"],
     transition: {
       duration: 2,
       repeat: 0,
       repeatDelay: 3
     }
   }}
   ```

### PdfCreationView.tsx

Uses `AnimatePresence` with `mode="wait"` to handle transitions between different states:

1. **Loading State**: Subtle floating animation
2. **Error State**: Alert animation with emphasis on retry button
3. **Success State**: Progressive reveal with spring animation for success icon
   ```javascript
   animate={{
     scale: [0, 1.2, 1],
     opacity: 1,
     transition: {
       duration: 0.6,
       type: "spring",
       stiffness: 200
     }
   }}
   ```

## Animation Principles Applied

1. **Spatial Consistency**: Elements maintain spatial relationships during transitions
2. **Progressive Disclosure**: Elements appear with staggered timing to guide attention
3. **Motion Hierarchy**: Primary elements have more pronounced animations
4. **Interaction Feedback**: Enhanced hover and click states
5. **Contextual Animation**: Animation properties vary based on context (e.g., success vs. error)

## Performance Considerations

1. **Hardware Acceleration**: Using transforms (`scale`, `x`, `y`) instead of layout properties
2. **Minimal DOM Updates**: Using `AnimatePresence` with `mode="wait"` to reduce DOM operations
3. **Optimized Transitions**: Short duration for frequent interactions, longer for major views

## Future Improvements

1. **Gesture Support**: Add swipe gestures for mobile navigation
2. **Reduced Motion Support**: Add `prefers-reduced-motion` media query support
3. **Shared Element Transitions**: Implement for thumbnails that appear in multiple views
4. **Entry Point Animations**: Special animations when entering the Search section from other sections
5. **Performance Metrics**: Add monitoring for animation performance on low-end devices
