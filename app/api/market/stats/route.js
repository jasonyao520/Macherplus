import { NextResponse } from 'next/server';
import { getDb } from '../../../lib/db';

export async function GET() {
    try {
        const db = getDb();

        // Calcul des statistiques en temps réel en excluant les produits non disponibles
        const stats = db.prepare(`
            SELECT 
                c.id as category_id,
                c.name as category_name,
                c.icon as category_icon,
                c.audio_label_fr,
                COUNT(p.id) as total_products,
                COUNT(DISTINCT p.supplier_id) as total_suppliers,
                MIN(p.price) as min_price,
                MAX(p.price) as max_price,
                ROUND(AVG(p.price), 0) as avg_price,
                p.unit
            FROM categories c
            JOIN products p ON c.id = p.category_id
            WHERE p.available = 1
            GROUP BY c.id
            ORDER BY c.sort_order ASC
        `).all();

        return NextResponse.json({ stats });
    } catch (error) {
        console.error('Market stats error:', error);
        return NextResponse.json({ error: 'Erreur interne lors du calcul des statistiques' }, { status: 500 });
    }
}
