import React, { useState } from "react";
import styled from "styled-components";
import {
  TextField,
  PasswordField,
  SearchField,
  Dropdown,
  Checkbox,
  RadioButton,
  MultiSelect,
  FilterChip,
  ColorPicker,
} from "../shared/inputs";

/**
 * Demo component for all input components
 */
const InputDemo: React.FC = () => {
  // State for text input
  const [textValue, setTextValue] = useState("");

  // State for password input
  const [passwordValue, setPasswordValue] = useState("");

  // State for search input
  const [searchValue, setSearchValue] = useState("");
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [activeFilters, setActiveFilters] = useState(0);

  // State for dropdown
  const [dropdownValue, setDropdownValue] = useState<string | number>("");

  // State for checkboxes
  const [checkbox1, setCheckbox1] = useState(false);
  const [checkbox2, setCheckbox2] = useState(true);
  const [indeterminateCheckbox, setIndeterminateCheckbox] = useState(false);

  // State for radio buttons
  const [radioValue, setRadioValue] = useState("option1");

  // State for multi-select
  const [multiSelectValue, setMultiSelectValue] = useState<(string | number)[]>(
    []
  );

  // State for color picker
  const [selectedColor, setSelectedColor] = useState<string>("#6366F1");

  // Mock search function
  const handleSearch = () => {
    setIsSearchLoading(true);
    setTimeout(() => {
      setIsSearchLoading(false);
    }, 1500);
  };

  // Mock filter toggle
  const handleFilterToggle = () => {
    setActiveFilters((prev) => (prev === 0 ? 2 : 0));
  };

  // Demo data for dropdowns and multi-select
  const options = [
    { value: "option1", label: "Option 1" },
    { value: "option2", label: "Option 2" },
    { value: "option3", label: "Option 3" },
    { value: "option4", label: "Option 4" },
    { value: "option5", label: "Option 5", disabled: true },
  ];

  // Demo data for filter chips
  const filterChips = [
    { id: "1", label: "Image" },
    { id: "2", label: "Document" },
    { id: "3", label: "Receipt", color: "green" },
    { id: "4", label: "Invoice", color: "blue" },
    { id: "5", label: "Contract", color: "red" },
  ];

  // Demo data for color picker
  const colorOptions = [
    { id: "1", value: "#6366F1", label: "Indigo" },
    { id: "2", value: "#4ADE80", label: "Green" },
    { id: "3", value: "#F43F5E", label: "Red" },
    { id: "4", value: "#3B82F6", label: "Blue" },
    { id: "5", value: "#FACC15", label: "Yellow" },
    { id: "6", value: "#EC4899", label: "Pink" },
    { id: "7", value: "#8B5CF6", label: "Purple" },
    { id: "8", value: "#10B981", label: "Emerald" },
    { id: "9", value: "#F97316", label: "Orange" },
    { id: "10", value: "#06B6D4", label: "Cyan" },
  ];

  return (
    <DemoContainer>
      <h1>Input Components Demo</h1>

      <Section>
        <SectionTitle>Text Fields</SectionTitle>
        <ComponentGrid>
          <DemoItem>
            <Label>Default TextField</Label>
            <TextField
              label="Standard Text Field"
              placeholder="Enter text..."
              value={textValue}
              onChange={(e) => setTextValue(e.target.value)}
            />
          </DemoItem>

          <DemoItem>
            <Label>With Helper Text</Label>
            <TextField
              label="With Helper Text"
              placeholder="Enter text..."
              helperText="This is a helper text"
            />
          </DemoItem>

          <DemoItem>
            <Label>With Error</Label>
            <TextField
              label="With Error"
              placeholder="Enter text..."
              error="This field has an error"
            />
          </DemoItem>

          <DemoItem>
            <Label>With Icons</Label>
            <TextField
              label="With Icons"
              placeholder="With icons..."
              startIcon={<IconPlaceholder>S</IconPlaceholder>}
              endIcon={<IconPlaceholder>E</IconPlaceholder>}
            />
          </DemoItem>

          <DemoItem>
            <Label>Disabled</Label>
            <TextField
              label="Disabled Field"
              placeholder="Disabled field"
              disabled
              value="Can't edit this"
            />
          </DemoItem>

          <DemoItem>
            <Label>Size Variants</Label>
            <TextField label="Small" placeholder="Small input" size="small" />
            <SpacerSmall />
            <TextField label="Medium (default)" placeholder="Medium input" />
            <SpacerSmall />
            <TextField label="Large" placeholder="Large input" size="large" />
          </DemoItem>
        </ComponentGrid>
      </Section>

      <Section>
        <SectionTitle>Password Field</SectionTitle>
        <ComponentGrid>
          <DemoItem>
            <Label>Default Password Field</Label>
            <PasswordField
              label="Password"
              placeholder="Enter password..."
              value={passwordValue}
              onChange={(e) => setPasswordValue(e.target.value)}
            />
          </DemoItem>

          <DemoItem>
            <Label>Without Toggle</Label>
            <PasswordField
              label="Password (No Toggle)"
              placeholder="Enter password..."
              showToggle={false}
            />
          </DemoItem>

          <DemoItem>
            <Label>With Error</Label>
            <PasswordField
              label="Password"
              placeholder="Enter password..."
              error="Password is too weak"
            />
          </DemoItem>
        </ComponentGrid>
      </Section>

      <Section>
        <SectionTitle>Search Field</SectionTitle>
        <ComponentGrid>
          <DemoItem>
            <Label>Default Search Field</Label>
            <SearchField
              placeholder="Search..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onClear={() => setSearchValue("")}
              onSearch={handleSearch}
            />
          </DemoItem>

          <DemoItem>
            <Label>With Filter Button</Label>
            <SearchField
              placeholder="Search with filters..."
              showFilterButton
              onFilterClick={handleFilterToggle}
              activeFilters={activeFilters}
              isLoading={isSearchLoading}
            />
          </DemoItem>

          <DemoItem>
            <Label>Loading State</Label>
            <SearchField placeholder="Loading search..." isLoading={true} />
          </DemoItem>
        </ComponentGrid>
      </Section>

      <Section>
        <SectionTitle>Dropdown</SectionTitle>
        <ComponentGrid>
          <DemoItem>
            <Label>Default Dropdown</Label>
            <Dropdown
              options={options}
              value={dropdownValue}
              onChange={setDropdownValue}
              label="Select an option"
              placeholder="Choose one..."
            />
          </DemoItem>

          <DemoItem>
            <Label>With Error</Label>
            <Dropdown
              options={options}
              label="Required Dropdown"
              placeholder="Please select..."
              error="This field is required"
            />
          </DemoItem>

          <DemoItem>
            <Label>Disabled</Label>
            <Dropdown
              options={options}
              label="Disabled Dropdown"
              placeholder="Can't select"
              disabled
            />
          </DemoItem>

          <DemoItem>
            <Label>Size Variants</Label>
            <Dropdown
              options={options}
              label="Small"
              placeholder="Small dropdown"
              size="small"
            />
            <SpacerSmall />
            <Dropdown
              options={options}
              label="Medium (default)"
              placeholder="Medium dropdown"
            />
            <SpacerSmall />
            <Dropdown
              options={options}
              label="Large"
              placeholder="Large dropdown"
              size="large"
            />
          </DemoItem>
        </ComponentGrid>
      </Section>

      <Section>
        <SectionTitle>Checkbox</SectionTitle>
        <ComponentGrid>
          <DemoItem>
            <Label>Default Checkbox</Label>
            <Checkbox
              label="Unchecked checkbox"
              checked={checkbox1}
              onChange={() => setCheckbox1(!checkbox1)}
            />
            <SpacerSmall />
            <Checkbox
              label="Checked checkbox"
              checked={checkbox2}
              onChange={() => setCheckbox2(!checkbox2)}
            />
          </DemoItem>

          <DemoItem>
            <Label>Indeterminate State</Label>
            <Checkbox
              label="Indeterminate checkbox"
              indeterminate
              checked={false}
              onChange={() => {}}
            />
          </DemoItem>

          <DemoItem>
            <Label>With Error</Label>
            <Checkbox label="Invalid checkbox" error="Please check this box" />
          </DemoItem>

          <DemoItem>
            <Label>Disabled States</Label>
            <Checkbox label="Disabled unchecked" disabled />
            <SpacerSmall />
            <Checkbox label="Disabled checked" checked disabled />
          </DemoItem>

          <DemoItem>
            <Label>Size Variants</Label>
            <Checkbox label="Small" size="small" />
            <SpacerSmall />
            <Checkbox label="Medium (default)" />
            <SpacerSmall />
            <Checkbox label="Large" size="large" />
          </DemoItem>
        </ComponentGrid>
      </Section>

      <Section>
        <SectionTitle>Radio Button</SectionTitle>
        <ComponentGrid>
          <DemoItem>
            <Label>Radio Group</Label>
            <RadioButton
              label="Option 1"
              name="radioGroup"
              value="option1"
              checked={radioValue === "option1"}
              onChange={() => setRadioValue("option1")}
            />
            <SpacerSmall />
            <RadioButton
              label="Option 2"
              name="radioGroup"
              value="option2"
              checked={radioValue === "option2"}
              onChange={() => setRadioValue("option2")}
            />
            <SpacerSmall />
            <RadioButton
              label="Option 3"
              name="radioGroup"
              value="option3"
              checked={radioValue === "option3"}
              onChange={() => setRadioValue("option3")}
            />
          </DemoItem>

          <DemoItem>
            <Label>With Error</Label>
            <RadioButton
              label="Invalid option"
              error="Please select a valid option"
            />
          </DemoItem>

          <DemoItem>
            <Label>Disabled States</Label>
            <RadioButton label="Disabled unchecked" disabled />
            <SpacerSmall />
            <RadioButton label="Disabled checked" checked disabled />
          </DemoItem>

          <DemoItem>
            <Label>Size Variants</Label>
            <RadioButton label="Small" size="small" />
            <SpacerSmall />
            <RadioButton label="Medium (default)" />
            <SpacerSmall />
            <RadioButton label="Large" size="large" />
          </DemoItem>
        </ComponentGrid>
      </Section>

      <Section>
        <SectionTitle>Multi Select</SectionTitle>
        <ComponentGrid>
          <DemoItem>
            <Label>Default Multi Select</Label>
            <MultiSelect
              options={options}
              value={multiSelectValue}
              onChange={setMultiSelectValue}
              label="Select multiple options"
              placeholder="Choose multiple..."
            />
          </DemoItem>

          <DemoItem>
            <Label>With Error</Label>
            <MultiSelect
              options={options}
              label="Required Multi Select"
              placeholder="Please select at least one..."
              error="This field is required"
            />
          </DemoItem>

          <DemoItem>
            <Label>Disabled</Label>
            <MultiSelect
              options={options}
              label="Disabled Multi Select"
              placeholder="Can't select"
              disabled
              value={["option1", "option2"]}
            />
          </DemoItem>

          <DemoItem>
            <Label>With Pre-selected Values</Label>
            <MultiSelect
              options={options}
              label="Pre-selected"
              placeholder="Choose multiple..."
              value={["option1", "option3"]}
            />
          </DemoItem>
        </ComponentGrid>
      </Section>

      <Section>
        <SectionTitle>Filter Chips</SectionTitle>
        <ComponentGrid>
          <DemoItem>
            <Label>Default Filter Chips</Label>
            <ChipsContainer>
              {filterChips.map((chip) => (
                <FilterChip
                  key={chip.id}
                  label={chip.label}
                  onRemove={() => console.log(`Remove ${chip.label}`)}
                />
              ))}
            </ChipsContainer>
          </DemoItem>

          <DemoItem>
            <Label>With Colors</Label>
            <ChipsContainer>
              {filterChips.map((chip) => (
                <FilterChip
                  key={chip.id}
                  label={chip.label}
                  color={chip.color}
                  onRemove={() => console.log(`Remove ${chip.label}`)}
                />
              ))}
            </ChipsContainer>
          </DemoItem>

          <DemoItem>
            <Label>Inactive & Disabled</Label>
            <ChipsContainer>
              <FilterChip
                label="Inactive Chip"
                active={false}
                onRemove={() => {}}
              />
              <FilterChip label="Disabled Chip" disabled onRemove={() => {}} />
              <FilterChip label="Non-removable" />
            </ChipsContainer>
          </DemoItem>

          <DemoItem>
            <Label>Size Variants</Label>
            <ChipsContainer>
              <FilterChip label="Small" size="small" onRemove={() => {}} />
              <FilterChip label="Medium (default)" onRemove={() => {}} />
              <FilterChip label="Large" size="large" onRemove={() => {}} />
            </ChipsContainer>
          </DemoItem>

          <DemoItem>
            <Label>With Icons</Label>
            <ChipsContainer>
              <FilterChip
                label="Image"
                icon={<IconPlaceholder>I</IconPlaceholder>}
                onRemove={() => {}}
              />
              <FilterChip
                label="Document"
                icon={<IconPlaceholder>D</IconPlaceholder>}
                onRemove={() => {}}
              />
            </ChipsContainer>
          </DemoItem>
        </ComponentGrid>
      </Section>

      <Section>
        <SectionTitle>Color Picker</SectionTitle>
        <ComponentGrid>
          <DemoItem>
            <Label>Default Color Picker</Label>
            <ColorPicker
              colors={colorOptions}
              value={selectedColor}
              onSelectColor={setSelectedColor}
              label="Select a color"
              helperText={"Currently selected: " + selectedColor}
            />
          </DemoItem>

          <DemoItem>
            <Label>With Error</Label>
            <ColorPicker
              colors={colorOptions}
              value=""
              onSelectColor={() => {}}
              label="Required Color"
              error="Please select a color"
            />
          </DemoItem>

          <DemoItem>
            <Label>With Cancel Button</Label>
            <ColorPicker
              colors={colorOptions}
              value={selectedColor}
              onSelectColor={setSelectedColor}
              onCancel={() => console.log("Color selection cancelled")}
              label="Cancellable Color Picker"
            />
          </DemoItem>

          <DemoItem>
            <Label>Disabled</Label>
            <ColorPicker
              colors={colorOptions}
              value={selectedColor}
              onSelectColor={() => {}}
              label="Disabled Color Picker"
              disabled
            />
          </DemoItem>

          <DemoItem>
            <Label>Size Variants</Label>
            <ColorPicker
              colors={colorOptions.slice(0, 5)}
              label="Small"
              size="small"
              onSelectColor={() => {}}
            />
            <SpacerSmall />
            <ColorPicker
              colors={colorOptions.slice(0, 5)}
              label="Medium (default)"
              onSelectColor={() => {}}
            />
            <SpacerSmall />
            <ColorPicker
              colors={colorOptions.slice(0, 5)}
              label="Large"
              size="large"
              onSelectColor={() => {}}
            />
          </DemoItem>

          <DemoItem>
            <Label>Full Width</Label>
            <ColorPicker
              colors={colorOptions}
              value={selectedColor}
              onSelectColor={setSelectedColor}
              label="Full Width Color Picker"
              fullWidth
            />
          </DemoItem>
        </ComponentGrid>
      </Section>
    </DemoContainer>
  );
};

// Styled Components
const DemoContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${(props) => props.theme.spacing.xl};

  h1 {
    margin-bottom: ${(props) => props.theme.spacing.xl};
    color: ${(props) => props.theme.colors.text.primary};
    font-size: ${(props) => props.theme.typography.fontSize.xxxl};
    text-align: center;
  }
`;

const Section = styled.section`
  margin-bottom: ${(props) => props.theme.spacing.xxl};
  padding: ${(props) => props.theme.spacing.lg};
  background-color: ${(props) => props.theme.colors.surface};
  border-radius: ${(props) => props.theme.borderRadius.lg};
`;

const SectionTitle = styled.h2`
  margin-bottom: ${(props) => props.theme.spacing.lg};
  font-size: ${(props) => props.theme.typography.fontSize.xl};
  color: ${(props) => props.theme.colors.primary};
  border-bottom: 1px solid ${(props) => props.theme.colors.divider};
  padding-bottom: ${(props) => props.theme.spacing.sm};
`;

const ComponentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${(props) => props.theme.spacing.xl};

  @media (max-width: ${(props) => props.theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

const DemoItem = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.h3`
  margin-bottom: ${(props) => props.theme.spacing.md};
  font-size: ${(props) => props.theme.typography.fontSize.lg};
  color: ${(props) => props.theme.colors.text.primary};
`;

const SpacerSmall = styled.div`
  height: ${(props) => props.theme.spacing.sm};
`;

const ChipsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${(props) => props.theme.spacing.sm};
`;

const IconPlaceholder = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  font-size: 12px;
  font-weight: bold;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.1);
`;

export default InputDemo;
