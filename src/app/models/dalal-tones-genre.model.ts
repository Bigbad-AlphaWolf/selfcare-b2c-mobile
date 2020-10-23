import { DalalTonesSousGenreModel } from './dalal-tones-sous-genre.model';

export interface DalalTonesGenreModel {
  nom?: string;
  code?: string;
  sousGenres?: DalalTonesSousGenreModel[];
}
