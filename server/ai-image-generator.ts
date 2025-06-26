import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Cache for generated images to avoid rate limits
const imageCache = new Map<string, string>();

export async function generateAIServiceImage(serviceName: string): Promise<string> {
  // Check cache first
  if (imageCache.has(serviceName)) {
    return imageCache.get(serviceName)!;
  }

  try {
    const prompt = `Create a futuristic anime-style robot or AI assistant representing ${serviceName}. The image should be:
    - High-tech, sleek design with glowing elements
    - Professional and sophisticated appearance
    - Anime/manga art style with clean lines
    - Futuristic color scheme with blues, purples, and cyan accents
    - Service-focused appearance that represents AI technology and innovation
    - Ultra-high quality, detailed rendering
    - No human faces, only stylized robots or AI entities`;

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      quality: "hd",
    });

    const imageUrl = response.data?.[0]?.url || "";
    if (imageUrl) {
      imageCache.set(serviceName, imageUrl);
    }
    return imageUrl;
  } catch (error) {
    console.error(`Failed to generate image for ${serviceName}:`, error);
    // Use high-quality anime/robot styled fallback images
    const fallbackImages = [
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
      "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
      "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200"
    ];
    return fallbackImages[Math.floor(Math.random() * fallbackImages.length)];
  }
}

export async function generateHeroAIImage(): Promise<string> {
  try {
    const prompt = `Create a stunning futuristic AI technology interface image showing:
    - Advanced holographic displays with AI data streams
    - Neural network visualizations and circuit patterns
    - Floating digital interfaces with glowing elements
    - AI brain or consciousness representations
    - Futuristic workspace with multiple screens showing AI analytics
    - Color scheme: deep blues, electric blues, purples, and cyan
    - High-tech laboratory or command center aesthetic
    - Ultra-realistic, cinematic quality
    - Represents cutting-edge AI solutions and business transformation`;

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      quality: "hd",
    });

    return response.data[0].url || "";
  } catch (error) {
    console.error("Failed to generate hero AI image:", error);
    // Fallback to existing image
    return "https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600";
  }
}