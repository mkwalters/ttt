Welcome to Tic Tac Toe. This app features a react-native app and a node server. The client and server use web sockets to coordinate games. Let's get our app installed....


# Install Xcode and Android Studio

You can install Xcode via the OSX App store. Be sure to also install an iOS emulator. 

Android Studio can be downloaded here: https://developer.android.com/studio
Again, be sure to install an android emulator! 


# Install react-native with expo
Instructions are provided here: https://reactnative.dev/docs/environment-setup


# Running the mobile clients

Run `npm i` to install necessary node modules locally. 
In seperate terminals, run: 
`npm run android` and `npm run ios`

Boot up emulators in Xcode and Android Studio. 

you will be prompted with information from expo. For example, you can now type `a` to run on android or `i` to run on ios. 

Note: I found that sometimes the android emulator will hang when trying to push a new build. I recomend going to the device manager and looking for three horizontal dots to the right of the device. There is an option to `cold reboot` that can be useful. 


# Running the server

To start the server, simply run, `cd server && npm i && npm start`

# Support
 Please email me at `mitchellkellywalters@gmail.com` if you ever any questions, concerns or feature requests. I would be happy to help you get up and running. 

 # Pending features
- Storing games in a database
- Using websockets in the lobby. This would allow us to only move users into the game screen only when everyone is ready. 
- Making the game feel more stateless. Players should ideally be able to join, play, leave, join, play.
