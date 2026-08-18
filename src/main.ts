import { bootstrapApplication } from '@angular/platform-browser';
import { first } from 'rxjs';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig)
  .then((appRef) => {
    appRef.isStable.pipe(first((stable) => stable)).subscribe(() => {
      const loader = document.getElementById('app-loader');
      if (!loader) {
        return;
      }

      loader.classList.add('app-loader-hidden');
      setTimeout(() => loader.remove(), 500);
    });
  })
  .catch((err) => console.error(err));
