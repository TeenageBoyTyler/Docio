import 'styled-components';
import { Theme } from '../styles/theme';

// Erweitere die DefaultTheme-Schnittstelle, um unsere Theme-Struktur zu unterstützen
declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}