import React from 'react';
import { View, StyleSheet, Animated, Dimensions, TextInput, InteractionManager } from 'react-native';
import * as _ from 'lodash'
import {  scaleLinear } from 'd3-scale'
import Graph, {ROW_HEIGHT} from './graph'



interface targetWeightProps{
    weight:number,
    height:number
}
interface targetWeightState{
    y:Animated.Value,
    initialized:boolean
}
const { height } = Dimensions.get('window');
const PADDING =50;

export default class TargetWeight extends React.PureComponent<targetWeightProps, targetWeightState>{
    
    listener:string;
    scroll = React.createRef();
    relativeInput = React.createRef();
    absoluteInput = React.createRef();
    welcomeValue = React.createRef();


    constructor(props:targetWeightProps){
        super(props);
        const { weight, height:h} = props;
        const BMI = weight / ( h * h);
        const from  = BMI - 10;
        const to = BMI + 10
        this.scaleBMI = scaleLinear().domain([0,(to - from + 1) * ROW_HEIGHT - height]).range([to, from]);
        this.state={
            y:new Animated.Value(this.scaleBMI.invert(BMI)),
            initialized:false    
        };
    }

    componentDidMount(){
        const { weight, height:h} = this.props;
        const BMI = weight / ( h * h);
        this.listener = this.state.y.addListener(this.update)
        InteractionManager.runAfterInteractions(()=>{
            const y =this.scaleBMI.invert(BMI)
            this.scroll.current.getNode().scrollTo({ y, animated:false})
            this.update({value:y}, true)
        })
    }
    componentWillUnmount(){
        this.state.y.removeListener(this.listener)
    }


    update=({value}:{value:number}, init)=>{
        if(!init){
            this.setState({initialized:true})
        }
        const {weight, height:h} = this.props;
        const BMI = this.scaleBMI(value);
        const absolute = (_.round(BMI * h * h * 2)/2).toFixed(1);
        const relative = (absolute - height).toFixed(1);
        if(init){
            this.welcomeValue.current.setNativeProps({text:`${absolute}`});

        }
        this.relativeInput.current.setNativeProps({text:`${relative}`});
        this.absoluteInput.current.setNativeProps({text:`${absolute}`});

    }
    render(){
        const { y, initialized } = this.state;
        const { weight, height:h} =this.props;
        const BMI = _.round(weight / ( h * h));
        const from  = BMI - 10;
        const to = BMI + 10
        const inputRange = [0, (to - from + 1) * ROW_HEIGHT - height]
        const translateY = y.interpolate({
            inputRange,
            outputRange:[-height/2 + PADDING, height/2 - PADDING]
        })
        const translateY2 = y.interpolate({
            inputRange,
            outputRange:[height/2 - PADDING, -height/2 + PADDING]
        })
        const scale =y.interpolate({
            inputRange:[inputRange[0],inputRange[1]/2 ,inputRange[1]],
            outputRange:[1, 0.5, 1]
        })
        const scaleY =y.interpolate({
            inputRange:[inputRange[0],inputRange[1]/2 ,inputRange[1]],
            outputRange:[height - PADDING * 2,25, height - PADDING * 2]
        })
        return(
            <View style={Styles.container}>
                <Animated.ScrollView 
                    ref={this.scroll}
                    style={StyleSheet.absoluteFillObject}
                    showsVerticalScrollIndicator={false}
                    scrollEventThrottle={16}
                    onScroll={Animated.event(
                        [
                            {
                                nativeEvent:{
                                    contentOffset:{ y },

                                },
                            },
                        ],
                        { useNativeDriver:true },
                    )}
                    bounces={false}
                >
                    <Graph {...{from, to}}/>
                </Animated.ScrollView>
                <View style={Styles.overlay} pointerEvents='none'>
                    <Animated.View style={[Styles.line,{transform:[{scaleY}]}]}/>
                </View>
                
                <View style={Styles.overlay} pointerEvents='none'>
                    <Animated.View style={[Styles.relativeCircle,{transform:[{scale}]}]}>
                        <TextInput ref={this.relativeInput} style={Styles.relativeTextInput}/>
                    </Animated.View>
                </View>
                <View style={Styles.overlay} pointerEvents='none'>
                    <Animated.View style={[Styles.opositeCircle,{transform:[{translateY: translateY2}]  }]}/>
                </View>
                <View style={Styles.overlay} pointerEvents='none'>
                    <Animated.View style={[Styles.absoluteCircle,{transform:[{translateY}]}]}>
                        <TextInput ref={this.absoluteInput} style={Styles.absoluteTextInput}/>
                    </Animated.View>
                </View>
               {
                   !initialized && (
                       <View style={Styles.welcome} pointerEvents='none'>
                           <Animated.View style={[Styles.absoluteCircle,{transform:[{translateY}]}]}>
                                <TextInput ref={this.welcomeValue} style={Styles.absoluteTextInput}/>
                            </Animated.View>
                       </View>
                   )
               }
            </View>
        )
    }
}

const Styles = StyleSheet.create({
    container:{
        flex:1
    },
    overlay:{ 
        ...StyleSheet.absoluteFillObject,
        justifyContent:"center",
        alignItems:"center"
    },
    absoluteCircle:{
        width:100,
        height:100,
        borderRadius:50,
        backgroundColor:"#fff",
        justifyContent:"center",
        alignItems:"center"
    },
    relativeCircle:{
        width:100,
        height:100,
        borderRadius:50,
        borderWidth:1,
        borderColor:'#fff',
        backgroundColor:"#69d0fb",
        justifyContent:"center",
        alignItems:"center"
       
    },
    opositeCircle:{
        width:50,
        height:50,
        borderRadius:25,
        backgroundColor:"#fff", 
       
    },
    line:{
        backgroundColor:'#fff',
        height:1,
        width:1
    },
    relativeTextInput:{
        color:'#fff',
        fontSize:16
    },
    absoluteTextInput:{
        color:'#69d0fb',
        fontSize:20
    },
    welcome:{
        ...StyleSheet.absoluteFillObject,
        justifyContent:"center",
        alignItems:"center",
        backgroundColor:"#69d0fb"
    }
})