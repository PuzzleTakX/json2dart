import { quicktype, InputData, jsonInputForTargetLanguage } from "quicktype-core";

/**
 * Vercel Serverless Function
 * دریافت POST با body: { className: string, json: string }
 * برگرداندن Dart code
 */
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const { className, json } = req.body;

    if (!className || !json) {
      res.status(400).json({ error: "Missing className or json" });
      return;
    }

    // آماده سازی quicktype
    const jsonInput = jsonInputForTargetLanguage("dart");
    await jsonInput.addSource({ name: className, samples: [json] });

    const inputData = new InputData();
    inputData.addInput(jsonInput);

    const result = await quicktype({
      inputData,
      lang: "dart",
    });

    res.status(200).json({ dartCode: result.lines.join("\n") });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
