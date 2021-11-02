/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useCallback, useState, useEffect} from 'react';
import type {Node} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Center,
} from 'react-native';
import Axios from 'axios';
import {RNHP} from 'react-native-html-parser';
import RNPickerSelect from 'react-native-picker-select';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

const DOMParser = new RNHP.DOMParser();
const styles = StyleSheet.create({
  highlight: {
    fontWeight: '700',
  },
});
const today = new Date();
const ATPT_OFCDC_SC_CODE = 'J10';
const SD_SCHUL_CODE = '7530054';

const App: () => Node = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [date, _setDate] = useState(new Date());
  const [lunch, setLunch] = useState('');
  const [over, setOver] = useState(false);
  const parseDate = useCallback(() => {
    return `${date.getFullYear()}${String(date.getMonth() + 1).padStart(
      2,
      '0',
    )}${String(date.getDate()).padStart(2, '0')}`;
  }, [date]);
  const setDate = useCallback(
    (month, date) => {
      _setDate(new Date(date.getFullYear(), month, date));
    },
    [date],
  );
  const getWeek = useCallback(() => {
    const weekList = ['일', '월', '화', '수', '목', '금', '토'];
    return weekList[date.getDay()];
  }, [date]);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  useEffect(() => {
    const fetch = async () => {
      const {data} = await Axios.get(
        `https://open.neis.go.kr/hub/mealServiceDietInfo?Type=json&SD_SCHUL_CODE=${SD_SCHUL_CODE}&ATPT_OFCDC_SC_CODE=${ATPT_OFCDC_SC_CODE}&MLSV_YMD=${parseDate()}`,
      );
      setLunch(data.mealServiceDietInfo[1].row[0].DDISH_NM);
    };
    fetch();
  }, [date]);

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Center>
            <Text>
              {date.getFullYear()}년 {date.getMonth()}월 {date.getDate()}일{' '}
              {getWeek()}요일 {date == today && '(오늘)'}
            </Text>
            <Text>{DOMParser.parseFromString(lunch, 'text/html')}</Text>
            <RNPickerSelect
              onValueChange={value => {
                setDate(value, date.getDate());
              }}
              items={[
                Array(12).map((empty, i) => {
                  return {label: Number(i) + 1, value: i};
                }),
              ]}
            />
            월
            <RNPickerSelect
              onValueChange={value => {
                setDate(date.getMonth(), value);
              }}
              items={[
                Array(31).map((empty, i) => {
                  return {label: Number(i) + 1, value: Number(i) + 1};
                }),
              ]}
            />
            일
          </Center>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default App;
