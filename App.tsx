import React, { useEffect } from 'react'
import SplashScreen from 'react-native-splash-screen'
import Backgraound from './src/componets/Backgraound'
import HomeScreen from './src/screens/HomeScreen'


const App = () => {

	useEffect(() => SplashScreen.hide());

	return (
		<Appstate>
			<HomeScreen/>
		</Appstate>
	)
}

const Appstate = ({ children }: any) => {
	return(
		<Backgraound>
			{ children }
		</Backgraound>
	)
}

export default App