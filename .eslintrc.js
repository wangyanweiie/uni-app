module.exports = {
    root: true,
    env: {
        node: true,
    },
    // 所有文件的入口解析器
    parser: 'vue-eslint-parser',
    extends: [
        // vue 组件特有的规则
        'plugin:vue/vue3-recommended',
        // ts推荐的规则
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended',
        '@vue/typescript/recommended',
        // 关闭与 prettier 冲突的规则，prettier 接管代码风格
        'eslint-config-prettier',
    ],
    parserOptions: {
        // ts 解析器
        parser: '@typescript-eslint/parser',
        // 最新语法
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    rules: {
        /**
         * 'off' <==> 0
         * 'warn' <==> 1
         * 'error' <==> 2
         */
        'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'prettier/prettier': 'error',
        'vue/component-name-in-template-casing': ['error', 'kebab-case'],
        // 组件名称以驼峰格式命名
        'vue/multi-word-component-names': 'off',
        // 不要重复引入一个模块
        'no-duplicate-imports': 'error',
        // 声明但未使用的变量
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': ['off'],
        // any
        '@typescript-eslint/no-explicit-any': ['off'],
        // this
        '@typescript-eslint/no-this-alias': [
            'error',
            {
                allowDestructuring: false,
                allowedNames: ['that', '_this'],
            },
        ],
        // 箭头函数
        'arrow-parens': [
            'error',
            'as-needed',
            {
                requireForBlockBody: false,
            },
        ],
    },
};
