# Section Transition Implementation Guide

This guide details how to implement the Docio Transition System in specific application sections (Search and Upload). Both sections follow similar patterns while addressing their unique requirements.

## Common Implementation Patterns

Both the Search and Upload sections implement:

- A spatial navigation model with a step position map
- Step-specific animation parameters
- Consistent directional movements (forward = left, backward = right)
- AnimatePresence for component lifecycle management

## 1. Search Section Implementation

### Core Components

The Search section implements these transition components:

1. **PageTransition**: For main transitions between search steps
2. **SlideTransition**: For element entries/exits with directional movement
3. **FadeTransition**: For subtle element appearances
4. **ModalTransition**: For modal dialogs, like selected items preview

### Spatial Navigation Model

The Search section defines step positions to create a linear spatial model:

```javascript
const stepPositionMap: Record<string, number> = {
  input: 0,
  results: 1,
  actions: 2,
  pdfCreation: 3,
};
```

This allows the `useTransitionDirection` hook to automatically determine the animation direction.

### Step-Specific Parameters

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

### Component-Specific Animations

#### SearchResults.tsx

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

2. **Selection Indicator**: Uses a spring-based animation for responsive feedback
3. **Floating Action Button**: Subtle attention-grabbing animation

#### SearchInput.tsx

1. **Selected Items Indicator**: Slides in from the top with subtle pulsing animation
2. **Modal Preview**: Uses `ModalTransition` for a standardized modal appearance
3. **Staggered Item Preview**: Thumbnail items appear with a staggered delay

#### SelectionActions.tsx

1. **ThumbnailStrip**: Implements staggered entry animation with hover effects
2. **Orientation Options**: Uses subtle animation to highlight selection
3. **Action Buttons**: Enhanced hover states and attention animation

#### PdfCreationView.tsx

Uses `AnimatePresence` with `mode="wait"` to handle transitions between different states:

1. **Loading State**: Subtle floating animation
2. **Error State**: Alert animation with emphasis on retry button
3. **Success State**: Progressive reveal with spring animation for success icon

## 2. Upload Section Implementation

### Flow Overview

The Upload flow has six distinct steps:

1. **Selection** - User selects files (initial step)
2. **Preview** - User reviews selected files
3. **Tagging** - User tags files
4. **Processing** - Files are processed
5. **Uploading** - Files are uploaded to cloud storage
6. **Success** - Confirmation of successful upload

### Spatial Navigation Model

```typescript
const stepPositionMap: Record<string, number> = {
  selection: 0,
  preview: 1,
  tagging: 2,
  processing: 3,
  uploading: 4,
  success: 5,
};
```

### ContentWrapper for Vertical Alignment

```typescript
const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
`;
```

This ensures consistent vertical centering across all steps.

### Staggered Animations

For components with multiple elements (like the FilePreview grid):

```typescript
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
  // ...
};
```

### Step-Specific Parameters

```typescript
const getTransitionParams = (step: string) => {
  const baseParams = {
    transitionKey: `upload-${step}-${stepChangeTimestamp.current}`,
    direction,
    isActive: true,
  };

  switch (step) {
    case "selection":
      return {
        ...baseParams,
        duration: 0.5,
        distance: 100,
      };
    case "preview":
      return {
        ...baseParams,
        duration: 0.4,
        distance: 80,
      };
    case "tagging":
      return {
        ...baseParams,
        duration: 0.45,
        distance: 90,
      };
    case "processing":
    case "uploading":
      return {
        ...baseParams,
        duration: 0.35,
        distance: 60,
      };
    case "success":
      return {
        ...baseParams,
        duration: 0.5,
        distance: 80,
      };
  }
};
```

### Timestamp Tracking

A timestamp reference is used to ensure animations reset properly when navigating between steps:

```typescript
const stepChangeTimestamp = useRef(Date.now());

// Update timestamp when step changes
useEffect(() => {
  stepChangeTimestamp.current = Date.now();
}, [currentStep]);
```

### Component-Specific Implementations

#### UploadSection.tsx

The main container orchestrates transitions between steps:

- Uses `PageTransition` and `AnimatePresence`
- Defines step positions with `stepPositionMap`
- Uses `useTransitionDirection` to determine animation direction
- Wraps each step component in a ContentWrapper for vertical alignment

```typescript
<AnimatePresence mode="wait">
  {currentStep === "selection" && (
    <PageTransition {...getTransitionParams("selection")}>
      <ContentWrapper>
        <DragDropFileUpload isAddingMore={isAddingMore} />
      </ContentWrapper>
    </PageTransition>
  )}
  {/* Other steps */}
</AnimatePresence>
```

#### FilePreview.tsx

Implements staggered animations for the thumbnail grid:

- Defines animation variants for container, items, header, and buttons
- Uses staggered children animations with delays between items
- Adds hover animations for interactive elements

#### ProcessingView.tsx

Enhances the processing experience:

- Uses `useAnimation` for dynamic control of animations
- Adds visual feedback when progress changes
- Creates distinct states for processing, error, and completion
- Uses icon animations to draw attention to the current state

#### SuccessView.tsx

Creates a celebratory completion experience:

- Implements a check mark animation that scales and rotates
- Staggers button animations to guide user attention
- Adds subtle hover effects for interactive elements

## Implementation Comparison

| Feature            | Search Section       | Upload Section |
| ------------------ | -------------------- | -------------- |
| Main Pattern       | PageTransition       | PageTransition |
| Steps              | 4 steps              | 6 steps        |
| Staggered Grids    | SearchResults        | FilePreview    |
| Vertical Alignment | Varied per component | ContentWrapper |
| Timestamp Tracking | No                   | Yes            |
| Modal Transitions  | Yes                  | Limited        |
| Success Animation  | PDF creation success | Upload success |

## Best Practices for Section Implementation

1. **Maintain Directional Consistency** - Forward = left, backward = right
2. **Vertical Alignment** - Use ContentWrapper for consistent centering
3. **Step Importance** - Adjust duration and distance based on step importance
4. **Reset Animations** - Use timestamps to prevent animation conflicts
5. **Stagger Related Items** - Use staggered animations for grids and lists
6. **Feedback Animation** - Provide animated feedback for user actions
