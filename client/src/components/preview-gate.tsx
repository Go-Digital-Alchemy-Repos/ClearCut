import { useState, type FormEvent, type ReactNode } from "react";
import { useLocation } from "wouter";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Pre-launch preview gate. This is a soft, client-side curtain to keep casual
// visitors out — not real security. Remove <PreviewGate> from App.tsx at launch.
const PREVIEW_PASSWORD = "Preview@2026";
const STORAGE_KEY = "clearcut-preview-unlocked";

function isUnlocked() {
  try {
    return localStorage.getItem(STORAGE_KEY) === PREVIEW_PASSWORD;
  } catch {
    return false;
  }
}

export function PreviewGate({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const [unlocked, setUnlocked] = useState(isUnlocked);
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);

  // The admin portal has its own login
  if (unlocked || location.startsWith("/admin")) return <>{children}</>;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (value === PREVIEW_PASSWORD) {
      try {
        localStorage.setItem(STORAGE_KEY, PREVIEW_PASSWORD);
      } catch {}
      setUnlocked(true);
    } else {
      setError(true);
    }
  };

  return (
    <>
      <div aria-hidden className="pointer-events-none select-none" {...{ inert: "" }}>
        {children}
      </div>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/40 backdrop-blur-2xl">
        <form
          onSubmit={submit}
          className="w-full max-w-sm rounded-lg border bg-background/95 p-6 shadow-xl space-y-4"
          data-testid="preview-gate"
        >
          <img src="/brand/clearcut-horizontal.svg" alt="Clearcut Land Management" className="h-10 w-auto" />
          <div className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-primary" />
            <h1 className="font-semibold text-lg">Private preview</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            This site isn't public yet. Enter the preview password to continue.
          </p>
          <Input
            type="password"
            autoFocus
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setError(false);
            }}
            placeholder="Password"
            aria-invalid={error}
            data-testid="input-preview-password"
          />
          {error && <p className="text-sm text-destructive">Incorrect password.</p>}
          <Button type="submit" className="w-full" data-testid="button-preview-unlock">
            View site
          </Button>
        </form>
      </div>
    </>
  );
}
