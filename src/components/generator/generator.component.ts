import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AiService } from '../../services/ai.service';
import { StoreService, AppProject } from '../../services/store.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-generator',
  standalone: true,
  imports: [FormsModule, NgClass],
  template: `
    <div class="max-w-4xl mx-auto px-4 py-12">
      <div class="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden min-h-[600px] flex flex-col">
        
        <!-- Header -->
        <div class="bg-indigo-600 p-8 text-white">
          <h1 class="text-3xl font-bold">AI App Architect</h1>
          <p class="text-indigo-100 mt-2 text-lg">Describe your dream app, and I'll build the entire architecture, UI, and backend plan for you.</p>
        </div>

        <!-- Content Area -->
        <div class="flex-1 p-8 flex flex-col">
          
          @if (isGenerating()) {
            <div class="flex-1 flex flex-col items-center justify-center space-y-8 animate-fade-in">
              <div class="relative w-24 h-24">
                <div class="absolute inset-0 border-4 border-slate-200 rounded-full"></div>
                <div class="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
                <div class="absolute inset-0 flex items-center justify-center">
                   <svg class="w-10 h-10 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                   </svg>
                </div>
              </div>
              
              <div class="text-center space-y-2">
                <h3 class="text-xl font-semibold text-slate-800">{{ loadingStep() }}</h3>
                <p class="text-slate-500">This usually takes about 10-20 seconds...</p>
              </div>

              <!-- Animated steps -->
              <div class="w-full max-w-sm space-y-3">
                @for (step of steps; track step) {
                  <div class="flex items-center text-sm" [ngClass]="getStepClass(step)">
                    <div class="w-5 h-5 rounded-full flex items-center justify-center mr-3 border" 
                      [ngClass]="getStepIconClass(step)">
                      @if (currentStepIndex() > steps.indexOf(step)) {
                        <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
                      }
                    </div>
                    {{ step }}
                  </div>
                }
              </div>
            </div>
          } @else {
            <!-- Input Form -->
             <div class="flex-1 flex flex-col justify-center space-y-6 max-w-2xl mx-auto w-full">
               
               <div class="space-y-2">
                 <label class="block text-sm font-medium text-slate-700">What kind of app do you want to build?</label>
                 <textarea [(ngModel)]="prompt" rows="4" 
                   class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-base border-slate-300 rounded-md p-4 bg-slate-50" 
                   placeholder="e.g., A marketplace for renting camping gear, with user profiles, listings map, and secure payments..."></textarea>
               </div>

               <div class="space-y-4">
                 <div class="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
                   <h4 class="text-sm font-semibold text-indigo-900 mb-2">💡 Pro Tips:</h4>
                   <ul class="text-sm text-indigo-800 space-y-1 list-disc list-inside">
                     <li>Specify your target audience (e.g., students, doctors).</li>
                     <li>Mention key features (e.g., dark mode, offline support).</li>
                     <li>Ask for specific business models (e.g., subscription).</li>
                   </ul>
                 </div>
               </div>

               <button (click)="generate()" [disabled]="!prompt" 
                 class="w-full flex items-center justify-center py-4 border border-transparent text-lg font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                 <svg class="mr-2 h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                 </svg>
                 Generate App Blueprint
               </button>
             </div>
          }

        </div>
      </div>
    </div>
  `,
  styles: [`
    @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
  `]
})
export class GeneratorComponent {
  prompt = '';
  isGenerating = signal(false);
  loadingStep = signal('Analyzing requirements...');
  currentStepIndex = signal(0);
  
  steps = [
    'Analyzing requirements & market fit',
    'Designing database schema & relationships',
    'Architecting UI/UX screens',
    'Constructing backend logic',
    'Finalizing build configuration'
  ];

  aiService = inject(AiService);
  store = inject(StoreService);
  router: Router = inject(Router);

  getStepClass(step: string) {
    const idx = this.steps.indexOf(step);
    if (idx < this.currentStepIndex()) return 'text-indigo-600 font-medium';
    if (idx === this.currentStepIndex()) return 'text-slate-900 font-bold';
    return 'text-slate-400';
  }

  getStepIconClass(step: string) {
    const idx = this.steps.indexOf(step);
    if (idx < this.currentStepIndex()) return 'bg-indigo-100 border-indigo-200 text-indigo-600';
    if (idx === this.currentStepIndex()) return 'border-indigo-600 animate-pulse';
    return 'border-slate-200';
  }

  async generate() {
    if (!this.prompt) return;
    
    this.isGenerating.set(true);
    this.simulateProgress();

    try {
      const result = await this.aiService.generateAppStructure(this.prompt);
      
      const newProject: AppProject = {
        id: Math.random().toString(36).substr(2, 9),
        projectName: result.app_name || 'Untitled App',
        appDescription: result.description || 'No description',
        appCategory: 'Generated', // Simple default, could parse from result
        themeColor: result.theme_color || '#4f46e5',
        createdAt: new Date(),
        status: 'completed',
        generatedData: result,
        versions: []
      };

      this.store.addProject(newProject);
      
      // Artificial delay to ensure animations finish nicely
      setTimeout(() => {
        this.router.navigate(['/project', newProject.id]);
      }, 1000);

    } catch (err) {
      console.error(err);
      this.isGenerating.set(false);
      alert('Failed to generate app. Please try again.');
    }
  }

  simulateProgress() {
    let step = 0;
    const interval = setInterval(() => {
      if (step >= this.steps.length) {
        clearInterval(interval);
        return;
      }
      this.currentStepIndex.set(step);
      this.loadingStep.set(this.steps[step]);
      step++;
    }, 2500); // cycle through steps every 2.5s while waiting for API
  }
}