import { analyzeSentiment, type SentimentResult } from "./sentiment";

export interface DatasetEntry {
  id: number;
  text: string;
  source: string;
  timestamp: string;
  result: SentimentResult;
}

const rawData = [
  { text: "I absolutely love this new phone! The camera quality is incredible and the battery lasts all day.", source: "Twitter" },
  { text: "Worst customer service experience ever. Waited 3 hours on hold and they couldn't help me.", source: "Twitter" },
  { text: "The weather today is cloudy with a chance of rain later this afternoon.", source: "Twitter" },
  { text: "Just had the most amazing dinner at the new Italian restaurant downtown. Highly recommend!", source: "Instagram" },
  { text: "This product is a complete waste of money. It broke after just two days of use.", source: "Amazon" },
  { text: "The meeting has been rescheduled to 3 PM tomorrow.", source: "Twitter" },
  { text: "So grateful for all the support from my friends and family. Feeling blessed!", source: "Facebook" },
  { text: "The movie was extremely disappointing. Terrible acting and boring plot.", source: "Reddit" },
  { text: "Traffic on highway 101 is moving slowly due to construction.", source: "Twitter" },
  { text: "Best vacation ever! The beach was beautiful and the hotel was perfect.", source: "Instagram" },
  { text: "I'm never buying from this company again. The quality has gone downhill.", source: "Amazon" },
  { text: "The conference will be held at the convention center from 9 AM to 5 PM.", source: "Twitter" },
  { text: "This app is fantastic! So easy to use and it saves me so much time.", source: "App Store" },
  { text: "Horrible experience with the delivery service. Package arrived damaged and late.", source: "Amazon" },
  { text: "The stock market closed at 34,500 points today, up 0.5% from yesterday.", source: "Twitter" },
  { text: "Really happy with my purchase! Great quality and fast shipping. Will buy again!", source: "Amazon" },
  { text: "The food was disgusting and the restaurant was dirty. Never going back.", source: "Yelp" },
  { text: "Today's temperature will range between 65 and 75 degrees Fahrenheit.", source: "Twitter" },
  { text: "Such a wonderful surprise party! Thank you everyone for making my birthday special!", source: "Facebook" },
  { text: "Frustrating experience trying to return a defective product. No help at all.", source: "Amazon" },
  { text: "The new software update includes bug fixes and performance improvements.", source: "Twitter" },
  { text: "I'm so excited about the new features! This is exactly what I needed.", source: "Reddit" },
  { text: "Terrible quality product. Looks nothing like the pictures. Total scam.", source: "Amazon" },
  { text: "The library will be closed on weekends for the next two months.", source: "Twitter" },
  { text: "Amazing customer support! They resolved my issue quickly and were very friendly.", source: "Twitter" },
  { text: "The laptop keeps crashing and the battery life is awful. Very disappointed.", source: "Amazon" },
  { text: "Registration for the event opens on Monday at 10 AM.", source: "Twitter" },
  { text: "Love the new design! It's sleek, modern, and very comfortable to use.", source: "Reddit" },
  { text: "Waited 45 minutes for cold food. The waiter was rude and unhelpful.", source: "Yelp" },
  { text: "The train schedule has been updated for the holiday weekend.", source: "Twitter" },
  { text: "This is the best coffee I've ever had! Smooth, rich, and absolutely delicious.", source: "Instagram" },
  { text: "Product stopped working after a week. Cheap materials and poor craftsmanship.", source: "Amazon" },
  { text: "New parking regulations will go into effect starting next month.", source: "Twitter" },
  { text: "Had an incredible time at the concert! The band was fantastic and the crowd was great.", source: "Instagram" },
  { text: "The app crashes constantly and customer support is useless. Waste of money.", source: "App Store" },
  { text: "The next city council meeting is scheduled for Thursday evening.", source: "Twitter" },
  { text: "So happy with this purchase! Excellent quality and it arrived earlier than expected.", source: "Amazon" },
  { text: "Never buying this brand again. Poor quality and misleading advertising.", source: "Amazon" },
  { text: "The school will hold parent-teacher conferences next Tuesday.", source: "Twitter" },
  { text: "Absolutely brilliant movie! Great story, amazing acting, and beautiful cinematography.", source: "Reddit" },
  { text: "This is not what I ordered. Wrong size and wrong color. Very frustrating.", source: "Amazon" },
  { text: "Bus route 42 will be temporarily rerouted due to road work.", source: "Twitter" },
  { text: "Can't recommend this enough! Life-changing product that everyone should try.", source: "Instagram" },
  { text: "Broken on arrival. No refund offered. Terrible company to deal with.", source: "Amazon" },
  { text: "The museum exhibit opens to the public on Saturday.", source: "Twitter" },
  { text: "Such a fun and exciting experience! Would definitely do it again!", source: "Facebook" },
  { text: "Overpriced and underperforming. There are much better alternatives available.", source: "Reddit" },
  { text: "The gym will have reduced hours during the renovation period.", source: "Twitter" },
  { text: "Best decision I've made all year! This service has exceeded all my expectations.", source: "Twitter" },
  { text: "Absolutely horrible. Regret every penny spent on this useless product.", source: "Amazon" },
];

const sources = ["Twitter", "Instagram", "Facebook", "Reddit", "Amazon", "Yelp", "App Store"];

function randomDate(): string {
  const start = new Date(2025, 0, 1);
  const end = new Date(2025, 5, 30);
  const d = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return d.toISOString().split("T")[0];
}

export const dataset: DatasetEntry[] = rawData.map((item, i) => ({
  id: i + 1,
  text: item.text,
  source: item.source,
  timestamp: randomDate(),
  result: analyzeSentiment(item.text),
})).sort((a, b) => a.timestamp.localeCompare(b.timestamp));

export function getStats() {
  const total = dataset.length;
  const positive = dataset.filter(d => d.result.label === "Positive").length;
  const negative = dataset.filter(d => d.result.label === "Negative").length;
  const neutral = dataset.filter(d => d.result.label === "Neutral").length;
  const avgConfidence = dataset.reduce((s, d) => s + d.result.confidence, 0) / total;

  const bySource = sources.reduce((acc, src) => {
    const items = dataset.filter(d => d.source === src);
    if (items.length > 0) {
      acc.push({
        source: src,
        total: items.length,
        positive: items.filter(d => d.result.label === "Positive").length,
        negative: items.filter(d => d.result.label === "Negative").length,
        neutral: items.filter(d => d.result.label === "Neutral").length,
      });
    }
    return acc;
  }, [] as { source: string; total: number; positive: number; negative: number; neutral: number }[]);

  return { total, positive, negative, neutral, avgConfidence, bySource };
}
