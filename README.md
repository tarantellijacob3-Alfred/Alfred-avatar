# Alfred Avatar — Local Voice

This page can call a **local OpenAI TTS proxy** so your API key stays off the public web.

## Setup
1) Create `.env` in this folder:
```
OPENAI_API_KEY=your_key_here
```

2) Start the local server:
```
node local-voice-server.js
```

3) Open the avatar page and click **Talk (Local TTS)**.

> The local server runs at http://localhost:7070
