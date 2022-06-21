import React from 'react'
import { View, StyleSheet, Dimensions, FlatList, Animated } from 'react-native'
import CarouselItem from './CarouselItem'


// const { width, heigth } = Dimensions.get('window')



const Carousel = ({ data }) => {

    if (data && data.length) {
        return (
            <View>
                <FlatList data={data}
                    keyExtractor={(item, index) => 'key' + index}
                    horizontal
                    pagingEnabled
                    scrollEnabled
                    snapToAlignment="center"
                    scrollEventThrottle={16}
                    decelerationRate={"fast"}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => {
                        return <CarouselItem item={item} />
                    }}
                />
            </View>
        )
    }

    console.log('Please provide Images')
    return null
}

const styles = StyleSheet.create({
    dotView: { flexDirection: 'row', justifyContent: 'center' }
})

export default Carousel
