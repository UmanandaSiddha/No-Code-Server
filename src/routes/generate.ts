import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { generateFromDrawing } from "../services/gemini";

// Stub response generator
const fakeResponse = () => ({
    html: `<div style="text-align:center;padding:40px;">
        <h1>Hello World</h1>
        <button style="padding:10px 20px;background:#007bff;color:white;border:none;border-radius:5px;">
        Click Me
        </button>
        </div>`,
    css: `body { font-family: Arial, sans-serif; background:#f5f5f5; }`,
    json: { components: [{ type: "header", text: "Hello World" }, { type: "button", text: "Click Me" }] }
});

export const fromPrompt = async (req: Request, res: Response) => {
    const { prompt } = req.body;
    console.log("Prompt:", prompt);
    return res.json(fakeResponse());
};

export async function fromDrawing(req: Request, res: Response) {
    try {
        const { imageBase64, prompt } = req.body;

        const tmpDir = path.join(__dirname, "..", "..", "public", "images");
        if (!fs.existsSync(tmpDir)) {
            fs.mkdirSync(tmpDir);
        }

        const imagePath = path.join(tmpDir, `drawing-${Date.now()}.png`);
        const imageBuffer = Buffer.from(imageBase64, "base64");
        fs.writeFileSync(imagePath, imageBuffer);

        const code = await generateFromDrawing(
            imageBase64,
            `${prompt}. The output should be in the form of json of type object with 2 fields html and css, and write all the styling in inline css only. Make modern Ui with slick design and color combination and make it responsive` || "Generate HTML+CSS layout"
        );

        let parsed = code;

        // Strip markdown fences if present
        if (typeof code === "string") {
            parsed = code.replace(/```json|```/g, "").trim();
            try {
                parsed = JSON.parse(parsed);
            } catch {
                console.error("Failed to parse generated code");
            }
        }

        console.log(parsed);

        res.json({ success: true, parsed });
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ success: false, error: err.message });
    }
}
