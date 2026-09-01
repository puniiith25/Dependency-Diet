import JSZip from "jszip";

export const SAMPLE_PACKAGE_JSON = `{
  "name": "demo-saas-app",
  "version": "1.2.0",
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "axios": "^1.8.0",
    "lodash": "^4.17.21",
    "moment": "^2.30.1",
    "uuid": "^9.0.1",
    "eslint": "^9.0.0",
    "chalk": "^5.3.0",
    "clsx": "^2.1.0"
  },
  "devDependencies": {
    "vite": "^6.0.0",
    "prettier": "^3.2.5",
    "typescript": "^5.4.0",
    "@types/react": "^19.0.0"
  }
}`;

export const SAMPLE_PROJECT_FILES = {
  "package.json": SAMPLE_PACKAGE_JSON,
  "src/index.tsx": `import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import clsx from 'clsx';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
`,
  "src/App.tsx": `import React, { useState, useEffect } from 'react';
import { fetchUserProfile } from './api/user';
import { generateSessionId } from './utils/session';

export function App() {
  const [user, setUser] = useState(null);
  const [sessionId] = useState(() => generateSessionId());

  useEffect(() => {
    fetchUserProfile('usr_123').then(setUser);
  }, []);

  return (
    <div className="container">
      <h1>Welcome {user?.name || 'Guest'}</h1>
      <p>Session: {sessionId}</p>
    </div>
  );
}
`,
  "src/api/user.ts": `import axios from 'axios';

export async function fetchUserProfile(userId: string) {
  const response = await axios.get(\`/api/users/\${userId}\`);
  return response.data;
}

export async function updateUser(userId: string, data: any) {
  return axios.put(\`/api/users/\${userId}\`, data);
}
`,
  "src/utils/session.ts": `import { v4 as uuidv4 } from 'uuid';

export function generateSessionId(): string {
  return uuidv4();
}
`
};

/**
 * Creates a JSZip Blob representing the sample project for instant browser testing.
 */
export async function createSampleZipBlob() {
  const zip = new JSZip();
  for (const [path, content] of Object.entries(SAMPLE_PROJECT_FILES)) {
    zip.file(path, content);
  }
  return await zip.generateAsync({ type: "blob" });
}
