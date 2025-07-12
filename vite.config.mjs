
import { PrimeVueResolver } from '@primevue/auto-import-resolver';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import Components from 'unplugin-vue-components/vite';
import { defineConfig } from 'vite';


// https://vitejs.dev/config/
export default defineConfig({
    optimizeDeps: {
        noDiscovery: true,
        include: ['quill', 'lodash', 'nprogress', 'collect.js']
    },
    plugins: [
        vue(),
        Components({
            resolvers: [PrimeVueResolver()]
        })
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        }
    },
    publicPath: '/',
    server: {
        historyApiFallback: true,
        proxy: {
            '/auth': {
                target: 'https://api-maset-dev.sppapp.my.id',
                changeOrigin: true,
                secure: false,
            }
        }
    }
});
