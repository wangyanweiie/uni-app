/**
 * 强制保留小数位方法
 * @param value 要处理的数据
 * @param precision 小数位数
 */
export function keepDecimalPrecision(value: number, precision: number) {
    if (value === null) {
        return value;
    }
    // 将数字转换为字符串
    let res = String(value);

    // 小数点的索引值
    let posDecimalIndex = res.indexOf('.');

    // 当整数，即 posDecimalIndex = -1 时，拼接小数点
    if (posDecimalIndex === -1) {
        posDecimalIndex = res.length;
        res += '.';
    }

    // 当数字的长度 < 小数点索引 + precision 时，用 0 补全
    while (res.length <= posDecimalIndex + precision) {
        res += '0';
    }

    return res;
}
