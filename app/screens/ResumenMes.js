import React, { useState } from "react";
import { StyleSheet, View, Text, ScrollView } from "react-native";
import { Calendar } from "react-native-calendars";
import ResumenShow from "../components/ResumenShow";
export default function ResumenMes() {
  const [mes, setMesActual] = useState("");
  const [mesHoy, setMesHoy] = useState("");
  return (
    <ScrollView style={styles.scrollView}>
      <View style={{ paddingTop: 50, flex: 1, backgroundColor: "white" }}>
        <ResumenShow mes={mes} mesHoy={mesHoy} />
        <Calendar
          // Initially visible month. Default = Date()
          current={(Default = Date())}
          // Handler which gets executed on day press. Default = undefined
          onDayPress={(day) => {
            setMesHoy(day.month - 1);
            switch (day.month - 1) {
              case 0:
                setMesActual("Enero");
                break;
              case 1:
                setMesActual("Febrero");
                break;
              case 2:
                setMesActual("Marzo");
                break;
              case 3:
                setMesActual("Abril");
                break;
              case 4:
                setMesActual("Mayo");
                break;
              case 5:
                setMesActual("Junio");
                break;
              case 6:
                setMesActual("Julio");
                break;
              case 7:
                setMesActual("Agosto");
                break;
              case 8:
                setMesActual("Septiembre");
                break;
              case 9:
                setMesActual("Octubre");
                break;
              case 10:
                setMesActual("Noviembre");
                break;
              case 11:
                setMesActual("Diciembre");
                break;
              default:
                break;
            }
          }}
          // Month format in calendar title. Formatting values: http://arshaw.com/xdate/#Formatting
          monthFormat={"yyyy MMMM"}
          // Handler which gets executed when visible month changes in calendar. Default = undefined
          onMonthChange={(month) => {
            setMesHoy(month.month - 1);
            switch (month.month - 1) {
              case 0:
                setMesActual("Enero");
                break;
              case 1:
                setMesActual("Febrero");
                break;
              case 2:
                setMesActual("Marzo");
                break;
              case 3:
                setMesActual("Abril");
                break;
              case 4:
                setMesActual("Mayo");
                break;
              case 5:
                setMesActual("Junio");
                break;
              case 6:
                setMesActual("Julio");
                break;
              case 7:
                setMesActual("Agosto");
                break;
              case 8:
                setMesActual("Septiembre");
                break;
              case 9:
                setMesActual("Octubre");
                break;
              case 10:
                setMesActual("Noviembre");
                break;
              case 11:
                setMesActual("Diciembre");
                break;
              default:
                break;
            }
          }}
          // Hide month navigation arrows. Default = false
          hideArrows={false}
          // Do not show days of other months in month page. Default = false
          hideExtraDays={true}
          // If hideArrows=false and hideExtraDays=false do not swich month when tapping on greyed out
          // day from another month that is visible in calendar page. Default = false
          disableMonthChange={false}
          // If firstDay=1 week starts from Monday. Note that dayNames and dayNamesShort should still start from Sunday.
          firstDay={1}
        />
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  scrollView: {
    height: "100%",
    backgroundColor: "#231F20",
  },
  container: {
    flex: 0,
    backgroundColor: "#231F20",
  },
});
