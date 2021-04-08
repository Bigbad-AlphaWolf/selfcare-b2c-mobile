import { DalalTonesSousGenreModel } from './dalal-tones-sous-genre.model';

export interface DalalTonesModel {
  cid?: string;
  titre?: string;
  codeDalal?: string;
  actif?: boolean;
  statut?: string;
  fournisseur?;
  artiste?: { nom?: string; image?: string };
  sousGenres?: DalalTonesSousGenreModel[];
  date?: string;
  tarif?: number;
}
