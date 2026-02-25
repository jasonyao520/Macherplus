'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavBar({ role = 'merchant' }) {
    const pathname = usePathname();

    const merchantLinks = [
        { href: '/commercant', icon: '🏠', label: 'Accueil' },
        { href: '/commercant/favoris', icon: '❤️', label: 'Favoris' },
        { href: '/commercant/marche', icon: '📊', label: 'Marché' },
        { href: '/commercant/notifications', icon: '🔔', label: 'Alertes' },
        { href: '/commercant/profil', icon: '👤', label: 'Profil' },
    ];

    const supplierLinks = [
        { href: '/fournisseur', icon: '🏠', label: 'Accueil' },
        { href: '/fournisseur/produits', icon: '📦', label: 'Produits' },
        { href: '/fournisseur/demandes', icon: '📋', label: 'Demandes' },
        { href: '/fournisseur/profil', icon: '👤', label: 'Profil' },
    ];

    const links = role === 'supplier' ? supplierLinks : merchantLinks;

    return (
        <nav className="navbar-bottom">
            {links.map((link) => (
                <Link
                    key={link.href}
                    href={link.href}
                    className={`nav-item ${pathname === link.href ? 'active' : ''}`}
                >
                    <span className="nav-icon">{link.icon}</span>
                    <span>{link.label}</span>
                </Link>
            ))}
        </nav>
    );
}
