// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // supabase auth user
  const [userProfile, setUserProfile] = useState(null); // normalized for frontend
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);

  // Normalize DB profile row -> frontend-friendly shape
  const normalizeProfile = (row) => {
    if (!row) return null;
    return {
      id: row.id,
      name: row.full_name || row.name || '',
      email: row.email || '',
      studentId: row.student_id || row.studentId || '',
      university: row.university || '',
      avatar: row.avatar_url || row.avatar || null,
      phoneNumber: row.phone_number || row.phoneNumber || '',
      isVerified: !!row.is_verified,
      isActive: !!row.is_active,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  };

  const loadProfile = useCallback(async (userId) => {
    if (!userId) return;
    setProfileLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') { // ignore "no rows" vs real errors
        console.error('Error loading user profile:', error);
        setUserProfile(null);
      } else {
        setUserProfile(normalizeProfile(data));
      }
    } catch (err) {
      console.error('Exception loading profile:', err);
      setUserProfile(null);
    } finally {
      setProfileLoading(false);
    }
  }, []);

  const clearProfile = useCallback(() => {
    setUserProfile(null);
    setProfileLoading(false);
  }, []);

  // Handler called when auth state changes
  const onAuthStateChangeHandler = useCallback((event, session) => {
    const currentUser = session?.user ?? null;
    setUser(currentUser);
    if (currentUser) {
      // async load profile (fire-and-forget is okay)
      loadProfile(currentUser.id);
    } else {
      clearProfile();
    }
    setLoading(false);
  }, [loadProfile, clearProfile]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data } = await supabase.auth.getSession();
        const session = data?.session ?? null;
        if (!mounted) return;
        onAuthStateChangeHandler(null, session);
      } catch (err) {
        console.error('Error getting initial session:', err);
        if (mounted) {
          setUser(null);
          setUserProfile(null);
          setLoading(false);
        }
      }

      // subscribe to auth changes
      const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
        onAuthStateChangeHandler(event, session);
      });

      const subscription = listener?.subscription ?? null;

      return () => {
        mounted = false;
        if (subscription?.unsubscribe) subscription.unsubscribe();
      };
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onAuthStateChangeHandler]);

  // --- Auth methods ---
  const signUp = async (email, password, userData = {}) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: userData?.full_name || '',
            role: userData?.role || 'student'
          }
        }
      });
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      // clear local state immediately
      setUser(null);
      clearProfile();
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const updateProfile = async (updates) => {
    if (!user) return { data: null, error: 'No user logged in' };

    // map frontend fields -> DB columns
    const dbUpdates = {
      ...(updates.full_name ? { full_name: updates.full_name } : {}),
      ...(updates.studentId ? { student_id: updates.studentId } : {}),
      ...(updates.university ? { university: updates.university } : {}),
      ...(updates.avatar ? { avatar_url: updates.avatar } : {}),
      ...(updates.phoneNumber ? { phone_number: updates.phoneNumber } : {}),
      updated_at: new Date().toISOString()
    };

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update(dbUpdates)
        .eq('id', user.id)
        .select()
        .maybeSingle();

      if (error) throw error;

      setUserProfile(normalizeProfile(data));
      return { data: normalizeProfile(data), error: null };
    } catch (error) {
      console.error('Error updating profile:', error);
      return { data: null, error };
    }
  };

  const value = {
    user,
    userProfile,
    loading,
    profileLoading,
    signUp,
    signIn,
    signOut,
    updateProfile,
    reloadProfile: () => user?.id && loadProfile(user.id)
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
