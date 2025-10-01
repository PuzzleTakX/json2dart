const express = require("express");
const cors = require("cors");
const { quicktype, InputData, jsonInputForTargetLanguage } = require("quicktype-core");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/generate", async (req, res) => {
  const { className, json, options } = req.body;

  if (!className || !json) {
    return res.status(400).json({ error: "className and json are required" });
  }

  try {
    const jsonInput = jsonInputForTargetLanguage("dart");
    await jsonInput.addSource({ name: className, samples: [json] });

    const inputData = new InputData();
    inputData.addInput(jsonInput);

    const result = await quicktype({
      inputData,
      lang: "dart",
      rendererOptions: {
        "features": options?.features || [],
        "always-use-num-for-number": options?.useNum || false,
        "use-json-serializable": options?.useSerializable || false,
        "use-equatable": options?.useEquatable || false,
        "use-default-values": options?.useDefaultValue || false,
        "generate-json-as-comment": options?.generateJsonComment || false
      }
    });

    res.json({ dart: result.lines.join("\n") });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`API running on port ${port}`));
