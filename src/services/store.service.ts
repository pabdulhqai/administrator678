import { Injectable, signal, computed } from '@angular/core';

export interface AppVersion {
  id: string;
  label: string;
  createdAt: Date;
  data: any; // The generatedData snapshot
}

export interface AppProject {
  id: string;
  projectName: string;
  appDescription: string;
  appCategory: string;
  themeColor: string;
  createdAt: Date;
  generatedData?: any; // The full JSON from AI
  status: 'draft' | 'generating' | 'completed';
  versions: AppVersion[];
  promoVideoUrl?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  // Signals
  currentUser = signal<User | null>(null);
  projects = signal<AppProject[]>([]);
  searchQuery = signal<string>('');
  filterCategory = signal<string>('All');

  // Computed
  filteredProjects = computed(() => {
    const query = this.searchQuery().toLowerCase();
    const cat = this.filterCategory();
    
    return this.projects().filter(p => {
      const matchesSearch = p.projectName.toLowerCase().includes(query) || 
                            p.appDescription.toLowerCase().includes(query);
      const matchesCategory = cat === 'All' || p.appCategory === cat;
      return matchesSearch && matchesCategory;
    }).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  });

  constructor() {
    // Load some mock data if empty
    if (this.projects().length === 0) {
      this.loadMockProjects();
    }
  }

  login(email: string, name: string) {
    this.currentUser.set({
      id: 'user-' + Math.random().toString(36).substr(2, 9),
      email,
      name
    });
  }

  logout() {
    this.currentUser.set(null);
  }

  addProject(project: AppProject) {
    this.projects.update(list => [project, ...list]);
  }

  updateProjectVideo(projectId: string, videoUrl: string) {
    this.projects.update(projects => 
      projects.map(p => p.id === projectId ? { ...p, promoVideoUrl: videoUrl } : p)
    );
  }

  saveVersion(projectId: string, label: string) {
    this.projects.update(projects => {
      return projects.map(p => {
        if (p.id === projectId && p.generatedData) {
          const newVersion: AppVersion = {
            id: Math.random().toString(36).substr(2, 9),
            label,
            createdAt: new Date(),
            data: JSON.parse(JSON.stringify(p.generatedData))
          };
          return { ...p, versions: [newVersion, ...p.versions] };
        }
        return p;
      });
    });
  }

  restoreVersion(projectId: string, versionId: string) {
    this.projects.update(projects => {
      return projects.map(p => {
        if (p.id === projectId) {
          const version = p.versions.find(v => v.id === versionId);
          if (version) {
             return { ...p, generatedData: JSON.parse(JSON.stringify(version.data)) };
          }
        }
        return p;
      });
    });
  }

  createFromTemplate(templateName: string): string {
    const templateData = this.getTemplateData(templateName);
    const newProject: AppProject = {
      id: Math.random().toString(36).substr(2, 9),
      projectName: templateData.app_name,
      appDescription: templateData.description,
      appCategory: templateName,
      themeColor: templateData.theme_color || '#4f46e5',
      createdAt: new Date(),
      status: 'completed',
      generatedData: templateData,
      versions: []
    };
    
    // Create initial version
    const initialVersion: AppVersion = {
        id: Math.random().toString(36).substr(2, 9),
        label: 'Initial Template',
        createdAt: new Date(),
        data: templateData
    };
    newProject.versions.push(initialVersion);

    this.addProject(newProject);
    return newProject.id;
  }

  private getTemplateData(type: string): any {
    switch (type) {
      case 'E-Commerce':
        return {
          app_name: "ShopMaster",
          description: "A complete e-commerce solution with product catalog, cart, and payments.",
          target_users: "Shoppers looking for curated items",
          theme_color: "#ea580c",
          features: ["Product Search", "Shopping Cart", "User Reviews", "Order History", "Wishlist"],
          data_models: [
             { name: "Product", fields: [{ name: "price", type: "number" }, { name: "title", type: "string" }, { name: "image", type: "string" }] },
             { name: "Order", fields: [{ name: "total", type: "number" }, { name: "status", type: "string" }] }
          ],
          screens: [
            { name: "Home", type: "Dashboard", description: "Featured products and categories", components: ["Carousel", "Grid"] },
            { name: "Product Details", type: "Details", description: "Product info and add to cart", components: ["Image", "Text", "Button"] },
            { name: "Cart", type: "List", description: "Items ready for checkout", components: ["List", "Total", "Button"] }
          ],
          firebase_structure: { collections: ["products", "users", "orders"], auth_methods: ["email", "google"] },
          monetization: ["Product Sales", "Premium Delivery"]
        };
      case 'Blog / News':
        return {
          app_name: "Daily Reader",
          description: "A modern blog application for daily news and articles.",
          target_users: "Readers and Writers",
          theme_color: "#0ea5e9",
          features: ["Article Feed", "Categories", "Comments", "Bookmarks"],
          data_models: [
            { name: "Post", fields: [{ name: "title", type: "string" }, { name: "content", type: "text" }, { name: "authorId", type: "string" }] },
            { name: "Comment", fields: [{ name: "text", type: "string" }] }
          ],
          screens: [
            { name: "Feed", type: "List", description: "Latest articles", components: ["CardList"] },
            { name: "Article", type: "Details", description: "Reading view", components: ["RichText", "AuthorInfo"] }
          ],
          firebase_structure: { collections: ["posts", "comments", "users"], auth_methods: ["email"] },
          monetization: ["AdMob", "Premium Content"]
        };
      case 'Chat App':
        return {
          app_name: "Connect",
          description: "Real-time messaging application.",
          target_users: "General Public",
          theme_color: "#8b5cf6",
          features: ["Real-time Chat", "Group Chats", "Media Sharing"],
          data_models: [{ name: "Message", fields: [{ name: "text", type: "string" }, { name: "timestamp", type: "date" }] }],
          screens: [{ name: "Chat List", type: "List", description: "Recent conversations", components: ["AvatarList"] }],
          firebase_structure: { collections: ["messages", "chats", "users"], auth_methods: ["phone"] },
          monetization: ["Stickers", "Pro Features"]
        };
      case 'Booking':
        return {
          app_name: "BookIt",
          description: "Appointment scheduling app.",
          target_users: "Service Providers and Clients",
          theme_color: "#14b8a6",
          features: ["Calendar", "Notifications", "Service List"],
          data_models: [{ name: "Appointment", fields: [{ name: "date", type: "date" }, { name: "serviceId", type: "string" }] }],
          screens: [{ name: "Calendar", type: "Calendar", description: "Select dates", components: ["CalendarView"] }],
          firebase_structure: { collections: ["appointments", "services"], auth_methods: ["email"] },
          monetization: ["Subscription for Providers"]
        };
      case 'Delivery':
        return {
          app_name: "QuickDrop",
          description: "On-demand delivery service.",
          target_users: "Local residents",
          theme_color: "#f43f5e",
          features: ["Live Tracking", "Order Management", "Driver App"],
          data_models: [{ name: "Delivery", fields: [{ name: "address", type: "string" }, { name: "status", type: "string" }] }],
          screens: [{ name: "Track", type: "Map", description: "Live map view", components: ["Map", "StatusCard"] }],
          firebase_structure: { collections: ["deliveries", "drivers"], auth_methods: ["phone", "email"] },
          monetization: ["Delivery Fees"]
        };
      default: // Portfolio
        return {
          app_name: "MyPortfolio",
          description: "Showcase work and skills.",
          target_users: "Freelancers",
          theme_color: "#334155",
          features: ["Gallery", "Contact Form", "About Me"],
          data_models: [{ name: "Project", fields: [{ name: "title", type: "string" }, { name: "imageUrl", type: "string" }] }],
          screens: [{ name: "Gallery", type: "Grid", description: "Work showcase", components: ["ImageGrid"] }],
          firebase_structure: { collections: ["projects"], auth_methods: ["email"] },
          monetization: ["None"]
        };
    }
  }

  private loadMockProjects() {
    const mocks: AppProject[] = [
      {
        id: 'p1',
        projectName: 'FitTrack Pro',
        appDescription: 'A fitness tracking application with workout plans and diet logs.',
        appCategory: 'Health',
        themeColor: '#10b981',
        createdAt: new Date(Date.now() - 100000000),
        status: 'completed',
        generatedData: {
            app_name: 'FitTrack Pro',
            description: 'A fitness tracking application.',
            target_users: 'Fitness enthusiasts',
            theme_color: '#10b981',
            features: ['Workout Log', 'Diet Plan', 'Progress Charts'],
            screens: [{ name: 'Home', type: 'Dashboard', description: 'Overview', components: ['Stats'] }, { name: 'Workout', type: 'List', description: 'List of exercises', components: ['List'] }],
            data_models: [
                { name: 'User', fields: [{name: 'weight', type: 'number', relationship: 'None'}]},
                { name: 'Workout', fields: [{name: 'duration', type: 'number', relationship: 'None'}]}
            ],
            firebase_structure: { collections: ['users', 'workouts'], auth_methods: ['email'] },
            monetization: ['Subscription']
        },
        versions: []
      }
    ];
    
    // Add an initial version for the mock
    mocks[0].versions.push({
        id: 'v1-mock',
        label: 'Initial Generation',
        createdAt: mocks[0].createdAt,
        data: mocks[0].generatedData
    });

    this.projects.set(mocks);
  }
}
