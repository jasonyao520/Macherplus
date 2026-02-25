import { NextResponse } from 'next/server';
import { getDb } from '../../../lib/db';
import { getUserFromRequest } from '../../../lib/auth';
import { v4 as uuidv4 } from 'uuid';

export async function GET(request) {
    try {
        const user = await getUserFromRequest(request);
        if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });

        const db = getDb();
        let requests;

        if (user.role === 'merchant') {
            requests = db.prepare(`
        SELECT pr.*, p.name as product_name, p.price, p.unit,
               u.name as supplier_name, u.business_name as supplier_business, u.phone as supplier_phone
        FROM purchase_requests pr
        JOIN products p ON pr.product_id = p.id
        JOIN users u ON pr.supplier_id = u.id
        WHERE pr.merchant_id = ?
        ORDER BY pr.created_at DESC
      `).all(user.id);
        } else if (user.role === 'supplier') {
            requests = db.prepare(`
        SELECT pr.*, p.name as product_name, p.price, p.unit,
               u.name as merchant_name, u.business_name as merchant_business, u.phone as merchant_phone
        FROM purchase_requests pr
        JOIN products p ON pr.product_id = p.id
        JOIN users u ON pr.merchant_id = u.id
        WHERE pr.supplier_id = ?
        ORDER BY pr.created_at DESC
      `).all(user.id);
        } else {
            requests = db.prepare(`
        SELECT pr.*, p.name as product_name,
               m.name as merchant_name, s.name as supplier_name
        FROM purchase_requests pr
        JOIN products p ON pr.product_id = p.id
        JOIN users m ON pr.merchant_id = m.id
        JOIN users s ON pr.supplier_id = s.id
        ORDER BY pr.created_at DESC LIMIT 100
      `).all();
        }

        return NextResponse.json({ requests });
    } catch (error) {
        console.error('Requests error:', error);
        return NextResponse.json({ error: 'Erreur interne' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const user = await getUserFromRequest(request);
        if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });

        const { product_id, quantity, message } = await request.json();
        if (!product_id) return NextResponse.json({ error: 'product_id requis' }, { status: 400 });

        const db = getDb();
        const product = db.prepare('SELECT * FROM products WHERE id = ?').get(product_id);
        if (!product) return NextResponse.json({ error: 'Produit introuvable' }, { status: 404 });

        const id = uuidv4();
        db.prepare(
            `INSERT INTO purchase_requests (id, merchant_id, product_id, supplier_id, quantity, unit, message)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
        ).run(id, user.id, product_id, product.supplier_id, quantity || 1, product.unit, message || null);

        // Create notification for supplier
        db.prepare(
            `INSERT INTO notifications (id, user_id, type, title, message)
       VALUES (?, ?, 'order', ?, ?)`
        ).run(
            uuidv4(), product.supplier_id,
            'Nouvelle demande d\'achat',
            `${user.name} souhaite acheter ${quantity || 1} ${product.unit} de ${product.name}`
        );

        return NextResponse.json({ id, message: 'Demande envoyée' }, { status: 201 });
    } catch (error) {
        console.error('Request create error:', error);
        return NextResponse.json({ error: 'Erreur interne' }, { status: 500 });
    }
}
