/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SERVER_URL: string;
  readonly VITE_APP_I18N_CONFIG_KEY: string;
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_ADMIN_USER_EMAIL: string;
  readonly VITE_ADMIN_USER_PASS: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
