const { SignJWT, jwtVerify } = require('jose');
const bcryptjs = require('bcryptjs');

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'marche-plus-secret-key-2024');

async function hashPassword(password) {
    return bcryptjs.hash(password, 10);
}

async function comparePassword(password, hash) {
    return bcryptjs.compare(password, hash);
}

async function createToken(payload) {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(JWT_SECRET);
}

async function verifyToken(token) {
    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        return payload;
    } catch {
        return null;
    }
}

async function getUserFromRequest(request) {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
        // Check cookie
        const cookie = request.headers.get('cookie');
        if (cookie) {
            const tokenMatch = cookie.match(/token=([^;]+)/);
            if (tokenMatch) {
                return verifyToken(tokenMatch[1]);
            }
        }
        return null;
    }
    const token = authHeader.substring(7);
    return verifyToken(token);
}

function requireRole(...roles) {
    return async (request) => {
        const user = await getUserFromRequest(request);
        if (!user) {
            return { error: 'Non authentifié', status: 401 };
        }
        if (!roles.includes(user.role)) {
            return { error: 'Accès non autorisé', status: 403 };
        }
        return { user };
    };
}

module.exports = {
    hashPassword,
    comparePassword,
    createToken,
    verifyToken,
    getUserFromRequest,
    requireRole,
};
