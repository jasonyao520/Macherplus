'use client';
import Link from 'next/link';
import AudioButton from './AudioButton';

export default function ProductCard({ product, onFavorite }) {
    const priceText = `${product.price} FCFA/${product.unit}`;
    const ttsText = product.tts_text_fr ||
        `${product.name}. Prix: ${product.price} francs CFA le ${product.unit}. Fournisseur: ${product.supplier_name || ''}`;

    return (
        <Link href={`/commercant/produit/${product.id}`} className="card product-card">
            <div className="product-card-image">
                {product.image ? (
                    <img src={product.image} alt={product.name} />
                ) : (
                    <span>{product.category_icon || '📦'}</span>
                )}
            </div>

            <div className="product-card-audio">
                <AudioButton text={ttsText} size="md" />
            </div>

            {onFavorite && (
                <button
                    className={`product-card-favorite ${product.isFavorite ? 'active' : ''}`}
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onFavorite(product.id);
                    }}
                >
                    {product.isFavorite ? '❤️' : '🤍'}
                </button>
            )}

            <div className="card-body">
                <div className="product-card-name">{product.name}</div>
                <div className="product-card-supplier">
                    📍 {product.supplier_name || product.supplier_business}
                </div>
                <div className="product-card-price">
                    {product.price.toLocaleString('fr-FR')} <span className="unit">FCFA/{product.unit}</span>
                </div>
            </div>
        </Link>
    );
}
