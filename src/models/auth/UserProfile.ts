// Model de perfil de usuário para autenticação
export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  pace: string; // ritmo
  location: string;
  frequency: string;
  goals: string;
}
