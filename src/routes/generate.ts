import { Request, Response } from "express";

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

export const fromDrawing = async (req: Request, res: Response) => {
    const { svg, png } = req.body;
    console.log("Got drawing", svg?.length, png?.length);
    return res.json(fakeResponse());
};
