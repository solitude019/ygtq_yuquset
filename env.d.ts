/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, unknown>;
  export default component;
}

declare module '@vitejs/plugin-vue' {
  import type { PluginOption } from 'vite';
  export default function vue(options?: Record<string, unknown>): PluginOption;
}
