/**
 * Backend entry point – starts the server.
 *
 * Reference: .cursor/rules/architecture.md (Infrastructure section)
 */

import { createApp } from './app';

const app = createApp();
const PORT = process.env.PORT ?? 3000;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
