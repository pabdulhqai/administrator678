import { Routes, Router } from '@angular/router';
import { AuthComponent } from './components/auth/auth.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { GeneratorComponent } from './components/generator/generator.component';
import { ProjectDetailsComponent } from './components/project-details/project-details.component';
import { inject } from '@angular/core';
import { StoreService } from './services/store.service';

// Simple guard to protect routes
const authGuard = () => {
  const store = inject(StoreService);
  const router: Router = inject(Router);
  if (!store.currentUser()) {
    router.navigate(['/auth']);
    return false;
  }
  return true;
};

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'auth', component: AuthComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'create', component: GeneratorComponent, canActivate: [authGuard] },
  { path: 'project/:id', component: ProjectDetailsComponent, canActivate: [authGuard] }
];