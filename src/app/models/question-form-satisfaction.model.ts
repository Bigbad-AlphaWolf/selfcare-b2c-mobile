export interface QuestionFormSatisfactionModel {
    id?: number;
    libelle?: string;
    typeQuestion?: string;
    question?: string;
    ordre?: number;
    actif?: boolean;
    answers?: { id?: number, libelle?: string, ordre?: number }[];
}