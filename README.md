## Overview

Kalibra3 Frontend provides the client-side UI for customer devices on the following platforms:

- iOS (iPhone)
- Android - Tested of emulators for Pixel 3 and 5 and Nexus 5 to cover the resolutions
- Web - Web browsers is only for development/testing purposes and will be excluded with focus on mobile platforms

## Technology

### Base Stack

The bootstrapping framework we are using to build this application is [Expo](https://docs.expo.dev/)

Expo is used to create a base project on ReactNative to support iOS and Android and written in TypeScript. On top of this we are using React Native Web to convert React Native code into web renderable code to support the web platform. IOS is our current target platform, followed by Android and then web so the code needs to support large (desktop/tablets) and small (phone) layouts.

For navigation, we are using the [React Navigation](https://reactnavigation.org/docs/getting-started) that is by default provided by Expo bootstrap project

### Design and UI Kit

We are using [UI Kitten](https://akveo.github.io/react-native-ui-kitten/docs/getting-started/what-is-ui-kitten#what-is-ui-kitten), which is a customizable React Native UI Library based on Eva Design System specifications, with 30+ UI components, 2 visual themes, and other supporting modules.

For Icons, we are using

- Eva Design Icons [https://akveo.github.io/eva-icons/#/]
- Health Pack [https://healthicons.org/]

UI Design and style specifications for the new front-end application can be found here on [Figma](https://www.figma.com/file/er2kz09zb5FFdXmPOs6e6w/Kalibra-September-Designs?node-id=406%3A0)

## Base System Prerequisites

1. Install the latest version of Node that has LTS (Long-Term Support) from website and make sure that /usr/local/bin is in your PATH variable, you can follow this [guide using nvm](https://dev.to/httpjunkie/setup-node-version-manager-nvm-on-mac-m1-7kl)

2. Install Watchman

   ```bash
   brew install watchman
   ```

3. Install Node Package Manager (npm)

   ```bash
   npm install --global npm
   ```

4. Install npm-check-update

   ```bash
   npm install --global npm-check-updates
   ```

5. Install <b>Prettier Visual Studio Code extension so that the Visual Studio IDE</b> will automatically format your code for you as you make changes and globally install prettier

   ```bash
   npm install --global prettier
   ```

6. Install <b>ESLint Visual Studio Code extension so that the Visual Studio IDE</b> will automatically highlight coding errors for you as you make changes and also globally install the eslint

   ```bash
   npm install --global eslint
   ```

7. Install <b>Code Spell Checker - Visual Studio Code extension</b> so that the Visual Studio IDE will automatically highlight spelling mistakes for you as you make changes.

8. Install Expo CLI for bootstrapping react-native applications

   ```bash
   brew install libvips
   npm install --global expo-cli
   npm install --global sharp-cli
   ```

## Apple iOS Base Prerequisites

Building the iOS App can only be done on an Apple device running **MacOS 11+**.

1.  Install Apple [Xcode](https://itunes.apple.com/us/app/xcode/id497799835?mt=12). This can be done from the MacOS AppStore. Installing Xcode will also install the iOS Simulator and all the necessary tools to build your iOS app.

2.  Install CoCoaPods

    [CoCoaPods](https://guides.cocoapods.org/using/getting-started.html) will manage iOS specific package dependencies.

    Using brew is the preferred way, as it will automatically handle required dependency upgrades (e.g. like upgrading the default bundled version (2.x) of Ruby to one that supports CoCoaPods (3+)

    ```bash
    brew install cocoapods
    ```

## Android App Base Prerequisites

1.  Install java env

    ```bash
    brew install jenv
    ```

    After the command completes, we must tell our system where to look so it can use jenv, so we need to add it to our path. To do this, we must run the following command in our terminal

    ```bash
    $ echo 'export PATH="$HOME/.jenv/bin:$PATH"' >> ~/.zshrc
    $ echo 'eval "$(jenv init -)"' >> ~/.zshrc
    ```

2.  Install JAVA JDK

    ```bash
    brew install AdoptOpenJDK/openjdk/adoptopenjdk8
    ```

    After the installation completes, we want to see what JDK environments our Mac can access. Type the following into the command line to see:

    ```bash
     /usr/libexec/java_home -V
    ```

    Output will be as following the version might be number might be slightly different

    ```
     Matching Java Virtual Machines (1):
     1.8.0_292 (x86_64) "AdoptOpenJDK" - "AdoptOpenJDK 8" /Library/Java/JavaVirtualMachines/adoptopenjdk-8.jdk/Contents/Home
     /Library/Java/JavaVirtualMachines/adoptopenjdk-8.jdk/Contents/Home
    ```

3.  Add Path and Global Environment for Java

    ```bash
    jenv add /Library/Java/JavaVirtualMachines/adoptopenjdk-8.jdk/Contents/Home
    ```

    After this, we want to set our Java 8 to our system-wide Java version so we can continue configuring the Android emulator on our machine. At the time of writing, that means running the following command:

    ```bash
    jenv global openjdk64-1.8.0.292
    ```

    Run jenv doctor to validate

    ```bash
    jenv doctor
    ```

    Output should be as follows

    ```
     [OK] JAVA_HOME variable probably set by jenv PROMPT
     [OK] Java binaries in path are jenv shims
     [OK] Jenv is correctly loaded
    ```

4.  Download Android Studio Arctic Fox - [Follow this link if you get stuck] (https://blog.inkdrop.app/running-a-react-native-app-on-android-emulator-in-m1-mac-76a16348d1e4)

5.  Set up the following devices on Android AVD Manager

        Name: Nexus 4 API 31,
        Name: Pixel_3a_API_31_arm64-v8a
        Name: Pixel 5 API 31

## Getting Started

1. Clone the GIT Repo using the following url: https://github.com/kalibra-ai/kalibra3MobileFE.git

2. Install packages

   ```bash
   npm install
   ```

   Then run the following to clean the overall solution

   ```bash
   npm run clean
   ```

   There will be series of questions answer "Y" to all except the <b>one to update brew answer "N"</b>

3. Run options are below, easiest way is to "npm run start" which will launch the metro bundler which you can launch web, ios or android.

   ```bash
   npm run <start|start-clean|android|ios|web>
   ```

4. Before any commit or check-in run the following, this will prettier align the code and ensure the flag all the code rules

   ```bash
   npm run pre-commit
   ```

## Common Issues

### Caching and Random Issue with packages, IOS or Android builds

Cleaning the solution to solve random issues(caching and weird issues)

```bash
npm run clean
```

There will be series of questions answer "Y" to all except the <b>one to update brew answer "N"</b>
