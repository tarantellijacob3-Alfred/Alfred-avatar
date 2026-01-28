import http from "http";
import fs from "fs";

const PORT = process.env.PORT || 7070;
let API_KEY = process.env.OPENAI_API_KEY;

if (!API_KEY && fs.existsSync('.env')) {
  const env = fs.readFileSync('.env', 'utf8');
  for (const line of env.split(/\r?\n/)) {
    const m = line.match(/^\s*OPENAI_API_KEY\s*=\s*(.+)\s*$/);
    if (m) {
      API_KEY = m[1].replace(/^"|"$/g, '').replace(/^'|'$/g, '');
      break;
    }
  }
}

if (!API_KEY) {
  console.error("Missing OPENAI_API_KEY in env or .env file.");
  process.exit(1);
}

const server = http.createServer(async (req, res) => {
  if (req.method === "POST" && req.url === "/tts") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", async () => {
      try {
        const { text = "" } = JSON.parse(body || "{}");
        const response = await fetch("https://api.openai.com/v1/audio/speech", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gpt-4o-mini-tts",
            voice: "alloy",
            input: text || "Hello from Alfred.",
          }),
        });

        if (!response.ok) {
          const errText = await response.text();
          res.writeHead(500, { "Content-Type": "text/plain" });
          res.end(errText);
          return;
        }

        const audioBuffer = Buffer.from(await response.arrayBuffer());
        res.writeHead(200, { "Content-Type": "audio/mpeg" });
        res.end(audioBuffer);
      } catch (err) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end(String(err));
      }
    });
    return;
  }

  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("OK");
});

server.listen(PORT, () => {
  console.log(`Local TTS server running on http://localhost:${PORT}`);
});
