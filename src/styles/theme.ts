// Theme definition for the application
export const theme = {
  colors: {
    // Primary colors
    background: '#121212',  // Dark background for main surfaces
    surface: '#1E1E1E',     // Slightly lighter for cards, modals, etc.
    primary: '#BB86FC',     // Primary action color - purple
    secondary: '#03DAC6',   // Secondary action color - teal
    accent: '#CF6679',      // Accent color for highlights

    // Text colors
    text: {
      primary: '#FFFFFF',   // High emphasis text - white
      secondary: '#B3B3B3', // Medium emphasis text - light gray
      disabled: '#5C5C5C',  // Disabled text - dark gray
    },

    // Feedback colors
    error: '#CF6679',       // Error messages
    success: '#03DAC6',     // Success messages
    warning: '#FFAB40',     // Warning messages
    info: '#2196F3',        // Information messages

    // UI elements
    divider: '#2D2D2D',     // Line dividers between content
    overlay: 'rgba(0, 0, 0, 0.5)', // Overlay for modals
    shadow: 'rgba(0, 0, 0, 0.2)',  // Shadows for elevation

    // Tag colors (for document tagging)
    tags: {
      blue: '#4285F4',
      green: '#0F9D58', 
      red: '#DB4437',
      yellow: '#F4B400',
      purple: '#AB47BC',
      teal: '#009688',
      orange: '#FF5722',
      pink: '#E91E63',
    }
  },

  // Spacing scale
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  },

  // Typography
  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    
    // Font sizes
    fontSize: {
      xs: '12px',
      sm: '14px',
      md: '16px',
      lg: '18px',
      xl: '20px',
      xxl: '24px',
      xxxl: '32px',
    },
    
    // Font weights
    fontWeight: {
      regular: 400,
      medium: 500,
      bold: 700,
    },
    
    // Line heights
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      loose: 1.8,
    }
  },

  // Border radius
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    circle: '50%',
  },

  // Transitions
  transitions: {
    short: '0.15s ease',
    medium: '0.3s ease',
    long: '0.5s ease',
  },

  // Z-index scale
  zIndex: {
    base: 0,
    elevated: 1,
    dropdown: 1000,
    sticky: 1200,
    modal: 1500,
    toast: 2000,
  },

  // Breakpoints for responsive design
  breakpoints: {
    xs: '0px',
    sm: '600px',
    md: '960px',
    lg: '1280px',
    xl: '1920px',
  },
};

export type Theme = typeof theme;

// Type utilities for styled-components
export type ThemeColor = keyof typeof theme.colors;
export type ThemeSpacing = keyof typeof theme.spacing;
export type ThemeFontSize = keyof typeof theme.typography.fontSize;
export type ThemeBorderRadius = keyof typeof theme.borderRadius;
export type ThemeBreakpoint = keyof typeof theme.breakpoints;

export default theme;