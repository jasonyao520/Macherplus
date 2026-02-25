import { NextResponse } from 'next/server';
import { getDb } from '../../../lib/db';

export async function GET() {
    try {
        const db = getDb();
        const summaries = db.prepare(`
      SELECT ms.*, c.name as category_name, c.icon as category_icon
      FROM market_summaries ms
      LEFT JOIN categories c ON ms.category_id = c.id
      ORDER BY ms.date DESC
      LIMIT 10
    `).all();

        return NextResponse.json({ summaries });
    } catch (error) {
        console.error('Market summary error:', error);
        return NextResponse.json({ error: 'Erreur interne' }, { status: 500 });
    }
}
