import { useState, useEffect } from 'react';
// @ts-ignore
import firestore from '@react-native-firebase/firestore';
import { UserProfile } from '../../models/auth/UserProfile';

export function useProfileViewModel(uid: string) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Buscar perfil do usuário no Firestore
  async function fetchProfile() {
    setLoading(true);
    setError(null);
    try {
      const doc = await firestore().collection('users').doc(uid).get();
      // Corrigido: garantir uso da propriedade exists como boolean
      if ('exists' in doc ? (doc as any).exists : false) {
        setProfile(doc.data() as UserProfile);
      } else {
        setProfile(null);
      }
    } catch (e: any) {
      setError('Erro ao buscar perfil: ' + (e?.message ?? ''));
    } finally {
      setLoading(false);
    }
  }

  // Salvar ou atualizar perfil
  async function saveProfile(data: UserProfile) {
    setLoading(true);
    setError(null);
    try {
      await firestore().collection('users').doc(uid).set(data);
      setProfile(data);
    } catch (e: any) {
      setError('Erro ao salvar perfil: ' + (e?.message ?? ''));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (uid) fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uid]);

  return { profile, loading, error, fetchProfile, saveProfile };
}
