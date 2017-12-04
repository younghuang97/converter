import React from "react";
import {View, TextInput, Picker, AsyncStorage} from 'react-native';
import money from 'money';
import convert from 'convert-units';
import styles from '../../../../../assets/styles/ConversionListStyles';
import currOpts from './currencies.json';

export default class ConversionListView extends React.Component {

    constructor(props) {
        super(props)
        let cOpts = convert().measures()// measures() returns all conversion options but currency
        this.state = {
            amt1: '', // default amount, top
            amt2: '', // default amount, bottom
            picker1: 'mm', // default unit, top
            picker2: 'mm', // default unit bottom
            convOpts: cOpts,
            conv: 'length', // default conversion base
        }
    }

    // grabs currency rates right when the tool is instantiated
    componentDidMount() {
        fetch('https://api.fixer.io/latest')
            .then((resp) => resp.json())
            .then((data) => {
                // if connected to internet, grab rates from web and store it in local db
                money.rates = data.rates
                let pairsOfData = []
                for (let label in data.rates) {
                    pairsOfData.push([label, JSON.stringify(data.rates[label])])
                }
                AsyncStorage.multiSet(pairsOfData, (err) => {
                    if (err)
                        console.error(err)
                })
            })
            .catch(async () => {
                // if not connected to internet, grab rates from local db
                let data = currOpts.data
                for (let i in data) {
                    let label = currOpts.data[i].value
                    await AsyncStorage.getItem(label, (err, res) => {
                        if (err) {
                            console.error(err)
                        }
                        else if (res != null)
                            money.rates[label] = res
                    })
                }
            })
            .then(() => {
                // if we have the rates, display the currency option
                if (Object.keys(money.rates).length > 0) 
                    this.setState({convOpts: this.state.convOpts.concat(["currency"])})
            })
    }

    /* converts value from base units to desired unit
       one method for converting currencies, another method for other conversions
    */
    convert(type, val, from, to) {
        if (!val)
            return ''
        else if (from === to || val === 0)
            return val
        else if (type === 'currency')
            return parseFloat(money(val).from(from).to(to).toFixed(3))
        else
            return parseFloat(convert(val).from(from).to(to).toFixed(3))
    }

    // currency has its own set of unit options that aren't included in the convert().possibilities method
    possibilities(type) {
        if (type === 'currency')
        {
            let arr = [];
            for (let i in currOpts.data) {
                arr.push(currOpts.data[i].label)
            }
            return arr
        }
        else
            return convert().possibilities(type)
    }

    // Initialize Picker with list of items of desired converter type
    createPickerItems(type) {
        if (type === 'convOpts') {
            return this.state.convOpts.map(name => {
                return <Picker.Item label={name} value={name} key={name} />
            })
        }
        if (type === 'currency') {
            return currOpts.data.map(obj => {
                return <Picker.Item label={obj.label} value={obj.value} key={obj.label} />
            })
        }
        else {
            return convert().possibilities(type).map(name => {
                return <Picker.Item label={name} value={name} key={name} />
            })
        }
    }

    /* https://stackoverflow.com/questions/32946793/react-native-textinput-that-only-accepts-numeric-characters
       Credit to Venkatesh Somu
       Method only allows user to input numbers and a single period
     */
    onChanged(text) {
        let newText = '';
        let numbers = '0123456789';
        let count = 0;

        for (var i=0; i < text.length; i++) {    
            if(numbers.indexOf(text[i]) > -1)
                newText = newText + text[i];
            else if (text[i] === '.') { 
                count += 1;
                if (count >= 2)
                    alert("Please don't enter more than 1 decimal point.");
                else
                    newText = newText + text[i];                   
            }
            else {
                alert("Please enter numbers or a decimal point only.");
            }
        }
        return newText;
    }

    // modifies parseFloat so it doesn't return NaN when the input is null
    parseFloat(num) {
        if (num == '') 
            return num;
        else 
            return parseFloat(num);
    }

    render() {
        return (
            <View>
                <View style={styles.view1}>
                    <Picker
                        style={styles.picker1}
                        selectedValue={this.state.conv}
                        onValueChange={(value) => {
                            let units = this.possibilities(value)
                            this.setState({
                                conv: value,
                                amt1: '',
                                amt2: '',
                                picker1: units[0],
                                picker2: units[0] })
                        }}>
                        {this.createPickerItems('convOpts')}
                    </Picker>
                </View>
                <View style={styles.view2}>
                    <TextInput
                        keyboardType='numeric'
                        style={styles.label1}
                        underlineColorAndroid='transparent'
                        value={this.state.amt1.toString()}
                        onChangeText={(text) => {
                            let parseInput = this.onChanged(text)
                            let converted = this.parseFloat(this.convert(this.state.conv,
                                 parseInput, this.state.picker1, this.state.picker2))
                            this.setState({amt2: converted, amt1: parseInput})
                        }}
                    />
                    <Picker
                        selectedValue={this.state.picker1}
                        style={styles.picker2}
                        onValueChange={(value) => {
                            let newAmt = this.convert(this.state.conv, this.state.amt2, this.state.picker2, value)
                            this.setState({picker1: value, amt1: newAmt})
                        }}>
                        {this.createPickerItems(this.state.conv)}
                    </Picker>
                </View>
                <View style={styles.view3}>
                    <TextInput
                        keyboardType='numeric'
                        style={styles.label2}
                        underlineColorAndroid='transparent'
                        value={this.state.amt2.toString()}
                        onChangeText={(text) => {
                            let parseInput = this.onChanged(text)
                            let converted = this.parseFloat(this.convert(this.state.conv,
                                 parseInput, this.state.picker2, this.state.picker1))
                            this.setState({amt1: converted, amt2: parseInput})
                        }}
                    />
                    <Picker
                        selectedValue={this.state.picker2}
                        style={styles.picker3}
                        onValueChange={(value) => {
                            let newAmt = this.convert(this.state.conv, this.state.amt1, this.state.picker1, value)
                            this.setState({picker2: value, amt2: newAmt})
                        }}>
                        {this.createPickerItems(this.state.conv)}
                    </Picker>
                </View>
            </View>
        )
    }
}
