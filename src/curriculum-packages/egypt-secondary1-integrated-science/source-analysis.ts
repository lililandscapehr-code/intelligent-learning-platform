export type SourceAnalysisScope = "PAGE" | "PAGE_RANGE" | "CHAPTER" | "LESSON" | "TITLE" | "SECTION" | "COMBINED";

export interface SourceAnalysisEntry {
  id: string;
  scope: SourceAnalysisScope;
  label: string;
  pageStart: number;
  pageEnd: number;
  title: string;
  section?: string;
  summary: string;
  learningFocus: string[];
  scienceDomains: string[];
  pageTitles?: Array<{ page: number; title: string }>;
  status: "SOURCE_MAPPED" | "UNVERIFIED";
}

export const egyptScienceSourceAnalysis: SourceAnalysisEntry[] = [
  {
    id: "EGYPT-S1-PAGES-01-07",
    scope: "PAGE_RANGE",
    label: "Pages 1-7",
    pageStart: 1,
    pageEnd: 7,
    title: "Integrated Sciences: First Secondary Grade",
    section: "Introduction, general objectives, contents, and first-term learning outcomes",
    summary: "The opening section frames science as an integrated study of physical, chemical, life, Earth, and space concepts, with sustainability, practical activity, problem solving, collaboration, and environmental responsibility as recurring purposes.",
    learningFocus: [
      "Connect concepts across science disciplines.",
      "Use scientific knowledge to examine real environmental challenges.",
      "Develop practical investigation, critical thinking, collaboration, and project skills."
    ],
    scienceDomains: ["PHYSICS", "CHEMISTRY", "LIFE_SCIENCE", "EARTH_SCIENCE", "ENVIRONMENTAL_SCIENCE"],
    status: "SOURCE_MAPPED"
  },
  {
    id: "EGYPT-S1-PAGE-08",
    scope: "PAGE",
    label: "Page 8",
    pageStart: 8,
    pageEnd: 8,
    title: "Aquatic ecosystem",
    section: "Chapter One opening",
    summary: "The first chapter opens an integrated study of aquatic ecosystems, water as a medium for chemical processes, water quality, and the sustainability of marine life.",
    learningFocus: ["Relate the hydrosphere and water cycle to environmental change.", "Connect water chemistry to ecosystem sustainability."],
    scienceDomains: ["CHEMISTRY", "EARTH_SCIENCE", "LIFE_SCIENCE", "ENVIRONMENTAL_SCIENCE"],
    status: "SOURCE_MAPPED"
  },
  {
    id: "EGYPT-S1-PAGES-09-10",
    scope: "PAGE_RANGE",
    label: "Pages 9-10",
    pageStart: 9,
    pageEnd: 10,
    title: "Water Cycle in Nature and Chemical Structure of Water",
    section: "Lesson 1-1: Chemical reactions and their impact on water quality",
    summary: "Page 9 explains the water cycle and its physical, chemical, and biological effects; page 10 introduces water composition, polarity, hydrogen bonding, and dissolution.",
    learningFocus: ["Explain how the water cycle can drive environmental change.", "Relate water structure and polarity to its ability to dissolve substances."],
    scienceDomains: ["CHEMISTRY", "EARTH_SCIENCE", "ENVIRONMENTAL_SCIENCE"],
    pageTitles: [{ page: 9, title: "Water Cycle in Nature" }, { page: 10, title: "Chemical structure of water; Chemical properties of water; Water polarity" }],
    status: "SOURCE_MAPPED"
  },
  {
    id: "EGYPT-S1-CHAPTER-ONE",
    scope: "CHAPTER",
    label: "Chapter One",
    pageStart: 8,
    pageEnd: 39,
    title: "Aquatic ecosystem",
    section: "Chapter One",
    summary: "Chapter One progresses from the hydrosphere and water cycle through water chemistry and pH, density and currents, oxygen and carbon dioxide, biological adaptations, temperature, light, pressure, solutions and concentration, ecological balance, and human stewardship.",
    learningFocus: ["Recognize the hydrosphere and its relationships with Earth systems.", "Explain water-cycle, chemical, and physical effects on aquatic environments.", "Evaluate biological adaptations and ecological balance using evidence.", "Design safe investigations and propose responsible water-resource actions."],
    scienceDomains: ["PHYSICS", "CHEMISTRY", "LIFE_SCIENCE", "EARTH_SCIENCE"],
    pageTitles: [
      { page: 8, title: "Aquatic ecosystem; The hydrosphere on Earth" },
      { page: 9, title: "Water Cycle in Nature; Research activity" },
      { page: 10, title: "Chemical structure of water; Chemical properties of water; Water polarity" },
      { page: 11, title: "Hydrolysis (hydration); Acid-base balance (equilibrium)" },
      { page: 12, title: "Practical activity: Measuring the pH values in different water samples" },
      { page: 13, title: "Density; Practical activity: Measure the density of different samples of water" },
      { page: 14, title: "Water density and water currents in the oceans; Density of water in Polar Regions" },
      { page: 15, title: "The effect of the difference in density on the movement of water; Practical experiment" },
      { page: 16, title: "Solubility of the two gases O2 and CO2 in water" },
      { page: 17, title: "Sources of carbon dioxide; Effects of increased or deficient CO2" },
      { page: 18, title: "Physiological adaptation; Osmosis and osmotic pressure" },
      { page: 19, title: "Physiological adaptations of freshwater organisms; Practical activity" },
      { page: 20, title: "Behavioral adaptations" },
      { page: 21, title: "Structural adaptations; Gas exchange and cellular respiration" },
      { page: 22, title: "Choose the correct answer" },
      { page: 23, title: "Heat and temperature" },
      { page: 24, title: "Specific heat of matter" },
      { page: 25, title: "Analytical activity; Effect of temperature changes on marine organisms" },
      { page: 26, title: "Effect of light and solar radiation on aquatic environments" },
      { page: 27, title: "Solar radiation and its effect on water; Light zones in water" },
      { page: 28, title: "Photosynthesis in aquatic environments; Solar radiation and ecological balance" },
      { page: 29, title: "Activity 1: Measuring light intensity in water; Research and investigation" },
      { page: 30, title: "Pressure at a point inside a liquid; Factors affecting liquid pressure" },
      { page: 31, title: "Properties of liquid pressure" },
      { page: 32, title: "Effects of pressure on biological adaptations" },
      { page: 33, title: "Aqueous solutions; Concentration and colligative properties" },
      { page: 34, title: "Vapor pressure, boiling point, and freezing point" },
      { page: 35, title: "Factors influencing organism distribution in aquatic environments" },
      { page: 36, title: "Importance of ecological balance in aquatic systems" },
      { page: 37, title: "Human activities and maintaining aquatic ecological balance" },
      { page: 38, title: "Developing a Plan to Protect Aquatic Ecosystems; Search and inquiry" },
      { page: 39, title: "Research Questions: Industrial pollution, water overexploitation, climate change, ecosystem protection" }
    ],
    status: "SOURCE_MAPPED"
  },
  {
    id: "EGYPT-S1-CHAPTER-TWO",
    scope: "CHAPTER",
    label: "Chapter Two",
    pageStart: 40,
    pageEnd: 59,
    title: "Atmosphere",
    section: "Chapter Two",
    summary: "The source maps atmosphere layers and components, atmospheric chemical reactions, and atmospheric changes with their environmental impacts.",
    learningFocus: ["Identify atmosphere layers and components.", "Relate atmospheric reactions and changes to environmental effects."],
    scienceDomains: ["CHEMISTRY", "EARTH_SCIENCE", "ENVIRONMENTAL_SCIENCE"],
    status: "SOURCE_MAPPED"
  },
  {
    id: "EGYPT-S1-CHAPTER-THREE",
    scope: "CHAPTER",
    label: "Chapter Three",
    pageStart: 60,
    pageEnd: 76,
    title: "The soil",
    section: "Chapter Three",
    summary: "The source maps soil composition, ecosystem importance, acid-rain effects, soil measurement, and preservation strategies.",
    learningFocus: ["Describe soil composition and ecosystem function.", "Examine acid rain and soil preservation using measurement and investigation."],
    scienceDomains: ["CHEMISTRY", "EARTH_SCIENCE", "LIFE_SCIENCE", "ENVIRONMENTAL_SCIENCE"],
    status: "SOURCE_MAPPED"
  },
  {
    id: "EGYPT-S1-CHAPTER-FOUR",
    scope: "CHAPTER",
    label: "Chapter Four",
    pageStart: 77,
    pageEnd: 96,
    title: "The role of science in environmental sustainability",
    section: "For a Sustainable Environment",
    summary: "The source maps sustainability, environmental protection, pollution effects and measurement, treatment approaches, biodiversity, species protection, and an ecosystem-restoration project.",
    learningFocus: ["Explain sustainability and environmental protection strategies.", "Relate pollutants to environmental and human-health effects.", "Explain biodiversity and protection strategies.", "Design a sustainable ecosystem restoration project."],
    scienceDomains: ["CHEMISTRY", "LIFE_SCIENCE", "EARTH_SCIENCE", "ENVIRONMENTAL_SCIENCE", "ENGINEERING_DESIGN"],
    status: "SOURCE_MAPPED"
  },
  {
    id: "EGYPT-S1-COMBINED-WATER-ENVIRONMENT",
    scope: "COMBINED",
    label: "Aquatic ecosystem + sustainability",
    pageStart: 8,
    pageEnd: 96,
    title: "Sustaining life in ecosystems",
    section: "Combined source sections",
    summary: "This combined view connects aquatic, atmospheric, soil, and sustainability sections as one environmental-systems study. It is a source analysis grouping, not an assessment or mastery claim.",
    learningFocus: ["Trace interactions among water, air, soil, organisms, and human activity.", "Identify opportunities for practical investigation and sustainability projects."],
    scienceDomains: ["PHYSICS", "CHEMISTRY", "LIFE_SCIENCE", "EARTH_SCIENCE", "ENVIRONMENTAL_SCIENCE", "ENGINEERING_DESIGN"],
    status: "SOURCE_MAPPED"
  }
];

export default egyptScienceSourceAnalysis;
