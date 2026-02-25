const { getDb } = require('./db');
const { v4: uuidv4 } = require('uuid');
const bcryptjs = require('bcryptjs');

async function seed() {
    const db = getDb();

    console.log('🌱 Seeding database...');

    // Categories
    const categories = [
        { id: uuidv4(), name: 'Fruits', icon: '🍊', audio_label_fr: 'Fruits frais', sort_order: 1 },
        { id: uuidv4(), name: 'Légumes', icon: '🥬', audio_label_fr: 'Légumes frais', sort_order: 2 },
        { id: uuidv4(), name: 'Céréales', icon: '🌾', audio_label_fr: 'Céréales et grains', sort_order: 3 },
        { id: uuidv4(), name: 'Tubercules', icon: '🥔', audio_label_fr: 'Tubercules', sort_order: 4 },
        { id: uuidv4(), name: 'Huiles', icon: '🫒', audio_label_fr: 'Huiles alimentaires', sort_order: 5 },
        { id: uuidv4(), name: 'Épices', icon: '🌶️', audio_label_fr: 'Épices et condiments', sort_order: 6 },
        { id: uuidv4(), name: 'Poissons', icon: '🐟', audio_label_fr: 'Poissons et fruits de mer', sort_order: 7 },
        { id: uuidv4(), name: 'Viandes', icon: '🥩', audio_label_fr: 'Viandes', sort_order: 8 },
    ];

    const insertCategory = db.prepare(
        'INSERT OR IGNORE INTO categories (id, name, icon, audio_label_fr, sort_order) VALUES (?, ?, ?, ?, ?)'
    );

    for (const cat of categories) {
        insertCategory.run(cat.id, cat.name, cat.icon, cat.audio_label_fr, cat.sort_order);
    }
    console.log('✅ Categories seeded');

    // Users
    const passwordHash = await bcryptjs.hash('password123', 10);

    const users = [
        {
            id: uuidv4(), name: 'Aminata Koné', phone: '+2250701000001',
            email: 'aminata@demo.ci', password_hash: passwordHash, role: 'merchant',
            business_name: 'Marché Adjamé', location: 'Adjamé, Abidjan', verified: 1,
        },
        {
            id: uuidv4(), name: 'Fatou Diallo', phone: '+2250701000002',
            email: 'fatou@demo.ci', password_hash: passwordHash, role: 'merchant',
            business_name: 'Boutique Fatou', location: 'Cocody, Abidjan', verified: 1,
        },
        {
            id: uuidv4(), name: 'Ibrahim Traoré', phone: '+2250701000003',
            email: 'ibrahim@demo.ci', password_hash: passwordHash, role: 'supplier',
            business_name: 'Agri-Fresh CI', location: 'Bouaké', verified: 1,
        },
        {
            id: uuidv4(), name: 'Kouadio Jean', phone: '+2250701000004',
            email: 'kouadio@demo.ci', password_hash: passwordHash, role: 'supplier',
            business_name: 'Ferme du Sud', location: 'San Pedro', verified: 1,
        },
        {
            id: uuidv4(), name: 'Mariame Coulibaly', phone: '+2250701000005',
            email: 'mariame@demo.ci', password_hash: passwordHash, role: 'supplier',
            business_name: 'Épices Sahel', location: 'Korhogo', verified: 1,
        },
        {
            id: uuidv4(), name: 'Admin Marché+', phone: '+2250700000000',
            email: 'admin@marche-plus.ci', password_hash: passwordHash, role: 'admin',
            business_name: 'Marché+ Admin', location: 'Abidjan', verified: 1,
        },
    ];

    const insertUser = db.prepare(
        `INSERT OR IGNORE INTO users (id, name, phone, email, password_hash, role, business_name, location, verified)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    );

    for (const u of users) {
        insertUser.run(u.id, u.name, u.phone, u.email, u.password_hash, u.role, u.business_name, u.location, u.verified);
    }
    console.log('✅ Users seeded');

    // Get supplier IDs
    const suppliers = db.prepare("SELECT id, name FROM users WHERE role = 'supplier'").all();
    const catMap = {};
    for (const c of categories) {
        catMap[c.name] = c.id;
    }

    // Products
    const products = [
        { name: 'Banane Plantain', description: 'Banane plantain mûre de qualité supérieure', price: 500, unit: 'kg', category: 'Fruits', supplier: 0 },
        { name: 'Mangue Kent', description: 'Mangue Kent sucrée et juteuse', price: 750, unit: 'kg', category: 'Fruits', supplier: 0 },
        { name: 'Ananas Pain de Sucre', description: 'Ananas frais cultivé localement', price: 1000, unit: 'pièce', category: 'Fruits', supplier: 0 },
        { name: 'Tomate Fraîche', description: 'Tomate fraîche rouge et ferme', price: 400, unit: 'kg', category: 'Légumes', supplier: 1 },
        { name: 'Oignon Rouge', description: 'Oignon rouge de qualité', price: 350, unit: 'kg', category: 'Légumes', supplier: 1 },
        { name: 'Piment Frais', description: 'Piment frais très piquant', price: 600, unit: 'kg', category: 'Légumes', supplier: 1 },
        { name: 'Aubergine', description: 'Aubergine locale fraîche', price: 300, unit: 'kg', category: 'Légumes', supplier: 0 },
        { name: 'Riz Parfumé', description: 'Riz long grain parfumé premium', price: 850, unit: 'kg', category: 'Céréales', supplier: 0 },
        { name: 'Maïs Sec', description: 'Maïs sec pour farine ou grillé', price: 450, unit: 'kg', category: 'Céréales', supplier: 1 },
        { name: 'Igname Blanche', description: 'Igname blanche de première qualité', price: 600, unit: 'kg', category: 'Tubercules', supplier: 0 },
        { name: 'Manioc Frais', description: 'Manioc frais pour attiéké ou foutou', price: 250, unit: 'kg', category: 'Tubercules', supplier: 1 },
        { name: 'Patate Douce', description: 'Patate douce orange sucrée', price: 400, unit: 'kg', category: 'Tubercules', supplier: 0 },
        { name: 'Huile de Palme', description: 'Huile de palme rouge artisanale', price: 1200, unit: 'litre', category: 'Huiles', supplier: 1 },
        { name: 'Huile d\'Arachide', description: 'Huile d\'arachide pure pressée à froid', price: 1500, unit: 'litre', category: 'Huiles', supplier: 0 },
        { name: 'Poivre Noir', description: 'Poivre noir moulu du terroir', price: 2000, unit: 'kg', category: 'Épices', supplier: 2 },
        { name: 'Gingembre Frais', description: 'Gingembre frais pour cuisine et jus', price: 800, unit: 'kg', category: 'Épices', supplier: 2 },
        { name: 'Soumbala', description: 'Soumbala traditionnel fermenté', price: 1500, unit: 'kg', category: 'Épices', supplier: 2 },
        { name: 'Tilapia Frais', description: 'Tilapia frais pêché du jour', price: 2500, unit: 'kg', category: 'Poissons', supplier: 1 },
        { name: 'Maquereau Fumé', description: 'Maquereau fumé traditionnel', price: 3000, unit: 'kg', category: 'Poissons', supplier: 1 },
        { name: 'Poulet Local', description: 'Poulet fermier élevé en plein air', price: 3500, unit: 'pièce', category: 'Viandes', supplier: 0 },
    ];

    const insertProduct = db.prepare(
        `INSERT OR IGNORE INTO products (id, supplier_id, category_id, name, description, price, unit, image)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    );

    const insertTranslation = db.prepare(
        `INSERT OR IGNORE INTO audio_translations (id, product_id, language, tts_text)
     VALUES (?, ?, ?, ?)`
    );

    for (const p of products) {
        const productId = uuidv4();
        const supplierId = suppliers[p.supplier]?.id || suppliers[0].id;
        insertProduct.run(
            productId, supplierId, catMap[p.category],
            p.name, p.description, p.price, p.unit, null
        );
        // French TTS text
        insertTranslation.run(
            uuidv4(), productId, 'fr',
            `${p.name}. ${p.description}. Prix: ${p.price} francs CFA le ${p.unit}. Fournisseur: ${suppliers[p.supplier]?.name || suppliers[0].name}`
        );
    }
    console.log('✅ Products seeded');

    // Market summaries
    const insertSummary = db.prepare(
        `INSERT OR IGNORE INTO market_summaries (id, category_id, summary_text, date)
     VALUES (?, ?, ?, date('now'))`
    );

    insertSummary.run(uuidv4(), catMap['Fruits'],
        'Les prix des fruits sont stables cette semaine. La banane plantain reste à 500 francs le kilo. La mangue Kent est en baisse à 750 francs. C\'est le bon moment pour acheter des mangues.');
    insertSummary.run(uuidv4(), catMap['Légumes'],
        'Les légumes sont en hausse légère. La tomate est passée de 350 à 400 francs. L\'oignon rouge reste stable à 350 francs le kilo.');
    insertSummary.run(uuidv4(), null,
        'Résumé général du marché: Les prix sont globalement stables cette semaine. Les fruits sont en légère baisse, bonne opportunité d\'achat. Les épices restent stables. Le poisson frais est en hausse saisonnière.');

    console.log('✅ Market summaries seeded');
    console.log('🎉 Database seeded successfully!');
}

seed().catch(console.error);
