import { GoogleGenerativeAI } from "@google/generative-ai";

export async function generateFromDrawing(base64Image: string, prompt: string) {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const result = await model.generateContent([
        {
            inlineData: {
                mimeType: "image/png",
                data: base64Image,
            },
        },
        { text: prompt },
    ]);

    return result.response.text();
}
