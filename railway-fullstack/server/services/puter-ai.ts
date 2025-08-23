export interface MessageGenerationOptions {
  category: "sweet" | "romantic" | "poetic";
  includeEmojis: boolean;
  includeWeather: boolean;
  messageLength: "short" | "medium" | "long";
}

export async function generateGoodMorningMessageWithPuter(options: MessageGenerationOptions): Promise<string> {
  const { category, includeEmojis, includeWeather, messageLength } = options;
  
  const categoryDescriptions = {
    sweet: "caring, warm, and affectionate",
    romantic: "deeply loving, passionate, and intimate", 
    poetic: "artistic, lyrical, and beautifully crafted with metaphors"
  };

  const emojiInstruction = includeEmojis 
    ? "Include relevant and tasteful emojis throughout the message." 
    : "Do not include any emojis in the message.";

  const weatherInstruction = includeWeather
    ? "Include a brief, positive reference to the morning weather or sunrise."
    : "";

  const lengthInstructions = {
    short: "Keep it between 7-10 words - very brief and impactful",
    medium: "Keep it between 10-20 words - concise but sweet", 
    long: "Keep it between 20-30 words - more detailed and expressive"
  };

  const prompt = `Generate a unique, personalized good morning message that is ${categoryDescriptions[category]}. 

Requirements:
- The message should be heartfelt and original
- ${lengthInstructions[messageLength]}
- Make it feel personal and genuine
- ${emojiInstruction}
- ${weatherInstruction}
- Avoid cliches and overused phrases
- Make each message unique and special

Style: ${category}
Length: ${messageLength}

Please respond with just the message text, no additional formatting or quotation marks.`;

  try {
    // This will be handled on the frontend using Puter.js
    // Server just returns the prompt for frontend processing
    return JSON.stringify({ 
      prompt, 
      usePuterAI: true 
    });
  } catch (error) {
    console.error("Puter AI preparation error:", error);
    throw new Error(`Failed to prepare message generation: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}