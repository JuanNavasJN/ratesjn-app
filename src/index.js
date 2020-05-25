/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import {
  Header,
  Title,
  Left,
  Right,
  Body,
  Icon,
  Button,
  Text,
  Item,
  Input,
} from 'native-base';
import {vh, vw} from 'react-native-css-vh-vw';
import NumberFormat from 'react-number-format';
import moment from 'moment';
import axios from 'axios';
const bgHeader = '#141a38';

// const formatNumber = number => {
//   return new Intl.NumberFormat('en-US', {minimumFractionDigits: 2}).format(
//     number,
//   );
// };

function formatNumber(
  amount,
  decimalCount = 2,
  decimal = '.',
  thousands = ',',
) {
  try {
    decimalCount = Math.abs(decimalCount);
    decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

    const negativeSign = amount < 0 ? '-' : '';

    let i = parseInt(
      (amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)),
    ).toString();
    let j = i.length > 3 ? i.length % 3 : 0;

    return (
      negativeSign +
      (j ? i.substr(0, j) + thousands : '') +
      i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + thousands) +
      (decimalCount
        ? decimal +
          Math.abs(amount - i)
            .toFixed(decimalCount)
            .slice(2)
        : '')
    );
  } catch (e) {
    console.log(e);
  }
}

const App = () => {
  const [currentRate, setCurrentRate] = useState('Monitor');
  const [rate, setRate] = useState();
  const [lastUpdate, setlastUpdate] = useState(moment().format('hh:mm:ss A'));
  const [bs, setBs] = useState('0');
  let [dollars, setDollars] = useState('1');
  const [monitor, setMonitor] = useState(0);
  const [airtm, setAirtm] = useState(0);

  useEffect(_ => {
    fetchData();
  }, []);

  useEffect(
    _ => {
      for (let i = 0; i < 10; i++) {
        dollars = dollars.replace(',', '');
      }

      switch (currentRate) {
        case 'Monitor':
          setBs(formatNumber((Number(dollars) * monitor).toFixed(2)));
          break;
        case 'AirTM':
          setBs(formatNumber((Number(dollars) * airtm).toFixed(2)));
          break;
        default:
          break;
      }
    },
    [currentRate, airtm, monitor],
  );

  useEffect(
    _ => {
      if (bs === '1') {
        switch (currentRate) {
          case 'Monitor':
            setDollars(formatNumber(String(monitor)));
            break;
          case 'AirTM':
            setDollars(formatNumber(String(airtm)));
            break;
          default:
            break;
        }
      }
    },
    [bs, monitor, airtm],
  );

  const fetchData = _ => {
    axios.get('https://rates.juannavas.dev/monitor').then(res => {
      const {value} = res.data;
      setMonitor(value);
    });

    axios.get('https://rates.juannavas.dev/airtm/sell').then(res => {
      const {value} = res.data;
      setAirtm(value);
    });

    setlastUpdate(moment().format('hh:mm:ss A'));
  };

  const handleDollarChange = value => {
    for (let i = 0; i < 10; i++) {
      value = value.replace(',', '');
    }

    if (value === '') {
      setBs('');
      setDollars('');
      return;
    }

    setDollars(value);

    switch (currentRate) {
      case 'Monitor':
        setBs(formatNumber((Number(value) * monitor).toFixed(2)));
        break;
      case 'AirTM':
        setBs(formatNumber((Number(value) * airtm).toFixed(2)));
        break;
      default:
        break;
    }
  };

  const handleBsChange = value => {
    for (let i = 0; i < 10; i++) {
      value = value.replace(',', '');
    }

    if (value === '') {
      setBs('');
      setDollars('');
      return;
    }

    setBs(value);

    switch (currentRate) {
      case 'Monitor':
        setDollars(formatNumber((Number(value) / monitor).toFixed(2)));
        break;
      case 'AirTM':
        setDollars(formatNumber((Number(value) / airtm).toFixed(2)));
        break;
      default:
        break;
    }
  };

  return (
    <View>
      <Header
        androidStatusBarColor={bgHeader}
        style={[styles.header, {backgroundColor: bgHeader}]}>
        <Body style={styles.headerBody}>
          <Text style={[styles.textWhite, styles.textHeader]}>RatesJN</Text>
        </Body>
      </Header>
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <View style={styles.row}>
            <Text style={[styles.textWhite, styles.textBold]}>
              {currentRate}
            </Text>
            <Text style={[styles.textWhite]}>
              $ 1 = Bs.{' '}
              {currentRate === 'Monitor' ? (
                <NumberFormat
                  value={monitor}
                  displayType={'text'}
                  thousandSeparator={true}
                  renderText={value => (
                    <Text style={styles.textWhite}>{value}</Text>
                  )}
                />
              ) : (
                <NumberFormat
                  value={airtm}
                  displayType={'text'}
                  thousandSeparator={true}
                  renderText={value => (
                    <Text style={styles.textWhite}>{value}</Text>
                  )}
                />
              )}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={[styles.textWhite]}>Bs.</Text>
            <Item regular>
              <Input
                placeholder="Bs"
                keyboardType="numeric"
                style={styles.textInput}
                value={bs}
                onChangeText={handleBsChange}
              />
            </Item>
            <Text style={[styles.textWhite]}>$</Text>
            <Item regular>
              <Input
                placeholder="$"
                keyboardType="numeric"
                style={styles.textInput}
                value={dollars}
                onChangeText={handleDollarChange}
              />
            </Item>
          </View>
          <View style={[styles.row]}>
            <TouchableOpacity onPress={fetchData}>
              <Text style={styles.textWhite}>
                Última actualización: {lastUpdate} {'   '}
                <Icon
                  type="AntDesign"
                  name="reload1"
                  style={styles.reloadIcon}
                />
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.row}>
            <View style={styles.btns}>
              <View>
                <Button
                  style={styles.btn}
                  onPress={_ => setCurrentRate('Monitor')}>
                  <Text>Monitor</Text>
                </Button>
                <Text style={styles.textWhite}>
                  Bs.{' '}
                  <NumberFormat
                    value={monitor}
                    displayType={'text'}
                    thousandSeparator={true}
                    renderText={value => (
                      <Text style={styles.textWhite}>{value}</Text>
                    )}
                  />
                </Text>
              </View>
              <View>
                <Button
                  style={styles.btn}
                  onPress={_ => setCurrentRate('AirTM')}>
                  <Text>AirTM</Text>
                </Button>
                <Text style={styles.textWhite}>
                  Bs.{' '}
                  <NumberFormat
                    value={airtm}
                    displayType={'text'}
                    thousandSeparator={true}
                    renderText={value => (
                      <Text style={styles.textWhite}>{value}</Text>
                    )}
                  />
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  headerBody: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: '#1a2147',
    width: vw(100),
    height: vh(92),
  },
  textHeader: {
    fontSize: 22,
  },
  textWhite: {
    color: '#e6e6e6',
  },
  row: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  btns: {
    flexDirection: 'row',
    // backgroundColor: '#ccc',
    width: vw(100),
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  btn: {
    justifyContent: 'center',
  },
  textBold: {
    fontWeight: 'bold',
    marginBottom: 10,
  },
  textInput: {
    color: '#e6e6e6',
  },
  reloadIcon: {
    color: '#e6e6e6',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default App;
