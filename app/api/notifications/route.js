import { NextResponse } from 'next/server';
import { getDb } from '../../../lib/db';
import { getUserFromRequest } from '../../../lib/auth';

export async function GET(request) {
    try {
        const user = await getUserFromRequest(request);
        if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });

        const db = getDb();
        const notifications = db.prepare(`
      SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 50
    `).all(user.id);

        const unreadCount = db.prepare(
            'SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND read = 0'
        ).get(user.id).count;

        return NextResponse.json({ notifications, unreadCount });
    } catch (error) {
        console.error('Notifications error:', error);
        return NextResponse.json({ error: 'Erreur interne' }, { status: 500 });
    }
}
