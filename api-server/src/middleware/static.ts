/**
 * +----------------------------------------------------------------------
 * | 开源物业管理系统，敬请使用
 * +----------------------------------------------------------------------
 */

import fs from 'fs';
import path from 'path';
import { Middleware } from 'koa';
import config from '~/config';

function getContentType(filePath: string): string {
    const ext = path.extname(filePath).toLowerCase();
    const types: { [key: string]: string } = {
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.gif': 'image/gif',
        '.webp': 'image/webp',
        '.svg': 'image/svg+xml',
        '.pdf': 'application/pdf',
        '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    };
    return types[ext] || 'application/octet-stream';
}

export default function StaticMiddleware(): Middleware {
    return async (ctx, next) => {
        if (ctx.method !== 'GET' || !ctx.path.startsWith('/static/')) {
            return await next();
        }

        // 使用新的storage配置
        const isLocalMode = config.storage.mode === 'local';

        if (!isLocalMode) {
            ctx.status = 404;
            ctx.body = 'Not Found';
            return;
        }

        try {
            const filePath = decodeURIComponent(ctx.path.replace('/static/', ''));

            // 使用storage配置
            const savePath = config.storage.local?.savePath || './uploads';
            const fullPath = path.join(process.cwd(), savePath, filePath);

            const resolvedPath = path.resolve(fullPath);
            const allowedDir = path.resolve(process.cwd(), savePath);

            if (!resolvedPath.startsWith(allowedDir)) {
                ctx.status = 403;
                ctx.body = 'Forbidden';
                return;
            }

            if (!fs.existsSync(resolvedPath)) {
                ctx.status = 404;
                ctx.body = 'File Not Found';
                return;
            }

            const stats = fs.statSync(resolvedPath);

            if (!stats.isFile()) {
                ctx.status = 404;
                ctx.body = 'Not a File';
                return;
            }

            ctx.set('Content-Type', getContentType(resolvedPath));
            ctx.set('Content-Length', stats.size.toString());
            ctx.set('Cache-Control', 'public, max-age=300'); // 5分钟缓存
            ctx.set('Last-Modified', stats.mtime.toUTCString());

            const ifModifiedSince = ctx.get('If-Modified-Since');
            if (ifModifiedSince && new Date(ifModifiedSince) >= stats.mtime) {
                ctx.status = 304;
                return;
            }

            ctx.body = fs.createReadStream(resolvedPath);
        } catch (error) {
            ctx.status = 500;
            ctx.body = 'Internal Server Error';
        }
    };
}
