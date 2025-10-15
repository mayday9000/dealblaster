# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/084ce1df-0160-4df0-a955-0b47747e08fc

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/084ce1df-0160-4df0-a955-0b47747e08fc) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/084ce1df-0160-4df0-a955-0b47747e08fc) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

## Auth Setup

This project includes **optional** Supabase Authentication with email magic links.

### Environment Variables

Add these to your `.env` file (use `.env.example` as a template):

```
VITE_SUPABASE_URL=https://xqlmeprrvijmcxvbaubq.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_key_here
VITE_APP_NAME=Property Flyer Generator
```

Get your `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` from:
Supabase Dashboard → Project Settings → API

### Supabase Configuration (You Must Do This)

**Lovable cannot configure Supabase for you.** You must:

1. **Enable Email Auth**: Go to Authentication → Providers → Email and enable it
2. **Configure Site URL**: Go to Authentication → URL Configuration and set:
   - Site URL: Your app's URL (e.g., `https://your-app.lovable.app`)
3. **Add Redirect URLs**: Add your app's URL to the allowed redirect URLs list
4. **Disable "Confirm email"** (optional): For faster testing, disable email confirmation in Authentication → Providers → Email

### Using Authentication in Your App

Authentication is **opt-in only**. Nothing is protected by default.

#### To protect a page manually:

```tsx
import { AuthGate } from "@/components/AuthGate";
import { Link } from "react-router-dom";

export default function MyProtectedPage() {
  return (
    <AuthGate fallback={<Link to="/auth">Sign in to continue</Link>}>
      {/* Your page content - only shown to signed-in users */}
      <h1>Protected Content</h1>
    </AuthGate>
  );
}
```

#### To add a header with sign-in/out buttons:

```tsx
import { Header } from "@/components/Header";

export default function MyPage() {
  return (
    <>
      <Header />
      {/* Your page content */}
    </>
  );
}
```

#### To access the current user in any component:

```tsx
import { useSession } from "@/hooks/useSession";

export default function MyComponent() {
  const { session, user, loading } = useSession();
  
  if (loading) return <p>Loading...</p>;
  if (!session) return <p>Not signed in</p>;
  
  return <p>Welcome, {user.email}!</p>;
}
```

### What Lovable Cannot Do

1. **Provision Supabase or configure providers** — You must create the Supabase project, enable email auth, and obtain the anon key/URL yourself
2. **Manage secrets** — Do not put `SERVICE_ROLE` key in client code; Lovable won't handle server secrets
3. **Guarantee iframe auth flows** — If embedding in platforms like GHL, the magic link must open in a top-level browser tab to establish session storage
4. **Auto-protect your routes** — You must opt-in by wrapping pages with `<AuthGate>`
5. **Replace your router or layout** — This authentication system is additive only; no takeover of navigation or app structure

### Testing Authentication

1. Visit `/auth` in your app
2. Enter your email and click "Send Magic Link"
3. Check your email and click the magic link **in a top-level browser tab** (not in an iframe)
4. You'll be redirected back to your app and signed in
5. The session persists across page refreshes via localStorage
