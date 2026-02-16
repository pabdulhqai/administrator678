import { Component, inject, computed, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { StoreService } from '../../services/store.service';
import { AiService } from '../../services/ai.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-project-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    @if (project()) {
      <div class="min-h-screen bg-slate-50 pb-20">
        
        <!-- Header -->
        <div class="bg-white border-b border-slate-200 shadow-sm">
          <div class="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div class="flex items-center">
                <div class="w-12 h-12 rounded-lg flex items-center justify-center mr-4 text-white shadow-lg" [style.background-color]="project()?.themeColor">
                  <span class="text-xl font-bold">{{ project()?.projectName?.charAt(0) }}</span>
                </div>
                <div>
                  <h1 class="text-2xl font-bold text-slate-900">{{ project()?.projectName }}</h1>
                  <p class="text-sm text-slate-500">{{ project()?.appCategory }} • Created {{ project()?.createdAt | date }}</p>
                </div>
              </div>
              <div class="flex space-x-3">
                 <button (click)="startBuild()" class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                   <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                   </svg>
                   Build APK
                 </button>
              </div>
            </div>
          </div>
          
          <!-- Tabs -->
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
             <div class="border-b border-slate-200">
               <nav class="-mb-px flex space-x-8 overflow-x-auto" aria-label="Tabs">
                 <button (click)="activeTab.set('overview')" [class]="getTabClass('overview')">Overview</button>
                 <button (click)="activeTab.set('data')" [class]="getTabClass('data')">Data Models</button>
                 <button (click)="activeTab.set('ui')" [class]="getTabClass('ui')">UI Structure</button>
                 <button (click)="activeTab.set('backend')" [class]="getTabClass('backend')">Backend</button>
                 <button (click)="activeTab.set('history')" [class]="getTabClass('history')">History & Versions</button>
                 <button (click)="activeTab.set('video')" [class]="getTabClass('video')">
                   Veo Preview <span class="ml-1 inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">New</span>
                 </button>
               </nav>
             </div>
          </div>
        </div>

        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          <!-- Content: Overview -->
          @if (activeTab() === 'overview') {
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div class="lg:col-span-2 space-y-6">
                <div class="bg-white shadow rounded-lg p-6">
                  <h3 class="text-lg font-medium leading-6 text-slate-900 mb-4">App Summary</h3>
                  <p class="text-slate-600 mb-4">{{ project()?.appDescription }}</p>
                  <div class="border-t border-slate-100 pt-4 mt-4">
                    <h4 class="text-sm font-medium text-slate-900 mb-2">Target Audience</h4>
                    <p class="text-sm text-slate-500">{{ project()?.generatedData?.target_users }}</p>
                  </div>
                </div>

                <div class="bg-white shadow rounded-lg p-6">
                  <h3 class="text-lg font-medium leading-6 text-slate-900 mb-4">Key Features</h3>
                  <ul class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    @for (feature of project()?.generatedData?.features; track feature) {
                      <li class="flex items-start">
                        <svg class="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span class="text-slate-600">{{ feature }}</span>
                      </li>
                    }
                  </ul>
                </div>
              </div>

              <div class="space-y-6">
                 <div class="bg-white shadow rounded-lg p-6">
                   <h3 class="text-lg font-medium leading-6 text-slate-900 mb-4">Monetization Strategy</h3>
                   <div class="space-y-3">
                     @for (strat of project()?.generatedData?.monetization; track strat) {
                       <div class="bg-indigo-50 text-indigo-700 px-3 py-2 rounded-md text-sm font-medium">
                         {{ strat }}
                       </div>
                     }
                   </div>
                 </div>
              </div>
            </div>
          }

          <!-- Content: Data Models -->
          @if (activeTab() === 'data') {
             <div class="space-y-6">
               @for (model of project()?.generatedData?.data_models; track model.name) {
                 <div class="bg-white shadow rounded-lg overflow-hidden">
                   <div class="px-6 py-4 border-b border-slate-200 bg-slate-50">
                     <h3 class="text-lg font-medium text-slate-900 font-mono">{{ model.name }}</h3>
                   </div>
                   <div class="px-6 py-4">
                     <table class="min-w-full divide-y divide-slate-200">
                       <thead>
                         <tr>
                           <th class="px-3 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Field Name</th>
                           <th class="px-3 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Type</th>
                           <th class="px-3 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Relationship</th>
                         </tr>
                       </thead>
                       <tbody class="divide-y divide-slate-200">
                         @for (field of model.fields; track field.name) {
                           <tr>
                             <td class="px-3 py-2 whitespace-nowrap text-sm font-medium text-slate-900">{{ field.name }}</td>
                             <td class="px-3 py-2 whitespace-nowrap text-sm text-slate-500 font-mono text-xs bg-slate-100 rounded inline-block mt-1">{{ field.type }}</td>
                             <td class="px-3 py-2 whitespace-nowrap text-sm text-slate-500">{{ field.relationship || '-' }}</td>
                           </tr>
                         }
                       </tbody>
                     </table>
                   </div>
                 </div>
               }
             </div>
          }

          <!-- Content: UI Structure -->
          @if (activeTab() === 'ui') {
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              @for (screen of project()?.generatedData?.screens; track screen.name) {
                <div class="bg-white rounded-xl shadow border border-slate-200 overflow-hidden flex flex-col">
                  <div class="h-2 bg-slate-800 w-full"></div>
                  <div class="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                    <span class="font-bold text-slate-700">{{ screen.name }}</span>
                    <span class="text-xs px-2 py-1 bg-white border border-slate-200 rounded text-slate-500">{{ screen.type }}</span>
                  </div>
                  <div class="p-4 flex-1">
                    <p class="text-sm text-slate-600 mb-4">{{ screen.description }}</p>
                    <div class="space-y-2">
                       @for (comp of screen.components; track comp) {
                         <div class="h-8 bg-slate-100 rounded border border-slate-200 flex items-center px-3">
                           <span class="text-xs text-slate-500">{{ comp }}</span>
                         </div>
                       }
                    </div>
                  </div>
                </div>
              }
            </div>
          }

          <!-- Content: Backend -->
          @if (activeTab() === 'backend') {
             <div class="bg-white shadow rounded-lg p-6">
                <h3 class="text-lg font-medium text-slate-900 mb-6">Firebase Configuration</h3>
                
                <div class="mb-8">
                  <h4 class="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Firestore Collections</h4>
                  <div class="bg-slate-900 rounded-lg p-4 font-mono text-sm text-green-400">
                    @for (col of project()?.generatedData?.firebase_structure?.collections; track col) {
                      <div>/{{col}}</div>
                    }
                  </div>
                </div>

                <div>
                  <h4 class="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Authentication Methods</h4>
                  <div class="flex gap-3">
                    @for (auth of project()?.generatedData?.firebase_structure?.auth_methods; track auth) {
                      <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        {{ auth }}
                      </span>
                    }
                  </div>
                </div>
             </div>
          }

          <!-- Content: History -->
          @if (activeTab() === 'history') {
             <div class="space-y-6">
               <div class="bg-white shadow rounded-lg p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h3 class="text-lg font-medium text-slate-900">Version Control</h3>
                    <p class="text-sm text-slate-500 mt-1">Create snapshots of your app at any stage.</p>
                  </div>
                  <button (click)="createSnapshot()" class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    <svg class="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                    </svg>
                    Save Current Version
                  </button>
               </div>

               <div class="bg-white shadow rounded-lg overflow-hidden">
                 <div class="px-6 py-4 border-b border-slate-200 bg-slate-50">
                    <h3 class="text-lg font-medium text-slate-900">History</h3>
                 </div>
                 <ul class="divide-y divide-slate-200">
                   @for (version of project()?.versions; track version.id) {
                     <li class="p-6 hover:bg-slate-50 transition-colors">
                       <div class="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                         <div>
                           <div class="flex items-center">
                              <span class="text-lg font-semibold text-slate-800">{{ version.label }}</span>
                              @if ($first) {
                                <span class="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Latest</span>
                              }
                           </div>
                           <p class="text-sm text-slate-500 mt-1">{{ version.createdAt | date:'medium' }}</p>
                           <p class="text-xs text-slate-400 mt-1 font-mono">ID: {{ version.id }}</p>
                         </div>
                         <div class="flex space-x-3">
                           <button (click)="restoreVersion(version.id)" class="text-sm font-medium text-indigo-600 hover:text-indigo-900 border border-indigo-200 rounded px-3 py-1 hover:bg-indigo-50 transition-colors">
                             Restore
                           </button>
                         </div>
                       </div>
                     </li>
                   } @empty {
                      <li class="p-8 text-center text-slate-500">No versions saved yet.</li>
                   }
                 </ul>
               </div>
             </div>
          }

          <!-- Content: Veo Video -->
          @if (activeTab() === 'video') {
            <div class="bg-white shadow rounded-lg overflow-hidden">
              <div class="px-6 py-6 border-b border-slate-200">
                <h3 class="text-lg font-medium text-slate-900">AI Promo Video Generator</h3>
                <p class="text-sm text-slate-500 mt-2">Generate a cinematic promotional video for your app using Google's Veo model.</p>
              </div>
              
              <div class="p-6 flex flex-col items-center">
                @if (project()?.promoVideoUrl) {
                  <div class="w-full max-w-4xl bg-black rounded-xl overflow-hidden shadow-2xl mb-6">
                    <video controls class="w-full h-auto aspect-video" [src]="project()?.promoVideoUrl">
                      Your browser does not support the video tag.
                    </video>
                  </div>
                  <div class="flex gap-4">
                     <button (click)="generateVideo()" [disabled]="isGeneratingVideo()" class="inline-flex items-center px-4 py-2 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
                        Regenerate Video
                     </button>
                     <a [href]="project()?.promoVideoUrl" download="promo.mp4" class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        Download MP4
                     </a>
                  </div>
                } @else {
                  @if (isGeneratingVideo()) {
                    <div class="py-20 text-center">
                       <div class="relative w-20 h-20 mx-auto mb-6">
                          <div class="absolute inset-0 border-4 border-slate-200 rounded-full"></div>
                          <div class="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
                       </div>
                       <h4 class="text-lg font-medium text-slate-900">Generating Video...</h4>
                       <p class="text-slate-500 mt-2 max-w-md mx-auto">This takes about 1-2 minutes. Veo is rendering a high-quality 4K promo video for "{{ project()?.projectName }}".</p>
                    </div>
                  } @else {
                    <div class="py-16 text-center max-w-2xl">
                       <div class="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
                          <svg class="w-10 h-10 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                       </div>
                       <h4 class="text-xl font-bold text-slate-900 mb-2">Create a Vision of Your App</h4>
                       <p class="text-slate-500 mb-8">
                         Use the power of AI to visualize your app concept in a real-world setting. 
                         Perfect for presentations and pitch decks.
                       </p>
                       <button (click)="generateVideo()" class="inline-flex items-center px-6 py-3 border border-transparent rounded-full shadow-lg text-base font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform hover:scale-105 transition-all">
                          <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Generate Promo Video
                       </button>
                    </div>
                  }
                }
              </div>
            </div>
          }

        </div>
      </div>

      <!-- Build Modal -->
      @if (isBuilding()) {
        <div class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
            <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
              <div>
                <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 mb-4">
                  <svg class="h-6 w-6 text-indigo-600 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
                <div class="mt-3 text-center sm:mt-5">
                  <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                    Building APK Package
                  </h3>
                  <div class="mt-2">
                    <p class="text-sm text-gray-500">
                      Compiling resources, linking libraries, and signing package...
                    </p>
                    <div class="w-full bg-gray-200 rounded-full h-2.5 mt-4">
                      <div class="bg-indigo-600 h-2.5 rounded-full transition-all duration-300" [style.width.%]="buildProgress()"></div>
                    </div>
                    <p class="text-xs text-gray-400 mt-2">{{ buildStatus() }}</p>
                  </div>
                </div>
              </div>
              @if (buildComplete()) {
                <div class="mt-5 sm:mt-6">
                  <button (click)="closeBuild()" type="button" class="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none sm:text-sm">
                    Download app-release.apk (24MB)
                  </button>
                </div>
              }
            </div>
          </div>
        </div>
      }
    } @else {
      <div class="min-h-screen flex items-center justify-center">
        <p class="text-slate-500">Loading project...</p>
      </div>
    }
  `
})
export class ProjectDetailsComponent {
  route: ActivatedRoute = inject(ActivatedRoute);
  store = inject(StoreService);
  aiService = inject(AiService);
  
  // Use computed to automatically update when store changes (e.g. restore version)
  project = computed(() => {
    const id = this.route.snapshot.paramMap.get('id');
    return this.store.projects().find(p => p.id === id);
  });

  activeTab = signal<'overview' | 'data' | 'ui' | 'backend' | 'history' | 'video'>('overview');
  
  // Build state
  isBuilding = signal(false);
  buildProgress = signal(0);
  buildStatus = signal('Initializing...');
  buildComplete = signal(false);

  // Video state
  isGeneratingVideo = signal(false);

  getTabClass(tabName: string) {
    const base = "whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors cursor-pointer";
    const active = "border-indigo-500 text-indigo-600";
    const inactive = "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300";
    return this.activeTab() === tabName ? `${base} ${active}` : `${base} ${inactive}`;
  }

  startBuild() {
    this.isBuilding.set(true);
    this.buildProgress.set(0);
    this.buildComplete.set(false);
    
    // Simulate build steps
    const steps = [
      { p: 10, t: 'Resolving dependencies...' },
      { p: 30, t: 'Compiling Kotlin sources...' },
      { p: 50, t: 'Merging manifest files...' },
      { p: 75, t: 'Optimizing resources...' },
      { p: 90, t: 'Signing APK with debug key...' },
      { p: 100, t: 'Build successful!' }
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i >= steps.length) {
        clearInterval(interval);
        this.buildComplete.set(true);
        return;
      }
      this.buildProgress.set(steps[i].p);
      this.buildStatus.set(steps[i].t);
      i++;
    }, 800);
  }

  closeBuild() {
    this.isBuilding.set(false);
    alert('APK Download started!');
  }

  createSnapshot() {
    const label = window.prompt('Enter a name for this version (e.g., "Initial Beta", "Before Payment Integration"):');
    if (label && this.project()) {
      this.store.saveVersion(this.project()!.id, label);
    }
  }

  restoreVersion(versionId: string) {
    if (confirm('Are you sure you want to restore this version? This will overwrite the current project state.')) {
      this.store.restoreVersion(this.project()!.id, versionId);
      this.activeTab.set('overview');
    }
  }

  async generateVideo() {
    const p = this.project();
    if (!p) return;

    this.isGeneratingVideo.set(true);
    try {
      const url = await this.aiService.generateAppVideo(p.projectName, p.appDescription);
      this.store.updateProjectVideo(p.id, url);
    } catch (e) {
      alert('Failed to generate video. Please try again.');
    } finally {
      this.isGeneratingVideo.set(false);
    }
  }
}