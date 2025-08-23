// Declare puter as a global variable for TypeScript
declare global {
  interface Window {
    puter: {
      ai: {
        chat: (prompt: string, options?: { model?: string }) => Promise<string>;
      };
    };
  }
}

export async function generateMessageWithPuterAI(prompt: string): Promise<string> {
  try {
    // Wait for puter to be loaded
    if (typeof window.puter === 'undefined') {
      throw new Error('Puter AI not loaded');
    }

    // Use GPT-4o model for high quality results
    const response = await window.puter.ai.chat(prompt, { 
      model: "gpt-4o" 
    });
    
    // Extract the actual message text from the response object
    if (typeof response === 'object' && response !== null) {
      const responseObj = response as any;
      
      // Check if it has a message property
      if ('message' in responseObj && typeof responseObj.message === 'string') {
        return responseObj.message;
      }
      
      // Check if it has a toString method and use it
      if (typeof responseObj.toString === 'function') {
        const stringResult = responseObj.toString();
        // Make sure toString didn't just return [object Object]
        if (stringResult !== '[object Object]' && stringResult.trim().length > 0) {
          return stringResult;
        }
      }
      
      // Try to extract any string values from the object
      if (responseObj.text) return responseObj.text;
      if (responseObj.content) return responseObj.content;
      if (responseObj.response) return responseObj.response;
      
      // If it's an object with text content, try to extract it
      return JSON.stringify(response);
    }
    
    // If it's already a string, return it
    return String(response);
  } catch (error) {
    console.error('Puter AI Error:', error);
    throw new Error(`Failed to generate message with Puter AI: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}