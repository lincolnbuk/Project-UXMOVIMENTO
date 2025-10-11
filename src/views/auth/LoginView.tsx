import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Easing,
  ImageBackground, // Adicionado para imagem de fundo
} from 'react-native';
import { useAuthViewModel } from '../../viewmodels/auth/AuthViewModel';
import { useProfileViewModel } from '../../viewmodels/auth/ProfileViewModel';
// @ts-ignore: Tipagem customizada em declarations.d.ts
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

export function LoginView() {
  const { user, loading, error, login, logout, register, recoverPassword } =
    useAuthViewModel();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [showRecover, setShowRecover] = useState(false);
  const [recoverEmail, setRecoverEmail] = useState('');
  const [recoverMsg, setRecoverMsg] = useState<string | null>(null);
  const navigation = useNavigation<NativeStackNavigationProp>();
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  // Hook para buscar perfil do usuário
  const { profile, fetchProfile } = useProfileViewModel(user?.uid ?? '');

  useEffect(() => {
    if (user) {
      fetchProfile().then(() => {
        if (!(profile?.name && profile?.pace && profile?.location)) {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Profile', params: { uid: user.uid } }],
          });
        } else {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Match' }],
          });
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 80,
        useNativeDriver: true,
        easing: Easing.out(Easing.quad),
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 80,
        useNativeDriver: true,
        easing: Easing.out(Easing.quad),
      }),
    ]).start(() => {
      if (isRegister) {
        register(email, password);
      } else {
        login(email, password);
      }
    });
  };

  const handleRecover = async () => {
    setRecoverMsg(null);
    if (!recoverEmail) {
      setRecoverMsg('Informe o e-mail para recuperar a senha.');
      return;
    }
    try {
      await recoverPassword(recoverEmail);
      setRecoverMsg(
        'E-mail de recuperação enviado! Verifique sua caixa de entrada.',
      );
    } catch (e) {
      console.error('Erro ao enviar e-mail de recuperação:', e);
      setRecoverMsg(
        'Erro ao enviar e-mail de recuperação. Tente novamente mais tarde.',
      );
    }
  };

  // Extracted button text to avoid nested ternary
  let buttonText = '';
  if (loading) {
    buttonText = isRegister ? 'Criando conta...' : 'Entrando...';
  } else {
    buttonText = isRegister ? 'Criar conta' : 'Entrar';
  }

  return (
    <ImageBackground
      source={{
        uri: 'https://images.unsplash.com/photo-1461897104016-0b3b00cc81ee?auto=format&fit=crop&w=800&q=80', // Corredores de rua, maratona, pessoas correndo
      }}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.appName}>
            <Text style={styles.appNameHighlight}>UX</Text>
            <Text style={styles.appNameMovimento}>MOVIMENTO</Text>
          </Text>
          {user ? (
            <>
              <Text>Bem-vindo, {user.name || user.email}!</Text>
              <TouchableOpacity style={styles.button} onPress={logout}>
                <Text style={styles.buttonText}>Sair</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TextInput
                placeholder="E-mail"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                autoCapitalize="none"
              />
              <TextInput
                placeholder="Senha"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
              />
              {error && <Text style={styles.errorText}>{error}</Text>}
              <Animated.View
                style={[
                  { transform: [{ scale: scaleAnim }] },
                  styles.fullWidth,
                ]}
              >
                <TouchableOpacity
                  style={[styles.button, loading && styles.buttonDisabled]}
                  onPress={handlePress}
                  disabled={loading}
                  activeOpacity={0.8}
                >
                  <Text style={styles.buttonText}>{buttonText}</Text>
                </TouchableOpacity>
              </Animated.View>
              <TouchableOpacity
                style={styles.toggleButton}
                onPress={() => setIsRegister(v => !v)}
              >
                <Text style={styles.toggleButtonText}>
                  Não tem conta?{' '}
                  <Text style={styles.toggleButtonHighlight}>Criar conta</Text>
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.recoverButton}
                onPress={() => setShowRecover(v => !v)}
              >
                <Text style={styles.recoverButtonText}>
                  Esqueci minha senha
                </Text>
              </TouchableOpacity>
              {showRecover && (
                <View style={styles.recoverBox}>
                  <TextInput
                    placeholder="Digite seu e-mail"
                    value={recoverEmail}
                    onChangeText={setRecoverEmail}
                    style={styles.input}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity
                    style={styles.button}
                    onPress={handleRecover}
                  >
                    <Text style={styles.buttonText}>Recuperar senha</Text>
                  </TouchableOpacity>
                  {recoverMsg && (
                    <Text style={styles.recoverMsg}>{recoverMsg}</Text>
                  )}
                </View>
              )}
            </>
          )}
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(25, 118, 210, 0.18)', // overlay um pouco mais forte
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(25, 118, 210, 0.13)', // mais contraste
    margin: 24,
    borderRadius: 24, // mais arredondado
    shadowColor: '#1976d2',
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
  },
  appName: {
    fontSize: 32, // menor para melhor adaptação
    fontWeight: 'bold',
    marginBottom: 36,
    textShadowColor: '#fff', // sombra branca para contraste
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
    letterSpacing: 2,
    textAlign: 'center',
    textTransform: 'uppercase',
    flexDirection: 'row',
    backgroundColor: 'rgba(25, 118, 210, 0.7)', // fundo azul translúcido
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 6,
    overflow: 'hidden',
  },
  appNameHighlight: {
    color: '#ff9800', // Laranja para "UX"
    fontWeight: 'bold',
  },
  appNameMovimento: {
    color: '#006400', // Verde para "MOVIMENTO"
    fontWeight: 'bold',
  },
  input: {
    width: 220,
    borderWidth: 1.5,
    borderColor: '#fff',
    borderRadius: 6,
    marginBottom: 14,
    padding: 10,
    backgroundColor: 'rgba(255,255,255,0.7)',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#1976d2', // Azul para o botão Entrar/Criar conta
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 12,
    width: 220,
    alignSelf: 'center',
    elevation: 4,
    shadowColor: '#1976d2',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  buttonDisabled: {
    backgroundColor: '#90caf9',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 1,
    textShadowColor: '#1976d2',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
    textTransform: 'uppercase',
  },
  errorText: {
    color: 'red',
    marginBottom: 8,
    fontWeight: 'bold',
    backgroundColor: 'rgba(255,255,255,0.7)',
    padding: 4,
    borderRadius: 4,
  },
  fullWidth: {
    width: '100%',
  },
  toggleButton: {
    marginTop: 10,
  },
  toggleButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 15,
    textShadowColor: '#1976d2',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
    letterSpacing: 0.5,
  },
  toggleButtonHighlight: {
    color: '#000000', // Destaque para cor preta para "Criar conta"
    fontWeight: 'bold',
  },
  recoverButton: {
    marginTop: 4,
    marginBottom: 8,
    alignSelf: 'center',
  },
  recoverButtonText: {
    color: '#fff', // Branco para máximo contraste "Esqueci minha senha"
    fontWeight: 'bold',
    fontSize: 16,
    textDecorationLine: 'underline',
    backgroundColor: 'rgba(25, 118, 210, 0.85)', // fundo azul forte
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 2,
    textAlign: 'center',
    overflow: 'hidden',
    textShadowColor: '#1976d2',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  recoverBox: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 10,
    padding: 16,
    marginTop: 8,
    alignItems: 'center',
    width: 240,
    alignSelf: 'center',
    shadowColor: '#1976d2',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  recoverMsg: {
    marginTop: 8,
    color: '#1976d2',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
