import { AnalysisResult, NewsItem, SectorId } from "./types";
import { getSectorById } from "./sectors";

const EXPERT_SOLUTIONS: Record<
  SectorId,
  {
    rootCauses: string[];
    globalBenchmark: { country: string; approach: string; outcome: string };
    shortTerm: string[];
    mediumTerm: string[];
    longTerm: string[];
    policy: string[];
    citizen: string[];
    impact: string;
  }
> = {
  corruption: {
    rootCauses: [
      "Discretionary power without transparent decision-making frameworks",
      "Weak enforcement of Prevention of Corruption Act with low conviction rates",
      "Political party funding through opaque electoral bonds and cash",
      "Absence of real-time public procurement and expenditure dashboards",
      "Whistleblower protection laws exist but implementation is poor",
      "Inter-ministerial accountability gaps with no single anti-corruption authority",
    ],
    globalBenchmark: {
      country: "Singapore & Estonia",
      approach:
        "Singapore's CPIB (independent corruption bureau) + Estonia's fully digital government with blockchain-verified procurement. Every government transaction is traceable by citizens in real-time.",
      outcome:
        "Singapore consistently ranks top 5 in Corruption Perception Index. Estonia reduced bureaucratic corruption by 90% through e-governance digitization.",
    },
    shortTerm: [
      "Mandate real-time publication of all government contracts above ₹10 lakh on a unified portal",
      "Establish fast-track anti-corruption courts with 6-month case resolution targets",
      "Implement anonymous digital whistleblower platform with legal protection guarantees",
      "Require asset declarations of all public officials to be machine-readable and publicly searchable",
      "Deploy AI-based anomaly detection on GST, income tax, and procurement data to flag suspicious patterns",
    ],
    mediumTerm: [
      "Create an independent National Anti-Corruption Commission (NACC) modeled on Hong Kong's ICAC",
      "Transition all government procurement to blockchain-based transparent tendering (like Georgia's system)",
      "Implement comprehensive political funding transparency with real-time donation disclosure",
      "Digitize all citizen-government interactions eliminating face-to-face bribery opportunities",
      "Introduce performance-linked civil service compensation to reduce corruption incentives",
    ],
    longTerm: [
      "Constitutional amendment for institutional independence of anti-corruption bodies",
      "Full adoption of AI-powered predictive governance identifying corruption risks before they occur",
      "Citizen jury system for oversight of major public projects (participatory governance model from Brazil)",
      "Integration with international anti-money-laundering networks for cross-border corruption tracking",
      "Civic education programs building zero-tolerance corruption culture from school level",
    ],
    policy: [
      "Enact a comprehensive Public Integrity Act consolidating all anti-corruption laws",
      "Amend Prevention of Corruption Act to include corporate bribery and private sector collusion",
      "Make electoral bonds illegal and mandate digital-only political donations with instant disclosure",
      "Establish corruption cost recovery — convicted officials must repay 3x the bribe amount",
    ],
    citizen: [
      "Report corruption via Central Vigilance Commission's online portal (cvc.gov.in)",
      "Use RTI Act to demand transparency on local government spending",
      "Support organizations like Transparency International India and Association for Democratic Reforms",
      "Vote based on candidate criminal/corruption records available on myneta.info",
      "Document and share corruption experiences on social media to build public pressure",
    ],
    impact:
      "Implementing this framework could reduce corruption perception index score by 25-30 points within 10 years, saving an estimated ₹1.5-2 lakh crore annually in leakages.",
  },
  education: {
    rootCauses: [
      "Curriculum focused on memorization rather than critical thinking and problem-solving",
      "Severe teacher quality gap — 11 lakh teacher vacancies unfilled nationally",
      "Assessment system (exams) drives teaching-to-test rather than learning outcomes",
      "Digital divide leaving 60% rural students without reliable internet access",
      "Insufficient public education spending at 3.1% GDP vs 6% recommended",
    ],
    globalBenchmark: {
      country: "Finland & South Korea",
      approach:
        "Finland's teacher training (master's degree required), trust-based school autonomy, and focus on equity. South Korea's rapid transformation through targeted investment in teacher quality.",
      outcome:
        "Finland consistently ranks #1 in education quality. South Korea went from 24% literacy in 1950 to top PISA performer within 50 years.",
    },
    shortTerm: [
      "Fill all 11 lakh teacher vacancies with qualified educators within 18 months",
      "Deploy National Education Technology Platform (like DIKSHA) to every rural school with offline capability",
      "Implement continuous learning assessment replacing high-stakes annual exams",
      "Launch emergency foundational literacy/numeracy mission for grades 3-5 (NIPUN Bharat expansion)",
      "Provide tablet/laptop to every student in government schools with pre-loaded educational content",
    ],
    mediumTerm: [
      "Restructure teacher training to 2-year master's program with practical classroom training",
      "Adopt competency-based curriculum aligned with NEP 2020 implementation roadmap",
      "Establish school quality index with public rankings driving accountability",
      "Create industry-academia partnerships for vocational training from grade 9 onwards",
      "Increase education budget to 6% of GDP with transparent utilization tracking",
    ],
    longTerm: [
      "Build world-class research universities (IIT/IISc model) in every state",
      "Implement personalized AI-tutoring for every student (like Khan Academy at national scale)",
      "Create teacher exchange programs with Finland, Singapore, and Japan",
      "Establish national education research center studying what teaching methods work in Indian context",
    ],
    policy: [
      "Make Right to Education Act enforceable with penalties for states not meeting standards",
      "Create independent National Education Quality Authority for standards enforcement",
      "Mandate 6% GDP education spending through Fiscal Responsibility legislation",
      "Reform UGC/AICTE to focus on outcomes rather than input-based regulation",
    ],
    citizen: [
      "Volunteer as guest teacher in local government schools via NGO partnerships",
      "Use PM eVIDYA and DIKSHA platforms to supplement children's learning",
      "Participate in School Management Committee meetings to demand accountability",
      "Support NGOs like Pratham, Teach for India, and Akshaya Patra",
    ],
    impact:
      "Could lift 100 million children out of learning poverty within 5 years and improve India's PISA ranking from 132 to top 50 within 15 years.",
  },
  healthcare: {
    rootCauses: [
      "Chronic underinvestment at 1.3% GDP public health spending vs 5% global average",
      "Massive urban-rural disparity in healthcare infrastructure and professionals",
      "70% out-of-pocket spending pushing 6 crore Indians into poverty annually",
      "Weak primary healthcare system overburdening tertiary hospitals",
      "Regulatory failures in drug quality and medical device standards",
    ],
    globalBenchmark: {
      country: "Thailand & UK (NHS)",
      approach:
        "Thailand's Universal Coverage Scheme achieved 99% coverage with 4% GDP spending. UK's NHS provides free-at-point-of-use healthcare funded through taxation.",
      outcome:
        "Thailand reduced infant mortality by 75% in 20 years. UK achieves better health outcomes than US at half the per-capita cost.",
    },
    shortTerm: [
      "Operationalize 1.5 lakh Health & Wellness Centres under Ayushman Bharat in underserved areas",
      "Deploy 50,000 additional community health workers in rural gaps",
      "Implement telemedicine network connecting every PHC to district hospital specialists",
      "Cap prices on essential medicines and medical procedures through strengthened NPPA",
      "Emergency recruitment drive for doctors in rural areas with 2x salary incentives",
    ],
    mediumTerm: [
      "Increase public health spending to 2.5% GDP with dedicated health cess",
      "Build 10 AIIMS-equivalent institutions in underserved states",
      "Implement single-payer universal health insurance covering all 140 crore citizens",
      "Create national health data registry for disease surveillance and resource planning",
      "Establish medical education expansion — double MBBS seats to address doctor shortage",
    ],
    longTerm: [
      "Achieve WHO-recommended 1:1000 doctor-patient ratio through sustained investment",
      "Build indigenous pharmaceutical and medical device manufacturing (reduce import dependency)",
      "Create world-class public health research institutions (like CDC model)",
      "Integrate traditional medicine (AYUSH) with modern healthcare evidence-based framework",
    ],
    policy: [
      "Enact Right to Health as fundamental right (constitutional amendment)",
      "Separate medical education regulation from practice regulation",
      "Mandate generic drug prescriptions to reduce out-of-pocket costs",
      "Implement clinical establishment standards with strict enforcement",
    ],
    citizen: [
      "Register for Ayushman Bharat health card (pmjay.gov.in)",
      "Use government telemedicine platforms (eSanjeevani) for remote consultations",
      "Demand generic medicines at Jan Aushadhi Kendras (cheapest rates)",
      "Participate in local health committee oversight of PHC quality",
    ],
    impact:
      "Universal health coverage could prevent 6 crore poverty cases annually and add 1-2% to GDP through healthier workforce productivity.",
  },
  infrastructure: {
    rootCauses: [
      "Fragmented urban planning with unplanned sprawl in 4000+ cities",
      "Project delays averaging 3-5 years due to land acquisition and clearances",
      "Insufficient public transit forcing private vehicle dependency",
      "Water management crisis with 21 cities projected to run dry by 2030",
      "Poor maintenance culture — build but don't maintain approach",
    ],
    globalBenchmark: {
      country: "Singapore & Japan",
      approach:
        "Singapore's integrated urban planning authority (URA) with 50-year master plans. Japan's Shinkansen network and earthquake-resistant infrastructure standards.",
      outcome:
        "Singapore transformed from third-world to first-world in 30 years through infrastructure-led development. Japan's infrastructure survives earthquakes that would devastate other nations.",
    },
    shortTerm: [
      "Fast-track completion of 100 stalled national highway projects via project monitoring group",
      "Deploy smart water metering in top 50 water-stressed cities",
      "Expand metro rail to 50 cities under Metro Rail Policy acceleration",
      "Implement single-window clearance portal for all infrastructure approvals",
      "Launch emergency urban flooding mitigation in Mumbai, Chennai, Delhi, Bangalore",
    ],
    mediumTerm: [
      "Create National Urban Planning Authority with binding master plans for all cities >1 lakh population",
      "Build 10,000 km of dedicated freight corridors reducing logistics costs from 14% to 8% of GDP",
      "Implement integrated water management — rainwater harvesting mandatory for all buildings",
      "Develop 100 smart cities with IoT-based infrastructure monitoring",
      "Build 50 new airports under UDAN scheme connecting tier-2/3 cities",
    ],
    longTerm: [
      "Achieve 100% rural road connectivity (PMGSY completion target)",
      "Build Mumbai-Ahmedabad bullet train as template for 6 high-speed rail corridors",
      "Create circular economy waste management eliminating open dumping",
      "Develop indigenous construction technology reducing costs by 30%",
    ],
    policy: [
      "Land acquisition reform with fair compensation and transparent process",
      "Infrastructure status for all public utility projects enabling cheaper financing",
      "Mandatory infrastructure lifecycle maintenance fund (2% of project cost annually)",
      "Environmental clearance timeline cap of 6 months with single authority",
    ],
    citizen: [
      "Use public transit and metro to reduce congestion and pollution",
      "Report infrastructure defects via municipal complaint apps",
      "Implement rainwater harvesting in homes and communities",
      "Participate in local ward committee meetings on infrastructure priorities",
    ],
    impact:
      "Modern infrastructure could reduce logistics costs by 6% of GDP (₹12 lakh crore savings) and create 50 million jobs in construction and allied sectors.",
  },
  economy: {
    rootCauses: [
      "90% workforce in informal sector without social security or productivity tools",
      "Manufacturing stuck at 17% of GDP vs 25% target",
      "Complex regulatory compliance burden (India ranks 63 in ease of doing business)",
      "Skill mismatch — education system not aligned with industry needs",
      "Low female workforce participation constraining GDP growth by 30%",
    ],
    globalBenchmark: {
      country: "South Korea & Germany",
      approach:
        "South Korea's chaebol-led industrialization with heavy R&D investment. Germany's Mittelstand (SME) model with vocational training integration.",
      outcome:
        "South Korea went from $100 per capita to $35,000 in 50 years. Germany maintains manufacturing excellence with 20% manufacturing GDP share.",
    },
    shortTerm: [
      "Simplify GST compliance for MSMEs with auto-calculated returns",
      "Launch national apprenticeship program placing 1 crore youth in industry training",
      "Fast-track PLI scheme expansion to 25 sectors beyond current 14",
      "Create ₹50,000 crore MSME credit guarantee fund",
      "Implement single digital business registration completing in 1 day",
    ],
    mediumTerm: [
      "Formalize informal sector through universal social security number (like Aadhaar for workers)",
      "Achieve 25% manufacturing GDP share through Make in India 2.0",
      "Build 50 industrial corridors with plug-and-play infrastructure",
      "Implement progressive tax reform reducing corporate rate to 15% for manufacturers",
      "Create sovereign wealth fund investing in strategic industries (semiconductors, EVs, defense)",
    ],
    longTerm: [
      "Become world's third-largest economy by 2030 ($7 trillion GDP target)",
      "Create 200 million formal sector jobs through sustained manufacturing growth",
      "Build 10 Indian multinational corporations in Fortune 500",
      "Achieve $1 trillion exports through diversified trade partnerships",
    ],
    policy: [
      "Labor code implementation with balance of flexibility and worker protection",
      "Bankruptcy code strengthening for faster resolution",
      "Foreign direct investment liberalization in all sectors except strategic",
      "Data protection law enabling digital economy while protecting citizens",
    ],
    citizen: [
      "Upskill through Skill India Mission free courses (skillindia.gov.in)",
      "Support local manufacturing and MSME products",
      "Consider entrepreneurship via MUDRA loan scheme (up to ₹10 lakh collateral-free)",
      "Participate in gig economy platforms with awareness of worker rights",
    ],
    impact:
      "Formalizing the economy and boosting manufacturing could add 2-3% annual GDP growth, creating 10 million new formal jobs per year.",
  },
  governance: {
    rootCauses: [
      "Colonial-era bureaucratic structures not adapted for 21st century governance",
      "Siloed departmental functioning preventing integrated policy implementation",
      "Limited use of data analytics in policy making and monitoring",
      "Civil service exam selects for exam-taking ability not administrative competence",
      "Accountability mechanisms weak with rare consequences for non-performance",
    ],
    globalBenchmark: {
      country: "Estonia & South Korea",
      approach:
        "Estonia's e-Estonia model — 99% government services online, digital identity, blockchain governance. South Korea's digital government innovation lab.",
      outcome:
        "Estonia processes business registration in 18 minutes online. South Korea's government efficiency index ranks top 10 globally.",
    },
    shortTerm: [
      "Mandate all government services on UMANG/DigiLocker with offline alternatives",
      "Create Chief Data Officer in every ministry for data-driven governance",
      "Implement government service delivery SLAs with citizen feedback loops",
      "Launch AI-powered grievance redressal system processing complaints in 48 hours",
      "Digitize all file movement eliminating physical file delays",
    ],
    mediumTerm: [
      "Restructure civil services with domain specialists alongside generalists",
      "Create integrated service delivery portals (one government approach)",
      "Implement outcome-based budgeting linking funds to measurable results",
      "Establish regulatory sandbox for policy experimentation in states",
      "Build national government cloud infrastructure reducing IT costs by 60%",
    ],
    longTerm: [
      "AI-powered predictive governance anticipating citizen needs",
      "Blockchain-based land records and property registration nationwide",
      "Citizen co-creation of policies through digital participatory platforms",
      "Zero-paper government with all processes end-to-end digital",
    ],
    policy: [
      "Civil service reform with lateral entry from private sector and academia",
      "Right to Services legislation with penalties for departmental delays",
      "Open data policy mandating publication of all non-sensitive government data",
      "Performance appraisal linked to citizen satisfaction scores",
    ],
    citizen: [
      "Use MyGov.in platform to participate in policy consultations",
      "Rate government services on service delivery apps",
      "File grievances on CPGRAMS portal (pgportal.gov.in)",
      "Access all government documents via DigiLocker (digilocker.gov.in)",
    ],
    impact:
      "Digital governance reform could save ₹50,000 crore annually in administrative costs and reduce citizen grievance resolution time from months to days.",
  },
  environment: {
    rootCauses: [
      "Coal-dependent energy mix (70%) with slow renewable transition",
      "Weak enforcement of environmental regulations and NGT orders",
      "Urban planning ignoring environmental carrying capacity",
      "Industrial pollution with inadequate real-time monitoring",
      "Deforestation for development projects without adequate compensatory afforestation",
    ],
    globalBenchmark: {
      country: "Sweden & Costa Rica",
      approach:
        "Sweden's carbon tax since 1991 and 54% renewable energy. Costa Rica running on 99% renewable electricity with reforestation programs.",
      outcome:
        "Sweden reduced emissions 27% while growing GDP 80%. Costa Rica reversed deforestation from 26% forest cover to 52%.",
    },
    shortTerm: [
      "Emergency air quality action plans for 22 most polluted cities",
      "Shut down illegal industrial units violating emission norms",
      "Deploy 1000 additional real-time air/water quality monitoring stations",
      "Ban single-use plastics enforcement in all states",
      "Accelerate coal plant retirement schedule — close plants older than 25 years",
    ],
    mediumTerm: [
      "Achieve 50% renewable energy mix by 2030 (current target: 50% capacity, need generation focus)",
      "Implement carbon pricing mechanism starting at ₹500/tonne CO2",
      "Mass electric vehicle transition — 30% new vehicle sales electric by 2030",
      "Restore 26 million hectares of degraded forest land",
      "Build circular economy infrastructure for waste-to-energy in 500 cities",
    ],
    longTerm: [
      "Net zero emissions by 2070 with interim 45% reduction by 2030",
      "100% renewable electricity generation",
      "Green hydrogen economy for industrial decarbonization",
      "Climate-resilient agriculture for 140 million farmer families",
    ],
    policy: [
      "Strengthen Environmental Impact Assessment with mandatory public hearings",
      "Green tax on fossil fuels funding renewable transition",
      "National clean air legislation with enforceable standards and penalties",
      "Payment for ecosystem services compensating forest communities",
    ],
    citizen: [
      "Monitor local AQI via SAFAR/CPCB apps and reduce outdoor activity on bad days",
      "Switch to solar rooftop panels (30% government subsidy available)",
      "Segregate waste at source and compost organic waste",
      "Plant trees via government programs (vanmahotsav, urban forestry)",
    ],
    impact:
      "Clean environment transition could save 1.7 million lives annually from air pollution and create 10 million green economy jobs.",
  },
  technology: {
    rootCauses: [
      "R&D spending at 0.7% GDP vs 3% in developed nations",
      "Brain drain — 60% of top IIT graduates migrate abroad",
      "No domestic semiconductor fabrication capability",
      "Digital literacy at only 38% of population",
      "Patent filing rate 10x lower than China per capita",
    ],
    globalBenchmark: {
      country: "Israel & South Korea",
      approach:
        "Israel's startup nation ecosystem with highest VC per capita. South Korea's Samsung/LG model with government-backed R&D and semiconductor leadership.",
      outcome:
        "Israel has 6000+ startups for 9 million people. South Korea controls 60% of global memory chip market.",
    },
    shortTerm: [
      "Fast-track ₹76,000 crore India Semiconductor Mission fabs",
      "Launch national AI mission with ₹10,000 crore for research and application",
      "Expand Digital India literacy mission to 50 crore citizens",
      "Create 1000 technology incubators in tier-2/3 cities",
      "Implement open-source government software policy reducing vendor lock-in",
    ],
    mediumTerm: [
      "Increase R&D spending to 2% GDP through public-private partnerships",
      "Build 5G infrastructure enabling IoT and smart city applications nationwide",
      "Create deep tech fund of funds (₹20,000 crore) for hardware startups",
      "Establish 20 world-class research institutions in emerging tech (quantum, biotech, space)",
      "Implement reverse brain drain program attracting 10,000 researchers back to India",
    ],
    longTerm: [
      "Become global top 3 in AI, space technology, and pharmaceutical innovation",
      "Domestic semiconductor production meeting 50% of national demand",
      "100% digital literacy with every citizen accessing government services digitally",
      "Indian tech companies among global top 10 by market capitalization",
    ],
    policy: [
      "Patent reform reducing filing time from 5 years to 1 year",
      "Data localization balanced with international data flow agreements",
      "Startup tax benefits extended to 10 years with simplified compliance",
      "Open standards mandate for all government technology procurement",
    ],
    citizen: [
      "Learn coding via free platforms (freeCodeCamp, NPTEL, SWAYAM)",
      "Participate in hackathons and government innovation challenges on MyGov",
      "Support Indian tech products and apps over foreign alternatives where quality matches",
      "Contribute to open-source projects and civic technology initiatives",
    ],
    impact:
      "Technology leadership could add $1 trillion to GDP by 2030 and create India's version of Silicon Valley across Bangalore, Hyderabad, Pune, and emerging hubs.",
  },
  agriculture: {
    rootCauses: [
      "86% small and marginal farmers with less than 2 hectares",
      "APMC mandi monopoly enabling middleman exploitation (30-40% margin)",
      "Climate change causing unpredictable monsoons and crop failures",
      "Low crop insurance penetration leaving farmers vulnerable",
      "Insufficient investment in agricultural R&D and extension services",
    ],
    globalBenchmark: {
      country: "Netherlands & Israel",
      approach:
        "Netherlands produces food for 17 million people from area smaller than Kerala using precision agriculture. Israel's drip irrigation and desert farming technology.",
      outcome:
        "Netherlands is world's 2nd largest food exporter by value. Israel grows crops in desert with 90% water efficiency.",
    },
    shortTerm: [
      "Implement MSP guarantee for 23 crops as legal right",
      "Expand PM-KISAN direct benefit transfer to all eligible farmers",
      "Deploy 10,000 mobile soil testing labs across districts",
      "Fast-track FPO (Farmer Producer Organization) formation — target 50,000 FPOs",
      "Waive farm loans for distressed farmers in drought-affected regions",
    ],
    mediumTerm: [
      "Build national agricultural market (e-NAM) truly national with interstate trade",
      "Implement precision farming via satellite monitoring and drone spraying",
      "Expand crop insurance (PMFBY) to cover 100% of cropped area",
      "Create cold chain infrastructure eliminating 40% post-harvest waste",
      "Invest in drought-resistant and climate-adaptive seed varieties",
    ],
    longTerm: [
      "Double farmer income (2016 promise) through value-added agriculture and exports",
      "Organic farming transition for 30% of agricultural land",
      "Agri-tech startup ecosystem making India global food technology leader",
      "Sustainable water management ending groundwater depletion crisis",
    ],
    policy: [
      "Contract farming legislation protecting farmer rights while enabling corporate investment",
      "Land lease reform allowing farmers to lease without losing ownership",
      "Agricultural marketing reforms completing e-NAM integration",
      "Export policy liberalization for all agricultural commodities",
    ],
    citizen: [
      "Buy directly from farmers via FPOs and farmer markets",
      "Reduce food waste at household level",
      "Support organic and local produce",
      "Volunteer with NGOs providing agricultural extension services",
    ],
    impact:
      "Agricultural reform could double farmer incomes, reduce food inflation by 20%, and make India a $100 billion agricultural export powerhouse.",
  },
  judiciary: {
    rootCauses: [
      "Insufficient judge strength (19 per million vs 50+ in developed nations)",
      "Complex procedures causing adjournment culture",
      "Inadequate alternative dispute resolution mechanisms",
      "Poor court infrastructure especially in district courts",
      "Limited legal aid reaching only 5% of those who need it",
    ],
    globalBenchmark: {
      country: "Singapore & UK",
      approach:
        "Singapore's efficient commercial courts resolving cases in months. UK's court modernization with online dispute resolution for small claims.",
      outcome:
        "Singapore resolves commercial disputes in 150 days average. UK Online Court handles claims up to £25,000 digitally.",
    },
    shortTerm: [
      "Fill 40% vacant judge positions through emergency recruitment",
      "Mandate case management hearings limiting adjournments to 2 per case",
      "Launch e-Courts Phase III covering all district courts digitally",
      "Establish fast-track courts for corruption, rape, and economic offenses",
      "Implement court case tracking app for litigants (like NJDG expansion)",
    ],
    mediumTerm: [
      "Double judge strength to 40 per million population in 5 years",
      "Mandatory pre-litigation mediation for civil cases (reducing case filing by 40%)",
      "AI-assisted legal research and judgment drafting for judges",
      "National judicial service exam for standardized district judge recruitment",
      "Video conferencing for all court proceedings reducing travel burden",
    ],
    longTerm: [
      "Reduce case pendency from 4.7 crore to under 50 lakh in 10 years",
      "Online dispute resolution platform for all claims under ₹10 lakh",
      "Judicial performance metrics with transparent annual reporting",
      "Legal education reform producing practice-ready lawyers",
    ],
    policy: [
      "Supreme Court bench expansion and regional bench establishment",
      "All India Judicial Service for uniform district judge standards",
      "Increase judicial budget to 0.5% of GDP from current 0.08%",
      "Strict timeline legislation for investigation and trial in criminal cases",
    ],
    citizen: [
      "Use Lok Adalat for dispute resolution (free, fast, binding)",
      "Access free legal aid via NALSA (nalsa.gov.in) if income eligible",
      "Track case status on e-Courts portal (ecourts.gov.in)",
      "Consider mediation before filing court cases",
    ],
    impact:
      "Judicial reform could unlock ₹10 lakh crore in stalled economic activity and restore faith in rule of law, critical for investment and social stability.",
  },
  "women-safety": {
    rootCauses: [
      "Deep-rooted patriarchal norms limiting women's autonomy and participation",
      "Inadequate street lighting, public transport safety, and police responsiveness",
      "Low conviction rate (27%) in sexual assault cases creating impunity",
      "Workplace harassment laws exist but reporting mechanisms are weak",
      "Child marriage and lack of education perpetuating gender inequality cycles",
    ],
    globalBenchmark: {
      country: "Iceland & Rwanda",
      approach:
        "Iceland's mandatory equal pay certification and 48% women in parliament. Rwanda's 61% women parliamentarians with gender-based budgeting.",
      outcome:
        "Iceland tops gender equality index for 14 consecutive years. Rwanda has highest female parliamentary representation globally.",
    },
    shortTerm: [
      "Install CCTV and emergency buttons in all public transport and 500 high-risk areas",
      "Establish 24/7 women helpline (181) with guaranteed 10-minute police response in cities",
      "Fast-track all pending sexual assault cases in fast-track courts",
      "Mandatory gender sensitivity training for all police and judicial officers",
      "Launch Safe City programs in 100 cities with lighting, surveillance, and patrol",
    ],
    mediumTerm: [
      "Achieve 30% female labor force participation through childcare and maternity support",
      "Implement mandatory 33% women reservation in Parliament and state legislatures",
      "Gender-responsive budgeting in all government departments",
      "Comprehensive sex education in schools addressing consent and respect",
      "One-stop crisis centers in every district for violence survivors",
    ],
    longTerm: [
      "Achieve gender parity in education, employment, and political representation",
      "Zero tolerance culture for gender-based violence through sustained civic education",
      "Women-led economic empowerment lifting 50 million families out of poverty",
      "India in top 50 on Global Gender Gap Index (currently 129)",
    ],
    policy: [
      "Strengthen Domestic Violence Act with immediate protection order enforcement",
      "Equal pay legislation with mandatory corporate gender pay gap reporting",
      "Maternity benefit extension to gig economy and informal sector workers",
      "Anti-trafficking law strengthening with victim rehabilitation focus",
    ],
    citizen: [
      "Report crimes via women helpline 181 or NCRB's Cyber Crime portal",
      "Support women-owned businesses and organizations",
      "Challenge sexist behavior in families, workplaces, and communities",
      "Volunteer with organizations like Jagori, Breakthrough, and Action India",
    ],
    impact:
      "Gender equality could add $770 billion (₹64 lakh crore) to India's GDP by 2025 per McKinsey estimates, while transforming quality of life for 650 million women.",
  },
  poverty: {
    rootCauses: [
      "Inter-generational poverty traps with limited social mobility",
      "Welfare scheme leakage estimated at 20-30% of allocated funds",
      "Regional disparities with some states having 5x the poverty rate of others",
      "Informal economy leaving workers without safety nets",
      "Financial exclusion of 20% adults without bank accounts or credit access",
    ],
    globalBenchmark: {
      country: "China & Brazil",
      approach:
        "China lifted 800 million out of poverty through manufacturing-led growth and targeted programs. Brazil's Bolsa Familia conditional cash transfer reaching 14 million families.",
      outcome:
        "China eliminated extreme poverty by 2021. Brazil's poverty rate fell from 28% to 7% in Bolsa Familia's first decade.",
    },
    shortTerm: [
      "Universalize PM-JAY health coverage and PM-KISAN for all eligible beneficiaries",
      "Direct benefit transfer for all 430+ welfare schemes via Aadhaar (eliminate leakage)",
      "MGNREGA expansion to 150 days guaranteed employment in distressed districts",
      "National food security mission ensuring no citizen goes hungry",
      "Microfinance expansion reaching 5 crore additional women entrepreneurs",
    ],
    mediumTerm: [
      "Universal Basic Income pilot scaling to 100 poorest districts",
      "Skill development linked to guaranteed employment for youth in poverty pockets",
      "Affordable housing mission (PMAY) completing 3 crore houses",
      "Financial inclusion — bank account and digital payment access for every adult",
      "Inter-state development corridor reducing regional inequality",
    ],
    longTerm: [
      "Reduce multidimensional poverty from 230 million to under 50 million",
      "Achieve SDG 1 (No Poverty) by 2030 with measurable indicators",
      "Social mobility index showing children earning more than parents (American Dream equivalent)",
      "Sustainable livelihood for every household through diversified income sources",
    ],
    policy: [
      "National Social Registry integrating all welfare databases for targeted delivery",
      "Progressive taxation with wealth tax on ultra-high net worth individuals",
      "Rural development fund allocating 40% of infrastructure budget to poorest districts",
      "Gig worker social security legislation",
    ],
    citizen: [
      "Volunteer with NGOs working in slums and rural poverty pockets",
      "Donate to verified organizations via government DARPAN portal",
      "Hire and pay fair wages to domestic workers and informal labor",
      "Support local artisans and small businesses in economically depressed areas",
    ],
    impact:
      "Eliminating extreme poverty would unlock human potential of 230 million people, increasing national productivity and reducing social unrest and inequality-driven conflicts.",
  },
};

function contextualizeAnalysis(
  newsItem: NewsItem,
  sectorId: SectorId
): { additionalCauses: string[]; urgencyNote: string } {
  const title = newsItem.title.toLowerCase();
  const additionalCauses: string[] = [];
  let urgencyNote = "";

  if (newsItem.severity === "critical") {
    urgencyNote =
      "This is a CRITICAL issue requiring immediate intervention. Delay in action will compound human and economic costs exponentially.";
  } else if (newsItem.severity === "high") {
    urgencyNote =
      "This HIGH-priority issue demands urgent policy attention within the next 6 months to prevent escalation.";
  }

  if (title.includes("scam") || title.includes("fraud")) {
    additionalCauses.push(
      "Systemic audit failure allowed financial irregularities to go undetected for extended periods"
    );
    additionalCauses.push(
      "Political protection of accused individuals delays investigation and prosecution"
    );
  }
  if (title.includes("shortage") || title.includes("lack")) {
    additionalCauses.push(
      "Resource allocation mismatch between urban and rural/geographically disadvantaged areas"
    );
  }
  if (title.includes("protest")) {
    additionalCauses.push(
      "Failure of institutional grievance redressal channels forcing citizens to mass protest"
    );
    additionalCauses.push(
      "Policy formulation without adequate stakeholder consultation created public backlash"
    );
  }
  if (title.includes("pollution") || title.includes("air quality")) {
    additionalCauses.push(
      "Economic growth prioritized over environmental compliance in industrial licensing"
    );
  }

  return { additionalCauses, urgencyNote };
}

export async function analyzeIssue(
  newsItem: NewsItem,
  useAI: boolean = false
): Promise<AnalysisResult> {
  const sector = getSectorById(newsItem.sector);
  const expert = EXPERT_SOLUTIONS[newsItem.sector];
  const context = contextualizeAnalysis(newsItem, newsItem.sector);

  if (useAI && process.env.XAI_API_KEY) {
    try {
      const aiAnalysis = await callXAI(newsItem, sector?.name || newsItem.sector);
      if (aiAnalysis) return aiAnalysis;
    } catch {
      // Fall through to expert system
    }
  }

  const rootCauses = [
    ...expert.rootCauses.slice(0, 4),
    ...context.additionalCauses,
  ];

  return {
    issueId: newsItem.id,
    title: newsItem.title,
    sector: newsItem.sector,
    sectorName: sector?.name || newsItem.sector,
    rootCauses,
    globalBenchmark: expert.globalBenchmark,
    solutions: [
      {
        phase: "Immediate Action (0-6 months)",
        timeline: "0-6 months",
        actions: expert.shortTerm,
        expectedImpact: "Quick wins addressing most visible symptoms and preventing further deterioration",
      },
      {
        phase: "Structural Reform (6 months - 3 years)",
        timeline: "6 months - 3 years",
        actions: expert.mediumTerm,
        expectedImpact: "Systemic changes addressing root causes and building institutional capacity",
      },
      {
        phase: "Transformation (3-10 years)",
        timeline: "3-10 years",
        actions: expert.longTerm,
        expectedImpact: "Fundamental transformation positioning India among global leaders in this sector",
      },
    ],
    policyRecommendations: expert.policy,
    citizenActions: expert.citizen,
    estimatedImpact: context.urgencyNote
      ? `${context.urgencyNote} ${expert.impact}`
      : expert.impact,
    confidenceScore: newsItem.severity === "critical" ? 95 : newsItem.severity === "high" ? 90 : 85,
    analyzedAt: new Date().toISOString(),
    locale: "en",
  };
}

export async function analyzeSector(sectorId: SectorId): Promise<AnalysisResult> {
  const sector = getSectorById(sectorId);
  const expert = EXPERT_SOLUTIONS[sectorId];

  const syntheticNews: NewsItem = {
    id: `sector-${sectorId}`,
    title: `Comprehensive Analysis: India's ${sector?.name || sectorId} Challenges`,
    description: sector?.keyIssues.join(". ") || "",
    link: "#",
    pubDate: new Date().toISOString(),
    source: "India Reform Intelligence",
    sector: sectorId,
    severity: "high",
  };

  return analyzeIssue(syntheticNews);
}

async function callXAI(
  newsItem: NewsItem,
  sectorName: string
): Promise<AnalysisResult | null> {
  const response = await fetch("https://api.x.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.XAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "grok-3-mini",
      messages: [
        {
          role: "system",
          content: `You are an expert policy analyst specializing in Indian governance and reform. Analyze issues and provide actionable solutions. Respond in valid JSON only with this structure: { "rootCauses": string[], "globalBenchmark": { "country": string, "approach": string, "outcome": string }, "solutions": [{ "phase": string, "timeline": string, "actions": string[], "expectedImpact": string }], "policyRecommendations": string[], "citizenActions": string[], "estimatedImpact": string, "confidenceScore": number }`,
        },
        {
          role: "user",
          content: `Analyze this Indian ${sectorName} issue and provide comprehensive solutions:\n\nTitle: ${newsItem.title}\nDescription: ${newsItem.description}\nSeverity: ${newsItem.severity}`,
        },
      ],
      temperature: 0.3,
    }),
  });

  if (!response.ok) return null;

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) return null;

  try {
    const parsed = JSON.parse(content);
    return {
      issueId: newsItem.id,
      title: newsItem.title,
      sector: newsItem.sector,
      sectorName,
      ...parsed,
      analyzedAt: new Date().toISOString(),
    };
  } catch {
    return null;
  }
}