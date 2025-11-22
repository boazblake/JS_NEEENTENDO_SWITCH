import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.wordpond.controller',
  appName: 'Wordpond Controller',
  webDir: '../dist/controller', // must match your vite build output
  bundledWebRuntime: true,
  server: {
    url: 'https://192.168.7.195:5174/',
    cleartext: false,
    androidScheme: 'https',
    iosScheme: 'capacitor'
  }
}

export default config
