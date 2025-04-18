import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigation } from "../../context/NavigationContext";

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

// Vordefinition der Styled Components, die in anderen Komponenten referenziert werden
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
  transition: all ${(props) => props.theme.transitions.short};

  @media (max-width: ${(props) => props.theme.breakpoints.md}) {
    transform: none;
  }
`;

// Erweiterte Props für die Section-Komponente
interface ExtendedSectionProps extends SectionProps {
  $isActiveSection: boolean;
}

// Section-Komponente, die jetzt SectionTitle referenzieren kann
const Section = styled.div<ExtendedSectionProps>`
  position: relative;
  display: flex;
  flex-direction: column;
  flex: ${(props) => (props.isActive ? 5 : 1)};
  min-width: 100px;
  min-height: 100px;
  /* Alle Sektionen bekommen die dunklere Hintergrundfarbe */
  background-color: ${(props) => props.theme.colors.background};
  border-radius: 0; /* Keine abgerundeten Ecken */
  margin: 0; /* Kein äußerer Abstand */
  cursor: pointer;
  overflow: hidden;
  box-shadow: none; /* Shadow entfernt */
  transition: background-color ${(props) => props.theme.transitions.short};

  /* Hover-Effekt NUR für inaktive Sektionen */
  ${(props) =>
    !props.$isActiveSection &&
    `
    &:hover {
      background-color: ${props.theme.colors.surface};
      
      /* Title-Effekt beim Hover */
      ${SectionTitle} {
        color: ${props.theme.colors.primary};
        transform: rotate(-90deg) scale(1.05);
      }
    }
  `}

  @media (max-width: ${(props) => props.theme.breakpoints.md}) {
    min-height: ${(props) => (props.isActive ? "80vh" : "10vh")};
    margin: 0; /* Kein äußerer Abstand auch auf Mobile */

    /* Angepasster Hover-Effekt für Mobile - NUR für inaktive Sektionen */
    ${(props) =>
      !props.$isActiveSection &&
      `
      &:hover {
        ${SectionTitle} {
          transform: scale(1.05); /* Keine Rotation auf Mobile */
        }
      }
    `}
  }
`;

// Weitere Styled Components
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

// Komponente für das Hauptlayout
const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  // State für die Animation und vorherigen Abschnitt
  const [previousSection, setPreviousSection] =
    useState<ActiveSection>("upload");
  const [isAnimating, setIsAnimating] = useState(false);

  // Navigation-Context verwenden
  const { activeSection, navigateTo } = useNavigation();

  // Effekt, um den vorherigen Abschnitt zu aktualisieren
  useEffect(() => {
    if (previousSection !== activeSection) {
      setPreviousSection(activeSection);
    }
  }, [activeSection, previousSection]);

  // Handler für Abschnittswechsel
  const handleSectionChange = (section: ActiveSection) => {
    if (section !== activeSection && !isAnimating) {
      setIsAnimating(true);
      setPreviousSection(activeSection);
      navigateTo(section);

      // Animation als beendet markieren nach Verzögerung
      setTimeout(() => {
        setIsAnimating(false);
      }, 500); // Entspricht der Animationsdauer
    }
  };

  // Bestimme die Animationsrichtung basierend auf vorherigem und aktuellem Bereich
  const getExitVariant = (current: ActiveSection, previous: ActiveSection) => {
    const sections: ActiveSection[] = ["upload", "search", "profile"];
    const currentIndex = sections.indexOf(current);
    const previousIndex = sections.indexOf(previous);

    return previousIndex > currentIndex ? "inactiveRight" : "inactiveLeft";
  };

  // Verbesserte Animations-Varianten für die Inhalte
  const contentVariants = {
    active: {
      opacity: 1,
      x: 0,
      transition: {
        delay: 0.2,
        duration: 0.3,
      },
    },
    inactiveLeft: {
      opacity: 0,
      x: -20,
      transition: {
        duration: 0.2,
      },
    },
    inactiveRight: {
      opacity: 0,
      x: 20,
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
        $isActiveSection={activeSection === "upload"}
      >
        <SectionContent>
          <AnimatePresence mode="wait">
            {activeSection === "upload" ? (
              <ContentWrapper
                key="upload-content"
                as={motion.div}
                initial={
                  previousSection === "search"
                    ? "inactiveLeft"
                    : "inactiveRight"
                }
                animate="active"
                exit={getExitVariant("upload", activeSection)}
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
        $isActiveSection={activeSection === "search"}
      >
        <SectionContent>
          <AnimatePresence mode="wait">
            {activeSection === "search" ? (
              <ContentWrapper
                key="search-content"
                as={motion.div}
                initial={
                  previousSection === "upload"
                    ? "inactiveRight"
                    : "inactiveLeft"
                }
                animate="active"
                exit={getExitVariant("search", activeSection)}
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
        $isActiveSection={activeSection === "profile"}
      >
        <SectionContent>
          <AnimatePresence mode="wait">
            {activeSection === "profile" ? (
              <ContentWrapper
                key="profile-content"
                as={motion.div}
                initial={
                  previousSection === "search"
                    ? "inactiveRight"
                    : "inactiveLeft"
                }
                animate="active"
                exit={getExitVariant("profile", activeSection)}
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

export default MainLayout;
