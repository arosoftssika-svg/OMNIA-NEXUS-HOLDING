import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure directories exist
const DATA_DIR = path.join(process.cwd(), "data");
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const DB_FILE = path.join(DATA_DIR, "db.json");

// Initial seed data
const initialDBState = {
  filiales: [
    {
      id: "filiale-1",
      nom: "Omnia Commerce & Distribution",
      slug: "omnia-commerce-distribution",
      secteur: "Commerce & Distribution",
      description: "Leader panafricain de la logistique de distribution, d'import-export et d'approvisionnement en biens de consommation en Côte d'Ivoire et dans la sous-région.",
      logoUrl: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=150&h=150&q=80",
      couvertureUrl: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1200&h=600&q=80",
      contenu: `<h2>Omnia Commerce & Distribution</h2><p>Omnia Commerce & Distribution est la branche commerciale d'OMNIA NEXUS HOLDING, spécialisée dans la logistique de chaîne d'approvisionnement et la grande distribution. Nous gérons des flux logistiques d'envergure internationale avec des infrastructures de pointe.</p><h3>Activités Principales</h3><ul><li>Importation et distribution de biens de consommation courante (FMCG).</li><li>Gestion de hubs de stockage réfrigérés et automatisés à Abidjan.</li><li>Réseau d'approvisionnement couvrant 6 pays de l'UEMOA.</li></ul><h3>Impact et Vision</h3><p>Notre ambition est de moderniser la chaîne d'approvisionnement africaine par l'intégration de technologies avancées de traçabilité et de livraison du dernier kilomètre, garantissant la sécurité alimentaire et l'accessibilité des produits de première nécessité.</p>`,
      contactEmail: "commerce@omnia-nexus.com",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: "filiale-2",
      nom: "Nexus Real Estate",
      slug: "nexus-real-estate",
      secteur: "Promotion Immobilière & Infrastructures",
      description: "Créateur de complexes résidentiels de haut standing et d'infrastructures commerciales durables intégrant les meilleures normes écologiques.",
      logoUrl: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=150&h=150&q=80",
      couvertureUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&h=600&q=80",
      contenu: `<h2>Nexus Real Estate</h2><p>Nexus Real Estate redéfinit le paysage urbain ouest-africain en développant des projets immobiliers innovants, durables et à haute valeur ajoutée. Des résidences de grand standing aux complexes d'affaires modernes, nos ouvrages sont conçus pour durer.</p><h3>Réalisations Phares</h3><ul><li><strong>Les Résidences de la Lagune :</strong> Un complexe de 120 appartements de standing avec certification environnementale en plein cœur d'Abidjan.</li><li><strong>Nexus Business Center :</strong> Une tour d'affaires intelligente de 15 étages accueillant de grandes multinationales.</li></ul><h3>Engagement Écologique</h3><p>Tous nos nouveaux projets intègrent des solutions solaires autonomes, des dispositifs de traitement d'eau intégrés et des matériaux d'origine locale pour réduire l'empreinte carbone.</p>`,
      contactEmail: "immobilier@omnia-nexus.com",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: "filiale-3",
      nom: "Omnia Capital Partners",
      slug: "omnia-capital-partners",
      secteur: "Investissements & M&A",
      description: "Société de capital-investissement dédiée à l'accompagnement des PME en forte croissance et à l'accélération digitale en Afrique de l'Ouest.",
      logoUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=150&h=150&q=80",
      couvertureUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&h=600&q=80",
      contenu: `<h2>Omnia Capital Partners</h2><p>Omnia Capital Partners est le véhicule d'investissement stratégique du groupe, centré sur le capital-développement, les fusions-acquisitions (M&A) et l'appui aux champions locaux du secteur numérique, financier et industriel.</p><h3>Stratégie d'Investissement</h3><ul><li><strong>Capital-Développement :</strong> Prise de participations minoritaires ou majoritaires dans des PME à fort potentiel de scaling.</li><li><strong>Accélération Digitale :</strong> Financement et accompagnement stratégique des Fintechs et plateformes technologiques d'Afrique de l'Ouest.</li></ul><h3>Notre Vision</h3><p>Nous combinons rigueur financière globale et ancrage africain profond pour transformer des opportunités à fort potentiel en leaders régionaux résilients.</p>`,
      contactEmail: "capital@omnia-nexus.com",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ],
  poles: [
    {
      id: "pole-1",
      nom: "Commerce & Distribution",
      slug: "commerce-services",
      description: "Importation, logistique globale, stockage intelligent et réseaux de distribution multi-pays.",
      contenu: `<h2>Pôle Commerce & Distribution</h2><p>Notre pôle Commerce orchestre l'approvisionnement et la logistique en Afrique de l'Ouest. En intégrant des plateformes d'e-commerce B2B et des parcs de transport routier modernes, nous réduisons les délais et optimisons la chaîne de valeur du producteur au consommateur.</p>`,
      couvertureUrl: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1000&h=500&q=80"
    },
    {
      id: "pole-2",
      nom: "Promotion Immobilière",
      slug: "promotion-immobiliere",
      description: "Aménagement foncier, construction d'éco-quartiers, d'immeubles de bureaux intelligents et de logements.",
      contenu: `<h2>Pôle Promotion Immobilière</h2><p>Le développement d'infrastructures durables est une priorité absolue. Nous concevons et bâtissons des espaces de vie et de travail respectueux des écosystèmes locaux, tout en créant des pôles de centralité urbaine modernes.</p>`,
      couvertureUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&h=500&q=80"
    },
    {
      id: "pole-3",
      nom: "Investissements Stratégiques",
      slug: "investissements-strategiques",
      description: "Prises de participation majoritaires ou minoritaires, fusions-acquisitions, restructurations de filières.",
      contenu: `<h2>Pôle Investissements Stratégiques</h2><p>Grâce à une analyse rigoureuse et un vaste réseau d'experts sectoriels, nous investissons dans des filières structurantes telles que les services financiers, la logistique portuaire et l'agro-industrie pour bâtir l'économie africaine de demain.</p>`,
      couvertureUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1000&h=500&q=80"
    },
    {
      id: "pole-4",
      nom: "Développement de Projets",
      slug: "developpement-de-projets",
      description: "Incubation d'initiatives industrielles à fort impact, d'énergies renouvelables et de partenariats public-privé.",
      contenu: `<h2>Pôle Développement de Projets</h2><p>Nous initions, finançons et mettons en œuvre des projets structurants en matière d'énergies propres, de gestion des déchets et d'infrastructures d'utilité publique sous forme de partenariats stratégiques.</p>`,
      couvertureUrl: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1000&h=500&q=80"
    }
  ],
  actualites: [
    {
      id: "news-1",
      titre: "OMNIA NEXUS HOLDING annonce l'acquisition d'une participation majoritaire dans une Fintech ouest-africaine",
      slug: "acquisition-fintech-ouest-africaine",
      extrait: "Le groupe d'investissement accélère sa transformation digitale et son expansion financière en prenant le contrôle de PayTech West-Africa.",
      contenu: `<p>Abidjan, le 15 Juillet 2026 — OMNIA NEXUS HOLDING a annoncé aujourd'hui la signature d'un accord définitif pour l'acquisition d'une participation majoritaire de 58% dans PayTech West-Africa, leader émergent des solutions de paiement mobile en Côte d'Ivoire et au Sénégal.</p><p>Cette acquisition stratégique menée par la filiale <strong>Omnia Capital Partners</strong> marque une étape décisive dans le développement d'un écosystème de services financiers numériques intégrés.</p><blockquote>"PayTech apporte une brique technologique exceptionnelle à nos activités de distribution et de logistique," explique Marie-Elisabeth Kouadio, Directrice Générale. "Nous prévoyons de déployer ces solutions de paiement instantané au sein de tout le réseau Omnia Commerce."</blockquote><p>L'opération reste soumise aux autorisations réglementaires de la Banque Centrale des États de l'Afrique de l'Ouest (BCEAO).</p>`,
      imageUrl: "https://images.unsplash.com/photo-1563013544-824ae1d704d3?auto=format&fit=crop&w=800&h=450&q=80",
      categorie: "Investissements",
      filialeId: "filiale-3",
      filialeNom: "Omnia Capital Partners",
      ressourcePresse: false,
      publiePar: "Direction de la Communication",
      publieLe: "2026-07-15T09:00:00.000Z"
    },
    {
      id: "news-2",
      titre: "Inauguration du nouveau complexe résidentiel d'architecture durable par Nexus Real Estate",
      slug: "inauguration-complexe-durable-nexus-real-estate",
      extrait: "La filiale immobilière a officiellement inauguré 'Les Résidences de la Lagune', un complexe éco-responsable moderne de grand standing.",
      contenu: `<p>Abidjan, le 28 Juin 2026 — C'est en présence des autorités ministérielles et des partenaires du groupe que <strong>Nexus Real Estate</strong> a inauguré son dernier chef-d'œuvre architectural, 'Les Résidences de la Lagune'.</p><p>Ce complexe de 120 appartements de haut standing se distingue par sa certification d'éco-efficience, une première dans le secteur immobilier ivoirien. Équipé de panneaux solaires photovoltaïques couvrant 40% des besoins énergétiques des parties communes et d'une station d'épuration intégrée pour le recyclage des eaux usées, le projet réconcilie prestige et respect de l'environnement.</p><p>« Les Résidences de la Lagune démontrent que l'Afrique peut être à l'avant-garde de l'architecture verte. C'est l'ADN même d'OMNIA NEXUS HOLDING de bâtir l'avenir de façon durable », a déclaré Jean-Pierre Touré lors de la coupure du ruban.</p>`,
      imageUrl: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&h=450&q=80",
      categorie: "Immobilier & RSE",
      filialeId: "filiale-2",
      filialeNom: "Nexus Real Estate",
      ressourcePresse: false,
      publiePar: "Département Relations Presse",
      publieLe: "2026-06-28T10:30:00.000Z"
    },
    {
      id: "news-3",
      titre: "Résultats financiers semestriels 2026 : OMNIA NEXUS enregistre une croissance robuste de ses activités",
      slug: "resultats-financiers-semestriels-2026-croissance-robuste",
      extrait: "Le groupe publie un chiffre d'affaires consolidé en hausse de 14.5%, soutenu par le dynamisme de son pôle logistique et distribution.",
      contenu: `<p>Abidjan, le 10 Juillet 2026 — OMNIA NEXUS HOLDING a présenté ce jour ses états financiers pour le premier semestre clos le 30 juin 2026. Les résultats affichent une dynamique de croissance remarquable sur l'ensemble de ses lignes de métiers.</p><h3>Chiffres Clés du Semestre</h3><ul><li><strong>Chiffre d'Affaires Consolidé :</strong> +14,5% par rapport au premier semestre 2025.</li><li><strong>Excédent Brut d'Exploitation (EBITDA) :</strong> En croissance de 11,2%, témoignant d'une excellente maîtrise des coûts opérationnels.</li><li><strong>Investissements R&D et Infrastructures :</strong> 15 millions EUR alloués aux parcs de stockage et plateformes digitales.</li></ul><p>Le pôle Commerce & Logistique a été le principal moteur de cette performance, stimulé par la hausse des volumes de biens distribués au sein des marchés sous-régionaux.</p>`,
      imageUrl: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=800&h=450&q=80",
      categorie: "Relations Investisseurs",
      filialeId: undefined,
      filialeNom: "OMNIA NEXUS HOLDING",
      ressourcePresse: true,
      publiePar: "Direction Financière",
      publieLe: "2026-07-10T16:00:00.000Z"
    },
    {
      id: "news-4",
      titre: "Lancement de la fondation Omnia Nexus pour l'éducation et l'entrepreneuriat des jeunes",
      slug: "lancement-fondation-omnia-nexus-education-entrepreneuriat",
      extrait: "Dotée d'un budget quinquennal de 3 milliards FCFA, la fondation financera des bourses d'études et des incubateurs locaux.",
      contenu: `<p>Abidjan, le 5 Juin 2026 — Fidèle à ses valeurs d'inclusion et d'engagement social, OMNIA NEXUS HOLDING est fier d'annoncer le lancement officiel de la <strong>Fondation OMNIA NEXUS</strong> pour l'éducation des talents de demain.</p><p>Cette fondation d'entreprise s'articulera autour de deux axes majeurs :</p><ul><li><strong>L'octroi de bourses d'excellence :</strong> Financement des études supérieures pour 150 étudiants méritants issus de milieux défavorisés dans de grandes écoles d'ingénieurs et de commerce d'Afrique de l'Ouest.</li><li><strong>L'incubateur Nexus Start :</strong> Un programme d'incubation technique et financière pour accompagner 30 startups portées par de jeunes entrepreneurs dans les domaines de l'AgriTech et de la GreenTech.</li></ul><p>La fondation sera présidée par le Dr. Alassane Sika, qui a rappelé à cette occasion : « Redonner aux communautés qui nous accueillent et encourager l'esprit d'entreprise des jeunes est le meilleur investissement pour la souveraineté économique du continent. »</p>`,
      imageUrl: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&h=450&q=80",
      categorie: "RSE & Communauté",
      filialeId: undefined,
      filialeNom: "Fondation OMNIA NEXUS",
      ressourcePresse: true,
      publiePar: "Comité de Direction RSE",
      publieLe: "2026-06-05T08:00:00.000Z"
    },
    {
      id: "news-5",
      titre: "Omnia Commerce étend sa chaîne logistique avec un nouvel entrepôt automatisé à Abidjan",
      slug: "omnia-commerce-nouvel-entrepot-automatise-abidjan",
      extrait: "La filiale logistique consolide sa position de leader avec un hub de stockage de 15 000 m² doté des dernières innovations de traçabilité.",
      contenu: `<p>Abidjan, le 18 Mai 2026 — <strong>Omnia Commerce & Distribution</strong> a entamé l'exploitation de son tout nouveau centre de distribution situé dans la zone industrielle de Yopougon, Abidjan.</p><p>Ce complexe moderne d'une capacité de 15 000 m² abrite des zones frigorifiques à température contrôlée pour les produits frais et une section entièrement gérée par un système de gestion d'entrepôt (WMS) intelligent.</p><p>Cette infrastructure de pointe permettra d'accroître de 40% les capacités de rotation du groupe, de réduire de moitié le temps de préparation des commandes des grossistes et de consolider le réseau de distribution inter-États.</p>`,
      imageUrl: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&h=450&q=80",
      categorie: "Opérations",
      filialeId: "filiale-1",
      filialeNom: "Omnia Commerce & Distribution",
      ressourcePresse: false,
      publiePar: "Omnia Commerce Logistique",
      publieLe: "2026-05-18T14:20:00.000Z"
    }
  ],
  membresGouvernance: [
    {
      id: "membre-1",
      nom: "Dr. Alassane Sika",
      fonction: "Président du Conseil d'Administration",
      bio: "Économiste émérite et investisseur de premier plan, le Dr. Alassane Sika possède plus de 25 ans d'expérience dans la finance de marché et la restructuration d'entreprises à l'échelle panafricaine. Ancien conseiller auprès d'institutions de développement internationales, il définit la vision stratégique globale d'OMNIA NEXUS HOLDING.",
      photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&h=400&q=80",
      ordre: 1
    },
    {
      id: "membre-2",
      nom: "Marie-Elisabeth Kouadio",
      fonction: "Directrice Générale Exécutive",
      bio: "Diplômée de HEC Paris et de l'École Polytechnique de l'EPFL, Marie-Elisabeth pilote les opérations de croissance externe et la gestion opérationnelle du groupe depuis sa nomination. Experte en fusions-acquisitions, elle a conduit avec succès plusieurs redressements industriels majeurs dans la sous-région.",
      photoUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&h=400&q=80",
      ordre: 2
    },
    {
      id: "membre-3",
      nom: "Jean-Pierre Touré",
      fonction: "Président du Comité d'Audit",
      bio: "Expert-comptable agréé et ancien associé d'un cabinet d'audit 'Big Four', Jean-Pierre est le garant de la rigueur comptable, de la conformité réglementaire et de la transparence d'OMNIA NEXUS HOLDING vis-à-vis des investisseurs et des régulateurs financiers.",
      photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&h=400&q=80",
      ordre: 3
    },
    {
      id: "membre-4",
      nom: "Amadou Diop",
      fonction: "Administrateur Indépendant",
      bio: "Spécialiste renommé des infrastructures publiques et des partenariats public-privé (PPP) en Afrique, Amadou Diop apporte au Conseil une perspective hautement stratégique sur l'éco-développement urbain et les projets énergétiques du groupe.",
      photoUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&h=400&q=80",
      ordre: 4
    },
    {
      id: "membre-5",
      nom: "Patricia Yao",
      fonction: "Directrice des Ressources Humaines & RSE",
      bio: "Forte d'un parcours remarquable au sein de grands groupes industriels, Patricia coordonne la gestion des talents, les relations sociales et la mise en œuvre de la politique RSE, intégrant des critères ESG rigoureux dans la performance de nos filiales.",
      photoUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&h=400&q=80",
      ordre: 5
    }
  ],
  offresEmploi: [
    {
      id: "job-1",
      titre: "Directeur/trice de l'Investissement Senior",
      slug: "directeur-investissement-senior",
      filialeId: "filiale-3",
      filialeNom: "Omnia Capital Partners",
      lieu: "Abidjan, Côte d'Ivoire",
      typeContrat: "CDI",
      description: "Nous recherchons un(e) Directeur/trice d'Investissement chevronné(e) pour structurer nos nouvelles prises de participations, superviser les processus de due diligence financière et stratégique, et encadrer l'équipe d'analystes M&A. Minimum 8 ans d'expérience en Private Equity ou Investment Banking.",
      actif: true,
      publieLe: "2026-07-12T08:00:00.000Z"
    },
    {
      id: "job-2",
      titre: "Analyste Financier M&A",
      slug: "analyste-financier-ma",
      filialeId: "filiale-3",
      filialeNom: "Omnia Capital Partners",
      lieu: "Abidjan, Côte d'Ivoire",
      typeContrat: "CDI",
      description: "Dans le cadre de l'expansion de nos activités financières, vous interviendrez sur l'analyse de cibles, la modélisation financière, l'évaluation d'entreprises et la préparation de mémos de présentation d'investissements. Diplômé d'une école de commerce de premier rang, avec 2 à 4 ans d'expérience.",
      actif: true,
      publieLe: "2026-07-10T09:30:00.000Z"
    },
    {
      id: "job-3",
      titre: "Responsable Logistique & Supply Chain",
      slug: "responsable-logistique-supply-chain",
      filialeId: "filiale-1",
      filialeNom: "Omnia Commerce & Distribution",
      lieu: "Abidjan - Zone Industrielle Yopougon",
      typeContrat: "CDI",
      description: "Pour notre nouveau hub logistique de 15 000 m², vous managerez les équipes de réception, préparation de commande et transport. Garant du taux de service clients et de l'optimisation des flux, vous maîtrisez parfaitement les systèmes WMS et ERP. Minimum 5 ans d'expérience en logistique grande consommation.",
      actif: true,
      publieLe: "2026-07-05T14:00:00.000Z"
    }
  ],
  candidatures: [
    {
      id: "cand-1",
      offreId: "job-2",
      offreTitre: "Analyste Financier M&A",
      spontanee: false,
      nom: "Emeka Okafor",
      email: "emeka.okafor@gmail.com",
      telephone: "+225 07 48 59 12 30",
      posteVoulu: "Analyste Financier",
      message: "Madame, Monsieur, très impressionné par la dynamique d'acquisition d'OMNIA NEXUS, je souhaite mettre mes compétences de modélisation financière à profit au sein de votre équipe Capital Partners.",
      cvUrl: "/uploads/cv_dummy_emeka.pdf",
      soumisLe: "2026-07-13T15:30:00.000Z",
      statut: "en cours"
    },
    {
      id: "cand-2",
      offreId: undefined,
      offreTitre: undefined,
      spontanee: true,
      nom: "Awa Diarra",
      email: "awa.diarra@yahoo.fr",
      telephone: "+225 05 12 34 56 78",
      posteVoulu: "Responsable RSE & Impact",
      message: "Candidature spontanée. Je souhaite accompagner la mise en conformité ESG et le développement de la fondation Omnia Nexus.",
      cvUrl: "/uploads/cv_dummy_awa.pdf",
      soumisLe: "2026-07-14T09:15:00.000Z",
      statut: "nouveau"
    }
  ],
  messages: [
    {
      id: "msg-1",
      nom: "Sébastien Dubois",
      email: "s.dubois@invest-global.com",
      sujet: "Demande de rendez-vous Relations Investisseurs",
      message: "Bonjour, représentant un fonds de pension européen intéressé par les infrastructures immobilières vertes de Nexus Real Estate, je souhaiterais m'entretenir avec votre directrice financière lors de notre venue à Abidjan le mois prochain.",
      filiale: "Relations Investisseurs",
      envoyeLe: "2026-07-14T11:45:00.000Z"
    },
    {
      id: "msg-2",
      nom: "Mariam Koné",
      email: "m.kone@agro-ivoire.com",
      sujet: "Partenariat d'approvisionnement",
      message: "Nous souhaiterions présenter notre gamme de produits agricoles certifiés bio pour intégration dans votre réseau logistique Omnia Commerce & Distribution.",
      filiale: "Omnia Commerce & Distribution",
      envoyeLe: "2026-07-15T16:20:00.000Z"
    }
  ],
  chiffresCles: [
    { id: "stat-1", label: "Filiales actives", valeur: 3, ordre: 1 },
    { id: "stat-2", label: "Pôles d'investissement", valeur: 4, ordre: 2 },
    { id: "stat-3", label: "Collaborateurs", valeur: 450, ordre: 3 },
    { id: "stat-4", label: "Milliards FCFA investis", valeur: 25, ordre: 4 },
    { id: "stat-5", label: "Années d'excellence", valeur: 12, ordre: 5 }
  ]
};

// Initialize DB file if not exists
function loadDB() {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(initialDBState, null, 2));
    return initialDBState;
  }
  try {
    const data = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading database file, using fallback.", err);
    return initialDBState;
  }
}

function saveDB(state: any) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(state, null, 2));
  } catch (err) {
    console.error("Error saving database file.", err);
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ extended: true, limit: "50mb" }));

  // Static serving for public uploaded files (e.g. CVs)
  app.use("/uploads", express.static(UPLOADS_DIR));

  // Initialize DB
  let db = loadDB();

  // API Endpoints
  app.get("/api/db", (req, res) => {
    res.json(db);
  });

  // Base64 File Upload API
  app.post("/api/upload", (req, res) => {
    const { name, type, data } = req.body;
    if (!name || !data) {
      return res.status(400).json({ error: "Fichier invalide" });
    }
    try {
      const base64Data = data.replace(/^data:.*;base64,/, "");
      const buffer = Buffer.from(base64Data, "base64");
      const safeName = `${Date.now()}_${name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
      const filePath = path.join(UPLOADS_DIR, safeName);
      fs.writeFileSync(filePath, buffer);
      res.json({ url: `/uploads/${safeName}` });
    } catch (err: any) {
      console.error("Error saving uploaded file", err);
      res.status(500).json({ error: "Erreur d'écriture du fichier" });
    }
  });

  // Auth Endpoint (Simple NextAuth-like simulator)
  app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;
    if (email === "admin@omnia-nexus.com" && password === "OmniaNexus2026Admin") {
      return res.json({
        token: "admin-session-token-2026",
        user: { email, role: "admin" }
      });
    } else if (email === "rh@omnia-nexus.com" && password === "OmniaNexus2026RH") {
      return res.json({
        token: "rh-session-token-2026",
        user: { email, role: "redacteur_rh" }
      });
    }
    res.status(401).json({ error: "Identifiants invalides" });
  });

  // CRUD Filiales
  app.get("/api/filiales", (req, res) => res.json(db.filiales));
  app.post("/api/filiales", (req, res) => {
    const filiale = {
      id: `filiale-${Date.now()}`,
      ...req.body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    db.filiales.push(filiale);
    saveDB(db);
    res.status(211).json(filiale);
  });
  app.put("/api/filiales/:id", (req, res) => {
    const index = db.filiales.findIndex((f: any) => f.id === req.params.id);
    if (index !== -1) {
      db.filiales[index] = {
        ...db.filiales[index],
        ...req.body,
        updatedAt: new Date().toISOString()
      };
      saveDB(db);
      return res.json(db.filiales[index]);
    }
    res.status(404).json({ error: "Filiale non trouvée" });
  });
  app.delete("/api/filiales/:id", (req, res) => {
    db.filiales = db.filiales.filter((f: any) => f.id !== req.params.id);
    saveDB(db);
    res.json({ success: true });
  });

  // CRUD Poles
  app.get("/api/poles", (req, res) => res.json(db.poles));
  app.post("/api/poles", (req, res) => {
    const pole = { id: `pole-${Date.now()}`, ...req.body };
    db.poles.push(pole);
    saveDB(db);
    res.status(211).json(pole);
  });
  app.put("/api/poles/:id", (req, res) => {
    const index = db.poles.findIndex((p: any) => p.id === req.params.id);
    if (index !== -1) {
      db.poles[index] = { ...db.poles[index], ...req.body };
      saveDB(db);
      return res.json(db.poles[index]);
    }
    res.status(404).json({ error: "Pôle non trouvé" });
  });
  app.delete("/api/poles/:id", (req, res) => {
    db.poles = db.poles.filter((p: any) => p.id !== req.params.id);
    saveDB(db);
    res.json({ success: true });
  });

  // CRUD Actualités
  app.get("/api/actualites", (req, res) => res.json(db.actualites));
  app.post("/api/actualites", (req, res) => {
    const article = {
      id: `news-${Date.now()}`,
      ...req.body,
      publieLe: new Date().toISOString()
    };
    db.actualites.push(article);
    saveDB(db);
    res.status(211).json(article);
  });
  app.put("/api/actualites/:id", (req, res) => {
    const index = db.actualites.findIndex((n: any) => n.id === req.params.id);
    if (index !== -1) {
      db.actualites[index] = { ...db.actualites[index], ...req.body };
      saveDB(db);
      return res.json(db.actualites[index]);
    }
    res.status(404).json({ error: "Article non trouvé" });
  });
  app.delete("/api/actualites/:id", (req, res) => {
    db.actualites = db.actualites.filter((n: any) => n.id !== req.params.id);
    saveDB(db);
    res.json({ success: true });
  });

  // CRUD Membres Gouvernance
  app.get("/api/gouvernance", (req, res) => {
    const sorted = [...db.membresGouvernance].sort((a, b) => a.ordre - b.ordre);
    res.json(sorted);
  });
  app.post("/api/gouvernance", (req, res) => {
    const membre = { id: `membre-${Date.now()}`, ...req.body };
    db.membresGouvernance.push(membre);
    saveDB(db);
    res.status(211).json(membre);
  });
  app.put("/api/gouvernance/:id", (req, res) => {
    const index = db.membresGouvernance.findIndex((m: any) => m.id === req.params.id);
    if (index !== -1) {
      db.membresGouvernance[index] = { ...db.membresGouvernance[index], ...req.body };
      saveDB(db);
      return res.json(db.membresGouvernance[index]);
    }
    res.status(404).json({ error: "Membre non trouvé" });
  });
  app.delete("/api/gouvernance/:id", (req, res) => {
    db.membresGouvernance = db.membresGouvernance.filter((m: any) => m.id !== req.params.id);
    saveDB(db);
    res.json({ success: true });
  });

  // CRUD Offres d'emploi
  app.get("/api/offres", (req, res) => res.json(db.offresEmploi));
  app.post("/api/offres", (req, res) => {
    const job = {
      id: `job-${Date.now()}`,
      ...req.body,
      publieLe: new Date().toISOString()
    };
    db.offresEmploi.push(job);
    saveDB(db);
    res.status(211).json(job);
  });
  app.put("/api/offres/:id", (req, res) => {
    const index = db.offresEmploi.findIndex((j: any) => j.id === req.params.id);
    if (index !== -1) {
      db.offresEmploi[index] = { ...db.offresEmploi[index], ...req.body };
      saveDB(db);
      return res.json(db.offresEmploi[index]);
    }
    res.status(404).json({ error: "Offre non trouvée" });
  });
  app.delete("/api/offres/:id", (req, res) => {
    db.offresEmploi = db.offresEmploi.filter((j: any) => j.id !== req.params.id);
    saveDB(db);
    res.json({ success: true });
  });

  // CRUD Candidatures
  app.get("/api/candidatures", (req, res) => res.json(db.candidatures));
  app.post("/api/candidatures", (req, res) => {
    const candidature = {
      id: `cand-${Date.now()}`,
      ...req.body,
      soumisLe: new Date().toISOString(),
      statut: "nouveau"
    };
    db.candidatures.push(candidature);
    saveDB(db);
    res.status(211).json(candidature);
  });
  app.put("/api/candidatures/:id", (req, res) => {
    const index = db.candidatures.findIndex((c: any) => c.id === req.params.id);
    if (index !== -1) {
      db.candidatures[index] = { ...db.candidatures[index], ...req.body };
      saveDB(db);
      return res.json(db.candidatures[index]);
    }
    res.status(404).json({ error: "Candidature non trouvée" });
  });

  // CRUD MessageContact
  app.get("/api/messages", (req, res) => res.json(db.messages));
  app.post("/api/messages", (req, res) => {
    const message = {
      id: `msg-${Date.now()}`,
      ...req.body,
      envoyeLe: new Date().toISOString()
    };
    db.messages.push(message);
    saveDB(db);
    res.status(211).json(message);
  });

  // CRUD ChiffreCle
  app.get("/api/chiffres", (req, res) => {
    const sorted = [...db.chiffresCles].sort((a, b) => a.ordre - b.ordre);
    res.json(sorted);
  });
  app.post("/api/chiffres", (req, res) => {
    const stats = { id: `stat-${Date.now()}`, ...req.body };
    db.chiffresCles.push(stats);
    saveDB(db);
    res.status(211).json(stats);
  });
  app.put("/api/chiffres/:id", (req, res) => {
    const index = db.chiffresCles.findIndex((s: any) => s.id === req.params.id);
    if (index !== -1) {
      db.chiffresCles[index] = { ...db.chiffresCles[index], ...req.body };
      saveDB(db);
      return res.json(db.chiffresCles[index]);
    }
    res.status(404).json({ error: "Chiffre non trouvé" });
  });
  app.delete("/api/chiffres/:id", (req, res) => {
    db.chiffresCles = db.chiffresCles.filter((s: any) => s.id !== req.params.id);
    saveDB(db);
    res.json({ success: true });
  });

  // Vite Integration Middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[OMNIA NEXUS HOLDING] server is listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
