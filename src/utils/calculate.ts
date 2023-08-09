/**
 * 在 JavaScript 计算数值的过程中，很容易遇到0.1+0.2!=0.3的问题，
 * 其原因是数值由十进制转成双精度浮点数的二进制过程中会出现精度丢失导致的，
 * 引用 decimal.js 库可以解决此类问题。
 */
import { Decimal } from 'decimal.js';

/**
 * 加法
 * @param _x
 * @param _y
 * @param precision 精度
 * @returns
 */
export function addition(_x: number, _y: string, precision?: number) {
    const x = new Decimal(_x).toNumber();
    const y = new Decimal(_y).toNumber();

    let res;

    if (precision) {
        res = Number((x + y).toFixed(precision));
    } else {
        res = x + y;
    }

    return res;
}

/**
 * 减法
 * @param _x
 * @param _y
 * @param precision 精度
 * @returns
 */
export function subtraction(_x: number, _y: string, precision?: number) {
    const x = new Decimal(_x).toNumber();
    const y = new Decimal(_y).toNumber();

    let res;

    if (precision) {
        res = Number((x - y).toFixed(precision));
    } else {
        res = x - y;
    }

    return res;
}

/**
 * 乘法
 * @param _x
 * @param _y
 * @param precision 精度
 * @returns
 */
export function multiplication(_x: number, _y: string, precision?: number) {
    const x = new Decimal(_x).toNumber();
    const y = new Decimal(_y).toNumber();

    let res;

    if (precision) {
        res = Number((x * y).toFixed(precision));
    } else {
        res = x * y;
    }

    return res;
}

/**
 * 除法
 * @param _x
 * @param _y
 * @param precision 精度
 * @returns
 */
export function division(_x: number, _y: string, precision?: number) {
    const x = new Decimal(_x).toNumber();
    const y = new Decimal(_y).toNumber();

    let res;

    if (precision) {
        res = Number((x / y).toFixed(precision));
    } else {
        res = x / y;
    }

    return res;
}
