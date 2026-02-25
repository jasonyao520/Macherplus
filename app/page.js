'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAudio } from '../components/AudioContext';

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { speak, isPlaying, stopAudio } = useAudio();
  const [demoPlaying, setDemoPlaying] = useState(false);

  const playDemo = () => {
    if (demoPlaying) {
      stopAudio();
      setDemoPlaying(false);
    } else {
      speak(
        "Bienvenue sur Marché Plus! Ici, vous trouvez les meilleurs produits alimentaires de Côte d'Ivoire. " +
        "Banane plantain, 500 francs le kilo, chez Agri-Fresh. Tomate fraîche, 400 francs le kilo. " +
        "Appuyez sur les boutons pour écouter les prix et comparer les fournisseurs. " +
        "Pas besoin de lire, Marché Plus vous parle!",
        'fr'
      );
      setDemoPlaying(true);
    }
  };

  useEffect(() => {
    if (!isPlaying) setDemoPlaying(false);
  }, [isPlaying]);

  return (
    <div className="landing">
      {/* ============ NAVIGATION ============ */}
      <nav className="landing-nav">
        <div className="container flex-between">
          <Link href="/" className="landing-logo">
            <span className="logo-emoji">🛒</span>
            <span>Marché<span style={{ color: 'var(--accent)' }}>+</span></span>
          </Link>
          <div className="landing-nav-links">
            <a href="#fonctionnement">Comment ça marche</a>
            <a href="#avantages">Avantages</a>
            <a href="#faq">FAQ</a>
            <Link href="/auth/login" className="btn btn-outline btn-sm">Connexion</Link>
            <Link href="/auth/register" className="btn btn-primary btn-sm">Commencer 🎯</Link>
          </div>
          <button
            className="landing-menu-btn"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Menu"
          >
            {isMenuOpen ? '✕' : '☰'}
          </button>
        </div>
        {isMenuOpen && (
          <div className="landing-mobile-menu">
            <a href="#fonctionnement" onClick={() => setIsMenuOpen(false)}>Comment ça marche</a>
            <a href="#avantages" onClick={() => setIsMenuOpen(false)}>Avantages</a>
            <a href="#faq" onClick={() => setIsMenuOpen(false)}>FAQ</a>
            <Link href="/auth/login" onClick={() => setIsMenuOpen(false)}>Connexion</Link>
            <Link href="/auth/register" className="btn btn-primary btn-block" onClick={() => setIsMenuOpen(false)}>Commencer 🎯</Link>
          </div>
        )}
      </nav>

      {/* ============ HERO ============ */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge animate-fade-in">🎧 Audio-First · Accessible à tous</div>
            <h1 className="hero-title animate-fade-in-up">
              Le marché alimentaire
              <br />
              <span className="hero-gradient">à portée de voix</span>
            </h1>
            <p className="hero-subtitle animate-fade-in-up">
              Trouvez les meilleurs fournisseurs, comparez les prix et commandez
              — <strong>même sans savoir lire</strong>. Marché+ vous parle en français, dioula et baoulé.
            </p>
            <div className="hero-actions animate-fade-in-up">
              <Link href="/auth/register" className="btn btn-primary btn-lg">
                🚀 Commencer gratuitement
              </Link>
              <button className="btn btn-outline btn-lg" onClick={playDemo}>
                {demoPlaying ? '⏹️ Arrêter' : '🔊 Écouter la démo'}
              </button>
            </div>
            <div className="hero-stats">
              <div className="hero-stat">
                <span className="hero-stat-value">500+</span>
                <span className="hero-stat-label">Produits</span>
              </div>
              <div className="hero-stat">
                <span className="hero-stat-value">150+</span>
                <span className="hero-stat-label">Fournisseurs</span>
              </div>
              <div className="hero-stat">
                <span className="hero-stat-value">1000+</span>
                <span className="hero-stat-label">Commerçantes</span>
              </div>
            </div>
          </div>
          <div className="hero-visual animate-float">
            <div className="hero-phone">
              <div className="hero-phone-screen">
                <div className="hero-phone-header">
                  <span>🛒 Marché+</span>
                  <span>🔊</span>
                </div>
                <div className="hero-phone-product">
                  <div className="hero-phone-emoji">🍌</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '14px' }}>Banane Plantain</div>
                    <div style={{ color: 'var(--primary)', fontWeight: 700 }}>500 FCFA/kg</div>
                  </div>
                  <div className="audio-wave active" style={{ marginLeft: 'auto' }}>
                    <div className="audio-wave-bar"></div>
                    <div className="audio-wave-bar"></div>
                    <div className="audio-wave-bar"></div>
                    <div className="audio-wave-bar"></div>
                    <div className="audio-wave-bar"></div>
                  </div>
                </div>
                <div className="hero-phone-product">
                  <div className="hero-phone-emoji">🍅</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '14px' }}>Tomate Fraîche</div>
                    <div style={{ color: 'var(--primary)', fontWeight: 700 }}>400 FCFA/kg</div>
                  </div>
                </div>
                <div className="hero-phone-actions">
                  <span className="btn btn-primary btn-sm" style={{ fontSize: '12px', padding: '8px 12px', minHeight: 'auto' }}>🛒 Acheter</span>
                  <span className="btn btn-secondary btn-sm" style={{ fontSize: '12px', padding: '8px 12px', minHeight: 'auto' }}>📞 Appeler</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section id="fonctionnement" className="section" style={{ background: 'white' }}>
        <div className="container text-center">
          <h2 className="section-title">Comment ça marche ? 🎯</h2>
          <p className="section-subtitle">
            3 étapes simples. Pas besoin de savoir lire — l'application vous guide par la voix.
          </p>
          <div className="steps-grid">
            <div className="step-card animate-fade-in-up">
              <div className="step-number">1</div>
              <div className="step-icon">🎧</div>
              <h3>Écoutez les produits</h3>
              <p>Chaque produit a un bouton audio. Appuyez pour entendre le nom, le prix et le fournisseur.</p>
            </div>
            <div className="step-card animate-fade-in-up">
              <div className="step-number">2</div>
              <div className="step-icon">📊</div>
              <h3>Comparez les prix</h3>
              <p>Voyez les prix de différents fournisseurs côte à côte. L'app vous dit qui a le meilleur prix.</p>
            </div>
            <div className="step-card animate-fade-in-up">
              <div className="step-number">3</div>
              <div className="step-icon">🛒</div>
              <h3>Commandez simplement</h3>
              <p>Un seul bouton pour commander ou appeler le fournisseur directement.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ AUDIO DEMO SECTION ============ */}
      <section className="section audio-demo-section">
        <div className="container">
          <div className="audio-demo-content">
            <div className="audio-demo-text">
              <h2 className="section-title" style={{ color: 'white' }}>
                🔊 L'application vous parle
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 'var(--fs-lg)', lineHeight: 1.7, marginBottom: 'var(--space-xl)' }}>
                Marché+ est la <strong>première plateforme audio</strong> pour le commerce alimentaire en Côte d'Ivoire.
                Chaque produit, chaque prix, chaque information peut être écouté en un seul clic.
              </p>
              <div className="audio-features">
                <div className="audio-feature-item">
                  <span className="audio-feature-icon">🗣️</span>
                  <span>Lecture vocale automatique des prix</span>
                </div>
                <div className="audio-feature-item">
                  <span className="audio-feature-icon">🌍</span>
                  <span>Disponible en français, dioula et baoulé</span>
                </div>
                <div className="audio-feature-item">
                  <span className="audio-feature-icon">📱</span>
                  <span>Fonctionne même avec une faible connexion</span>
                </div>
                <div className="audio-feature-item">
                  <span className="audio-feature-icon">🔔</span>
                  <span>Notifications vocales des nouveaux prix</span>
                </div>
              </div>
              <button className="btn btn-primary btn-lg" onClick={playDemo} style={{ marginTop: 'var(--space-lg)' }}>
                {demoPlaying ? '⏹️ Arrêter la démo' : '🎧 Essayer la démo audio'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ============ BENEFITS MERCHANTS ============ */}
      <section id="avantages" className="section" style={{ background: 'white' }}>
        <div className="container">
          <h2 className="section-title text-center">Pour les commerçantes du marché 👩🏾‍🦱</h2>
          <p className="section-subtitle text-center">
            Une application faite pour vous, simple comme un appel téléphonique.
          </p>
          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon">🔍</div>
              <h3>Trouvez les meilleurs prix</h3>
              <p>Comparez les prix de dizaines de fournisseurs en un clic. Économisez sur chaque achat.</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">🔊</div>
              <h3>Tout est audio</h3>
              <p>Pas besoin de lire. Appuyez sur le bouton et l'app vous parle.</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">⭐</div>
              <h3>Fournisseurs fiables</h3>
              <p>Tous les fournisseurs sont vérifiés. Achetez en toute confiance.</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">📞</div>
              <h3>Contactez directement</h3>
              <p>Appelez ou envoyez un message WhatsApp au fournisseur en un seul clic.</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">📊</div>
              <h3>Suivez le marché</h3>
              <p>Recevez un résumé vocal quotidien des tendances de prix.</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">💰</div>
              <h3>Gratuit</h3>
              <p>L'application est gratuite pour les commerçantes.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ BENEFITS SUPPLIERS ============ */}
      <section className="section">
        <div className="container">
          <h2 className="section-title text-center">Pour les fournisseurs 🚛</h2>
          <p className="section-subtitle text-center">
            Atteignez des centaines de commerçantes facilement.
          </p>
          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon">📢</div>
              <h3>Publiez vos produits</h3>
              <p>Mettez votre catalogue en ligne avec photos, prix et audio en quelques minutes.</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">🎯</div>
              <h3>Clients ciblés</h3>
              <p>Vos produits sont montrés aux commerçantes qui cherchent exactement ce que vous vendez.</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">📈</div>
              <h3>Augmentez vos ventes</h3>
              <p>Recevez des demandes d'achat directement dans l'application.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ AI + ACCESSIBILITY ============ */}
      <section className="section ai-section" style={{ background: 'var(--bg-dark)', color: 'white' }}>
        <div className="container text-center">
          <h2 className="section-title" style={{ color: 'white' }}>🤖 Intelligence Artificielle + Accessibilité</h2>
          <p className="section-subtitle" style={{ color: 'rgba(255,255,255,0.7)' }}>
            La technologie au service de l'humain.
          </p>
          <div className="ai-grid">
            <div className="ai-card">
              <div className="ai-icon">📊</div>
              <h3>Tendances de prix</h3>
              <p>L'IA analyse les prix pour vous donner des conseils d'achat simples.</p>
            </div>
            <div className="ai-card">
              <div className="ai-icon">🗣️</div>
              <h3>Résumé vocal</h3>
              <p>Recevez chaque matin un résumé audio du marché dans votre langue.</p>
            </div>
            <div className="ai-card">
              <div className="ai-icon">💡</div>
              <h3>Suggestions d'achat</h3>
              <p>L'app vous suggère les meilleurs produits selon vos habitudes.</p>
            </div>
            <div className="ai-card">
              <div className="ai-icon">🌍</div>
              <h3>Multi-langues</h3>
              <p>Français, dioula, baoulé — l'app s'adapte à votre langue.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="section cta-section">
        <div className="container text-center">
          <h2 className="section-title">Prête à révolutionner vos achats ? 🚀</h2>
          <p className="section-subtitle">
            Rejoignez des centaines de commerçantes et fournisseurs qui utilisent déjà Marché+.
          </p>
          <div className="flex-center gap-md" style={{ flexWrap: 'wrap' }}>
            <Link href="/auth/register" className="btn btn-primary btn-lg">
              👩🏾‍🦱 Je suis commerçante
            </Link>
            <Link href="/auth/register" className="btn btn-secondary btn-lg">
              🚛 Je suis fournisseur
            </Link>
          </div>
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section id="faq" className="section" style={{ background: 'white' }}>
        <div className="container">
          <h2 className="section-title text-center">Questions fréquentes ❓</h2>
          <div className="faq-list">
            <FaqItem
              q="Est-ce que Marché+ est gratuit ?"
              a="Oui, l'application est entièrement gratuite pour les commerçantes. Les fournisseurs peuvent souscrire à des options premium pour plus de visibilité."
            />
            <FaqItem
              q="Je ne sais pas lire, puis-je utiliser l'application ?"
              a="Absolument ! Marché+ est spécialement conçue pour être utilisée sans savoir lire. Tous les produits et informations sont disponibles en audio. Il suffit d'appuyer sur les boutons."
            />
            <FaqItem
              q="L'application fonctionne-t-elle avec une faible connexion ?"
              a="Oui, Marché+ est optimisée pour fonctionner même avec une connexion internet limitée. Les données sont compressées et le mode hors-ligne permet de consulter les derniers prix."
            />
            <FaqItem
              q="Comment les fournisseurs sont-ils vérifiés ?"
              a="Chaque fournisseur est vérifié par notre équipe avant d'être approuvé sur la plateforme. Nous vérifions l'identité, la qualité des produits et la fiabilité."
            />
            <FaqItem
              q="Dans quelles langues l'application est-elle disponible ?"
              a="Marché+ est disponible en français, dioula et baoulé. D'autres langues locales seront ajoutées prochainement."
            />
          </div>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="landing-footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="landing-logo" style={{ marginBottom: 'var(--space-md)' }}>
                <span className="logo-emoji">🛒</span>
                <span>Marché<span style={{ color: 'var(--accent)' }}>+</span></span>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.6)' }}>
                La plateforme audio-first pour le commerce alimentaire en Côte d'Ivoire.
              </p>
            </div>
            <div>
              <h4 className="footer-title">Liens</h4>
              <a href="#fonctionnement">Comment ça marche</a>
              <a href="#avantages">Avantages</a>
              <a href="#faq">FAQ</a>
            </div>
            <div>
              <h4 className="footer-title">Contact</h4>
              <a href="tel:+2250700000000">📞 +225 07 00 00 00 00</a>
              <a href="mailto:contact@marche-plus.ci">📧 contact@marche-plus.ci</a>
              <a href="#">📍 Abidjan, Côte d'Ivoire</a>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2026 Marché+. Tous droits réservés.</p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        /* ======= Landing Page Styles ======= */
        .landing-nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 200;
          background: rgba(255, 248, 240, 0.95);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--border-light);
          padding: 12px 0;
        }
        .landing-logo {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 24px;
          font-weight: 800;
          color: var(--primary);
        }
        .logo-emoji { font-size: 28px; }
        .landing-nav-links {
          display: flex;
          align-items: center;
          gap: 24px;
          font-weight: 500;
          font-size: 15px;
        }
        .landing-nav-links a:not(.btn):hover { color: var(--primary); }
        .landing-menu-btn {
          display: none;
          background: none;
          font-size: 24px;
          color: var(--text);
        }
        .landing-mobile-menu {
          display: none;
          flex-direction: column;
          gap: 16px;
          padding: 20px;
          background: white;
          border-top: 1px solid var(--border-light);
        }
        @media (max-width: 768px) {
          .landing-nav-links { display: none; }
          .landing-menu-btn { display: block; }
          .landing-mobile-menu { display: flex; }
        }

        /* Hero */
        .hero-section {
          padding: 140px 0 80px;
          min-height: 100vh;
          display: flex;
          align-items: center;
          background: linear-gradient(135deg, var(--bg) 0%, #FFF0E0 50%, #E8F5E9 100%);
          position: relative;
          overflow: hidden;
        }
        .hero-section::before {
          content: '';
          position: absolute;
          top: -200px;
          right: -200px;
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(224, 122, 47, 0.08), transparent 70%);
          border-radius: 50%;
        }
        .hero-section .container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 48px;
          align-items: center;
        }
        .hero-badge {
          display: inline-block;
          padding: 8px 20px;
          background: rgba(224, 122, 47, 0.1);
          color: var(--primary);
          border-radius: var(--radius-full);
          font-weight: 600;
          font-size: 14px;
          margin-bottom: 20px;
        }
        .hero-title {
          font-size: var(--fs-hero);
          font-weight: 900;
          line-height: 1.1;
          margin-bottom: 20px;
        }
        .hero-gradient {
          background: linear-gradient(135deg, var(--primary), var(--accent));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .hero-subtitle {
          font-size: var(--fs-lg);
          color: var(--text-light);
          line-height: 1.7;
          margin-bottom: 32px;
          max-width: 520px;
        }
        .hero-actions {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
          margin-bottom: 40px;
        }
        .hero-stats {
          display: flex;
          gap: 40px;
        }
        .hero-stat-value {
          display: block;
          font-size: 28px;
          font-weight: 800;
          color: var(--primary);
        }
        .hero-stat-label {
          font-size: 14px;
          color: var(--text-muted);
        }

        /* Phone mockup */
        .hero-phone {
          width: 280px;
          margin: 0 auto;
          background: var(--bg-dark);
          border-radius: 32px;
          padding: 16px;
          box-shadow: var(--shadow-lg);
        }
        .hero-phone-screen {
          background: var(--bg);
          border-radius: 20px;
          padding: 16px;
          min-height: 320px;
        }
        .hero-phone-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-weight: 700;
          font-size: 14px;
          padding-bottom: 12px;
          border-bottom: 1px solid var(--border-light);
          margin-bottom: 12px;
        }
        .hero-phone-product {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px;
          background: white;
          border-radius: 10px;
          margin-bottom: 8px;
          font-size: 13px;
        }
        .hero-phone-emoji { font-size: 28px; }
        .hero-phone-actions {
          display: flex;
          gap: 8px;
          margin-top: 12px;
        }

        @media (max-width: 768px) {
          .hero-section .container {
            grid-template-columns: 1fr;
            text-align: center;
          }
          .hero-subtitle { margin: 0 auto 32px; }
          .hero-actions { justify-content: center; }
          .hero-stats { justify-content: center; }
          .hero-visual { order: -1; }
        }

        /* Steps */
        .steps-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 32px;
          margin-top: 48px;
        }
        .step-card {
          background: var(--bg);
          border-radius: var(--radius-xl);
          padding: 36px 28px;
          text-align: center;
          position: relative;
        }
        .step-number {
          position: absolute;
          top: -15px;
          left: 50%;
          transform: translateX(-50%);
          width: 36px;
          height: 36px;
          background: var(--primary);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 16px;
        }
        .step-icon {
          font-size: 48px;
          margin-bottom: 16px;
        }
        .step-card h3 {
          font-size: var(--fs-lg);
          font-weight: 700;
          margin-bottom: 8px;
        }
        .step-card p {
          color: var(--text-light);
          font-size: var(--fs-sm);
          line-height: 1.6;
        }
        @media (max-width: 768px) {
          .steps-grid { grid-template-columns: 1fr; }
        }

        /* Audio demo */
        .audio-demo-section {
          background: linear-gradient(135deg, var(--bg-dark) 0%, #2A2A40 100%);
          position: relative;
          overflow: hidden;
        }
        .audio-demo-section::before {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          width: 50%;
          height: 100%;
          background: radial-gradient(circle at 80% 50%, rgba(224, 122, 47, 0.12), transparent 60%);
        }
        .audio-features {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .audio-feature-item {
          display: flex;
          align-items: center;
          gap: 16px;
          color: rgba(255,255,255,0.9);
          font-size: var(--fs-base);
          font-weight: 500;
        }
        .audio-feature-icon {
          font-size: 28px;
        }

        /* Benefits grid */
        .benefits-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          margin-top: 40px;
        }
        .benefit-card {
          padding: 32px 24px;
          border-radius: var(--radius-xl);
          border: 1px solid var(--border-light);
          transition: var(--transition);
        }
        .benefit-card:hover {
          border-color: var(--primary-light);
          box-shadow: var(--shadow-md);
          transform: translateY(-4px);
        }
        .benefit-icon {
          font-size: 40px;
          margin-bottom: 16px;
        }
        .benefit-card h3 {
          font-size: var(--fs-lg);
          font-weight: 700;
          margin-bottom: 8px;
        }
        .benefit-card p {
          color: var(--text-light);
          font-size: var(--fs-sm);
          line-height: 1.6;
        }
        @media (max-width: 768px) {
          .benefits-grid { grid-template-columns: 1fr; }
        }

        /* AI Section */
        .ai-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
          margin-top: 40px;
        }
        .ai-card {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: var(--radius-xl);
          padding: 32px 20px;
          text-align: center;
          transition: var(--transition);
        }
        .ai-card:hover {
          background: rgba(255,255,255,0.1);
          transform: translateY(-4px);
        }
        .ai-icon {
          font-size: 40px;
          margin-bottom: 16px;
        }
        .ai-card h3 {
          font-size: var(--fs-base);
          font-weight: 700;
          margin-bottom: 8px;
          color: white;
        }
        .ai-card p {
          color: rgba(255,255,255,0.6);
          font-size: var(--fs-sm);
          line-height: 1.5;
        }
        @media (max-width: 768px) {
          .ai-grid { grid-template-columns: repeat(2, 1fr); }
        }

        /* CTA */
        .cta-section {
          background: linear-gradient(135deg, #FFF0E0--space-md, var(--bg));
          padding: 80px 0;
        }

        /* FAQ */
        .faq-list {
          max-width: 700px;
          margin: 40px auto 0;
        }

        /* Footer */
        .landing-footer {
          background: var(--bg-dark);
          color: white;
          padding: 60px 0 24px;
        }
        .footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr;
          gap: 40px;
          margin-bottom: 40px;
        }
        .footer-title {
          font-size: var(--fs-base);
          font-weight: 700;
          margin-bottom: 16px;
          color: var(--primary-light);
        }
        .footer-grid a {
          display: block;
          color: rgba(255,255,255,0.6);
          padding: 4px 0;
          font-size: 14px;
          transition: color 0.2s;
        }
        .footer-grid a:hover { color: white; }
        .footer-bottom {
          border-top: 1px solid rgba(255,255,255,0.1);
          padding-top: 20px;
          text-align: center;
          color: rgba(255,255,255,0.4);
          font-size: 13px;
        }
        @media (max-width: 768px) {
          .footer-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  const { speak, isPlaying, stopAudio } = useAudio();

  return (
    <div className="faq-item" style={{
      borderBottom: '1px solid var(--border-light)',
      padding: '20px 0',
    }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          fontSize: 'var(--fs-lg)',
          fontWeight: 600,
          color: 'var(--text)',
          padding: 0,
          fontFamily: 'var(--font)',
        }}
      >
        <span>{q}</span>
        <span style={{ fontSize: '20px', marginLeft: '16px', flexShrink: 0 }}>
          {open ? '−' : '+'}
        </span>
      </button>
      {open && (
        <div style={{ marginTop: '12px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
          <p style={{
            color: 'var(--text-light)',
            lineHeight: 1.6,
            fontSize: 'var(--fs-base)',
            flex: 1,
          }}>
            {a}
          </p>
          <button
            className="audio-btn"
            onClick={() => isPlaying ? stopAudio() : speak(`${q}. ${a}`, 'fr')}
            style={{ flexShrink: 0, width: '40px', height: '40px', fontSize: '18px' }}
          >
            {isPlaying ? '⏹️' : '🔊'}
          </button>
        </div>
      )}
    </div>
  );
}
