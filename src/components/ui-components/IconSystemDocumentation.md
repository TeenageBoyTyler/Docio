# Icon System Documentation

## Overview

The Docio application uses Lucide icons via a standardized Icon component. This ensures consistent styling and behavior across the application while maintaining the minimalist design philosophy.

## Installation

Make sure you have the Lucide React package installed:

```bash
npm install lucide-react
# or
yarn add lucide-react
```

## Basic Usage

```tsx
import { Icon } from "../shared/icons";

// Basic icon usage
<Icon name="FileText" />
```

## Props

The `Icon` component accepts the following props:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | string | (required) | Name of the Lucide icon to display |
| `size` | "small" \| "medium" \| "large" | "medium" | Size of the icon |
| `color` | string | (inherited) | Color of the icon |
| `onClick` | function | undefined | Click handler for the icon |
| `ariaLabel` | string | undefined | Accessibility label |
| `className` | string | undefined | Additional CSS class name |

## Icon Sizes

The Icon component supports three sizes:

- `small`: 16×16px (use for inline text or tight spaces)
- `medium`: 20×20px (default size, use for most UI elements)
- `large`: 24×24px (use for emphasis or larger UI elements)

```tsx
// Small icon
<Icon name="Search" size="small" />

// Medium icon (default)
<Icon name="Search" />

// Large icon
<Icon name="Search" size="large" />
```

## Icon Colors

Icons will inherit their color from the parent element by default. You can also set a specific color:

```tsx
// Inherited color
<Icon name="Heart" />

// Specific color
<Icon name="Heart" color="#FF0000" />

// Using theme colors
<Icon name="Heart" color={theme.colors.primary} />
```

## Interactive Icons

To make an icon interactive, add an `onClick` handler:

```tsx
<Icon 
  name="Trash2" 
  onClick={handleDelete} 
  ariaLabel="Delete item" 
/>
```

The component will automatically:
- Set the cursor to pointer
- Make the icon focusable with keyboard
- Apply focus styles for accessibility

Always include an `ariaLabel` for accessible naming when icons are interactive.

## Icons in Buttons

When using icons in buttons, import the Icon component:

```tsx
import { Button } from "../shared/buttons";
import { Icon } from "../shared/icons";

<Button 
  variant="primary" 
  onClick={handleAction}
  startIcon={<Icon name="Plus" size="small" />}
>
  Add Item
</Button>
```

## Available Icons

For a full list of available icons, refer to the [Lucide icons documentation](https://lucide.dev/icons/).

Common icons used in our application:

- Navigation: `ChevronLeft`, `ChevronRight`, `Menu`
- Actions: `Plus`, `Pencil`, `Trash2`, `Search`, `Filter`
- Status: `Check`, `X`, `AlertCircle`, `Info`
- Media: `Upload`, `Download`, `FileText`, `Image`
- UI: `Settings`, `User`, `Tag`, `Cloud`

## Accessibility Guidelines

- Always include an `ariaLabel` for icons without accompanying text
- For decorative icons, no `ariaLabel` is needed
- For icons inside buttons with text, the button text provides sufficient context
- Ensure icons have sufficient contrast ratio with their backgrounds

## Best Practices

1. Use the smallest size that maintains clarity
2. Keep icons consistent with the UI context
3. Use meaningful icon choices that users will recognize
4. When in doubt, include a text label with the icon
5. Use standard icons for standard actions
6. Don't change icon meaning between contexts

## Demo

Visit `/demo/icons` in the application to see examples of all icons and their usage.