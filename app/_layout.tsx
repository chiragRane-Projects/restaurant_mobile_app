import { AuthProvider } from '@/context/authContext';
import { useFonts } from 'expo-font';
import { Stack } from "expo-router";
import { ActivityIndicator, View } from 'react-native';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'Outfit': require('../assets/fonts/Outfit/Outfit-Regular.ttf'),
    'Outfit-Bold': require('../assets/fonts/Outfit/Outfit-Bold.ttf'),
    'Outfit-SemiBold': require('../assets/fonts/Outfit/Outfit-SemiBold.ttf'),
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <AuthProvider>
      <Stack screenOptions={{headerShown: false}}>
      <Stack.Screen name="index"/>
      <Stack.Screen name="authScreen"/>
    </Stack>
    </AuthProvider>
  );
}
