import React, {useCallback, useState, useEffect} from 'react';
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

const styles = StyleSheet.create({
  highlight: {
    fontWeight: '700',
  },
});
const today = new Date();
const parseDate = date => {
  return `${date.getFullYear()}${String(date.getMonth() + 1).padStart(
    2,
    '0',
  )}${String(date.getDate()).padStart(2, '0')}`;
};

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [date, _setDate] = useState(new Date());
  const [lunch, setLunch] = useState('initial');
  const [over, setOver] = useState(false);
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
        `https://open.neis.go.kr/hub/mealServiceDietInfo?Type=json&SD_SCHUL_CODE=${SD_SCHUL_CODE}&ATPT_OFCDC_SC_CODE=${ATPT_OFCDC_SC_CODE}&MLSV_YMD=${parseDate(
          date,
        )}`,
      );
      setLunch('1234');
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
          <Text>{lunch}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default App;
