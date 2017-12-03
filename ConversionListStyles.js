import { StyleSheet } from 'react-native'
import { Colors, Metrics, Fonts } from './Themes/index'


export default StyleSheet.create({
    view1: {
        backgroundColor: Colors.white
    },
    view2: {
        flexDirection: 'row',
        backgroundColor: Colors.sky,
        height: Metrics.screenHeight / 6,
        alignItems: 'center',
        paddingBottom: 10
    },
    view3: {
        flexDirection: 'row',
        backgroundColor: Colors.white,
        height: Metrics.screenHeight / 6,
        alignItems: 'center',
        paddingBottom: 10
    },
    label1: {
        fontFamily: 'Hallo Sans',
        fontSize: 40,
        color: Colors.white,
        fontWeight: 'bold',
        marginLeft: 15,
        width: Metrics.screenWidth / 2.35,
        borderBottomWidth: 3,
        borderBottomColor: Colors.white
    },
    label2: {
        fontFamily: 'Hallo Sans',
        fontSize: 40,
        color: Colors.sky,
        fontWeight: 'bold',
        marginLeft: 15,
        width: Metrics.screenWidth / 2.35,
        borderBottomWidth: 3,
        borderBottomColor: Colors.sky
    },
    picker1: {
        marginTop: 10,
        marginLeft: 10,
        color: Colors.sky
    },
    picker2: {
        width: Metrics.screenWidth / 2.2,
        marginLeft: 15,
        color: Colors.white
    },
    picker3: {
        width: Metrics.screenWidth / 2.2,
        marginLeft: 15,
        color: Colors.sky
    }
})