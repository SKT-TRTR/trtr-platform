import * as fs from "fs";
import { GoogleGenAI, Modality } from "@google/genai";

// DON'T DELETE THIS COMMENT
// Follow these instructions when using this blueprint:
// - Note that the newest Gemini model series is "gemini-2.5-flash" or gemini-2.5-pro"
//   - do not change this unless explicitly requested by the user

// This API key is from Gemini Developer API Key, not vertex AI API Key
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function summarizeArticle(text: string): Promise<string> {
    const prompt = `Please summarize the following text concisely while maintaining key points:\n\n${text}`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
    });

    return response.text || "Something went wrong";
}

export interface Sentiment {
    rating: number;
    confidence: number;
}

export async function analyzeSentiment(text: string): Promise<Sentiment> {
    try {
        const systemPrompt = `You are a sentiment analysis expert. 
Analyze the sentiment of the text and provide a rating
from 1 to 5 stars and a confidence score between 0 and 1.
Respond with JSON in this format: 
{'rating': number, 'confidence': number}`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-pro",
            config: {
                systemInstruction: systemPrompt,
                responseMimeType: "application/json",
                responseSchema: {
                    type: "object",
                    properties: {
                        rating: { type: "number" },
                        confidence: { type: "number" },
                    },
                    required: ["rating", "confidence"],
                },
            },
            contents: text,
        });

        const rawJson = response.text;

        console.log(`Raw JSON: ${rawJson}`);

        if (rawJson) {
            const data: Sentiment = JSON.parse(rawJson);
            return data;
        } else {
            throw new Error("Empty response from model");
        }
    } catch (error) {
        throw new Error(`Failed to analyze sentiment: ${error}`);
    }
}

export async function analyzeImage(base64Image: string): Promise<string> {
    const contents = [
        {
            inlineData: {
                data: base64Image,
                mimeType: "image/jpeg",
            },
        },
        `Analyze this image in detail and describe its key elements, context,
and any notable aspects.`,
    ];

    const response = await ai.models.generateContent({
        model: "gemini-2.5-pro",
        contents: contents,
    });

    return response.text || "";
}

export async function generateContentWithGemini(prompt: string): Promise<string> {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        return response.text || "No response generated";
    } catch (error) {
        throw new Error(`Failed to generate content with Gemini: ${error}`);
    }
}

export async function generateImage(
    prompt: string,
): Promise<string> {
    try {
        // IMPORTANT: only this gemini model supports image generation
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash-preview-image-generation",
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            config: {
                responseModalities: [Modality.TEXT, Modality.IMAGE],
            },
        });

        const candidates = response.candidates;
        if (!candidates || candidates.length === 0) {
            throw new Error("No image generated");
        }

        const content = candidates[0].content;
        if (!content || !content.parts) {
            throw new Error("No content in response");
        }

        for (const part of content.parts) {
            if (part.inlineData && part.inlineData.data) {
                // Return base64 image data
                return `data:image/jpeg;base64,${part.inlineData.data}`;
            }
        }
        
        throw new Error("No image data found in response");
    } catch (error) {
        throw new Error(`Failed to generate image: ${error}`);
    }
}