# Docio Transition System Documentation

## Overview

The Docio Transition System provides a consistent, accessible, and performant way to animate elements throughout the application. This system creates a spatial navigation model that reinforces the user's mental map of the application structure.

## Core Principles

1. **Consistency**: Transitions should feel familiar across the application
2. **Spatial Awareness**: Transitions should reinforce spatial relationships between views
3. **Progressive Disclosure**: Animations should guide attention to newly revealed content
4. **Performance**: Animations should maintain 60fps, even on mobile devices
5. **Minimalism**: Animations should enhance the experience subtly, not distract
6. **Spatial Consistency**: Elements maintain spatial relationships during transitions
7. **Motion Hierarchy**: Primary elements have more pronounced animations
8. **Interaction Feedback**: Enhanced hover and click states
9. **Contextual Animation**: Animation properties vary based on context (e.g., success vs. error)

## Transition Components

### PageTransition

For major view transitions, typically between full screens or sections.

```jsx
<PageTransition
  transitionKey="unique-key"
  direction={TransitionDirection.LEFT}
  isActive={someCondition}
>
  <YourComponent />
</PageTransition>
```

### FadeTransition

For simple fade in/out transitions.

```jsx
<FadeTransition transitionKey="unique-key" duration={0.3} withScale={true}>
  <YourComponent />
</FadeTransition>
```

### SlideTransition

For elements that slide in from a particular direction.

```jsx
<SlideTransition
  transitionKey="unique-key"
  direction={TransitionDirection.LEFT}
  slideDistance={50}
>
  <YourComponent />
</SlideTransition>
```

### ModalTransition

For modal dialogs with backdrop overlay.

```jsx
<ModalTransition
  isOpen={modalIsOpen}
  onClose={() => setModalIsOpen(false)}
  maxWidth="500px"
>
  <YourModalContent />
</ModalTransition>
```

## Staggered Animations

For related elements that should animate in sequence:

```jsx
// Container
<motion.div
  variants={staggerContainerVariants}
  initial="hidden"
  animate="show"
  exit="exit"
>
  {/* Children */}
  <motion.div variants={staggerItemVariants}>Item 1</motion.div>
  <motion.div variants={staggerItemVariants}>Item 2</motion.div>
  <motion.div variants={staggerItemVariants}>Item 3</motion.div>
</motion.div>
```

Standard stagger variants:

```javascript
const staggerContainerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
};

const staggerItemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 15,
    },
  },
  exit: {
    opacity: 0,
    y: 10,
    transition: {
      duration: 0.2,
    },
  },
};
```

## Spatial Navigation Model

We implement a spatial navigation model where each step in a flow has a defined position:

```typescript
// Example for a section with sequential steps
const stepPositionMap: Record<string, number> = {
  step1: 0,
  step2: 1,
  step3: 2,
  step4: 3,
};
```

This model ensures consistent directional transitions:

- Moving forward (step1 → step2 → step3) animates left-to-right
- Moving backward (step3 → step2 → step1) animates right-to-left

## Transition Directions

The `TransitionDirection` enum provides consistent directional animations:

```typescript
enum TransitionDirection {
  NONE = "none",
  LEFT = "left",
  RIGHT = "right",
  UP = "up",
  DOWN = "down",
  FADE = "fade",
}
```

Use directional transitions to reinforce spatial relationships:

- Going to a child view → RIGHT
- Going back to parent → LEFT
- Going up in hierarchy → UP
- Going down in hierarchy → DOWN

## Utility Hooks

### useTransitionDirection

Automatically determines transition direction based on navigation:

```typescript
const { direction } = useTransitionDirection({
  current: currentView,
  positionMap: viewPositionMap,
});
```

### useTransitionVariants

Gets the correct initial and exit variants for a transition direction:

```typescript
const { initialVariant, exitVariant } = useTransitionVariants(direction);
```

## Animation Constants

Standard durations, easings, and distances are defined in `TransitionConfig.ts`:

```typescript
// Durations in seconds
const DURATIONS = {
  short: 0.15,
  medium: 0.3,
  long: 0.5,
};

// Easing presets
const EASINGS = {
  default: [0.4, 0.0, 0.2, 1],
  easeOut: [0.0, 0.0, 0.2, 1],
  easeIn: [0.4, 0.0, 1, 1],
  sharp: [0.4, 0.0, 0.6, 1],
};

// Distances in pixels
const DISTANCES = {
  small: 10,
  medium: 20,
  large: 50,
  xlarge: 100,
};
```

## Step-Specific Animation Parameters

Often, different steps require customized animation parameters:

```typescript
const getTransitionParams = (step: string) => {
  const baseParams = {
    transitionKey: `section-${step}-${timestamp}`,
    direction,
    isActive: true,
  };

  switch (step) {
    case "input":
      return {
        ...baseParams,
        duration: 0.5, // slightly longer for the main screen
        distance: 100, // more dramatic slide for the main transition
      };
    case "results":
      return {
        ...baseParams,
        duration: 0.4,
        distance: 80,
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

## Best Practices

### Animation Best Practices

1. **Always use keys** for AnimatePresence and transition components
2. **Avoid nesting** AnimatePresence components when possible
3. **Use consistent directions** for similar navigation patterns
4. **Prefer short durations** (0.2-0.3s) for most animations
5. **Stagger children** when animating multiple related elements
6. **Use gesture animations** for interactive elements (hover, tap, drag)
7. **Test on low-end devices** to ensure performance
8. **Apply different timing** based on importance:
   - More important steps get slightly longer, more noticeable transitions
   - Utilitarian steps get subtler, quicker transitions
9. **Scale distance** to the importance of the step:
   - Entry/exit points have more dramatic transitions
   - Intermediate steps have moderate transitions

### Performance Considerations

1. **Hardware Acceleration**: Use transforms (`scale`, `x`, `y`) instead of layout properties
2. **Minimal DOM Updates**: Use `AnimatePresence` with `mode="wait"` to reduce DOM operations
3. **Optimized Transitions**: Short duration for frequent interactions, longer for major views
4. **Consider using `will-change`** for complex animations that may benefit from GPU acceleration
5. **Avoid animating CPU-intensive properties** (like box-shadow, filter)
6. **Limit the number** of concurrent animations

### Accessibility Considerations

1. **Honor `prefers-reduced-motion`** settings
2. **Critical UI** should be usable even if animations fail or are disabled
3. **Avoid animations** that could trigger vestibular disorders
4. **Ensure proper focus management** during transitions

## Example: Proper Navigation Flow

```jsx
// In a parent component that manages navigation
const { direction } = useTransitionDirection({
  current: currentView,
  positionMap: {
    home: 0,
    documents: 1,
    tags: 2,
    settings: 3,
  },
});

// In render method
<AnimatePresence mode="wait">
  {currentView === "home" && (
    <PageTransition key="home-view" direction={direction} isActive={true}>
      <HomeComponent />
    </PageTransition>
  )}

  {currentView === "documents" && (
    <PageTransition key="documents-view" direction={direction} isActive={true}>
      <DocumentsComponent />
    </PageTransition>
  )}
</AnimatePresence>;
```

## Developer Tools & Debugging

- Use Framer Motion's debug prop for visualizing animation paths
- Chrome DevTools Performance tab can identify janky animations
- Test animations at various speeds (slow motion can reveal issues)
- Verify transitions work on both high and low-end devices
