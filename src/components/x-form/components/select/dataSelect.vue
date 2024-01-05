<template>
    <view class="uni-stat__select">
        <span v-if="label" class="uni-label-text hide-on-phone">{{ label + '：' }}</span>
        <view class="uni-stat-box" :class="{ 'uni-stat__active': current }">
            <view class="uni-select" :class="{ 'uni-select--disabled': disabled }">
                <view class="uni-select__input-box" @click="toggleSelector">
                    <!-- <input
                        v-model="current"
                        class="uni-select__input-text"
                        :style="{ fontSize: '14px' }"
                        :placeholder="typePlaceholder"
                        @input="handleFuzzySearch"
                    />
                    <uni-icons v-if="current && clear" type="clear" color="#C6C7CB" size="44rpx" @click="clearVal" />
                    <uni-icons v-else :type="showSelector ? 'top' : 'bottom'" size="28rpx" color="#999" /> -->

                    <u-input
                        v-model="current"
                        border="none"
                        class="uni-select__input-text"
                        :style="{ fontSize: '14px' }"
                        :placeholder="typePlaceholder"
                        :disabled="disabled"
                        @change="handleFuzzySearch"
                    ></u-input>

                    <view v-if="current && clear" @click.stop="clearVal">
                        <u-icon name="close-circle-fill" color="#C6C7CB" size="40rpx"></u-icon>
                    </view>
                    <view v-else>
                        <u-icon :name="showSelector ? 'arrow-up' : 'arrow-down'" color="#C6C7CB" size="20rpx"></u-icon>
                    </view>
                </view>

                <view v-if="showSelector" class="uni-select--mask" @click="toggleSelector" />
                <view v-if="showSelector" class="uni-select__selector">
                    <view class="uni-popper__arrow"></view>
                    <scroll-view scroll-y="true" class="uni-select__selector-scroll">
                        <view v-if="mixinDatacomResData.length === 0" class="uni-select__selector-empty">
                            <text>{{ emptyTips }}</text>
                        </view>
                        <view
                            v-for="(item, index) in mixinDatacomResData"
                            v-else
                            :key="index"
                            class="uni-select__selector-item"
                            @click="change(item)"
                        >
                            <text
                                :class="{ 'uni-select__selector__disabled': item.disable }"
                                :style="{
                                    width: '100%',
                                    whiteSpace: 'nowrap',
                                    overflow: 'auto',
                                }"
                            >
                                {{ formatItemName(item) }}
                            </text>
                        </view>
                    </scroll-view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
import _ from 'lodash-es';

/**
 * DataChecklist 数据选择器
 * @description 通过数据渲染的下拉框组件
 * @tutorial https://uniapp.dcloud.io/component/uniui/uni-data-select
 * @property {String} value 默认值
 * @property {Array} localdata 本地数据 ，格式 [{text:'',value:''}]
 * @property {Boolean} clear 是否可以清空已选项
 * @property {Boolean} emptyText 没有数据时显示的文字 ，本地数据无效
 * @property {String} label 左侧标题
 * @property {String} placeholder 输入框的提示文字
 * @property {Boolean} disabled 是否禁用
 * @event {Function} change  选中发生变化触发
 */
export default {
    name: 'DataSelect',
    mixins: [uniCloud.mixinDatacom || {}],
    props: {
        localdata: {
            type: Array,
            default() {
                return [];
            },
        },
        value: {
            type: [String, Number],
            default: '',
        },
        modelValue: {
            type: [String, Number],
            default: '',
        },
        label: {
            type: String,
            default: '',
        },
        placeholder: {
            type: String,
            default: '请选择',
        },
        emptyTips: {
            type: String,
            default: '无选项',
        },
        clear: {
            type: Boolean,
            default: false,
        },
        defItem: {
            type: Number,
            default: 0,
        },
        disabled: {
            type: Boolean,
            default: false,
        },
        // 格式化输出 用法 field="_id as value, version as text, uni_platform as label" format="{label} - {text}"
        format: {
            type: String,
            default: '',
        },
    },
    emits: ['change', 'input', 'update:modelValue'],

    data() {
        return {
            showSelector: false,
            current: '',
            mixinDatacomResData: [],
            apps: [],
            channels: [],
        };
    },

    computed: {
        typePlaceholder() {
            const text = {
                'opendb-stat-app-versions': '版本',
                'opendb-app-channels': '渠道',
                'opendb-app-list': '应用',
            };
            const common = this.placeholder;
            const placeholder = text[this.collection];
            return placeholder ? common + placeholder : common;
        },
    },

    watch: {
        localdata: {
            immediate: true,
            handler(val, old) {
                if (Array.isArray(val) && old !== val) {
                    this.mixinDatacomResData = _.cloneDeep(val);

                    // 应该只在选项列表变化的时候反显，后续通过 click 主动更新反显
                    this.initDefVal();
                }
            },
        },
    },

    created() {
        this.last = `${this.collection}_last_selected_option_value`;
        if (this.collection && !this.localdata.length) {
            this.query();
        }
    },

    methods: {
        /**
         * 执行数据库查询
         */
        query() {
            this.mixinDatacomEasyGet();
        },

        /**
         * 监听查询条件变更事件
         */
        onMixinDatacomPropsChange() {
            if (this.collection) {
                this.query();
            }
        },

        initDefVal() {
            let defValue = '';
            if ((this.value || this.value === 0) && !this.isDisabled(this.value)) {
                defValue = this.value;
            } else if ((this.modelValue || this.modelValue === 0) && !this.isDisabled(this.modelValue)) {
                defValue = this.modelValue;
            } else {
                let storageValue;
                if (this.collection) {
                    storageValue = uni.getStorageSync(this.last);
                }
                if (storageValue || storageValue === 0) {
                    defValue = storageValue;
                } else {
                    let defItem = '';
                    if (this.defItem > 0 && this.defItem <= this.mixinDatacomResData.length) {
                        defItem = this.mixinDatacomResData[this.defItem - 1].value;
                    }
                    defValue = defItem;
                }
                if (defValue || defValue === 0) {
                    this.emit(defValue);
                }
            }
            const def = this.mixinDatacomResData.find(item => item.value === defValue);
            this.current = def ? this.formatItemName(def) : '';
        },

        /**
         * @param {[String, Number]} value
         * 判断用户给的 value 是否同时为禁用状态
         */
        isDisabled(value) {
            let isDisabled = false;

            this.mixinDatacomResData.forEach(item => {
                if (item.value === value) {
                    isDisabled = item.disable;
                }
            });

            return isDisabled;
        },

        clearVal() {
            this.emit('');
            if (this.collection) {
                uni.removeStorageSync(this.last);
            }

            this.current = '';
            this.mixinDatacomResData = _.cloneDeep(this.localdata);
        },

        change(item) {
            if (!item.disable) {
                this.showSelector = false;
                this.current = this.formatItemName(item);
                this.emit(item.value);
            }
        },

        emit(val) {
            this.$emit('change', val);
            this.$emit('input', val);
            this.$emit('update:modelValue', val);

            if (this.collection) {
                uni.setStorageSync(this.last, val);
            }
        },

        toggleSelector() {
            if (this.disabled) {
                return;
            }

            this.showSelector = !this.showSelector;

            this.mixinDatacomResData = [];
            this.mixinDatacomResData = _.cloneDeep(this.localdata);
        },

        formatItemName(item) {
            const { label, value } = item;
            let { channel_code } = item;
            channel_code = channel_code ? `(${channel_code})` : '';

            if (this.format) {
                // 格式化输出
                let str = '';
                str = this.format;
                for (const key in item) {
                    str = str.replace(new RegExp(`{${key}}`, 'g'), item[key]);
                }
                return str;
            } else {
                return this.collection.indexOf('app-list') > 0
                    ? `${label}(${value})`
                    : label
                      ? label
                      : `未命名${channel_code}`;
            }
        },

        /**
         * 模糊查询
         */
        handleFuzzySearch() {
            this.mixinDatacomResData = [];
            this.mixinDatacomResData = this.localdata.filter(item => item.label.indexOf(this.current) !== -1);
        },
    },
};
</script>

<style lang="scss" scoped>
$uni-base-color: #6a6a6a !default;
$uni-main-color: #333 !default;
$uni-secondary-color: #909399 !default;
$uni-border-3: #e5e5e5;

/* #ifndef APP-NVUE */
@media screen and (max-width: 500px) {
    .hide-on-phone {
        display: none;
    }
}

/* #endif */
.uni-stat__select {
    display: flex;
    align-items: center;
    // padding: 15px;
    cursor: pointer;
    width: 100%;
    flex: 1;
    box-sizing: border-box;
}

.uni-stat-box {
    width: 100%;
    flex: 1;
}

.uni-stat__active {
    width: 100%;
    flex: 1;
    // outline: 1px solid #2979ff;
}

.uni-label-text {
    font-size: 14px;
    font-weight: bold;
    color: $uni-base-color;
    margin: auto 0;
    margin-right: 5px;
}

.uni-select {
    font-size: 14px;
    border: 1px solid $uni-border-3;
    box-sizing: border-box;
    border-radius: 4px;
    padding: 0 5px;
    padding-left: 10px;
    position: relative;
    /* #ifndef APP-NVUE */
    display: flex;
    user-select: none;
    /* #endif */
    flex-direction: row;
    align-items: center;
    border-bottom: solid 1px $uni-border-3;
    width: 100%;
    flex: 1;
    height: 35px;

    &--disabled {
        background-color: #f5f7fa;
        cursor: not-allowed;
    }
}

.uni-select__label {
    font-size: 16px;
    // line-height: 22px;
    height: 35px;
    padding-right: 10px;
    color: $uni-secondary-color;
}

.uni-select__input-box {
    height: 35px;
    position: relative;
    /* #ifndef APP-NVUE */
    display: flex;
    /* #endif */
    flex: 1;
    flex-direction: row;
    align-items: center;
}

.uni-select__input {
    flex: 1;
    font-size: 14px;
    height: 22px;
    line-height: 22px;
}

.uni-select__input-plac {
    font-size: 14px;
    color: $uni-secondary-color;
}

.uni-select__selector {
    /* #ifndef APP-NVUE */
    box-sizing: border-box;
    /* #endif */
    position: absolute;
    top: calc(100% + 12px);
    left: 0;
    width: 100%;
    background-color: #ffffff;
    border: 1px solid #ebeef5;
    border-radius: 6px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    z-index: 3;
    padding: 4px 0;
}

.uni-select__selector-scroll {
    /* #ifndef APP-NVUE */
    max-height: 200px;
    box-sizing: border-box;
    /* #endif */
}

.uni-select__selector-empty,
.uni-select__selector-item {
    /* #ifndef APP-NVUE */
    display: flex;
    cursor: pointer;
    /* #endif */
    line-height: 35px;
    font-size: 14px;
    text-align: center;
    /* border-bottom: solid 1px $uni-border-3; */
    padding: 0px 10px;
}

.uni-select__selector-item:hover {
    background-color: #f9f9f9;
}

.uni-select__selector-empty:last-child,
.uni-select__selector-item:last-child {
    /* #ifndef APP-NVUE */
    border-bottom: none;
    /* #endif */
}

.uni-select__selector__disabled {
    opacity: 0.4;
    cursor: default;
}

/* picker 弹出层通用的指示小三角 */
.uni-popper__arrow,
.uni-popper__arrow::after {
    position: absolute;
    display: block;
    width: 0;
    height: 0;
    border-color: transparent;
    border-style: solid;
    border-width: 6px;
}

.uni-popper__arrow {
    filter: drop-shadow(0 2px 12px rgba(0, 0, 0, 0.03));
    top: -6px;
    left: 10%;
    margin-right: 3px;
    border-top-width: 0;
    border-bottom-color: #ebeef5;
}

.uni-popper__arrow::after {
    content: ' ';
    top: 1px;
    margin-left: -6px;
    border-top-width: 0;
    border-bottom-color: #fff;
}

.uni-select__input-text {
    // width: 280px;
    width: 100%;
    color: $uni-main-color;
    white-space: nowrap;
    text-overflow: ellipsis;
    -o-text-overflow: ellipsis;
    overflow: hidden;
}

.uni-select__input-placeholder {
    color: $uni-base-color;
    font-size: 12px;
}

.uni-select--mask {
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
}
</style>
