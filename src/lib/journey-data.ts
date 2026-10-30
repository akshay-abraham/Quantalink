interface JourneyEvent {
  title: string;
  tag: string;
  detail: string;
  highlight?: string;
  postUrl?: string;
  photo: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
}

export const journey: JourneyEvent[] = [
  {
    title: 'The first presentation. The first spark.',
    tag: '15 October 2025 · AI workshop',
    detail:
      'Lyra was just 24 hours old when I gave my first presentation at an AI workshop and community outreach event. Educators told me, “Call us immediately. We need it for our children.” That kind of response is often the first thing I hear when I present Lyra. More recently, AIBoomi judge Vineeth Rajagopal wrote, “I’ll wait for Lyra to come out and ask my kids to use it.” Moments like these show me the impact Lyra could have.',
    photo: {
      src: '/events/akshay-abraham-first-presentation.webp',
      alt: 'Akshay Abraham (Akshay K Rooben Abraham) presenting Lyra at an AI workshop and community outreach event',
      width: 798,
      height: 950,
    },
  },
  {
    title: 'My first hackathon · Hack4Future',
    tag: 'November 2025 · 2nd place',
    postUrl: 'https://lnkd.in/p/dcWbpKcx',
    detail:
      'Took Lyra to my first hackathon, organised by Saraswathi Vidyanikethan, Elamakkara, Kochi. Won second place, met other builders, and brought back new questions to work on.',
    photo: {
      src: '/events/akshay-abraham-hack4future-2025.webp',
      alt: 'Akshay Abraham (Akshay K Rooben Abraham) at the Hack4Future 2025 award presentation in Kochi',
      width: 1600,
      height: 1067,
    },
  },
  {
    title: 'Hackfinity · Taking Lyra further',
    tag: 'November 2025 · 1st place',
    postUrl: 'https://lnkd.in/p/d9rQNQ8v',
    detail:
      'Won first place at Hackfinity, organised by HowNWhy Education at St. John’s Central School, Anchal. Another opportunity to share Lyra and listen to how people wanted to use it.',
    photo: {
      src: '/events/akshay-abraham-hackfinity-2025.webp',
      alt: 'Akshay Abraham (Akshay K Rooben Abraham) at the Hackfinity 2025 award presentation in Anchal',
      width: 1600,
      height: 1066,
    },
  },
  {
    title: 'SAMEEKSHA · Building momentum',
    tag: 'February 2026 · 1st place',
    postUrl: 'https://lnkd.in/p/dcWbpKcx',
    detail:
      'Presented Lyra at SAMEEKSHA, part of SRISHTI at Saintgits College of Engineering, and won first place. Each conversation helped sharpen the system and the problem it was trying to solve.',
    photo: {
      src: '/events/akshay-abraham-sameeksha-2026.webp',
      alt: 'Akshay Abraham (Akshay K Rooben Abraham) receiving an award at SAMEEKSHA 2026',
      width: 1600,
      height: 1066,
    },
  },
  {
    title: 'Y Combinator Startup School India',
    tag: 'April 2026 · A room full of builders',
    postUrl: 'https://lnkd.in/p/dJ3asZcv',
    detail:
      'Selected for and attended YC Startup School India in April 2026. Learned from founders and other builders, with a few ideas that stayed with me: build with intention, launch, and listen closely to users.',
    photo: {
      src: '/events/akshay-abraham-yc-startup-school-india.webp',
      alt: 'Akshay Abraham (Akshay K Rooben Abraham) at Y Combinator Startup School India',
      width: 1600,
      height: 900,
    },
  },
  {
    title: 'HackTVM Access Point',
    tag: 'October 2026 · 1st place',
    detail:
      'At my first live hackathon, Chris V Jacob and I spent seven hours shaping the first versions of Mitra and MNEMO. Hosted by Good Shepherd School in Thiruvananthapuram, we finished first by points among the five teams advancing to Phase 2. Next, we’ll develop the projects further for the demo day in January.',
    highlight: 'Chris V Jacob',
    photo: {
      src: '/events/akshay-abraham-hacktvm-access-point-2026.webp',
      alt: 'Akshay Abraham (Akshay K Rooben Abraham) and Chris V Jacob at HackTVM Access Point 2026',
      width: 1440,
      height: 1080,
    },
  },
  {
    title: 'AIBoomi Startup Weekend Kochi',
    tag: '23–24 October 2026 · 1st place',
    postUrl: 'https://lnkd.in/p/d3JYpKx4',
    detail:
      'Competed with Lyra as the youngest solo team in a 20-hour buildathon with 76 teams and around 140 participants. Won first place and received $10,000 in OpenAI API credits. The most meaningful part was seeing people connect with what I was building.',
    photo: {
      src: '/events/akshay-abraham-aiboomi-kochi.webp',
      alt: 'Akshay Abraham (Akshay K Rooben Abraham) receiving first prize at AIBoomi Startup Weekend Kochi',
      width: 1600,
      height: 1067,
    },
  },
];
