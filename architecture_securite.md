# Architecture de Sécurité & Système de Vérification (KYC Léger)

Ce document décrit l'architecture complète pour sécuriser la plateforme "Marché Plus", avec un focus sur la vérification des fournisseurs (commerçants) tout en gardant une UX simple et adaptée (mobile-first, faible connexion, audio).

## 1. Schéma de Base de Données Optimisé (SQLite)

Le schéma suivant étend la structure existante en ajoutant des tables spécifiques pour la sécurité et la vérification.

### Table `users`
- `id` (UUID - Primary Key)
- `role` (TEXT: 'merchant', 'supplier', 'admin')
- `first_name` (TEXT)
- `last_name` (TEXT)
- `phone` (TEXT - Unique, servant d'identifiant principal)
- `phone_verified_at` (DATETIME - Nullable)
- `merchant_card_number` (TEXT - Nullable)
- `merchant_verified` (INTEGER: 0 ou 1)
- `status` (TEXT: 'unverified', 'pending', 'active', 'suspended')
- `password_hash` (TEXT - Hashé avec bcrypt)
- `last_login_at` (DATETIME - Nullable)
- `created_at` / `updated_at`

### Table `otp_codes`
- `id` (UUID - Primary Key)
- `user_id` (TEXT - Foreign Key `users.id`)
- `code_hash` (TEXT - Hash de l'OTP, jamais en clair)
- `expires_at` (DATETIME - Expiration après 5 ou 10 minutes)
- `attempts` (INTEGER - Max 3 tentatives avant invalidation)
- `channel` (TEXT: 'whatsapp', 'sms')
- `created_at` (DATETIME)

### Table `merchant_verifications`
- `id` (UUID - Primary Key)
- `user_id` (TEXT - Foreign Key)
- `merchant_card_image` (TEXT - URL ou chemin vers l'image, stockée de manière sécurisée)
- `otp_reference` (TEXT - Reférence au jeton OTP validé avec l'image)
- `verification_status` (TEXT: 'pending', 'approved', 'rejected')
- `reviewed_by` (TEXT - Foreign Key `users.id` de l'admin)
- `reviewed_at` (DATETIME)
- `created_at` (DATETIME)

### Table `security_logs`
- `id` (UUID)
- `user_id` (TEXT - Nullable, pour les tentatives anonymes)
- `action` (TEXT: 'login_success', 'login_failed', 'otp_requested', 'verification_submitted')
- `ip_address` (TEXT)
- `device_fingerprint` (TEXT - User-Agent ou hash matériel basique)
- `risk_score` (INTEGER - Score de risque calculé)
- `created_at` (DATETIME)

## 2. Processus de Vérification (Workflow KYC Léger)

Pour s'adapter à une population peu lettrée, le processus est visuel, guidé par la voix et divisé en étapes courtes.

**Étape 1 : Inscription (Friction faible)**
- L'utilisateur entre Nom, Prénom, Téléphone, Mot de passe, et le Rôle.
- Le compte est créé avec le statut `unverified`.

**Étape 2 : Vérification Téléphone (Protection Bots & Spam)**
- Un OTP à 6 chiffres est généré. Son hash est stocké dans `otp_codes`.
- L'OTP est envoyé via l'API WhatsApp (avec fallback SMS).
- L'utilisateur saisit le code. Un clavier numérique large s'affiche sur mobile. Un guidage audio ("Veuillez entrer le code reçu sur WhatsApp") l'accompagne.
- *Validation* : Si correct, `users.status` passe de `unverified` à `pending`. `phone_verified_at` est mis à jour.

**Étape 3 : Soumission KYC (Avant ajout de premier produit)**
- L'utilisateur accède à la page "Ajouter un produit" ou "Vérifier le profil".
- **UX Appareil Photo** : On demande à l'utilisateur de prendre en photo sa carte de commerçant AVEC le numéro de téléphone ou un code écrit à côté (preuve d'en-cours).
- L'image est compressée côté client (faible bande passante) et uploadée.
- Une entrée est créée dans `merchant_verifications` avec le statut `pending`.

**Étape 4 : Validation Admin (Back-office)**
- L'administrateur voit le tableau de bord des demandes en attente.
- Il compare le nom, le prénom, le numéro de carte (extrait de la photo ou saisi) avec ceux de la base.
- S'il approuve : `users.merchant_verified` = 1, `users.status` = 'active'.
- S'il rejette : `verification_status` = 'rejected', notification WhatsApp/Audio envoyée au fournisseur avec le motif.

## 3. Stratégies Anti-Fraude & Sécurité

### Sécurité API (Authentification)
- **JWT & Refresh Tokens** : Les connexions délivrent un Access Token (durée courte : 15 min) et un Refresh Token (durée longue : 7 jours, stocké en base ou dans un cookie `HttpOnly`).
- **Gestion Rôles (RBAC)** : Chaque route API vérifie le rôle d'ancrage (`merchant`, `supplier`, `admin`). Les routes d'ajout de produit requièrent `supplier` ET `status === 'active'`.

### Protection Contre les Attaques
- **Brute Force Login & OTP** : 
  - Limite de 3 tentatives de mot de passe par tranche de 5 mins.
  - Limite de 3 erreurs de saisie d'OTP (table `otp_codes.attempts`). Après 3 échecs, un nouvel OTP doit être généré. Rate limit sur la génération (ex: 1 OTP max par minute).
- **Protection Bot** : Utilisation de tokens CSRF et/ou vérification stricte du `User-Agent`. En cas d'incohérence, blocage IP (table `security_logs`).
- **Hash des Données** : Mot de passe hashé avec `bcrypt` (déjà en place, recommandé de passer le salt factor à 12). Les OTP sont hashés en BD pour éviter qu'une fuite de DB ne permette de valider des comptes à la volée.

### Vérification Anti-Réutilisation d'Image
- Les images téléchargées (`merchant_card_image`) peuvent faire l'objet d'un hachage SHA-256 (perceptual hash ou simple hash fichier).
- Avant d'accepter l'upload, la DB vérifie que le hash de cette image n'existe pas déjà (bloque les utilisateurs qui s'échangent la même photo de carte via WhatsApp).

## 4. Contraintes Produit (Mobile First & Audio)
- Le processus d'OTP contiendra des boutons de lecture audio ("Cliquez ici pour obtenir le code", "Vous avez rentré un mauvais code").
- Les statuts de compte utiliseront des codes couleurs (Rouge=Bloqué, Orange=En Vérification, Vert=Actif) couplés à des icônes explicites (Cadenas, Sablier, Check).
- Les images de vérification seront redimensionnées via Canvas JS côté client (ex: 800x600 px) avant l'envoi au serveur pour convenir aux connexions Edge/3G.
