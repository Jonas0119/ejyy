/**
 * +----------------------------------------------------------------------
 * | 开源物业管理系统，敬请使用
 * +----------------------------------------------------------------------
 */

import model from '~/model';
import { Session } from 'koa-session';

const FORTY_FIVE_MINUTES = 45 * 60 * 1000;

function getExpiresOn(session: Session, ttl: number): number {
    let expiresOn = null;
    ttl = ttl || FORTY_FIVE_MINUTES;

    if (session && session.cookie && session.cookie.expires) {
        if (session.cookie.expires instanceof Date) {
            expiresOn = session.cookie.expires;
        } else {
            expiresOn = new Date(session.cookie.expires);
        }
    } else {
        let now = new Date();
        expiresOn = new Date(now.getTime() + ttl);
    }

    return expiresOn;
}

class MysqlSessionStore {
    async get(sid: string): Promise<Session> {
        const row = await model
            .from('ejyy_session_store')
            .where('id', sid)
            .where('expire', '>', Date.now())
            .first();

        let session = <Session>null;

        if (row && row.data) {
            session = <Session>JSON.parse(row.data);
        }

        return session;
    }

    async set(sid: string, session: Session, ttl: number) {
        let expire = getExpiresOn(session, ttl).valueOf();
        let data = JSON.stringify(session);

        await model.raw(
            'INSERT INTO ejyy_session_store (id, expire, data) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE expire=?, data =?',
            [sid, expire, data, expire, data]
        );
    }

    async destroy(sid: string) {
        await model
            .from('ejyy_session_store')
            .where('id', sid)
            .delete();
    }
}

export default MysqlSessionStore;
