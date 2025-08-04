import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode
} from 'react';
import posthog from 'posthog-js';
import * as Sentry from '@sentry/nextjs';
import { createClient } from '@/lib/supabase/client';
import { User, Session } from '@supabase/supabase-js';

interface Profile {
  id: string;
  updated_at: string;
  username: string;
  full_name: string;
  avatar_url: string;
  website: string;
  tier: string;
}

interface SupabaseContextType {
  profile: Profile | null;
  session: Session | null;
  catalogAlert: boolean;
  autopilotAlert: boolean;
  clearAutopilotAlert: () => void;
  clearCatalogAlert: () => void;
  signOut: () => Promise<void>;
  fetchProfile: () => Promise<void>;
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(
  undefined
);

export function SupabaseProvider({ children }: { children: ReactNode }) {
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [catalogAlert, setCatalogAlert] = useState(false);
  const [autopilotAlert, setAutopilotAlert] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const setupAuth = async () => {
      const {
        data: { session }
      } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);

      const {
        data: { subscription }
      } = supabase.auth.onAuthStateChange(async (_, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        posthog.identify(session?.user.id, { email: session?.user.email });
      });

      return () => subscription.unsubscribe();
    };

    setupAuth();
  }, []);

  const fetchProfile = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) Sentry.captureException(error);
    setProfile(data);
  };

  useEffect(() => {
    if (!user) {
      setProfile(null);
      return;
    }

    const profileChannel = supabase
      .channel('custom-update-channel')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'profiles' },
        (payload) => {
          setProfile(payload.new as Profile);
        }
      )
      .subscribe();

    fetchProfile();

    return () => {
      supabase.removeChannel(profileChannel);
    };
  }, [user]);

  useEffect(() => {
    const catalogChannel = supabase
      .channel('catalog-updates')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'catalogs' },
        (payload) => {
          const { new: newData, old: oldData } = payload;
          if (
            newData.presentation_id &&
            (!oldData.status || oldData.status !== 'Available') &&
            newData.status === 'Available'
          ) {
            setCatalogAlert(true);
          }
        }
      )
      .subscribe();

    const autopilotChannel = supabase
      .channel('autopilot-updates')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'autopilot' },
        () => setAutopilotAlert(true)
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'autopilot' },
        () => setAutopilotAlert(false)
      )
      .subscribe();

    return () => {
      supabase.removeChannel(catalogChannel);
      supabase.removeChannel(autopilotChannel);
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const clearCatalogAlert = () => setCatalogAlert(false);
  const clearAutopilotAlert = () => setAutopilotAlert(false);

  const value: SupabaseContextType = {
    profile,
    session,
    catalogAlert,
    fetchProfile,
    autopilotAlert,
    clearAutopilotAlert,
    clearCatalogAlert,
    signOut
  };

  return (
    <SupabaseContext.Provider value={value}>
      {children}
    </SupabaseContext.Provider>
  );
}

export function useSupabase() {
  const context = useContext(SupabaseContext);
  if (context === undefined) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return context;
}
