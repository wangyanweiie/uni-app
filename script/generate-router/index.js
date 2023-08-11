const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');

/**
 * 记录修改文件的次数
 */
let count = 0;

/**
 * 需要重写 pages.json 的路径
 */
const writePath = path.join(__dirname, '../../src/pages.json');

/**
 * 路由文件夹路径
 */
const routerPath = path.join(__dirname, '../../src/router');

/**
 * @description 读取 router 下的所有路由文件
 * @param {string} url router 文件夹的路径
 * @return urlObj 路由文件路径对象
 */
const readDir = url => {
    // 将 router 文件夹下的文件生成列表
    const fileList = fs.readdirSync(url);
    console.log('路由文件 => ' + fileList);

    const urlObj = {};

    fileList.map(item => {
        // 获取每一个路由文件的路径
        const location = path.join(url, item);
        console.log('路由文件路径 => ' + location);

        // 将路由文件路径作为 key value 生成对象
        urlObj[location] = location;
    });

    return urlObj;
};

/**
 * 路由文件路径对象
 */
const fileUrlObj = readDir(routerPath);

/**
 * 监听所有路由文件
 */
chokidar.watch(routerPath).on('all', (event, path) => {
    // 路由文件路径对象中删除该路由文件路径、更新 pages.json
    if (event === 'unlink') {
        delete fileUrlObj[path];
        handleUpdateRouter(routerPath);
        return;
    }

    // 新增路由文件，路由文件路径对象中添加该路由文件路径，不需要更新 pages.json
    if (event === 'add') {
        fileUrlObj[path] = path;
        return;
    }

    // 路由文件保存，更新 pages.json
    if (event === 'change') {
        handleUpdateRouter(routerPath);
    }
});

/**
 * @description 重写 pages.json
 * @param {string} url router 文件夹的路径
 * @return void
 */
const handleUpdateRouter = url => {
    // 将 router 文件夹下的文件生成列表
    const fileList = fs.readdirSync(url);

    // 存放所有路由文件的路径
    const fileUrlList = [];

    fileList.map(item => {
        const location = path.join(url, item);

        // node 会缓存模块，需要清除缓存，以获取最新的文件内容
        delete require.cache[require.resolve(location)];

        if (fileUrlObj[location]) {
            fileUrlList.push(...require(fileUrlObj[location]));
        }
    });

    // 需要将登录页路由放在所有路由的第一项，因为重写 pages.json 后会丢失 uni-app 的页面缓存
    let loginRouterIndex = 0;
    let loginRouter = {};

    fileUrlList.forEach((item, index) => {
        if (item.style.navigationBarTitleText === '登录') {
            loginRouter = item;
            loginRouterIndex = index;
        }
    });

    fileUrlList.splice(loginRouterIndex, 1);
    fileUrlList.unshift(loginRouter);
    console.log('fileUrlList => ' + fileUrlList);

    // 从 router.js 中获取默认配置
    const routerConfig = require('./base-router.js');

    // 更新 routerConfig 中的 pages
    routerConfig.pages = fileUrlList;

    count++;

    // 重写 src 目录下的 pages.json 文件
    fs.writeFile(writePath, JSON.stringify(routerConfig, null, '  '), err =>
        err ? console.error(err) : console.log(`路由修改成功，修改次数为${count}`),
    );
};
