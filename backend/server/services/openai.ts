import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY
});

export interface MessageGenerationOptions {
  category: "sweet" | "romantic" | "poetic";
  includeEmojis: boolean;
  includeWeather: boolean;
  messageLength: "short" | "medium" | "long";
}

export async function generateGoodMorningMessage(options: MessageGenerationOptions): Promise<string> {
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
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a creative writer specializing in heartfelt, personalized good morning messages. Your messages are authentic, warm, and make people feel special."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 150,
      temperature: 0.9,
    });

    const message = response.choices[0].message.content?.trim();
    if (!message) {
      throw new Error("No message generated");
    }

    return message;
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw new Error(`Failed to generate message: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
