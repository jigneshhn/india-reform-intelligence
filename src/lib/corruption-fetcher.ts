import { createHash } from "crypto";
import Parser from "rss-parser";
import { CorruptionItem } from "./types";

const parser = new Parser({
  timeout: 12000,
  headers: { "User-Agent": "IndiaReformIntelligence/2.0 (+https://github.com)" },
});

export interface NewspaperSource {
  id: string;
  name: string;
  nameHi: string;
  url: string;
  region: string;
}

export const INDIAN_NEWSPAPERS: NewspaperSource[] = [
  {
    id: "the-hindu",
    name: "The Hindu",
    nameHi: "द हिंदू",
    url: "https://www.thehindu.com/news/national/feeder/default.rss",
    region: "National",
  },
  {
    id: "indian-express",
    name: "Indian Express",
    nameHi: "इंडियन एक्सप्रेस",
    url: "https://indianexpress.com/section/india/feed/",
    region: "National",
  },
  {
    id: "times-of-india",
    name: "Times of India",
    nameHi: "टाइम्स ऑफ इंडिया",
    url: "https://timesofindia.indiatimes.com/rssfeedstopstories.cms",
    region: "National",
  },
  {
    id: "hindustan-times",
    name: "Hindustan Times",
    nameHi: "हिंदुस्तान टाइम्स",
    url: "https://www.hindustantimes.com/feeds/rss/india-news/rssfeed.xml",
    region: "National",
  },
  {
    id: "ndtv",
    name: "NDTV",
    nameHi: "एनडीटीवी",
    url: "https://feeds.feedburner.com/ndtvnews-india-news",
    region: "National",
  },
  {
    id: "economic-times",
    name: "Economic Times",
    nameHi: "इकोनॉमिक टाइम्स",
    url: "https://economictimes.indiatimes.com/news/india/rssfeeds/2888996.cms",
    region: "National",
  },
  {
    id: "india-today",
    name: "India Today",
    nameHi: "इंडिया टुडे",
    url: "https://www.indiatoday.in/rss/home",
    region: "National",
  },
  {
    id: "deccan-herald",
    name: "Deccan Herald",
    nameHi: "डक्कन हेराल्ड",
    url: "https://www.deccanherald.com/rss/national.rss",
    region: "South",
  },
  {
    id: "tribune",
    name: "The Tribune",
    nameHi: "द ट्रिब्यून",
    url: "https://www.tribuneindia.com/rss/feed?id=2",
    region: "North",
  },
  {
    id: "telegraph",
    name: "The Telegraph",
    nameHi: "द टेलीग्राफ",
    url: "https://www.telegraphindia.com/rss",
    region: "East",
  },
  {
    id: "livemint",
    name: "Livemint",
    nameHi: "लाइवमिंट",
    url: "https://www.livemint.com/rss/news",
    region: "National",
  },
  {
    id: "scroll",
    name: "Scroll.in",
    nameHi: "स्क्रॉल",
    url: "https://scroll.in/rss/all",
    region: "National",
  },
];

const GOOGLE_NEWS_CORRUPTION_FEEDS = [
  {
    query: "corruption+india+site:thehindu.com",
    newspaperId: "the-hindu",
    name: "The Hindu",
  },
  {
    query: "corruption+scam+site:indianexpress.com",
    newspaperId: "indian-express",
    name: "Indian Express",
  },
  {
    query: "corruption+bribe+site:timesofindia.indiatimes.com",
    newspaperId: "times-of-india",
    name: "Times of India",
  },
  {
    query: "corruption+investigation+site:hindustantimes.com",
    newspaperId: "hindustan-times",
    name: "Hindustan Times",
  },
  {
    query: "corruption+raid+site:ndtv.com",
    newspaperId: "ndtv",
    name: "NDTV",
  },
  {
    query: "corruption+fraud+site:economictimes.indiatimes.com",
    newspaperId: "economic-times",
    name: "Economic Times",
  },
  {
    query: "भ्रष्टाचार+भारत",
    newspaperId: "hindi-news",
    name: "Hindi Media",
  },
];

const CORRUPTION_KEYWORDS = [
  "corruption", "corrupt", "bribe", "bribery", "scam", "fraud", "graft",
  "kickback", "embezzle", "lokayukta", "vigilance", "cbi", "ed raid",
  "enforcement directorate", "income tax raid", "money laundering",
  "disproportionate assets", "hawala", "shell company", "benami",
  "भ्रष्टाचार", "रिश्वत", "घोटाला", "जाँच", "जांच", "किकबैक",
];

const SEVERITY_KEYWORDS = {
  critical: ["scam", "fraud", "raid", "arrested", "crore", "billion", "cbi", "ed raid", "घोटाला", "गिरफ्तार"],
  high: ["corruption", "bribery", "investigation", "probe", "allegation", "भ्रष्टाचार", "रिश्वत"],
  medium: ["concern", "report", "alleged", "suspected"],
};

function generateId(link: string, title: string, pubDate: string): string {
  return createHash("sha256").update(`${link}|${title}|${pubDate}`).digest("hex").slice(0, 24);
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .trim();
}

function isCorruptionRelated(text: string): boolean {
  const lower = text.toLowerCase();
  return CORRUPTION_KEYWORDS.some((k) => lower.includes(k.toLowerCase()));
}

function detectSeverity(title: string, description: string): CorruptionItem["severity"] {
  const text = `${title} ${description}`.toLowerCase();
  if (SEVERITY_KEYWORDS.critical.some((k) => text.includes(k))) return "critical";
  if (SEVERITY_KEYWORDS.high.some((k) => text.includes(k))) return "high";
  if (SEVERITY_KEYWORDS.medium.some((k) => text.includes(k))) return "medium";
  return "low";
}

function isToday(dateStr: string): boolean {
  const date = new Date(dateStr);
  const now = new Date();
  const diffDays = (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24);
  return diffDays <= 7;
}

async function fetchFromNewspaper(paper: NewspaperSource): Promise<CorruptionItem[]> {
  try {
    const parsed = await parser.parseURL(paper.url);
    return (parsed.items || [])
      .filter((item) => {
        const text = `${item.title || ""} ${item.contentSnippet || ""}`;
        return isCorruptionRelated(text);
      })
      .slice(0, 8)
      .map((item) => {
        const title = item.title || "Untitled";
        const description = stripHtml(item.contentSnippet || item.content || "");
        return {
          id: generateId(item.link || title, title, item.pubDate || ""),
          title,
          description: description.slice(0, 400),
          link: item.link || "#",
          pubDate: item.pubDate || new Date().toISOString(),
          source: paper.name,
          newspaper: paper.name,
          newspaperId: paper.id,
          region: paper.region,
          sector: "corruption" as const,
          severity: detectSeverity(title, description),
        };
      });
  } catch {
    return [];
  }
}

async function fetchFromGoogleNews(
  feed: (typeof GOOGLE_NEWS_CORRUPTION_FEEDS)[0]
): Promise<CorruptionItem[]> {
  try {
    const url = `https://news.google.com/rss/search?q=${feed.query}&hl=en-IN&gl=IN&ceid=IN:en`;
    const parsed = await parser.parseURL(url);
    return (parsed.items || []).slice(0, 5).map((item) => {
      const title = item.title || "Untitled";
      const description = stripHtml(item.contentSnippet || item.content || "");
      return {
        id: generateId(item.link || title, title, item.pubDate || ""),
        title,
        description: description.slice(0, 400),
        link: item.link || "#",
        pubDate: item.pubDate || new Date().toISOString(),
        source: feed.name,
        newspaper: feed.name,
        newspaperId: feed.newspaperId,
        region: "National",
        sector: "corruption" as const,
        severity: detectSeverity(title, description),
      };
    });
  } catch {
    return [];
  }
}

let cache: { data: CorruptionItem[]; timestamp: number } | null = null;
const CACHE_TTL_MS = 30 * 60 * 1000;

export async function fetchDailyCorruption(): Promise<{
  items: CorruptionItem[];
  source: "live" | "fallback" | "cache";
}> {
  if (cache && Date.now() - cache.timestamp < CACHE_TTL_MS) {
    return { items: cache.data, source: "cache" };
  }

  const results = await Promise.allSettled([
    ...INDIAN_NEWSPAPERS.map(fetchFromNewspaper),
    ...GOOGLE_NEWS_CORRUPTION_FEEDS.map(fetchFromGoogleNews),
  ]);

  const allItems: CorruptionItem[] = [];
  for (const result of results) {
    if (result.status === "fulfilled") {
      allItems.push(...result.value);
    }
  }

  const unique = new Map<string, CorruptionItem>();
  for (const item of allItems) {
    const key = item.title.toLowerCase().trim();
    if (!unique.has(key)) {
      unique.set(key, item);
    }
  }

  let items = Array.from(unique.values())
    .filter((item) => isToday(item.pubDate))
    .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

  if (items.length === 0) {
    items = Array.from(unique.values())
      .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())
      .slice(0, 60);
  }

  if (items.length === 0) {
    return { items: getFallbackCorruption(), source: "fallback" };
  }

  cache = { data: items, timestamp: Date.now() };
  return { items, source: "live" };
}

export function getFallbackCorruption(): CorruptionItem[] {
  const now = new Date();
  return [
    {
      id: "corr-fb-1",
      title: "CBI registers FIR in multi-crore infrastructure kickback case",
      description: "Central Bureau of Investigation has registered a case involving alleged kickbacks in government road contracts across three states, with preliminary estimates exceeding ₹500 crore.",
      link: "#",
      pubDate: now.toISOString(),
      source: "The Hindu",
      newspaper: "The Hindu",
      newspaperId: "the-hindu",
      region: "National",
      sector: "corruption",
      severity: "critical",
    },
    {
      id: "corr-fb-2",
      title: "ED attaches assets worth ₹120 crore in bank fraud probe",
      description: "Enforcement Directorate provisionally attached immovable properties linked to a former public sector bank official accused of sanctioning loans in exchange for bribes.",
      link: "#",
      pubDate: now.toISOString(),
      source: "Economic Times",
      newspaper: "Economic Times",
      newspaperId: "economic-times",
      region: "National",
      sector: "corruption",
      severity: "critical",
    },
    {
      id: "corr-fb-3",
      title: "Lokayukta recommends suspension of officials in procurement scam",
      description: "State Lokayukta submitted a report recommending immediate suspension of five officials involved in inflated tender awards for healthcare equipment.",
      link: "#",
      pubDate: new Date(now.getTime() - 86400000).toISOString(),
      source: "Indian Express",
      newspaper: "Indian Express",
      newspaperId: "indian-express",
      region: "National",
      sector: "corruption",
      severity: "high",
    },
    {
      id: "corr-fb-4",
      title: "Income Tax raids uncover unaccounted cash at contractor premises",
      description: "IT department conducted simultaneous searches at 12 locations linked to a government contractor, seizing documents indicating benami property transactions.",
      link: "#",
      pubDate: new Date(now.getTime() - 172800000).toISOString(),
      source: "Hindustan Times",
      newspaper: "Hindustan Times",
      newspaperId: "hindustan-times",
      region: "National",
      sector: "corruption",
      severity: "high",
    },
    {
      id: "corr-fb-5",
      title: "Whistleblower complaint triggers vigilance probe in mining leases",
      description: "Chief Vigilance Commission forwarded a whistleblower complaint to the state government alleging irregular allocation of iron ore mining leases.",
      link: "#",
      pubDate: new Date(now.getTime() - 259200000).toISOString(),
      source: "NDTV",
      newspaper: "NDTV",
      newspaperId: "ndtv",
      region: "National",
      sector: "corruption",
      severity: "high",
    },
    {
      id: "corr-fb-6",
      title: "भ्रष्टाचार के खिलाफ जनता का प्रदर्शन, जाँच की माँग",
      description: "स्थानीय नागरिकों ने पंचायत भवन निर्माण में घोटाले के आरोपों पर प्रदर्शन किया और स्वतंत्र जाँच की माँग की।",
      link: "#",
      pubDate: now.toISOString(),
      source: "Hindi Media",
      newspaper: "Hindi Media",
      newspaperId: "hindi-news",
      region: "National",
      sector: "corruption",
      severity: "medium",
    },
  ];
}

export function groupByNewspaper(items: CorruptionItem[]): Record<string, CorruptionItem[]> {
  return items.reduce<Record<string, CorruptionItem[]>>((acc, item) => {
    const key = item.newspaper;
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});
}