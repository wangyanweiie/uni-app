/**
 * 上传路径
 */
export const UPLOAD_URL = `${import.meta.env.VITE_API_URL}/api/upload`;

/**
 * 扫码模式
 */
export const SCAN_MODE = {
    /** 普通扫码模式：扫码成功后返回结果、不重置条码；扫码失败后不重置表单 */
    MODE_ONE: 'commonScanningCode',
    /** 普通扫码模式：扫码成功后返回结果、不重置条码；扫码失败后重置表单 */
    MODE_TWO: 'commonScanningCodeAndClear',

    /** 连续扫码模式：扫码成功后返回结果、并重置条码；扫码失败后不重置表单、并且重新聚焦 */
    MODE_THREE: 'continuousScanningCode',
    /** 连续扫码模式：扫码成功后返回结果、并重置条码；扫码失败后重置表单、并且重新聚焦 */
    MODE_FOUR: 'continuousScanningCodeAndClear',

    /** 扫码成功后返回结果、不重置条码；扫码失败只清空条码、并且重新聚焦 */
    MODE_FIVE: 'onlyResetCode',
};
