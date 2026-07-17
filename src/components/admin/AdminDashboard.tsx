import React, { useState, useEffect } from "react";
import {
  Filiale,
  PoleInvestissement,
  Actualite,
  OffreEmploi,
  Candidature,
  MessageContact,
  ChiffreCle,
  Utilisateur
} from "../../types";
import {
  Shield,
  Layers,
  FileText,
  Briefcase,
  Users,
  MessageSquare,
  TrendingUp,
  Plus,
  Trash2,
  Edit3,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  LogOut,
  Sparkles,
  Search,
  Filter
} from "lucide-react";

interface AdminDashboardProps {
  user: { email: string; role: "admin" | "redacteur_rh" };
  onLogout: () => void;
  filiales: Filiale[];
  poles: PoleInvestissement[];
  actualites: Actualite[];
  offres: OffreEmploi[];
  candidatures: Candidature[];
  messages: MessageContact[];
  chiffres: ChiffreCle[];
  onRefreshData: () => void;
}

export default function AdminDashboard({
  user,
  onLogout,
  filiales,
  poles,
  actualites,
  offres,
  candidatures,
  messages,
  chiffres,
  onRefreshData
}: AdminDashboardProps) {
  // Navigation
  const isRH = user.role === "redacteur_rh";
  const [activeTab, setActiveTab] = useState<string>(isRH ? "offres" : "actualites");

  // Form States
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentEditId, setCurrentEditId] = useState<string | null>(null);
  const [editType, setEditType] = useState<"filiale" | "pole" | "actualite" | "offre" | "chiffre" | null>(null);

  // General Search / Filter state
  const [searchTerm, setSearchTerm] = useState("");

  // Sub-forms states
  const [filialeForm, setFilialeForm] = useState({
    nom: "",
    slug: "",
    secteur: "",
    description: "",
    logoUrl: "",
    couvertureUrl: "",
    contenu: "",
    contactEmail: ""
  });

  const [poleForm, setPoleForm] = useState({
    nom: "",
    slug: "",
    description: "",
    contenu: "",
    couvertureUrl: ""
  });

  const [actualiteForm, setActualiteForm] = useState({
    titre: "",
    slug: "",
    extrait: "",
    contenu: "",
    imageUrl: "",
    categorie: "",
    filialeId: "",
    ressourcePresse: false,
    publiePar: "Direction Générale"
  });

  const [offreForm, setOffreForm] = useState({
    titre: "",
    slug: "",
    filialeId: "",
    lieu: "",
    typeContrat: "CDI",
    description: "",
    actif: true
  });

  const [chiffreForm, setChiffreForm] = useState({
    label: "",
    valeur: 0,
    ordre: 0
  });

  // Selected item modal viewer state
  const [viewItem, setViewItem] = useState<{ type: string; data: any } | null>(null);

  const startCreate = (type: typeof editType) => {
    setEditType(type);
    setCurrentEditId(null);
    setIsEditing(true);

    // Reset forms
    if (type === "filiale") {
      setFilialeForm({
        nom: "",
        slug: "",
        secteur: "",
        description: "",
        logoUrl: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=150&h=150&q=80",
        couvertureUrl: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1200&h=600&q=80",
        contenu: "",
        contactEmail: ""
      });
    } else if (type === "pole") {
      setPoleForm({
        nom: "",
        slug: "",
        description: "",
        contenu: "",
        couvertureUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&h=500&q=80"
      });
    } else if (type === "actualite") {
      setActualiteForm({
        titre: "",
        slug: "",
        extrait: "",
        contenu: "",
        imageUrl: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=800&h=450&q=80",
        categorie: "Investissements",
        filialeId: "",
        ressourcePresse: false,
        publiePar: "Direction de la Communication"
      });
    } else if (type === "offre") {
      setOffreForm({
        titre: "",
        slug: "",
        filialeId: filiales[0]?.id || "",
        lieu: "Abidjan, Côte d'Ivoire",
        typeContrat: "CDI",
        description: "",
        actif: true
      });
    } else if (type === "chiffre") {
      setChiffreForm({
        label: "",
        valeur: 0,
        ordre: chiffres.length + 1
      });
    }
  };

  const startEdit = (type: typeof editType, item: any) => {
    setEditType(type);
    setCurrentEditId(item.id);
    setIsEditing(true);

    if (type === "filiale") {
      setFilialeForm({
        nom: item.nom,
        slug: item.slug,
        secteur: item.secteur,
        description: item.description,
        logoUrl: item.logoUrl,
        couvertureUrl: item.couvertureUrl,
        contenu: item.contenu,
        contactEmail: item.contactEmail || ""
      });
    } else if (type === "pole") {
      setPoleForm({
        nom: item.nom,
        slug: item.slug,
        description: item.description,
        contenu: item.contenu,
        couvertureUrl: item.couvertureUrl
      });
    } else if (type === "actualite") {
      setActualiteForm({
        titre: item.titre,
        slug: item.slug,
        extrait: item.extrait,
        contenu: item.contenu,
        imageUrl: item.imageUrl,
        categorie: item.categorie,
        filialeId: item.filialeId || "",
        ressourcePresse: item.ressourcePresse,
        publiePar: item.publiePar
      });
    } else if (type === "offre") {
      setOffreForm({
        titre: item.titre,
        slug: item.slug,
        filialeId: item.filialeId || "",
        lieu: item.lieu,
        typeContrat: item.typeContrat,
        description: item.description,
        actif: item.actif
      });
    } else if (type === "chiffre") {
      setChiffreForm({
        label: item.label,
        valeur: item.valeur,
        ordre: item.ordre
      });
    }
  };

  const handleDelete = async (type: string, id: string) => {
    if (!window.confirm("Êtes-vous certain de vouloir supprimer cet élément ?")) return;
    try {
      const res = await fetch(`/api/${type}/${id}`, { method: "DELETE" });
      if (res.ok) {
        onRefreshData();
      } else {
        alert("Erreur de suppression.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const isNew = !currentEditId;
    const url = isNew ? `/api/${editType}s` : `/api/${editType}s/${currentEditId}`;
    const method = isNew ? "POST" : "PUT";

    let bodyData: any = {};
    if (editType === "filiale") {
      bodyData = { ...filialeForm, slug: filialeForm.slug || filialeForm.nom.toLowerCase().replace(/[^a-z0-9]/g, "-") };
    } else if (editType === "pole") {
      bodyData = { ...poleForm, slug: poleForm.slug || poleForm.nom.toLowerCase().replace(/[^a-z0-9]/g, "-") };
    } else if (editType === "actualite") {
      const fil = filiales.find(f => f.id === actualiteForm.filialeId);
      bodyData = {
        ...actualiteForm,
        slug: actualiteForm.slug || actualiteForm.titre.toLowerCase().replace(/[^a-z0-9]/g, "-"),
        filialeNom: fil ? fil.nom : "OMNIA NEXUS HOLDING"
      };
    } else if (editType === "offre") {
      const fil = filiales.find(f => f.id === offreForm.filialeId);
      bodyData = {
        ...offreForm,
        slug: offreForm.slug || offreForm.titre.toLowerCase().replace(/[^a-z0-9]/g, "-"),
        filialeNom: fil ? fil.nom : "OMNIA NEXUS HOLDING"
      };
    } else if (editType === "chiffre") {
      bodyData = { ...chiffreForm };
    }

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData)
      });
      if (res.ok) {
        setIsEditing(false);
        setCurrentEditId(null);
        setEditType(null);
        onRefreshData();
      } else {
        alert("Erreur lors de la sauvegarde.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const updateCandidatureStatut = async (id: string, statut: string) => {
    try {
      const res = await fetch(`/api/candidatures/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ statut })
      });
      if (res.ok) {
        onRefreshData();
        if (viewItem && viewItem.type === "candidature" && viewItem.data.id === id) {
          setViewItem({ type: "candidature", data: { ...viewItem.data, statut } });
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-lightgrey min-h-screen pt-24 pb-16 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Block */}
        <div className="bg-navy text-white p-6 rounded-sm mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border border-gold/20 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-full blur-2xl pointer-events-none"></div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Shield className="text-gold" size={20} />
              <span className="text-[10px] font-mono font-bold text-gold uppercase tracking-[0.2em]">PORTAIL CORPORATE SÉCURISÉ</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold">Tableau de Bord Intranet</h1>
            <p className="text-xs text-white/70 mt-1 font-mono">
              Connecté : <span className="text-gold font-semibold">{user.email}</span> &bull; Rôle : <span className="text-gold font-semibold uppercase">{user.role}</span>
            </p>
          </div>
          <button
            onClick={onLogout}
            className="self-start md:self-auto px-4 py-2 bg-white/10 hover:bg-red-600 rounded-sm text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer"
          >
            <LogOut size={14} /> Se déconnecter
          </button>
        </div>

        {/* Warning banner for restricted RH user */}
        {isRH && (
          <div className="bg-amber-500/10 border border-amber-500/30 text-amber-600 rounded-sm p-4 mb-8 text-xs font-medium">
            En tant que <strong>Rédacteur RH</strong>, vos accès sont restreints à la gestion des offres d'emploi et au traitement des candidatures reçues. Les autres fonctionnalités d'administration du groupe ne vous sont pas accessibles.
          </div>
        )}

        {/* Dynamic Metric cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <div className="bg-white p-5 border border-black/5 rounded-sm flex items-center justify-between">
            <div>
              <span className="block text-xs font-mono text-charcoal/50 uppercase">Filiales</span>
              <span className="block text-2xl font-serif font-bold text-navy mt-1">{filiales.length}</span>
            </div>
            <Layers className="text-gold" size={24} />
          </div>
          <div className="bg-white p-5 border border-black/5 rounded-sm flex items-center justify-between">
            <div>
              <span className="block text-xs font-mono text-charcoal/50 uppercase">Actualités</span>
              <span className="block text-2xl font-serif font-bold text-navy mt-1">{actualites.length}</span>
            </div>
            <FileText className="text-gold" size={24} />
          </div>
          <div className="bg-white p-5 border border-black/5 rounded-sm flex items-center justify-between">
            <div>
              <span className="block text-xs font-mono text-charcoal/50 uppercase">Offres d'emploi</span>
              <span className="block text-2xl font-serif font-bold text-navy mt-1">{offres.length}</span>
            </div>
            <Briefcase className="text-gold" size={24} />
          </div>
          <div className="bg-white p-5 border border-black/5 rounded-sm flex items-center justify-between">
            <div>
              <span className="block text-xs font-mono text-charcoal/50 uppercase">Candidatures</span>
              <span className="block text-2xl font-serif font-bold text-navy mt-1">
                {candidatures.length}{" "}
                {candidatures.filter((c) => c.statut === "nouveau").length > 0 && (
                  <span className="text-xs bg-red-500 text-white rounded-full px-1.5 py-0.5 ml-1 animate-pulse">
                    {candidatures.filter((c) => c.statut === "nouveau").length}
                  </span>
                )}
              </span>
            </div>
            <Users className="text-gold" size={24} />
          </div>
        </div>

        {/* Tab Switching Rail */}
        <div className="flex border-b border-navy/10 overflow-x-auto gap-1 mb-8">
          {!isRH && (
            <>
              <button
                onClick={() => { setActiveTab("actualites"); setSearchTerm(""); }}
                className={`px-4 py-2.5 text-sm font-semibold transition-all border-b-2 shrink-0 ${
                  activeTab === "actualites" ? "border-gold text-navy bg-white" : "border-transparent text-charcoal/60 hover:text-navy"
                }`}
              >
                Actualités
              </button>
              <button
                onClick={() => { setActiveTab("filiales"); setSearchTerm(""); }}
                className={`px-4 py-2.5 text-sm font-semibold transition-all border-b-2 shrink-0 ${
                  activeTab === "filiales" ? "border-gold text-navy bg-white" : "border-transparent text-charcoal/60 hover:text-navy"
                }`}
              >
                Filiales
              </button>
              <button
                onClick={() => { setActiveTab("poles"); setSearchTerm(""); }}
                className={`px-4 py-2.5 text-sm font-semibold transition-all border-b-2 shrink-0 ${
                  activeTab === "poles" ? "border-gold text-navy bg-white" : "border-transparent text-charcoal/60 hover:text-navy"
                }`}
              >
                Pôles d'Investissement
              </button>
              <button
                onClick={() => { setActiveTab("chiffres"); setSearchTerm(""); }}
                className={`px-4 py-2.5 text-sm font-semibold transition-all border-b-2 shrink-0 ${
                  activeTab === "chiffres" ? "border-gold text-navy bg-white" : "border-transparent text-charcoal/60 hover:text-navy"
                }`}
              >
                Chiffres Clés
              </button>
              <button
                onClick={() => { setActiveTab("messages"); setSearchTerm(""); }}
                className={`px-4 py-2.5 text-sm font-semibold transition-all border-b-2 shrink-0 flex items-center gap-1.5 ${
                  activeTab === "messages" ? "border-gold text-navy bg-white" : "border-transparent text-charcoal/60 hover:text-navy"
                }`}
              >
                Messages de contact
                <span className="bg-navy/10 text-navy text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                  {messages.length}
                </span>
              </button>
            </>
          )}

          <button
            onClick={() => { setActiveTab("offres"); setSearchTerm(""); }}
            className={`px-4 py-2.5 text-sm font-semibold transition-all border-b-2 shrink-0 ${
              activeTab === "offres" ? "border-gold text-navy bg-white" : "border-transparent text-charcoal/60 hover:text-navy"
            }`}
          >
            Offres d'emploi
          </button>
          <button
            onClick={() => { setActiveTab("candidatures"); setSearchTerm(""); }}
            className={`px-4 py-2.5 text-sm font-semibold transition-all border-b-2 shrink-0 flex items-center gap-1.5 ${
              activeTab === "candidatures" ? "border-gold text-navy bg-white" : "border-transparent text-charcoal/60 hover:text-navy"
            }`}
          >
            Candidatures reçues
            {candidatures.filter(c => c.statut === "nouveau").length > 0 && (
              <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold animate-pulse">
                {candidatures.filter(c => c.statut === "nouveau").length}
              </span>
            )}
          </button>
        </div>

        {/* Content Listing and Editor */}
        <div className="bg-white p-6 border border-black/5 rounded-sm shadow-md">
          
          {isEditing ? (
            /* Editing / Creating Form overlay wrapper */
            <div>
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-navy/10">
                <h3 className="text-xl font-serif font-bold text-navy">
                  {currentEditId ? "Modifier l'élément" : "Créer un nouvel élément"} ({editType})
                </h3>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1.5 text-xs text-charcoal bg-navy/5 hover:bg-navy/10 font-bold rounded-sm transition-colors cursor-pointer"
                >
                  Annuler
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-6">
                
                {/* 1. FILIALE FORM */}
                {editType === "filiale" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-charcoal/70 uppercase mb-1">Nom de la filiale</label>
                      <input
                        type="text"
                        required
                        value={filialeForm.nom}
                        onChange={(e) => setFilialeForm({ ...filialeForm, nom: e.target.value })}
                        placeholder="ex. Nexus Real Estate"
                        className="w-full border border-navy/10 p-2.5 rounded-sm text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-charcoal/70 uppercase mb-1">Slug (URL unique)</label>
                      <input
                        type="text"
                        value={filialeForm.slug}
                        onChange={(e) => setFilialeForm({ ...filialeForm, slug: e.target.value })}
                        placeholder="ex. nexus-real-estate"
                        className="w-full border border-navy/10 p-2.5 rounded-sm text-sm font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-charcoal/70 uppercase mb-1">Secteur d'activité</label>
                      <input
                        type="text"
                        required
                        value={filialeForm.secteur}
                        onChange={(e) => setFilialeForm({ ...filialeForm, secteur: e.target.value })}
                        placeholder="ex. Immobilier, Logistique, Finance"
                        className="w-full border border-navy/10 p-2.5 rounded-sm text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-charcoal/70 uppercase mb-1">Email de contact dédié</label>
                      <input
                        type="email"
                        value={filialeForm.contactEmail}
                        onChange={(e) => setFilialeForm({ ...filialeForm, contactEmail: e.target.value })}
                        placeholder="ex. contact@nexus-realestate.com"
                        className="w-full border border-navy/10 p-2.5 rounded-sm text-sm"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-mono text-charcoal/70 uppercase mb-1">Brève description</label>
                      <textarea
                        required
                        rows={3}
                        value={filialeForm.description}
                        onChange={(e) => setFilialeForm({ ...filialeForm, description: e.target.value })}
                        placeholder="Synthèse de l'activité commerciale..."
                        className="w-full border border-navy/10 p-2.5 rounded-sm text-sm"
                      ></textarea>
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-charcoal/70 uppercase mb-1">URL de Logo</label>
                      <input
                        type="text"
                        value={filialeForm.logoUrl}
                        onChange={(e) => setFilialeForm({ ...filialeForm, logoUrl: e.target.value })}
                        className="w-full border border-navy/10 p-2.5 rounded-sm text-sm font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-charcoal/70 uppercase mb-1">URL de Couverture</label>
                      <input
                        type="text"
                        value={filialeForm.couvertureUrl}
                        onChange={(e) => setFilialeForm({ ...filialeForm, couvertureUrl: e.target.value })}
                        className="w-full border border-navy/10 p-2.5 rounded-sm text-sm font-mono"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-mono text-charcoal/70 uppercase mb-1">Contenu riche descriptif (HTML accepté)</label>
                      <textarea
                        rows={8}
                        value={filialeForm.contenu}
                        onChange={(e) => setFilialeForm({ ...filialeForm, contenu: e.target.value })}
                        placeholder="<h2>Présentation</h2><p>...</p>"
                        className="w-full border border-navy/10 p-2.5 rounded-sm text-sm font-mono"
                      ></textarea>
                    </div>
                  </div>
                )}

                {/* 2. POLE FORM */}
                {editType === "pole" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-charcoal/70 uppercase mb-1">Nom du pôle</label>
                      <input
                        type="text"
                        required
                        value={poleForm.nom}
                        onChange={(e) => setPoleForm({ ...poleForm, nom: e.target.value })}
                        placeholder="ex. Commerce & Distribution"
                        className="w-full border border-navy/10 p-2.5 rounded-sm text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-charcoal/70 uppercase mb-1">Slug (URL unique)</label>
                      <input
                        type="text"
                        value={poleForm.slug}
                        onChange={(e) => setPoleForm({ ...poleForm, slug: e.target.value })}
                        placeholder="ex. commerce-services"
                        className="w-full border border-navy/10 p-2.5 rounded-sm text-sm font-mono"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-mono text-charcoal/70 uppercase mb-1">Brève description</label>
                      <textarea
                        required
                        rows={3}
                        value={poleForm.description}
                        onChange={(e) => setPoleForm({ ...poleForm, description: e.target.value })}
                        className="w-full border border-navy/10 p-2.5 rounded-sm text-sm"
                      ></textarea>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-mono text-charcoal/70 uppercase mb-1">URL de Couverture</label>
                      <input
                        type="text"
                        value={poleForm.couvertureUrl}
                        onChange={(e) => setPoleForm({ ...poleForm, couvertureUrl: e.target.value })}
                        className="w-full border border-navy/10 p-2.5 rounded-sm text-sm font-mono"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-mono text-charcoal/70 uppercase mb-1">Contenu riche (HTML)</label>
                      <textarea
                        rows={6}
                        value={poleForm.contenu}
                        onChange={(e) => setPoleForm({ ...poleForm, contenu: e.target.value })}
                        className="w-full border border-navy/10 p-2.5 rounded-sm text-sm font-mono"
                      ></textarea>
                    </div>
                  </div>
                )}

                {/* 3. ACTUALITE FORM */}
                {editType === "actualite" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-mono text-charcoal/70 uppercase mb-1">Titre de l'article</label>
                      <input
                        type="text"
                        required
                        value={actualiteForm.titre}
                        onChange={(e) => setActualiteForm({ ...actualiteForm, titre: e.target.value })}
                        placeholder="Inauguration..."
                        className="w-full border border-navy/10 p-2.5 rounded-sm text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-charcoal/70 uppercase mb-1">Catégorie</label>
                      <input
                        type="text"
                        required
                        value={actualiteForm.categorie}
                        onChange={(e) => setActualiteForm({ ...actualiteForm, categorie: e.target.value })}
                        placeholder="ex. Investissements, RSE, Résultats Financiers"
                        className="w-full border border-navy/10 p-2.5 rounded-sm text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-charcoal/70 uppercase mb-1">Filiale rattachée (Optionnel)</label>
                      <select
                        value={actualiteForm.filialeId}
                        onChange={(e) => setActualiteForm({ ...actualiteForm, filialeId: e.target.value })}
                        className="w-full border border-navy/10 p-2.5 rounded-sm text-sm"
                      >
                        <option value="">OMNIA NEXUS (Holding Générale)</option>
                        {filiales.map((f) => (
                          <option key={f.id} value={f.id}>{f.nom}</option>
                        ))}
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-mono text-charcoal/70 uppercase mb-1">Extrait (résumé pour les cartes)</label>
                      <textarea
                        required
                        rows={2}
                        value={actualiteForm.extrait}
                        onChange={(e) => setActualiteForm({ ...actualiteForm, extrait: e.target.value })}
                        className="w-full border border-navy/10 p-2.5 rounded-sm text-sm"
                      ></textarea>
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-charcoal/70 uppercase mb-1">URL de l'image d'illustration</label>
                      <input
                        type="text"
                        value={actualiteForm.imageUrl}
                        onChange={(e) => setActualiteForm({ ...actualiteForm, imageUrl: e.target.value })}
                        className="w-full border border-navy/10 p-2.5 rounded-sm text-sm font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-charcoal/70 uppercase mb-1">Auteur de publication</label>
                      <input
                        type="text"
                        required
                        value={actualiteForm.publiePar}
                        onChange={(e) => setActualiteForm({ ...actualiteForm, publiePar: e.target.value })}
                        className="w-full border border-navy/10 p-2.5 rounded-sm text-sm"
                      />
                    </div>
                    <div className="flex items-center gap-2 py-2">
                      <input
                        type="checkbox"
                        id="ressourcePresse"
                        checked={actualiteForm.ressourcePresse}
                        onChange={(e) => setActualiteForm({ ...actualiteForm, ressourcePresse: e.target.checked })}
                        className="w-4 h-4 text-gold border-navy/10"
                      />
                      <label htmlFor="ressourcePresse" className="text-xs font-mono text-charcoal/90 uppercase select-none">
                        Ressource Presse Téléchargeable (communiqué de presse)
                      </label>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-mono text-charcoal/70 uppercase mb-1">Contenu de l'article (HTML)</label>
                      <textarea
                        rows={10}
                        required
                        value={actualiteForm.contenu}
                        onChange={(e) => setActualiteForm({ ...actualiteForm, contenu: e.target.value })}
                        className="w-full border border-navy/10 p-2.5 rounded-sm text-sm font-mono"
                      ></textarea>
                    </div>
                  </div>
                )}

                {/* 4. OFFRE FORM */}
                {editType === "offre" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-mono text-charcoal/70 uppercase mb-1">Intitulé du poste</label>
                      <input
                        type="text"
                        required
                        value={offreForm.titre}
                        onChange={(e) => setOffreForm({ ...offreForm, titre: e.target.value })}
                        placeholder="ex. Analyste de Risques Junior"
                        className="w-full border border-navy/10 p-2.5 rounded-sm text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-charcoal/70 uppercase mb-1">Filiale recruteuse</label>
                      <select
                        value={offreForm.filialeId}
                        onChange={(e) => setOffreForm({ ...offreForm, filialeId: e.target.value })}
                        className="w-full border border-navy/10 p-2.5 rounded-sm text-sm"
                      >
                        <option value="">OMNIA NEXUS (Holding Générale)</option>
                        {filiales.map((f) => (
                          <option key={f.id} value={f.id}>{f.nom}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-charcoal/70 uppercase mb-1">Lieu du poste</label>
                      <input
                        type="text"
                        required
                        value={offreForm.lieu}
                        onChange={(e) => setOffreForm({ ...offreForm, lieu: e.target.value })}
                        className="w-full border border-navy/10 p-2.5 rounded-sm text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-charcoal/70 uppercase mb-1">Type de contrat</label>
                      <select
                        value={offreForm.typeContrat}
                        onChange={(e) => setOffreForm({ ...offreForm, typeContrat: e.target.value })}
                        className="w-full border border-navy/10 p-2.5 rounded-sm text-sm"
                      >
                        <option value="CDI">CDI (Contrat Durée Indéterminée)</option>
                        <option value="CDD">CDD (Contrat Durée Déterminée)</option>
                        <option value="Stage">Stage Professionnel</option>
                      </select>
                    </div>
                    <div className="flex items-center gap-2 py-2">
                      <input
                        type="checkbox"
                        id="offreActif"
                        checked={offreForm.actif}
                        onChange={(e) => setOffreForm({ ...offreForm, actif: e.target.checked })}
                        className="w-4 h-4 text-gold border-navy/10"
                      />
                      <label htmlFor="offreActif" className="text-xs font-mono text-charcoal/90 uppercase select-none">
                        Offre active (visible sur le site)
                      </label>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-mono text-charcoal/70 uppercase mb-1">Description complète du poste & Profil recherché</label>
                      <textarea
                        rows={10}
                        required
                        value={offreForm.description}
                        onChange={(e) => setOffreForm({ ...offreForm, description: e.target.value })}
                        className="w-full border border-navy/10 p-2.5 rounded-sm text-sm"
                      ></textarea>
                    </div>
                  </div>
                )}

                {/* 5. CHIFFRE CLE FORM */}
                {editType === "chiffre" && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-charcoal/70 uppercase mb-1">Libellé de la statistique</label>
                      <input
                        type="text"
                        required
                        value={chiffreForm.label}
                        onChange={(e) => setChiffreForm({ ...chiffreForm, label: e.target.value })}
                        placeholder="ex. Années d'existence, Collaborateurs"
                        className="w-full border border-navy/10 p-2.5 rounded-sm text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-charcoal/70 uppercase mb-1">Valeur Numérique</label>
                      <input
                        type="number"
                        required
                        value={chiffreForm.valeur}
                        onChange={(e) => setChiffreForm({ ...chiffreForm, valeur: parseInt(e.target.value) || 0 })}
                        className="w-full border border-navy/10 p-2.5 rounded-sm text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-charcoal/70 uppercase mb-1">Ordre d'affichage</label>
                      <input
                        type="number"
                        required
                        value={chiffreForm.ordre}
                        onChange={(e) => setChiffreForm({ ...chiffreForm, ordre: parseInt(e.target.value) || 0 })}
                        className="w-full border border-navy/10 p-2.5 rounded-sm text-sm"
                      />
                    </div>
                  </div>
                )}

                {/* Form CTA Actions */}
                <div className="pt-6 border-t border-navy/10 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-5 py-2.5 bg-navy/5 hover:bg-navy/10 text-xs font-semibold rounded-sm transition-colors cursor-pointer"
                  >
                    Fermer
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-gold text-navy font-bold text-xs uppercase tracking-wider rounded-sm hover:bg-gold-hover transition-colors cursor-pointer"
                  >
                    Enregistrer les modifications
                  </button>
                </div>
              </form>
            </div>
          ) : (
            /* LISTINGS PER TABS */
            <div>
              {/* Toolbar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="relative max-w-sm w-full">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/40" />
                  <input
                    type="text"
                    placeholder="Rechercher dans la liste..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full border border-navy/10 rounded-sm py-2 pl-9 pr-4 text-xs"
                  />
                </div>
                {activeTab !== "messages" && activeTab !== "candidatures" && (
                  <button
                    onClick={() => startCreate(activeTab.slice(0, -1) as any)}
                    className="px-4 py-2 bg-gold text-navy text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-gold-hover flex items-center gap-1.5 transition-colors self-start sm:self-auto cursor-pointer"
                  >
                    <Plus size={14} /> Ajouter un élément
                  </button>
                )}
              </div>

              {/* 1. TAB ACTUALITES */}
              {activeTab === "actualites" && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-navy/5 border-b border-navy/10 font-mono text-charcoal/70 uppercase">
                        <th className="p-3">Actualité</th>
                        <th className="p-3">Catégorie</th>
                        <th className="p-3">Rattaché à</th>
                        <th className="p-3">Date</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-navy/5">
                      {actualites
                        .filter(n => n.titre.toLowerCase().includes(searchTerm.toLowerCase()))
                        .map((n) => (
                          <tr key={n.id} className="hover:bg-navy/5">
                            <td className="p-3 font-medium text-navy max-w-xs truncate">{n.titre}</td>
                            <td className="p-3"><span className="bg-gold/10 text-navy font-semibold px-2 py-0.5 rounded-sm">{n.categorie}</span></td>
                            <td className="p-3 text-charcoal/70">{n.filialeNom || "Groupe OMNIA"}</td>
                            <td className="p-3 font-mono">{new Date(n.publieLe).toLocaleDateString("fr-FR")}</td>
                            <td className="p-3 text-right">
                              <div className="flex justify-end gap-2">
                                <button onClick={() => startEdit("actualite", n)} className="p-1.5 hover:bg-navy/10 rounded text-blue-600 cursor-pointer"><Edit3 size={14} /></button>
                                <button onClick={() => handleDelete("actualite", n.id)} className="p-1.5 hover:bg-navy/10 rounded text-red-600 cursor-pointer"><Trash2 size={14} /></button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* 2. TAB FILIALES */}
              {activeTab === "filiales" && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-navy/5 border-b border-navy/10 font-mono text-charcoal/70 uppercase">
                        <th className="p-3">Filiale</th>
                        <th className="p-3">Secteur</th>
                        <th className="p-3">Contact</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-navy/5">
                      {filiales
                        .filter(f => f.nom.toLowerCase().includes(searchTerm.toLowerCase()))
                        .map((f) => (
                          <tr key={f.id} className="hover:bg-navy/5">
                            <td className="p-3 font-medium text-navy">{f.nom}</td>
                            <td className="p-3">{f.secteur}</td>
                            <td className="p-3 font-mono text-charcoal/70">{f.contactEmail || "-"}</td>
                            <td className="p-3 text-right">
                              <div className="flex justify-end gap-2">
                                <button onClick={() => startEdit("filiale", f)} className="p-1.5 hover:bg-navy/10 rounded text-blue-600 cursor-pointer"><Edit3 size={14} /></button>
                                <button onClick={() => handleDelete("filiale", f.id)} className="p-1.5 hover:bg-navy/10 rounded text-red-600 cursor-pointer"><Trash2 size={14} /></button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* 3. TAB POLES */}
              {activeTab === "poles" && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-navy/5 border-b border-navy/10 font-mono text-charcoal/70 uppercase">
                        <th className="p-3">Pôle d'investissement</th>
                        <th className="p-3">Description</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-navy/5">
                      {poles
                        .filter(p => p.nom.toLowerCase().includes(searchTerm.toLowerCase()))
                        .map((p) => (
                          <tr key={p.id} className="hover:bg-navy/5">
                            <td className="p-3 font-medium text-navy">{p.nom}</td>
                            <td className="p-3 text-charcoal/70 max-w-sm truncate">{p.description}</td>
                            <td className="p-3 text-right">
                              <div className="flex justify-end gap-2">
                                <button onClick={() => startEdit("pole", p)} className="p-1.5 hover:bg-navy/10 rounded text-blue-600 cursor-pointer"><Edit3 size={14} /></button>
                                <button onClick={() => handleDelete("pole", p.id)} className="p-1.5 hover:bg-navy/10 rounded text-red-600 cursor-pointer"><Trash2 size={14} /></button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* 4. TAB CHIFFRES */}
              {activeTab === "chiffres" && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-navy/5 border-b border-navy/10 font-mono text-charcoal/70 uppercase">
                        <th className="p-3">Statistique (Label)</th>
                        <th className="p-3">Valeur numérique</th>
                        <th className="p-3">Ordre d'affichage</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-navy/5">
                      {chiffres
                        .filter(c => c.label.toLowerCase().includes(searchTerm.toLowerCase()))
                        .map((c) => (
                          <tr key={c.id} className="hover:bg-navy/5">
                            <td className="p-3 font-medium text-navy">{c.label}</td>
                            <td className="p-3 font-bold text-gold text-sm">{c.valeur}</td>
                            <td className="p-3 font-mono">{c.ordre}</td>
                            <td className="p-3 text-right">
                              <div className="flex justify-end gap-2">
                                <button onClick={() => startEdit("chiffre", c)} className="p-1.5 hover:bg-navy/10 rounded text-blue-600 cursor-pointer"><Edit3 size={14} /></button>
                                <button onClick={() => handleDelete("chiffre", c.id)} className="p-1.5 hover:bg-navy/10 rounded text-red-600 cursor-pointer"><Trash2 size={14} /></button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* 5. TAB OFFRES */}
              {activeTab === "offres" && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-navy/5 border-b border-navy/10 font-mono text-charcoal/70 uppercase">
                        <th className="p-3">Intitulé du poste</th>
                        <th className="p-3">Filiale</th>
                        <th className="p-3">Lieu</th>
                        <th className="p-3">Contrat</th>
                        <th className="p-3">Statut</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-navy/5">
                      {offres
                        .filter(o => o.titre.toLowerCase().includes(searchTerm.toLowerCase()))
                        .map((o) => (
                          <tr key={o.id} className="hover:bg-navy/5">
                            <td className="p-3 font-medium text-navy">{o.titre}</td>
                            <td className="p-3 text-charcoal/80">{o.filialeNom || "Holding Générale"}</td>
                            <td className="p-3">{o.lieu}</td>
                            <td className="p-3"><span className="bg-navy/5 text-navy font-semibold px-2 py-0.5 rounded-sm">{o.typeContrat}</span></td>
                            <td className="p-3">
                              {o.actif ? (
                                <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase">Actif</span>
                              ) : (
                                <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase">Inactif</span>
                              )}
                            </td>
                            <td className="p-3 text-right">
                              <div className="flex justify-end gap-2">
                                <button onClick={() => startEdit("offre", o)} className="p-1.5 hover:bg-navy/10 rounded text-blue-600 cursor-pointer"><Edit3 size={14} /></button>
                                <button onClick={() => handleDelete("offre", o.id)} className="p-1.5 hover:bg-navy/10 rounded text-red-600 cursor-pointer"><Trash2 size={14} /></button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* 6. TAB MESSAGES CONTACT */}
              {activeTab === "messages" && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-navy/5 border-b border-navy/10 font-mono text-charcoal/70 uppercase">
                        <th className="p-3">Expéditeur</th>
                        <th className="p-3">Sujet</th>
                        <th className="p-3">Service ciblé</th>
                        <th className="p-3">Date d'envoi</th>
                        <th className="p-3 text-right">Consulter</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-navy/5">
                      {messages
                        .filter(m => m.nom.toLowerCase().includes(searchTerm.toLowerCase()) || m.sujet.toLowerCase().includes(searchTerm.toLowerCase()))
                        .map((m) => (
                          <tr key={m.id} className="hover:bg-navy/5">
                            <td className="p-3">
                              <div className="font-medium text-navy">{m.nom}</div>
                              <div className="text-charcoal/50 text-[10px]">{m.email}</div>
                            </td>
                            <td className="p-3 font-medium text-charcoal/80 max-w-xs truncate">{m.sujet}</td>
                            <td className="p-3"><span className="bg-gold/10 text-navy font-semibold px-2 py-0.5 rounded-sm">{m.filiale || "Général"}</span></td>
                            <td className="p-3 font-mono">{new Date(m.envoyeLe).toLocaleDateString("fr-FR", { hour: "2-digit", minute: "2-digit" })}</td>
                            <td className="p-3 text-right">
                              <button
                                onClick={() => setViewItem({ type: "message", data: m })}
                                className="p-1.5 hover:bg-navy/10 rounded text-navy cursor-pointer flex items-center gap-1 text-[10px] uppercase font-mono ml-auto"
                              >
                                <Eye size={14} /> Lire
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* 7. TAB CANDIDATURES */}
              {activeTab === "candidatures" && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-navy/5 border-b border-navy/10 font-mono text-charcoal/70 uppercase">
                        <th className="p-3">Candidat</th>
                        <th className="p-3">Poste ciblé</th>
                        <th className="p-3">Statut actuel</th>
                        <th className="p-3">Soumis le</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-navy/5">
                      {candidatures
                        .filter(c => c.nom.toLowerCase().includes(searchTerm.toLowerCase()))
                        .map((c) => (
                          <tr key={c.id} className="hover:bg-navy/5">
                            <td className="p-3">
                              <div className="font-medium text-navy">{c.nom}</div>
                              <div className="text-charcoal/50 text-[10px]">{c.email}</div>
                            </td>
                            <td className="p-3">
                              {c.spontanee ? (
                                <span className="text-amber-600 font-semibold bg-amber-500/10 px-2 py-0.5 rounded-sm">Candidature Spontanée ({c.posteVoulu || "-"})</span>
                              ) : (
                                <span className="text-navy font-semibold">{c.offreTitre || "Offre d'emploi"}</span>
                              )}
                            </td>
                            <td className="p-3">
                              {c.statut === "nouveau" && <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase flex items-center gap-1 w-fit"><Clock size={10} /> Nouveau</span>}
                              {c.statut === "en cours" && <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase flex items-center gap-1 w-fit"><Clock size={10} /> En Cours</span>}
                              {c.statut === "retenu" && <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase flex items-center gap-1 w-fit"><CheckCircle size={10} /> Retenu</span>}
                              {c.statut === "rejeté" && <span className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase flex items-center gap-1 w-fit"><XCircle size={10} /> Rejeté</span>}
                            </td>
                            <td className="p-3 font-mono">{new Date(c.soumisLe).toLocaleDateString("fr-FR")}</td>
                            <td className="p-3 text-right">
                              <button
                                onClick={() => setViewItem({ type: "candidature", data: c })}
                                className="p-1.5 hover:bg-navy/10 rounded text-navy cursor-pointer flex items-center gap-1 text-[10px] uppercase font-mono ml-auto"
                              >
                                <Eye size={14} /> Traiter
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}

            </div>
          )}

        </div>

        {/* DETAILS POPUP MODAL VIEWER */}
        {viewItem && (
          <div className="fixed inset-0 bg-navy/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-sm border border-navy/10 shadow-2xl max-w-2xl w-full p-6 relative max-h-[85vh] overflow-y-auto">
              <button
                onClick={() => setViewItem(null)}
                className="absolute top-4 right-4 text-charcoal/50 hover:text-charcoal cursor-pointer text-lg font-bold"
              >
                &times;
              </button>

              {/* 1. Modal details view for incoming user Message */}
              {viewItem.type === "message" && (
                <div>
                  <div className="flex items-center gap-2 mb-4 border-b border-navy/10 pb-3">
                    <MessageSquare className="text-gold" size={18} />
                    <h3 className="text-lg font-serif font-bold text-navy">Lecture du message de contact</h3>
                  </div>
                  <div className="space-y-4 text-sm">
                    <div className="bg-navy/5 p-3 rounded-sm space-y-1">
                      <div><strong className="text-xs uppercase text-charcoal/50">Expéditeur :</strong> {viewItem.data.nom}</div>
                      <div><strong className="text-xs uppercase text-charcoal/50">Adresse email :</strong> <a href={`mailto:${viewItem.data.email}`} className="text-gold hover:underline">{viewItem.data.email}</a></div>
                      <div><strong className="text-xs uppercase text-charcoal/50">Service ou entité ciblé :</strong> {viewItem.data.filiale || "Général"}</div>
                      <div><strong className="text-xs uppercase text-charcoal/50">Date d'envoi :</strong> {new Date(viewItem.data.envoyeLe).toLocaleString("fr-FR")}</div>
                    </div>
                    <div>
                      <strong className="text-xs uppercase text-charcoal/50 block mb-1">Sujet :</strong>
                      <div className="text-navy font-bold text-base">{viewItem.data.sujet}</div>
                    </div>
                    <div>
                      <strong className="text-xs uppercase text-charcoal/50 block mb-1">Message :</strong>
                      <div className="text-charcoal bg-navy/5 p-4 rounded-sm whitespace-pre-line text-sm leading-relaxed">{viewItem.data.message}</div>
                    </div>
                    <div className="flex justify-end pt-4">
                      <button
                        onClick={() => setViewItem(null)}
                        className="px-4 py-2 bg-navy text-white font-bold text-xs uppercase tracking-wider rounded-sm hover:bg-gold hover:text-navy cursor-pointer"
                      >
                        Fermer le message
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* 2. Modal details view for Candidate Application */}
              {viewItem.type === "candidature" && (
                <div>
                  <div className="flex items-center gap-2 mb-4 border-b border-navy/10 pb-3">
                    <Users className="text-gold" size={18} />
                    <h3 className="text-lg font-serif font-bold text-navy">Évaluation de la candidature</h3>
                  </div>
                  <div className="space-y-4 text-sm">
                    <div className="bg-navy/5 p-3 rounded-sm space-y-1">
                      <div><strong className="text-xs uppercase text-charcoal/50">Nom complet :</strong> {viewItem.data.nom}</div>
                      <div><strong className="text-xs uppercase text-charcoal/50">Email :</strong> <a href={`mailto:${viewItem.data.email}`} className="text-gold hover:underline">{viewItem.data.email}</a></div>
                      <div><strong className="text-xs uppercase text-charcoal/50">Téléphone :</strong> {viewItem.data.telephone || "Non fourni"}</div>
                      <div><strong className="text-xs uppercase text-charcoal/50">Date de dépôt :</strong> {new Date(viewItem.data.soumisLe).toLocaleString("fr-FR")}</div>
                      <div><strong className="text-xs uppercase text-charcoal/50">Type de candidature :</strong> {viewItem.data.spontanee ? <span className="text-amber-600 font-bold">Candidature Spontanée</span> : <span className="text-navy font-bold">Candidature Postée</span>}</div>
                      {!viewItem.data.spontanee ? (
                        <div><strong className="text-xs uppercase text-charcoal/50">Poste d'offre visé :</strong> <span className="text-navy font-bold">{viewItem.data.offreTitre}</span></div>
                      ) : (
                        <div><strong className="text-xs uppercase text-charcoal/50">Poste désiré :</strong> <span className="text-navy font-bold">{viewItem.data.posteVoulu}</span></div>
                      )}
                    </div>
                    
                    <div>
                      <strong className="text-xs uppercase text-charcoal/50 block mb-1">Message d'accompagnement :</strong>
                      <div className="text-charcoal bg-navy/5 p-4 rounded-sm whitespace-pre-line text-xs italic leading-relaxed">
                        "{viewItem.data.message || "Aucun message d'accompagnement n'a été rédigé."}"
                      </div>
                    </div>

                    <div className="bg-gold/10 p-4 border border-gold/20 rounded-sm flex items-center justify-between">
                      <div>
                        <strong className="text-xs uppercase text-charcoal/50 block mb-1">Curriculum Vitae (CV) :</strong>
                        <span className="text-xs font-mono font-bold text-navy">{viewItem.data.cvUrl.split("/").pop()}</span>
                      </div>
                      <a
                        href={viewItem.data.cvUrl}
                        download
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 bg-navy text-white text-[10px] font-bold uppercase tracking-wider rounded-sm hover:bg-gold hover:text-navy transition-all"
                      >
                        Télécharger le CV PDF
                      </a>
                    </div>

                    {/* Change application status tab interface */}
                    <div className="pt-4 border-t border-navy/10 space-y-2">
                      <strong className="text-xs uppercase text-charcoal/70 block">Mettre à jour le statut de la candidature :</strong>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => updateCandidatureStatut(viewItem.data.id, "nouveau")}
                          className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-sm flex items-center gap-1 cursor-pointer transition-all ${
                            viewItem.data.statut === "nouveau" ? "bg-red-500 text-white" : "bg-navy/5 text-charcoal/60 hover:bg-navy/10"
                          }`}
                        >
                          Nouveau
                        </button>
                        <button
                          onClick={() => updateCandidatureStatut(viewItem.data.id, "en cours")}
                          className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-sm flex items-center gap-1 cursor-pointer transition-all ${
                            viewItem.data.statut === "en cours" ? "bg-blue-500 text-white" : "bg-navy/5 text-charcoal/60 hover:bg-navy/10"
                          }`}
                        >
                          En Cours
                        </button>
                        <button
                          onClick={() => updateCandidatureStatut(viewItem.data.id, "retenu")}
                          className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-sm flex items-center gap-1 cursor-pointer transition-all ${
                            viewItem.data.statut === "retenu" ? "bg-green-500 text-white" : "bg-navy/5 text-charcoal/60 hover:bg-navy/10"
                          }`}
                        >
                          Retenu (Accepter)
                        </button>
                        <button
                          onClick={() => updateCandidatureStatut(viewItem.data.id, "rejeté")}
                          className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-sm flex items-center gap-1 cursor-pointer transition-all ${
                            viewItem.data.statut === "rejeté" ? "bg-gray-500 text-white" : "bg-navy/5 text-charcoal/60 hover:bg-navy/10"
                          }`}
                        >
                          Rejeté (Décliner)
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-end pt-4">
                      <button
                        onClick={() => setViewItem(null)}
                        className="px-4 py-2 bg-navy text-white font-bold text-xs uppercase tracking-wider rounded-sm hover:bg-gold hover:text-navy cursor-pointer"
                      >
                        Quitter le dossier
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
