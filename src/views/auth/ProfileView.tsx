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

interface SaveStatus {
  success: boolean;
  message: string;
}

export function ProfileView({ uid }: ProfileViewProps) {
  // O hook de autenticação pode retornar null no SSR, mas garantimos sempre o formulário
  const { user } = useAuthViewModel();

  const { profile, loading, error, saveProfile } = useProfileViewModel(uid);

  const [form, setForm] = useState<UserProfile>({
    uid,
    name: '',
    email: user?.email || '',
    pace: '',
    location: '',
    frequency: '',
    goals: '',
  });

  const [saveStatus, setSaveStatus] = useState<SaveStatus>({
    success: false,
    message: '',
  });

  React.useEffect(() => {
    // Se o usuário está autenticado, sempre atualiza o email
    if (user?.email) {
      setForm(prev => ({ ...prev, email: user.email || '' }));
    }
  }, [user?.email]);

  React.useEffect(() => {
    // Se há um perfil salvo, carrega os dados dele (exceto o email que vem do user)
    if (profile && Object.keys(profile).length > 0) {
      setForm(prev => ({
        ...profile,
        email: user?.email || profile.email || '', // Email sempre do user logado
      }));
    }
  }, [profile, user?.email]);

  React.useEffect(() => {
    // Monitora mudanças no loading - quando termina de salvar
    if (!loading && saveStatus.message === '') {
      // Se não houve erro, foi sucesso
      if (!error) {
        setSaveStatus({
          success: true,
          message: 'Perfil salvo com sucesso!',
        });
        // Limpa a mensagem após 2 segundos
        const timer = setTimeout(() => {
          setSaveStatus({ success: false, message: '' });
        }, 2000);
        return () => clearTimeout(timer);
      }
    }
  }, [loading, error, saveStatus.message]);

  function handleChange(field: keyof UserProfile, value: string) {
    setForm({ ...form, [field]: value });
  }

  function handleSave() {
    // Garante que todos os campos são string (nunca undefined)
    const safeForm: UserProfile = {
      uid: form.uid || uid,
      name: form.name || '',
      email: user?.email || form.email || '', // Email sempre do user logado
      pace: form.pace || '',
      location: form.location || '',
      frequency: form.frequency || '',
      goals: form.goals || '',
    };
    setSaveStatus({ success: false, message: '' });
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
        style={[styles.input, styles.disabledInput]}
        value={form.email}
        editable={false}
        placeholder="Digite seu email"
        keyboardType="email-address"
      />
      {/* Adicione outros campos conforme necessário */}
      <Button title="Salvar" onPress={handleSave} disabled={loading} />
      {loading && <ActivityIndicator />}
      {saveStatus.success && (
        <Text style={styles.success}>{saveStatus.message}</Text>
      )}
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
  disabledInput: {
    backgroundColor: '#f5f5f5',
    color: '#999',
    success: {
      color: '#4caf50',
      marginTop: 12,
      textAlign: 'center',
      fontWeight: 'bold',
    },
  },
});
