import React, { useCallback, useEffect, useState } from 'react'
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { CalendarDaysIcon } from 'react-native-heroicons/outline'
import { SafeAreaView } from 'react-native-safe-area-context'
import { MagnifyingGlassIcon } from 'react-native-heroicons/outline'
import { MapPinIcon } from 'react-native-heroicons/solid'
import { debounce } from "lodash"
import { fetchLocations, fetchWeatherForecast } from '../api/weather'
import { getData, storeData } from '../utils/asyncStorage';
import { weatherImages } from '../constants'
import * as Progress from 'react-native-progress'

const HomeScreen = () => {

	const [showSearch, toggleSearch] = useState(false);
    const [locations, setLocations] = useState([]);
	const [loading, setLoading] = useState(true);
	const [weather, setWeather] = useState({})

    
    const handleLocation = (loc: any) => {
		setLoading(true);
		toggleSearch(false);
		setLocations([]);
		fetchWeatherForecast({
			cityName: loc.name,
			days: '10'
		}).then(data=>{
			setLoading(false);
			setWeather(data);
			storeData('city',loc.name);
			console.log('got forecast: ', data)
		})
	}
    
    const handleSearch = (value:any) => {
        //console.log('Value: ' + value)
        if(value && value.length>2)
        fetchLocations({cityName: value}).then(data=>{
            //console.log('got locations: ',data);
            setLocations(data);
        })
    }

	useEffect(()=>{
		fetchMyWeatherData();
	},[]);
	
	const fetchMyWeatherData = async ()=>{
		let myCity = await getData('city');
		let cityName = 'México';
		if(myCity){
			cityName = myCity;
		}
		fetchWeatherForecast({
			cityName,
			days: '10'
		}).then(data=>{
			// console.log('got data: ',data.forecast.forecastday);
			setWeather(data);
			setLoading(false);
		})
		
	}

	const handleTextDebounce = useCallback(debounce(handleSearch, 100), []);

	const {location, current} = weather;

	return (

		<>
			{
				loading ? (
					<View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
						<Progress.CircleSnail thickness={10} size={140} color="#0bb3b2" />
					</View>
				) : (
					<SafeAreaView style={{ flex: 1 }}>
						{/* Search section */}
						<View style={ styles.container } >
							<View style={{ ...styles.container_input, backgroundColor: showSearch ? 'rgba(255, 255, 255, .20)' : 'transparent' }}>
								{
									showSearch ? (
										<TextInput
											onChangeText={handleTextDebounce}
											placeholder='Search city'
											placeholderTextColor={'lightgray'}
											style={ styles.input }
										/>
									) : null
								}
								<TouchableOpacity 
									onPress={() => toggleSearch(!showSearch)}
									style={ styles.icon }
								>
									<MagnifyingGlassIcon size="25" color='white' />
								</TouchableOpacity>
							</View>
							{
								locations.length > 0 && showSearch ? (
									<View style={ styles.dropdown }>
										{
											locations.map((loc, index) => {
												let showBorder = index+1 != locations.length;
												let bColor = showBorder ? 'gray' : '';
												let bWidth = showBorder ? 0.5 : 0;
												return(
													<TouchableOpacity
														onPress={() => handleLocation(loc) }
														key={index}
														style={{ 
															...styles.dropdownItems,  
															borderBottomColor: bColor, 
															borderBottomWidth: bWidth
														}}
													>
														<MapPinIcon size='20' color='gray' style={{ marginRight: 5 }} />
														<Text style={{ color:'black', fontSize: 15 }}>{loc.name}, {loc?.country}</Text>
													</TouchableOpacity>
												)
											})
										}
									</View>
								) : null
							}
						</View>
			
						{/* forecast section */}
						<View style={ styles.container_weather }>
							<Text style={ styles.text_place }>
								{location?.name}
								<Text style={ styles.text_ubication }>, {location?.country}</Text>
							</Text>
							{/* Weather image */}
							<View style={ styles.container_image_weather }>
								<Image
									source={{uri: 'https:'+current?.condition?.icon}}  
									//source={weatherImages[current?.condition?.text || 'other']} 
									//source={require('../assets/images/partlycloudy.png')}
									style={ styles.image_weather }
								/>
							</View>
							{/* Degree celcius */}
							<View style={{ marginTop: 0.5 }}>
								<Text style={{ fontWeight: 'bold', color: '#fff', textAlign: 'center', fontSize: 60 }}>{current?.temp_c}&#176;</Text>
								<Text style={{ color: '#fff', textAlign: 'center', fontSize: 18, letterSpacing: 0.1, lineHeight: 28, marginLeft: 5 }}>
								{current?.condition?.text}
								</Text>
							</View>
							{/* Other Stats */}
							<View style={{ flexDirection: 'row', justifyContent: 'space-between', marginLeft: 16, marginRight: 16, marginTop: 8 }}>
								<View style={{ flexDirection: 'row', alignItems: 'center' }}>
									<Image 
										source={require('../assets/icons/wind.png')}
										style={{ width: 24, height: 24 }}
									/>
									<Text style={{ fontWeight: '300', color: '#fff', fontSize: 16, lineHeight: 24 }}> {current?.wind_kph} km</Text>
								</View>
								<View style={{ flexDirection: 'row', alignItems: 'center' }}>
									<Image 
										source={require('../assets/icons/drop.png')}
										style={{ width: 24, height: 24 }}
									/>
									<Text style={{ fontWeight: '300', color: '#fff', fontSize: 16, lineHeight: 24 }}> {current?.humidity}%</Text>
								</View>
								<View style={{ flexDirection: 'row', alignItems: 'center' }}>
									<Image 
										source={require('../assets/icons/sun.png')}
										style={{ width: 24, height: 24 }}
									/>
									<Text style={{ fontWeight: '300', color: '#fff', fontSize: 16, lineHeight: 24 }}> { weather?.forecast?.forecastday[0]?.astro?.sunrise }</Text>
								</View>
							</View>
							{/* forecast for next days */}
							<View style={{ marginBottom: 15, marginTop: 15 }}>
								<View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 20, marginRight: 20 }}>
									<CalendarDaysIcon size='22' color='white' />
									<Text style={{ color: '#fff', fontSize: 15, lineHeight: 24 }}> Daily forecast</Text>
								</View>
								<ScrollView
									horizontal
									contentContainerStyle={{ paddingHorizontal: 15 }}
									showsHorizontalScrollIndicator={false}
								>
									{
										weather?.forecast?.forecastday?.map((item,index) => {
											const date = new Date(item.date);
											const options = { weekday: 'long' };
											let dayName = date.toLocaleDateString('en-US', options);
											dayName = dayName.split(',')[0];
			
											return(
												<View
													style={{
														flex: 1,
														justifyContent: 'center',
														alignItems: 'center',
														width: 96,
														backgroundColor: 'rgba(255, 255, 255, .20)',
														borderRadius: 10,
														padding: 5,
														marginTop: 15,
														marginRight: 15
													}}
													key={index} 
												>
													<Image
														source={{uri: 'https:'+item?.day?.condition?.icon}}  
														//source={weatherImages[item?.day?.condition?.text || 'other']}
														style={{ width: 44, height: 44 }}
													/>
													<Text style={{ color: '#fff' }}>{dayName}</Text>
													<Text style={{ color: '#fff', fontSize: 20, lineHeight: 28, fontWeight: 'bold' }}>{item?.day?.avgtemp_c}&#176;</Text>
												</View>
											)
			
										})
									}
									
									
								</ScrollView>
							</View>
						</View>
							
					</SafeAreaView>
				)
			}
		</>	

	)
}

export default HomeScreen

const styles = StyleSheet.create({
	container_weather: {
		flex: 1,
		justifyContent: 'space-around',
		marginBottom: 2,
	},
	text_place: {
		color: 'white',
		textAlign: 'center',
		fontSize: 30,
		fontWeight: 'bold'
	},
	text_ubication: {
		color: '#c1c1c1',
		fontSize: 25,
		fontWeight: '400'
	},
	container_image_weather: {
		flexDirection: 'row',
		justifyContent: 'center'
	},
	image_weather: {
		width: 250,
		height: 250
	},
	container : {
        height: '7%',
        width: '90%',
        alignSelf: 'center',
        marginTop: 25,
		zIndex: 10000
    },
    container_input: {
        flexDirection: 'row',
        borderRadius: 100,
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    input: {
        flex: 1,
        paddingLeft: 10,
		color: '#fff'
    },
    icon: {
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: 100,
        padding: 8,
        marginRight: 2
    },
    dropdown: {
        position: 'absolute',
        width: '100%',
        backgroundColor: '#c1c1c1',
        top: 50,
        borderRadius: 15
    },
    dropdownItems: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 10
    }
})