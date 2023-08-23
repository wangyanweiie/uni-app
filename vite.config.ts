import { defineConfig } from 'vite';
import uni from '@dcloudio/vite-plugin-uni';
import path from 'path';
import uniHot from 'uni-pages-hot-modules';
import DefineOptions from 'unplugin-vue-define-options/vite';

uniHot.setupHotJs();

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [uni(), uniHot.createHotVitePlugin(), DefineOptions()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            '*': path.resolve(''),
        },
    },
});
