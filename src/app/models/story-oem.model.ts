import {STORIES_OEM_CONFIG} from 'src/shared';

export interface StoryOem {
  id?: number;
  name?: string;
  description?: string;
  shortlabel?: string;
  longLabel?: string;
  storyContent?: string;
  categorieOffreService?: {
    libelle: string;
    ordre: number;
    code: string;
    zoneAffichage: string;
  };
  action?: {
    typeAction: string;
    description: string;
    url: string;
    label: string;
  };
  audio?: string;
  type?: 'IMAGE' | 'VIDEO';
  read?: boolean;
  duration?: number;
}

export class Story implements StoryOem {
  constructor(
    public name?: string,
    public id?: number,
    public description?: string,
    public shortlabel?: string,
    public longLabel?: string,
    public storyContent?: string,
    public formules?: string[],
    public categorieOffreService?: any,
    public action?: any,
    public type?: 'IMAGE' | 'VIDEO',
    public audio?: string,
    public read?: boolean,
    public duration?: number
  ) {
    this.name = name;
    this.description = description;
    this.shortlabel = shortlabel;
    this.action = action;
    this.storyContent = storyContent;
    this.audio = audio;
    this.categorieOffreService = categorieOffreService;
    this.type = type;
    this.read = read;
    this.longLabel = longLabel;
    this.duration = STORIES_OEM_CONFIG.DEFAULT_DURATION_BY_ELEMENT;
  }
}
