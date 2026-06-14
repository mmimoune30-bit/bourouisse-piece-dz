'use server';
/**
 * @fileOverview A Genkit flow for generating AI-powered search suggestions for auto parts.
 *
 * - generateSearchSuggestions - A function that handles the generation of search suggestions.
 * - SearchSuggestionsInput - The input type for the generateSearchSuggestions function.
 * - SearchSuggestionsOutput - The return type for the generateSearchSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SearchSuggestionsInputSchema = z.object({
  query: z.string().describe('The user\'s current search query or input.'),
});
export type SearchSuggestionsInput = z.infer<typeof SearchSuggestionsInputSchema>;

const SearchSuggestionsOutputSchema = z.object({
  suggestions: z.array(z.string()).describe('An array of relevant search terms or related product suggestions.'),
});
export type SearchSuggestionsOutput = z.infer<typeof SearchSuggestionsOutputSchema>;

const searchSuggestionsPrompt = ai.definePrompt({
  name: 'searchSuggestionsPrompt',
  input: { schema: SearchSuggestionsInputSchema },
  output: { schema: SearchSuggestionsOutputSchema },
  prompt: `You are an AI assistant specialized in auto parts.
The user is typing a search query. Your task is to provide relevant search term suggestions or related product names based on the user's input.
Provide a list of 3-5 suggestions that are highly relevant to the query.

User query: "{{{query}}}"

Examples:
If query is "brake p", suggestions could be: ["brake pads", "brake calipers", "brake fluid", "performance brake pads"]
If query is "engine oil for", suggestions could be: ["engine oil for BMW E46", "engine oil for Mercedes C-Class", "synthetic engine oil", "diesel engine oil"]
If query is "tire", suggestions could be: ["tires for sedan", "winter tires", "all-season tires", "tire pressure monitor", "tire repair kit"]
`,
});

const aiPoweredSearchSuggestionsFlow = ai.defineFlow(
  {
    name: 'aiPoweredSearchSuggestionsFlow',
    inputSchema: SearchSuggestionsInputSchema,
    outputSchema: SearchSuggestionsOutputSchema,
  },
  async (input) => {
    const { output } = await searchSuggestionsPrompt(input);
    return output!;
  }
);

export async function generateSearchSuggestions(input: SearchSuggestionsInput): Promise<SearchSuggestionsOutput> {
  return aiPoweredSearchSuggestionsFlow(input);
}
