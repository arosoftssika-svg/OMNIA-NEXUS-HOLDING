import React, { useState } from "react";
import { Landmark, Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle } from "lucide-react";

interface FooterProps {
  onNavigate: (view: string, detailId?: string | null) => void;
  filiales: Array<{ nom: string; slug: string }>;
  poles: Array<{ nom: string; slug: string }>;
}

export default function Footer({ onNavigate, filiales, poles }: FooterProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [msg, setMsg] = useState("");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    try {
      // Send newsletter subscription to backend or simulate
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nom: "Abonné Newsletter",
          email: email,
          sujet: "Inscription Newsletter OMNIA",
          message: "Demande d'inscription à la newsletter d'OMNIA NEXUS HOLDING."
        })
      });

      if (response.ok) {
        setStatus("success");
        setMsg("Votre inscription a été validée avec succès !");
        setEmail("");
      } else {
        throw new Error();
      }
    } catch (err) {
      setStatus("error");
      setMsg("Une erreur s'est produite. Veuillez réessayer.");
    }
  };

  return (
    <footer id="footer" className="bg-navy text-white border-t border-gold/10 pt-16 pb-8 relative overflow-hidden">
      {/* Decorative vector grid overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(176,141,87,0.1),transparent_60%)] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          
          {/* Column 1: Brand & Bio */}
          <div className="md:col-span-4 flex flex-col gap-4">
            <button
              onClick={() => onNavigate("home")}
              className="flex items-center gap-3 text-left cursor-pointer self-start"
            >
              <div className="w-10 h-10 border border-gold rounded-xs flex items-center justify-center bg-navy/50">
                <Landmark className="text-gold" size={20} />
              </div>
              <div>
                <span className="block text-lg font-serif font-bold tracking-wider text-white">
                  OMNIA NEXUS
                </span>
                <span className="block text-[9px] font-mono tracking-[0.25em] text-gold uppercase mt-1">
                  HOLDING GROUP
                </span>
              </div>
            </button>
            
            <p className="text-sm text-white/60 font-light leading-relaxed mt-2">
              OMNIA NEXUS HOLDING est un groupe d'investissement panafricain engagé dans la modernisation économique et le développement durable à travers ses pôles d'activités stratégiques.
            </p>

            <div className="flex flex-col gap-2.5 mt-4 text-xs font-medium text-white/80">
              <div className="flex items-start gap-2.5">
                <MapPin size={16} className="text-gold shrink-0 mt-0.5" />
                <span>Cocody, Boulevard Hassan II, Tour Omnia, Abidjan, Côte d'Ivoire</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone size={16} className="text-gold shrink-0" />
                <span>+225 27 22 45 60 70</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail size={16} className="text-gold shrink-0" />
                <span>contact@omnia-nexus.com</span>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links (Direct) */}
          <div className="md:col-span-2 flex flex-col gap-4">
            <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-gold border-b border-white/5 pb-2">
              Navigation
            </h4>
            <div className="flex flex-col gap-2.5 text-sm">
              <button onClick={() => onNavigate("home")} className="text-left text-white/70 hover:text-gold transition-colors">
                Accueil
              </button>
              <button onClick={() => onNavigate("le-groupe")} className="text-left text-white/70 hover:text-gold transition-colors">
                Le Groupe
              </button>
              <button onClick={() => onNavigate("gouvernance")} className="text-left text-white/70 hover:text-gold transition-colors">
                Gouvernance
              </button>
              <button onClick={() => onNavigate("relations-investisseurs")} className="text-left text-white/70 hover:text-gold transition-colors">
                Relations Investisseurs
              </button>
              <button onClick={() => onNavigate("media-centre")} className="text-left text-white/70 hover:text-gold transition-colors">
                Media Centre
              </button>
              <button onClick={() => onNavigate("carrieres")} className="text-left text-white/70 hover:text-gold transition-colors">
                Carrières
              </button>
            </div>
          </div>

          {/* Column 3: Subsidiaries */}
          <div className="md:col-span-3 flex flex-col gap-4">
            <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-gold border-b border-white/5 pb-2">
              Filiales & Pôles
            </h4>
            <div className="flex flex-col gap-2.5 text-sm">
              {filiales.slice(0, 3).map((f) => (
                <button
                  key={f.slug}
                  onClick={() => onNavigate("filiale-detail", f.slug)}
                  className="text-left text-white/70 hover:text-gold transition-colors truncate"
                >
                  {f.nom}
                </button>
              ))}
              {poles.slice(0, 2).map((p) => (
                <button
                  key={p.slug}
                  onClick={() => onNavigate("investissement-detail", p.slug)}
                  className="text-left text-white/70 hover:text-gold transition-colors truncate font-light"
                >
                  Pôle {p.nom}
                </button>
              ))}
            </div>
          </div>

          {/* Column 4: Newsletter */}
          <div className="md:col-span-3 flex flex-col gap-4">
            <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-gold border-b border-white/5 pb-2">
              Newsletter
            </h4>
            <p className="text-xs text-white/60 font-light leading-relaxed">
              Abonnez-vous à nos bulletins périodiques et communiqués financiers officiels.
            </p>
            
            <form onSubmit={handleSubscribe} className="flex flex-col gap-2 mt-2">
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="Votre adresse email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-sm py-2 pl-3 pr-10 text-xs text-white placeholder-white/40 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors"
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="absolute right-1 top-1 bottom-1 px-2.5 bg-gold text-navy rounded-sm hover:bg-gold-hover transition-colors flex items-center justify-center cursor-pointer"
                >
                  <Send size={12} />
                </button>
              </div>

              {status === "success" && (
                <p className="text-[11px] text-green-400 flex items-center gap-1 mt-1 font-medium">
                  <CheckCircle2 size={12} /> {msg}
                </p>
              )}
              {status === "error" && (
                <p className="text-[11px] text-red-400 flex items-center gap-1 mt-1 font-medium">
                  <AlertCircle size={12} /> {msg}
                </p>
              )}
            </form>
          </div>

        </div>

        {/* Legal disclosures & bottom bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/40 font-medium">
          <div>
            &copy; {new Date().getFullYear()} OMNIA NEXUS HOLDING S.A. Tous droits réservés.
          </div>
          <div className="flex items-center gap-4 sm:gap-6 flex-wrap justify-center">
            <button onClick={() => onNavigate("mentions-legales")} className="hover:text-gold transition-colors">
              Mentions Légales
            </button>
            <button onClick={() => onNavigate("confidentialite")} className="hover:text-gold transition-colors">
              Politique de Confidentialité
            </button>
            <button onClick={() => onNavigate("plan-du-site")} className="hover:text-gold transition-colors">
              Plan du Site
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
