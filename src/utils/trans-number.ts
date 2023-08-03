/**
 * 上下标数组
 */
const LIST = ['₀', '₁', '₂', '₃', '₄', '₅', '₆', '₇', '₈', '₉', '⁰', '¹', '²', '³', '⁴', '⁵', '⁶', '⁷', '⁸', '⁹'];

/**
 * 上下标转化关系
 */
function handleTransRelationship(key: string) {
    switch (key) {
        case '₀':
        case '⁰':
            return '0';
        case '₁':
        case '¹':
            return '1';
        case '₂':
        case '²':
            return '2';
        case '₃':
        case '³':
            return '3';
        case '₄':
        case '⁴':
            return '4';
        case '₅':
        case '⁵':
            return '5';
        case '₆':
        case '⁶':
            return '6';
        case '₇':
        case '⁷':
            return '7';
        case '₈':
        case '⁸':
            return '8';
        case '₉':
        case '⁹':
            return '9';
        default:
            return '';
    }
}

/**
 * 上下标转换函数
 */
export function handleTrans(name: string) {
    const arr: string[] = name.split('');

    for (let i = 0; i < arr.length; i++) {
        if (LIST.indexOf(arr[i]) !== -1) {
            arr[i] = handleTransRelationship(arr[i]);
        }
    }

    return arr.join('');
}
