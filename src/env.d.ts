/// <reference types="vite/client" />

declare module '*.vue' {
    import { DefineComponent } from 'vue';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
    const component: DefineComponent<{}, {}, any>;
    export default component;
}

declare module 'uview-plus';
declare module 'lodash-es';
declare module '@vueuse/core';
declare module 'uni-pages-hot-modules';
declare module 'image-tools';

declare module 'uview-plus' {
    global {
        interface Uni {
            $u: $u;
        }
    }
}
