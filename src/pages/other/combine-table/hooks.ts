import { cloneDeep } from 'lodash-es';

/**
 * 合并单元格
 * @param list 表格数据
 */
export function combineCell(ls: any[]) {
    const list = cloneDeep(ls);

    for (const field in list[0]) {
        let k = 0;
        let i = 0;

        while (k < list.length) {
            list[k][field + 'Span'] = 1;
            list[k][field + 'Dis'] = false;

            for (i = k + 1; i <= list.length - 1; i++) {
                // 相邻行字段值相同的话，则进行跨行合并处理
                if (list[k][field] == list[i][field] && list[k][field] != '') {
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
