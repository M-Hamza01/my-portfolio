"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

/**
 * True only when there is an active Supabase auth session — i.e. Hamza
 * is signed in. Every edit affordance across the site (pencil icons,
 * "+ Add" buttons) is gated behind this single hook.
 */
export function useIsOwner() {
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getSession().then(({ data }) => {
      setIsOwner(!!data.session);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsOwner(!!session);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  return { isOwner, loading };
}
