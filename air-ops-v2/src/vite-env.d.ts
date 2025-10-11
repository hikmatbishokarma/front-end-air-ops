/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BASE_URL: string;
  readonly VITE_GRAPHQL_API_URL: string;
  readonly VITE_REST_API_URL: string;
  readonly VITE_API_BASE_URL: string;
  readonly VITE_CLOUDFRONT_BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// vite-env.d.ts or global.d.ts (in src or root folder)
declare module "pdfjs-dist/build/pdf.worker?worker" {
  const worker: new () => Worker;
  export default worker;
}
