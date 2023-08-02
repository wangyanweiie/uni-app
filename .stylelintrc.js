module.exports = {
    plugins: ['@namics/stylelint-bem'],
    extends: [
        'stylelint-config-standard',
        'stylelint-config-standard-scss',
        'stylelint-config-recess-order',
        'stylelint-config-recommended-vue',
    ],
    rules: {
        indentation: [4, {}],
        'string-quotes': 'single',
        // bem
        'plugin/stylelint-bem-namics': {
            patternPrefixes: [],
            helperPrefixes: [],
        },
        'selector-pseudo-class-no-unknown': [
            true,
            {
                ignorePseudoClasses: ['deep'],
            },
        ],
        'scss/dollar-variable-pattern': null,
        'selector-class-pattern':
            '^(?:(?:o|c|u|t|s|is|has|_|js|qa)-)?[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*(?:__[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*)?(?:--[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*)?(?:\\[.+\\])?$',
        'alpha-value-notation': null,
        'declaration-block-no-duplicate-properties': [
            true,
            {
                ignore: ['consecutive-duplicates-with-different-values'],
            },
        ],
    },
};
