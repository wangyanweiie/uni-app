const fs = require('fs');

/**
 * 1. 命令行打包：uni build -p app
 * 2. copy
 * 3. as build
 * 4. upload minio
 */

fs.cp(
    './dist/resources/__UNI__E140D76/www',

    // 拷贝到 as 指定目录
    'E:\\Project\\android-app-bundle-project\\app\\src\\main\\assets\\apps\\__UNI__E140D76\\www',

    // 拷贝整个目录，包括子目录
    { recursive: true },

    err => {
        if (err) {
            console.error(err);
        }
    },
);
