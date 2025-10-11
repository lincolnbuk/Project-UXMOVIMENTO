import { useState } from 'react';
import { UserProfile } from '../../models/auth/UserProfile';
import auth from '@react-native-firebase/auth';
import firebase from '@react-native-firebase/app';

export function useAuthViewModel() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Garante que o app Firebase está inicializado antes de usar o auth
  function getFirebaseAuth() {
    try {
      // Se já existe um app, retorna o auth normalmente
      if (firebase.apps.length > 0) {
        return auth();
      }
      // Se não existe, tenta inicializar (deve ser raro)
      firebase.app();
      return auth();
    } catch (e) {
      console.error('Firebase não inicializado corretamente.', e);
      setError('Firebase não inicializado corretamente.');
      return null;
    }
  }

  async function login(email: string, password: string) {
    setLoading(true);
    setError(null);
    try {
      const firebaseAuth = getFirebaseAuth();
      const result = await firebaseAuth.signInWithEmailAndPassword(
        email,
        password,
      );
      const firebaseUser = result.user;
      setUser({
        uid: firebaseUser.uid,
        name: firebaseUser.displayName ?? '',
        email: firebaseUser.email ?? '',
        pace: '',
        location: '',
        frequency: '',
        goals: '',
      });
    } catch (e) {
      const err = e as { message?: string };
      setError(err.message ?? 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  }

  async function register(email: string, password: string) {
    setLoading(true);
    setError(null);
    try {
      const firebaseAuth = getFirebaseAuth();
      const result = await firebaseAuth.createUserWithEmailAndPassword(
        email,
        password,
      );
      const firebaseUser = result.user;
      setUser({
        uid: firebaseUser.uid,
        name: firebaseUser.displayName ?? '',
        email: firebaseUser.email ?? '',
        pace: '',
        location: '',
        frequency: '',
        goals: '',
      });
    } catch (e) {
      const err = e as { message?: string };
      setError(err.message ?? 'Erro ao registrar usuário');
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    const firebaseAuth = getFirebaseAuth();
    await firebaseAuth.signOut();
    setUser(null);
  }

  async function recoverPassword(email: string) {
    setLoading(true);
    setError(null);
    try {
      const firebaseAuth = getFirebaseAuth();
      await firebaseAuth.sendPasswordResetEmail(email);
    } catch (e) {
      const err = e as { message?: string };
      setError(err.message ?? 'Erro ao enviar e-mail de recuperação');
    } finally {
      setLoading(false);
    }
  }

  return { user, loading, error, login, logout, register, recoverPassword };
}
