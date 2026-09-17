import type { HLJSApi, Language, LanguageFn, Mode } from 'highlight.js';
import highlighter from 'highlight.js/lib/core';
import bash from 'highlight.js/lib/languages/bash';
import css from 'highlight.js/lib/languages/css';
import html from 'highlight.js/lib/languages/xml';
import json from 'highlight.js/lib/languages/json';
import plaintext from 'highlight.js/lib/languages/plaintext';
import typescript from 'highlight.js/lib/languages/typescript';

export type CodeLanguage = 'bash' | 'css' | 'html' | 'json' | 'text' | 'typescript';

const angularHtml: LanguageFn = (api: HLJSApi): Language => {
  const language: Language = html(api);
  const interpolation: Mode = { scope: 'template-variable', begin: /\{\{/, end: /\}\}/ };
  const controlFlow: Mode = {
    scope: 'keyword',
    begin: /@(case|default|defer|else|empty|error|for|if|let|loading|placeholder|switch)\b/,
  };

  return { ...language, name: 'Angular HTML', contains: [interpolation, controlFlow, ...language.contains] };
};

highlighter.registerLanguage('html', angularHtml);
highlighter.registerLanguage('json', json);
highlighter.registerLanguage('bash', bash);
highlighter.registerLanguage('css', css);
highlighter.registerLanguage('text', plaintext);
highlighter.registerLanguage('typescript', typescript);

export const highlightLines: (source: string, language: CodeLanguage) => readonly string[] = (
  source: string,
  language: CodeLanguage,
): readonly string[] => {
  const normalized: string = source.replaceAll('\r\n', '\n').trim();
  const highlighted: string = highlighter.highlight(normalized, { language, ignoreIllegals: true }).value;
  return splitLines(highlighted);
};

const splitLines: (source: string) => readonly string[] = (source: string): readonly string[] => {
  const lines: string[] = [''];
  const spans: string[] = [];
  const tokens: readonly string[] = source.split(/(<span class="[^"]+">|<\/span>|\n)/);

  tokens.forEach((token: string): void => {
    if (token === '\n') {
      lines[lines.length - 1] += '</span>'.repeat(spans.length);
      lines.push(spans.join(''));
      return;
    }

    if (token.startsWith('<span ')) spans.push(token);
    if (token === '</span>') spans.pop();
    lines[lines.length - 1] += token;
  });

  return lines;
};
