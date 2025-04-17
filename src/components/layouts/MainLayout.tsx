import React, { useState } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";

// Import der Sektionskomponenten
import UploadSectionWrapper from "../upload/UploadSection";
import SearchSection from "../search/SearchSection";
import ProfileSection from "../profile/ProfileSection";

// Definiere die möglichen aktiven Abschnitte
export type ActiveSection = "upload" | "search" | "profile";

// Props für das Layout
interface MainLayoutProps {
  children?: React.ReactNode;
}

// Props für die Abschnitte
interface SectionProps {
  isActive: boolean;
}

// Komponente für das Hauptlayout
const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  // State für den aktiven Abschnitt
  const [activeSection, setActiveSection] = useState<ActiveSection>("upload");
  // State für den zuletzt aktiven Abschnitt (für Animationsverzögerung)
  const [previousSection, setPreviousSection] =
    useState<ActiveSection>("upload");
  // State für Animation in Fortschritt
  const [isAnimating, setIsAnimating] = useState(false);

  // Handler für Abschnittswechsel
  const handleSectionChange = (section: ActiveSection) => {
    if (section !== activeSection && !isAnimating) {
      setIsAnimating(true);
      setPreviousSection(activeSection);
      setActiveSection(section);

      // Animation als beendet markieren nach Verzögerung
      setTimeout(() => {
        setIsAnimating(false);
      }, 500); // Entspricht der Animationsdauer
    }
  };

  // Animations-Varianten für die Inhalte
  const contentVariants = {
    active: {
      opacity: 1,
      transition: {
        delay: 0.2,
        duration: 0.3,
      },
    },
    inactive: {
      opacity: 0,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <LayoutContainer>
      {/* Hauptsektionen */}
      <Section
        isActive={activeSection === "upload"}
        onClick={() => handleSectionChange("upload")}
        as={motion.div}
        animate={{
          flex: activeSection === "upload" ? 5 : 1,
        }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <SectionContent>
          <AnimatePresence mode="wait">
            {activeSection === "upload" ? (
              <ContentWrapper
                key="upload-content"
                as={motion.div}
                initial="inactive"
                animate="active"
                exit="inactive"
                variants={contentVariants}
              >
                <UploadSectionWrapper />
              </ContentWrapper>
            ) : (
              <TitleWrapper
                key="upload-title"
                as={motion.div}
                initial="inactive"
                animate="active"
                exit="inactive"
                variants={contentVariants}
              >
                <SectionTitle>Upload</SectionTitle>
              </TitleWrapper>
            )}
          </AnimatePresence>
        </SectionContent>
      </Section>

      <Section
        isActive={activeSection === "search"}
        onClick={() => handleSectionChange("search")}
        as={motion.div}
        animate={{
          flex: activeSection === "search" ? 5 : 1,
        }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <SectionContent>
          <AnimatePresence mode="wait">
            {activeSection === "search" ? (
              <ContentWrapper
                key="search-content"
                as={motion.div}
                initial="inactive"
                animate="active"
                exit="inactive"
                variants={contentVariants}
              >
                <SearchSection />
              </ContentWrapper>
            ) : (
              <TitleWrapper
                key="search-title"
                as={motion.div}
                initial="inactive"
                animate="active"
                exit="inactive"
                variants={contentVariants}
              >
                <SectionTitle>Search</SectionTitle>
              </TitleWrapper>
            )}
          </AnimatePresence>
        </SectionContent>
      </Section>

      <Section
        isActive={activeSection === "profile"}
        onClick={() => handleSectionChange("profile")}
        as={motion.div}
        animate={{
          flex: activeSection === "profile" ? 5 : 1,
        }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <SectionContent>
          <AnimatePresence mode="wait">
            {activeSection === "profile" ? (
              <ContentWrapper
                key="profile-content"
                as={motion.div}
                initial="inactive"
                animate="active"
                exit="inactive"
                variants={contentVariants}
              >
                <ProfileSection />
              </ContentWrapper>
            ) : (
              <TitleWrapper
                key="profile-title"
                as={motion.div}
                initial="inactive"
                animate="active"
                exit="inactive"
                variants={contentVariants}
              >
                <SectionTitle>Profile</SectionTitle>
              </TitleWrapper>
            )}
          </AnimatePresence>
        </SectionContent>
      </Section>
    </LayoutContainer>
  );
};

// Styled Components
const LayoutContainer = styled.div`
  display: flex;
  flex-direction: row;
  height: 100vh;
  width: 100%;
  background-color: ${(props) => props.theme.colors.background};
  overflow: hidden;
  gap: 2px; /* Minimaler Abstand zwischen den Abschnitten */

  @media (max-width: ${(props) => props.theme.breakpoints.md}) {
    flex-direction: column;
  }
`;

const Section = styled.div<SectionProps>`
  position: relative;
  display: flex;
  flex-direction: column;
  flex: ${(props) => (props.isActive ? 5 : 1)};
  min-width: 100px;
  min-height: 100px;
  background-color: ${(props) => props.theme.colors.surface};
  border-radius: 0; /* Keine abgerundeten Ecken */
  margin: 0; /* Kein äußerer Abstand */
  cursor: pointer;
  overflow: hidden;
  box-shadow: none; /* Shadow entfernt */

  @media (max-width: ${(props) => props.theme.breakpoints.md}) {
    min-height: ${(props) => (props.isActive ? "80vh" : "10vh")};
    margin: 0; /* Kein äußerer Abstand auch auf Mobile */
  }
`;

const SectionContent = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const ContentWrapper = styled(motion.div)`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const TitleWrapper = styled(motion.div)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
`;

const SectionTitle = styled.h2`
  color: ${(props) => props.theme.colors.text.primary};
  font-size: ${(props) => props.theme.typography.fontSize.xl};
  font-weight: ${(props) => props.theme.typography.fontWeight.medium};
  transform: rotate(-90deg);
  white-space: nowrap;

  @media (max-width: ${(props) => props.theme.breakpoints.md}) {
    transform: none;
  }
`;

export default MainLayout;
