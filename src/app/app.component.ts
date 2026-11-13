import { Component, inject, OnInit, signal } from '@angular/core';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { filter } from 'rxjs';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: false
})
export class AppComponent implements OnInit {
    private _swUpdate = inject(SwUpdate);

    updateAvailable = signal(false);

    ngOnInit(): void {
        if (!this._swUpdate.isEnabled) {
            return;
        }

        this._swUpdate.versionUpdates
            .pipe(filter((e): e is VersionReadyEvent => e.type === 'VERSION_READY'))
            .subscribe(() => this.updateAvailable.set(true));

        // Installed PWAs are often resumed rather than relaunched, so check
        // for a new version whenever the app comes back into view.
        this._checkForUpdate();
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
                this._checkForUpdate();
            }
        });
    }

    reload(): void {
        this._swUpdate.activateUpdate().finally(() => document.location.reload());
    }

    private _checkForUpdate(): void {
        this._swUpdate.checkForUpdate().catch(() => { /* offline or SW not ready */ });
    }
}
