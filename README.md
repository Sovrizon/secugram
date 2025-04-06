# 📸 Secugram

**Secugram** est une plateforme web de partage d'images avec chiffrement intégré et contrôle d’accès délégué à un tiers de confiance.  
Elle repose sur une architecture sécurisée incluant un backend FastAPI, un frontend React et une extension Chrome.

---

## ✨ Fonctionnalités

- 🔐 Chiffrement des images côté client
- 🧾 Stockage sécurisé avec contrôle de validité
- ✅ Déchiffrement conditionnel via token
- 👥 Gestion des utilisateurs, authentification simple
- 🧩 Extension Chrome pour gérer les tokens et valider l'accès

---

## 🧱 Architecture

- **Frontend** : React (Vite)
- **Backend** : FastAPI (`/backend`)
- **Tiers de confiance** : FastAPI indépendant (gère les tokens + clés)
- **Extension Chrome** : communication avec le tiers de confiance et l'interface utilisateur

---

## 🚀 Déploiement

### 🌐 Production
- **Frontend** : [secugram.web.app](https://secugram.web.app) (Firebase Hosting)
- **Backend** : [secugram.onrender.com](https://secugram.onrender.com) (Render)
- **Tiers de confiance** : [tiers-de-confiance.onrender.com](https://tiers-de-confiance.onrender.com) (Render)
- **Extension Chrome** : disponible sur le Chrome Web Store

---

## 🛠️ Installation locale

### 1. Cloner le dépôt

```bash
git clone https://github.com/ton-username/secugram.git
cd secugram
```

