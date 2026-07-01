interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
  meter?: { credits: number };
  cost?: Record<string, unknown>;
  provider?: string;
}

/**
 * Phonetic & Morse code MCP.
 *
 * Keyless, offline: spell text with the NATO phonetic alphabet (Alfa Bravo
 * Charlie…) and encode/decode Morse code. Useful for reading codes over the
 * phone/radio, accessibility, and puzzles. Pure lookup — no API, no key.
 */


const NATO: Record<string, string> = {
  a: 'Alfa', b: 'Bravo', c: 'Charlie', d: 'Delta', e: 'Echo', f: 'Foxtrot', g: 'Golf', h: 'Hotel',
  i: 'India', j: 'Juliett', k: 'Kilo', l: 'Lima', m: 'Mike', n: 'November', o: 'Oscar', p: 'Papa',
  q: 'Quebec', r: 'Romeo', s: 'Sierra', t: 'Tango', u: 'Uniform', v: 'Victor', w: 'Whiskey',
  x: 'X-ray', y: 'Yankee', z: 'Zulu',
  '0': 'Zero', '1': 'One', '2': 'Two', '3': 'Three', '4': 'Four', '5': 'Five', '6': 'Six', '7': 'Seven', '8': 'Eight', '9': 'Nine',
};

const MORSE: Record<string, string> = {
  a: '.-', b: '-...', c: '-.-.', d: '-..', e: '.', f: '..-.', g: '--.', h: '....', i: '..', j: '.---',
  k: '-.-', l: '.-..', m: '--', n: '-.', o: '---', p: '.--.', q: '--.-', r: '.-.', s: '...', t: '-',
  u: '..-', v: '...-', w: '.--', x: '-..-', y: '-.--', z: '--..',
  '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.',
  '.': '.-.-.-', ',': '--..--', '?': '..--..', "'": '.----.', '!': '-.-.--', '/': '-..-.', '(': '-.--.', ')': '-.--.-',
  '&': '.-...', ':': '---...', ';': '-.-.-.', '=': '-...-', '+': '.-.-.', '-': '-....-', '_': '..--.-', '"': '.-..-.', '@': '.--.-.',
};
const MORSE_REV: Record<string, string> = {};
for (const [k, v] of Object.entries(MORSE)) MORSE_REV[v] = k;

const tools: McpToolExport['tools'] = [
  {
    name: 'spell_nato',
    description: 'Spell text using the NATO phonetic alphabet (A -> "Alfa", B -> "Bravo"…). Great for reading codes/confirmation numbers aloud. Keyless, offline.',
    inputSchema: { type: 'object', properties: { text: { type: 'string', description: 'The text to spell.' } }, required: ['text'] },
  },
  {
    name: 'morse_encode',
    description: 'Encode text to Morse code (letters separated by spaces, words by " / "). Keyless, offline.',
    inputSchema: { type: 'object', properties: { text: { type: 'string', description: 'The text to encode.' } }, required: ['text'] },
  },
  {
    name: 'morse_decode',
    description: 'Decode Morse code back to text. Accepts letters separated by spaces and words by "/" or "  " (double space). Keyless, offline.',
    inputSchema: { type: 'object', properties: { morse: { type: 'string', description: 'Morse code, e.g. ".... .. / - .... . .-. ."' } }, required: ['morse'] },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'spell_nato': {
      const text = reqStr(args, 'text', '"AB12"');
      const words = [...text.toLowerCase()].map((ch) => (NATO[ch] ?? (ch === ' ' ? '(space)' : ch)));
      return { input: text, phonetic: words.join(' '), per_char: [...text].map((ch, i) => ({ char: ch, word: NATO[ch.toLowerCase()] ?? null })) };
    }
    case 'morse_encode': {
      const text = reqStr(args, 'text', '"SOS"');
      const out = text.toLowerCase().split(/\s+/).map((word) => [...word].map((ch) => MORSE[ch] ?? '').filter(Boolean).join(' ')).filter(Boolean).join(' / ');
      return { input: text, morse: out };
    }
    case 'morse_decode': {
      const morse = reqStr(args, 'morse', '"... --- ..."').trim();
      const words = morse.split(/\s*\/\s*|\s{2,}/).map((word) => word.trim().split(/\s+/).map((c) => MORSE_REV[c] ?? '').join(''));
      return { input: morse, text: words.join(' ').trim() };
    }
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

function reqStr(args: Record<string, unknown>, key: string, ex: string): string {
  const v = args[key];
  if (typeof v !== 'string' || !v.length) throw new Error(`Required argument "${key}" is missing. Pass a string like ${ex}.`);
  return v;
}

export default { tools, callTool, meter: { credits: 1 } } satisfies McpToolExport;
