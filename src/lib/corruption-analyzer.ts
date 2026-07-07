import type { Locale } from "@/i18n";
import { analyzeIssue } from "./ai-analyzer";
import { AnalysisResult, AnalysisStep, CorruptionItem, NewsItem } from "./types";

const STEP_TEMPLATES = {
  en: {
    immediate: {
      title: "Emergency containment & evidence preservation",
      description: "Stop further damage, secure evidence, and activate accountability mechanisms immediately.",
      responsible: "Investigating agency, vigilance department",
    },
    shortTerm: {
      title: "Investigation acceleration & interim suspension",
      description: "Fast-track the probe, suspend accused officials, and freeze related assets.",
      responsible: "CBI/ED/State ACB, competent authority",
    },
    mediumTerm: {
      title: "Prosecution, systemic audit & process reform",
      description: "File charges, conduct department-wide audit, and redesign the vulnerable process.",
      responsible: "Prosecution, department head, audit committee",
    },
    longTerm: {
      title: "Institutional reform & prevention architecture",
      description: "Implement permanent transparency controls so this category of corruption cannot recur.",
      responsible: "Government, legislature, civil society oversight",
    },
  },
  hi: {
    immediate: {
      title: "आपातकालीन रोकथाम और साक्ष्य संरक्षण",
      description: "आगे का नुकसान रोकें, साक्ष्य सुरक्षित करें, और जवाबदेही तंत्र तुरंत सक्रिय करें।",
      responsible: "जाँच एजेंसी, सतर्कता विभाग",
    },
    shortTerm: {
      title: "जाँच त्वरण और अंतरिम निलंबन",
      description: "जाँच को तेज करें, आरोपी अधिकारियों को निलंबित करें, और संबंधित संपत्ति जब्त करें।",
      responsible: "सीबीआई/ईडी/राज्य एसीबी, सक्षम प्राधिकारी",
    },
    mediumTerm: {
      title: "अभियोजन, प्रणालीगत ऑडिट और प्रक्रिया सुधार",
      description: "आरोप पत्र दायर करें, विभागवार ऑडिट करें, और कमजोर प्रक्रिया को पुनः डिज़ाइन करें।",
      responsible: "अभियोजन, विभागाध्यक्ष, ऑडिट समिति",
    },
    longTerm: {
      title: "संस्थागत सुधार और रोकथाम वास्तुकला",
      description: "स्थायी पारदर्शिता नियंत्रण लागू करें ताकि इस प्रकार का भ्रष्टाचार दोबारा न हो।",
      responsible: "सरकार, विधायिका, नागरिक समाज निगरानी",
    },
  },
};

const LEGAL_FRAMEWORK = {
  en: [
    "Prevention of Corruption Act, 1988 (Sections 7, 8, 9, 10, 13)",
    "Prevention of Money Laundering Act, 2002 (PMLA)",
    "Central Vigilance Commission Act, 2003",
    "Right to Information Act, 2005",
    "Whistle Blowers Protection Act, 2014",
    "Benami Transactions (Prohibition) Act, 1988",
    "Lokpal and Lokayuktas Act, 2013",
  ],
  hi: [
    "भ्रष्टाचार निवारण अधिनियम, 1988 (धारा 7, 8, 9, 10, 13)",
    "धन शोधन निवारण अधिनियम, 2002 (PMLA)",
    "केंद्रीय सतर्कता आयोग अधिनियम, 2003",
    "सूचना का अधिकार अधिनियम, 2005",
    "मुखबिर संरक्षण अधिनियम, 2014",
    "बेनामी लेनदेन (प्रतिबंध) अधिनियम, 1988",
    "लोकपाल और लोकायुक्त अधिनियम, 2013",
  ],
};

const PREVENTION = {
  en: [
    "Mandatory e-procurement for all contracts above ₹5 lakh",
    "Real-time public dashboard for government expenditure",
    "Randomized audit rotation across departments every quarter",
    "Anonymous digital whistleblower portal with legal protection",
    "Mandatory asset declaration verification using AI cross-matching",
    "Citizen social audit of local government projects",
  ],
  hi: [
    "₹5 लाख से अधिक सभी अनुबंधों के लिए अनिवार्य ई-खरीद",
    "सरकारी व्यय के लिए वास्तविक समय सार्वजनिक डैशबोर्ड",
    "प्रत्येक तिमाही में विभागों में यादृच्छिक ऑडिट रोटेशन",
    "कानूनी संरक्षण के साथ गुमनाम डिजिटल मुखबिर पोर्टल",
    "एआई क्रॉस-मैचिंग से अनिवार्य संपत्ति घोषणा सत्यापन",
    "स्थानीय सरकारी परियोजनाओं का नागरिक सामाजिक ऑडिट",
  ],
};

function contextualizeActions(item: CorruptionItem, locale: Locale): AnalysisStep[] {
  const t = STEP_TEMPLATES[locale];
  const title = item.title.toLowerCase();
  const isEnforcement = /cbi|ed |raid|enforcement|income tax|lokayukta|vigilance/i.test(title);
  const isProcurement = /contract|tender|procurement|kickback|scam/i.test(title);
  const isBank = /bank|loan|fraud|nbfc/i.test(title);

  const immediateActions = locale === "hi"
    ? [
        "संबंधित एजेंसी को 24 घंटे के भीतर प्राथमिकी/जाँच दर्ज करने का निर्देश दें",
        "आरोपित अधिकारियों को तुरंत निलंबित करें (धारा 17A पीसी एक्ट)",
        "सभी संबंधित दस्तावेज़, ईमेल और वित्तीय रिकॉर्ड सील करें",
        "मुखबिर/गवाहों को सुरक्षा और गोपनीयता सुनिश्चित करें",
      ]
    : [
        "Direct relevant agency to register FIR/investigation within 24 hours",
        "Immediately suspend accused officials (Section 17A PCA compliance)",
        "Seal all related documents, emails, and financial records",
        "Ensure witness/whistleblower protection and confidentiality",
      ];

  const shortActions = locale === "hi"
    ? [
        "संबंधित संपत्ति और बैंक खाते अटैच/फ्रीज करें (PMLA)",
        "विशेष जाँच दल (SIT) गठित करें 15-दिन की समयसीमा के साथ",
        "मीडिया और जनता को साप्ताहिक जाँच स्थिति रिपोर्ट प्रकाशित करें",
        isEnforcement ? "अंतर-एजेंसी समन्वय बैठक (CBI+ED+IT) आयोजित करें" : "विभागीय जाँच समिति का गठन करें",
      ]
    : [
        "Attach/freeze related properties and bank accounts (PMLA)",
        "Constitute Special Investigation Team (SIT) with 15-day deadline",
        "Publish weekly investigation status report to media and public",
        isEnforcement ? "Convene inter-agency coordination (CBI+ED+IT)" : "Form departmental inquiry committee",
      ];

  const mediumActions = locale === "hi"
    ? [
        "आरोप पत्र दायर करें और विशेष अदालत में मामला त्वरित करें",
        isProcurement ? "पिछले 5 वर्षों के सभी अनुबंधों का ऑडिट करें" : "संबंधित प्रक्रिया का पूर्ण ऑडिट करें",
        isBank ? "ऋण मंजूरी प्रक्रिया में स्वचालित जोखिम स्कोरिंग लागू करें" : "ई-टेंडरिंग अनिवार्य करें",
        "पीड़ित/क्षतिग्रस्त पक्ष को मुआवज़ा और बहाली सुनिश्चित करें",
      ]
    : [
        "File chargesheet and fast-track trial in special court",
        isProcurement ? "Audit all contracts from past 5 years" : "Conduct full process audit of vulnerable workflow",
        isBank ? "Implement automated risk scoring in loan approval" : "Mandate e-tendering for all future contracts",
        "Ensure compensation and restitution for affected parties",
      ];

  const longActions = locale === "hi"
    ? [
        "संबंधित प्रक्रिया में ब्लॉकचेन-आधारित पारदर्शी टेंडरिंग लागू करें",
        "विभाग में स्थायी सतर्कता अधिकारी और नागरिक निगरानी समिति स्थापित करें",
        "भ्रष्टाचार रोकथाम में अनिवार्य प्रशिक्षण और जवाबदेही मैट्रिक्स लागू करें",
        "इस मामले से सीखकर राज्य/राष्ट्र स्तर पर नीति संशोधन करें",
      ]
    : [
        "Implement blockchain-based transparent tendering for the affected process",
        "Establish permanent vigilance officer and citizen oversight committee in department",
        "Mandate anti-corruption training and accountability metrics for all officials",
        "Draft state/national policy amendment based on lessons from this case",
      ];

  return [
    {
      stepNumber: 1,
      title: t.immediate.title,
      description: t.immediate.description,
      actions: immediateActions,
      timeframe: locale === "hi" ? "0–7 दिन" : "0–7 days",
      responsibleParty: t.immediate.responsible,
    },
    {
      stepNumber: 2,
      title: t.shortTerm.title,
      description: t.shortTerm.description,
      actions: shortActions,
      timeframe: locale === "hi" ? "1–4 सप्ताह" : "1–4 weeks",
      responsibleParty: t.shortTerm.responsible,
    },
    {
      stepNumber: 3,
      title: t.mediumTerm.title,
      description: t.mediumTerm.description,
      actions: mediumActions,
      timeframe: locale === "hi" ? "1–6 महीने" : "1–6 months",
      responsibleParty: t.mediumTerm.responsible,
    },
    {
      stepNumber: 4,
      title: t.longTerm.title,
      description: t.longTerm.description,
      actions: longActions,
      timeframe: locale === "hi" ? "6 महीने – 3 वर्ष" : "6 months – 3 years",
      responsibleParty: t.longTerm.responsible,
    },
  ];
}

export async function analyzeCorruptionStepByStep(
  item: CorruptionItem,
  locale: Locale = "en"
): Promise<AnalysisResult> {
  const base = await analyzeIssue(item as NewsItem, false);
  const steps = contextualizeActions(item, locale);

  const sectorName = locale === "hi" ? "भ्रष्टाचार और पारदर्शिता" : base.sectorName;

  return {
    ...base,
    sectorName,
    locale,
    steps,
    legalFramework: LEGAL_FRAMEWORK[locale],
    preventionMeasures: PREVENTION[locale],
    solutions: steps.map((step) => ({
      phase: `Step ${step.stepNumber}: ${step.title}`,
      timeline: step.timeframe,
      actions: step.actions,
      expectedImpact: step.description,
    })),
    estimatedImpact:
      locale === "hi"
        ? `इस चरणबद्ध कार्ययोजना को लागू करने से इस मामले में जवाबदेही सुनिश्चित हो सकती है और ₹${item.severity === "critical" ? "500+" : "50+"} करोड़ की संभावित लीकेज रोकी जा सकती है। दोहराव रोकने के लिए दीर्घकालिक संस्थागत सुधार अनिवार्य हैं।`
        : `Implementing this step-by-step plan can ensure accountability in this case and prevent an estimated ₹${item.severity === "critical" ? "500+" : "50+"} crore in potential leakages. Long-term institutional reforms are essential to prevent recurrence.`,
    confidenceScore: item.severity === "critical" ? 94 : item.severity === "high" ? 90 : 85,
  };
}