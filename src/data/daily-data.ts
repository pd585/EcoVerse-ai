/**
 * Curated Datasets for EcoVerse
 * Contains rotating daily eco-insights, planet health metrics, and static fallback data.
 */

// ─── 50 CURATED DAILY ECO-TIPS ───────────────────────────────────────────────
export const DAILY_ECO_INSIGHTS = [
  "Turn off the tap while brushing your teeth to save up to 8 gallons of water a day.",
  "Swap one beef meal for chicken or beans to cut that meal's carbon footprint by 80%.",
  "Lower your thermostat by 2°F in winter to save roughly 6% on heating emissions.",
  "Unplug electronics when fully charged; 'vampire draw' accounts for 5-10% of home energy use.",
  "Use cold water for laundry; up to 90% of a washing machine's energy goes to heating water.",
  "Choose a bike or walk for trips under 2 miles instead of driving to reduce urban air pollution.",
  "Bring reusable shopping bags to eliminate plastic waste and reduce oil refining demand.",
  "Switch to LED bulbs; they use 75% less energy and last 25 times longer than incandescents.",
  "Keep your tires properly inflated to improve fuel mileage by up to 3% and lower emissions.",
  "Set your refrigerator temperature between 37°F and 40°F, and freezer at 0°F for optimal efficiency.",
  "Plan your meals before grocery shopping to minimize food waste, which releases methane in landfills.",
  "Install a low-flow showerhead to cut hot water usage by up to 50% without sacrificing pressure.",
  "Air-dry your clothes when possible to eliminate carbon footprint from dryer use.",
  "Buy dry food items (grains, beans, pasta) in bulk to minimize packaging waste.",
  "Use smart power strips to automatically cut power to devices in standby mode.",
  "Open curtains during winter days to let sunlight heat rooms naturally, then close them at night.",
  "Compost kitchen scraps to reduce household landfill waste by up to 30%.",
  "Choose regional travel or trains over domestic flights to cut travel emissions by half.",
  "Repurpose glass jars for food storage instead of purchasing new plastic containers.",
  "Clean or replace air filters in your HVAC system monthly to improve system efficiency by 15%.",
  "Use public transit once a week to cut your commute emissions by 20% on average.",
  "Repair torn clothing or broken items instead of buying replacements to combat fast fashion.",
  "Water outdoor plants early in the morning or late evening to minimize evaporation loss.",
  "Upgrade to a smart thermostat to optimize heating and cooling schedules while you sleep.",
  "Collect rainwater in a barrel to water your garden and reduce domestic water demand.",
  "Run the dishwasher only when fully loaded to save both water and energy.",
  "Pack your lunch in reusable containers rather than plastic baggies or aluminum foil.",
  "Choose matches over disposable plastic lighters to keep plastic out of landfills.",
  "Print on both sides of paper or transition to digital note-taking where possible.",
  "Support local farmer's markets to eat seasonal foods with fewer transit miles.",
  "Use a microwave or toaster oven instead of a conventional oven for small meals to save energy.",
  "Choose cosmetics and soaps free of microbeads to protect marine ecosystems.",
  "Plant native flowers to support local bee populations and reduce garden watering needs.",
  "Donate unwanted items instead of throwing them away to extend their life cycle.",
  "Turn off lights when leaving any room for more than a minute to conserve power.",
  "Switch to paperless billing to conserve forestry resources and cut delivery footprint.",
  "Cover pots with lids while cooking to heat food faster and use less stove energy.",
  "Use a reusable water bottle instead of buying single-use bottled water.",
  "Walk, cycle, or use public transit for at least one routine trip every single week.",
  "Support businesses that offer take-back recycling programs for electronics.",
  "Keep car cargo space empty to reduce vehicle weight and improve fuel efficiency.",
  "Switch to a bamboo toothbrush; it decomposes in a few months compared to plastic's 500 years.",
  "Choose bar soap instead of liquid body wash to reduce plastic bottle packaging waste.",
  "Opt for energy-efficient appliances (Energy Star rated) when replacing old home devices.",
  "Use rechargeable batteries to reduce heavy metal waste in landfills.",
  "Insulate water pipes to keep water hotter longer and lower water heater demand.",
  "Keep your freezer full; food acts as an insulator, reducing energy needed to keep it cold.",
  "Use rags and reusable towels instead of paper towels for kitchen cleanup.",
  "Opt out of single-use utensils and napkins when ordering food takeout.",
  "Share your sustainability journey with friends to create a positive ripple effect."
];

// ─── 30 PLANET HEALTH DAILY UPDATES ──────────────────────────────────────────
export const PLANET_HEALTH_FEED = [
  "Global solar capacity grew by an unprecedented 50% in 2023, reaching historic highs.",
  "Electric vehicles now make up over 15% of all new passenger car sales worldwide.",
  "Reforestation projects in South America successfully restored 50,000 hectares of canopy.",
  "Wind power has officially overtaken coal energy generation in several European nations.",
  "Global ocean conservation pacts now protect 30% of marine habitats from industrial fishing.",
  "Cities worldwide added over 2,000 miles of protected bike lanes in the past year.",
  "Community-led composting initiatives diverted 10 million tons of waste from landfills.",
  "A breakthrough in green hydrogen production reduced processing energy needs by 20%.",
  "Microgrid solar arrays brought clean, reliable power to 100 rural villages in Africa.",
  "Forest loss in critical biosphere reserves dropped by 36% due to satellite monitoring.",
  "Public transit ridership in major cities has returned to pre-pandemic highs, reducing car grids.",
  "New regulations on single-use plastics took effect in 12 major nations this month.",
  "Investment in geothermal energy systems reached record levels, promising stable base grid power.",
  "Major cargo ports are transitioning to electric cranes, cutting coastal carbon hotspots.",
  "Over 1,000 schools have successfully transitioned to solar energy and eco-curriculums.",
  "Regenerative agriculture practices are now utilized on 10% of global cropland.",
  "An innovative plastic-eating enzyme pilot successfully degraded waste in marine setups.",
  "Global carbon emissions from energy grids are projected to peak and begin declining by 2026.",
  "Heat pump installations grew by 30% this year, shifting heating away from fossil fuels.",
  "Restored wetlands in coastal regions have sequestered 2 million tons of carbon dioxide.",
  "Corporate commitments to net-zero carbon operations increased by 40% year-over-year.",
  "Smart electric grids reduced transmission line energy waste by 12% in peak periods.",
  "Urban green rooftops expanded by 500 acres, mitigating city heat-island effects.",
  "Re-wilding projects reintroduced key species to restore ecological balance in grasslands.",
  "Industrial carbon capture research reached commercial viability milestones for steel mills.",
  "Youth-led climate groups mobilized 5 million volunteers for localized clean-up drives.",
  "Investment in wave and tidal energy generators doubled, expanding marine renewables.",
  "Paper packaging alternatives saved 1.5 million trees from manufacturing processes.",
  "Bicycle commuting rates rose by 18% in metro areas, improving regional air quality.",
  "Global focus on green building certification resulted in 10,000 new carbon-neutral structures."
];

// ─── 10 CURATED CARBON INSIGHT FALLBACKS ──────────────────────────────────────
export const CARBON_INSIGHT_FALLBACKS = [
  "Reducing your private transit trips by swapping short drives for cycling or public transit is the single most effective way to lower your carbon score today.",
  "Shifting your home energy to a 100% renewable plan can cut up to 1.1 tonnes of CO₂ annually with almost zero change to your daily routine.",
  "Incorporating just three plant-based dinners into your week can save roughly 600kg of CO₂ per year and lower your environmental footprint.",
  "Unplugging vampire electronics and using smart power strips can quietly reduce your household carbon emissions by up to 200kg of CO₂ annually.",
  "Choosing regional travel alternatives instead of just one long-haul flight can dramatically decrease your yearly emissions by over a tonne of CO₂.",
  "Sourcing your groceries locally and reducing food waste by half is a highly effective, low-effort way to optimize your personal carbon score.",
  "Lowering your thermostat by just 2 degrees in winter can cut your home energy carbon footprint by roughly 5% and lower utility bills.",
  "Choosing high-efficiency appliances and LED lighting is a powerful long-term investment that reduces your annual carbon output significantly.",
  "Replacing single-use plastic items with durable, reusable alternatives minimizes the carbon-heavy manufacturing loop of disposable goods.",
  "Every small action like taking shorter showers or composting organic waste adds up to meaningful, long-term carbon footprint reductions."
];

// ─── 10 CURATED TREND SUMMARY FALLBACKS ──────────────────────────────────────
export const TREND_SUMMARY_FALLBACKS = [
  "Your carbon footprint is on a steady downward trajectory this month, driven by cleaner transit choices and lower energy consumption.",
  "A slight decrease in your household emissions shows your daily habit adjustments are compounding into measurable, positive changes.",
  "Your monthly emissions trend is stabilizing, demonstrating consistent progress in your sustainability journey across all major categories.",
  "Your emissions showed a noticeable drop this week, putting you well on track to meet your annual carbon reduction goals.",
  "By prioritizing active transit and plant-based options, you have successfully lowered your carbon curve for the third consecutive week.",
  "Your sustainability trend remains highly positive, reflecting your strong commitment to reducing energy waste at home.",
  "Emissions in your food and transport sectors are continuing to decline, showing excellent progress from your recent roadmap choices.",
  "Your carbon score is trending beautifully downward, reinforcing how small lifestyle changes yield significant collective impact.",
  "A flat emissions curve this month shows great stability, setting a perfect foundation for your next high-impact sustainability challenge.",
  "Your recent travel choices have significantly reduced your carbon footprint trend compared to the previous quarter."
];

// ─── 10 CURATED COACH FALLBACKS ──────────────────────────────────────────────
export const COACH_FALLBACKS = [
  "Making sustainable choices is a journey of small, daily habits that compound over time. By focusing on active transportation, like walking or cycling for short trips, you can make a significant dent in your personal footprint. What is one short trip you could easily swap for a walk this week?",
  "Your interest in renewable energy is a fantastic step. Shifting to a green power provider is one of the highest-leverage actions you can take to instantly clean up your home footprint. Have you checked if your local utility provider offers a renewable energy tariff?",
  "Adjusting your diet is a powerful way to reduce your carbon output. Moving toward plant-based meals, even just a few times a week, has a massive positive impact on global land and water use. Which plant-based dish do you enjoy cooking the most?",
  "Reducing home energy waste is easier than it looks. Simple actions like washing clothes in cold water or upgrading to LED bulbs can yield impressive carbon reductions. What is one small change in your home energy routine you feel ready to try today?",
  "Sourcing food locally and minimizing kitchen waste are direct ways to lower your ecological footprint. When we compost or plan meals, we prevent organic waste from releasing methane in landfills. Do you currently have a system for composting organic kitchen scraps?",
  "Our daily commute is often the largest single source of carbon emissions in our profiles. Choosing public transit, carpooling, or micro-mobility options makes a real difference in city emissions. How long is your typical daily commute to work or school?",
  "Consuming less and choosing high-quality, durable goods cuts down on manufacturing emissions. Buying secondhand or repairing items before replacing them breaks the high-impact cycle of fast consumerism. What was the last item you successfully repaired or bought secondhand?",
  "Every carbon footprint reduction counts, no matter how small. Tracking your progress on the EcoVerse dashboard helps build the consistent habits needed for long-term impact. What feature on your dashboard do you find most helpful for staying motivated?",
  "Water conservation is closely linked to energy efficiency, as pumping and heating water requires significant power. Shorter showers and fixing leaks are simple wins for both your utility bills and the planet. Would you be open to setting a five-minute shower timer?",
  "Your commitment to learning about climate action is truly inspiring. Education is a powerful tool, and sharing what you learn with friends can create a ripple effect of positive change. What sustainability topic are you most excited to explore next?"
];

// Helper to get Day-of-Year index
function getDayOfYear(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

export function getDailyEcoTip(): string {
  const index = getDayOfYear() % DAILY_ECO_INSIGHTS.length;
  return DAILY_ECO_INSIGHTS[index];
}

export function getDailyPlanetHealth(): string {
  const index = getDayOfYear() % PLANET_HEALTH_FEED.length;
  return PLANET_HEALTH_FEED[index];
}
