import React from "react";
import { notification } from "antd";

const ToastMessage = ({ type, message, description, duration = 3 }) => {
  React.useEffect(() => {
    if (type && message) {
      notification[type]({
        message,
        description,
        duration,
      });
    }
  }, [type, message, description, duration]);

  return null;
};

export const showToast = (type, message, description, duration = 3) => {
  notification[type]({
    message,
    description,
    duration,
  });
};

export default ToastMessage;
