import React, { useState, useEffect } from "react";
import {
  Filiale,
  PoleInvestissement,
  Actualite,
  MembreGouvernance,
  OffreEmploi,
  Candidature,
  MessageContact,
  ChiffreCle
} from "./types";
import NewsTicker from "./components/blocks/NewsTicker";
import MegaMenu from "./components/blocks/MegaMenu";
import HeroBanner from "./components/blocks/HeroBanner";
import ZigZagBlock from "./components/blocks/ZigZagBlock";
import CounterStats from "./components/blocks/CounterStats";
import EntityCard from "./components/blocks/EntityCard";
import Breadcrumb from "./components/blocks/Breadcrumb";
import Footer from "./components/blocks/Footer";
import AdminDashboard from "./components/admin/AdminDashboard";
import {
  Building2,
  FileText,
  Mail,
  Users,
  Search,
  Filter,
  ArrowRight,
  Briefcase,
  MapPin,
  Calendar,
  ChevronDown,
  Download,
  CheckCircle2,
  AlertCircle,
  Share2,
  Copy,
  Plus,
  Compass,
  FileDown,
  Award,
  BookOpen,
  Send,
  Upload,
  Lock,
  ExternalLink,
  Phone,
  Landmark
} from "lucide-react";

export default function App() {
  // Navigation & State Management
  const [currentView, setCurrentView] = useState<string>("home");
  const [selectedDetailId, setSelectedDetailId] = useState<string | null>(null);
  
  // Database States
  const [db, setDb] = useState<{
    filiales: Filiale[];
    poles: PoleInvestissement[];
    actualites: Actualite[];
    membresGouvernance: MembreGouvernance[];
    offresEmploi: OffreEmploi[];
    candidatures: Candidature[];
    messages: MessageContact[];
    chiffresCles: ChiffreCle[];
  }>({
    filiales: [],
    poles: [],
    actualites: [],
    membresGouvernance: [],
    offresEmploi: [],
    candidatures: [],
    messages: [],
    chiffresCles: []
  });

  const [loading, setLoading] = useState(true);

  // Auth state
  const [adminUser, setAdminUser] = useState<{ email: string; role: "admin" | "redacteur_rh" } | null>(null);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Filters state
  const [newsCategory, setNewsCategory] = useState("Tous");
  const [newsSearch, setNewsSearch] = useState("");
  const [pressOnly, setPressOnly] = useState(false);

  const [jobFiliale, setJobFiliale] = useState("Tous");
  const [jobContract, setJobContract] = useState("Tous");
  const [jobSearch, setJobSearch] = useState("");

  // Form Submissions States
  const [contactForm, setContactForm] = useState({
    nom: "",
    email: "",
    sujet: "",
    message: "",
    filiale: "Général"
  });
  const [contactSuccess, setContactSuccess] = useState(false);

  // Spontaneous candidacy Form State
  const [spontaneousOpen, setSpontaneousOpen] = useState(false);
  const [candidatureForm, setCandidatureForm] = useState({
    nom: "",
    email: "",
    telephone: "",
    posteVoulu: "",
    message: "",
    cvFile: null as File | null,
    cvFileName: ""
  });
  const [candidatureSuccess, setCandidatureSuccess] = useState(false);
  const [uploadingCV, setUploadingCV] = useState(false);

  // Job Application Form State (specific to an offer)
  const [jobApplicationForm, setJobApplicationForm] = useState({
    nom: "",
    email: "",
    telephone: "",
    message: "",
    cvFile: null as File | null,
    cvFileName: ""
  });
  const [jobApplicationSuccess, setJobApplicationSuccess] = useState(false);

  // Selected Governance Member Modal Bio
  const [selectedBioMember, setSelectedBioMember] = useState<MembreGouvernance | null>(null);

  // Share Article Pop State
  const [copiedLink, setCopiedLink] = useState(false);

  // Load Database Data
  const fetchData = async () => {
    try {
      const res = await fetch("/api/db");
      if (res.ok) {
        const data = await res.json();
        setDb({
          filiales: data.filiales || [],
          poles: data.poles || [],
          actualites: data.actualites || [],
          membresGouvernance: data.membresGouvernance || [],
          offresEmploi: data.offresEmploi || [],
          candidatures: data.candidatures || [],
          messages: data.messages || [],
          chiffresCles: data.chiffresCles || []
        });
      }
    } catch (err) {
      console.error("Failed to fetch database.", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Sync scroll position on view shift
  const handleNavigate = (view: string, detailId: string | null = null) => {
    setCurrentView(view);
    setSelectedDetailId(detailId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Auth Handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });
      if (res.ok) {
        const data = await res.json();
        setAdminUser(data.user);
        setLoginEmail("");
        setLoginPassword("");
      } else {
        const err = await res.json();
        setLoginError(err.error || "Identifiants incorrects.");
      }
    } catch (err) {
      setLoginError("Connexion au serveur impossible.");
    }
  };

  const handleLogout = () => {
    setAdminUser(null);
    if (currentView === "admin") {
      setCurrentView("home");
    }
  };

  // Upload Utility
  const uploadFileAsBase64 = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        try {
          const base64Data = reader.result as string;
          const res = await fetch("/api/upload", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: file.name,
              type: file.type,
              data: base64Data
            })
          });
          if (res.ok) {
            const uploaded = await res.json();
            resolve(uploaded.url);
          } else {
            reject("Upload failed");
          }
        } catch (e) {
          reject(e);
        }
      };
      reader.onerror = (error) => reject(error);
    });
  };

  // General Contact Submission Handler
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactForm)
      });
      if (res.ok) {
        setContactSuccess(true);
        setContactForm({ nom: "", email: "", sujet: "", message: "", filiale: "Général" });
        fetchData();
        setTimeout(() => setContactSuccess(false), 5000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Spontaneous application submit
  const handleCandidatureSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidatureForm.cvFile) {
      alert("Veuillez sélectionner un CV au format PDF.");
      return;
    }
    setUploadingCV(true);
    try {
      const cvUrl = await uploadFileAsBase64(candidatureForm.cvFile);
      const res = await fetch("/api/candidatures", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          spontanee: true,
          nom: candidatureForm.nom,
          email: candidatureForm.email,
          telephone: candidatureForm.telephone,
          posteVoulu: candidatureForm.posteVoulu,
          message: candidatureForm.message,
          cvUrl
        })
      });

      if (res.ok) {
        setCandidatureSuccess(true);
        setCandidatureForm({
          nom: "",
          email: "",
          telephone: "",
          posteVoulu: "",
          message: "",
          cvFile: null,
          cvFileName: ""
        });
        fetchData();
        setTimeout(() => {
          setCandidatureSuccess(false);
          setSpontaneousOpen(false);
        }, 5000);
      }
    } catch (err) {
      alert("Erreur lors de l'envoi de votre candidature.");
    } finally {
      setUploadingCV(false);
    }
  };

  // Job application submit (specific to an offer)
  const handleJobApplySubmit = async (e: React.FormEvent, job: OffreEmploi) => {
    e.preventDefault();
    if (!jobApplicationForm.cvFile) {
      alert("Veuillez sélectionner un CV au format PDF.");
      return;
    }
    setUploadingCV(true);
    try {
      const cvUrl = await uploadFileAsBase64(jobApplicationForm.cvFile);
      const res = await fetch("/api/candidatures", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          spontanee: false,
          offreId: job.id,
          offreTitre: job.titre,
          nom: jobApplicationForm.nom,
          email: jobApplicationForm.email,
          telephone: jobApplicationForm.telephone,
          message: jobApplicationForm.message,
          cvUrl
        })
      });

      if (res.ok) {
        setJobApplicationSuccess(true);
        setJobApplicationForm({
          nom: "",
          email: "",
          telephone: "",
          message: "",
          cvFile: null,
          cvFileName: ""
        });
        fetchData();
        setTimeout(() => setJobApplicationSuccess(false), 5000);
      }
    } catch (err) {
      alert("Erreur lors de l'envoi.");
    } finally {
      setUploadingCV(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-navy text-white flex flex-col items-center justify-center gap-4">
        <Landmark className="text-gold animate-bounce" size={48} />
        <span className="font-mono text-xs uppercase tracking-widest text-gold animate-pulse">Chargement d'OMNIA NEXUS HOLDING...</span>
      </div>
    );
  }

  // Find dynamic details
  const activeFiliale = db.filiales.find((f) => f.slug === selectedDetailId);
  const activePole = db.poles.find((p) => p.slug === selectedDetailId);
  const activeNews = db.actualites.find((n) => n.slug === selectedDetailId);
  const activeJob = db.offresEmploi.find((o) => o.slug === selectedDetailId);

  // Hydrate news list and jobs in UI fallbacks
  const latestNews = [...db.actualites].sort((a, b) => new Date(b.publieLe).getTime() - new Date(a.publieLe).getTime());

  return (
    <div className="flex flex-col min-h-screen select-none font-sans text-charcoal">
      
      {/* 1. Scrolling News Flash Ticker */}
      <NewsTicker newsList={latestNews} onSelectNews={(n) => handleNavigate("media-detail", n.slug)} />

      {/* 2. Main Navigation Header */}
      <MegaMenu
        currentView={currentView}
        selectedDetailId={selectedDetailId}
        onNavigate={handleNavigate}
        filiales={db.filiales}
        poles={db.poles}
        adminUser={adminUser}
        onLogout={handleLogout}
      />

      {/* 3. CORE ROUTER PAGE VIEWS */}
      <main className="flex-grow">
        
        {/* =========================================================================
            VIEW 1: HOME PAGE (Composed exactly according to Section 4.1 in strict order)
            ========================================================================= */}
        {currentView === "home" && (
          <div>
            {/* HeroBanner */}
            <HeroBanner
              media="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1920&h=1080&q=80"
              title="OMNIA NEXUS HOLDING"
              subtitle="Pôle panafricain d'excellence opérationnelle et d'investissements stratégiques durables, basé en Côte d'Ivoire."
              ctaLabel="Découvrir OMNIA NEXUS"
              onCtaClick={() => handleNavigate("le-groupe")}
            />

            {/* ZigZag Block 1: Mission / Vision */}
            <ZigZagBlock
              index={0}
              image="https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=800&h=600&q=80"
              category="Souveraineté & Excellence"
              title="Notre Mission et Vision Institutionnelle"
              description={`Bâtir un écosystème d'investissements d'envergure internationale favorisant la souveraineté économique de l'Afrique de l'Ouest.\n\nOMNIA NEXUS HOLDING s'engage à allier rentabilité financière rigoureuse et critères de gouvernance ESG les plus stricts, catalysant des opportunités d'infrastructures d'utilité publique, de logistique agroalimentaire et de transformation digitale.`}
              bulletPoints={[
                "Création d'emplois locaux qualifiés et inclusifs.",
                "Décarbonation progressive de nos filiales industrielles.",
                "Transparence comptable absolue et éthique de gestion."
              ]}
              ctaLabel="En savoir plus sur le groupe"
              onCtaClick={() => handleNavigate("le-groupe")}
            />

            {/* ZigZag Block 2: Nos Filiales */}
            <ZigZagBlock
              index={1}
              image="https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=800&h=600&q=80"
              category="Opérations de Terrain"
              title="Nos Filiales : Des Leaders Sectoriels"
              description={`Le groupe pilote un portefeuille d'entreprises à forte valeur ajoutée opérant dans la logistique de chaîne froide, la promotion immobilière verte et le capital-investissement régional.\n\nChaque filiale bénéficie de synergies technologiques croisées et de la solidité d'une infrastructure corporate commune.`}
              ctaLabel="Découvrir nos filiales"
              onCtaClick={() => handleNavigate("filiales")}
              bgLight={true}
            />

            {/* ZigZag Block 3: Nos Investissements */}
            <ZigZagBlock
              index={2}
              image="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&h=600&q=80"
              category="Stratégie & M&A"
              title="Nos Pôles d'Investissement"
              description={`Nous structurons nos investissements autour de 4 pôles à impact : Commerce & Distribution logistique, Promotion Immobilière d'éco-quartiers, Investissements Stratégiques (M&A) et Développement de Projets industriels transfrontaliers.\n\nNotre horizon est celui d'une valeur durable à long terme.`}
              ctaLabel="Explorer les secteurs d'investissements"
              onCtaClick={() => handleNavigate("investissements")}
            />

            {/* ZigZag Block 4: Media Centre */}
            <ZigZagBlock
              index={3}
              image="https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=800&h=600&q=80"
              category="Media Centre & Presse"
              title="Dernières Actualités & Communiqués Officiels"
              description={`Suivez en temps réel l'actualité des deals de fusions-acquisitions d'OMNIA, l'inauguration de nos complexes d'éco-construction et la publication officielle de nos états financiers semestriels.`}
              ctaLabel="Accéder au centre de presse"
              onCtaClick={() => handleNavigate("media-centre")}
              bgLight={true}
            />

            {/* ZigZag Block 5: Carrières */}
            <ZigZagBlock
              index={4}
              image="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&h=600&q=80"
              category="Ressources Humaines"
              title="Rejoignez la Synergie d'Excellence"
              description={`Nous recrutons en continu des profils à haute valeur éthique et technique pour accompagner la structuration de nos filiales. Analystes financiers, gestionnaires supply chain, ingénieurs éco-concepteurs : votre avenir est à la hauteur de nos ambitions.`}
              ctaLabel="Consulter nos offres d'emploi"
              onCtaClick={() => handleNavigate("carrieres")}
            />

            {/* CounterStats */}
            <CounterStats stats={db.chiffresCles} />
          </div>
        )}

        {/* =========================================================================
            VIEW 2: LE GROUPE
            ========================================================================= */}
        {currentView === "le-groupe" && (
          <div>
            <HeroBanner
              media="https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1920&h=1080&q=80"
              title="À propos d'OMNIA NEXUS"
              subtitle="Notre histoire, nos engagements éthiques et notre vision industrielle pour le continent africain."
              heightClass="min-h-[60vh]"
            />
            
            <Breadcrumb items={[{ label: "Le Groupe" }]} onNavigate={handleNavigate} />

            {/* Comprehensive Corporate presentation */}
            <section className="py-16 bg-white text-charcoal">
              <div className="max-w-5xl mx-auto px-6">
                <div className="text-center max-w-2xl mx-auto mb-16">
                  <span className="text-xs font-mono font-bold text-gold uppercase tracking-[0.2em] block mb-3">HISTORIQUE & CAPITAUX</span>
                  <h2 className="font-serif text-3xl font-bold text-navy tracking-tight">Un Ancrage Local aux Standards Globaux</h2>
                  <div className="w-12 h-[1px] bg-gold mx-auto mt-4"></div>
                </div>

                <div className="space-y-8 text-base leading-relaxed font-light">
                  <p>
                    Fondé il y a plus d'une décennie sous la forme d'un consortium d'affaires logistiques en Côte d'Ivoire, <strong>OMNIA NEXUS HOLDING S.A.</strong> s'est structuré pour devenir l'un des groupes d'investissement privés les plus dynamiques et respectés d'Afrique de l'Ouest.
                  </p>
                  <p>
                    À travers nos filiales et nos participations, nous apportons des solutions concrètes aux défis structurels de la sous-région, à savoir : l'efficacité logistique alimentaire, l'éco-urbanisation durable et l'accès universel à des plateformes technologiques de paiement sécurisées.
                  </p>

                  {/* Core Corporate Values */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
                    <div className="p-6 border border-navy/10 rounded-sm hover:border-gold/30 hover:bg-lightgrey transition-all">
                      <Award className="text-gold mb-4" size={24} />
                      <h4 className="font-serif text-base font-bold text-navy mb-2">Excellence Opérationnelle</h4>
                      <p className="text-xs text-charcoal/70 font-light leading-normal">
                        Nous intégrons les meilleures technologies et méthodes de gestion globale pour optimiser les performances de nos parcs industriels et de notre réseau.
                      </p>
                    </div>
                    <div className="p-6 border border-navy/10 rounded-sm hover:border-gold/30 hover:bg-lightgrey transition-all">
                      <Compass className="text-gold mb-4" size={24} />
                      <h4 className="font-serif text-base font-bold text-navy mb-2">Audace Responsable</h4>
                      <p className="text-xs text-charcoal/70 font-light leading-normal">
                        Bâtir l'avenir demande d'investir avec courage dans des filières d'avenir tout en assurant l'éthique sociale et environnementale locale.
                      </p>
                    </div>
                    <div className="p-6 border border-navy/10 rounded-sm hover:border-gold/30 hover:bg-lightgrey transition-all">
                      <BookOpen className="text-gold mb-4" size={24} />
                      <h4 className="font-serif text-base font-bold text-navy mb-2">Gouvernance de Confiance</h4>
                      <p className="text-xs text-charcoal/70 font-light leading-normal">
                        Un engagement absolu de transparence financière et administrative face à nos actionnaires, régulateurs de marchés et collaborateurs.
                      </p>
                    </div>
                  </div>

                  {/* Governance / Filiales CTAs */}
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-12">
                    <button
                      onClick={() => handleNavigate("gouvernance")}
                      className="px-6 py-3 bg-navy text-white text-xs font-bold uppercase tracking-widest hover:bg-gold hover:text-navy transition-all rounded-xs"
                    >
                      Consulter notre Gouvernance
                    </button>
                    <button
                      onClick={() => handleNavigate("filiales")}
                      className="px-6 py-3 border border-navy text-navy text-xs font-bold uppercase tracking-widest hover:bg-lightgrey transition-all rounded-xs"
                    >
                      Découvrir nos Filiales
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* =========================================================================
            VIEW 3: NOS FILIALES
            ========================================================================= */}
        {currentView === "filiales" && (
          <div className="py-24 bg-lightgrey">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center max-w-2xl mx-auto mb-16">
                <span className="text-xs font-mono font-bold text-gold uppercase tracking-[0.2em] block mb-3">SYNERGIES SECTORIELLES</span>
                <h1 className="font-serif text-3xl sm:text-4xl font-bold text-navy tracking-tight">Nos Filiales Leaders</h1>
                <p className="text-sm text-charcoal/70 mt-3 font-light leading-relaxed">
                  Chaque entité du groupe répond aux exigences d'efficience opérationnelle et de performance éthique définies par OMNIA NEXUS S.A.
                </p>
                <div className="w-12 h-[1px] bg-gold mx-auto mt-4"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {db.filiales.map((f) => (
                  <EntityCard
                    key={f.id}
                    type="subsidiary"
                    image={f.couvertureUrl}
                    title={f.nom}
                    description={f.description}
                    dateOrMeta={f.secteur}
                    onClick={() => handleNavigate("filiale-detail", f.slug)}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            VIEW 4: NOS FILIALES DETAIL (Section 4.3)
            ========================================================================= */}
        {currentView === "filiale-detail" && activeFiliale && (
          <div>
            <HeroBanner
              media={activeFiliale.couvertureUrl}
              title={activeFiliale.nom}
              subtitle={activeFiliale.secteur}
              heightClass="min-h-[50vh]"
            />
            
            <Breadcrumb
              items={[
                { label: "Nos Filiales", view: "filiales" },
                { label: activeFiliale.nom }
              ]}
              onNavigate={handleNavigate}
            />

            {/* Rich details section */}
            <section className="py-16 bg-white">
              <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12">
                
                {/* Left col: Content descriptive */}
                <div className="lg:col-span-8 space-y-8">
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={activeFiliale.logoUrl}
                      alt={`Logo ${activeFiliale.nom}`}
                      className="w-16 h-16 object-contain rounded-xs border border-navy/10 p-2"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h2 className="text-xl font-serif font-bold text-navy uppercase tracking-wider">{activeFiliale.nom}</h2>
                      <span className="text-xs font-mono font-bold text-gold uppercase">{activeFiliale.secteur}</span>
                    </div>
                  </div>

                  {/* Rich descriptive Content */}
                  <div
                    className="markdown-body prose max-w-none text-sm text-charcoal/80 leading-relaxed space-y-4"
                    dangerouslySetInnerHTML={{ __html: activeFiliale.contenu }}
                  />

                  {/* Filtered News associated with this Filiale (Section 4.3 requirement) */}
                  <div className="pt-12 border-t border-navy/5">
                    <h3 className="font-serif text-xl font-bold text-navy mb-6">Actualités liées à {activeFiliale.nom}</h3>
                    {db.actualites.filter(a => a.filialeId === activeFiliale.id).length === 0 ? (
                      <p className="text-xs text-charcoal/50 font-mono">Aucune actualité récente n'est liée à cette filiale.</p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {db.actualites
                          .filter(a => a.filialeId === activeFiliale.id)
                          .map((article) => (
                            <EntityCard
                              key={article.id}
                              type="news"
                              image={article.imageUrl}
                              category={article.categorie}
                              title={article.titre}
                              description={article.extrait}
                              dateOrMeta={article.publieLe}
                              metaExtra={article.publiePar}
                              onClick={() => handleNavigate("media-detail", article.slug)}
                            />
                          ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right col: Contact dedicated sidebar */}
                <div className="lg:col-span-4 space-y-6">
                  <div className="bg-navy text-white p-6 rounded-sm border border-gold/20 shadow-md">
                    <h3 className="font-serif text-base font-bold text-gold uppercase tracking-wider mb-2">Contacter la Filiale</h3>
                    <p className="text-xs text-white/70 font-light mb-4">
                      Pour toute opportunité commerciale, partenariat technique ou appel d'offres :
                    </p>
                    <div className="flex items-center gap-2 text-xs font-mono mb-6 bg-white/5 p-2 rounded-sm border border-white/10 truncate">
                      <Mail size={14} className="text-gold shrink-0" />
                      <span>{activeFiliale.contactEmail || "contact@omnia-nexus.com"}</span>
                    </div>

                    {/* Inline small contact */}
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        alert("Votre demande de partenariat a été soumise avec succès !");
                      }}
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-[10px] font-mono text-white/50 uppercase mb-1">Votre Nom</label>
                        <input
                          type="text"
                          required
                          className="w-full bg-white/5 border border-white/10 rounded-sm py-1.5 px-3 text-xs text-white placeholder-white/30 focus:outline-none focus:border-gold"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-white/50 uppercase mb-1">Email</label>
                        <input
                          type="email"
                          required
                          className="w-full bg-white/5 border border-white/10 rounded-sm py-1.5 px-3 text-xs text-white placeholder-white/30 focus:outline-none focus:border-gold"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-white/50 uppercase mb-1">Message</label>
                        <textarea
                          required
                          rows={3}
                          className="w-full bg-white/5 border border-white/10 rounded-sm py-1.5 px-3 text-xs text-white placeholder-white/30 focus:outline-none focus:border-gold resize-none"
                        ></textarea>
                      </div>
                      <button
                        type="submit"
                        className="w-full py-2 bg-gold text-navy text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-white hover:text-navy transition-all cursor-pointer"
                      >
                        Envoyer ma Demande
                      </button>
                    </form>
                  </div>
                </div>

              </div>
            </section>
          </div>
        )}

        {/* =========================================================================
            VIEW 5: NOS INVESTISSEMENTS
            ========================================================================= */}
        {currentView === "investissements" && (
          <div className="py-24 bg-lightgrey">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center max-w-2xl mx-auto mb-16">
                <span className="text-xs font-mono font-bold text-gold uppercase tracking-[0.2em] block mb-3">POLITIQUE DE CAPITAL</span>
                <h1 className="font-serif text-3xl sm:text-4xl font-bold text-navy tracking-tight">Nos Pôles d'Investissement</h1>
                <p className="text-sm text-charcoal/70 mt-3 font-light leading-relaxed">
                  Déploiement stratégique de nos ressources financières et humaines pour structurer les chaînes de valeur clés ouest-africaines.
                </p>
                <div className="w-12 h-[1px] bg-gold mx-auto mt-4"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {db.poles.map((p) => (
                  <EntityCard
                    key={p.id}
                    type="pole"
                    image={p.couvertureUrl}
                    title={p.nom}
                    description={p.description}
                    dateOrMeta="Pôle d'Investissement"
                    onClick={() => handleNavigate("investissement-detail", p.slug)}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            VIEW 6: NOS INVESTISSEMENTS DETAIL (Section 4.4)
            ========================================================================= */}
        {currentView === "investissement-detail" && activePole && (
          <div>
            <HeroBanner
              media={activePole.couvertureUrl}
              title={`Pôle ${activePole.nom}`}
              subtitle={activePole.description}
              heightClass="min-h-[50vh]"
            />
            
            <Breadcrumb
              items={[
                { label: "Nos Investissements", view: "investissements" },
                { label: activePole.nom }
              ]}
              onNavigate={handleNavigate}
            />

            <section className="py-16 bg-white">
              <div className="max-w-4xl mx-auto px-6">
                <div
                  className="prose max-w-none text-sm text-charcoal/80 leading-relaxed space-y-4"
                  dangerouslySetInnerHTML={{ __html: activePole.contenu }}
                />
                
                <div className="pt-12 border-t border-navy/10 mt-12 flex justify-center">
                  <button
                    onClick={() => handleNavigate("contact")}
                    className="px-6 py-3 bg-navy text-white text-xs font-bold uppercase tracking-widest hover:bg-gold hover:text-navy transition-all rounded-xs"
                  >
                    Proposer une opportunité d'investissement
                  </button>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* =========================================================================
            VIEW 7: GOUVERNANCE (Section 4.5)
            ========================================================================= */}
        {currentView === "gouvernance" && (
          <div>
            <HeroBanner
              media="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1920&h=1080&q=80"
              title="Gouvernance du Groupe"
              subtitle="Conseil d'Administration, comités statutaires d'audit et politique d'éthique des affaires."
              heightClass="min-h-[55vh]"
            />

            <Breadcrumb items={[{ label: "Gouvernance" }]} onNavigate={handleNavigate} />

            {/* Structure Description */}
            <section className="py-16 bg-white">
              <div className="max-w-7xl mx-auto px-6">
                
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16 items-center">
                  <div className="lg:col-span-7 space-y-6 text-sm text-charcoal/80 leading-relaxed font-light">
                    <span className="text-xs font-mono font-bold text-gold uppercase tracking-[0.2em] block">TRANSPARENCE & RIGUEUR</span>
                    <h2 className="font-serif text-2xl sm:text-3xl font-bold text-navy leading-tight">Une structure d'administration rigoureuse et indépendante</h2>
                    <div className="w-12 h-[1px] bg-gold mb-6"></div>
                    <p>
                      La gouvernance d'OMNIA NEXUS HOLDING S.A. est calquée sur les meilleurs standards internationaux d'éthique et de contrôle des capitaux. Notre Conseil d'Administration s'assure de l'alignement des opérations sur les intérêts à long terme de nos actionnaires et de nos communautés d'ancrage.
                    </p>
                    <p>
                      Deux comités spécialisés assistent directement le Conseil : le <strong>Comité d'Audit & Risques</strong> et le <strong>Comité de Nomination, Rémunération & RSE</strong>, garantissant l'indépendance de la notation financière et des audits environnementaux.
                    </p>
                    <div className="pt-4 flex flex-wrap gap-4">
                      <a
                        href="/uploads/charte_ethique_dummy.pdf"
                        download
                        onClick={(e) => {
                          e.preventDefault();
                          alert("Le téléchargement de la Charte d'Éthique & RSE (PDF) a été initialisé.");
                        }}
                        className="px-4 py-2.5 bg-navy text-white text-xs font-bold rounded-xs flex items-center gap-2 hover:bg-gold hover:text-navy transition-all uppercase tracking-wider"
                      >
                        <FileDown size={14} /> Télécharger la charte d'éthique
                      </a>
                    </div>
                  </div>

                  {/* Interactive SVG Organigramme (Section 4.5 requirement) */}
                  <div className="lg:col-span-5 bg-lightgrey p-6 rounded-sm border border-navy/10 shadow-md">
                    <h3 className="font-serif text-sm font-bold text-navy mb-4 text-center uppercase tracking-wider">Organigramme du Groupe</h3>
                    <div className="w-full flex justify-center">
                      <svg viewBox="0 0 400 320" className="w-full max-w-sm h-auto font-mono text-[9px] font-bold">
                        {/* Parent holding */}
                        <rect x="110" y="10" width="180" height="40" rx="3" fill="#0B1F3A" stroke="#B08D57" strokeWidth="1.5" />
                        <text x="200" y="34" fill="#FFFFFF" textAnchor="middle">CONSEIL D'ADMINISTRATION</text>

                        {/* Commitees */}
                        <line x1="200" y1="50" x2="200" y2="100" stroke="#0B1F3A" strokeWidth="1.5" strokeDasharray="3 3" />
                        <rect x="10" y="80" width="120" height="30" rx="3" fill="#B08D57" />
                        <text x="70" y="98" fill="#0B1F3A" textAnchor="middle">Comité d'Audit</text>

                        <rect x="270" y="80" width="120" height="30" rx="3" fill="#B08D57" />
                        <text x="330" y="98" fill="#0B1F3A" textAnchor="middle">Comité RSE</text>

                        {/* Direction generale */}
                        <line x1="200" y1="50" x2="200" y2="130" stroke="#0B1F3A" strokeWidth="1.5" />
                        <rect x="110" y="130" width="180" height="40" rx="3" fill="#0B1F3A" stroke="#B08D57" strokeWidth="1.5" />
                        <text x="200" y="154" fill="#FFFFFF" textAnchor="middle">DIRECTION GÉNÉRALE</text>

                        {/* Subsidiaries link */}
                        <line x1="200" y1="170" x2="200" y2="220" stroke="#0B1F3A" strokeWidth="1.5" />
                        <line x1="60" y1="220" x2="340" y2="220" stroke="#0B1F3A" strokeWidth="1.5" />

                        {/* Subsidiary 1 */}
                        <line x1="60" y1="220" x2="60" y2="250" stroke="#0B1F3A" strokeWidth="1.5" />
                        <rect x="10" y="250" width="100" height="40" rx="2" fill="#FFFFFF" stroke="#0B1F3A" strokeWidth="1.2" className="hover:fill-gold/10 transition-colors cursor-pointer" onClick={() => handleNavigate("filiale-detail", "omnia-commerce-distribution")} />
                        <text x="60" y="274" fill="#0B1F3A" textAnchor="middle">OMNIA COMMERCE</text>

                        {/* Subsidiary 2 */}
                        <line x1="200" y1="220" x2="200" y2="250" stroke="#0B1F3A" strokeWidth="1.5" />
                        <rect x="150" y="250" width="100" height="40" rx="2" fill="#FFFFFF" stroke="#0B1F3A" strokeWidth="1.2" className="hover:fill-gold/10 transition-colors cursor-pointer" onClick={() => handleNavigate("filiale-detail", "nexus-real-estate")} />
                        <text x="200" y="274" fill="#0B1F3A" textAnchor="middle">NEXUS ESTATE</text>

                        {/* Subsidiary 3 */}
                        <line x1="340" y1="220" x2="340" y2="250" stroke="#0B1F3A" strokeWidth="1.5" />
                        <rect x="290" y="250" width="100" height="40" rx="2" fill="#FFFFFF" stroke="#0B1F3A" strokeWidth="1.2" className="hover:fill-gold/10 transition-colors cursor-pointer" onClick={() => handleNavigate("filiale-detail", "omnia-capital-partners")} />
                        <text x="340" y="274" fill="#0B1F3A" textAnchor="middle">OMNIA CAPITAL</text>
                      </svg>
                    </div>
                    <span className="block text-[8px] text-center font-mono text-charcoal/40 uppercase mt-4">Cliquer sur une filiale pour consulter sa fiche descriptive</span>
                  </div>
                </div>

                {/* Governance members list (Section 4.5 requirement) */}
                <div className="pt-12 border-t border-navy/10">
                  <div className="text-center max-w-2xl mx-auto mb-12">
                    <span className="text-xs font-mono font-bold text-gold uppercase tracking-[0.2em] block mb-2">COMPOSITION DU CONSEIL</span>
                    <h3 className="font-serif text-2xl font-bold text-navy">Membres du Conseil d'Administration</h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6">
                    {db.membresGouvernance.map((membre) => (
                      <div
                        key={membre.id}
                        onClick={() => setSelectedBioMember(membre)}
                        className="bg-lightgrey border border-navy/5 rounded-xs p-4 flex flex-col items-center text-center cursor-pointer hover:shadow-xl hover:border-gold/30 transition-all group"
                      >
                        {membre.photoUrl && (
                          <div className="relative overflow-hidden w-28 h-28 rounded-full mb-4 border-2 border-gold/20 group-hover:border-gold transition-colors shrink-0">
                            <img
                              src={membre.photoUrl}
                              alt={membre.nom}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        )}
                        <h4 className="font-serif text-sm font-bold text-navy leading-snug group-hover:text-gold transition-colors">{membre.nom}</h4>
                        <p className="text-[10px] text-charcoal/50 font-mono font-bold uppercase tracking-wide mt-1.5 leading-normal">{membre.fonction}</p>
                        <span className="text-[10px] text-gold font-bold hover:underline mt-4 block">Voir la biographie &rarr;</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </section>

            {/* Individual member bio modal window */}
            {selectedBioMember && (
              <div className="fixed inset-0 bg-navy/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-sm border border-navy/10 p-6 max-w-lg w-full relative">
                  <button onClick={() => setSelectedBioMember(null)} className="absolute top-4 right-4 text-charcoal/50 hover:text-charcoal cursor-pointer text-lg font-bold">&times;</button>
                  <div className="flex items-center gap-4 border-b border-navy/10 pb-4 mb-4">
                    {selectedBioMember.photoUrl && (
                      <img src={selectedBioMember.photoUrl} alt={selectedBioMember.nom} className="w-16 h-16 rounded-full object-cover border border-gold" referrerPolicy="no-referrer" />
                    )}
                    <div>
                      <h4 className="font-serif text-lg font-bold text-navy">{selectedBioMember.nom}</h4>
                      <p className="text-xs font-mono font-bold text-gold uppercase tracking-wider">{selectedBioMember.fonction}</p>
                    </div>
                  </div>
                  <div className="space-y-4 text-sm text-charcoal/80 font-light leading-relaxed">
                    <p>{selectedBioMember.bio}</p>
                    <div className="flex justify-end">
                      <button onClick={() => setSelectedBioMember(null)} className="px-4 py-2 bg-navy text-white text-xs font-bold uppercase tracking-wider hover:bg-gold hover:text-navy rounded-sm cursor-pointer">Fermer</button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            VIEW 8: RELATIONS INVESTISSEURS (Section 4.6)
            ========================================================================= */}
        {currentView === "relations-investisseurs" && (
          <div>
            <HeroBanner
              media="https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=1920&h=1080&q=80"
              title="Relations Investisseurs"
              subtitle="Performance financière consolidée, communiqués officiels de réglementation et contacts actionnaires."
              heightClass="min-h-[55vh]"
            />

            <Breadcrumb items={[{ label: "Relations Investisseurs" }]} onNavigate={handleNavigate} />

            <section className="py-16 bg-white text-sm text-charcoal/85 leading-relaxed font-light">
              <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12">
                
                {/* Left block: Financial stats & PDF downloads */}
                <div className="lg:col-span-8 space-y-10">
                  <div className="space-y-4">
                    <span className="text-xs font-mono font-bold text-gold uppercase tracking-[0.2em] block">ROBUSTESSE FINANCIAL</span>
                    <h2 className="font-serif text-2xl sm:text-3xl font-bold text-navy leading-tight">Une croissance soutenue par des investissements industriels sélectifs</h2>
                    <p>
                      OMNIA NEXUS HOLDING S.A. maintient une notation financière saine et une croissance organique soutenue à travers ses filiales. Nos capitaux sont injectés dans des projets d'infrastructures physiques de distribution à haut rendement avec un endettement contrôlé.
                    </p>
                  </div>

                  {/* Financial KPI stats quick summary */}
                  <div className="grid grid-cols-3 gap-4 bg-lightgrey p-5 border border-navy/5 rounded-sm">
                    <div className="text-center">
                      <span className="block text-[10px] font-mono text-charcoal/50 uppercase">TRI Moyen</span>
                      <strong className="block text-2xl font-serif text-navy mt-1">18.5%</strong>
                    </div>
                    <div className="text-center border-x border-navy/10">
                      <span className="block text-[10px] font-mono text-charcoal/50 uppercase">Capital Social</span>
                      <strong className="block text-2xl font-serif text-navy mt-1">10 Mrds</strong>
                    </div>
                    <div className="text-center">
                      <span className="block text-[10px] font-mono text-charcoal/50 uppercase">EBITDA Marge</span>
                      <strong className="block text-2xl font-serif text-navy mt-1">22.4%</strong>
                    </div>
                  </div>

                  {/* Download documents (Section 4.6 requirement) */}
                  <div className="space-y-4">
                    <h3 className="font-serif text-lg font-bold text-navy">Documents Financiers Réglementés</h3>
                    <div className="divide-y divide-navy/5">
                      {[
                        { title: "Rapport d'Activité Annuel Consolidé 2025", size: "4.2 MB", type: "PDF" },
                        { title: "Présentation Institutionnelle & Stratégie 2026-2030", size: "6.8 MB", type: "PDF" },
                        { title: "États Financiers Semestriels Audités H1 2026", size: "3.1 MB", type: "PDF" }
                      ].map((doc, i) => (
                        <div key={i} className="py-3 flex items-center justify-between gap-4">
                          <div className="flex items-start gap-2.5">
                            <FileDown size={18} className="text-gold shrink-0 mt-0.5" />
                            <div>
                              <span className="block text-sm font-medium text-navy">{doc.title}</span>
                              <span className="block text-[10px] font-mono text-charcoal/40 font-bold uppercase mt-0.5">{doc.type} &bull; {doc.size}</span>
                            </div>
                          </div>
                          <button
                            onClick={() => alert(`Téléchargement de : ${doc.title}`)}
                            className="text-xs text-gold font-bold uppercase tracking-wider hover:underline"
                          >
                            Télécharger
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right block: Dedicated Investor Contact Form (Section 4.6 requirement - distinct from contact general) */}
                <div className="lg:col-span-4 bg-navy text-white p-6 rounded-sm border border-gold/20 shadow-md space-y-4">
                  <h3 className="font-serif text-base font-bold text-gold uppercase tracking-wider">Contact Actionnaires & Institutionnels</h3>
                  <p className="text-xs text-white/70 font-light">
                    Formulaire réservé exclusivement aux analystes, banques d'investissements et actionnaires :
                  </p>
                  
                  {contactSuccess ? (
                    <div className="bg-green-500/15 border border-green-500/30 text-green-400 p-4 rounded-sm text-xs space-y-1">
                      <strong className="block font-bold">Demande enregistrée !</strong>
                      <p>Notre service des Relations Institutionnelles prendra contact avec vous dans les meilleurs délais.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleContactSubmit} className="space-y-4 text-xs">
                      <input type="hidden" name="filiale" value="Relations Investisseurs" />
                      <div>
                        <label className="block text-[10px] font-mono text-white/50 uppercase mb-1">Votre Nom / Cabinet</label>
                        <input
                          type="text"
                          required
                          value={contactForm.nom}
                          onChange={(e) => setContactForm({ ...contactForm, nom: e.target.value, filiale: "Relations Investisseurs" })}
                          placeholder="Cabinet / Nom"
                          className="w-full bg-white/5 border border-white/10 rounded-sm py-2 px-3 text-xs text-white focus:outline-none focus:border-gold"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-white/50 uppercase mb-1">Email professionnel</label>
                        <input
                          type="email"
                          required
                          value={contactForm.email}
                          onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                          placeholder="analyste@firm.com"
                          className="w-full bg-white/5 border border-white/10 rounded-sm py-2 px-3 text-xs text-white focus:outline-none focus:border-gold"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-white/50 uppercase mb-1">Objet de la demande</label>
                        <input
                          type="text"
                          required
                          value={contactForm.sujet}
                          onChange={(e) => setContactForm({ ...contactForm, sujet: e.target.value })}
                          placeholder="Revue financière..."
                          className="w-full bg-white/5 border border-white/10 rounded-sm py-2 px-3 text-xs text-white focus:outline-none focus:border-gold"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-white/50 uppercase mb-1">Message</label>
                        <textarea
                          required
                          rows={4}
                          value={contactForm.message}
                          onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-sm py-2 px-3 text-xs text-white focus:outline-none focus:border-gold resize-none"
                        ></textarea>
                      </div>
                      <button
                        type="submit"
                        className="w-full py-2.5 bg-gold text-navy font-bold uppercase tracking-wider rounded-sm hover:bg-white hover:text-navy transition-all cursor-pointer text-center"
                      >
                        Soumettre ma demande
                      </button>
                    </form>
                  )}
                </div>

              </div>
            </section>
          </div>
        )}

        {/* =========================================================================
            VIEW 9: MEDIA CENTRE (Section 4.7)
            ========================================================================= */}
        {currentView === "media-centre" && (
          <div className="py-24 bg-lightgrey">
            <div className="max-w-7xl mx-auto px-6">
              
              <div className="text-center max-w-2xl mx-auto mb-16">
                <span className="text-xs font-mono font-bold text-gold uppercase tracking-[0.2em] block mb-3">MEDIA CENTRE & PRESS</span>
                <h1 className="font-serif text-3xl sm:text-4xl font-bold text-navy tracking-tight">Actualités et Ressources Presse</h1>
                <p className="text-sm text-charcoal/70 mt-3 font-light leading-relaxed">
                  Publications réglementaires, communiqués de presse officiels et couverture médiatique de nos filiales.
                </p>
                <div className="w-12 h-[1px] bg-gold mx-auto mt-4"></div>
              </div>

              {/* Filtering bar */}
              <div className="bg-white p-4 border border-black/5 rounded-xs mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
                
                {/* Category selectors */}
                <div className="flex gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
                  {["Tous", "Investissements", "Immobilier & RSE", "Relations Investisseurs", "RSE & Communauté", "Opérations"].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setNewsCategory(cat)}
                      className={`px-3 py-1.5 rounded-sm text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                        newsCategory === cat ? "bg-navy text-white" : "bg-lightgrey text-charcoal hover:bg-gold/10"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Press-only flag and Search input */}
                <div className="flex gap-4 items-center justify-between w-full md:w-auto shrink-0">
                  <div className="flex items-center gap-1.5">
                    <input
                      type="checkbox"
                      id="pressOnlyCheck"
                      checked={pressOnly}
                      onChange={(e) => setPressOnly(e.target.checked)}
                      className="w-4 h-4 text-gold border-navy/10 rounded-sm"
                    />
                    <label htmlFor="pressOnlyCheck" className="text-xs font-mono font-bold text-navy select-none">Ressources Presse Only</label>
                  </div>
                  <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/40" />
                    <input
                      type="text"
                      placeholder="Rechercher..."
                      value={newsSearch}
                      onChange={(e) => setNewsSearch(e.target.value)}
                      className="border border-navy/10 rounded-sm py-1.5 pl-8 pr-3 text-xs w-48 focus:outline-none focus:border-gold"
                    />
                  </div>
                </div>

              </div>

              {/* Filtered grid output */}
              {latestNews
                .filter(a => newsCategory === "Tous" || a.categorie === newsCategory)
                .filter(a => !pressOnly || a.ressourcePresse)
                .filter(a => a.titre.toLowerCase().includes(newsSearch.toLowerCase()) || a.extrait.toLowerCase().includes(newsSearch.toLowerCase()))
                .length === 0 ? (
                <div className="text-center py-16 bg-white border border-black/5 rounded-xs">
                  <AlertCircle size={32} className="text-gold mx-auto mb-2" />
                  <p className="text-sm font-mono text-charcoal/50">Aucun article ne correspond à vos filtres de recherche.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {latestNews
                    .filter(a => newsCategory === "Tous" || a.categorie === newsCategory)
                    .filter(a => !pressOnly || a.ressourcePresse)
                    .filter(a => a.titre.toLowerCase().includes(newsSearch.toLowerCase()) || a.extrait.toLowerCase().includes(newsSearch.toLowerCase()))
                    .map((article) => (
                      <EntityCard
                        key={article.id}
                        type="news"
                        image={article.imageUrl}
                        category={article.categorie}
                        title={article.titre}
                        description={article.extrait}
                        dateOrMeta={article.publieLe}
                        metaExtra={article.publiePar}
                        onClick={() => handleNavigate("media-detail", article.slug)}
                      />
                    ))}
                </div>
              )}

            </div>
          </div>
        )}

        {/* =========================================================================
            VIEW 10: MEDIA DETAIL (Section 4.7)
            ========================================================================= */}
        {currentView === "media-detail" && activeNews && (
          <div>
            <HeroBanner
              media={activeNews.imageUrl}
              title={activeNews.titre}
              subtitle={`Publié le ${new Date(activeNews.publieLe).toLocaleDateString("fr-FR")} par ${activeNews.publiePar}`}
              heightClass="min-h-[50vh]"
            />

            <Breadcrumb
              items={[
                { label: "Media Centre", view: "media-centre" },
                { label: activeNews.titre }
              ]}
              onNavigate={handleNavigate}
            />

            <section className="py-16 bg-white">
              <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12">
                
                {/* News Article body */}
                <div className="lg:col-span-8 space-y-6">
                  <span className="bg-gold/10 text-navy font-bold uppercase tracking-wider px-2.5 py-1 text-xs rounded-sm">
                    {activeNews.categorie}
                  </span>
                  
                  <div
                    className="prose max-w-none text-base text-charcoal/80 font-light leading-relaxed space-y-6 pt-4"
                    dangerouslySetInnerHTML={{ __html: activeNews.contenu }}
                  />

                  {activeNews.ressourcePresse && (
                    <div className="mt-12 p-5 bg-gold/10 border border-gold/20 rounded-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div>
                        <strong className="block text-sm font-bold text-navy">Communiqué de Presse Officiel (PDF)</strong>
                        <span className="block text-xs text-charcoal/50">Pour diffusion publique immédiate</span>
                      </div>
                      <button
                        onClick={() => alert("Le téléchargement du kit de presse a été initié.")}
                        className="px-4 py-2.5 bg-navy text-white text-[10px] font-bold uppercase tracking-widest rounded-sm hover:bg-gold hover:text-navy transition-all shrink-0"
                      >
                        Télécharger le Kit Presse
                      </button>
                    </div>
                  )}
                </div>

                {/* Sharing sidebar widget (Section 4.7 requirement) */}
                <div className="lg:col-span-4 space-y-6">
                  <div className="bg-lightgrey p-6 rounded-sm border border-navy/5 space-y-4 sticky top-28">
                    <h4 className="font-serif text-sm font-bold text-navy uppercase tracking-wider">Partager cet article</h4>
                    <p className="text-xs text-charcoal/60 leading-relaxed font-light">
                      Faites circuler ce communiqué de presse officiel au sein de vos cercles d'affaires.
                    </p>
                    
                    <div className="space-y-2 pt-2">
                      <button
                        onClick={handleCopyLink}
                        className="w-full py-2 bg-white hover:bg-navy hover:text-white border border-navy/10 rounded-sm text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
                      >
                        <Copy size={14} /> {copiedLink ? "Lien copié !" : "Copier l'URL de l'article"}
                      </button>
                      
                      <div className="grid grid-cols-3 gap-2">
                        <button onClick={() => alert("Partage sur LinkedIn initialisé.")} className="py-2 bg-[#0077B5] hover:bg-opacity-95 text-white rounded-sm text-[10px] font-bold uppercase transition-all">LinkedIn</button>
                        <button onClick={() => alert("Partage sur Twitter initialisé.")} className="py-2 bg-[#1DA1F2] hover:bg-opacity-95 text-white rounded-sm text-[10px] font-bold uppercase transition-all">Twitter</button>
                        <button onClick={() => alert("Partage sur Facebook initialisé.")} className="py-2 bg-[#1877F2] hover:bg-opacity-95 text-white rounded-sm text-[10px] font-bold uppercase transition-all">Facebook</button>
                      </div>
                    </div>
                    
                    {activeNews.filialeNom && (
                      <div className="border-t border-navy/10 pt-4 mt-4 text-xs font-light">
                        <strong className="text-[10px] font-mono text-charcoal/50 uppercase block mb-1">Entité rattachée :</strong>
                        <span className="font-medium text-navy">{activeNews.filialeNom}</span>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </section>
          </div>
        )}

        {/* =========================================================================
            VIEW 11: CARRIERES (Section 4.8)
            ========================================================================= */}
        {currentView === "carrieres" && (
          <div>
            <HeroBanner
              media="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1920&h=1080&q=80"
              title="Rejoignez OMNIA NEXUS"
              subtitle="Cultivez l'excellence au sein d'un groupe d'investissement engagé et souverain."
              heightClass="min-h-[55vh]"
            />

            <Breadcrumb items={[{ label: "Carrières" }]} onNavigate={handleNavigate} />

            {/* Recrutement process description */}
            <section className="py-16 bg-white">
              <div className="max-w-7xl mx-auto px-6">
                
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16 items-center">
                  <div className="lg:col-span-8 space-y-6 text-sm text-charcoal/80 leading-relaxed font-light">
                    <span className="text-xs font-mono font-bold text-gold uppercase tracking-[0.2em] block">CULTURE & TALENTS</span>
                    <h2 className="font-serif text-2xl sm:text-3xl font-bold text-navy">Notre processus de recrutement sélectif et méritocratique</h2>
                    <div className="w-12 h-[1px] bg-gold mb-4"></div>
                    <p>
                      Rejoindre le groupe d'investissement d'OMNIA NEXUS S.A., c'est faire partie d'une équipe dynamique de hauts talents s'engageant quotidiennement à redéfinir la valeur industrielle de l'Afrique de l'Ouest.
                    </p>
                    <p>
                      Notre processus s'articule autour de 3 étapes clés : la <strong>présélection sur CV</strong> et lettre de motivation, une <strong>étude de cas technique</strong> ou panel de tests, puis un <strong>grand entretien</strong> d'adéquation culturelle et d'évaluation éthique avec le comité RH de la filiale concernée.
                    </p>
                  </div>
                  
                  {/* Spontaneous apply card trigger */}
                  <div className="lg:col-span-4 bg-navy text-white p-6 border border-gold/25 rounded-sm shadow-xl flex flex-col gap-4 text-center">
                    <Award className="text-gold mx-auto" size={32} />
                    <h3 className="font-serif text-base font-bold text-gold uppercase tracking-wider">Aucune offre ne vous correspond ?</h3>
                    <p className="text-xs text-white/70 font-light leading-relaxed">
                      Déposez votre CV en candidature spontanée auprès de notre service des Ressources Humaines.
                    </p>
                    <button
                      onClick={() => setSpontaneousOpen(true)}
                      className="py-3 bg-gold text-navy font-bold text-xs uppercase tracking-widest rounded-sm hover:bg-white hover:text-navy transition-all cursor-pointer"
                    >
                      Candidature Spontanée
                    </button>
                  </div>
                </div>

                {/* Job filters toolbar */}
                <div className="bg-lightgrey p-5 border border-navy/5 rounded-xs mb-8">
                  <h3 className="font-serif text-lg font-bold text-navy mb-4">Postes ouverts au recrutement</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                    <div>
                      <label className="block text-[10px] font-mono text-charcoal/60 uppercase mb-1 font-bold">Filiale</label>
                      <select
                        value={jobFiliale}
                        onChange={(e) => setJobFiliale(e.target.value)}
                        className="w-full bg-white border border-navy/10 p-2 rounded-sm text-xs"
                      >
                        <option value="Tous">Toutes les entités</option>
                        {db.filiales.map(f => (
                          <option key={f.id} value={f.id}>{f.nom}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-[10px] font-mono text-charcoal/60 uppercase mb-1 font-bold">Type de contrat</label>
                      <select
                        value={jobContract}
                        onChange={(e) => setJobContract(e.target.value)}
                        className="w-full bg-white border border-navy/10 p-2 rounded-sm text-xs"
                      >
                        <option value="Tous">Tous contrats</option>
                        <option value="CDI">CDI (Indéterminé)</option>
                        <option value="CDD">CDD (Déterminé)</option>
                        <option value="Stage">Stage</option>
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-mono text-charcoal/60 uppercase mb-1 font-bold">Rechercher par intitulé</label>
                      <div className="relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/40" />
                        <input
                          type="text"
                          placeholder="ex. Chef de Projet, Analyste..."
                          value={jobSearch}
                          onChange={(e) => setJobSearch(e.target.value)}
                          className="w-full bg-white border border-navy/10 p-2 pl-8 rounded-sm text-xs focus:outline-none focus:border-gold"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Jobs grid output */}
                {db.offresEmploi
                  .filter(o => o.actif)
                  .filter(o => jobFiliale === "Tous" || o.filialeId === jobFiliale)
                  .filter(o => jobContract === "Tous" || o.typeContrat === jobContract)
                  .filter(o => o.titre.toLowerCase().includes(jobSearch.toLowerCase()))
                  .length === 0 ? (
                  <div className="text-center py-16 bg-lightgrey border border-navy/5 rounded-xs">
                    <AlertCircle size={32} className="text-gold mx-auto mb-2" />
                    <p className="text-sm font-mono text-charcoal/50">Aucun poste ne correspond à vos filtres actuels. Réessayez ou posez un dossier spontané.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {db.offresEmploi
                      .filter(o => o.actif)
                      .filter(o => jobFiliale === "Tous" || o.filialeId === jobFiliale)
                      .filter(o => jobContract === "Tous" || o.typeContrat === jobContract)
                      .filter(o => o.titre.toLowerCase().includes(jobSearch.toLowerCase()))
                      .map((job) => (
                        <EntityCard
                          key={job.id}
                          type="job"
                          title={job.titre}
                          description={job.description}
                          dateOrMeta={job.typeContrat}
                          metaExtra={job.lieu}
                          ctaLabel="Consulter l'offre"
                          onClick={() => handleNavigate("offre-detail", job.slug)}
                        />
                      ))}
                  </div>
                )}

              </div>
            </section>

            {/* SPONTANEOUS CANDIDATURE OVERLAY POPUP */}
            {spontaneousOpen && (
              <div className="fixed inset-0 bg-navy/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-sm border border-navy/10 p-6 max-w-xl w-full relative max-h-[90vh] overflow-y-auto">
                  <button
                    onClick={() => setSpontaneousOpen(false)}
                    className="absolute top-4 right-4 text-charcoal/50 hover:text-charcoal cursor-pointer text-xl font-bold"
                  >
                    &times;
                  </button>
                  
                  <div className="flex items-center gap-2 mb-4 border-b border-navy/10 pb-3">
                    <Award className="text-gold" size={18} />
                    <h3 className="text-lg font-serif font-bold text-navy">Formulaire de Candidature Spontanée</h3>
                  </div>

                  {candidatureSuccess ? (
                    <div className="bg-green-500/15 border border-green-500/30 text-green-400 p-4 rounded-sm text-xs space-y-1 text-center">
                      <CheckCircle2 className="mx-auto text-green-400" size={32} />
                      <strong className="block font-bold text-sm mt-2">Dossier reçu !</strong>
                      <p>Vos informations de candidature et votre CV ont été enregistrés auprès du service RH d'OMNIA NEXUS.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleCandidatureSubmit} className="space-y-4 text-xs">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-mono text-charcoal/60 uppercase mb-1 font-bold">Nom complet *</label>
                          <input
                            type="text"
                            required
                            value={candidatureForm.nom}
                            onChange={(e) => setCandidatureForm({ ...candidatureForm, nom: e.target.value })}
                            className="w-full border border-navy/10 rounded-sm p-2 text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-mono text-charcoal/60 uppercase mb-1 font-bold">Adresse Email *</label>
                          <input
                            type="email"
                            required
                            value={candidatureForm.email}
                            onChange={(e) => setCandidatureForm({ ...candidatureForm, email: e.target.value })}
                            className="w-full border border-navy/10 rounded-sm p-2 text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-mono text-charcoal/60 uppercase mb-1 font-bold">Téléphone</label>
                          <input
                            type="text"
                            value={candidatureForm.telephone}
                            onChange={(e) => setCandidatureForm({ ...candidatureForm, telephone: e.target.value })}
                            className="w-full border border-navy/10 rounded-sm p-2 text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-mono text-charcoal/60 uppercase mb-1 font-bold">Poste souhaité *</label>
                          <input
                            type="text"
                            required
                            placeholder="ex. Analyste Financier, Logor..."
                            value={candidatureForm.posteVoulu}
                            onChange={(e) => setCandidatureForm({ ...candidatureForm, posteVoulu: e.target.value })}
                            className="w-full border border-navy/10 rounded-sm p-2 text-xs"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono text-charcoal/60 uppercase mb-1 font-bold">Lettre d'accompagnement (Message) *</label>
                        <textarea
                          required
                          rows={4}
                          value={candidatureForm.message}
                          onChange={(e) => setCandidatureForm({ ...candidatureForm, message: e.target.value })}
                          className="w-full border border-navy/10 rounded-sm p-2 text-xs resize-none"
                        ></textarea>
                      </div>

                      {/* PDF CV Upload simulation handler */}
                      <div className="bg-lightgrey p-4 rounded-sm border border-navy/10 text-center relative">
                        <Upload size={20} className="text-gold mx-auto mb-1" />
                        <label className="block text-xs font-bold text-navy cursor-pointer">
                          <span>Sélectionner votre CV (PDF requis) *</span>
                          <input
                            type="file"
                            accept=".pdf"
                            required
                            className="hidden"
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (f) {
                                setCandidatureForm({ ...candidatureForm, cvFile: f, cvFileName: f.name });
                              }
                            }}
                          />
                        </label>
                        {candidatureForm.cvFileName && (
                          <p className="text-[10px] text-green-600 font-mono mt-2 font-bold">{candidatureForm.cvFileName}</p>
                        )}
                      </div>

                      <div className="pt-4 border-t border-navy/10 flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setSpontaneousOpen(false)}
                          className="px-4 py-2 bg-navy/5 hover:bg-navy/10 text-[10px] font-bold uppercase rounded-sm cursor-pointer"
                        >
                          Fermer
                        </button>
                        <button
                          type="submit"
                          disabled={uploadingCV}
                          className="px-6 py-2 bg-gold text-navy font-bold text-[10px] uppercase tracking-wider rounded-sm hover:bg-gold-hover transition-colors cursor-pointer"
                        >
                          {uploadingCV ? "Envoi du fichier..." : "Envoyer mon dossier"}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            VIEW 12: OFFRE DETAIL (Section 4.8)
            ========================================================================= */}
        {currentView === "offre-detail" && activeJob && (
          <div>
            <HeroBanner
              media="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1920&h=1080&q=80"
              title={activeJob.titre}
              subtitle={`${activeJob.typeContrat} &bull; ${activeJob.lieu}`}
              heightClass="min-h-[45vh]"
            />

            <Breadcrumb
              items={[
                { label: "Carrières", view: "carrieres" },
                { label: activeJob.titre }
              ]}
              onNavigate={handleNavigate}
            />

            <section className="py-16 bg-white text-sm text-charcoal/85 leading-relaxed font-light">
              <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12">
                
                {/* Job Description details col */}
                <div className="lg:col-span-7 space-y-6">
                  <div className="flex flex-wrap gap-3 text-xs font-mono font-bold uppercase tracking-wider">
                    <span className="bg-navy/5 text-navy px-2 py-1 rounded-sm flex items-center gap-1">
                      <Briefcase size={12} className="text-gold" />
                      {activeJob.typeContrat}
                    </span>
                    <span className="bg-navy/5 text-charcoal/80 px-2 py-1 rounded-sm flex items-center gap-1">
                      <MapPin size={12} className="text-gold" />
                      {activeJob.lieu}
                    </span>
                  </div>

                  <h3 className="font-serif text-xl font-bold text-navy pt-2">Description du poste</h3>
                  <div className="text-charcoal/80 leading-relaxed space-y-4 whitespace-pre-line">
                    {activeJob.description}
                  </div>
                  
                  <div className="pt-6">
                    <strong className="text-xs uppercase text-charcoal/50 block mb-1">Entité rattachée :</strong>
                    <span className="font-bold text-navy font-serif">{activeJob.filialeNom || "Groupe OMNIA NEXUS S.A."}</span>
                  </div>
                </div>

                {/* Apply inline Form (Section 4.8 requirement) */}
                <div className="lg:col-span-5 bg-lightgrey p-6 rounded-sm border border-navy/10 shadow-md space-y-4 h-fit">
                  <h4 className="font-serif text-base font-bold text-navy">Déposer un dossier pour ce poste</h4>
                  <p className="text-xs text-charcoal/60 leading-normal mb-4">
                    Veuillez remplir le formulaire d'évaluation technique obligatoire ci-dessous :
                  </p>

                  {jobApplicationSuccess ? (
                    <div className="bg-green-500/15 border border-green-500/30 text-green-700 p-4 rounded-sm text-xs space-y-1 text-center font-medium">
                      <CheckCircle2 className="mx-auto text-green-600 mb-1" size={24} />
                      <strong>Candidature validée !</strong>
                      <p>Notre service RH a bien reçu vos documents d'évaluation technique.</p>
                    </div>
                  ) : (
                    <form onSubmit={(e) => handleJobApplySubmit(e, activeJob)} className="space-y-4 text-xs">
                      <div>
                        <label className="block text-[10px] font-mono text-charcoal/60 uppercase mb-1 font-bold">Nom complet *</label>
                        <input
                          type="text"
                          required
                          value={jobApplicationForm.nom}
                          onChange={(e) => setJobApplicationForm({ ...jobApplicationForm, nom: e.target.value })}
                          className="w-full bg-white border border-navy/10 rounded-sm p-2"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-mono text-charcoal/60 uppercase mb-1 font-bold">Email *</label>
                          <input
                            type="email"
                            required
                            value={jobApplicationForm.email}
                            onChange={(e) => setJobApplicationForm({ ...jobApplicationForm, email: e.target.value })}
                            className="w-full bg-white border border-navy/10 rounded-sm p-2"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-mono text-charcoal/60 uppercase mb-1 font-bold">Téléphone</label>
                          <input
                            type="text"
                            value={jobApplicationForm.telephone}
                            onChange={(e) => setJobApplicationForm({ ...jobApplicationForm, telephone: e.target.value })}
                            className="w-full bg-white border border-navy/10 rounded-sm p-2"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-charcoal/60 uppercase mb-1 font-bold">Message court de motivation *</label>
                        <textarea
                          required
                          rows={3}
                          value={jobApplicationForm.message}
                          onChange={(e) => setJobApplicationForm({ ...jobApplicationForm, message: e.target.value })}
                          className="w-full bg-white border border-navy/10 rounded-sm p-2 resize-none"
                        ></textarea>
                      </div>

                      {/* PDF cv file input */}
                      <div className="bg-white p-4 rounded-sm border border-navy/10 text-center relative">
                        <Upload size={18} className="text-gold mx-auto mb-1" />
                        <label className="block text-xs font-bold text-navy cursor-pointer">
                          <span>Sélectionner votre CV (PDF requis) *</span>
                          <input
                            type="file"
                            accept=".pdf"
                            required
                            className="hidden"
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (f) {
                                setJobApplicationForm({ ...jobApplicationForm, cvFile: f, cvFileName: f.name });
                              }
                            }}
                          />
                        </label>
                        {jobApplicationForm.cvFileName && (
                          <p className="text-[10px] text-green-600 font-mono mt-2 font-bold">{jobApplicationForm.cvFileName}</p>
                        )}
                      </div>

                      <button
                        type="submit"
                        disabled={uploadingCV}
                        className="w-full py-2.5 bg-gold text-navy font-bold uppercase tracking-wider rounded-sm hover:bg-navy hover:text-white transition-colors cursor-pointer text-center"
                      >
                        {uploadingCV ? "Envoi du fichier..." : "Envoyer ma candidature"}
                      </button>
                    </form>
                  )}
                </div>

              </div>
            </section>
          </div>
        )}

        {/* =========================================================================
            VIEW 13: CONTACT GENERAL (Section 4.9)
            ========================================================================= */}
        {currentView === "contact" && (
          <div>
            <HeroBanner
              media="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1920&h=1080&q=80"
              title="Contactez le Groupe"
              subtitle="Siège d'OMNIA NEXUS HOLDING, contacts de nos filiales régionales et formulaires."
              heightClass="min-h-[50vh]"
            />

            <Breadcrumb items={[{ label: "Contact" }]} onNavigate={handleNavigate} />

            <section className="py-16 bg-white text-sm font-light text-charcoal/85 leading-relaxed">
              <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12">
                
                {/* Left col: Contact Form (Section 4.9 requirement) */}
                <div className="lg:col-span-7 space-y-6">
                  <div className="space-y-2 mb-4">
                    <span className="text-xs font-mono font-bold text-gold uppercase tracking-[0.2em] block">FORMULAIRE DE CONTACT</span>
                    <h2 className="font-serif text-2xl sm:text-3xl font-bold text-navy">Une écoute attentive à vos opportunités d'affaires</h2>
                  </div>

                  {contactSuccess ? (
                    <div className="bg-green-500/15 border border-green-500/30 text-green-700 p-4 rounded-sm text-xs font-medium">
                      <strong>Votre message a été envoyé !</strong> Notre service d'administration générale prendra en charge votre demande.
                    </div>
                  ) : (
                    <form onSubmit={handleContactSubmit} className="space-y-4 text-xs">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-mono text-charcoal/60 uppercase mb-1 font-bold">Votre Nom complet *</label>
                          <input
                            type="text"
                            required
                            value={contactForm.nom}
                            onChange={(e) => setContactForm({ ...contactForm, nom: e.target.value })}
                            className="w-full border border-navy/10 rounded-sm p-2.5 text-xs focus:outline-none focus:border-gold"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-mono text-charcoal/60 uppercase mb-1 font-bold">Votre Adresse Email *</label>
                          <input
                            type="email"
                            required
                            value={contactForm.email}
                            onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                            className="w-full border border-navy/10 rounded-sm p-2.5 text-xs focus:outline-none focus:border-gold"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-[10px] font-mono text-charcoal/60 uppercase mb-1 font-bold">Sujet de votre message *</label>
                          <input
                            type="text"
                            required
                            value={contactForm.sujet}
                            onChange={(e) => setContactForm({ ...contactForm, sujet: e.target.value })}
                            className="w-full border border-navy/10 rounded-sm p-2.5 text-xs focus:outline-none focus:border-gold"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-[10px] font-mono text-charcoal/60 uppercase mb-1 font-bold">Entité ou Service destinataire *</label>
                          <select
                            value={contactForm.filiale}
                            onChange={(e) => setContactForm({ ...contactForm, filiale: e.target.value })}
                            className="w-full border border-navy/10 rounded-sm p-2.5 text-xs focus:outline-none focus:border-gold"
                          >
                            <option value="Général">Administration Générale (Holding)</option>
                            {db.filiales.map(f => (
                              <option key={f.id} value={f.nom}>{f.nom}</option>
                            ))}
                          </select>
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-[10px] font-mono text-charcoal/60 uppercase mb-1 font-bold">Corps de votre message *</label>
                          <textarea
                            required
                            rows={6}
                            value={contactForm.message}
                            onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                            className="w-full border border-navy/10 rounded-sm p-2.5 text-xs resize-none focus:outline-none focus:border-gold"
                          ></textarea>
                        </div>
                      </div>

                      <div className="pt-2">
                        <button
                          type="submit"
                          className="px-6 py-3 bg-navy text-white text-[10px] font-bold uppercase tracking-widest rounded-sm hover:bg-gold hover:text-navy transition-all cursor-pointer flex items-center gap-2"
                        >
                          <Send size={12} /> Envoyer mon Message
                        </button>
                      </div>
                    </form>
                  )}
                </div>

                {/* Right col: Embedded Map & coordinates (Section 4.9 requirement) */}
                <div className="lg:col-span-5 space-y-6">
                  <div className="bg-lightgrey p-6 rounded-sm border border-navy/5 shadow-md">
                    <h3 className="font-serif text-base font-bold text-navy mb-4">Siège Social OMNIA NEXUS</h3>
                    <div className="space-y-4 text-xs font-mono">
                      <div className="flex gap-2">
                        <MapPin size={18} className="text-gold shrink-0" />
                        <span className="font-sans leading-normal">Tour OMNIA, Cocody, Boulevard Hassan II, Abidjan, Côte d'Ivoire</span>
                      </div>
                      <div className="flex gap-2">
                        <Phone size={18} className="text-gold shrink-0" />
                        <span className="font-sans">+225 27 22 45 60 70</span>
                      </div>
                      <div className="flex gap-2">
                        <Mail size={18} className="text-gold shrink-0" />
                        <span className="font-sans">contact@omnia-nexus.com</span>
                      </div>
                    </div>
                  </div>

                  {/* Interactive Embed Maps */}
                  <div className="relative overflow-hidden rounded-sm shadow-md h-[250px] border border-navy/10">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15889.378077583626!2d-3.9821437149303565!3d5.348881267868461!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfc1ebd5169a8bb7%3A0xe54dfdae6443c2b8!2sCocody%2C%20Abidjan!5e0!3m2!1sfr!2sci!4v1689260000000!5m2!1sfr!2sci"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen={true}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Google Maps OMNIA NEXUS HEADING"
                    ></iframe>
                  </div>
                </div>

              </div>
            </section>
          </div>
        )}

        {/* =========================================================================
            VIEW 14: MENTIONS LEGALES
            ========================================================================= */}
        {currentView === "mentions-legales" && (
          <div className="py-24 bg-white">
            <div className="max-w-4xl mx-auto px-6 text-sm text-charcoal/80 leading-relaxed font-light">
              <h1 className="font-serif text-3xl font-bold text-navy mb-8 border-b border-navy/10 pb-4">Mentions Légales</h1>
              <div className="space-y-6">
                <p><strong>Éditeur du site :</strong> OMNIA NEXUS HOLDING S.A., Société Anonyme avec Conseil d'Administration au capital social consolidé de 10 000 000 000 FCFA. Enregistrée au RCCM d'Abidjan sous le numéro CI-ABJ-03-2014-B12-14502.</p>
                <p><strong>Siège Social :</strong> Tour OMNIA, Boulevard Hassan II, Cocody, Abidjan, Côte d'Ivoire.</p>
                <p><strong>Directrice de la Publication :</strong> Marie-Elisabeth Kouadio, Directrice Générale Exécutive.</p>
                <p><strong>Hébergement du site :</strong> Cloud Run / Nginx reverse proxy architecture.</p>
                <p><strong>Propriété Intellectuelle :</strong> La structure générale ainsi que les textes, logos, images et codes informatiques constituant ce portail institutionnel sont la propriété exclusive du groupe OMNIA NEXUS. Toute reproduction totale ou partielle sans accord préalable écrit est interdite.</p>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            VIEW 15: POLITIQUE DE CONFIDENTIALITE
            ========================================================================= */}
        {currentView === "confidentialite" && (
          <div className="py-24 bg-white">
            <div className="max-w-4xl mx-auto px-6 text-sm text-charcoal/80 leading-relaxed font-light">
              <h1 className="font-serif text-3xl font-bold text-navy mb-8 border-b border-navy/10 pb-4">Politique de Confidentialité</h1>
              <div className="space-y-6">
                <p>Conformément aux lois ivoiriennes et ouest-africaines sur la protection des données personnelles, OMNIA NEXUS HOLDING s'engage à garantir un haut niveau de confidentialité lors de la collecte et du traitement de vos données de candidatures (CV) et messages de contact.</p>
                <p><strong>Collecte de données :</strong> Vos données de nom, email, téléphone, et fichiers CV sont uniquement stockées à des fins d'évaluation professionnelle (Ressources Humaines) et de prise de rendez-vous d'affaires. Ces données ne sont jamais transmises à des tiers sans accord écrit.</p>
                <p><strong>Droit d'accès et de rectification :</strong> Vous bénéficiez d'un droit d'accès, de modification, de portabilité et de suppression définitive de vos données personnelles stockées dans notre intranet. Veuillez adresser votre demande à <a href="mailto:contact@omnia-nexus.com" className="text-gold hover:underline font-bold">contact@omnia-nexus.com</a>.</p>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            VIEW 16: PLAN DU SITE (Section 4.10 sitemap direct indexes)
            ========================================================================= */}
        {currentView === "plan-du-site" && (
          <div className="py-24 bg-white">
            <div className="max-w-3xl mx-auto px-6 text-sm text-charcoal/80 leading-relaxed">
              <h1 className="font-serif text-3xl font-bold text-navy mb-8 border-b border-navy/10 pb-4">Plan du Site Institutionnel</h1>
              <p className="text-xs text-charcoal/50 font-mono mb-8">Index complet des pages du portail corporate d'OMNIA NEXUS HOLDING.</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <h3 className="font-serif text-base font-bold text-navy">Pages Générales</h3>
                  <div className="flex flex-col gap-2 text-xs font-medium">
                    <button onClick={() => handleNavigate("home")} className="text-left text-gold hover:underline">Accueil du Groupe</button>
                    <button onClick={() => handleNavigate("le-groupe")} className="text-left text-gold hover:underline">Qui sommes-nous (Le Groupe)</button>
                    <button onClick={() => handleNavigate("gouvernance")} className="text-left text-gold hover:underline">Gouvernance & Organigramme</button>
                    <button onClick={() => handleNavigate("relations-investisseurs")} className="text-left text-gold hover:underline">Relations Investisseurs & Rapports</button>
                    <button onClick={() => handleNavigate("contact")} className="text-left text-gold hover:underline">Nous contacter (Siège d'Abidjan)</button>
                    <button onClick={() => handleNavigate("mentions-legales")} className="text-left text-gold hover:underline">Mentions Légales</button>
                    <button onClick={() => handleNavigate("confidentialite")} className="text-left text-gold hover:underline">Politique de Confidentialité (RGPD)</button>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-3">
                    <h3 className="font-serif text-base font-bold text-navy">Fiches de Filiales</h3>
                    <div className="flex flex-col gap-2 text-xs font-medium">
                      {db.filiales.map(f => (
                        <button key={f.id} onClick={() => handleNavigate("filiale-detail", f.slug)} className="text-left text-gold hover:underline">{f.nom}</button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-serif text-base font-bold text-navy">Pôles Stratégiques</h3>
                    <div className="flex flex-col gap-2 text-xs font-medium">
                      {db.poles.map(p => (
                        <button key={p.id} onClick={() => handleNavigate("investissement-detail", p.slug)} className="text-left text-gold hover:underline">Pôle {p.nom}</button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-serif text-base font-bold text-navy">Carrières & Emplois</h3>
                    <div className="flex flex-col gap-2 text-xs font-medium">
                      <button onClick={() => handleNavigate("carrieres")} className="text-left text-gold hover:underline">Portail Recrutement & Processus</button>
                      {db.offresEmploi.map(o => (
                        <button key={o.id} onClick={() => handleNavigate("offre-detail", o.slug)} className="text-left text-gold/80 hover:underline">Fiche Poste : {o.titre}</button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            VIEW 17: INTRANET LOGIN / ADMIN CORE (Section 5)
            ========================================================================= */}
        {currentView === "admin" && (
          <div>
            {adminUser ? (
              /* If authenticated, direct render dashboard */
              <AdminDashboard
                user={adminUser}
                onLogout={handleLogout}
                filiales={db.filiales}
                poles={db.poles}
                actualites={db.actualites}
                offres={db.offresEmploi}
                candidatures={db.candidatures}
                messages={db.messages}
                chiffres={db.chiffresCles}
                onRefreshData={fetchData}
              />
            ) : (
              /* Administrative secure login screen */
              <div className="min-h-[85vh] bg-lightgrey py-24 flex items-center justify-center p-4">
                <div className="bg-white border border-black/5 rounded-xs p-8 max-w-md w-full shadow-2xl relative">
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-gold"></div>
                  
                  <div className="text-center mb-6 space-y-2">
                    <div className="w-12 h-12 bg-navy rounded-full flex items-center justify-center mx-auto border border-gold/40">
                      <Lock className="text-gold" size={20} />
                    </div>
                    <h1 className="font-serif text-xl font-bold text-navy">Accès Intranet Sécurisé</h1>
                    <span className="block text-[8px] font-mono text-charcoal/50 uppercase tracking-[0.2em]">OMNIA NEXUS HOLDING S.A.</span>
                  </div>

                  {loginError && (
                    <div className="bg-red-500/10 border border-red-500/30 text-red-600 rounded-sm p-3 mb-4 text-xs font-medium flex items-center gap-2">
                      <AlertCircle size={14} className="shrink-0" />
                      <span>{loginError}</span>
                    </div>
                  )}

                  <form onSubmit={handleLogin} className="space-y-4 text-xs">
                    <div>
                      <label className="block text-[10px] font-mono text-charcoal/60 uppercase mb-1 font-bold">Identifiant (Email)</label>
                      <input
                        type="email"
                        required
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="nom@omnia-nexus.com"
                        className="w-full border border-navy/10 rounded-sm p-2.5"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-charcoal/60 uppercase mb-1 font-bold">Mot de passe</label>
                      <input
                        type="password"
                        required
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full border border-navy/10 rounded-sm p-2.5"
                      />
                    </div>
                    
                    <button
                      type="submit"
                      className="w-full py-3 bg-navy text-white text-[10px] font-bold uppercase tracking-widest rounded-sm hover:bg-gold hover:text-navy transition-all cursor-pointer text-center"
                    >
                      S'authentifier
                    </button>
                  </form>

                  <div className="mt-8 border-t border-navy/5 pt-4 text-[10px] text-charcoal/40 font-mono space-y-1">
                    <div>Rôles d'administration simulés :</div>
                    <div>- <strong>Directeur Général :</strong> <span className="font-bold text-navy select-all">admin@omnia-nexus.com</span> / <span className="font-bold text-navy select-all">OmniaNexus2026Admin</span></div>
                    <div>- <strong>Rédacteur RH :</strong> <span className="font-bold text-navy select-all">rh@omnia-nexus.com</span> / <span className="font-bold text-navy select-all">OmniaNexus2026RH</span></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

      </main>

      {/* 4. Global Site Directory Footer */}
      <Footer
        onNavigate={handleNavigate}
        filiales={db.filiales.map(f => ({ nom: f.nom, slug: f.slug }))}
        poles={db.poles.map(p => ({ nom: p.nom, slug: p.slug }))}
      />

    </div>
  );
}
