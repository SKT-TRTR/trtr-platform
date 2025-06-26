import { useState, useEffect } from 'react';
import { apiRequest } from '@/lib/queryClient';

interface AIImageState {
  heroImage: string | null;
  serviceImages: Record<string, string>;
  isLoading: boolean;
  error: string | null;
}

export function useAIImages() {
  const [state, setState] = useState<AIImageState>({
    heroImage: null,
    serviceImages: {},
    isLoading: false,
    error: null
  });

  const generateHeroImage = async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await apiRequest('POST', '/api/generate-hero-image');
      const data = await response.json();
      
      setState(prev => ({
        ...prev,
        heroImage: data.imageUrl,
        isLoading: false
      }));
      
      return data.imageUrl;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Failed to generate hero image',
        isLoading: false
      }));
      throw error;
    }
  };

  const generateServiceImage = async (serviceName: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await apiRequest('POST', '/api/generate-service-image', {
        serviceName
      });
      const data = await response.json();
      
      setState(prev => ({
        ...prev,
        serviceImages: {
          ...prev.serviceImages,
          [serviceName]: data.imageUrl
        },
        isLoading: false
      }));
      
      return data.imageUrl;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: `Failed to generate image for ${serviceName}`,
        isLoading: false
      }));
      throw error;
    }
  };

  return {
    ...state,
    generateHeroImage,
    generateServiceImage
  };
}