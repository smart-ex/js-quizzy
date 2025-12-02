'use client';

import { useMemo } from 'react';
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackConsole,
  SandpackPreview,
} from '@codesandbox/sandpack-react';

interface CodePlaygroundProps {
  code: string;
}

export function CodePlayground({ code }: CodePlaygroundProps) {
  // Create files object for Sandpack
  // Vanilla template expects /index.html and /index.js
  const files = useMemo(() => {
    return {
      '/index.html': `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Code Playground</title>
</head>
<body>
  <script type="module" src="/index.js"></script>
</body>
</html>`,
      '/index.js': code,
    };
  }, [code]);

  return (
    <div className="code-playground-wrapper">
      <SandpackProvider
        template="vanilla"
        files={files}
        theme="auto"
        options={{
          classes: {
            'sp-wrapper': 'sp-wrapper-custom',
            'sp-layout': 'sp-layout-custom',
            'sp-editor': 'sp-editor-custom',
            'sp-console': 'sp-console-custom',
          },
        }}
      >
        <SandpackLayout>
          <SandpackCodeEditor
            showLineNumbers={true}
            wrapContent={true}
          />
          <SandpackConsole
            showHeader={true}
            showResetConsoleButton={true}
            showRestartButton={true}
            resetOnPreviewRestart={false}
          />
          {/* Preview is required for code execution in vanilla template, but we hide it */}
          <div className="hidden-preview">
            <SandpackPreview />
          </div>
        </SandpackLayout>
      </SandpackProvider>
    </div>
  );
}

