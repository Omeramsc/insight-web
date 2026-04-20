import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

function isPlainObject(v) {
  return v !== null && typeof v === 'object' && !Array.isArray(v);
}

function deepMerge(base, over) {
  if (over === undefined) return base;
  if (Array.isArray(over)) return over;
  if (isPlainObject(over) && isPlainObject(base)) {
    const out = { ...base };
    for (const k of Object.keys(over)) {
      out[k] = deepMerge(base[k], over[k]);
    }
    return out;
  }
  return over;
}

const en = JSON.parse(fs.readFileSync(path.join(root, 'src/i18n/en.json'), 'utf8'));
const overrides = JSON.parse(fs.readFileSync(path.join(root, 'src/i18n/ja.overrides.json'), 'utf8'));
const ja = deepMerge(en, overrides);
fs.writeFileSync(path.join(root, 'src/i18n/ja.json'), JSON.stringify(ja, null, 2) + '\n', 'utf8');
