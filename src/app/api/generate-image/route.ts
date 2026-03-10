import { NextRequest, NextResponse } from "next/server";
import * as fs from "fs";
import * as path from "path";

// Available image generation models (require paid plan)
const IMAGE_MODELS = [
  "gemini-2.5-flash-image",
  "gemini-2.0-flash-exp-image-generation",
  "gemini-3.1-flash-image-preview",
];

export async function POST(request: NextRequest) {
  try {
    const { prompt, filename, model } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY not configured" },
        { status: 500 }
      );
    }

    const selectedModel = model || IMAGE_MODELS[0];

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${selectedModel}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            responseModalities: ["IMAGE", "TEXT"],
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      const errorMsg = errorData?.error?.message || `HTTP ${response.status}`;

      if (response.status === 429) {
        return NextResponse.json(
          {
            error: "Quota exceeded. Image generation requires a paid Gemini API plan.",
            details: errorMsg,
            availableModels: IMAGE_MODELS,
          },
          { status: 429 }
        );
      }

      return NextResponse.json(
        { error: errorMsg, status: response.status },
        { status: response.status }
      );
    }

    const data = await response.json();
    const parts = data.candidates?.[0]?.content?.parts || [];

    for (const part of parts) {
      if (part.inlineData) {
        const base64Data = part.inlineData.data;
        const mimeType = part.inlineData.mimeType || "image/png";
        const extension = mimeType.includes("png") ? "png" : "jpg";

        if (filename) {
          const imagesDir = path.join(process.cwd(), "public", "images");
          if (!fs.existsSync(imagesDir)) {
            fs.mkdirSync(imagesDir, { recursive: true });
          }
          const filePath = path.join(imagesDir, `${filename}.${extension}`);
          fs.writeFileSync(filePath, Buffer.from(base64Data, "base64"));

          return NextResponse.json({
            success: true,
            path: `/images/${filename}.${extension}`,
            mimeType,
          });
        }

        return NextResponse.json({
          success: true,
          image: base64Data,
          mimeType,
        });
      }
    }

    const textPart = parts.find((p: { text?: string }) => p.text);
    return NextResponse.json(
      {
        error: "No image generated",
        message: textPart?.text || "Unknown reason",
      },
      { status: 500 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error", details: String(error) },
      { status: 500 }
    );
  }
}
