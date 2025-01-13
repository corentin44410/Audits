export interface Questionnaire {
  id: number;
  code_questionnaire: string;
  version_questionnaire: number;
  date_questionnaire: string;
  profils: string[];
  titre_questionnaire: string;
  etat_questionnaire: string;
  pages: Page[];
}

export interface Page {
  id_page: number;
  code_page: string;
  titre_page: string;
  description: string;
  ordre_page: number;
  questions: Question[];
}

export interface Question {
  id_question: number;
  code_question: string;
  libelle_question: string;
  format_question: string;
  obligatoire: number;
  bulle_aide?: string;
  reponses: Reponse[];
  attribut: string;
}

export interface QuestionLabel {
  texte: string;
  couleur: string;
}

export interface QuestionAttributes {
  attributs: {
    etiquettes: QuestionLabel[];
  };
}

export interface Reponse {
  id_reponse: number;
  libelle_reponse: string | null;
  valeur: string | null;
  poids: number;
  ordre_reponse: number;
  attributs?: string[];
}

export interface UtilisateurReponse {
  QuestionnaireId: number;
  PageId: number;
  ReponseId: number;
  QuestionId: number;
  AuditId: string;
  Valeur: any;
  Commentaire: string;
  PlanAction: string | null; // JSON stringifié contenant { Description: string, Echeance: string }
  BloqueEnContreVisite: number;
  DateMaj: string;
  ID: number;
  GUID: string;
  LastUpdateDate: string;
}

export interface Audit {
  id: string;
  date: string;
  name: string;
  completion: number;
  responses: UtilisateurReponse[];
  status: 'draft' | 'published';
  publishedAt?: string;
  signature?: string;
}