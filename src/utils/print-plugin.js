/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
/* eslint-disable no-undef */
/* eslint-disable func-names */
// eslint-disable-next-line no-unused-expressions
// !(function (root, factory) {
//     if (typeof exports === 'object' && typeof module !== 'undefined') {
//         module.exports = factory();
//     } else if (typeof define === 'function' && define.amd) {
//         define(factory);
//     } else {
//         document.addEventListener(
//             'plusready',
//             () => {
//                 // 修改此处为插件命名
//                 const moduleName = 'plugintest';

//                 root.plus[moduleName] = factory();
//             },
//             false,
//         );
//     }
// })(this, () => {
//     // 在此处定义自己的方法
//     const _BARCODE = 'plugintest';

//     const plugintest = {
//         GetBlueToothListFunction(data, successCallback, errorCallback) {
//             const success =
//                 typeof successCallback !== 'function'
//                     ? null
//                     : function (args) {
//                           successCallback(args);
//                       };

//             const fail =
//                 typeof errorCallback !== 'function'
//                     ? null
//                     : function (code) {
//                           errorCallback(code);
//                       };

//             const callbackID = plus.bridge.callbackId(success, fail);

//             return plus.bridge.exec(_BARCODE, 'getBluetoothList', [callbackID, data]);
//         },

//         GetCidFunction(data, successCallback, errorCallback) {
//             const success =
//                 typeof successCallback !== 'function'
//                     ? null
//                     : function (args) {
//                           successCallback(args);
//                       };

//             const fail =
//                 typeof errorCallback !== 'function'
//                     ? null
//                     : function (code) {
//                           errorCallback(code);
//                       };

//             const callbackID = plus.bridge.callbackId(success, fail);

//             return plus.bridge.exec(_BARCODE, 'getCid', [callbackID, data]);
//         },

//         ConnBluetoothFunction(data, successCallback, errorCallback) {
//             const success =
//                 typeof successCallback !== 'function'
//                     ? null
//                     : function (args) {
//                           successCallback(args);
//                       };

//             const fail =
//                 typeof errorCallback !== 'function'
//                     ? null
//                     : function (args) {
//                           errorCallback(args);
//                       };

//             const callbackID = plus.bridge.callbackId(success, fail);

//             return plus.bridge.exec(_BARCODE, 'connBluetooth', [callbackID, data]);
//         },

//         AddPrintFunction(data, successCallback, errorCallback) {
//             const success =
//                 typeof successCallback !== 'function'
//                     ? null
//                     : function (args) {
//                           successCallback(args);
//                       };

//             const fail =
//                 typeof errorCallback !== 'function'
//                     ? null
//                     : function (args) {
//                           errorCallback(args);
//                       };

//             const callbackID = plus.bridge.callbackId(success, fail);

//             return plus.bridge.exec(_BARCODE, 'sentMsgPrint', [callbackID, data]);
//         },
//     };

//     return plugintest;
// });

// 在此处定义自己的方法
const _BARCODE = 'plugintest';

const plugintest = {
    GetBlueToothListFunction(data, successCallback, errorCallback) {
        const success =
            typeof successCallback !== 'function'
                ? null
                : function (args) {
                      successCallback(args);
                  };

        const fail =
            typeof errorCallback !== 'function'
                ? null
                : function (code) {
                      errorCallback(code);
                  };

        const callbackID = plus.bridge.callbackId(success, fail);

        return plus.bridge.exec(_BARCODE, 'getBluetoothList', [callbackID, data]);
    },

    GetCidFunction(data, successCallback, errorCallback) {
        const success =
            typeof successCallback !== 'function'
                ? null
                : function (args) {
                      successCallback(args);
                  };

        const fail =
            typeof errorCallback !== 'function'
                ? null
                : function (code) {
                      errorCallback(code);
                  };

        const callbackID = plus.bridge.callbackId(success, fail);

        return plus.bridge.exec(_BARCODE, 'getCid', [callbackID, data]);
    },

    ConnBluetoothFunction(data, successCallback, errorCallback) {
        const success =
            typeof successCallback !== 'function'
                ? null
                : function (args) {
                      successCallback(args);
                  };

        const fail =
            typeof errorCallback !== 'function'
                ? null
                : function (args) {
                      errorCallback(args);
                  };

        const callbackID = plus.bridge.callbackId(success, fail);

        return plus.bridge.exec(_BARCODE, 'connBluetooth', [callbackID, data]);
    },

    AddPrintFunction(data, successCallback, errorCallback) {
        const success =
            typeof successCallback !== 'function'
                ? null
                : function (args) {
                      successCallback(args);
                  };

        const fail =
            typeof errorCallback !== 'function'
                ? null
                : function (args) {
                      errorCallback(args);
                  };

        const callbackID = plus.bridge.callbackId(success, fail);

        return plus.bridge.exec(_BARCODE, 'sentMsgPrint', [callbackID, data]);
    },
};

export default plugintest;
