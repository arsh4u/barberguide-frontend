import {Routes} from '@angular/router';
import {ProfessionalListComponent} from './features/professionals/professional-list/professional-list.component';
import {ProfessionalDetailComponent} from './features/professionals/professional-detail/professional-detail.component';

export const appRoutes: Routes = [
  {path: '', component: ProfessionalListComponent},
  {path: 'professionals/:id', component: ProfessionalDetailComponent},
];
