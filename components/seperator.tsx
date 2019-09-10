import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import * as _ from 'lodash'


export const ROW_HEIGHT = 100;
const { width } = Dimensions.get('window');
const dash = width / 50;


interface SeperatorProps{}


export default class Seperator extends React.PureComponent<SeperatorProps>{
    render(){
       
        return(
            <View style={Styles.container}>
                {_.times(50).map((value, index)=>(<View key={index} style={Styles.dash}/>))}
            </View>
        )
    }
}

const Styles = StyleSheet.create({
    container:{
       flexDirection:"row",
    },
    dash:{
        width:dash /2,
        marginRight:dash/2,
        backgroundColor:"rgba(255,255,255,.4)",
        height:1
    }
})