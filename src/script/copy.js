const fs = require('fs');

/**
 * 1. 命令行打包：uni build -p app
 * 2. copy
 * 3. as build
 * 4. upload minio
 */

// './dist/build/app',
fs.cp(
    './dist/resources/__UNI__A0E2751/www',

    // 拷贝到 as 指定目录
    // 'D:\\workspace\\AndroidStudioProjects\\xmart\\xilong-app-bundle-project\\simpleDemo\\src\\main\\assets\\apps\\__UNI__A0E2751\\www',
    'E:\\company\\All_APP\\xilong_app_bundle_project\\simpleDemo\\src\\main\\assets\\apps\\__UNI__A0E2751\\www',

    // 拷贝整个目录，包括子目录
    { recursive: true },

    (err) => {
        if (err) {
            console.error(err);
        }
    }
);
