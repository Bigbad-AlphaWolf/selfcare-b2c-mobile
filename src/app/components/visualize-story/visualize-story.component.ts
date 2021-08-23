import {Component, Input, OnInit} from '@angular/core';
import {StoryOem} from 'src/app/models/story-oem.model';

@Component({
  selector: 'app-visualize-story',
  templateUrl: './visualize-story.component.html',
  styleUrls: ['./visualize-story.component.scss']
})
export class VisualizeStoryComponent implements OnInit {
  @Input()
  story: StoryOem = {
    name: 'test',
    description: 'etst',
    shortlabel: 'shortLabel',
    longLabel: 'longLabel',
    storyContent: 'assets/images/story-default.webp',
    categorieOffreService: null,
    action: {label: 'Envoyer ', description: 'send money', url: null, typeAction: 'REDIRECTION'},
    audio: null,
    type: 'IMAGE'
  };
  constructor() {}

  ngOnInit() {}
}
