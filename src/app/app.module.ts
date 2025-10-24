import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { TabsModule } from 'primeng/tabs';
import { NewRoundComponent } from './new-round/new-round.component';
import { ResultsComponent } from './results/results.component';

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        NewRoundComponent,
        ResultsComponent,
        TabsModule
    ],
    providers: [
        providePrimeNG({
            theme: {
                preset: Aura
            }
        }),
        provideHttpClient(),
        provideAnimationsAsync()
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
