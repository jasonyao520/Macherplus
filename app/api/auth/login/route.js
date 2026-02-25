import { NextResponse } from 'next/server';
import { getDb } from '../../../../lib/db';
import { comparePassword, createToken } from '../../../../lib/auth';

export async function POST(request) {
    try {
        const { phone, password } = await request.json();

        if (!phone || !password) {
            return NextResponse.json(
                { error: 'Téléphone et mot de passe requis' },
                { status: 400 }
            );
        }

        const db = getDb();
        const user = db.prepare('SELECT * FROM users WHERE phone = ?').get(phone);

        if (!user) {
            return NextResponse.json(
                { error: 'Numéro de téléphone ou mot de passe incorrect' },
                { status: 401 }
            );
        }

        const valid = await comparePassword(password, user.password_hash);
        if (!valid) {
            return NextResponse.json(
                { error: 'Numéro de téléphone ou mot de passe incorrect' },
                { status: 401 }
            );
        }

        const token = await createToken({
            id: user.id,
            name: user.name,
            phone: user.phone,
            role: user.role,
        });

        const response = NextResponse.json({
            user: {
                id: user.id,
                name: user.name,
                phone: user.phone,
                role: user.role,
                business_name: user.business_name,
                location: user.location,
                verified: user.verified,
            },
            token,
        });

        response.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7,
        });

        return response;
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ error: 'Erreur interne' }, { status: 500 });
    }
}
