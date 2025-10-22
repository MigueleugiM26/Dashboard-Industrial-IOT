module.exports = {
  expo: {
    name: "Dashboard Industrial",
    slug: "dashboard-industrial",
    owner: "dashboardindustrialestacio",
    version: "1.0.1",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#000000",
    },
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#000000",
      },
      edgeToEdgeEnabled: true,
      package: "com.miguelindo.dashboardindustrial",
      usesCleartextTraffic: true,
      permissions: ["INTERNET"],
      config: {
        usesCleartextTraffic: true,
      },
    },
    scheme: "dashboardindustrial",
    web: {
      favicon: "./assets/favicon.png",
      
      bundler: "metro", 
    },
    extra: {
      eas: {
        projectId: "72cc1fa4-95b8-454f-84ec-2780332cf824",
      },
    },
    plugins: [
      [
        "expo-build-properties",
        {
          android: {
            usesCleartextTraffic: true,
          },
        },
      ],
    ],
  },
};
