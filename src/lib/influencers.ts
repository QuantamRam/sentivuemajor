import { analyzeSentiment, SentimentResult } from "./sentiment";

export interface Tweet {
  id: number;
  text: string;
  date: string;
  likes: number;
  retweets: number;
  result: SentimentResult;
}

export interface Influencer {
  id: number;
  name: string;
  handle: string;
  avatar: string;
  category: string;
  followers: string;
  tweets: Tweet[];
  stats: {
    positive: number;
    negative: number;
    neutral: number;
    total: number;
    avgScore: number;
  };
}

const rawInfluencers: Omit<Influencer, "tweets" | "stats" | "id">[] = [
  {
    name: "Elon Musk",
    handle: "@elonmusk",
    avatar: "https://i.pravatar.cc/150?img=11",
    category: "Tech & Business",
    followers: "195M",
  },
  {
    name: "Narendra Modi",
    handle: "@naaborendramodi",
    avatar: "https://i.pravatar.cc/150?img=12",
    category: "Politics",
    followers: "100M",
  },
  {
    name: "Barack Obama",
    handle: "@BarackObama",
    avatar: "https://i.pravatar.cc/150?img=13",
    category: "Politics",
    followers: "133M",
  },
  {
    name: "Cristiano Ronaldo",
    handle: "@Cristiano",
    avatar: "https://i.pravatar.cc/150?img=14",
    category: "Sports",
    followers: "112M",
  },
  {
    name: "Taylor Swift",
    handle: "@taylorswift13",
    avatar: "https://i.pravatar.cc/150?img=25",
    category: "Entertainment",
    followers: "95M",
  },
  {
    name: "Bill Gates",
    handle: "@BillGates",
    avatar: "https://i.pravatar.cc/150?img=16",
    category: "Tech & Philanthropy",
    followers: "65M",
  },
  {
    name: "Virat Kohli",
    handle: "@imVkohli",
    avatar: "https://i.pravatar.cc/150?img=17",
    category: "Sports",
    followers: "62M",
  },
  {
    name: "Rihanna",
    handle: "@rihanna",
    avatar: "https://i.pravatar.cc/150?img=26",
    category: "Entertainment",
    followers: "108M",
  },
  {
    name: "Jeff Bezos",
    handle: "@JeffBezos",
    avatar: "https://i.pravatar.cc/150?img=19",
    category: "Tech & Business",
    followers: "35M",
  },
  {
    name: "Sundar Pichai",
    handle: "@sundaborpichai",
    avatar: "https://i.pravatar.cc/150?img=20",
    category: "Tech",
    followers: "8M",
  },
];

const tweetTexts: Record<string, string[]> = {
  "@elonmusk": [
    "Excited to announce that Tesla deliveries exceeded expectations this quarter! Great work by the team 🚀",
    "The legacy media is absolutely terrible. Completely broken and full of lies.",
    "SpaceX Starship is the most incredible engineering achievement in decades. Amazing progress!",
    "Government regulations are destroying innovation and making everything worse for people",
    "AI is going to be the most transformative technology ever. The future is exciting!",
    "Twitter is now profitable and growing faster than ever. Love this platform!",
    "The woke mind virus is the biggest threat to civilization. Disgusting ideology.",
    "Working on making life multiplanetary. Nothing more important than this. Grateful for the team.",
    "Bureaucracy is a terrible disease that kills productivity and wastes everyone's time",
    "Just had the most amazing test flight. Engineering perfection. So proud of SpaceX!",
  ],
  "@naaborendramodi": [
    "India's digital transformation is a wonderful success story. Proud of our great nation!",
    "Corruption and inefficiency in the old system was terrible for our people",
    "Launched new initiative for clean energy. India is leading the world. Excellent progress!",
    "The opposition spreads nothing but lies and hate. Pathetic politics.",
    "Congratulations to our brilliant athletes! You make India proud. Fantastic achievement!",
    "Poverty and poor infrastructure are problems we will solve with determination",
    "India's space program is incredible. ISRO makes us all grateful and happy!",
    "Terrorism is a disgusting threat that we will never tolerate",
    "Digital India is making life easy and convenient for millions. Beautiful progress!",
    "Some critics are useless and only complain. We focus on positive action and results.",
  ],
  "@BarackObama": [
    "Democracy is a beautiful thing worth protecting. Grateful for those who serve.",
    "The inequality gap is a terrible problem that hurts millions of families",
    "Michelle and I are so happy to see young people fighting for a better world!",
    "Climate change denial is dangerous and irresponsible. We can't waste more time.",
    "Reading is wonderful. Here are my favorite books this year — each one is brilliant!",
    "Gun violence is a horrible epidemic that we've failed to address properly",
    "So proud of the amazing work being done in communities across the country!",
    "Disinformation is a frustrating challenge that threatens our democracy",
    "Happy Thanksgiving! Grateful for family, friends, and the incredible resilience of Americans.",
    "The broken healthcare system disappoints millions who deserve better care.",
  ],
  "@Cristiano": [
    "Amazing win today! The team played brilliantly and I'm so happy! 💪⚽",
    "Disappointed with the loss. We were terrible in the second half. Must improve.",
    "Grateful for all the love and support from my incredible fans worldwide! ❤️",
    "Injuries are frustrating. Hate being away from the pitch. Can't wait to return.",
    "New personal record! Hard work pays off. Feeling great and blessed! 🏆",
    "Bad refereeing decisions are ruining the beautiful game. Very disappointing.",
    "Family time is the best. Love spending time with my wonderful kids! ❤️",
    "Lost a tough match. Angry at our poor performance. No excuses.",
    "What an outstanding season! Thank you to everyone who believed in us!",
    "The criticism is unfair and annoying. Actions speak louder than words.",
  ],
  "@taylorswift13": [
    "So excited to announce my new album! This is the most incredible creative journey! 💕",
    "Heartbroken about the terrible state of artist rights in the music industry",
    "Thank you Swifties! Your love and support is the most beautiful thing ever! ✨",
    "It's disgusting how some people exploit artists and take away their life's work",
    "Had the most amazing night performing for you all! Best fans in the world! 🎶",
    "The hate and negativity online is really sad and frustrating sometimes",
    "I'm so happy and grateful for every single moment of this incredible tour!",
    "Disappointed by the unfair criticism. It's hurtful and unnecessary.",
    "Making music is the most wonderful and fulfilling thing in my life! Love it!",
    "The industry can be really difficult and complicated for young artists starting out.",
  ],
  "@BillGates": [
    "Incredible progress on malaria vaccine trials! Science is amazing and gives me hope!",
    "Climate change is the worst crisis facing humanity. We're failing to act fast enough.",
    "Excited about new innovations in clean energy. The future looks brilliant!",
    "Poverty is a terrible problem, but I'm optimistic we can solve it with the right approach.",
    "Great conversation with brilliant researchers working on outstanding health solutions!",
    "The pandemic response was disappointing in many countries. We must do better.",
    "AI will be the most transformative technology since the personal computer. Very exciting!",
    "Poor sanitation kills millions. It's a horrible and preventable tragedy.",
    "Love recommending books! This one was absolutely fantastic and easy to read.",
    "Misinformation is a frustrating problem that complicates every important issue.",
  ],
  "@imVkohli": [
    "What an amazing victory! So proud of this incredible team! 🏏💪",
    "Terrible bowling today. We need to work harder and fix our problems.",
    "Grateful for the love from cricket fans! You all are wonderful and the best! ❤️",
    "Disappointing loss. Bad performance all around. Very frustrating.",
    "New fitness milestone achieved! Feeling great and loving the process! 🔥",
    "The pitch conditions were awful and unfair. Poor preparation.",
    "So happy to be back on the field! Love this beautiful game! 🏏",
    "Hate losing like that. Terrible execution under pressure. Must be better.",
    "Had an amazing session with the team. The energy is fantastic and positive!",
    "Dealing with online hate is annoying but I stay focused on what matters.",
  ],
  "@rihanna": [
    "Fenty Beauty just launched something incredible! So excited and proud! 💄✨",
    "The fashion industry has terrible representation problems. Not good enough.",
    "Love creating products that make everyone feel beautiful and confident! ❤️",
    "It's disgusting how some brands exploit workers. Unacceptable.",
    "Amazing show tonight! The energy was fantastic! Best fans ever! 🎤",
    "Hate how slow progress is on important social issues. Frustrating.",
    "So grateful and happy for this wonderful journey. Blessed beyond measure! 🙏",
    "The negativity online is exhausting and pointless. Sad reality.",
    "Fenty is all about making everyone feel included. Love this mission! 💕",
    "Some industry practices are horrible and need to change immediately.",
  ],
  "@JeffBezos": [
    "Blue Origin had an amazing launch today! Incredible achievement by the team! 🚀",
    "Climate change is the most dangerous threat we face. The situation is bad.",
    "Excited to support brilliant entrepreneurs through the Bezos Earth Fund!",
    "Bureaucratic waste is a terrible problem that slows down important progress.",
    "The future of space exploration is fantastic and full of incredible possibilities!",
    "Disappointed by the slow pace of climate action worldwide. Not fast enough.",
    "Great meeting with amazing innovators working on outstanding solutions!",
    "Supply chain problems are frustrating and hurt small businesses the worst.",
    "Love seeing customers happy with fast, reliable, and convenient delivery!",
    "Poor internet access in rural areas is a sad problem we need to solve.",
  ],
  "@sundaborpichai": [
    "Excited to announce incredible new AI features in Google products! Amazing progress!",
    "The digital divide is a terrible problem affecting billions of people worldwide.",
    "Proud of our brilliant team pushing boundaries in quantum computing! Outstanding work!",
    "Misinformation online is a frustrating and dangerous challenge we must address.",
    "Google's commitment to sustainability is wonderful. We're making great progress!",
    "Privacy concerns are a serious issue. We need to do better on this front.",
    "AI is going to help solve some of humanity's most difficult problems. Exciting future!",
    "Disappointed that technology access remains unfair across many regions.",
    "Love seeing developers build amazing apps on our platform! The creativity is fantastic!",
    "Slow internet infrastructure is a terrible barrier to education and opportunity.",
  ],
};

function buildInfluencers(): Influencer[] {
  return rawInfluencers.map((inf, idx) => {
    const handle = inf.handle;
    const texts = tweetTexts[handle] || [];
    const tweets: Tweet[] = texts.map((text, ti) => {
      const result = analyzeSentiment(text);
      return {
        id: idx * 100 + ti + 1,
        text,
        date: `2025-${String(1 + (ti % 12)).padStart(2, "0")}-${String(5 + ti * 2).padStart(2, "0")}`,
        likes: Math.floor(Math.random() * 500000) + 10000,
        retweets: Math.floor(Math.random() * 100000) + 1000,
        result,
      };
    });

    const positive = tweets.filter((t) => t.result.label === "Positive").length;
    const negative = tweets.filter((t) => t.result.label === "Negative").length;
    const neutral = tweets.filter((t) => t.result.label === "Neutral").length;
    const avgScore = tweets.reduce((s, t) => s + t.result.score, 0) / tweets.length;

    return {
      id: idx + 1,
      ...inf,
      tweets,
      stats: { positive, negative, neutral, total: tweets.length, avgScore },
    };
  });
}

export const influencers = buildInfluencers();

export function getInfluencerOverview() {
  const total = influencers.reduce((s, i) => s + i.stats.total, 0);
  const positive = influencers.reduce((s, i) => s + i.stats.positive, 0);
  const negative = influencers.reduce((s, i) => s + i.stats.negative, 0);
  const neutral = influencers.reduce((s, i) => s + i.stats.neutral, 0);
  return { total, positive, negative, neutral, count: influencers.length };
}
