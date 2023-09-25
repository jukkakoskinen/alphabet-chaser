import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.soundtuition.alphabetchaser',
  appName: 'Alphabet Chaser',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
