export interface StoryOem {
  name: string;
  description: string;
  shortlabel: string;
  longLabel: string;
  storyContent: string;
  categorieOffreService: any;
  action: {
    typeAction: string;
    description: string;
    url: string;
    label: string;
  };
  audio: string;
  type: 'IMAGE' | 'VIDEO';
  duration?: number;
}
