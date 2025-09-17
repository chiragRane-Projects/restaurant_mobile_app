import { AuthProvider } from '@/context/authContext';
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{headerShown: false}}>
      <Stack.Screen name="index"/>
      <Stack.Screen name="authScreen"/>
    </Stack>
    </AuthProvider>
  );
}
