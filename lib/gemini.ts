import { GoogleGenerativeAI } from "@google/generative-ai";

// Gemini APIの設定
export class GeminiService {
  private genAI: GoogleGenerativeAI;

  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  /**
   * テキスト生成用のモデルを取得
   */
  getModel(modelName: string = "gemini-1.5-flash") {
    return this.genAI.getGenerativeModel({ model: modelName });
  }

  /**
   * テキストを生成する
   */
  async generateText(prompt: string, modelName?: string): Promise<string> {
    try {
      const model = this.getModel(modelName);
      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();
      return text;
    } catch (error) {
      console.error("Gemini API error:", error);
      throw new Error(`Failed to generate text: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * チャット形式でテキストを生成する
   */
  async generateChatResponse(
    messages: Array<{ role: "user" | "model"; parts: string }>,
    modelName?: string
  ): Promise<string> {
    try {
      const model = this.getModel(modelName);
      const chat = model.startChat({
        history: messages.map(msg => ({
          role: msg.role,
          parts: [{ text: msg.parts }]
        }))
      });

      const result = await chat.sendMessage(messages[messages.length - 1].parts);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("Gemini chat error:", error);
      throw error;
    }
  }

  /**
   * フライヤーのコンテンツを生成する
   */
  async generateFlyerContent(
    title: string,
    description: string,
    targetAudience?: string
  ): Promise<{
    headline: string;
    subheadline: string;
    bodyText: string;
    callToAction: string;
  }> {
    const prompt = `
あなたはプロのコピーライターです。以下の情報を基に、魅力的なフライヤーのコンテンツを作成してください。

タイトル: ${title}
説明: ${description}
${targetAudience ? `ターゲット層: ${targetAudience}` : ""}

以下の形式でJSONレスポンスを返してください：
{
  "headline": "キャッチーなメインタイトル（20文字以内）",
  "subheadline": "補助的な説明文（30文字以内）",
  "bodyText": "詳細な説明文（100文字以内）",
  "callToAction": "行動を促す文言（15文字以内）"
}
`;

    try {
      const response = await this.generateText(prompt);
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error("Invalid JSON response from Gemini");
    } catch (error) {
      console.error("Error generating flyer content:", error);
      // フォールバック値を返す
      return {
        headline: title.substring(0, 20),
        subheadline: description.substring(0, 30),
        bodyText: description.substring(0, 100),
        callToAction: "詳細はこちら"
      };
    }
  }
}

// シングルトンインスタンス用の関数
let geminiInstance: GeminiService | null = null;

export function getGeminiService(): GeminiService {
  // サーバーサイドでのみ実行されることを確認
  if (typeof window !== 'undefined') {
    throw new Error("GeminiService can only be used on the server side");
  }
  
  if (!geminiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is required");
    }
    geminiInstance = new GeminiService(apiKey);
  }
  return geminiInstance;
}