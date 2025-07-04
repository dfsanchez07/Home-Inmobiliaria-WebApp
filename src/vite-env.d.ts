/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_CONFIG_NOCODB_URL: string;
  readonly VITE_APP_CONFIG_NOCODB_API_KEY: string;
  readonly VITE_APP_CONFIG_NOCODB_DATABASE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
