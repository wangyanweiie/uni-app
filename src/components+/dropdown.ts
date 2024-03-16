import type { Ref } from 'vue';
import type { Numeric } from 'src/constant/base';

/**
 * 下拉菜单 PROVIDE/INJECT KEY
 */
export const DROPDOWN_MENU = Symbol('dropdown-menu');

/**
 * DROPDOWN PROVIDE
 */
export interface DropdownMenuProvider {
    activeChildId: Ref<number>;
    addChild: (id?: number) => void;
}

/**
 * 下拉数据
 */
export interface DropdownItem {
    label?: string;
    value?: Numeric;
    disabled?: boolean;
}
