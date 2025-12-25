# 🌌 OmniTrade Pulse - AI Market Sentinel

**OmniTrade Pulse** est un dashboard financier nouvelle génération propulsé par l'IA (Gemini 3 Pro + Flash). Il croise les "Hard Data" (Prix, RSI, consensus Zacks/Seeking Alpha) avec les "Soft Data" (Sentiment FinTwit) pour générer des signaux d'alpha uniques.

![App Screenshot](https://via.placeholder.com/800x400.png?text=OmniTrade+Pulse+Dashboard)

## 🚀 Installation Locale (Guide "Sans IA")

Vous souhaitez faire tourner cette application sur votre propre machine ? Suivez ce guide pas à pas.

### 1. Prérequis
Assurez-vous d'avoir installé :
*   **Node.js** (version 18 ou supérieure) : [Télécharger ici](https://nodejs.org/)
*   **Git** (optionnel, pour cloner) : [Télécharger ici](https://git-scm.com/)
*   **Une Clé API Gemini** (Gratuite) : [Obtenir ici](https://aistudio.google.com/app/apikey)

### 2. Récupérer le Code
Ouvrez votre terminal (PowerShell ou Invite de commandes) et clonez ce dépôt :

```bash
git clone https://github.com/Innocase-ai/Sentiment-march-.git
cd "Sentiment de marché"
```
*(Ou téléchargez simplement le dossier ZIP et extrayez-le)*

### 3. Installer les Dépendances
Installez les bibliothèques nécessaires (React, Vite, Google GenAI SDK...) :

```bash
npm install
```

### 4. Lancer l'Application
Démarrez le serveur de développement local :

```bash
npm run dev
```
Le terminal affichera une adresse locale, généralement `http://localhost:5173` ou `http://localhost:3000`. Cliquez dessus (Ctrl+Clic) pour ouvrir dans votre navigateur.

### 5. Configuration de la Clé API
Au premier lancement, une fenêtre vous demandera votre **Clé API Gemini**.
*   Collez votre clé commençant par `AIza...`.
*   L'application la sauvegardera localement dans votre navigateur (LocalStorage).
*   *Alternativement*, vous pouvez créer un fichier `.env` à la racine et ajouter : `VITE_GEMINI_API_KEY=votre_cle_ici`.

---

## 🛠️ Fonctionnalités Clés

*   **Intelligence Hybride** : Fusion des données techniques (Zacks, Seeking Alpha) et du sentiment social (FinTwit).
*   **Chain of Thought** : Visualisez le raisonnement de l'IA via le bouton "Architecture IA".
*   **Live News** : Flux d'actualités en temps réel avec illustrations générées par IA.
*   **Robustesse** : Système tolérant aux pannes (ErrorBoundary, JSON Sanitization) pour une stabilité maximale.

## 🏗️ Commandes Utiles

*   `npm run dev` : Lance le serveur de développement.
*   `npm run build` : Compile l'application pour la production.
*   `npm run preview` : Prévisualise la version de production localement.

---

*Développé avec ❤️ par l'équipe OmniTrade.*
