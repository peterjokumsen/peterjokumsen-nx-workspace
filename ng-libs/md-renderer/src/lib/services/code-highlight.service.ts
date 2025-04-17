import { Injectable } from '@angular/core';
import hljs from 'highlight.js/lib/core';
import bash from 'highlight.js/lib/languages/bash';
import csharp from 'highlight.js/lib/languages/csharp';
import javascript from 'highlight.js/lib/languages/javascript';
import plaintext from 'highlight.js/lib/languages/plaintext';
import typescript from 'highlight.js/lib/languages/typescript';
import yaml from 'highlight.js/lib/languages/yaml';
import { MdComponentsModule } from '../md-components.module';
import { HighlightedCode } from '../models';

@Injectable({
  providedIn: MdComponentsModule,
})
export class CodeHighlightService {
  private readonly _allowed = [
    'bash',
    'csharp',
    'javascript',
    'plaintext',
    'typescript',
    'yaml',
  ];

  constructor() {
    hljs.registerLanguage('bash', bash);
    hljs.registerLanguage('csharp', csharp);
    hljs.registerLanguage('javascript', javascript);
    hljs.registerLanguage('plaintext', plaintext);
    hljs.registerLanguage('typescript', typescript);
    hljs.registerLanguage('yaml', yaml);
  }

  highlight(code: string | string[], language: string): HighlightedCode {
    code = Array.isArray(code) ? code.join('\n') : code;
    language = this._allowed.includes(language) ? language : 'plaintext';
    const resolved = hljs.highlight(code, { language });
    return {
      code: resolved.code ?? code,
      htmlCode: resolved.value,
      language: resolved.language ?? language,
    };
  }
}
