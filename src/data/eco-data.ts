/**
 * EcoVerse AI — Mock experience data.
 *
 * This is MOCK / SEED data only. It will be replaced by real API responses
 * when the backend is integrated.
 *
 * Do not couple business logic to the exact shape of this data.
 * All API types are defined in src/types/ and are the source of truth.
 *
 * @module data/eco-data
 */

// ─── Carbon Score ─────────────────────────────────────────────────────────────

export const carbonScore = {
  value: 6.4,    // tonnes CO2e / year
  national: 11.2,
  global: 4.8,
  changePct: -18,
} as const;

// ─── Emission Breakdown ───────────────────────────────────────────────────────

export const emissionBreakdown = [
  {
    label: 'Transport',
    value: 34,
    color: '#00E5FF',
    icon: '🚗',
    insight: {
      description: '34% of your footprint comes from transportation.',
      contributor: 'Private vehicle usage',
      reduction: '-0.8 t CO₂e/year',
      action: 'Use public transit twice weekly',
    },
  },
  {
    label: 'Energy',
    value: 28,
    color: '#FFD54F',
    icon: '⚡',
    insight: {
      description: '28% of your footprint comes from household energy.',
      contributor: 'Electricity consumption',
      reduction: '-1.1 t CO₂e/year',
      action: 'Switch to renewable energy where available',
    },
  },
  {
    label: 'Food',
    value: 21,
    color: '#34D399',
    icon: '🌱',
    insight: {
      description: '21% of your footprint comes from dietary choices.',
      contributor: 'Animal-based products',
      reduction: '-0.6 t CO₂e/year',
      action: 'Try three plant-based dinners each week',
    },
  },
  {
    label: 'Shopping',
    value: 17,
    color: '#A78BFA',
    icon: '🛍️',
    insight: {
      description: '17% of your footprint comes from retail purchases.',
      contributor: 'Frequent replacement cycles',
      reduction: '-0.3 t CO₂e/year',
      action: 'Choose durable products whenever possible',
    },
  },
] as const;

// ─── Monthly Trend ────────────────────────────────────────────────────────────

export const monthlyTrend = [
  { month: 'Jan', value: 8.1 },
  { month: 'Feb', value: 7.7 },
  { month: 'Mar', value: 7.9 },
  { month: 'Apr', value: 7.2 },
  { month: 'May', value: 6.8 },
  { month: 'Jun', value: 6.4 },
] as const;

// ─── Achievements ─────────────────────────────────────────────────────────────

export const achievements = [
  { icon: '🌱', name: 'First Steps',   desc: 'Completed onboarding',  earned: true  },
  { icon: '🚲', name: 'Car-Free Week', desc: '7 days no driving',     earned: true  },
  { icon: '🥗', name: 'Plant Pioneer', desc: '20 meatless meals',     earned: true  },
  { icon: '☀️', name: 'Solar Curious', desc: 'Ran a solar sim',        earned: true  },
  { icon: '🔥', name: 'Streak Master', desc: '30-day streak',         earned: false },
  { icon: '🌍', name: 'Carbon Halver', desc: 'Cut footprint 50%',     earned: false },
  { icon: '🎓', name: 'First Lesson Completed', desc: 'Completed 1 lesson', earned: false },
  { icon: '📚', name: '5 Lessons Completed', desc: 'Completed 5 lessons', earned: false },
  { icon: '🧠', name: '10 Lessons Completed', desc: 'Completed 10 lessons', earned: false },
  { icon: '🏆', name: '25 Lessons Completed', desc: 'Completed 25 lessons', earned: false },
  { icon: '⚡', name: '100 XP Earned', desc: 'Earned 100 Eco XP', earned: false },
  { icon: '🌟', name: '250 XP Earned', desc: 'Earned 250 Eco XP', earned: false },
  { icon: '👑', name: '500 XP Earned', desc: 'Earned 500 Eco XP', earned: false },
] as const;

// ─── AI Recommendations ───────────────────────────────────────────────────────

export const recommendations = [
  {
    title: 'Switch 2 weekly commutes to transit',
    impact: '−0.4t / yr',
    effort: 'Low',
    detail: 'Replacing two car commutes a week with the metro saves roughly 400kg of CO₂ annually.',
  },
  {
    title: 'Shift to a renewable energy plan',
    impact: '−1.1t / yr',
    effort: 'Low',
    detail: 'Most providers offer green tariffs at near-identical cost. Biggest single win for you.',
  },
  {
    title: 'Try 3 plant-based dinners a week',
    impact: '−0.6t / yr',
    effort: 'Medium',
    detail: 'Reducing red meat is one of the highest-leverage food choices for your footprint.',
  },
] as const;

// ─── Learn Tracks ─────────────────────────────────────────────────────────────

export const learnTracks = [
  {
    title: 'Carbon Footprints',
    blurb: 'What a footprint really is, and where yours hides.',
    modules: 6,
    progress: 100,
    accent: 'emerald' as const,
    emoji: '👣',
  },
  {
    title: 'Climate Change',
    blurb: 'The science of a warming world, made clear.',
    modules: 8,
    progress: 60,
    accent: 'ocean' as const,
    emoji: '🌡️',
  },
  {
    title: 'Renewable Energy',
    blurb: 'Solar, wind, and the grid of the future.',
    modules: 7,
    progress: 25,
    accent: 'aurora' as const,
    emoji: '⚡',
  },
  {
    title: 'Sustainable Living',
    blurb: 'Everyday habits that quietly add up.',
    modules: 5,
    progress: 0,
    accent: 'emerald' as const,
    emoji: '🌿',
  },
  {
    title: 'Green Technology',
    blurb: 'The innovations rewriting our impact.',
    modules: 6,
    progress: 0,
    accent: 'ocean' as const,
    emoji: '🔬',
  },
] as const;

// ─── Simulator Scenarios ──────────────────────────────────────────────────────

export const simulatorScenarios = [
  {
    id: 'transit',
    title: 'Use public transportation',
    emoji: '🚆',
    perYear: 0.9,
    blurb: 'Trade your car for transit on most trips.',
  },
  {
    id: 'diet',
    title: 'Reduce meat consumption',
    emoji: '🥗',
    perYear: 0.7,
    blurb: 'Shift toward a mostly plant-based plate.',
  },
  {
    id: 'solar',
    title: 'Install solar panels',
    emoji: '☀️',
    perYear: 1.4,
    blurb: 'Generate clean energy from your roof.',
  },
  {
    id: 'flights',
    title: 'Travel differently',
    emoji: '✈️',
    perYear: 1.1,
    blurb: 'Swap one long-haul flight for regional trips.',
  },
  {
    id: 'home',
    title: 'Change energy habits',
    emoji: '🏠',
    perYear: 0.5,
    blurb: 'Smart heating, LED, and standby cuts.',
  },
] as const;

// ─── Roadmap ──────────────────────────────────────────────────────────────────

export const roadmap = {
  Today: [
    { task: "Log today's commute",                  done: true  },
    { task: "Read: 'Where your footprint hides'",   done: true  },
    { task: 'Set a meatless dinner reminder',        done: false },
  ],
  'This Week': [
    { task: 'Two transit commutes',                 done: false },
    { task: 'Compare green energy tariffs',         done: false },
    { task: 'Complete Climate Change module 5',     done: false },
  ],
  'This Month': [
    { task: 'Switch to a renewable plan',           done: false },
    { task: 'Reach a 30-day streak',                done: false },
    { task: 'Run the solar simulator with real bills', done: false },
  ],
  'Long Term': [
    { task: 'Halve your annual footprint',          done: false },
    { task: 'Reach Climate Champion identity',      done: false },
    { task: 'Offset remaining emissions',           done: false },
  ],
} as const;

// ─── Onboarding Questions ─────────────────────────────────────────────────────

export const onboardingQuestions = [
  {
    key: 'transport',
    icon: '🚗',
    title: 'How do you usually get around?',
    options: ['Mostly car', 'Mix of car & transit', 'Transit & cycling', 'I walk / cycle everywhere'],
  },
  {
    key: 'energy',
    icon: '⚡',
    title: 'What powers your home?',
    options: ['Standard grid', 'Some renewables', 'Mostly renewable', 'Fully green / solar'],
  },
  {
    key: 'food',
    icon: '🍽️',
    title: 'How would you describe your diet?',
    options: ['Meat with most meals', 'Meat a few times a week', 'Mostly plant-based', 'Vegetarian / vegan'],
  },
  {
    key: 'shopping',
    icon: '🛍️',
    title: 'How do you shop?',
    options: ['Love new things', 'Balanced', 'Mostly mindful', 'Secondhand & minimal'],
  },
  {
    key: 'interest',
    icon: '💚',
    title: 'What excites you most?',
    options: ['Saving money', 'Cleaner air & nature', 'Cutting-edge green tech', 'Leaving a legacy'],
  },
] as const;
