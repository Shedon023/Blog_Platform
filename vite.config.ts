import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsConfigPathes from "vite-tsconfig-paths";

import { fileURLToPath } from "url";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tsConfigPathes()],
  resolve: {
    alias: [
      {
        find: "@",
        replacement: fileURLToPath(new URL("./src", import.meta.url)),
      },
    ],
  },
});
