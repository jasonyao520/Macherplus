import { NextResponse } from 'next/server';
import { getDb } from '../../../lib/db';

export async function GET() {
    try {
        const db = getDb();
        const categories = db.prepare(
            'SELECT * FROM categories ORDER BY sort_order ASC'
        ).all();
        return NextResponse.json({ categories });
    } catch (error) {
        console.error('Categories error:', error);
        return NextResponse.json({ error: 'Erreur interne' }, { status: 500 });
    }
}
