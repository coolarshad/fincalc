// Runs calculators/static/js/calculator-engine.js against page HTML read from a
// JSON job list on stdin: [{name, html, inputs: {id: value}}]. Prints JSON results.
// Minimal DOM: only what the engine uses (ids, value, textContent, innerHTML, style).
import fs from 'node:fs';
import vm from 'node:vm';

const engine = fs.readFileSync(new URL('../calculators/static/js/calculator-engine.js', import.meta.url), 'utf8');
const jobs = JSON.parse(fs.readFileSync(0, 'utf8'));
const attr = (tag, n) => (tag.match(new RegExp(`\\b${n}="([^"]*)"`)) || [])[1];

const run = ({ name, html, inputs = {} }) => {
  const els = {};
  const make = (id, value) => ({ id, value, textContent: undefined, innerHTML: undefined, style: {}, addEventListener() {}, querySelector: () => null, classList: { add() {}, remove() {}, toggle() {} }, setAttribute() {}, getAttribute: () => null });
  for (const m of html.matchAll(/<([a-z0-9]+)\b[^>]*\bid="([^"]+)"[^>]*>/g)) els[m[2]] = make(m[2], m[1] === 'input' ? attr(m[0], 'value') ?? '' : undefined);
  for (const m of html.matchAll(/<select\b[^>]*\bid="([^"]+)"[^>]*>([\s\S]*?)<\/select>/g)) {
    const opts = [...m[2].matchAll(/<option\b[^>]*>/g)].map((o) => o[0]);
    els[m[1]].value = attr(opts.find((o) => /\bselected\b/.test(o)) || opts[0] || '', 'value');
  }
  const unknown = Object.keys(inputs).filter((k) => !els[k]);
  for (const [k, v] of Object.entries(inputs)) if (els[k]) els[k].value = String(v);
  const missing = new Set();
  let ready;
  const workspace = html.match(/<[^>]*data-calculator-type="[^"]*"[^>]*>/)[0];
  const type = attr(workspace, 'data-calculator-type');
  const document = {
    getElementById: (id) => { if (!els[id]) missing.add(id); return els[id] || null; },
    querySelector: () => ({ getAttribute: (n) => attr(workspace, n) ?? null }),
    querySelectorAll: () => [],
    addEventListener: (_, fn) => { ready = fn; },
  };
  let error = null;
  try { vm.runInNewContext(engine, { document, window: {}, console, Intl, Date }); ready(); } catch (e) { error = String(e); }
  const text = {}, htmlOut = {};
  for (const e of Object.values(els)) {
    if (e.textContent !== undefined) text[e.id] = String(e.textContent);
    if (e.innerHTML !== undefined) htmlOut[e.id] = e.innerHTML.replace(/\s+/g, ' ').trim();
  }
  return { name, type, text, html: htmlOut, error, unknown, missing: [...missing] };
};
console.log(JSON.stringify(jobs.map(run)));
