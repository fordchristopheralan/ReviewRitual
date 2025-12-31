# ReviewRitual

**The weekly review system that won't let you skip.**

A personal accountability app that transforms your weekly review from a document you forget to a habit you can't skip.

## Features (MVP)

- 📋 **5-Part Review Workflow** - Digitized weekly review template
- 🔥 **Streak Tracking** - Visual motivation with heatmap calendar
- ⏰ **Smart Reminders** - Escalating notifications that won't let you skip
- 📚 **Review History** - Searchable archive of all past reviews
- ✅ **Completion Checklist** - Ensure nothing gets missed
- 📱 **PWA Support** - Installable on mobile devices

## Tech Stack

- **Frontend:** Next.js 14 + React + TypeScript
- **Styling:** Tailwind CSS
- **Backend/Auth:** Supabase
- **Hosting:** Vercel
- **Email:** Resend

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Vercel account (for deployment)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/review-ritual.git
cd review-ritual
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file:
```bash
cp .env.example .env.local
```

4. Fill in your environment variables:
```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
RESEND_API_KEY=your-resend-api-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

5. Set up the database:
```bash
# Push the schema to Supabase
npx supabase db push
```

6. Run the development server:
```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Dashboard
│   ├── review/            # Review flow (5 steps)
│   │   ├── 1-clear/       # Clear the Decks
│   │   ├── 2-commit/      # Review Commitments
│   │   ├── 3-ahead/       # Look Ahead
│   │   ├── 4-protect/     # Protect Your Time
│   │   ├── 5-reflect/     # Quick Reflection
│   │   └── complete/      # Completion checklist
│   └── layout.tsx
├── components/
│   ├── ui/                # Reusable UI components
│   ├── dashboard/         # Dashboard-specific components
│   └── review/            # Review flow components
├── lib/
│   ├── supabase/          # Supabase clients
│   └── utils/             # Utility functions
├── hooks/                 # Custom React hooks
└── types/                 # TypeScript types
```

## Brand Colors

- **Coach Charcoal:** `#1A1A1A`
- **Focus Orange:** `#E85A24`
- **Streak Gold:** `#F5B800`
- **Success Green:** `#22C55E`
- **Warning Red:** `#EF4444`

## License

Private - Personal use only

---

Built with ❤️ for accountability
