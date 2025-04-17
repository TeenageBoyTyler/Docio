# Leitfaden zur Integration der standardisierten Loading-Komponenten

Dieser Leitfaden beschreibt, wie du die standardisierten Loading-Komponenten in den verschiedenen Bereichen der Docio-Anwendung verwendest.

## Verfügbare Komponenten

Die folgenden Komponenten stehen im Verzeichnis `src/components/shared/loading` zur Verfügung:

1. **Spinner** - Eine kreisförmige Ladeanimation für generelle Ladezustände
2. **LoadingOverlay** - Ein Vollbild-Overlay für blockierende Prozesse
3. **LoadingText** - Text mit animierten Punkten
4. **SyncIndicator** - Statusanzeige für Cloud-Synchronisationsprozesse

## Import der Komponenten

```typescript
import { 
  Spinner, 
  LoadingOverlay, 
  LoadingText, 
  SyncIndicator,
  SyncStatus // Typ-Definition
} from '../shared/loading';
```

## Verwendung in verschiedenen Szenarien

### 1. Generelles Laden (Spinner)

Der Spinner ist die einfachste Ladeanimation und eignet sich für kleinere Ladezustände.

```tsx
// Einfacher Spinner
<Spinner />

// Verschiedene Größen
<Spinner size="small" />
<Spinner size="medium" /> // Standard
<Spinner size="large" />

// Mit Beschriftung
<Spinner showLabel labelText="Laden..." />

// Mit benutzerdefinierter Farbe
<Spinner color={theme.colors.secondary} />
```

### 2. Vollbild-Ladeprozesse (LoadingOverlay)

Das LoadingOverlay eignet sich für Prozesse, die den Benutzer am Interagieren hindern sollen.

```tsx
// Einfaches Overlay
const [isLoading, setIsLoading] = useState(false);

// In der Komponente:
<LoadingOverlay isVisible={isLoading} />

// Mit benutzerdefiniertem Text
<LoadingOverlay 
  isVisible={isProcessing}
  text="Deine Dokumente werden verarbeitet..."
/>

// Nicht-blockierendes Overlay (Benutzer kann weiterhin mit der UI interagieren)
<LoadingOverlay 
  isVisible={isUploading}
  blockInteraction={false}
  opacity={0.3}
/>

// Mit Callback nach dem Ausblenden
<LoadingOverlay 
  isVisible={isLoading}
  onAnimationComplete={() => console.log('Loading beendet')}
/>
```

### 3. Textbasierte Ladezustände (LoadingText)

Für subtile Hinweise auf laufende Prozesse, die wenig Platz benötigen.

```tsx
// Standard-Ladetext
<LoadingText />

// Benutzerdefinierter Text
<LoadingText text="Verarbeitung" />

// Angepasste Punkte-Animation
<LoadingText dotCount={5} interval={300} />

// Größen und Farben
<LoadingText size="small" />
<LoadingText size="medium" /> // Standard
<LoadingText size="large" />
<LoadingText color={theme.colors.primary} />
```

### 4. Cloud-Synchronisationsstatus (SyncIndicator)

Speziell für die Anzeige von Cloud-Synchronisationsprozessen.

```tsx
// Einfacher SyncIndicator
const [syncStatus, setSyncStatus] = useState<SyncStatus>("idle");

// In der Komponente:
<SyncIndicator status={syncStatus} />

// Mit Beschriftung
<SyncIndicator status="syncing" showLabel />

// Anzeigen auch im Idle-Zustand
<SyncIndicator status="idle" showWhenIdle showLabel />

// Benutzerdefinierte Beschriftungen
<SyncIndicator 
  status="syncing" 
  showLabel 
  customLabels={{
    syncing: "Synchronisiere mit Cloud...",
    success: "Synchronisierung abgeschlossen",
    error: "Fehler bei der Synchronisierung"
  }}
/>
```

## Integration mit dem SyncService

Der SyncIndicator kann direkt mit dem SyncService verbunden werden:

```tsx
import { useState, useEffect } from 'react';
import { syncService } from '../../services/syncService';
import { SyncIndicator, SyncStatus } from '../shared/loading';

const CloudStatusComponent: React.FC = () => {
  const [syncStatus, setSyncStatus] = useState<SyncStatus>("idle");
  
  useEffect(() => {
    // Abonniere den Sync-Status
    const handleSyncStateChange = (status: string) => {
      switch (status) {
        case 'inProgress':
          setSyncStatus('syncing');
          break;
        case 'completed':
          setSyncStatus('success');
          break;
        case 'failed':
          setSyncStatus('error');
          break;
        case 'offline':
          setSyncStatus('offline');
          break;
        default:
          setSyncStatus('idle');
      }
    };
    
    // Setze den initialen Status
    const isConnected = syncService.checkConnection();
    setSyncStatus(isConnected ? 'idle' : 'offline');
    
    // Starte Synchronisierung
    syncService.startBackgroundSync();
    
    // Cleanup
    return () => {
      syncService.stopBackgroundSync();
    };
  }, []);
  
  return (
    <div>
      <SyncIndicator 
        status={syncStatus} 
        showLabel 
        showWhenIdle
      />
    </div>
  );
};
```

## Verwendung in Button-Komponenten

Die Button-Komponenten unterstützen bereits einen Loading-Zustand:

```tsx
// Button mit Ladezustand
const [isSubmitting, setIsSubmitting] = useState(false);

const handleSubmit = async () => {
  setIsSubmitting(true);
  try {
    await saveData();
  } finally {
    setIsSubmitting(false);
  }
};

// In der Komponente:
<Button 
  onClick={handleSubmit}
  isLoading={isSubmitting}
>
  Speichern
</Button>
```

## Migrationsstrategie

Für die Migration bestehender Komponenten zu den standardisierten Loading-Komponenten folge diesen Schritten:

1. Identifiziere alle Ladezustände in deiner Komponente
2. Ersetze eigene Ladeanimationen durch die entsprechenden standardisierten Komponenten
3. Passe die Statusverwaltung an (z.B. für SyncIndicator)

### Beispiel: Migration einer Komponente

**Vorher:**
```tsx
// Eigene Ladeanimation
{isLoading && (
  <LoadingContainer>
    <RotatingIcon>
      <svg>...</svg>
    </RotatingIcon>
    <LoadingText>Daten werden geladen...</LoadingText>
  </LoadingContainer>
)}
```

**Nachher:**
```tsx
// Standardisierte Komponenten
{isLoading && (
  <LoadingContainer>
    <Spinner size="large" showLabel labelText="Daten werden geladen..." />
  </LoadingContainer>
)}

// Oder als Overlay
<LoadingOverlay 
  isVisible={isLoading}
  text="Daten werden geladen..."
/>
```

## Best Practices

1. **Konsistenz**: Verwende die gleichen Loading-Komponenten für ähnliche Prozesse in der gesamten Anwendung.
2. **Feedback**: Gib dem Benutzer immer Feedback über den aktuellen Status, besonders bei längeren Prozessen.
3. **Beschriftungen**: Verwende klare und aussagekräftige Beschriftungen, die den spezifischen Prozess beschreiben.
4. **Nicht-blockierend**: Verwende nicht-blockierende Ladeanzeigen, wo immer möglich, um die Benutzerfreundlichkeit zu verbessern.
5. **Theme-Integration**: Nutze die Theme-Farben für konsistente Farbgebung.

---

Bei Fragen zur Integration oder Anpassung der Loading-Komponenten wende dich an das UI-Team.