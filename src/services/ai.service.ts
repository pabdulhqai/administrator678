import { Injectable } from '@angular/core';
import { GoogleGenAI, Type } from '@google/genai';

@Injectable({
  providedIn: 'root'
})
export class AiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env['API_KEY'] });
  }

  async generateAppStructure(prompt: string): Promise<any> {
    const model = 'gemini-2.5-flash';
    
    const systemInstruction = `You are an expert Android App Architect and Product Manager. 
    Your goal is to design a complete Android application architecture based on a user's idea.
    You must provide a structured JSON response covering the app name, description, target audience, detailed features, data models (schema), list of screens, navigation flow, backend structure (Firebase), and monetization strategy.
    
    The output must be pure JSON compatible with the schema provided.`;

    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        app_name: { type: Type.STRING },
        description: { type: Type.STRING },
        target_users: { type: Type.STRING },
        theme_color: { type: Type.STRING, description: "Hex color code" },
        features: { 
          type: Type.ARRAY, 
          items: { type: Type.STRING } 
        },
        data_models: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              fields: { 
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    type: { type: Type.STRING },
                    relationship: { type: Type.STRING, nullable: true }
                  }
                }
              }
            }
          }
        },
        screens: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              type: { type: Type.STRING },
              description: { type: Type.STRING },
              components: { type: Type.ARRAY, items: { type: Type.STRING }}
            }
          }
        },
        firebase_structure: {
          type: Type.OBJECT,
          properties: {
            collections: { type: Type.ARRAY, items: { type: Type.STRING } },
            auth_methods: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        },
        monetization: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      },
      required: ["app_name", "description", "target_users", "features", "data_models", "screens", "firebase_structure"]
    };

    try {
      const response = await this.ai.models.generateContent({
        model: model,
        contents: prompt,
        config: {
          systemInstruction: systemInstruction,
          responseMimeType: "application/json",
          responseSchema: responseSchema
        }
      });
      
      const text = response.text;
      if (!text) throw new Error("No response from AI");
      return JSON.parse(text);
    } catch (e) {
      console.error("AI Generation Failed", e);
      throw e;
    }
  }

  async generateAppVideo(appName: string, description: string): Promise<string> {
    try {
      console.log('Starting video generation...');
      let operation = await this.ai.models.generateVideos({
        model: 'veo-2.0-generate-001',
        prompt: `A professional, cinematic promo video for a modern mobile app named "${appName}". 
        The app description is: ${description}. 
        Showcase a sleek smartphone interface in a high-tech environment. 
        High resolution, photorealistic, 4k, smooth motion.`,
        config: {
          numberOfVideos: 1
        }
      });

      console.log('Video operation started, polling for completion...');
      
      // Poll until done
      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000)); // Check every 10 seconds to respect rate limits
        operation = await this.ai.operations.getVideosOperation({operation: operation});
        console.log('Polling video status...');
      }

      const uri = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (!uri) throw new Error("No video URI returned");

      // Append API key for access
      return `${uri}&key=${process.env['API_KEY']}`;

    } catch (e) {
      console.error("Video Generation Failed", e);
      throw e;
    }
  }
}