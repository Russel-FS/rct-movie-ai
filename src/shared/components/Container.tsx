import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export const Container = ({ children }: { children: React.ReactNode }) => {
  return (
    <SafeAreaProvider>
      <SafeAreaView className="m-6 flex-1">{children}</SafeAreaView>
    </SafeAreaProvider>
  );
};
