import { toast } from "react-toastify";

export const showSuccess = (message) => {
  return toast.success(message || "Successed");
};

export const showError = (error) => {
  if (
    error &&
    error.response &&
    error.response.data &&
    error.response.data === "Unauthenticated"
  )
    return;

  if (error && error.response && error.response.data) {
    if (error.response.data.toString().includes("<html"))
      return toast.error("Error occurred. Try again later.");
    else {
      if (error.response.data === "SESSION_EXPIRED") {
        toast.error(error.response.data);

        return window.location.reload("/");
      } else return toast.error(error.response.data);
    }
  } else if (error.message) return toast.error(error.message);
  else return toast.error(error || "Error occurred. Try again");
};
