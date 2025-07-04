import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import type { TimeIntervalTriggerInput } from "expo-notifications";
// import { Platform } from "react-native";

export const useNotification = () => {
  const registerForPushNotificationsAsync = async () => {
    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status: requestedStatus } = await Notifications.requestPermissionsAsync();
        finalStatus = requestedStatus;
      }
      if (finalStatus !== "granted") {
        alert("通知許可が必要です");
        return;
      }
    }
  };

  const scheduleNotification = async (title: string, body: string) => {
    const trigger: TimeIntervalTriggerInput = {
      seconds: 10,
      repeats: false,
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
    }
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
      },
      trigger,
    });
  };

  return { registerForPushNotificationsAsync, scheduleNotification }
};
