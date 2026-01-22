# Ad Script Generator

An AI-powered tool for generating video ad scripts for paid creative campaigns. Built with Next.js, Prisma, SQLite, and Claude AI.

## Features

- **Project Management**: Store product details, target audience, tone, and examples
- **Script Formats**: Create reusable templates for different ad styles (UGC, Problem-Solution, etc.)
- **AI Generation**: Generate 5 unique script variations instantly using Claude AI
- **Iterative Refinement**: Regenerate hooks or bodies independently while keeping other parts
- **Script Library**: Save and organize your favorite scripts
- **Sharing**: Generate shareable links for clients and team members
- **Idea Capture**: Quick intake for future script and format ideas

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Database**: SQLite with Prisma ORM
- **AI**: Anthropic Claude (Sonnet 4.5)
- **Styling**: Tailwind CSS
- **State**: Zustand with persistence
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Anthropic API key ([get one here](https://console.anthropic.com/))

### Installation

1. Clone the repository and navigate to the project directory

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Then edit `.env` and add your Anthropic API key:
```
ANTHROPIC_API_KEY="your-actual-api-key-here"
```

4. Initialize the database:
```bash
npm run db:push
npm run db:seed
```

5. Start the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### 1. Create a Project

- Go to Projects → Create Project
- Fill in product details, target audience, tone
- Optionally add example scripts to guide AI generation

### 2. Define Script Formats

- Go to Formats → Create Format
- Describe the structure (e.g., "Hook → Problem → Solution → CTA")
- Add visual description for editor briefs
- Choose if format is global or project-specific

### 3. Generate Scripts

- Select a project → Generate Scripts
- Choose a format
- Optionally add batch-specific instructions (e.g., "focus on pricing")
- Click "Generate 5 Scripts"
- Wait ~10-30 seconds for AI to generate variations

### 4. Refine Scripts

- Click the regenerate icon next to Hook or Body
- Keep iterating until you have the perfect script
- Save your favorites to the library

### 5. Share Scripts

- Open any saved script from the library
- Copy the share link
- Share with team members or clients (no login required)

## Database Management

### Development (Fast Iteration)

When actively changing the schema:
```bash
npm run db:push
```

This syncs your schema directly to the database (destroys data).

### Production (Preserve Data)

Once schema stabilizes:
```bash
npm run db:migrate
```

This creates migration files and preserves existing data.

### Other Commands

```bash
npm run db:studio   # Open Prisma Studio to view/edit data
npm run db:reset    # Reset database and run migrations
npm run db:seed     # Seed with sample data
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables:
   - `ANTHROPIC_API_KEY`
   - `NEXT_PUBLIC_BASE_URL` (your Vercel URL)
4. For database, either:
   - **Option A**: Use Turso (SQLite edge database)
   - **Option B**: Migrate to Vercel Postgres

### Database Migration for Production

To migrate from SQLite to PostgreSQL:

1. Update `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

2. Run migrations:
```bash
npm run db:migrate
```

No code changes needed - Prisma handles the rest!

## Project Structure

```
gen-ad-scripts/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── projects/          # Project pages
│   ├── formats/           # Format pages
│   ├── library/           # Saved scripts
│   ├── share/             # Public script view
│   └── ideas/             # Idea intake
├── components/            # React components
│   ├── ui/               # Reusable UI primitives
│   ├── projects/         # Project-specific
│   ├── formats/          # Format-specific
│   ├── scripts/          # Generation & display
│   ├── library/          # Library components
│   └── ideas/            # Idea components
├── lib/                  # Utilities
│   ├── ai/              # Claude AI integration
│   ├── db/              # Prisma client
│   ├── store/           # Zustand stores
│   └── utils/           # Helper functions
├── prisma/              # Database
│   ├── schema.prisma    # Data model
│   └── seed.ts          # Sample data
└── public/              # Static assets
```

## Customization

### Design System

Update `tailwind.config.ts` to change colors, spacing, etc:

```typescript
colors: {
  primary: { ... },    // Main brand color
  neutral: { ... },    // Grays
  success: { ... },    // Success states
  danger: { ... },     // Error states
}
```

Changes cascade throughout the entire app.

### AI Model

To use a different Claude model, edit `lib/ai/claude.ts`:

```typescript
model: 'claude-sonnet-4-5-20250929',  // Change this
```

### Prompt Engineering

Customize AI prompts in `lib/ai/claude.ts`:
- `buildPrompt()` - Main generation
- `regenerateHook()` - Hook regeneration
- `regenerateBody()` - Body regeneration

## Cost Estimation

Claude API pricing (as of 2024):
- **Sonnet 4.5**: ~$3 per million input tokens, ~$15 per million output tokens
- Average generation: ~1,500 input + 1,000 output tokens
- **Cost per batch**: ~$0.02

Monthly estimate for 100 generations: ~$2

## Troubleshooting

### "Failed to generate scripts"

- Check that `ANTHROPIC_API_KEY` is set correctly in `.env`
- Verify you have API credits in your Anthropic account
- Check console for detailed error messages

### Database errors

```bash
# Reset and recreate database
rm prisma/dev.db
npm run db:push
npm run db:seed
```

### Build errors

```bash
# Clear Next.js cache
rm -rf .next
npm run dev
```

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.
