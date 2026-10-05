import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject
} from '@angular/core';

import {
  NavigationEnd,
  Router
} from '@angular/router';

import { filter } from 'rxjs';

import {
  IonApp,
  IonRouterOutlet,
  IonButton
} from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [
    IonApp,
    IonRouterOutlet,
    IonButton
  ],
  changeDetection: ChangeDetectionStrategy.Default
})
export class AppComponent {

  private router = inject(Router);
  private changeDetector = inject(ChangeDetectorRef);

  darkMode = false;

  constructor() {

    this.darkMode =
      localStorage.getItem('darkMode') === 'true';

    document.documentElement.classList.toggle(
      'dark',
      this.darkMode
    );

    this.router.events
      .pipe(
        filter(
          event =>
            event instanceof NavigationEnd
        )
      )
      .subscribe(() => {

        this.changeDetector.markForCheck();

      });
  }

  toggleDarkMode(): void {

    this.darkMode = !this.darkMode;

    document.documentElement.classList.toggle(
      'dark',
      this.darkMode
    );

    localStorage.setItem(
      'darkMode',
      String(this.darkMode)
    );
  }
}
