
import { describe, it, expect, vi } from 'vitest';
import { getOmniIntelligence } from './geminiService';

// Mock the GoogleGenAI SDK
vi.mock('@google/genai', () => {
    return {
        GoogleGenAI: vi.fn().mockImplementation(() => ({
            getGenerativeModel: vi.fn().mockReturnValue({
                generateContent: vi.fn().mockResolvedValue({
                    response: {
                        text: () => JSON.stringify({
                            summary: "Test summary",
                            signals: [],
                            recommendations: []
                        }),
                        candidates: [{
                            groundingMetadata: {
                                groundingChunks: [
                                    { web: { title: "Test News", uri: "https://example.com" } }
                                ]
                            }
                        }]
                    }
                })
            })
        })),
        Type: {
            OBJECT: 'OBJECT',
            ARRAY: 'ARRAY',
            STRING: 'STRING',
            NUMBER: 'NUMBER'
        }
    };
});

// Mock Sentry
vi.mock('@sentry/react', () => ({
    captureException: vi.fn(),
    init: vi.fn()
}));

describe('GeminiService', () => {
    it('should correctly map intelligence data and news links', async () => {
        const mockData: any = [{ name: 'Test', symbol: 'TEST', price: 100, change: 1, rsi: 50 }];
        const result = await getOmniIntelligence(mockData);

        expect(result.summary).toBe("Test summary");
        expect(result.news).toHaveLength(1);
        expect(result.news[0].title).toBe("Test News");
        expect(result.news[0].source).toBe("example.com");
    });
});
