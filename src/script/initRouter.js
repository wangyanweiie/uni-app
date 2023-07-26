module.exports = {
    easycom: {
        custom: {
            '^u-(.*)': 'uview-plus/components/u-$1/u-$1.vue',
            '^uni-(.*)': '@dcloudio/uni-ui/lib/uni-$1/uni-$1.vue',
        },
    },

    pages: [],

    tabBar: {
        color: '#7A7E83',
        selectedColor: '#2196f3',
        backgroundColor: '#fff',
        height: '50px',
        list: [
            {
                pagePath: 'pages/index/index',
                iconPath: 'static/product.png',
                text: '生产',
                selectedIconPath: 'static/product-active.png',
            },
            {
                pagePath: 'pages/setting/index',
                iconPath: 'static/setting.png',
                text: '设置',
                selectedIconPath: 'static/setting-active.png',
            },
        ],
    },

    globalStyle: {
        navigationBarTextStyle: 'black',
        navigationBarTitleText: 'uni-app',
        navigationBarBackgroundColor: '#F8F8F8',
        backgroundColor: '#F8F8F8',
    },
};
