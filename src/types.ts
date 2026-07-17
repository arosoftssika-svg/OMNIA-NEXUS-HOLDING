export interface Filiale {
  id: string;
  nom: string;
  slug: string;
  secteur: string;
  description: string;
  logoUrl: string;
  couvertureUrl: string;
  contenu: string; // rich HTML or markdown text
  contactEmail?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PoleInvestissement {
  id: string;
  nom: string; // e.g. "Commerce", "Immobilier", "Investissement", "Développement de projets"
  slug: string;
  description: string;
  contenu: string;
  couvertureUrl: string;
}

export interface Actualite {
  id: string;
  titre: string;
  slug: string;
  extrait: string;
  contenu: string;
  imageUrl: string;
  categorie: string;
  filialeId?: string;
  filialeNom?: string; // hydrated client-side or on server
  ressourcePresse: boolean;
  publiePar: string;
  publieLe: string;
}

export interface MembreGouvernance {
  id: string;
  nom: string;
  fonction: string; // e.g. "Conseil d'Administration", "Comité d'Audit", "Direction Générale"
  bio: string;
  photoUrl?: string;
  ordre: number;
}

export interface OffreEmploi {
  id: string;
  titre: string;
  slug: string;
  filialeId?: string;
  filialeNom?: string; // hydrated
  lieu: string;
  typeContrat: string; // "CDI" | "CDD" | "Stage"
  description: string;
  actif: boolean;
  publieLe: string;
}

export interface Candidature {
  id: string;
  offreId?: string;
  offreTitre?: string; // hydrated
  spontanee: boolean;
  nom: string;
  email: string;
  telephone?: string;
  posteVoulu?: string;
  message?: string;
  cvUrl: string;
  soumisLe: string;
  statut: "nouveau" | "en cours" | "retenu" | "rejeté";
}

export interface MessageContact {
  id: string;
  nom: string;
  email: string;
  sujet: string;
  message: string;
  filiale?: string;
  envoyeLe: string;
}

export interface ChiffreCle {
  id: string;
  label: string; // ex. "Filiales", "Secteurs", "Collaborateurs"
  valeur: number;
  ordre: number;
}

export interface Utilisateur {
  id: string;
  email: string;
  role: "admin" | "redacteur_rh";
}
