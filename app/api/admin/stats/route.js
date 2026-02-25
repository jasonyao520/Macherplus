import { NextResponse } from 'next/server';
import { getDb } from '../../../../lib/db';
import { getUserFromRequest } from '../../../../lib/auth';

export async function GET(request) {
    try {
        const user = await getUserFromRequest(request);
        if (!user || user.role !== 'admin') {
            return NextResponse.json({ error: 'Accès admin requis' }, { status: 403 });
        }

        const db = getDb();

        const totalUsers = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
        const merchants = db.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'merchant'").get().count;
        const suppliers = db.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'supplier'").get().count;
        const pendingSuppliers = db.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'supplier' AND verified = 0").get().count;
        const totalProducts = db.prepare('SELECT COUNT(*) as count FROM products').get().count;
        const totalRequests = db.prepare('SELECT COUNT(*) as count FROM purchase_requests').get().count;
        const pendingRequests = db.prepare("SELECT COUNT(*) as count FROM purchase_requests WHERE status = 'pending'").get().count;

        const recentUsers = db.prepare(
            'SELECT id, name, phone, role, verified, created_at FROM users ORDER BY created_at DESC LIMIT 10'
        ).all();

        const topProducts = db.prepare(`
      SELECT p.name, p.price, p.unit, COUNT(pr.id) as request_count
      FROM products p
      LEFT JOIN purchase_requests pr ON p.id = pr.product_id
      GROUP BY p.id ORDER BY request_count DESC LIMIT 5
    `).all();

        return NextResponse.json({
            stats: {
                totalUsers, merchants, suppliers, pendingSuppliers,
                totalProducts, totalRequests, pendingRequests,
            },
            recentUsers,
            topProducts,
        });
    } catch (error) {
        console.error('Admin stats error:', error);
        return NextResponse.json({ error: 'Erreur interne' }, { status: 500 });
    }
}
