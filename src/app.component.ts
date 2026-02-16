import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { StoreService } from './services/store.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <div class="min-h-screen bg-slate-50 text-slate-900 font-sans">
      @if (store.currentUser()) {
        <nav class="bg-white border-b border-slate-200 sticky top-0 z-50">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between h-16">
              <div class="flex">
                <div class="flex-shrink-0 flex items-center cursor-pointer" routerLink="/dashboard">
                  <div class="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
                  </div>
                  <span class="font-bold text-xl tracking-tight text-slate-800">AI App Studio</span>
                </div>
                <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
                  <a routerLink="/dashboard" class="border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">Projects</a>
                  <a routerLink="/create" class="border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">New App</a>
                </div>
              </div>
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <button (click)="logout()" class="relative inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-slate-500 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Sign out
                  </button>
                </div>
                 <div class="ml-4 flex items-center">
                   <div class="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                     {{ getInitials(store.currentUser()?.name) }}
                   </div>
                 </div>
              </div>
            </div>
          </div>
        </nav>
      }

      <main>
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: []
})
export class AppComponent {
  store = inject(StoreService);
  router: Router = inject(Router);

  logout() {
    this.store.logout();
    this.router.navigate(['/auth']);
  }

  getInitials(name: string | undefined): string {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  }
}