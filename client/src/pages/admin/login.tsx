import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useAdminAuth } from "@/hooks/use-admin-auth";

export default function AdminLogin() {
  const { login, isLoggingIn, loginError, isAuthenticated } = useAdminAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [, navigate] = useLocation();

  if (isAuthenticated) {
    navigate("/admin");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ username, password });
      navigate("/admin");
    } catch {}
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-6 justify-center">
            <img src="/brand/clearcut-horizontal.svg" alt="Clearcut Land Management" className="h-10 w-auto" />
            <span className="text-muted-foreground text-sm">Admin</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                autoComplete="username"
                data-testid="input-admin-username"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                autoComplete="current-password"
                data-testid="input-admin-password"
              />
            </div>

            {loginError && (
              <p className="text-sm text-destructive" data-testid="text-login-error">
                Invalid credentials. Please try again.
              </p>
            )}

            <Button type="submit" className="w-full" disabled={isLoggingIn} data-testid="button-admin-login">
              {isLoggingIn ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
