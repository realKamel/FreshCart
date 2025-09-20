import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, appConfig)
  //to fix the flicker caused by SSRing navbar then login changes the layout
  .catch((err) => console.error(err));
