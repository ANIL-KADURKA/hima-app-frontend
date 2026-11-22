import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { QueryProvider } from '@/providers/QueryProvider';
import { theme } from '@/shared/theme';

export default function RootLayout() {
  return (
    <QueryProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.colors.surface },
        }}
      />
    </QueryProvider>
  );
}
