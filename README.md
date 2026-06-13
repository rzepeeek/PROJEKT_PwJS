# 💼 JobBoard

Aplikacja internetowa typu Job Board umożliwiająca publikowanie ofert pracy przez rekruterów oraz aplikowanie na nie przez kandydatów.

Projekt został wykonany w ramach przedmiotu Programowanie w Językach Skryptowych.

---

# 🚀 Wykorzystane technologie

- React
- Vite
- JavaScript
- CSS
- React Router
- Supabase

---

# 📋 Funkcjonalności

## Kandydat

- Rejestracja konta
- Logowanie
- Przeglądanie ofert pracy
- Filtrowanie ofert po lokalizacji
- Sortowanie ofert po wynagrodzeniu
- Aplikowanie na wybrane oferty
- Podgląd statusu własnych aplikacji

## Rekruter

- Dodawanie nowych ofert pracy
- Edycja własnych ofert
- Dezaktywacja ofert pracy
- Przegląd aplikacji kandydatów
- Zmiana statusu aplikacji:
  - Oczekuje
  - Przejrzana
  - Zaakceptowana
  - Odrzucona

---

# 🔒 Mechanizmy bezpieczeństwa

- Autoryzacja użytkowników za pomocą Supabase Auth
- Ochrona wybranych tras przy użyciu komponentu ProtectedRoute
- Ograniczenie dostępu do stron w zależności od roli użytkownika
- Blokada wielokrotnego aplikowania na tę samą ofertę
- Możliwość edycji ofert wyłącznie przez ich autora

---

# 🗄️ Struktura bazy danych

## profiles

Przechowuje dane użytkowników:

- id
- full_name
- role
- created_at

## job_postings

Przechowuje oferty pracy:

- id
- recruiter_id
- company
- position
- location
- salary_min
- salary_max
- description
- is_active
- posted_at
- created_at

## applications

Przechowuje aplikacje kandydatów:

- id
- job_id
- candidate_id
- applicant_name
- applicant_email
- cover_letter
- status
- applied_at

---

# 📁 Struktura projektu

```text
src
├── components
│   ├── Navbar.jsx
│   └── ProtectedRoute.jsx
│
├── pages
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Dashboard.jsx
│   ├── Jobs.jsx
│   ├── JobDetails.jsx
│   ├── NewJob.jsx
│   ├── EditJob.jsx
│   └── Apply.jsx
│
├── services
│   └── supabase.js
│
├── App.jsx
├── App.css
├── index.css
└── main.jsx
```

---

# 📄 Opis plików projektu

## main.jsx

Punkt wejścia aplikacji React. Odpowiada za uruchomienie projektu oraz wyrenderowanie głównego komponentu App.

## App.jsx

Zawiera konfigurację routingu aplikacji z wykorzystaniem React Router. Definiuje wszystkie dostępne ścieżki oraz przypisane do nich komponenty.

## App.css

Plik zawierający style wykorzystywane w aplikacji.

## index.css

Globalne style aplikacji odpowiedzialne za wygląd tła, formularzy, przycisków, kart oraz pozostałych elementów interfejsu.

## services/supabase.js

Odpowiada za konfigurację połączenia z bazą danych Supabase oraz autoryzację użytkowników.

## components/Navbar.jsx

Komponent odpowiedzialny za wyświetlanie paska nawigacyjnego oraz obsługę wylogowania użytkownika.

## components/ProtectedRoute.jsx

Komponent zabezpieczający wybrane podstrony przed dostępem osób niezalogowanych.

## pages/Login.jsx

Strona logowania użytkownika.

## pages/Register.jsx

Strona rejestracji nowych użytkowników wraz z wyborem roli (kandydat lub rekruter).

## pages/Dashboard.jsx

Panel użytkownika. Wyświetla różne informacje w zależności od roli zalogowanej osoby.

## pages/Jobs.jsx

Strona prezentująca wszystkie aktywne oferty pracy. Umożliwia filtrowanie oraz sortowanie ofert.

## pages/JobDetails.jsx

Wyświetla szczegółowe informacje o wybranej ofercie pracy. Pozwala aplikować na ofertę lub zarządzać aplikacjami kandydatów.

## pages/NewJob.jsx

Formularz umożliwiający dodawanie nowych ofert pracy przez rekrutera.

## pages/EditJob.jsx

Formularz służący do edycji istniejących ofert pracy oraz ich dezaktywacji.

## pages/Apply.jsx

Formularz umożliwiający kandydatowi wysłanie aplikacji na wybraną ofertę pracy.

## public/

Folder przechowujący publiczne zasoby aplikacji.

## assets/

Folder zawierający grafiki, ikony oraz pozostałe pliki wykorzystywane w interfejsie użytkownika.

## package.json

Plik konfiguracyjny projektu zawierający informacje o zależnościach oraz skryptach wykorzystywanych przez aplikację.

## vite.config.js

Konfiguracja środowiska Vite odpowiedzialnego za budowanie i uruchamianie projektu.

## eslint.config.js

Konfiguracja narzędzia ESLint odpowiedzialnego za analizę i kontrolę jakości kodu.

## index.html

Główny plik HTML aplikacji, do którego renderowany jest projekt React.

---

# ⚙️ Uruchomienie projektu

## 1. Sklonowanie repozytorium

```bash
git clone https://github.com/rzepeeek/PROJEKT_PwJS.git
```

## 2. Przejście do katalogu projektu

```bash
cd PROJEKT_PwJS/JobBoard
```

## 3. Instalacja zależności

```bash
npm install
```

## 4. Konfiguracja Supabase

W pliku:

```text
src/services/supabase.js
```

należy uzupełnić:

```javascript
const supabaseUrl = "WLASNY_URL";
const supabaseKey = "WLASNY_KLUCZ";
```

danymi własnego projektu Supabase.

## 5. Uruchomienie aplikacji

```bash
npm run dev
```

Po uruchomieniu aplikacja będzie dostępna pod adresem:

```text
http://localhost:5173
```

---

# 📷 Dokumentacja

Pełna dokumentacja projektu oraz zrzuty ekranu znajdują się w raporcie projektowym.

---

# 👨‍💻 Autor

Dawid Rzepka  
Nr albumu: 21299
