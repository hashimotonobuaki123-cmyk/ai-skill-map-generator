"use client";

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import Link from "next/link";
import { getSupabaseBrowserClient } from "@/lib/supabaseBrowserClient";
import { Button } from "@/components/ui/button";

export function AuthButton() {
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();

    supabase.auth
      .getUser()
      .then(({ data }) => {
        setUser(data.user ?? null);
      })
      .finally(() => setInitializing(false));

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    const supabase = getSupabaseBrowserClient();
    await supabase.auth.signOut();
  };

  if (initializing) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 text-xs">
      {user && (
        <span className="hidden md:inline text-slate-500">
          サインイン中: {user.email ?? "ユーザー"}
        </span>
      )}
      {user ? (
        <Button type="button" size="sm" variant="outline" onClick={handleLogout}>
          ログアウト
        </Button>
      ) : (
        <Link href="/auth/login">
          <Button type="button" size="sm" variant="outline">
            ログイン
          </Button>
        </Link>
      )}
    </div>
  );
}


