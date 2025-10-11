import React, { useState } from 'react';
import {
  Text,
  TextInput,
  Button,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useProfileViewModel } from '../../viewmodels/auth/ProfileViewModel';
import { useAuthViewModel } from '../../viewmodels/auth/AuthViewModel';
import { UserProfile } from '../../models/auth/UserProfile';

interface ProfileViewProps {
  readonly uid: string;
}

export function ProfileView({ uid }: ProfileViewProps) {
  // O hook de autenticação pode retornar null no SSR, mas garantimos sempre o formulário
  const { user } = useAuthViewModel();

  const { profile, loading, error, saveProfile } = useProfileViewModel(uid);
  // Sempre mostra o formulário, mesmo sem user
  const emptyProfile: UserProfile = React.useMemo(
    () => ({
      uid,
      name: '',
      email: user?.email || '',
      pace: '',
      location: '',
      frequency: '',
      goals: '',
    }),
    [uid, user?.email],
  );
  const [form, setForm] = useState<UserProfile>(emptyProfile);

  React.useEffect(() => {
    if (profile && Object.keys(profile).length > 0) {
      setForm(profile);
    } else {
      setForm(emptyProfile);
    }
  }, [profile, emptyProfile]);

  function handleChange(field: keyof UserProfile, value: string) {
    setForm({ ...form, [field]: value });
  }

  function handleSave() {
    // Garante que todos os campos são string (nunca undefined)
    const safeForm: UserProfile = {
      uid: form.uid || uid,
      name: form.name || '',
      email: form.email || '',
      pace: form.pace || '',
      location: form.location || '',
      frequency: form.frequency || '',
      goals: form.goals || '',
      // Adicione outros campos conforme necessário
    };
    saveProfile(safeForm);
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Nome</Text>
      <TextInput
        style={styles.input}
        value={form.name}
        onChangeText={text => handleChange('name', text)}
        placeholder="Digite seu nome"
      />
      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={form.email}
        onChangeText={text => handleChange('email', text)}
        placeholder="Digite seu email"
        keyboardType="email-address"
      />
      {/* Adicione outros campos conforme necessário */}
      <Button title="Salvar" onPress={handleSave} disabled={loading} />
      {loading && <ActivityIndicator />}
      {error && <Text style={styles.error}>{error}</Text>}
    </ScrollView>
  );
}

// Bloco de estilos para evitar erro de styles indefinido
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    color: '#222',
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  button: {
    backgroundColor: '#1976d2',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  error: {
    color: 'red',
    marginBottom: 8,
    textAlign: 'center',
  },
});
