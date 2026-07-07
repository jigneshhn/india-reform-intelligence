import { createHash } from "crypto";
import Parser from "rss-parser";
import { NewsItem, SectorId } from "./types";

function generateNewsId(link: string, title: string, pubDate: string): string {
  return createHash("sha256")
    .update(`${link}|${title}|${pubDate}`)
    .digest("hex")
    .slice(0, 24);
}

const parser = new Parser({
  timeout: 10000,
  headers: {
    "User-Agent": "IndiaReformIntelligence/1.0",
  },
});

const RSS_FEEDS = [
  {
    url: "https://news.google.com/rss/search?q=corruption+india&hl=en-IN&gl=IN&ceid=IN:en",
    sector: "corruption" as SectorId,
    source: "Google News",
  },
  {
    url: "https://news.google.com/rss/search?q=india+scam+fraud+investigation&hl=en-IN&gl=IN&ceid=IN:en",
    sector: "corruption" as SectorId,
    source: "Google News",
  },
  {
    url: "https://news.google.com/rss/search?q=india+education+crisis&hl=en-IN&gl=IN&ceid=IN:en",
    sector: "education" as SectorId,
    source: "Google News",
  },
  {
    url: "https://news.google.com/rss/search?q=india+healthcare+shortage&hl=en-IN&gl=IN&ceid=IN:en",
    sector: "healthcare" as SectorId,
    source: "Google News",
  },
  {
    url: "https://news.google.com/rss/search?q=india+infrastructure+problems&hl=en-IN&gl=IN&ceid=IN:en",
    sector: "infrastructure" as SectorId,
    source: "Google News",
  },
  {
    url: "https://news.google.com/rss/search?q=india+pollution+air+quality&hl=en-IN&gl=IN&ceid=IN:en",
    sector: "environment" as SectorId,
    source: "Google News",
  },
  {
    url: "https://news.google.com/rss/search?q=india+unemployment+economy&hl=en-IN&gl=IN&ceid=IN:en",
    sector: "economy" as SectorId,
    source: "Google News",
  },
  {
    url: "https://news.google.com/rss/search?q=india+farmer+protest+agriculture&hl=en-IN&gl=IN&ceid=IN:en",
    sector: "agriculture" as SectorId,
    source: "Google News",
  },
  {
    url: "https://news.google.com/rss/search?q=india+court+case+backlog+justice&hl=en-IN&gl=IN&ceid=IN:en",
    sector: "judiciary" as SectorId,
    source: "Google News",
  },
  {
    url: "https://news.google.com/rss/search?q=india+women+safety+gender&hl=en-IN&gl=IN&ceid=IN:en",
    sector: "women-safety" as SectorId,
    source: "Google News",
  },
];

const SEVERITY_KEYWORDS = {
  critical: [
    "scam",
    "fraud",
    "murder",
    "collapse",
    "crisis",
    "emergency",
    "disaster",
    "death",
    "killed",
    "arrested",
    "raid",
    "cbi",
    "ed raid",
    "massive",
    "billion",
    "crore scam",
  ],
  high: [
    "corruption",
    "bribery",
    "investigation",
    "probe",
    "allegation",
    "shortage",
    "protest",
    "violence",
    "pollution",
    "bankruptcy",
    "default",
    "scandal",
  ],
  medium: [
    "delay",
    "concern",
    "warning",
    "report",
    "study",
    "gap",
    "lagging",
    "behind",
    "struggle",
    "challenge",
    "issue",
  ],
};

function detectSeverity(title: string, description: string): NewsItem["severity"] {
  const text = `${title} ${description}`.toLowerCase();
  if (SEVERITY_KEYWORDS.critical.some((k) => text.includes(k))) return "critical";
  if (SEVERITY_KEYWORDS.high.some((k) => text.includes(k))) return "high";
  if (SEVERITY_KEYWORDS.medium.some((k) => text.includes(k))) return "medium";
  return "low";
}

function detectSectorFromText(text: string): SectorId {
  const lower = text.toLowerCase();
  const mappings: [SectorId, string[]][] = [
    ["corruption", ["corruption", "bribe", "scam", "fraud", "cbi", "ed raid", "lokayukta", "graft"]],
    ["education", ["education", "school", "student", "teacher", "university", "neet", "learning"]],
    ["healthcare", ["health", "hospital", "doctor", "medical", "disease", "patient", "ayushman"]],
    ["infrastructure", ["road", "bridge", "metro", "railway", "highway", "infrastructure", "construction"]],
    ["economy", ["economy", "gdp", "unemployment", "inflation", "rupee", "stock", "business"]],
    ["environment", ["pollution", "climate", "air quality", "deforestation", "environment", "aqi"]],
    ["agriculture", ["farmer", "crop", "agriculture", "msp", "harvest", "drought", "farming"]],
    ["judiciary", ["court", "judge", "verdict", "bail", "supreme court", "high court", "justice"]],
    ["women-safety", ["women", "rape", "gender", "harassment", "dowry", "female", "girl"]],
    ["governance", ["bureaucracy", "government", "policy", "minister", "parliament", "governance"]],
    ["technology", ["startup", "tech", "ai", "digital", "semiconductor", "it sector", "innovation"]],
    ["poverty", ["poverty", "hunger", "malnutrition", "slum", "welfare", "ration", "homeless"]],
  ];

  for (const [sector, keywords] of mappings) {
    if (keywords.some((k) => lower.includes(k))) return sector;
  }
  return "governance";
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

export async function fetchNews(): Promise<NewsItem[]> {
  const allNews: NewsItem[] = [];

  const results = await Promise.allSettled(
    RSS_FEEDS.map(async (feed) => {
      try {
        const parsed = await parser.parseURL(feed.url);
        return (parsed.items || []).slice(0, 5).map((item) => {
          const title = item.title || "Untitled";
          const description = stripHtml(item.contentSnippet || item.content || "");
          const detectedSector = detectSectorFromText(`${title} ${description}`);

          return {
            id: generateNewsId(item.link || title, title, item.pubDate || ""),
            title,
            description: description.slice(0, 300),
            link: item.link || "#",
            pubDate: item.pubDate || new Date().toISOString(),
            source: item.source?.title || feed.source,
            sector: detectedSector !== "governance" ? detectedSector : feed.sector,
            severity: detectSeverity(title, description),
          } as NewsItem;
        });
      } catch {
        return [];
      }
    })
  );

  for (const result of results) {
    if (result.status === "fulfilled") {
      allNews.push(...result.value);
    }
  }

  const unique = new Map<string, NewsItem>();
  for (const item of allNews) {
    const key = item.id || item.title;
    if (!unique.has(key)) {
      unique.set(key, item);
    }
  }

  return Array.from(unique.values())
    .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())
    .slice(0, 50);
}

export function getFallbackNews(): NewsItem[] {
  return [
    {
      id: "fb-1",
      title: "CBI registers case in multi-crore public works contract scam",
      description:
        "Central Bureau of Investigation has registered a case involving alleged kickbacks in government infrastructure contracts across multiple states.",
      link: "#",
      pubDate: new Date().toISOString(),
      source: "National News",
      sector: "corruption",
      severity: "critical",
    },
    {
      id: "fb-2",
      title: "India ranks 132nd in global education quality index",
      description:
        "Latest international assessment shows India continues to lag in foundational literacy and numeracy despite increased enrollment rates.",
      link: "#",
      pubDate: new Date(Date.now() - 86400000).toISOString(),
      source: "Education Report",
      sector: "education",
      severity: "high",
    },
    {
      id: "fb-3",
      title: "22 Indian cities among world's 30 most polluted",
      description:
        "WHO air quality report highlights severe PM2.5 levels in major Indian metros, with health impacts costing billions annually.",
      link: "#",
      pubDate: new Date(Date.now() - 172800000).toISOString(),
      source: "Environment Watch",
      sector: "environment",
      severity: "critical",
    },
    {
      id: "fb-4",
      title: "Supreme Court flags 4.7 crore pending cases crisis",
      description:
        "Chief Justice raises alarm over judicial backlog causing justice delayed for millions of citizens across district and high courts.",
      link: "#",
      pubDate: new Date(Date.now() - 259200000).toISOString(),
      source: "Legal Affairs",
      sector: "judiciary",
      severity: "high",
    },
    {
      id: "fb-5",
      title: "Youth unemployment hits 23% as job creation slows",
      description:
        "Labour ministry data reveals growing gap between graduate output and formal sector employment opportunities.",
      link: "#",
      pubDate: new Date(Date.now() - 345600000).toISOString(),
      source: "Economic Times",
      sector: "economy",
      severity: "high",
    },
    {
      id: "fb-6",
      title: "Rural healthcare centers operate without doctors in 40% districts",
      description:
        "Parliamentary panel report exposes critical shortage of medical professionals in primary health centers across rural India.",
      link: "#",
      pubDate: new Date(Date.now() - 432000000).toISOString(),
      source: "Health Ministry Report",
      sector: "healthcare",
      severity: "critical",
    },
    {
      id: "fb-7",
      title: "Farmer protests resume over MSP guarantee demands",
      description:
        "Thousands of farmers gather at state borders demanding legal guarantee for minimum support prices and debt relief.",
      link: "#",
      pubDate: new Date(Date.now() - 518400000).toISOString(),
      source: "Agriculture News",
      sector: "agriculture",
      severity: "high",
    },
    {
      id: "fb-8",
      title: "Female workforce participation remains lowest among G20 nations",
      description:
        "World Bank data shows only 24% of Indian women participate in formal labor force, highlighting gender inequality gap.",
      link: "#",
      pubDate: new Date(Date.now() - 604800000).toISOString(),
      source: "Gender Index Report",
      sector: "women-safety",
      severity: "high",
    },
  ];
}