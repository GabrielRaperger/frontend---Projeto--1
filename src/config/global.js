import { toast } from "react-toastify";

export const baseApiUrl = "https://meeting-manager-backend.herokuapp.com";

export const userKey = "__meeting_user";

export function showError(e) {
  if (e && e.response && e.response.data) {
    toast.error(e.response.data, {
      position: toast.POSITION.TOP_RIGHT,
      toastId: "error",
    });
  } else if (typeof e === "string") {
    toast.error(e, {
      position: toast.POSITION.TOP_RIGHT,
      toastId: "error",
    });
  } else {
    toast.error("Ocorreu um erro", {
      position: toast.POSITION.TOP_RIGHT,
      toastId: "error",
    });
  }
}

export function showSuccess(msg) {
  toast.success(msg, {
    position: toast.POSITION.TOP_RIGHT,
    toastId: "success",
  });
}
