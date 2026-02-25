import { NextResponse } from 'next/server';
import { getDb } from '../../../../lib/db';

export async function GET(request, { params }) {
    try {
        const { id } = await params;
        const db = getDb();

        const product = db.prepare(`
      SELECT p.*, c.name as category_name, c.icon as category_icon,
             u.name as supplier_name, u.business_name as supplier_business,
             u.location as supplier_location, u.phone as supplier_phone,
             u.verified as supplier_verified
      FROM products p
      JOIN categories c ON p.category_id = c.id
      JOIN users u ON p.supplier_id = u.id
      WHERE p.id = ?
    `).get(id);

        if (!product) {
            return NextResponse.json({ error: 'Produit introuvable' }, { status: 404 });
        }

        const audioFiles = db.prepare(
            'SELECT * FROM product_audio WHERE product_id = ?'
        ).all(id);

        const translations = db.prepare(
            'SELECT * FROM audio_translations WHERE product_id = ?'
        ).all(id);

        // Get other products from same supplier for comparison
        const supplierProducts = db.prepare(`
      SELECT p.id, p.name, p.price, p.unit, p.image
      FROM products p WHERE p.supplier_id = ? AND p.id != ? AND p.available = 1
      LIMIT 4
    `).all(product.supplier_id, id);

        // Get same product from other suppliers
        const alternatives = db.prepare(`
      SELECT p.id, p.name, p.price, p.unit, p.image,
             u.name as supplier_name, u.business_name as supplier_business,
             u.location as supplier_location
      FROM products p
      JOIN users u ON p.supplier_id = u.id
      WHERE p.category_id = ? AND p.id != ? AND p.available = 1
      ORDER BY p.price ASC LIMIT 5
    `).all(product.category_id, id);

        return NextResponse.json({
            product,
            audioFiles,
            translations,
            supplierProducts,
            alternatives,
        });
    } catch (error) {
        console.error('Product detail error:', error);
        return NextResponse.json({ error: 'Erreur interne' }, { status: 500 });
    }
}
