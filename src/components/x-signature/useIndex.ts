import { ref, watchEffect } from 'vue';
import { pathToBase64 } from 'image-tools';
import { showToast } from '@/utils/uni-message';
import RequestAPI from '@/api/upload';
import { Props } from './interface';

/**
 * @description useIndex
 * @param props 组件传参
 * @param emit 自定义事件
 */
export default function useIndex(props: Props, emit: any) {
    /**
     * 生成签名的路径
     */
    const signatureUrl = ref<string>('');

    /**
     * 监听 props
     */
    watchEffect(() => {
        signatureUrl.value = props.modelValue;
    });

    /**
     * 是否展示 popup
     */
    const showPopup = ref<boolean>(false);

    /**
     * canvas-context
     */
    const canvasContext = ref();

    /**
     * 路径点集合
     */
    const points = ref<Record<string, any>[]>([]);

    /**
     * 打开 popup
     */
    function openPopup() {
        if (props.disabled) {
            showToast('不可签名');
            return;
        }

        showPopup.value = true;
        createCanvasContext();
    }

    /**
     * 创建 canvas-context
     */
    function createCanvasContext() {
        // 创建 canvas 绘图上下文（指定 canvasId）
        canvasContext.value = uni.createCanvasContext('canvasId');

        // 线条的宽度（单位：px）
        canvasContext.value.setLineWidth(4);
        // 线条的端点样式：'butt' | 'round' | 'square'
        canvasContext.value.setLineCap('round');
        // 线条的交点样式：'butt' | 'round' | 'square'
        canvasContext.value.setLineJoin('round');
        // 对当前路径中的内容进行填充，默认的填充色为黑色
        canvasContext.value.fill();
    }

    /**
     * 触摸开始，获取到起点
     */
    function handleTouchstart(e: any) {
        const startX = e.changedTouches[0].x;
        const startY = e.changedTouches[0].y;
        const startPoint = { X: startX, Y: startY };
        points.value.push(startPoint);

        // 开始创建一个路径，需要调用fill或者stroke才会使用路径进行填充或描边
        canvasContext.value.beginPath();
    }

    /**
     * 绘制笔迹
     * 1.为保证笔迹实时显示，必须在移动的同时绘制笔迹
     * 2.为保证笔迹连续，每次从路径集合中区两个点作为起点（moveTo）和终点(lineTo)
     * 3.将上一次的终点作为下一次绘制的起点
     */
    function draw() {
        // 获取本次绘制路径的起点与终点
        const point1 = points.value[0];
        const point2 = points.value[1];

        // 删除上一个路径点，以便可以将上一次的终点作为下一次绘制的起点
        points.value.shift();

        // 把路径移动到画布中的指定点，不创建线条
        canvasContext.value.moveTo(point1.X, point1.Y);
        // 增加一个新点，然后创建一条从上次指定点到目标点的线
        canvasContext.value.lineTo(point2.X, point2.Y);
        // 画出当前路径的边框，默认颜色为黑色
        canvasContext.value.stroke();
        // 将之前在绘图上下文中的描述（路径、变形、样式）画到 canvas 中
        canvasContext.value.draw(true);
    }

    /**
     * 触摸移动，获取路径点
     */
    function handleTouchmove(e: any) {
        const moveX = e.changedTouches[0].x;
        const moveY = e.changedTouches[0].y;
        const movePoint = { X: moveX, Y: moveY };
        points.value.push(movePoint);

        // 至少要包含两个点作为起点与终点才进行绘制
        if (points.value.length >= 2) {
            draw();
        }
    }

    /**
     * 触摸结束，清空路径点集合
     */
    function handleTouchend() {
        points.value = [];
    }

    /**
     * 完成绘画并输出路径
     */
    function uploadCanvas() {
        // 把当前画布指定区域的内容导出生成指定大小的图片，并返回文件路径
        uni.canvasToTempFilePath({
            canvasId: 'canvasId',
            // 输出图片宽度
            destWidth: 500,
            // 输出图片高度
            destHeight: 500,
            // 目标文件类型，'png' | 'jpg'
            fileType: 'png',
            // 图片质量，取值范围为 (0, 1]，不在范围内时当作 1 处理
            quality: 1,
            // 成功回调
            success: async res => {
                // 手机端返回的是路径需要转成 base64
                // #ifdef APP-PLUS
                pathToBase64(res.tempFilePath).then(async (base64: unknown) => {
                    const result: any = await RequestAPI.uploadBase64({
                        base64: base64,
                    });

                    if (!result) {
                        signatureUrl.value = '';
                        return;
                    }

                    showToast('上传成功');
                    signatureUrl.value = result.data || '';
                    emit('update:modelValue', signatureUrl.value);
                    emit('confirm', result.data);
                    closePopup();
                });
                //#endif

                // #ifdef H5
                const result: any = await RequestAPI.uploadBase64({
                    base64: res.tempFilePath,
                });

                if (!result) {
                    signatureUrl.value = '';
                    return;
                }

                showToast('上传成功');
                signatureUrl.value = result.data || '';
                emit('update:modelValue', signatureUrl.value);
                emit('confirm', result.data);
                closePopup();
                //#endif
            },
        });
    }

    /**
     * 清空画布
     */
    function clearCanvas() {
        // 异步获取系统信息
        uni.getSystemInfo({
            success: res => {
                // 获取可使用窗口宽度与高度
                const cw = res.windowWidth;
                const ch = res.windowHeight;

                // 清除画布上在该矩形区域内的内容
                canvasContext.value.clearRect(0, 0, cw, ch);
                /**
                 * 本次绘制是否接着上一次绘制，默认 false
                 * 若 reserve 参数为 false，则在本次调用 drawCanvas 绘制之前 native 层应先清空画布再继续绘制；
                 * 若 reserver 参数为 true，则保留当前画布上的内容，本次调用 drawCanvas 绘制的内容覆盖在上面；
                 */
                canvasContext.value.draw(true);
            },
        });
    }

    /**
     * 关闭 popup
     */
    function closePopup() {
        showPopup.value = false;
        clearCanvas();
    }

    /**
     * 预览图片
     */
    function preview(url: string) {
        if (!url) {
            return;
        }

        uni.previewImage({
            urls: [url],
            current: 0,
        });
    }

    /**
     * 清空生成的签名路径
     */
    function handleClear() {
        signatureUrl.value = '';
        emit('update:modelValue', signatureUrl.value);
        emit('clear');
    }

    return {
        signatureUrl,
        showPopup,
        openPopup,
        handleTouchstart,
        handleTouchmove,
        handleTouchend,
        uploadCanvas,
        clearCanvas,
        closePopup,
        preview,
        handleClear,
    };
}
