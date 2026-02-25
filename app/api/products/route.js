import { NextResponse } from 'next/server';
import { getDb } from '../../../lib/db';
import { getUserFromRequest } from '../../../lib/auth';
import { v4 as uuidv4 } from 'uuid';

export async function GET(request) {
    try {
        const db = getDb();
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');
        const search = searchParams.get('search');
        const supplier = searchParams.get('supplier');
        const limit = parseInt(searchParams.get('limit') || '50');
        const offset = parseInt(searchParams.get('offset') || '0');

        let query = `
      SELECT p.*, c.name as category_name, c.icon as category_icon,
             u.name as supplier_name, u.business_name as supplier_business,
             u.location as supplier_location, u.phone as supplier_phone,
             (SELECT tts_text FROM audio_translations WHERE product_id = p.id AND language = 'fr' LIMIT 1) as tts_text_fr
      FROM products p
      JOIN categories c ON p.category_id = c.id
      JOIN users u ON p.supplier_id = u.id
      WHERE p.available = 1
    `;
        const params = [];

        if (category) {
            query += ' AND c.id = ?';
            params.push(category);
        }
        if (search) {
            query += ' AND (p.name LIKE ? OR p.description LIKE ?)';
            params.push(`%${search}%`, `%${search}%`);
        }
        if (supplier) {
            query += ' AND p.supplier_id = ?';
            params.push(supplier);
        }

        query += ' ORDER BY p.created_at DESC LIMIT ? OFFSET ?';
        params.push(limit, offset);

        const products = db.prepare(query).all(...params);
        const total = db.prepare('SELECT COUNT(*) as count FROM products WHERE available = 1').get().count;

        return NextResponse.json({ products, total });
    } catch (error) {
        console.error('Products list error:', error);
        return NextResponse.json({ error: 'Erreur interne' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const user = await getUserFromRequest(request);
        if (!user || user.role !== 'supplier') {
            return NextResponse.json({ error: 'Accès réservé aux fournisseurs' }, { status: 403 });
        }

        const { name, description, price, unit, category_id, image } = await request.json();

        if (!name || !price || !category_id) {
            return NextResponse.json({ error: 'Nom, prix et catégorie requis' }, { status: 400 });
        }

        const db = getDb();
        const id = uuidv4();

        db.prepare(
            `INSERT INTO products (id, supplier_id, category_id, name, description, price, unit, image)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
        ).run(id, user.id, category_id, name, description || '', price, unit || 'kg', image || null);

        // Auto-create French TTS text
        const ttsText = `${name}. ${description || ''}. Prix: ${price} francs CFA le ${unit || 'kg'}`;
        db.prepare(
            `INSERT INTO audio_translations (id, product_id, language, tts_text) VALUES (?, ?, 'fr', ?)`
        ).run(uuidv4(), id, ttsText);

        const product = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
        return NextResponse.json({ product }, { status: 201 });
    } catch (error) {
        console.error('Product create error:', error);
        return NextResponse.json({ error: 'Erreur interne' }, { status: 500 });
    }
}
