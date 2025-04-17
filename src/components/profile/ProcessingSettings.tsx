import React, { useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import {
  useProfile,
  ProfileView,
  ApiConfig,
} from "../../context/ProfileContext";
import { Button } from "../shared/buttons";
import { RadioButton, PasswordField, Checkbox } from "../shared/inputs";

interface ProcessingSettingsProps {
  onNavigate: (view: ProfileView) => void;
}

const ProcessingSettings: React.FC<ProcessingSettingsProps> = ({
  onNavigate,
}) => {
  const {
    processingMethod,
    setProcessingMethod,
    apiConfigs,
    updateApiConfig,
    testApiConnection,
    isLoading,
  } = useProfile();

  // State für Formular-Felder
  const [apiKeys, setApiKeys] = useState<Record<string, string>>(
    apiConfigs.reduce(
      (acc, config) => ({
        ...acc,
        [config.provider]: config.apiKey,
      }),
      {}
    )
  );

  // State für loading-Zustände bei API-Tests
  const [testingApi, setTestingApi] = useState<Record<string, boolean>>({
    clarifai: false,
    google: false,
    ocrspace: false,
  });

  // Handler für Änderung der Verarbeitungsmethode
  const handleProcessingMethodChange = (method: "client-side" | "api") => {
    setProcessingMethod(method);
  };

  // Handler für Änderung eines API-Schlüssels
  const handleApiKeyChange = (provider: string, value: string) => {
    setApiKeys((prev) => ({
      ...prev,
      [provider]: value,
    }));
  };

  // Handler für das Speichern eines API-Schlüssels
  const handleSaveApiKey = async (provider: string) => {
    const apiKey = apiKeys[provider] || "";
    await updateApiConfig(provider, apiKey, apiKey.length > 0);
  };

  // Handler für das Testen einer API-Verbindung
  const handleTestApiConnection = async (provider: string) => {
    setTestingApi((prev) => ({
      ...prev,
      [provider]: true,
    }));

    try {
      await testApiConnection(provider);
    } finally {
      setTestingApi((prev) => ({
        ...prev,
        [provider]: false,
      }));
    }
  };

  // Finde eine Konfiguration nach Provider
  const getApiConfig = (provider: string): ApiConfig | undefined => {
    return apiConfigs.find((config) => config.provider === provider);
  };

  // Rendere Vorteile für jede Verarbeitungsmethode
  const renderProcessingBenefits = (method: "client-side" | "api") => {
    if (method === "client-side") {
      return (
        <BenefitsList>
          <BenefitItem>
            <BenefitIcon>✓</BenefitIcon>
            <BenefitText>Works immediately without setup</BenefitText>
          </BenefitItem>
          <BenefitItem>
            <BenefitIcon>✓</BenefitIcon>
            <BenefitText>
              All processing happens locally in your browser
            </BenefitText>
          </BenefitItem>
          <BenefitItem>
            <BenefitIcon>✓</BenefitIcon>
            <BenefitText>No data sent to external services</BenefitText>
          </BenefitItem>
          <BenefitItem>
            <BenefitIcon>✕</BenefitIcon>
            <BenefitText>Basic OCR accuracy and image recognition</BenefitText>
          </BenefitItem>
        </BenefitsList>
      );
    } else {
      return (
        <BenefitsList>
          <BenefitItem>
            <BenefitIcon>✓</BenefitIcon>
            <BenefitText>Enhanced OCR accuracy and text extraction</BenefitText>
          </BenefitItem>
          <BenefitItem>
            <BenefitIcon>✓</BenefitIcon>
            <BenefitText>Advanced image recognition capabilities</BenefitText>
          </BenefitItem>
          <BenefitItem>
            <BenefitIcon>✓</BenefitIcon>
            <BenefitText>Faster processing for large documents</BenefitText>
          </BenefitItem>
          <BenefitItem>
            <BenefitIcon>✕</BenefitIcon>
            <BenefitText>Requires API key setup</BenefitText>
          </BenefitItem>
        </BenefitsList>
      );
    }
  };

  // Rendere API-Einstellungen für jeden Provider
  const renderApiSettings = () => {
    const providers = [
      {
        id: "clarifai",
        name: "Clarifai API",
        description: "Unified OCR and image recognition with AI capabilities.",
        website: "https://www.clarifai.com/",
      },
      {
        id: "google",
        name: "Google Cloud Vision",
        description: "Advanced OCR and image recognition from Google Cloud.",
        website: "https://cloud.google.com/vision",
      },
      {
        id: "ocrspace",
        name: "OCR Space",
        description: "Simple OCR API with good accuracy for text documents.",
        website: "https://ocr.space/",
      },
    ];

    return (
      <ApiSettingsContainer>
        {providers.map((provider) => {
          const config = getApiConfig(provider.id);
          const isActive = config?.isActive || false;

          return (
            <ApiCard key={provider.id}>
              <ApiCardHeader>
                <ApiName>{provider.name}</ApiName>
                <ApiStatus isActive={isActive}>
                  {isActive ? "Active" : "Inactive"}
                </ApiStatus>
              </ApiCardHeader>

              <ApiDescription>{provider.description}</ApiDescription>

              {/* Ersetzen des standard inputs mit PasswordField */}
              <PasswordField
                label={`${provider.name} API Key`}
                value={apiKeys[provider.id] || ""}
                onChange={(e) =>
                  handleApiKeyChange(provider.id, e.target.value)
                }
                placeholder={`Enter ${provider.name} API key`}
                fullWidth
              />

              <ApiCardActions>
                <ApiLink
                  href={provider.website}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Get API Key
                </ApiLink>

                <ApiButtonsContainer>
                  <TestButton
                    onClick={() => handleTestApiConnection(provider.id)}
                    disabled={!apiKeys[provider.id] || testingApi[provider.id]}
                  >
                    {testingApi[provider.id] ? "Testing..." : "Test Connection"}
                  </TestButton>

                  <SaveButton
                    onClick={() => handleSaveApiKey(provider.id)}
                    disabled={
                      config?.apiKey === apiKeys[provider.id] ||
                      isLoading ||
                      testingApi[provider.id]
                    }
                  >
                    Save
                  </SaveButton>
                </ApiButtonsContainer>
              </ApiCardActions>
            </ApiCard>
          );
        })}
      </ApiSettingsContainer>
    );
  };

  return (
    <Container>
      <Header>
        <BackButton onClick={() => onNavigate("home")}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5" />
            <path d="M12 19l-7-7 7-7" />
          </svg>
          <BackButtonText>Back to Profile</BackButtonText>
        </BackButton>
        <Title>Processing Settings</Title>
      </Header>

      <SettingsSection>
        <SectionTitle>Processing Method</SectionTitle>
        <SectionDescription>
          Choose how your documents are processed for OCR text extraction and
          image recognition.
        </SectionDescription>

        <ProcessingOptions>
          <ProcessingOption
            isActive={processingMethod === "client-side"}
            isStatic={true}
          >
            <ProcessingOptionHeader>
              <ProcessingOptionTitle>
                Client-side Processing
              </ProcessingOptionTitle>
              <ProcessingOptionIcon>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
                  <rect x="9" y="9" width="6" height="6"></rect>
                  <line x1="9" y1="2" x2="9" y2="4"></line>
                  <line x1="15" y1="2" x2="15" y2="4"></line>
                  <line x1="9" y1="20" x2="9" y2="22"></line>
                  <line x1="15" y1="20" x2="15" y2="22"></line>
                  <line x1="20" y1="9" x2="22" y2="9"></line>
                  <line x1="20" y1="14" x2="22" y2="14"></line>
                  <line x1="2" y1="9" x2="4" y2="9"></line>
                  <line x1="2" y1="14" x2="4" y2="14"></line>
                </svg>
              </ProcessingOptionIcon>
            </ProcessingOptionHeader>

            <ProcessingOptionDescription>
              Uses your browser to process documents. Works immediately without
              setup.
            </ProcessingOptionDescription>

            {renderProcessingBenefits("client-side")}

            {/* Hier die standardisierte RadioButton-Komponente verwenden */}
            <div onClick={() => handleProcessingMethodChange("client-side")}>
              <RadioButton
                name="processingMethod"
                value="client-side"
                checked={processingMethod === "client-side"}
                onChange={() => handleProcessingMethodChange("client-side")}
                label="Use client-side processing"
              />
            </div>

            <ActiveIndicator isActive={processingMethod === "client-side"}>
              {processingMethod === "client-side" && "Currently Active"}
            </ActiveIndicator>
          </ProcessingOption>

          <ProcessingOption
            isActive={processingMethod === "api"}
            isStatic={true}
          >
            <ProcessingOptionHeader>
              <ProcessingOptionTitle>
                Enhanced API Processing
              </ProcessingOptionTitle>
              <ProcessingOptionIcon>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 10h-4V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v6H2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2z"></path>
                </svg>
              </ProcessingOptionIcon>
            </ProcessingOptionHeader>

            <ProcessingOptionDescription>
              Uses external APIs for improved accuracy. Requires API key setup.
            </ProcessingOptionDescription>

            {renderProcessingBenefits("api")}

            {/* Hier die standardisierte RadioButton-Komponente verwenden */}
            <div onClick={() => handleProcessingMethodChange("api")}>
              <RadioButton
                name="processingMethod"
                value="api"
                checked={processingMethod === "api"}
                onChange={() => handleProcessingMethodChange("api")}
                label="Use API processing"
              />
            </div>

            <ActiveIndicator isActive={processingMethod === "api"}>
              {processingMethod === "api" && "Currently Active"}
            </ActiveIndicator>
          </ProcessingOption>
        </ProcessingOptions>
      </SettingsSection>

      <SettingsSection>
        <SectionTitle>API Configuration</SectionTitle>
        <SectionDescription>
          Configure your API keys for enhanced document processing. At least one
          API must be configured to use Enhanced API Processing.
        </SectionDescription>

        {renderApiSettings()}
      </SettingsSection>

      <AdvancedOptionsSection>
        <SectionTitle>Advanced Options</SectionTitle>

        <CheckboxGroup>
          <Checkbox
            label="Enable OCR for all documents"
            helperText="Automatically perform text extraction on all documents"
          />

          <Checkbox
            label="Enable image analysis for all documents"
            helperText="Automatically identify objects and concepts in images"
          />

          <Checkbox
            label="Cache processing results"
            helperText="Store processed documents locally for faster results"
            checked={true}
          />
        </CheckboxGroup>
      </AdvancedOptionsSection>

      <ResetSection>
        <ResetButton>Reset to Default Settings</ResetButton>
        <ResetDescription>
          This will reset all processing settings to their default values. Your
          documents and tags will not be affected.
        </ResetDescription>
      </ResetSection>
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: ${(props) => props.theme.spacing.lg};
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => props.theme.colors.text.primary};
  margin-right: ${(props) => props.theme.spacing.md};
  padding: ${(props) => props.theme.spacing.xs}
    ${(props) => props.theme.spacing.sm};
  border-radius: ${(props) => props.theme.borderRadius.md};

  &:hover {
    background-color: ${(props) => props.theme.colors.background};
  }
`;

const BackButtonText = styled.span`
  margin-left: ${(props) => props.theme.spacing.xs};
  font-size: ${(props) => props.theme.typography.fontSize.sm};
`;

const Title = styled.h2`
  font-size: ${(props) => props.theme.typography.fontSize.xl};
  font-weight: ${(props) => props.theme.typography.fontWeight.bold};
  color: ${(props) => props.theme.colors.text.primary};
`;

const SettingsSection = styled.section`
  margin-bottom: ${(props) => props.theme.spacing.xl};
`;

const SectionTitle = styled.h3`
  font-size: ${(props) => props.theme.typography.fontSize.lg};
  font-weight: ${(props) => props.theme.typography.fontWeight.bold};
  color: ${(props) => props.theme.colors.text.primary};
  margin-bottom: ${(props) => props.theme.spacing.sm};
`;

const SectionDescription = styled.p`
  font-size: ${(props) => props.theme.typography.fontSize.md};
  color: ${(props) => props.theme.colors.text.secondary};
  margin-bottom: ${(props) => props.theme.spacing.lg};
`;

const ProcessingOptions = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${(props) => props.theme.spacing.lg};

  @media (max-width: ${(props) => props.theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

interface ProcessingOptionProps {
  isActive: boolean;
  isStatic: boolean;
}

const ProcessingOption = styled.div<ProcessingOptionProps>`
  display: flex;
  flex-direction: column;
  background-color: ${(props) => props.theme.colors.surface};
  border-radius: ${(props) => props.theme.borderRadius.md};
  padding: ${(props) => props.theme.spacing.lg};
  border: 2px solid
    ${(props) => (props.isActive ? props.theme.colors.primary : "transparent")};
  transition: border-color ${(props) => props.theme.transitions.short};
`;

const ProcessingOptionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${(props) => props.theme.spacing.md};
`;

const ProcessingOptionTitle = styled.h4`
  font-size: ${(props) => props.theme.typography.fontSize.md};
  font-weight: ${(props) => props.theme.typography.fontWeight.bold};
  color: ${(props) => props.theme.colors.text.primary};
`;

const ProcessingOptionIcon = styled.div`
  color: ${(props) => props.theme.colors.primary};
`;

const ProcessingOptionDescription = styled.p`
  font-size: ${(props) => props.theme.typography.fontSize.sm};
  color: ${(props) => props.theme.colors.text.secondary};
  margin-bottom: ${(props) => props.theme.spacing.md};
`;

const BenefitsList = styled.ul`
  list-style: none;
  padding: 0;
  margin-bottom: ${(props) => props.theme.spacing.md};
`;

const BenefitItem = styled.li`
  display: flex;
  align-items: center;
  margin-bottom: ${(props) => props.theme.spacing.sm};
`;

const BenefitIcon = styled.span`
  margin-right: ${(props) => props.theme.spacing.sm};
  color: ${(props) => props.theme.colors.primary};
  font-weight: ${(props) => props.theme.typography.fontWeight.bold};
`;

const BenefitText = styled.span`
  font-size: ${(props) => props.theme.typography.fontSize.sm};
  color: ${(props) => props.theme.colors.text.secondary};
`;

interface ActiveIndicatorProps {
  isActive: boolean;
}

const ActiveIndicator = styled.div<ActiveIndicatorProps>`
  margin-top: auto;
  padding-top: ${(props) => props.theme.spacing.md};
  font-size: ${(props) => props.theme.typography.fontSize.sm};
  font-weight: ${(props) => props.theme.typography.fontWeight.medium};
  color: ${(props) => props.theme.colors.primary};
  opacity: ${(props) => (props.isActive ? 1 : 0)};
`;

const ApiSettingsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spacing.lg};
`;

const ApiCard = styled.div`
  background-color: ${(props) => props.theme.colors.surface};
  border-radius: ${(props) => props.theme.borderRadius.md};
  padding: ${(props) => props.theme.spacing.lg};
`;

const ApiCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${(props) => props.theme.spacing.sm};
`;

const ApiName = styled.h4`
  font-size: ${(props) => props.theme.typography.fontSize.md};
  font-weight: ${(props) => props.theme.typography.fontWeight.bold};
  color: ${(props) => props.theme.colors.text.primary};
`;

interface ApiStatusProps {
  isActive: boolean;
}

const ApiStatus = styled.div<ApiStatusProps>`
  font-size: ${(props) => props.theme.typography.fontSize.sm};
  font-weight: ${(props) => props.theme.typography.fontWeight.medium};
  color: ${(props) =>
    props.isActive
      ? props.theme.colors.success
      : props.theme.colors.text.secondary};
`;

const ApiDescription = styled.p`
  font-size: ${(props) => props.theme.typography.fontSize.sm};
  color: ${(props) => props.theme.colors.text.secondary};
  margin-bottom: ${(props) => props.theme.spacing.md};
`;

const ApiCardActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: ${(props) => props.theme.spacing.md};
  margin-top: ${(props) => props.theme.spacing.md};
`;

const ApiLink = styled.a`
  font-size: ${(props) => props.theme.typography.fontSize.sm};
  color: ${(props) => props.theme.colors.primary};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const ApiButtonsContainer = styled.div`
  display: flex;
  gap: ${(props) => props.theme.spacing.md};
`;

const TestButton = styled.button`
  padding: ${(props) => props.theme.spacing.sm}
    ${(props) => props.theme.spacing.md};
  border-radius: ${(props) => props.theme.borderRadius.md};
  font-size: ${(props) => props.theme.typography.fontSize.sm};
  font-weight: ${(props) => props.theme.typography.fontWeight.medium};
  background-color: ${(props) => props.theme.colors.surface};
  color: ${(props) => props.theme.colors.text.primary};
  border: 1px solid ${(props) => props.theme.colors.divider};
  transition: all ${(props) => props.theme.transitions.short};

  &:hover:not(:disabled) {
    background-color: ${(props) => props.theme.colors.background};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const SaveButton = styled.button`
  padding: ${(props) => props.theme.spacing.sm}
    ${(props) => props.theme.spacing.md};
  border-radius: ${(props) => props.theme.borderRadius.md};
  font-size: ${(props) => props.theme.typography.fontSize.sm};
  font-weight: ${(props) => props.theme.typography.fontWeight.medium};
  background-color: ${(props) => props.theme.colors.primary};
  color: ${(props) => props.theme.colors.background};
  transition: all ${(props) => props.theme.transitions.short};

  &:hover:not(:disabled) {
    background-color: ${(props) =>
      props.theme.colors.primary}CC; /* 80% opacity */
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const AdvancedOptionsSection = styled.section`
  margin-bottom: ${(props) => props.theme.spacing.xl};
  background-color: ${(props) => props.theme.colors.surface};
  border-radius: ${(props) => props.theme.borderRadius.md};
  padding: ${(props) => props.theme.spacing.lg};
`;

const CheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spacing.md};
`;

const ResetSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-top: ${(props) => props.theme.spacing.xl};
  padding-top: ${(props) => props.theme.spacing.lg};
  border-top: 1px solid ${(props) => props.theme.colors.divider};
`;

const ResetButton = styled.button`
  padding: ${(props) => props.theme.spacing.sm}
    ${(props) => props.theme.spacing.lg};
  border-radius: ${(props) => props.theme.borderRadius.md};
  font-size: ${(props) => props.theme.typography.fontSize.sm};
  font-weight: ${(props) => props.theme.typography.fontWeight.medium};
  color: ${(props) => props.theme.colors.error};
  border: 1px solid ${(props) => props.theme.colors.error};
  background-color: transparent;
  transition: all ${(props) => props.theme.transitions.short};
  margin-bottom: ${(props) => props.theme.spacing.sm};

  &:hover {
    background-color: ${(props) =>
      props.theme.colors.error}20; /* 10% opacity */
  }
`;

const ResetDescription = styled.p`
  font-size: ${(props) => props.theme.typography.fontSize.sm};
  color: ${(props) => props.theme.colors.text.secondary};
`;

export default ProcessingSettings;
