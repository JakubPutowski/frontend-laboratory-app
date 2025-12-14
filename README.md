# Gra w Kółko i Krzyżyk

Aplikacja webowa do gry w kółko i krzyżyk zbudowana z użyciem Next.js, Firebase i Tailwind CSS.

## 🎮 Funkcje

- **Uwierzytelnianie użytkowników** - Rejestracja i logowanie przez Firebase Authentication
- **Autoryzacja** - Chronione ścieżki dostępne tylko dla zalogowanych użytkowników
- **Gra w kółko i krzyżyk** - Pełna implementacja gry z zapisem do Firestore
- **Profil użytkownika** - Zarządzanie danymi użytkownika i adresem
- **Historia gier** - Lista wszystkich gier użytkownika
- **Responsywny design** - Działa na urządzeniach mobilnych, tabletach i monitorach

## 🛠️ Technologie

- **Next.js 16** - Framework React z App Router
- **Firebase** - Authentication i Firestore
- **Tailwind CSS 4** - Stylowanie
- **React Icons** - Ikony
- **Playwright** - Testy end-to-end

## 📋 Wymagania

- Node.js 18+ 
- npm lub yarn
- Konto Firebase z projektem

## 🚀 Instalacja

1. Sklonuj repozytorium:
```bash
git clone <url-repozytorium>
cd frontend-laboratory-app
```

2. Zainstaluj zależności:
```bash
npm install
```

3. Utwórz plik `.env.local` z konfiguracją Firebase:
```env
NEXT_PUBLIC_API_KEY=your-api-key
NEXT_PUBLIC_AUTH_DOMAIN=your-auth-domain
NEXT_PUBLIC_PROJECT_ID=your-project-id
NEXT_PUBLIC_STORAGE_BUCKET=your-storage-bucket
NEXT_PUBLIC_MESSAGING_SENDER_ID=your-messaging-sender-id
NEXT_PUBLIC_APP_ID=your-app-id
```

4. Uruchom serwer deweloperski:
```bash
npm run dev
```

Aplikacja będzie dostępna pod adresem [http://localhost:3000](http://localhost:3000)

## 🧪 Testy

Uruchom testy Playwright:
```bash
npx playwright test
```

## 📦 Build produkcyjny

```bash
npm run build
npm start
```

## 🚀 Deployment

Aplikacja może być wdrożona na Firebase Hosting:

```bash
firebase deploy --only hosting
```

Wymagany jest plan Firebase Blaze (pay-as-you-go) dla dynamicznych routów Next.js.

## 📁 Struktura projektu

```
app/
├── (protected)/          # Chronione ścieżki (wymagają logowania)
│   ├── games/             # Lista gier i pojedyncza gra
│   └── user/              # Profil i wylogowanie
├── (public)/              # Publiczne ścieżki
│   └── user/              # Logowanie, rejestracja, weryfikacja
├── about/                 # Strona "O aplikacji"
├── components/            # Komponenty (AppShell, Header)
└── lib/                   # Konfiguracja Firebase i logika biznesowa
```

## 👤 Autor

Jakub Putowski

## 📄 Licencja

Projekt prywatny
