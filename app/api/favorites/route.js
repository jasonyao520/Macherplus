import { NextResponse } from 'next/server';
import { getDb } from '../../../lib/db';
import { getUserFromRequest } from '../../../lib/auth';
import { v4 as uuidv4 } from 'uuid';

export async function GET(request) {
    try {
        const user = await getUserFromRequest(request);
        if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });

        const db = getDb();
        const favorites = db.prepare(`
      SELECT f.id as favorite_id, f.created_at as favorited_at,
             p.*, c.name as category_name, c.icon as category_icon,
             u.name as supplier_name, u.business_name as supplier_business
      FROM favorites f
      JOIN products p ON f.product_id = p.id
      JOIN categories c ON p.category_id = c.id
      JOIN users u ON p.supplier_id = u.id
      WHERE f.user_id = ?
      ORDER BY f.created_at DESC
    `).all(user.id);

        return NextResponse.json({ favorites });
    } catch (error) {
        console.error('Favorites error:', error);
        return NextResponse.json({ error: 'Erreur interne' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const user = await getUserFromRequest(request);
        if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });

        const { product_id } = await request.json();
        if (!product_id) return NextResponse.json({ error: 'product_id requis' }, { status: 400 });

        const db = getDb();
        const existing = db.prepare(
            'SELECT id FROM favorites WHERE user_id = ? AND product_id = ?'
        ).get(user.id, product_id);

        if (existing) {
            return NextResponse.json({ message: 'Déjà en favoris' });
        }

        const id = uuidv4();
        db.prepare('INSERT INTO favorites (id, user_id, product_id) VALUES (?, ?, ?)').run(id, user.id, product_id);

        return NextResponse.json({ id, message: 'Ajouté aux favoris' }, { status: 201 });
    } catch (error) {
        console.error('Favorite add error:', error);
        return NextResponse.json({ error: 'Erreur interne' }, { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        const user = await getUserFromRequest(request);
        if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });

        const { product_id } = await request.json();
        db.prepare('DELETE FROM favorites WHERE user_id = ? AND product_id = ?').run(user.id, product_id);

        return NextResponse.json({ message: 'Retiré des favoris' });
    } catch (error) {
        console.error('Favorite remove error:', error);
        return NextResponse.json({ error: 'Erreur interne' }, { status: 500 });
    }
}
