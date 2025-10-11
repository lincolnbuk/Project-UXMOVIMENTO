declare module '@react-native-firebase/auth' {
  // Tipagem mínima para evitar erro vermelho no TypeScript
  export interface FirebaseAuthTypes {
    UserCredential: any;
  }
  const auth: any;
  export default auth;
}

declare module '@react-navigation/native-stack' {
  export const createNativeStackNavigator: any;
  export type NativeStackNavigationProp = any;
}

declare module '@react-navigation/native' {
  export const NavigationContainer: any;
  export function useNavigation<T = any>(): T;
}
