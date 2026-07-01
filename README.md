# mcp-nato

Phonetic & Morse code MCP.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1174+ live data sources.

## Tools

| Tool | Description |
|------|-------------|
| `spell_nato` | Spell text using the NATO phonetic alphabet (A -> "Alfa", B -> "Bravo"…). Great for reading codes/confirmation numbers aloud. Keyless, offline. |
| `morse_encode` | Encode text to Morse code (letters separated by spaces, words by " / "). Keyless, offline. |
| `morse_decode` | Decode Morse code back to text. Accepts letters separated by spaces and words by "/" or "  " (double space). Keyless, offline. |

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "nato": {
      "url": "https://gateway.pipeworx.io/nato/mcp"
    }
  }
}
```

Or connect to the full Pipeworx gateway for access to all 1174+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Nato data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [All tools and guides](https://github.com/pipeworx-io/examples)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
