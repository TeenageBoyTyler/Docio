# Component Animation Implementation Guide

This guide explains how to implement animations for specific components within the Docio application, focusing on the TaggingView component as an exemplary case.

## Component Animation Strategy

For complex components like TaggingView, we recommend:

1. **Extract animation variants** to a separate file for better organization
2. **Use the motion component pattern** via `as={motion.div}`
3. **Implement responsive animations** for both mobile and desktop layouts
4. **Follow a consistent animation sequence** across device types

## TaggingView Implementation Example

The TaggingView component demonstrates how to implement complex animations in both mobile and desktop layouts.

### 1. Animation Variants File

First, create a separate file for animation variants to keep your component file clean:

```tsx
// taggingViewAnimations.ts
export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      when: "afterChildren",
    },
  },
};

export const headerVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: {
      duration: 0.2,
    },
  },
};

// Additional variants for other elements...
```

### 2. Import Animation Variants

Import the variants at the top of your component file:

```tsx
import {
  containerVariants,
  headerVariants,
  titleVariants,
  mobileThumbnailStripVariants,
  desktopThumbnailStripVariants,
  thumbnailVariants,
  imageContainerVariants,
  imageVariants,
  editButtonVariants,
  taggingContainerVariants,
  buttonContainerVariants,
  editorContainerVariants,
  editorPanelVariants,
  editorHeaderVariants,
  editorContentVariants,
  navigationButtonsVariants,
  navigationButtonVariants,
  completeButtonVariants,
  sidePanelVariants,
} from "./taggingViewAnimations";
```

### 3. Mobile Implementation

Apply animations to your mobile implementation:

```tsx
// Mobile view
return (
  <MobileContainer
    as={motion.div}
    variants={containerVariants}
    initial="hidden"
    animate="visible"
    exit="exit"
  >
    <Header as={motion.div} variants={headerVariants}>
      <HeaderTopRow>
        <BackButtonContainer>
          <BackButton
            onClick={goToPreviousImage}
            variant="text"
            showLabel={false}
            aria-label="Back to previous image or preview"
          />
        </BackButtonContainer>
      </HeaderTopRow>

      <Title as={motion.h2} variants={titleVariants}>
        Tag Image
      </Title>

      <MobileThumbnailStrip
        as={motion.div}
        variants={mobileThumbnailStripVariants}
      >
        {files.map((file, index) => (
          <Thumbnail
            key={file.id}
            isActive={index === currentFileIndex}
            onClick={() => setCurrentFileIndex(index)}
            as={motion.div}
            variants={thumbnailVariants}
            whileHover={{ scale: 1.1, opacity: 1 }}
          >
            <img src={file.preview} alt={`Thumbnail ${index + 1}`} />
            {file.tags.length > 0 && (
              <TagIndicator>
                <TagCount>{file.tags.length}</TagCount>
              </TagIndicator>
            )}
          </Thumbnail>
        ))}
      </MobileThumbnailStrip>
    </Header>

    {/* Additional mobile components with animations */}
  </MobileContainer>
);
```

### 4. Desktop Implementation

Apply animations to your desktop implementation:

```tsx
// Desktop view
return (
  <DesktopContainer
    as={motion.div}
    variants={containerVariants}
    initial="hidden"
    animate="visible"
    exit="exit"
  >
    <BackButtonContainer position="absolute">
      <BackButton
        onClick={goToPreviousImage}
        showLabel={true}
        label="Back to Preview"
        variant="text"
      />
    </BackButtonContainer>

    <ImageSection as={motion.div} variants={imageContainerVariants}>
      <PreviewImage
        src={currentFile.preview}
        alt={currentFile.name || "Image preview"}
        as={motion.img}
        variants={imageVariants}
      />
      <EditButton
        iconName="Edit2"
        onClick={toggleEditor}
        variant="primary"
        aria-label="Edit image"
        as={motion.button}
        variants={editButtonVariants}
        whileHover="hover"
      />

      {/* Additional desktop components with animations */}
    </ImageSection>
  </DesktopContainer>
);
```

## Animation Design Principles for Components

When designing animations for components, follow these principles:

1. **Spatial Hierarchy**: Elements should appear in a logical order

   - Headers and containers appear before their children
   - Primary content appears before secondary elements

2. **Staggered Timing**: Related elements should appear in sequence

   - Thumbnails in a strip appear one after another
   - Menu items cascade into view

3. **Appropriate Motion**: Each element's motion should reflect its purpose

   - Containers use simple fade/slide animations
   - Interactive elements can have more dynamic animations
   - Success states use celebratory animations

4. **Interactive Feedback**: Provide immediate feedback for interactive elements

   - Hover states should feel responsive and immediate
   - Selection states should be clearly animated
   - Buttons should have subtle but noticeable hover/press animations

5. **Consistent Animation Variables**: Use consistent animation parameters
   - Similar elements should have similar durations and easings
   - Maintain a hierarchy of importance through animation emphasis

## Implementation Pattern Guide

### 1. Component Structure

For complex animated components:

```
YourComponent/
  ├── YourComponent.tsx         // Main component
  ├── YourComponentAnimations.ts // Animation variants
  ├── YourComponentStyles.ts    // Styled components
  └── index.ts                  // Export
```

### 2. Animation Sequence

Follow this general sequence for component animations:

1. Container appears first
2. Header elements appear next (including title)
3. Navigation/control elements appear
4. Main content appears
5. Secondary content/actions appear last

### 3. Responsive Variants

Create variant sets for different viewports:

```typescript
// Mobile variants
export const mobileThumbnailStripVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      staggerChildren: 0.05,
    },
  },
  // ...
};

// Desktop variants
export const desktopThumbnailStripVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      staggerChildren: 0.05,
    },
  },
  // ...
};
```

### 4. Interactive Animation Variants

For interactive elements:

```typescript
export const buttonVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.2,
      ease: "easeOut",
    },
  },
  hover: {
    scale: 1.05,
    boxShadow: "0 5px 10px rgba(0,0,0,0.1)",
    transition: {
      duration: 0.2,
      ease: "easeOut",
    },
  },
  tap: {
    scale: 0.98,
    transition: {
      duration: 0.1,
      ease: "easeIn",
    },
  },
};
```

## Performance Considerations

For component-level animations:

1. **Avoid layout property animations**: Prefer transform properties (scale, translate)
2. **Limit nested animations**: Too many nested animations can impact performance
3. **Use appropriate easing**: Use easing that matches the purpose of the animation
4. **Debounce animation triggers**: Prevent rapid animation toggling
5. **Monitor bundle size**: Large animation libraries can impact load times

## Implementation Notes

1. **AnimatePresence**: Ensure AnimatePresence is properly set up in parent components
2. **Motion Components**: Convert elements to motion components using `as={motion.div}`
3. **Variants Propagation**: Child variants automatically receive their animation state from parent elements
4. **Reduced Motion**: Check for reduced motion preferences for accessibility

## Timing and Sequencing Best Practices

1. **Container First**: Main containers should appear first (0.2-0.3s)
2. **Headers Second**: Header elements appear next (0.3-0.4s with 0.1s delay)
3. **Staggered Children**: Use staggered timing for related elements (0.05-0.1s between items)
4. **Main Content**: Primary content appears with slightly longer duration (0.4-0.5s)
5. **Action Items Last**: Action buttons/controls appear last to guide user flow

This sequence creates a clear visual hierarchy that guides the user's attention through the component in a logical order.
