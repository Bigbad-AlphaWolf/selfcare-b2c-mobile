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
		libelle: string;
	};
	audio: string;
	type: string;
}
