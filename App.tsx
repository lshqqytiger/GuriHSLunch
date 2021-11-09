import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import { WebView } from "react-native-webview";
import { Picker } from "@react-native-picker/picker";

import Axios from "axios";

const today = new Date();
const ATPT_OFCDC_SC_CODE = "J10";
const SD_SCHUL_CODE = "7530054";
const parseDate = (date: Date) => {
  return `${date.getFullYear()}${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}${String(date.getDate()).padStart(2, "0")}`;
};

export default function App() {
  const [date, setDate] = useState(new Date());
  const [lunch, setLunch] = useState("");
  const [noLunch, setNoLunch] = useState(false);
  const [over, setOver] = useState(false);
  const getWeek = useCallback(() => {
    const weekList = ["일", "월", "화", "수", "목", "금", "토"];
    return weekList[date.getDay()];
  }, [date]);

  useEffect(() => {
    const fetchLunch = async () => {
      const { data } = await Axios.get(
        `https://open.neis.go.kr/hub/mealServiceDietInfo?Type=json&SD_SCHUL_CODE=${SD_SCHUL_CODE}&ATPT_OFCDC_SC_CODE=${ATPT_OFCDC_SC_CODE}&MLSV_YMD=${parseDate(
          date
        )}`
      );
      if (!data.mealServiceDietInfo) return setNoLunch(true);
      if (date.getHours() > 13) setOver(true);
      else setOver(false);
      setNoLunch(false);
      setLunch(data.mealServiceDietInfo[1].row[0].DDISH_NM);
    };
    fetchLunch();
  }, [date]);

  return (
    <View style={styles.container}>
      <View style={styles.singleContainer}>
        <Text>
          {date.getFullYear()}년 {date.getMonth() + 1}월 {date.getDate()}일{" "}
          {getWeek()}요일{" "}
          {date.toDateString() == today.toDateString() && "(오늘)"}
        </Text>
      </View>
      <View style={styles.singleContainer}>
        <WebView
          style={styles.lunch}
          originWhitelist={["*"]}
          source={{ html: noLunch ? "" : lunch }}
        />
      </View>
      <View style={styles.singleContainer}>
        {noLunch && (
          <Text>
            급식이 없는 날이거나 나이스 OpenAPI를 제공하지 않는 학교입니다.
          </Text>
        )}
      </View>
      <View style={styles.selectBoxContainer}>
        <Picker
          style={styles.selectBox}
          selectedValue={date.getMonth()}
          onValueChange={(value) => {
            setDate(new Date(date.getFullYear(), value, date.getDate()));
          }}
        >
          {[...Array(12)].map((_, i) => {
            return <Picker.Item label={String(i + 1)} value={i} />;
          })}
        </Picker>
        <Text>월</Text>
        <Picker
          style={styles.selectBox}
          selectedValue={date.getDate()}
          onValueChange={(value) => {
            setDate(new Date(date.getFullYear(), date.getMonth(), value));
          }}
        >
          {[...Array(31)].map((_, i) => {
            return <Picker.Item label={String(i + 1)} value={i + 1} />;
          })}
        </Picker>
        <Text>일</Text>
      </View>
      <View style={styles.singleContainer}>
        {over && (
          <>
            <Text>
              오늘 점심 시간은 지났습니다. 내일 급식을 확인하시겠습니까?
            </Text>
            <Button
              title="내일 급식 보기"
              onPress={() => {
                setDate(
                  new Date(
                    date.getFullYear(),
                    date.getMonth(),
                    date.getDate() + 1
                  )
                );
              }}
            />
            <Button
              title="무시"
              onPress={() => {
                setOver(false);
              }}
            />
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    height: "70%",
  },
  singleContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  selectBoxContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  selectBox: {
    width: "100%",
  },
  lunch: {
    width: "100%",
    height: "100%",
  },
});
