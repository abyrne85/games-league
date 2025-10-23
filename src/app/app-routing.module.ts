import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ResultsComponent } from './results/results.component';
import { NewRoundComponent } from './new-round/new-round.component';

const routes: Routes = [
  { path: 'new-round', component: NewRoundComponent },
  { path: 'results', component: ResultsComponent },
  { path: '', redirectTo: '/results', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }



