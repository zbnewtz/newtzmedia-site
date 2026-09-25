// content.js - every word and every sample post in both mockups.
// Plain script (no modules) so the pages work from a static server and Node
// tests can load it with require(). One global: NEWTZ_CONTENT.
// Sample businesses are fictional except NFTek. No reviews, stars or logos.
globalThis.NEWTZ_CONTENT = {
  brand: {
    name: 'NewtzMedia',
    email: 'hello@newtzmedia.example', // placeholder until Zack has an address
    month: 'Sept 2026',                // shown in each card's metadata strip
  },

  // Platform order inside a customer's list is the order its pills appear in.
  platforms: {
    instagram: { id: 'instagram', label: 'Instagram' },
    facebook: { id: 'facebook', label: 'Facebook' },
    x: { id: 'x', label: 'X' },
    linkedin: { id: 'linkedin', label: 'LinkedIn' },
  },

  customers: [
    {
      id: 'nftek', name: 'NFTek', handle: '@nftek', domain: 'nftek.example',
      description: 'Cloud and AI automation consulting',
      platforms: ['linkedin', 'x'],
      campaign: 'Automate the boring part',
      palette: { bg: '#0F1B3D', ink: '#FFFFFF', accent: '#35E0FF' },
      chip: 'Tue 8:00am', motif: 'cloud',
    },
    {
      id: 'brewhaus', name: 'Brew Haus', handle: '@brewhaus', domain: 'brewhaus.example',
      description: 'Neighborhood coffee shop',
      platforms: ['instagram', 'facebook'],
      campaign: 'Fall menu',
      palette: { bg: '#F3E6D3', ink: '#3B2415', accent: '#D9702B' },
      chip: 'Mon 7:00am', motif: 'cup',
    },
    {
      id: 'ironworks', name: 'Ironworks Gym', handle: '@ironworksgym', domain: 'ironworksgym.example',
      description: 'Strength gym',
      platforms: ['instagram', 'facebook', 'x'],
      campaign: 'First month free',
      palette: { bg: '#111111', ink: '#FFFFFF', accent: '#E0202A' },
      chip: 'Wed 6:00am', motif: 'plate',
    },
    {
      id: 'aceauto', name: 'Ace Auto Repair', handle: '@aceautorepair', domain: 'aceautorepair.example',
      description: 'Independent auto shop',
      platforms: ['facebook', 'instagram'],
      campaign: 'Winter check',
      palette: { bg: '#2B4C6F', ink: '#FFFFFF', accent: '#F5C518' },
      chip: 'Thu 9:00am', motif: 'wrench',
    },
  ],

  // The first piece of each campaign is the lead: it goes to every platform the
  // customer has and it is what the interactive hero shows.
  pieces: [
    // NFTek
    {
      id: 'nftek-stat', customer: 'nftek', lead: true, format: '4x5',
      headline: '6 hours to 20 minutes.',
      sub: 'One automation. Every Monday, done before coffee.',
      caption: 'Most of a Monday used to go into one report. Now it builds itself. This is the kind of thing I set up for small teams.',
      hashtags: ['automation', 'smallbusiness', 'cloud'],
      platforms: ['linkedin', 'x'],
    },
    {
      id: 'nftek-carousel', customer: 'nftek', lead: false, format: 'carousel',
      slides: [
        { headline: 'The boring part', sub: 'Copying the same numbers into the same sheet every week.' },
        { headline: 'What we automated', sub: 'The report builds itself and lands in your inbox.' },
        { headline: 'What it took', sub: 'One afternoon. No new software to learn.' },
      ],
      caption: 'Three slides on what automating one weekly report actually looked like.',
      hashtags: ['automation', 'consulting', 'ai'],
      platforms: ['linkedin'],
    },
    {
      id: 'nftek-quote', customer: 'nftek', lead: false, format: '1x1',
      headline: 'If you do it every week, it should do itself.',
      sub: 'NFTek',
      caption: 'A rule I keep coming back to.',
      hashtags: ['automation', 'consulting', 'ai'],
      platforms: ['linkedin', 'x'],
    },
    // Brew Haus
    {
      id: 'brewhaus-fall', customer: 'brewhaus', lead: true, format: '4x5',
      headline: 'The fall menu is here.',
      sub: 'Maple latte, cinnamon cold brew, pumpkin scone.',
      caption: 'Maple latte, cinnamon cold brew and the pumpkin scone are back starting tomorrow. Come early, the scones go fast.',
      hashtags: ['fallmenu', 'coffeeshop', 'maplelatte'],
      platforms: ['instagram', 'facebook'],
    },
    {
      id: 'brewhaus-hours', customer: 'brewhaus', lead: false, format: '1x1',
      headline: 'New hours',
      sub: 'Mon to Fri 6am to 6pm. Sat and Sun 7am to 4pm.',
      caption: 'New hours starting Monday. Earlier on weekdays for the morning crowd.',
      hashtags: ['coffeeshop', 'openearly', 'localcoffee'],
      platforms: ['instagram', 'facebook'],
    },
    {
      id: 'brewhaus-story', customer: 'brewhaus', lead: false, format: '9x16',
      headline: "Today's special",
      sub: 'Maple cold brew, $4 all day.',
      caption: 'Maple cold brew, four dollars, all day today.',
      hashtags: ['coldbrew', 'todaysspecial', 'coffee'],
      platforms: ['instagram', 'facebook'],
    },
    // Ironworks Gym
    {
      id: 'ironworks-free', customer: 'ironworks', lead: true, format: '4x5',
      headline: 'First month free.',
      sub: 'No contract. Just show up.',
      caption: 'Your first month is free. No contract, no sign-up fee. Walk in, train, decide later.',
      hashtags: ['gym', 'firstmonthfree', 'strength'],
      platforms: ['instagram', 'facebook', 'x'],
    },
    {
      id: 'ironworks-schedule', customer: 'ironworks', lead: false, format: '1x1',
      headline: 'This week',
      sub: 'Mon Strength. Tue Spin. Wed Boxing. Thu Strength. Fri Open gym. Sat Bootcamp.',
      caption: "This week's classes. Open gym all day Friday.",
      hashtags: ['gym', 'classschedule', 'training'],
      platforms: ['instagram', 'facebook', 'x'],
    },
    {
      id: 'ironworks-story', customer: 'ironworks', lead: false, format: '9x16',
      headline: '6am club',
      sub: "Doors open 5:45. Coffee's on us.",
      caption: '6am club. Doors open at 5:45 and the coffee is on us.',
      hashtags: ['6amclub', 'gym', 'earlybird'],
      platforms: ['instagram', 'facebook'],
    },
    // Ace Auto Repair
    {
      id: 'aceauto-brakes', customer: 'aceauto', lead: true, format: '4x5',
      headline: 'Free brake inspection.',
      sub: 'All November. No appointment needed.',
      caption: 'Free brake inspection all November. Drive in, no appointment needed.',
      hashtags: ['brakes', 'autorepair', 'november'],
      platforms: ['facebook', 'instagram'],
    },
    {
      id: 'aceauto-hiring', customer: 'aceauto', lead: false, format: '1x1',
      headline: "We're hiring.",
      sub: 'One full-time technician. Apply in the shop or by email.',
      caption: "We're hiring one full-time technician. Apply in the shop or by email.",
      hashtags: ['hiring', 'mechanic', 'autorepair'],
      platforms: ['facebook', 'instagram'],
    },
    {
      id: 'aceauto-tip', customer: 'aceauto', lead: false, format: '4x5',
      headline: 'Cold morning?',
      sub: 'Check your tire pressure. It drops one PSI for every ten degrees.',
      caption: 'Cold morning? Tire pressure drops about one PSI for every ten degrees. Check it before the long drive.',
      hashtags: ['cartips', 'winter', 'autorepair'],
      platforms: ['facebook', 'instagram'],
    },
  ],

  // Flat geometric marks, one per customer. Decorative: aria-hidden in the art.
  motifs: {
    cloud: '<svg viewBox="0 0 48 48" aria-hidden="true" focusable="false"><path d="M14 34h20a8 8 0 0 0 1-15.9A11 11 0 0 0 14 20a7 7 0 0 0 0 14Z" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/><path d="M17 34v7M24 34v7M31 34v7" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg>',
    cup: '<svg viewBox="0 0 48 48" aria-hidden="true" focusable="false"><path d="M10 14h24v12a10 10 0 0 1-10 10h-4a10 10 0 0 1-10-10Z" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/><path d="M34 18h3a5 5 0 0 1 0 10h-3" fill="none" stroke="currentColor" stroke-width="3"/><path d="M8 42h30" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg>',
    plate: '<svg viewBox="0 0 48 48" aria-hidden="true" focusable="false"><path d="M6 24h36" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><rect x="10" y="13" width="6" height="22" rx="1" fill="currentColor"/><rect x="32" y="13" width="6" height="22" rx="1" fill="currentColor"/><rect x="3" y="17" width="4" height="14" rx="1" fill="currentColor"/><rect x="41" y="17" width="4" height="14" rx="1" fill="currentColor"/></svg>',
    wrench: '<svg viewBox="0 0 48 48" aria-hidden="true" focusable="false"><path d="M40 13a10 10 0 0 1-13.2 12.4L13 39.2a3.5 3.5 0 0 1-5-5l13.8-13.8A10 10 0 0 1 35 7l-6 6 1.5 4.5L35 19Z" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/></svg>',
  },

  steps: [
    { title: 'We talk', body: 'A short call about your business and who you want walking in.' },
    { title: 'I draft, you approve', body: 'A month of posts at once. Change anything.' },
    { title: 'They go out', body: 'Scheduled and posted for you, with a recap each month.' },
  ],

  // Placeholder numbers, sized to test the layout. Not Zack's real prices.
  tiers: [
    { id: 'starter', name: 'Starter', price: '$150', posts: '8 posts a month', platforms: '1 platform', recommended: false },
    { id: 'standard', name: 'Standard', price: '$300', posts: '16 posts a month', platforms: '2 platforms', recommended: true },
    { id: 'full', name: 'Full', price: '$500', posts: '30 posts a month, plus stories', platforms: 'Every platform', recommended: false },
  ],

  copy: {
    subline: 'I make a month of social posts for local businesses. You approve them, I schedule them. From $150 a month.',
    sublineNoPrice: 'I make a month of social posts for local businesses. You approve them, I schedule them.',
    seeWork: 'See the work',
    pricing: 'Pricing',
    emailMe: 'Email me',
    contactLine: "Tell me about your business and I'll reply within a day.",
    footerNote: 'Sample work. Businesses shown are fictional except NFTek.',
    perMonth: '/month',
    recommended: 'Recommended',
    tierButton: 'Email me about {tier}',
    scheduled: 'Scheduled',
    learnMore: 'Learn more',
    story: 'Story',
    lightboxClose: 'Close',
    pause: 'Pause',
    play: 'Play',
  },

  taglines: {
    minimal: [
      { key: 'a', text: 'You run the shop. I run the feed.', accent: 'feed' },
      { key: 'b', text: 'Posts your customers actually stop for.', accent: 'stop' },
      { key: 'c', text: 'Your business, posted. Every week.', accent: 'posted' },
    ],
    interactive: [
      { key: 'a', text: 'Your business, posted every week.', dropsPrice: false },
      { key: 'b', text: 'Social media, handled. From $150 a month.', dropsPrice: true },
      { key: 'c', text: 'The posts get made. You get your evenings back.', dropsPrice: false },
    ],
  },
};
