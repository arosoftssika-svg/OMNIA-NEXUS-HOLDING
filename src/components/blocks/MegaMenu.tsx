import React, { useState, useEffect } from "react";
import { Filiale, PoleInvestissement } from "../../types";
import { Menu, X, ChevronDown, ShieldAlert, ArrowRight, Home, Landmark } from "lucide-react";

interface MegaMenuProps {
  currentView: string;
  selectedDetailId: string | null;
  onNavigate: (view: string, detailId?: string | null) => void;
  filiales: Filiale[];
  poles: PoleInvestissement[];
  adminUser: any;
  onLogout: () => void;
}

export default function MegaMenu({
  currentView,
  selectedDetailId,
  onNavigate,
  filiales,
  poles,
  adminUser,
  onLogout
}: MegaMenuProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<"filiales" | "investissements" | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileDropdown, setMobileDropdown] = useState<"filiales" | "investissements" | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNav = (view: string, detailId: string | null = null) => {
    onNavigate(view, detailId);
    setActiveDropdown(null);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header
      id="mega-menu"
      className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${
        isScrolled || mobileMenuOpen
          ? "bg-navy/95 backdrop-blur-md shadow-lg border-b border-white/10"
          : "bg-gradient-to-b from-navy/80 to-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          onClick={() => handleNav("home")}
          className="flex items-center gap-3 group text-left cursor-pointer"
        >
          <div className="w-10 h-10 border border-gold rounded-xs flex items-center justify-center bg-navy/50 transition-colors group-hover:bg-gold/10">
            <Landmark className="text-gold" size={20} />
          </div>
          <div>
            <span className="block text-lg font-serif font-bold tracking-wider text-white leading-none group-hover:text-gold transition-colors">
              OMNIA NEXUS
            </span>
            <span className="block text-[9px] font-mono tracking-[0.25em] text-gold uppercase mt-1 leading-none">
              HOLDING GROUP
            </span>
          </div>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          <button
            onClick={() => handleNav("home")}
            className={`px-3 py-2 text-sm font-medium transition-colors ${
              currentView === "home" ? "text-gold" : "text-white/80 hover:text-white"
            }`}
          >
            Accueil
          </button>

          <button
            onClick={() => handleNav("le-groupe")}
            className={`px-3 py-2 text-sm font-medium transition-colors ${
              currentView === "le-groupe" ? "text-gold" : "text-white/80 hover:text-white"
            }`}
          >
            Le Groupe
          </button>

          {/* Subsidiaries Dropdown Link */}
          <div
            className="relative"
            onMouseEnter={() => setActiveDropdown("filiales")}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button
              onClick={() => handleNav("filiales")}
              className={`px-3 py-2 text-sm font-medium transition-colors flex items-center gap-1 ${
                currentView === "filiales" || currentView === "filiale-detail"
                  ? "text-gold"
                  : "text-white/80 hover:text-white"
              }`}
            >
              Nos Filiales
              <ChevronDown size={14} className={`transition-transform ${activeDropdown === "filiales" ? "rotate-180" : ""}`} />
            </button>

            {/* Mega Dropdown */}
            {activeDropdown === "filiales" && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-[350px] bg-navy border border-white/10 rounded-sm shadow-xl py-4 px-2 z-50">
                <div className="text-[10px] font-mono text-gold tracking-widest uppercase px-4 mb-2">
                  CONSEIL & SYNERGIES
                </div>
                <div className="space-y-1">
                  {filiales.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => handleNav("filiale-detail", f.slug)}
                      className="w-full text-left px-4 py-2 hover:bg-white/5 rounded transition-colors group flex items-center justify-between"
                    >
                      <div>
                        <span className="block text-sm font-medium text-white group-hover:text-gold transition-colors">
                          {f.nom}
                        </span>
                        <span className="block text-[10px] text-white/50">
                          {f.secteur}
                        </span>
                      </div>
                      <ArrowRight size={14} className="text-white/0 group-hover:text-gold group-hover:translate-x-1 transition-all" />
                    </button>
                  ))}
                  <div className="border-t border-white/5 mt-2 pt-2 px-4">
                    <button
                      onClick={() => handleNav("filiales")}
                      className="text-xs text-gold hover:underline font-medium flex items-center gap-1"
                    >
                      Voir toutes les filiales <ArrowRight size={12} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Investment Poles Dropdown Link */}
          <div
            className="relative"
            onMouseEnter={() => setActiveDropdown("investissements")}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button
              onClick={() => handleNav("investissements")}
              className={`px-3 py-2 text-sm font-medium transition-colors flex items-center gap-1 ${
                currentView === "investissements" || currentView === "investissement-detail"
                  ? "text-gold"
                  : "text-white/80 hover:text-white"
              }`}
            >
              Nos Investissements
              <ChevronDown size={14} className={`transition-transform ${activeDropdown === "investissements" ? "rotate-180" : ""}`} />
            </button>

            {/* Mega Dropdown */}
            {activeDropdown === "investissements" && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-[350px] bg-navy border border-white/10 rounded-sm shadow-xl py-4 px-2 z-50">
                <div className="text-[10px] font-mono text-gold tracking-widest uppercase px-4 mb-2">
                  PÔLES D'INVESTISSEMENT
                </div>
                <div className="space-y-1">
                  {poles.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => handleNav("investissement-detail", p.slug)}
                      className="w-full text-left px-4 py-2 hover:bg-white/5 rounded transition-colors group flex items-center justify-between"
                    >
                      <div>
                        <span className="block text-sm font-medium text-white group-hover:text-gold transition-colors">
                          {p.nom}
                        </span>
                        <span className="block text-[10px] text-white/50 truncate max-w-[280px]">
                          {p.description}
                        </span>
                      </div>
                      <ArrowRight size={14} className="text-white/0 group-hover:text-gold group-hover:translate-x-1 transition-all" />
                    </button>
                  ))}
                  <div className="border-t border-white/5 mt-2 pt-2 px-4">
                    <button
                      onClick={() => handleNav("investissements")}
                      className="text-xs text-gold hover:underline font-medium flex items-center gap-1"
                    >
                      Découvrir les investissements <ArrowRight size={12} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => handleNav("gouvernance")}
            className={`px-3 py-2 text-sm font-medium transition-colors ${
              currentView === "gouvernance" ? "text-gold" : "text-white/80 hover:text-white"
            }`}
          >
            Gouvernance
          </button>

          <button
            onClick={() => handleNav("relations-investisseurs")}
            className={`px-3 py-2 text-sm font-medium transition-colors ${
              currentView === "relations-investisseurs" ? "text-gold" : "text-white/80 hover:text-white"
            }`}
          >
            Relations Investisseurs
          </button>

          <button
            onClick={() => handleNav("media-centre")}
            className={`px-3 py-2 text-sm font-medium transition-colors ${
              currentView === "media-centre" || currentView === "media-detail"
                ? "text-gold"
                : "text-white/80 hover:text-white"
            }`}
          >
            Actualités
          </button>

          <button
            onClick={() => handleNav("carrieres")}
            className={`px-3 py-2 text-sm font-medium transition-colors ${
              currentView === "carrieres" || currentView === "offre-detail"
                ? "text-gold"
                : "text-white/80 hover:text-white"
            }`}
          >
            Carrières
          </button>

          <button
            onClick={() => handleNav("contact")}
            className={`px-4 py-1.5 ml-2 rounded-xs border border-gold hover:bg-gold hover:text-navy text-gold text-xs font-semibold uppercase tracking-wider transition-all`}
          >
            Contact
          </button>

          {/* Admin shortcut button */}
          {adminUser ? (
            <div className="ml-4 flex items-center gap-2 pl-3 border-l border-white/20">
              <button
                onClick={() => handleNav("admin")}
                className="text-xs text-gold font-mono flex items-center gap-1 hover:underline"
              >
                <ShieldAlert size={12} /> Admin ({adminUser.role === "admin" ? "AD" : "RH"})
              </button>
              <button
                onClick={onLogout}
                className="text-[10px] text-white/60 hover:text-white underline font-mono"
              >
                Quitter
              </button>
            </div>
          ) : (
            <button
              onClick={() => handleNav("admin")}
              className="ml-4 pl-3 border-l border-white/20 text-white/40 hover:text-white/80 text-[10px] font-mono uppercase tracking-wider transition-colors flex items-center gap-1"
            >
              Portail RH
            </button>
          )}
        </nav>

        {/* Hamburger Mobile Menu */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden text-white/90 hover:text-white"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-navy border-t border-white/10 w-full h-[calc(100vh-70px)] overflow-y-auto px-6 py-6 space-y-6">
          <div className="flex flex-col gap-3">
            <button
              onClick={() => handleNav("home")}
              className="text-left text-lg font-medium text-white hover:text-gold flex items-center gap-2"
            >
              <Home size={18} /> Accueil
            </button>
            <button
              onClick={() => handleNav("le-groupe")}
              className="text-left text-lg font-medium text-white hover:text-gold"
            >
              Le Groupe
            </button>

            {/* Mobile Dropdown Nos Filiales */}
            <div className="space-y-2">
              <button
                onClick={() => setMobileDropdown(mobileDropdown === "filiales" ? null : "filiales")}
                className="w-full text-left text-lg font-medium text-white hover:text-gold flex items-center justify-between"
              >
                Nos Filiales
                <ChevronDown size={18} className={`transition-transform ${mobileDropdown === "filiales" ? "rotate-180" : ""}`} />
              </button>
              {mobileDropdown === "filiales" && (
                <div className="pl-4 border-l border-gold/30 flex flex-col gap-2 py-1">
                  {filiales.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => handleNav("filiale-detail", f.slug)}
                      className="text-left text-sm text-white/80 hover:text-gold"
                    >
                      {f.nom}
                    </button>
                  ))}
                  <button
                    onClick={() => handleNav("filiales")}
                    className="text-left text-xs text-gold hover:underline font-medium"
                  >
                    Toutes nos filiales &rarr;
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Dropdown Nos Investissements */}
            <div className="space-y-2">
              <button
                onClick={() => setMobileDropdown(mobileDropdown === "investissements" ? null : "investissements")}
                className="w-full text-left text-lg font-medium text-white hover:text-gold flex items-center justify-between"
              >
                Nos Investissements
                <ChevronDown size={18} className={`transition-transform ${mobileDropdown === "investissements" ? "rotate-180" : ""}`} />
              </button>
              {mobileDropdown === "investissements" && (
                <div className="pl-4 border-l border-gold/30 flex flex-col gap-2 py-1">
                  {poles.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => handleNav("investissement-detail", p.slug)}
                      className="text-left text-sm text-white/80 hover:text-gold"
                    >
                      {p.nom}
                    </button>
                  ))}
                  <button
                    onClick={() => handleNav("investissements")}
                    className="text-left text-xs text-gold hover:underline font-medium"
                  >
                    Tous nos pôles &rarr;
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => handleNav("gouvernance")}
              className="text-left text-lg font-medium text-white hover:text-gold"
            >
              Gouvernance
            </button>
            <button
              onClick={() => handleNav("relations-investisseurs")}
              className="text-left text-lg font-medium text-white hover:text-gold"
            >
              Relations Investisseurs
            </button>
            <button
              onClick={() => handleNav("media-centre")}
              className="text-left text-lg font-medium text-white hover:text-gold"
            >
              Media Centre & Actualités
            </button>
            <button
              onClick={() => handleNav("carrieres")}
              className="text-left text-lg font-medium text-white hover:text-gold"
            >
              Carrières
            </button>
            <button
              onClick={() => handleNav("contact")}
              className="text-left text-lg font-medium text-gold hover:text-white"
            >
              Contact
            </button>
          </div>

          <div className="border-t border-white/10 pt-6 flex flex-col gap-4">
            {adminUser ? (
              <div className="bg-navy-800 p-4 rounded-sm border border-gold/20 flex flex-col gap-2">
                <span className="text-xs text-gold font-mono">Session connectée : {adminUser.email}</span>
                <div className="flex gap-4">
                  <button
                    onClick={() => handleNav("admin")}
                    className="text-sm text-white font-medium hover:underline"
                  >
                    Dashboard Admin
                  </button>
                  <button
                    onClick={onLogout}
                    className="text-sm text-red-400 font-medium hover:underline"
                  >
                    Se déconnecter
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => handleNav("admin")}
                className="w-full text-center py-2.5 rounded-sm bg-gold text-navy font-bold hover:bg-gold-hover transition-colors text-sm uppercase tracking-wider"
              >
                Portail Recruteur RH
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
