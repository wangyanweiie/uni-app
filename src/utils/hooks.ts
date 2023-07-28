import type { Options } from '@/interface/select';

/**
 * 1.合并单元格 demo
 */
export function combineCell(list: any) {
    for (const field in list[0]) {
        let k = 0;
        let i = 0;

        while (k < list.length) {
            list[k][field + 'Span'] = 1;
            list[k][field + 'Dis'] = false;

            for (i = k + 1; i <= list.length - 1; i++) {
                // 相邻行字段值相同的话，则进行跨行合并处理 ==> 只根据容积合并
                // if (list[k][field] == list[i][field] && list[k][field] != '') {
                if (list[k]['volume'] == list[i]['volume'] && list[k]['volume'] != '') {
                    list[k][field + 'Span']++;
                    list[k][field + 'Dis'] = false;
                    list[i][field + 'Span'] = 1;
                    list[i][field + 'Dis'] = true;
                } else {
                    break;
                }
            }

            k = i;
        }
    }

    return list;
}

/**
 * 2.将枚举转换为 options
 */
export function transformEnumToOptions(enumeration: Record<string, string | number>): Options[] {
    const list = Object.entries(enumeration);

    return list
        .map(([label, value]) => {
            return {
                label,
                value: value as number,
            };
        })
        .slice(list.length / 2);
}
