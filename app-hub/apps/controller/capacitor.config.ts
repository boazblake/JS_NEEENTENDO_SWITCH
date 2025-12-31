import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.wordpond.controller',
  appName: 'Wordpond Controller',
  webDir: '../dist/controller', // must match your vite build output
  bundledWebRuntime: true,
  server: {
    url: 'https://192.168.7.195:5174/',
    cleartext: true,
    androidScheme: 'https',
    iosScheme: 'capacitor'
  },

  ios: {
    infoPlist: {
      NSLocalNetworkUsageDescription:
        'Wordpond needs access to your local network to discover TVs and connect to the relay.'
    }
  }
}

export default config
