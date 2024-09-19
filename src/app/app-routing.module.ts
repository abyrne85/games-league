import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ResultsComponent } from './results/results.component';
import { NewGameComponent } from './new-game/new-game.component';


const routes: Routes = [
  { path: 'new-game', component: NewGameComponent },
  { path: 'results', component: ResultsComponent },
  { path: '', redirectTo: '/results', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }



