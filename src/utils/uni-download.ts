/**
 * task state
 */
enum TASK_STATE {
    '开始' = 1,
    '已连接到服务器' = 2,
    '已接受到数据' = 3,
    '下载完成' = 4,
}

/**
 * @params { url } 下载文件资源地址
 * @params { options } 下载任务的参数，常用 "filename" 保存时更改文件名称
 * @params { downloadcallback } 正在下载的回调
 * @params { finishedcallback } 下载完成的回调
 * */
export default (url: string, options?: any, downloadcallback?: any, finishedcallback?: any) => {
    // 保存下载进度
    let downloadProgress: string;

    // 创建下载任务
    const downloadtask = plus.downloader.createDownload(url, options, (e: any, status: number) => {
        if (status == 200) {
            // 下载成功，e.filename 是文件在保存在本地的相对路径，使用下面的 API 可转为绝对路径
            const fileSaveUrl = plus.io.convertLocalFileSystemURL(e.filename);

            // 调用相应的默认的第三方程序打开文件
            plus.runtime.openFile(e.filename);

            console.log('默认保存路径: ', fileSaveUrl);
        } else {
            //下载失败，清除下载任务
            plus.downloader.clear();
        }
    });

    // 添加下载任务事件监听器
    downloadtask.addEventListener('statechanged', (task: any) => {
        if (!downloadtask) {
            return;
        }

        switch (task.state) {
            case TASK_STATE['开始']:
                break;

            case TASK_STATE['已连接到服务器']:
                break;

            case TASK_STATE['已接受到数据']:
                // 更新下载进度
                const currentProgress =
                    task.downloadedSize && task.totalSize ? task.downloadedSize / task.totalSize : 0;
                const handleProgress = parseInt(String(currentProgress * 100));
                downloadProgress = `${handleProgress} %`;

                if (downloadcallback) {
                    downloadcallback(downloadProgress);
                }
                break;

            case TASK_STATE['下载完成']:
                if (finishedcallback) {
                    finishedcallback();
                }
                break;
        }
    });

    // 开始下载任务
    downloadtask.start();
};
