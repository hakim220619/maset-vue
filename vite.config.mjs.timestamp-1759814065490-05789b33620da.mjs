// vite.config.mjs
import { PrimeVueResolver } from "file:///D:/project/maset/maset-vue/node_modules/@primevue/auto-import-resolver/index.mjs";
import vue from "file:///D:/project/maset/maset-vue/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import path from "path";
import Components from "file:///D:/project/maset/maset-vue/node_modules/unplugin-vue-components/dist/vite.js";
import { defineConfig } from "file:///D:/project/maset/maset-vue/node_modules/vite/dist/node/index.js";
var __vite_injected_original_dirname = "D:\\project\\maset\\maset-vue";
var vite_config_default = defineConfig({
  optimizeDeps: {
    noDiscovery: true,
    include: ["quill", "lodash", "nprogress", "collect.js"]
  },
  plugins: [
    vue(),
    Components({
      resolvers: [PrimeVueResolver()]
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    }
  },
  publicPath: "/",
  server: {
    historyApiFallback: true,
    proxy: {
      "/auth": {
        target: "https://api-maset-dev.sppapp.my.id",
        changeOrigin: true,
        secure: false
      }
    },
    allowedHosts: ["localhost", "lpp.local"]
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcubWpzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiRDpcXFxccHJvamVjdFxcXFxtYXNldFxcXFxtYXNldC12dWVcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXHByb2plY3RcXFxcbWFzZXRcXFxcbWFzZXQtdnVlXFxcXHZpdGUuY29uZmlnLm1qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovcHJvamVjdC9tYXNldC9tYXNldC12dWUvdml0ZS5jb25maWcubWpzXCI7XHJcbmltcG9ydCB7IFByaW1lVnVlUmVzb2x2ZXIgfSBmcm9tICdAcHJpbWV2dWUvYXV0by1pbXBvcnQtcmVzb2x2ZXInO1xyXG5pbXBvcnQgdnVlIGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZSc7XHJcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xyXG5pbXBvcnQgQ29tcG9uZW50cyBmcm9tICd1bnBsdWdpbi12dWUtY29tcG9uZW50cy92aXRlJztcclxuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XHJcblxyXG5cclxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICAgIG9wdGltaXplRGVwczoge1xyXG4gICAgICAgIG5vRGlzY292ZXJ5OiB0cnVlLFxyXG4gICAgICAgIGluY2x1ZGU6IFsncXVpbGwnLCAnbG9kYXNoJywgJ25wcm9ncmVzcycsICdjb2xsZWN0LmpzJ11cclxuICAgIH0sXHJcbiAgICBwbHVnaW5zOiBbXHJcbiAgICAgICAgdnVlKCksXHJcbiAgICAgICAgQ29tcG9uZW50cyh7XHJcbiAgICAgICAgICAgIHJlc29sdmVyczogW1ByaW1lVnVlUmVzb2x2ZXIoKV1cclxuICAgICAgICB9KVxyXG4gICAgXSxcclxuICAgIHJlc29sdmU6IHtcclxuICAgICAgICBhbGlhczoge1xyXG4gICAgICAgICAgICAnQCc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuL3NyYycpLFxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBwdWJsaWNQYXRoOiAnLycsXHJcbiAgICBzZXJ2ZXI6IHtcclxuICAgICAgICBoaXN0b3J5QXBpRmFsbGJhY2s6IHRydWUsXHJcbiAgICAgICAgcHJveHk6IHtcclxuICAgICAgICAgICAgJy9hdXRoJzoge1xyXG4gICAgICAgICAgICAgICAgdGFyZ2V0OiAnaHR0cHM6Ly9hcGktbWFzZXQtZGV2LnNwcGFwcC5teS5pZCcsXHJcbiAgICAgICAgICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXHJcbiAgICAgICAgICAgICAgICBzZWN1cmU6IGZhbHNlLFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBhbGxvd2VkSG9zdHM6IFsnbG9jYWxob3N0JywgJ2xwcC5sb2NhbCddXHJcbiAgICB9XHJcbn0pO1xyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQ0EsU0FBUyx3QkFBd0I7QUFDakMsT0FBTyxTQUFTO0FBQ2hCLE9BQU8sVUFBVTtBQUNqQixPQUFPLGdCQUFnQjtBQUN2QixTQUFTLG9CQUFvQjtBQUw3QixJQUFNLG1DQUFtQztBQVN6QyxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUN4QixjQUFjO0FBQUEsSUFDVixhQUFhO0FBQUEsSUFDYixTQUFTLENBQUMsU0FBUyxVQUFVLGFBQWEsWUFBWTtBQUFBLEVBQzFEO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDTCxJQUFJO0FBQUEsSUFDSixXQUFXO0FBQUEsTUFDUCxXQUFXLENBQUMsaUJBQWlCLENBQUM7QUFBQSxJQUNsQyxDQUFDO0FBQUEsRUFDTDtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ0wsT0FBTztBQUFBLE1BQ0gsS0FBSyxLQUFLLFFBQVEsa0NBQVcsT0FBTztBQUFBLElBQ3hDO0FBQUEsRUFDSjtBQUFBLEVBQ0EsWUFBWTtBQUFBLEVBQ1osUUFBUTtBQUFBLElBQ0osb0JBQW9CO0FBQUEsSUFDcEIsT0FBTztBQUFBLE1BQ0gsU0FBUztBQUFBLFFBQ0wsUUFBUTtBQUFBLFFBQ1IsY0FBYztBQUFBLFFBQ2QsUUFBUTtBQUFBLE1BQ1o7QUFBQSxJQUNKO0FBQUEsSUFDQSxjQUFjLENBQUMsYUFBYSxXQUFXO0FBQUEsRUFDM0M7QUFDSixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
