import React, { useState } from "react";
import styled from "styled-components";
import { Button } from "../shared/buttons";
import {
  Spinner,
  LoadingOverlay,
  LoadingText,
  SyncIndicator,
  SyncStatus,
} from "../shared/loading";

/**
 * Demo-Komponente zur Demonstration der Loading-Komponenten
 *
 * Diese Komponente zeigt die verschiedenen Loading-States und deren Verwendung.
 * Sie dient Entwicklern als Referenz und kann für Tests verwendet werden.
 */
const LoadingDemo: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>("idle");

  // Zeige Loading-Overlay für 3 Sekunden
  const handleShowOverlay = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  };

  // Durchlaufe Sync-Zustände
  const handleStartSync = () => {
    setSyncStatus("syncing");

    // Nach 2 Sekunden erfolgreicher Abschluss oder Fehler (zufällig)
    setTimeout(() => {
      const success = Math.random() > 0.3;
      setSyncStatus(success ? "success" : "error");

      // Zurück zu Idle nach weiteren 2 Sekunden
      setTimeout(() => {
        setSyncStatus("idle");
      }, 2000);
    }, 2000);
  };

  // Setze Offline-Status
  const handleToggleOffline = () => {
    setSyncStatus(syncStatus === "offline" ? "idle" : "offline");
  };

  return (
    <Container>
      <Title>Loading Components Demo</Title>

      <Section>
        <SectionTitle>Spinner</SectionTitle>
        <ComponentRow>
          <Spinner size="small" />
          <Spinner size="medium" />
          <Spinner size="large" />
        </ComponentRow>
        <ComponentRow>
          <Spinner size="medium" showLabel />
          <Spinner size="medium" showLabel labelText="Processing..." />
          <Spinner
            size="medium"
            color="#ff5722"
            showLabel
            labelText="Custom Color"
          />
        </ComponentRow>
      </Section>

      <Section>
        <SectionTitle>Loading Text</SectionTitle>
        <ComponentRow>
          <LoadingText size="small" />
          <LoadingText size="medium" />
          <LoadingText size="large" />
        </ComponentRow>
        <ComponentRow>
          <LoadingText text="Processing" />
          <LoadingText text="Uploading" dotCount={5} interval={200} />
          <LoadingText text="Custom" color="#ff5722" />
        </ComponentRow>
      </Section>

      <Section>
        <SectionTitle>Sync Indicator</SectionTitle>
        <ComponentRow>
          <SyncIndicator status="idle" showWhenIdle />
          <SyncIndicator status="syncing" />
          <SyncIndicator status="success" />
          <SyncIndicator status="error" />
          <SyncIndicator status="offline" />
        </ComponentRow>
        <ComponentRow>
          <SyncIndicator status="idle" showWhenIdle showLabel />
          <SyncIndicator status="syncing" showLabel />
          <SyncIndicator status="success" showLabel />
          <SyncIndicator status="error" showLabel />
          <SyncIndicator status="offline" showLabel />
        </ComponentRow>
        <ComponentRow>
          <SyncIndicator
            status={syncStatus}
            showLabel
            showWhenIdle
            customLabels={{
              syncing: "Saving data...",
              success: "Data saved!",
              error: "Save failed",
            }}
          />
          <div>
            <Button onClick={handleStartSync} variant="primary" size="small">
              Start Sync
            </Button>
            <Button onClick={handleToggleOffline} variant="text" size="small">
              Toggle Offline
            </Button>
          </div>
        </ComponentRow>
      </Section>

      <Section>
        <SectionTitle>Loading Overlay</SectionTitle>
        <ComponentRow>
          <Button onClick={handleShowOverlay} variant="primary">
            Show Loading Overlay
          </Button>
        </ComponentRow>
      </Section>

      <Section>
        <SectionTitle>Button with Loading State</SectionTitle>
        <ComponentRow>
          <Button
            variant="primary"
            isLoading={isLoading}
            onClick={handleShowOverlay}
          >
            Submit Form
          </Button>

          <Button
            variant="primary"
            isLoading={isLoading}
            onClick={handleShowOverlay}
            startIcon={
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm0 2v14h14V5H5zm2 2h10v2H7V7zm0 4h10v2H7v-2zm0 4h7v2H7v-2z"
                />
              </svg>
            }
          >
            Save Document
          </Button>

          <Button
            variant="text"
            isLoading={isLoading}
            onClick={handleShowOverlay}
          >
            Load More
          </Button>
        </ComponentRow>
      </Section>

      {/* Loading-Overlay wird angezeigt, wenn isLoading true ist */}
      <LoadingOverlay
        isVisible={isLoading}
        text="Please wait while we process your request..."
      />
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  padding: ${(props) => props.theme.spacing.xl};
  max-width: 800px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: ${(props) => props.theme.typography.fontSize.xxxl};
  color: ${(props) => props.theme.colors.text.primary};
  margin-bottom: ${(props) => props.theme.spacing.xl};
  text-align: center;
`;

const Section = styled.section`
  margin-bottom: ${(props) => props.theme.spacing.xl};
  padding: ${(props) => props.theme.spacing.lg};
  background-color: ${(props) => props.theme.colors.surface};
  border-radius: ${(props) => props.theme.borderRadius.md};
`;

const SectionTitle = styled.h2`
  font-size: ${(props) => props.theme.typography.fontSize.xl};
  color: ${(props) => props.theme.colors.text.primary};
  margin-bottom: ${(props) => props.theme.spacing.lg};
  border-bottom: 1px solid ${(props) => props.theme.colors.divider};
  padding-bottom: ${(props) => props.theme.spacing.sm};
`;

const ComponentRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${(props) => props.theme.spacing.xl};
  margin-bottom: ${(props) => props.theme.spacing.lg};

  &:last-child {
    margin-bottom: 0;
  }

  @media (max-width: ${(props) => props.theme.breakpoints.md}) {
    flex-direction: column;
    align-items: flex-start;
    gap: ${(props) => props.theme.spacing.md};
  }
`;

export default LoadingDemo;
