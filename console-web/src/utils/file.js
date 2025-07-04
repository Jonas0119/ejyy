/**
 * +----------------------------------------------------------------------
 * | 开源物业管理系统，敬请使用
 * +----------------------------------------------------------------------
 */

import SparkMD5 from 'spark-md5';

export function size(bytes, si = false, dp = 1) {
    const thresh = si ? 1000 : 1024;

    if (Math.abs(bytes) < thresh) {
        return bytes + ' B';
    }

    const units = si
        ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
        : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
    let u = -1;
    const r = 10 ** dp;

    do {
        bytes /= thresh;
        ++u;
    } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);

    return bytes.toFixed(dp) + ' ' + units[u];
}

export function parse(file) {
    return new Promise((resolve, reject) => {
        const fr = new FileReader();

        fr.onload = () => {
            const filename = file.name;
            const pos = filename.lastIndexOf('.');
            const ext = filename.substring(pos);

            resolve({
                name: filename,
                pos,
                ext,
                hash: SparkMD5.hash(fr.result)
            });
        };

        fr.onerror = () => {
            reject();
        };

        fr.readAsBinaryString(file);
    });
}
