export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
}

export interface Lesson {
  id: string;
  moduleId: string;
  moduleName: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Advanced';
  duration: string;
  xp: number;
  explanation: string;
  keyTakeaways: string[];
  coverImage: string;
  quiz: QuizQuestion;
}

export const lessons: Lesson[] = [
  // ─── MODULE 1: CARBON FOOTPRINTS (6 Lessons) ────────────────────────────────
  {
    id: 'carbon-1',
    moduleId: 'carbon-footprints',
    moduleName: 'Carbon Footprints',
    title: 'Introduction to Carbon Footprints',
    difficulty: 'Easy',
    duration: '2 min',
    xp: 15,
    explanation: 'A carbon footprint is the total amount of greenhouse gases, primarily carbon dioxide and methane, emitted into the atmosphere by our direct and indirect actions. It includes everything from the electricity we use to heat our homes to the fuel burned during our daily commute. Understanding your personal footprint is the first crucial step toward taking effective environmental action.',
    keyTakeaways: [
      'Measures greenhouse gases in CO₂ equivalent (CO₂e).',
      'Includes both direct emissions (like driving) and indirect emissions (like manufacturing goods).',
      'Establishing a baseline helps identify high-leverage areas for carbon reduction.'
    ],
    coverImage: '/learn/carbon.webp',
    quiz: {
      question: 'What is the primary measurement unit for a carbon footprint?',
      options: [
        'Physical weight of pure charcoal',
        'Carbon dioxide equivalent (CO₂e)',
        'Total water consumption in gallons',
        'Kilowatts of electricity consumed'
      ],
      correctAnswerIndex: 1
    }
  },
  {
    id: 'carbon-2',
    moduleId: 'carbon-footprints',
    moduleName: 'Carbon Footprints',
    title: 'The Big Three: Transport, Energy, Food',
    difficulty: 'Medium',
    duration: '3 min',
    xp: 20,
    explanation: 'For the average individual, the vast majority of carbon emissions come from three primary sectors: transportation, home energy use, and food consumption. Private vehicles burn fossil fuels directly; heating, cooling, and powering homes consume utility grid energy; and food systems, especially meat and dairy production, involve massive agricultural and transport chains. Focusing on these areas yields the highest impact reductions.',
    keyTakeaways: [
      'Transportation is often the largest single source of personal emissions.',
      'Home energy efficiency is highly dependent on fossil fuel electricity grids.',
      'Agricultural emissions are heavily influenced by meat-intensive diets.'
    ],
    coverImage: '/learn/carbon.webp',
    quiz: {
      question: 'Which three sectors typically account for the majority of a person\'s carbon footprint?',
      options: [
        'Fashion, entertainment, and air travel',
        'Transportation, home energy, and food consumption',
        'Manufacturing, waste disposal, and water usage',
        'Digital streaming, commuting, and recycling habits'
      ],
      correctAnswerIndex: 1
    }
  },
  {
    id: 'carbon-3',
    moduleId: 'carbon-footprints',
    moduleName: 'Carbon Footprints',
    title: 'What is CO₂e? Understanding Equivalents',
    difficulty: 'Medium',
    duration: '3 min',
    xp: 20,
    explanation: 'Greenhouse gases include carbon dioxide, methane, nitrous oxide, and fluorinated gases, each with different warming potentials. Carbon dioxide equivalent, or CO₂e, is a standardized metric used to compare emissions from various greenhouse gases based on their Global Warming Potential (GWP). For instance, methane is roughly 28 times more potent than CO₂ over a 100-year period, so emitting 1 ton of methane equals 28 tons of CO₂e.',
    keyTakeaways: [
      'CO₂e standardizes multiple greenhouse gases into a single comparable metric.',
      'Global Warming Potential (GWP) measures how much heat a gas traps in the atmosphere.',
      'Allows policymakers to aggregate and target emissions consistently.'
    ],
    coverImage: '/learn/carbon.webp',
    quiz: {
      question: 'Why do we use the metric CO₂e instead of just tracking carbon dioxide?',
      options: [
        'Because carbon dioxide is not the most common greenhouse gas',
        'To standardize and compare different greenhouse gases based on their warming potential',
        'To measure the volume of gases rather than their weight',
        'Because it is easier to calculate than raw carbon dioxide emissions'
      ],
      correctAnswerIndex: 1
    }
  },
  {
    id: 'carbon-4',
    moduleId: 'carbon-footprints',
    moduleName: 'Carbon Footprints',
    title: 'Scope 1, 2, and 3 Emissions Explained',
    difficulty: 'Advanced',
    duration: '4 min',
    xp: 25,
    explanation: 'Emissions are categorized into three scopes to prevent double-counting and target reduction strategies. Scope 1 covers direct emissions from owned or controlled sources, like burning gas in a company vehicle. Scope 2 covers indirect emissions from purchased electricity, steam, heating, or cooling. Scope 3 includes all other indirect emissions in an organization\'s value chain, such as purchased materials, employee commuting, and product disposal.',
    keyTakeaways: [
      'Scope 1: Direct emissions (combustion on-site).',
      'Scope 2: Indirect emissions from purchased energy utilities.',
      'Scope 3: Value chain emissions (supply chain, product lifecycle, commuting).'
    ],
    coverImage: '/learn/carbon.webp',
    quiz: {
      question: 'Under which emission category does the electricity purchased to light up an office building fall?',
      options: [
        'Scope 1 (Direct Emissions)',
        'Scope 2 (Indirect Emissions from purchased energy)',
        'Scope 3 (Value Chain Emissions)',
        'Scope 4 (Offset Emissions)'
      ],
      correctAnswerIndex: 1
    }
  },
  {
    id: 'carbon-5',
    moduleId: 'carbon-footprints',
    moduleName: 'Carbon Footprints',
    title: 'Measuring Indirect Footprints: Supply Chains',
    difficulty: 'Advanced',
    duration: '4 min',
    xp: 25,
    explanation: 'Many products carry a hidden carbon backpack. The supply chain emissions of a typical consumer product include raw material extraction, chemical processing, worldwide shipping, packaging, and final retail delivery. This forms the product\'s life-cycle footprint. By understanding these indirect inputs, consumers can choose items with shorter transport distances, minimal packaging, and transparent manufacturing processes.',
    keyTakeaways: [
      'Supply chain emissions often dwarf direct assembly emissions.',
      'Lifecycle assessments (LCA) trace carbon from raw extraction to disposal.',
      'Choosing local or circular products reduces supply chain carbon bloat.'
    ],
    coverImage: '/learn/carbon.webp',
    quiz: {
      question: 'What is a Lifecycle Assessment (LCA)?',
      options: [
        'A test that measures how long a product lasts before breaking',
        'A study of the carbon emissions generated throughout a product\'s entire life cycle',
        'A system for auditing office electricity bills',
        'A tool that counts the total number of items sold'
      ],
      correctAnswerIndex: 1
    }
  },
  {
    id: 'carbon-6',
    moduleId: 'carbon-footprints',
    moduleName: 'Carbon Footprints',
    title: 'Setting Personal Net-Zero Goals',
    difficulty: 'Easy',
    duration: '2 min',
    xp: 15,
    explanation: 'Achieving personal net-zero means reducing your emissions as much as possible, then balancing any remaining, unavoidable emissions with offsets or carbon removal projects. To set a personal goal, measure your baseline, identify high-impact actions (such as switching transit or energy providers), set intermediate target dates, and purchase high-quality certified offsets for emissions you cannot eliminate.',
    keyTakeaways: [
      'Net-zero requires maximum emission reduction before offsets.',
      'Setting milestone goals keeps carbon reduction realistic and manageable.',
      'High-quality offsets should fund certified carbon capture or renewable projects.'
    ],
    coverImage: '/learn/carbon.webp',
    quiz: {
      question: 'What is the correct sequence for achieving a personal net-zero carbon goal?',
      options: [
        'Buy offsets immediately without changing your daily habits or consumption patterns',
        'Reduce emissions as much as possible first, then offset any remaining unavoidable emissions',
        'Focus only on recycling while increasing energy and fossil fuel transit use',
        'Ignore your personal score and wait for government energy grids to become green'
      ],
      correctAnswerIndex: 1
    }
  },

  // ─── MODULE 2: CLIMATE CHANGE (8 Lessons) ──────────────────────────────────
  {
    id: 'climate-1',
    moduleId: 'climate-change',
    moduleName: 'Climate Change',
    title: 'The Greenhouse Effect: Earth\'s Blanket',
    difficulty: 'Easy',
    duration: '2 min',
    xp: 15,
    explanation: 'The greenhouse effect is a natural process that warms the Earth\'s surface. When solar radiation reaches our atmosphere, some is reflected back into space, but the rest is absorbed and re-radiated by greenhouse gases. This creates a thermal blanket that keeps Earth habitable. However, human activities—primarily burning fossil fuels and deforestation—have added excess gases, trapping too much heat and causing global warming.',
    keyTakeaways: [
      'The greenhouse effect is essential for life, but human excess disrupts the balance.',
      'Gases like CO₂ and water vapor act as thermal traps for infrared radiation.',
      'Rising gas concentrations directly correlate with rising global average temperatures.'
    ],
    coverImage: '/learn/climate.webp',
    quiz: {
      question: 'How do greenhouse gases warm the Earth?',
      options: [
        'By reflecting incoming solar light directly into urban centers',
        'By trapping outgoing infrared heat radiation in the atmosphere',
        'By creating chemical reactions that release physical heat',
        'By blocking cold winds from entering the lower atmosphere'
      ],
      correctAnswerIndex: 1
    }
  },
  {
    id: 'climate-2',
    moduleId: 'climate-change',
    moduleName: 'Climate Change',
    title: 'Carbon Sinks: Oceans and Forests',
    difficulty: 'Medium',
    duration: '3 min',
    xp: 20,
    explanation: 'Nature has built-in mechanisms to absorb carbon dioxide from the atmosphere, known as carbon sinks. Forests act as terrestrial sinks through photosynthesis, locking carbon in tree trunks and soil. Oceans are the largest active carbon sink, absorbing dissolved CO₂ directly. However, rising atmospheric CO₂ is overloading our oceans, causing acidification, while deforestation is destroying global forests, converting carbon sinks into emission sources.',
    keyTakeaways: [
      'Forests and oceans absorb roughly half of all human-generated CO₂ emissions.',
      'Deforestation releases stored carbon, turning sinks into sources.',
      'Excess ocean carbon absorption leads to acidification, harming marine life.'
    ],
    quiz: {
      question: 'What is a major environmental consequence of oceans absorbing excess carbon dioxide?',
      options: [
        'Oceans become fresher and lose salinity',
        'Ocean acidification, which threatens coral reefs and marine ecosystems',
        'A rapid lowering of global sea levels',
        'An increase in marine plant biodiversity'
      ],
      correctAnswerIndex: 1
    },
    coverImage: '/learn/climate.webp'
  },
  {
    id: 'climate-3',
    moduleId: 'climate-change',
    moduleName: 'Climate Change',
    title: 'Tipping Points & Climate Feedback Loops',
    difficulty: 'Advanced',
    duration: '4 min',
    xp: 25,
    explanation: 'A climate tipping point is a threshold that, when exceeded, leads to large, rapid, and often irreversible changes in the state of the climate system. These are accelerated by feedback loops. For example, melting Arctic ice reduces the planet\'s reflectivity (albedo), causing the ocean to absorb more heat, which melts more ice. Crossing these tipping points could lead to runaway warming beyond human control.',
    keyTakeaways: [
      'Tipping points are thresholds of self-sustaining, irreversible climate changes.',
      'Positive feedback loops amplify warming trends (e.g., permafrost melting releasing methane).',
      'Preventing warming below 1.5°C minimizes the risk of triggering major tipping points.'
    ],
    quiz: {
      question: 'What is a climate feedback loop?',
      options: [
        'A process where public feedback alters climate policies',
        'A cycle where warming triggers effects that further accelerate or amplify warming',
        'A weather pattern that repeats every decade',
        'An instrument used to measure greenhouse gases'
      ],
      correctAnswerIndex: 1
    },
    coverImage: '/learn/climate.webp'
  },
  {
    id: 'climate-4',
    moduleId: 'climate-change',
    moduleName: 'Climate Change',
    title: 'Rising Sea Levels: Causes & Consequences',
    difficulty: 'Medium',
    duration: '3 min',
    xp: 20,
    explanation: 'Sea level rise is driven by two main factors: thermal expansion (water expanding as it warms) and the melting of land-based ice sheets and glaciers (like Greenland and Antarctica). Rising seas threaten coastal communities, cause saltwater intrusion into agricultural soils and drinking water aquifers, and increase the severity of storm surges. Protecting coastal ecosystems like mangroves is vital for natural storm defense.',
    keyTakeaways: [
      'Thermal expansion and land ice melting are the primary drivers of sea level rise.',
      'Melting sea ice does not raise sea levels directly, but land glaciers do.',
      'Coastal ecosystems provide essential buffers and carbon storage.'
    ],
    quiz: {
      question: 'Which of the following directly causes sea levels to rise?',
      options: [
        'Melting of floating sea ice in the Arctic',
        'Melting of land-based glaciers and thermal expansion of warming ocean water',
        'Increased rainfall over the open ocean',
        'The natural movement of tectonic plates'
      ],
      correctAnswerIndex: 1
    },
    coverImage: '/learn/climate.webp'
  },
  {
    id: 'climate-5',
    moduleId: 'climate-change',
    moduleName: 'Climate Change',
    title: 'Extreme Weather and Global Jet Streams',
    difficulty: 'Advanced',
    duration: '4 min',
    xp: 25,
    explanation: 'Global warming alters atmospheric circulation, particularly jet streams—fast-flowing air currents in the upper atmosphere. As the Arctic warms faster than the equator, the temperature difference decreases, causing the jet stream to weaken and wobble. This wobbly stream stalls weather systems in place, leading to prolonged heatwaves, intense droughts, and extreme rainfall events that cause devastating floods.',
    keyTakeaways: [
      'Warming polar regions weaken jet streams, stalling weather patterns.',
      'Leads to prolonged droughts, heatwaves, and localized extreme flooding.',
      'Altered wind patterns shift agricultural zones and water availability.'
    ],
    quiz: {
      question: 'How does Arctic amplification affect the global jet stream and weather patterns?',
      options: [
        'It makes the jet stream straight and fast, accelerating storm passages',
        'It weakens the jet stream, causing it to wobble and stall weather systems in place',
        'It pushes the jet stream entirely to the southern hemisphere',
        'It eliminates wind currents, causing complete atmospheric stillness'
      ],
      correctAnswerIndex: 1
    },
    coverImage: '/learn/climate.webp'
  },
  {
    id: 'climate-6',
    moduleId: 'climate-change',
    moduleName: 'Climate Change',
    title: 'Biodiversity Loss in a Warming World',
    difficulty: 'Medium',
    duration: '3 min',
    xp: 20,
    explanation: 'Climate change is altering habitats faster than many species can adapt. Rising temperatures force wildlife to migrate toward the poles or higher elevations, but geographic barriers or urban sprawl often block their paths. This results in habitat fragmentation, coral bleaching, and increased extinction rates, destabilizing ecosystems that provide humans with clean air, pollination, and natural pest control.',
    keyTakeaways: [
      'Species must adapt, migrate, or face extinction as climates shift.',
      'Habitat fragmentation blocks natural migration pathways.',
      'Loss of biodiversity reduces ecosystem resilience to disease and extreme weather.'
    ],
    quiz: {
      question: 'What is a major barrier for wildlife migrating to escape rising temperatures?',
      options: [
        'A lack of wind currents to guide them',
        'Geographic barriers and human-made urban sprawl',
        'The cooling of high elevations',
        'A decrease in sea level heights'
      ],
      correctAnswerIndex: 1
    },
    coverImage: '/learn/climate.webp'
  },
  {
    id: 'climate-7',
    moduleId: 'climate-change',
    moduleName: 'Climate Change',
    title: 'The Albedo Effect: Earth\'s Reflectivity',
    difficulty: 'Advanced',
    duration: '4 min',
    xp: 25,
    explanation: 'Albedo is a measure of how much solar radiation a surface reflects. Bright white surfaces like glaciers and sea ice have a high albedo, reflecting up to 90% of sunlight. Dark surfaces like open ocean water or asphalt have a low albedo, absorbing most solar energy. As global warming melts ice sheets, Earth\'s average albedo drops, causing the planet to absorb more heat in a positive feedback loop.',
    keyTakeaways: [
      'Albedo measures reflectivity; ice reflects heat, while open water absorbs it.',
      'Melting ice reduces planet albedo, accelerating global warming.',
      'High-albedo urban solutions include white roofs and reflective pavements.'
    ],
    quiz: {
      question: 'What happens to Earth\'s heat absorption as reflective sea ice melts into open ocean water?',
      options: [
        'Reflectivity increases, cooling the local area',
        'Heat absorption increases because dark ocean water absorbs more solar energy',
        'Heat absorption stops completely as water evaporates',
        'The albedo effect remains completely unchanged'
      ],
      correctAnswerIndex: 1
    },
    coverImage: '/learn/climate.webp'
  },
  {
    id: 'climate-8',
    moduleId: 'climate-change',
    moduleName: 'Climate Change',
    title: 'Paris Agreement & Global Temperature Limits',
    difficulty: 'Easy',
    duration: '2 min',
    xp: 15,
    explanation: 'The Paris Agreement is a legally binding international treaty on climate change adopted in 2015. Its goal is to limit global warming to well below 2°C, preferably to 1.5°C, compared to pre-industrial levels. To achieve this, countries commit to Nationally Determined Contributions (NDCs) to reduce emissions, transitioning grids, and reporting progress transparently every five years.',
    keyTakeaways: [
      'Targets limiting global warming to 1.5°C to avoid severe climate tipping points.',
      'NDCs are national commitments outlining emission reduction strategies.',
      'Requires global carbon emissions to drop by roughly 45% by 2030 and reach net-zero by 2050.'
    ],
    quiz: {
      question: 'What is the primary target limit of global temperature rise set by the Paris Agreement?',
      options: [
        'Exactly 3.0°C above pre-industrial baselines',
        'Well below 2.0°C, aiming for a limit of 1.5°C',
        'To match the average temperature of the equator',
        'To allow unlimited warming as long as green tech increases'
      ],
      correctAnswerIndex: 1
    },
    coverImage: '/learn/climate.webp'
  },

  // ─── MODULE 3: RENEWABLE ENERGY (7 Lessons) ────────────────────────────────
  {
    id: 'renewable-1',
    moduleId: 'renewable-energy',
    moduleName: 'Renewable Energy',
    title: 'Solar Energy: Harnessing the Sun',
    difficulty: 'Easy',
    duration: '2 min',
    xp: 15,
    explanation: 'Solar photovoltaic (PV) panels convert sunlight directly into electricity using semiconductor materials. When photons hit the PV cell, they knock electrons free, creating an electric current. Solar power is abundant, modular, and can be installed on rooftops or in massive utility-scale arrays. Rapid cost reductions have made solar electricity the cheapest source of new energy generation in most parts of the world.',
    keyTakeaways: [
      'Photovoltaic cells use silicon semiconductors to convert light into electricity.',
      'Solar energy emits zero operational greenhouse gases.',
      'Cost has fallen by over 80% in the last decade, driving global adoption.'
    ],
    quiz: {
      question: 'How do solar photovoltaic (PV) panels generate electricity?',
      options: [
        'By boiling water to spin steam turbines',
        'By using semiconductor materials to convert sunlight directly into electrical current',
        'By trapping wind currents inside cellular layers',
        'By extracting thermal energy from rainwater'
      ],
      correctAnswerIndex: 1
    },
    coverImage: '/learn/renewable.webp'
  },
  {
    id: 'renewable-2',
    moduleId: 'renewable-energy',
    moduleName: 'Renewable Energy',
    title: 'Wind Power: Onshore and Offshore',
    difficulty: 'Easy',
    duration: '2 min',
    xp: 15,
    explanation: 'Wind turbines capture the kinetic energy of air currents and convert it into electricity using rotating blades that spin a generator. Onshore wind farms are cost-effective and quickly deployed. Offshore wind farms utilize stronger, more consistent ocean winds and avoid land-use conflicts, though they require more complex underwater engineering and grid connections. Both play critical roles in decarbonizing energy grids.',
    keyTakeaways: [
      'Turbines convert kinetic wind energy into mechanical and then electrical energy.',
      'Offshore wind yields higher, more consistent energy but faces higher construction costs.',
      'Wind power has minimal environmental impact and a very short carbon payback period.'
    ],
    quiz: {
      question: 'What is a major advantage of offshore wind energy compared to onshore wind energy?',
      options: [
        'It is much cheaper to construct and maintain',
        'Ocean winds are typically stronger and more consistent, generating more power',
        'It does not require any grid connection cables',
        'It relies on solar radiation instead of air pressure differences'
      ],
      correctAnswerIndex: 1
    },
    coverImage: '/learn/renewable.webp'
  },
  {
    id: 'renewable-3',
    moduleId: 'renewable-energy',
    moduleName: 'Renewable Energy',
    title: 'Hydro and Geothermal Energy Basics',
    difficulty: 'Medium',
    duration: '3 min',
    xp: 20,
    explanation: 'Hydroelectric power utilizes the gravitational force of falling or flowing water to turn turbines, offering reliable baseload power but often disrupting local river ecosystems. Geothermal energy taps into the Earth\'s internal thermal energy, using steam from deep underground hot water reservoirs to spin generators. Geothermal is highly reliable and operates continuously, independent of weather conditions.',
    keyTakeaways: [
      'Hydroelectric is the largest source of renewable electricity globally but faces ecosystem impacts.',
      'Geothermal provides continuous, weather-independent baseload power.',
      'Both technologies have low operational emissions and high capacity factors.'
    ],
    quiz: {
      question: 'What makes geothermal energy unique compared to solar and wind energy?',
      options: [
        'It requires sunlight to heat up geothermal reservoirs',
        'It provides continuous, weather-independent baseload electricity generation',
        'It is only active during coastal ocean tides',
        'It generates carbon dioxide as a primary product'
      ],
      correctAnswerIndex: 1
    },
    coverImage: '/learn/renewable.webp'
  },
  {
    id: 'renewable-4',
    moduleId: 'renewable-energy',
    moduleName: 'Renewable Energy',
    title: 'Grid Stability and Energy Storage Systems',
    difficulty: 'Advanced',
    duration: '4 min',
    xp: 25,
    explanation: 'Because solar and wind power are intermittent (dependent on weather and time of day), grid operators must balance supply and demand in real time. Energy Storage Systems (ESS), primarily large-scale lithium-ion battery arrays and pumped-storage hydropower, store excess energy during peak production and release it when generation drops. This ensures grid stability and allows for 100% renewable energy penetration.',
    keyTakeaways: [
      'Intermittent renewables require storage solutions to match grid demand curves.',
      'Utility-scale battery arrays absorb midday solar surges and release them during evening peaks.',
      'Pumped hydro storage remains the largest capacity storage technology in use today.'
    ],
    quiz: {
      question: 'Why are large-scale energy storage systems essential for a fully renewable power grid?',
      options: [
        'To convert electricity back into raw coal and gas reserves',
        'To balance the grid by storing excess energy and releasing it when solar or wind production drops',
        'To increase the physical speed of wind turbine rotations',
        'To eliminate the need for electrical transmission cables'
      ],
      correctAnswerIndex: 1
    },
    coverImage: '/learn/renewable.webp'
  },
  {
    id: 'renewable-5',
    moduleId: 'renewable-energy',
    moduleName: 'Renewable Energy',
    title: 'The Role of Hydrogen in Green Energy',
    difficulty: 'Advanced',
    duration: '4 min',
    xp: 25,
    explanation: 'Hydrogen is a versatile energy carrier, but its environmental value depends on how it is produced. "Grey" hydrogen is made from fossil fuels, releasing carbon. "Green" hydrogen is produced via electrolysis, splitting water into hydrogen and oxygen using renewable electricity. Green hydrogen is crucial for decarbonizing hard-to-abate sectors like heavy steel manufacturing, shipping, and chemical production.',
    keyTakeaways: [
      'Green hydrogen is produced by splitting water using 100% renewable power.',
      'Acts as a clean fuel substitute for high-heat industrial processes.',
      'Challenges include storage density, high production costs, and transport safety.'
    ],
    quiz: {
      question: 'What defines "Green" hydrogen compared to other forms of hydrogen production?',
      options: [
        'It is manufactured using green chemical dyes for safety',
        'It is produced by splitting water molecules using renewable electricity',
        'It is extracted directly from organic forest soils',
        'It is captured from industrial coal plant exhaust systems'
      ],
      correctAnswerIndex: 1
    },
    coverImage: '/learn/renewable.webp'
  },
  {
    id: 'renewable-6',
    moduleId: 'renewable-energy',
    moduleName: 'Renewable Energy',
    title: 'Nuclear Energy: Carbon-Free Base Load',
    difficulty: 'Medium',
    duration: '3 min',
    xp: 20,
    explanation: 'Nuclear power plants generate electricity through nuclear fission, splitting uranium atoms inside a reactor to boil water, producing steam that spins turbine generators. While nuclear energy generates zero operational carbon emissions and provides highly stable, continuous baseload power, its adoption is complicated by long construction timelines, high capital costs, and concerns surrounding long-term radioactive waste management.',
    keyTakeaways: [
      'Nuclear fission releases massive heat energy without combustion or carbon emissions.',
      'Provides reliable, continuous baseload electricity to supplement wind/solar.',
      'Key challenges are waste storage, upfront costs, and public safety perceptions.'
    ],
    quiz: {
      question: 'Which of the following is true regarding nuclear energy generation?',
      options: [
        'It emits carbon dioxide during fission reactions',
        'It generates zero carbon emissions during operation and provides continuous baseload power',
        'It relies on burning specialized chemicals to heat water',
        'It is a highly intermittent energy source dependent on regional climates'
      ],
      correctAnswerIndex: 1
    },
    coverImage: '/learn/renewable.webp'
  },
  {
    id: 'renewable-7',
    moduleId: 'renewable-energy',
    moduleName: 'Renewable Energy',
    title: 'Transitioning to a Decentralized Grid',
    difficulty: 'Advanced',
    duration: '4 min',
    xp: 25,
    explanation: 'Traditional power grids rely on a centralized model, transmitting energy from large fossil-fuel plants to distant consumers. A decentralized grid utilizes distributed energy resources (DERs) like rooftop solar panels, home batteries, and electric vehicles. Using smart meters and AI-driven load management, decentralized grids route power dynamically, improve energy resilience, and reduce transmission line losses.',
    keyTakeaways: [
      'Decentralized grids use local, distributed energy sources like residential solar.',
      'Smart grids manage bidirectional power flows (users generating and selling energy).',
      'Improves energy security and decreases reliance on major transmission links.'
    ],
    quiz: {
      question: 'What is a core feature of a decentralized smart grid?',
      options: [
        'Relying on a single coal plant for all electricity distribution',
        'Integrating distributed local energy sources and enabling bidirectional power flows',
        'Eliminating local batteries and residential solar setups',
        'Lowering voltage globally to force conservation'
      ],
      correctAnswerIndex: 1
    },
    coverImage: '/learn/renewable.webp'
  },

  // ─── MODULE 4: SUSTAINABLE LIVING (5 Lessons) ──────────────────────────────
  {
    id: 'living-1',
    moduleId: 'sustainable-living',
    moduleName: 'Sustainable Living',
    title: 'Zero-Waste Lifestyle: The 5 R\'s',
    difficulty: 'Easy',
    duration: '2 min',
    xp: 15,
    explanation: 'A zero-waste lifestyle aims to minimize landfill contributions. The hierarchy is defined by the 5 R\'s: Refuse what you do not need, Reduce what you do buy, Reuse items to extend their life, Recycle what you cannot refuse or reduce, and Rot (compost) organic scraps. By prioritizing Refuse and Reduce, consumers stop waste before it enters the home, cutting production emissions at the source.',
    keyTakeaways: [
      'Refuse and Reduce are the most effective actions in the waste hierarchy.',
      'Recycling is energy-intensive and should be treated as a secondary solution.',
      'Composting (Rot) diverts organic waste, preventing methane gas release in landfills.'
    ],
    quiz: {
      question: 'Which action in the 5 R\'s hierarchy is the most effective at reducing carbon footprint?',
      options: [
        'Recycling every item you purchase',
        'Refusing items you do not need and reducing overall consumption',
        'Composting organic kitchen waste',
        'Reusing plastic water bottles repeatedly'
      ],
      correctAnswerIndex: 1
    },
    coverImage: '/learn/living.webp'
  },
  {
    id: 'living-2',
    moduleId: 'sustainable-living',
    moduleName: 'Sustainable Living',
    title: 'Plant-Forward Diet: Carbon on Your Plate',
    difficulty: 'Medium',
    duration: '3 min',
    xp: 20,
    explanation: 'Food systems generate about 26% of global greenhouse emissions. Animal agriculture is highly resource-intensive; raising beef requires vast amounts of land and water, and cattle produce methane, a potent greenhouse gas. Shifting to a plant-forward diet—prioritizing grains, legumes, vegetables, and nuts while reducing meat and dairy—is one of the most effective personal actions to lower your land and carbon footprints.',
    keyTakeaways: [
      'Beef and lamb emissions are up to 30 times higher than legumes per gram of protein.',
      'Plant-forward diets require significantly less land and water resources.',
      'Even partial reductions (like Meatless Mondays) make a measurable carbon difference.'
    ],
    quiz: {
      question: 'Why does animal agriculture, particularly beef production, have a high carbon footprint?',
      options: [
        'It requires no water resources but releases oxygen',
        'It is land-intensive and cattle directly release methane, a potent greenhouse gas',
        'It is entirely dependent on solar panel grids',
        'It involves very short shipping distances'
      ],
      correctAnswerIndex: 1
    },
    coverImage: '/learn/living.webp'
  },
  {
    id: 'living-3',
    moduleId: 'sustainable-living',
    moduleName: 'Sustainable Living',
    title: 'Conscious Consumerism: Fast Fashion Impact',
    difficulty: 'Medium',
    duration: '3 min',
    xp: 20,
    explanation: 'The fashion industry is responsible for 10% of global carbon emissions and massive water pollution. ' +
      'Fast fashion relies on rapid production cycles, synthetic petroleum-based fibers (like polyester), and cheap transport chains. ' +
      'Conscious consumerism involves buying fewer clothes, choosing natural organic fibers, supporting secondhand markets, and repairing items, ' +
      'slowing down the high-impact manufacturing loop.',
    keyTakeaways: [
      'Synthetic clothing fibers like polyester are derived from petroleum.',
      'Fashion creates massive waste; equivalent to a garbage truck of textiles burned/landfilled every second.',
      'Slowing purchases and buying secondhand significantly lowers fashion footprints.'
    ],
    quiz: {
      question: 'What is a major environmental issue associated with the fast fashion industry?',
      options: [
        'It uses too much renewable energy in cotton farms',
        'High resource waste, water pollution, and reliance on petroleum-based synthetic fibers',
        'It has forced a massive global reduction in shipping transit',
        'It produces items that decompose in a few weeks'
      ],
      correctAnswerIndex: 1
    },
    coverImage: '/learn/living.webp'
  },
  {
    id: 'living-4',
    moduleId: 'sustainable-living',
    moduleName: 'Sustainable Living',
    title: 'Water Conservation in Daily Routines',
    difficulty: 'Easy',
    duration: '2 min',
    xp: 15,
    explanation: 'Conserving water is directly linked to energy conservation. Processing, heating, and pumping municipal water requires significant electricity. By reducing domestic water waste—using low-flow faucets, taking shorter showers, and fixing leaks—we lower energy grid demand and preserve critical aquatic habitats from depletion during drought seasons.',
    keyTakeaways: [
      'Pumping and heating domestic water is highly energy-intensive.',
      'Fixing household leaks can save thousands of gallons of clean water annually.',
      'Low-flow showerheads reduce hot water volume, saving water and heating energy.'
    ],
    quiz: {
      question: 'How is household water conservation linked to carbon emissions reduction?',
      options: [
        'It increases the amount of solar radiation absorbed by the roof',
        'Reducing water use decreases the energy required to pump, treat, and heat municipal water',
        'It directly prevents fossil fuels from evaporating',
        'It has no correlation with carbon emissions'
      ],
      correctAnswerIndex: 1
    },
    coverImage: '/learn/living.webp'
  },
  {
    id: 'living-5',
    moduleId: 'sustainable-living',
    moduleName: 'Sustainable Living',
    title: 'Energy Efficiency at Home: Simple Audits',
    difficulty: 'Medium',
    duration: '3 min',
    xp: 20,
    explanation: 'A home energy audit identifies areas where your house is losing heat or electricity. Common issues include drafty windows and doors, lack of insulation, and old, inefficient appliances. Simple, low-cost upgrades—such as weather-stripping doors, sealing wall outlets, and transitioning to smart LED lighting—can reduce household heating and electricity emissions by up to 20% while saving on utility costs.',
    keyTakeaways: [
      'Sealing air drafts around windows and doors is a low-cost, high-impact winter fix.',
      'HVAC systems are the largest energy consumers in residential buildings.',
      'LED upgrades and smart plugs prevent unnecessary power draw.'
    ],
    quiz: {
      question: 'What is typically the largest consumer of energy in a residential home?',
      options: [
        'Digital streaming devices and Wi-Fi routers',
        'Heating, ventilation, and air conditioning (HVAC) systems',
        'Kitchen appliances like ovens and blenders',
        'Home lighting fixtures'
      ],
      correctAnswerIndex: 1
    },
    coverImage: '/learn/living.webp'
  },

  // ─── MODULE 5: GREEN TECHNOLOGY (6 Lessons) ───────────────────────────────
  {
    id: 'tech-1',
    moduleId: 'green-technology',
    moduleName: 'Green Technology',
    title: 'Electric Vehicles: Batteries and Grids',
    difficulty: 'Easy',
    duration: '2 min',
    xp: 15,
    explanation: 'Electric Vehicles (EVs) replace internal combustion engines with electric motors powered by rechargeable lithium-ion battery packs. EVs produce zero tailpipe emissions, making them far cleaner than gasoline cars even when charged on fossil-fuel heavy grids. As electric grids transition to solar and wind power, EVs automatically become completely carbon-free in operation.',
    keyTakeaways: [
      'EVs have zero operational tailpipe emissions.',
      'Their lifecycle footprint decreases automatically as electrical grids become cleaner.',
      'Key challenges are battery mineral recycling and developing charging infrastructure.'
    ],
    quiz: {
      question: 'Why are electric vehicles (EVs) cleaner than gasoline cars over their lifetime?',
      options: [
        'They do not require any manufacturing resources',
        'They produce zero tailpipe emissions and become cleaner as the grid shifts to renewables',
        'They are powered by gasoline but run more efficiently',
        'They decompose quickly at the end of their lifecycle'
      ],
      correctAnswerIndex: 1
    },
    coverImage: '/learn/technology.webp'
  },
  {
    id: 'tech-2',
    moduleId: 'green-technology',
    moduleName: 'Green Technology',
    title: 'Carbon Capture, Utilization, and Storage',
    difficulty: 'Advanced',
    duration: '4 min',
    xp: 25,
    explanation: 'Carbon Capture, Utilization, and Storage (CCUS) is a suite of technologies designed to capture carbon dioxide emissions from large industrial sources, like cement factories and power plants, before they reach the atmosphere. The captured CO₂ is compressed and transported to be stored deep underground in geological formations, or utilized in products like carbon-cured concrete or synthetic fuels.',
    keyTakeaways: [
      'CCUS prevents industrial emissions from entering the atmosphere.',
      'CO₂ is permanently stored in deep saline aquifers or depleted oil reservoirs.',
      'Critical for neutralizing emissions from heavy industries that cannot easily electrify.'
    ],
    quiz: {
      question: 'What is the main goal of Carbon Capture, Utilization, and Storage (CCUS) technology?',
      options: [
        'To harvest carbon from plants for fuel production',
        'To capture industrial CO₂ emissions and store them permanently underground or utilize them in materials',
        'To filter clean air and release more carbon dioxide into forests',
        'To manufacture plastic bottles from carbon molecules'
      ],
      correctAnswerIndex: 1
    },
    coverImage: '/learn/technology.webp'
  },
  {
    id: 'tech-3',
    moduleId: 'green-technology',
    moduleName: 'Green Technology',
    title: 'Smart Cities: IoT and Energy Efficiency',
    difficulty: 'Medium',
    duration: '3 min',
    xp: 20,
    explanation: 'Smart cities leverage the Internet of Things (IoT)—networks of connected sensors, cameras, and devices—to optimize urban resource flows. Real-time data feeds allow cities to adjust street lighting based on foot traffic, manage water networks to detect leaks instantly, optimize waste collection routes, and coordinate traffic lights to reduce idling emissions in congestion zones.',
    keyTakeaways: [
      'IoT sensors optimize urban systems in real time, reducing resource waste.',
      'Smart water grids prevent pipeline leak losses through automatic pressure valves.',
      'Dynamic traffic light management cuts vehicle idling and commuter transit time.'
    ],
    quiz: {
      question: 'How does IoT technology improve energy efficiency in smart cities?',
      options: [
        'By providing unlimited free electricity to all homes',
        'By using real-time sensor data to optimize resource usage, traffic routing, and street lighting',
        'By replacing public transit systems with electric drones',
        'By forcing all digital systems to run offline'
      ],
      correctAnswerIndex: 1
    },
    coverImage: '/learn/technology.webp'
  },
  {
    id: 'tech-4',
    moduleId: 'green-technology',
    moduleName: 'Green Technology',
    title: 'Circular Economy: Designing Out Waste',
    difficulty: 'Medium',
    duration: '3 min',
    xp: 20,
    explanation: 'A circular economy is a systemic model designed to eliminate waste and pollution, keep products and materials in high-value use, and regenerate natural systems. It moves away from the linear "take-make-waste" model. Products are designed from the ground up for easy disassembly, component repair, and material recycling, ensuring that resources flow continuously in closed-loop systems.',
    keyTakeaways: [
      'Circular economy replaces the linear take-make-waste production model.',
      'Focuses on product durability, easy repair, and clean material recycling loops.',
      'Minimizes raw material extraction, reducing associated mining and smelting emissions.'
    ],
    quiz: {
      question: 'How does a circular economy model differ from a traditional linear production model?',
      options: [
        'It relies entirely on offshore manufacturing to save costs',
        'It designs products to keep materials in closed loops of reuse, repair, and recycling, eliminating waste',
        'It encourages rapid disposable purchases to stimulate local economies',
        'It focuses solely on carbon offsets rather than material waste'
      ],
      correctAnswerIndex: 1
    },
    coverImage: '/learn/technology.webp'
  },
  {
    id: 'tech-5',
    moduleId: 'green-technology',
    moduleName: 'Green Technology',
    title: 'Sustainable Agriculture and Vertical Farming',
    difficulty: 'Medium',
    duration: '3 min',
    xp: 20,
    explanation: 'Vertical farming is a green agricultural technology where crops are grown in stacked layers inside climate-controlled indoor environments. Using hydroponics (water-based) or aeroponics (air-based) systems and LED lighting, vertical farms use up to 95% less water and 90% less land than traditional agriculture. Because they can be built in urban areas, they eliminate long food transport distances.',
    keyTakeaways: [
      'Vertical farming utilizes indoor vertical stacks to grow crops with minimal land footprint.',
      'Reduces agricultural water demand by up to 95% via recycled closed-loop systems.',
      'Cuts transit emissions by bringing crop production directly into urban centers.'
    ],
    quiz: {
      question: 'What is a major environmental benefit of urban vertical farming?',
      options: [
        'It uses traditional pesticides to double crop growth speeds',
        'It uses up to 95% less water and brings production closer to cities, reducing transport emissions',
        'It relies on burning agricultural waste for indoor heating',
        'It operates outdoors to maximize solar radiation absorption'
      ],
      correctAnswerIndex: 1
    },
    coverImage: '/learn/technology.webp'
  },
  {
    id: 'tech-6',
    moduleId: 'green-technology',
    moduleName: 'Green Technology',
    title: 'Biofuels and Future Aviation Propulsion',
    difficulty: 'Advanced',
    duration: '4 min',
    xp: 25,
    explanation: 'Aviation is a difficult sector to decarbonize because heavy batteries are unviable for long-haul flights. Green technology is focusing on Sustainable Aviation Fuels (SAFs)—biofuels derived from organic waste, algae, or agricultural residues that drop directly into existing jet engines, cutting flight emissions by up to 80%. Future aircraft research is exploring hydrogen fuel-cells and electric propulsion for short regional routes.',
    keyTakeaways: [
      'Batteries are too heavy for long-haul commercial passenger flight grids.',
      'Sustainable Aviation Fuels (SAFs) drop into existing planes, cutting lifecycle emissions.',
      'Hydrogen and electric propulsion are key candidates for future short-haul aviation.'
    ],
    quiz: {
      question: 'Why is biofuel (Sustainable Aviation Fuel) currently favored over batteries for decarbonizing long-haul flight?',
      options: [
        'Biofuel is completely free to manufacture',
        'Current batteries are too heavy to lift large passenger planes over long distances',
        'Batteries cannot work under cold atmospheric conditions',
        'Biofuels release oxygen instead of chemical exhaust'
      ],
      correctAnswerIndex: 1
    },
    coverImage: '/learn/technology.webp'
  }
];
