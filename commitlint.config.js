module.exports = {
    // 继承的规则
    extends: ['@commitlint/config-conventional'],

    /**
     ** commit message 格式
     * <type>(<scope>): <subject>
     * 空一行
     * <body>
     * 空一行
     * <footer>
     *
     ** rules => 对象，每一个 key/value 对就是一条配置规则，这里的规则将会覆盖 extends 里指定的插件里的规则
     * 1.每一条规则的值都是一个元组数组，或是同步/异步返回一个元组数组的函数
     * 2.规则元组数组的第一个元素表示错误等级 (level)，取值为 0 | 1 | 2
     *   - 0: 禁用这条规则
     *   - 1: 触发这条规则时 warning 提示
     *   - 2: 触发这条规则时 error 提示
     * 3.规则元组数组的第二个元素表示触发方式，取值为 always | never
     *   - always: 违背这条规则时，则根据 (level) 进行提示
     *   - never: 满足这条规则时，则根据 (level) 进行提示
     * 4.规则元组数组的第三个元素表示这条规则允许的值，具体视每条规则而定
     *
     */
    rules: {
        // type 是否允许为空
        'type-empty': [2, 'never'],
        // type 英文单词允许的风格
        'type-case': [
            2,
            'always',
            [
                'lower-case', // default
                'upper-case', // UPPERCASE
            ],
        ],
        // type 只允许在列出的枚举值中
        'type-enum': [
            2,
            'always',
            [
                'feat', // 新功能 feature
                'fix', // 修复
                'docs', // 文档注释
                'style', // 代码格式(不影响代码运行的变动)
                'refactor', // 重构(既不增加新功能，也不是修复bug)
                'perf', // 性能优化
                'test', // 增加测试
                'chore', // 构建过程或辅助工具的变动
                'revert', // 回退
                'build', // 打包
            ],
        ],

        // scope 是否允许为空
        // 'scope-empty': [2, 'never'],
        // scope 只允许在列出的枚举值中
        // 'scope-enum': [2, 'always', ['uni-app', 'vue-app', 'react-app']],

        // subject 是否允许为空？
        'subject-empty': [2, 'never'],
        // subject 最小长度
        'subject-min-length': [2, 'always', 2],
        // subject 最大长度
        'subject-max-length': [2, 'always', 20],
        // subject 英文单词允许的风格
        'subject-case': [
            2,
            'always',
            [
                'lower-case', // default
                'upper-case', // UPPERCASE
                'camel-case', // camelCase
                'pascal-case', // PascalCase
                'kebab-case', // kebab-case
                'snake-case', // snake_case
                'sentence-case', // Sentence case
                'start-case', // Start Case
            ],
        ],
    },
};
