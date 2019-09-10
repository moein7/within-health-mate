import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import * as _ from 'lodash'
import Seperator from './seperator'


export const ROW_HEIGHT = 100;

interface graphProps{
    from :number,
    to:number
}

const seperator={
    18:"UnderWeight",
    19:"Healthy Weight",
    24:"Healthy Weight",
    25:"OverWeight",
    29:"OverWeight",
    30:'Obese'
}

export default class Graph extends React.PureComponent<graphProps>{
    render(){
        const { from, to } = this.props;
        const interation = to - from + 1;
        return(
            <View style={Styles.container}>
                {
                    _.times(interation).map((value, index)=>{
                        const BMI = from + index;
                        return(
                            <React.Fragment key={index}>
                                 {
                                   (seperator[BMI] && seperator[BMI+1]) && (
                                       <Seperator />
                                   )
                                }
                                <View  style={Styles.row}>
                                    <Text style={Styles.lable}>BMI {BMI}</Text>
                                    {
                                        seperator[BMI] && (
                                            <Text style={[Styles.seperator,{alignSelf:seperator[BMI+1] ? 'flex-start' : 'flex-end'}]}>{seperator[BMI]}</Text>
                                        )
                                    }
                                </View>
                               
                            </React.Fragment>

                        )
                    }).reverse()
                }
            </View>
        )
    }
}

const Styles = StyleSheet.create({
    container:{
        backgroundColor:"#69d0fb"
    },
    row:{
        height:ROW_HEIGHT,
        padding:16,
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"space-between"
    },
    lable:{
        color:"#fff",
        fontSize:16,
    },
    seperator:{
        fontSize:14,
        color:"rgba(255,255,255,.5)"
    }
})