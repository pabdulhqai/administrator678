import { Component, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { StoreService } from '../../services/store.service';
import { DatePipe, NgClass } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, DatePipe, NgClass],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      <!-- Header Section -->
      <div class="md:flex md:items-center md:justify-between mb-8">
        <div class="flex-1 min-w-0">
          <h2 class="text-2xl font-bold leading-7 text-slate-900 sm:text-3xl sm:truncate">
            My Projects
          </h2>
          <p class="mt-1 text-sm text-slate-500">Manage your generated Android applications</p>
        </div>
        <div class="mt-4 flex md:mt-0 md:ml-4">
          <a routerLink="/create" class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
            <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            New Project
          </a>
        </div>
      </div>

      <!-- Filters & Search -->
      <div class="bg-white rounded-lg shadow-sm border border-slate-200 p-4 mb-8 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div class="relative w-full sm:w-96">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
            </svg>
          </div>
          <input type="text" [value]="store.searchQuery()" (input)="updateSearch($event)" class="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md leading-5 bg-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Search projects...">
        </div>
        
        <div class="flex gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
          <button (click)="setFilter('All')" [class]="getFilterClass('All')">All</button>
          <button (click)="setFilter('Shopping')" [class]="getFilterClass('Shopping')">Shopping</button>
          <button (click)="setFilter('Health')" [class]="getFilterClass('Health')">Health</button>
          <button (click)="setFilter('Social')" [class]="getFilterClass('Social')">Social</button>
          <button (click)="setFilter('Productivity')" [class]="getFilterClass('Productivity')">Productivity</button>
        </div>
      </div>

      <!-- Projects Grid -->
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        @for (project of store.filteredProjects(); track project.id) {
          <div class="group relative bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col h-full cursor-pointer" [routerLink]="['/project', project.id]">
            
            <div class="h-32 w-full relative" [style.background-color]="project.themeColor || '#4f46e5'">
               <div class="absolute inset-0 bg-black bg-opacity-10 group-hover:bg-opacity-0 transition-opacity"></div>
               <div class="absolute bottom-4 left-4">
                 <div class="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-slate-800 shadow-sm">
                   {{ project.appCategory }}
                 </div>
               </div>
            </div>

            <div class="p-5 flex-1 flex flex-col">
              <h3 class="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                {{ project.projectName }}
              </h3>
              <p class="mt-2 text-sm text-slate-500 line-clamp-2 flex-1">
                {{ project.appDescription }}
              </p>
              
              <div class="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span>Created {{ project.createdAt | date:'mediumDate' }}</span>
                <span class="flex items-center text-green-600 font-medium">
                  <span class="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                  Ready
                </span>
              </div>
            </div>
          </div>
        } @empty {
           <div class="col-span-full py-20 flex flex-col items-center justify-center text-center">
             <div class="bg-slate-100 p-6 rounded-full mb-4">
               <svg class="h-10 w-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
               </svg>
             </div>
             <h3 class="text-lg font-medium text-slate-900">No projects found</h3>
             <p class="mt-1 text-sm text-slate-500">Get started by creating a new AI-generated app.</p>
             <div class="mt-6">
               <a routerLink="/create" class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                 Create App
               </a>
             </div>
           </div>
        }
      </div>

      <!-- Templates Gallery -->
      <div class="mt-16">
        <h3 class="text-xl font-bold text-slate-900 mb-6">Start from a Template</h3>
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
           @for (template of templates; track template.name) {
             <button (click)="useTemplate(template.name)" class="flex flex-col items-center p-4 bg-white rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-sm transition-all text-center group">
               <div class="w-12 h-12 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                 <span [innerHTML]="getSafeHtml(template.icon)"></span>
               </div>
               <span class="text-sm font-medium text-slate-700 group-hover:text-indigo-600">{{template.name}}</span>
             </button>
           }
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class DashboardComponent {
  store = inject(StoreService);
  router = inject(Router);
  sanitizer = inject(DomSanitizer);

  templates = [
    { name: 'E-Commerce', icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>' },
    { name: 'Blog / News', icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>' },
    { name: 'Chat App', icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>' },
    { name: 'Booking', icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>' },
    { name: 'Delivery', icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>' },
    { name: 'Portfolio', icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>' }
  ];

  updateSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.store.searchQuery.set(input.value);
  }

  setFilter(category: string) {
    this.store.filterCategory.set(category);
  }

  getFilterClass(category: string): string {
    const base = "px-3 py-1.5 text-sm font-medium rounded-full transition-colors whitespace-nowrap";
    const active = "bg-indigo-100 text-indigo-700";
    const inactive = "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200";
    
    return this.store.filterCategory() === category ? `${base} ${active}` : `${base} ${inactive}`;
  }

  useTemplate(templateName: string) {
    const newProjectId = this.store.createFromTemplate(templateName);
    this.router.navigate(['/project', newProjectId]);
  }

  getSafeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}