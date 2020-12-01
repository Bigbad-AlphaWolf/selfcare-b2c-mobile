import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
// import { MatBottomSheetContainer, AnimationDurations, AnimationCurves } from '@angular/material';
// import { style, trigger, state, transition, animate } from '@angular/animations';
// MatBottomSheetContainer['decorators'][0].args[0].animations[0] = trigger('state', [
//   state('void, hidden', style({transform: 'translateY(10%)', opacity:.5})),
//   state('visible', style({transform: 'translateY(0%)', opacity:1})),
//   transition('visible => void, visible => hidden',
//       animate(`${AnimationDurations.COMPLEX} ${AnimationCurves.ACCELERATION_CURVE}`)),
//   transition('void => visible',[
//       animate('80ms cubic-bezier(.1, .7, .1, 1)'),
//   ]
//     ),
// ]);

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
