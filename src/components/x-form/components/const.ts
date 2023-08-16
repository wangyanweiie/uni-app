/**
 * 上传路径
 */
export const UPLOAD_URL = `${import.meta.env.VITE_API_URL}/api/upload`;

/**
 * 扫码模式
 */
export const SCAN_MODE = {
    /** 普通扫码模式：扫码成功后返回结果、不重置条码；扫码失败后不重置表单 */
    MODE_ONE: 'commonScanCode',
    /** 普通扫码模式：扫码成功后返回结果、不重置条码；扫码失败后重置表单、并且重新聚焦 */
    MODE_TWO: 'commonScanCodeAndClear',

    /** 连续扫码模式：扫码成功后返回结果、并重置条码；扫码失败后不重置表单 */
    MODE_THREE: 'continuousScanCode',
    /** 连续扫码模式：扫码成功后返回结果、并重置条码；扫码失败后重置表单、并且重新聚焦 */
    MODE_FOUR: 'continuousScanCodeAndClear',

    /** 扫码成功后返回结果、不重置条码；扫码失败只清空条码、并且重新聚焦 */
    MODE_FIVE: 'onlyResetCode',
};
