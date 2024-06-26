// utils.js

export const containsGmail = (str) => {
  return str.includes("@gmail");
};

export const validatePassword = (password) => {
  let errors = "";
  let isValid = true;

  if (password.length < 8) {
    errors = "Must be at least 8 characters long. ";
    isValid = false;
  }
  if (!/[A-Z]/.test(password)) {
    errors = "Must contain at least one uppercase letter. ";
    isValid = false;
  }
  if (!/[0-9]/.test(password)) {
    errors = "Must contain at least one number. ";
    isValid = false;
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors = "Must contain at least one special character. ";
    isValid = false;
  }

  return {
    isValid: isValid,
    errors: errors.trim(), // Remove any trailing whitespace
  };
};

export const maskEmail = (email) => {
  const atIndex = email.indexOf("@");
  const dotIndex = email.lastIndexOf(".");

  if (atIndex !== -1 && dotIndex !== -1) {
    const username = email.slice(0, atIndex);
    const maskedUsername =
      username.length > 1
        ? `${username[0]}${"*".repeat(username.length - 2)}${username.slice(
            -1
          )}`
        : username;
    const domain = email.slice(atIndex, dotIndex);
    const maskedEmail = `${maskedUsername}${domain}${email.slice(dotIndex)}`;
    return maskedEmail;
  }

  return email; // Return the original email if '@' or '.' is not found
};

export const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
};

export const formatDate = (inputDate) => {
  const options = { day: "numeric", month: "short", year: "numeric" };
  const date = new Date(inputDate);

  // Get the current date
  const currentDate = new Date();

  // Check if the date is today
  if (
    date.getDate() === currentDate.getDate() &&
    date.getMonth() === currentDate.getMonth() &&
    date.getFullYear() === currentDate.getFullYear()
  ) {
    return "Today";
  }

  return date.toLocaleDateString("en-US", options);
};

export const formatDateTime = (inputDateTime) => {
  const options = {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
  };

  const dateTime = new Date(inputDateTime);

  // Get the current date and time
  const currentDateTime = new Date();

  // Check if the date is today
  if (
    dateTime.getDate() === currentDateTime.getDate() &&
    dateTime.getMonth() === currentDateTime.getMonth() &&
    dateTime.getFullYear() === currentDateTime.getFullYear()
  ) {
    return (
      "Today " +
      dateTime.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
      })
    );
  }

  return dateTime.toLocaleDateString("en-US", options);
};

export const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const getImageUrl = (imagePath) => {
  // const baseUrl = "http://127.0.0.1:8000/images"; // Base URL of your Laravel backend
  const baseUrl = "https://irris-sbit4a-api.com/images";
  return `${baseUrl}/${imagePath}`;
};

export const getPdfUrl = (imagePath) => {
  // const baseUrl = 'http://127.0.0.1:8000/reward_certificates'; // Base URL of your Laravel backend
  const baseUrl = "https://irris-sbit4a-api.com/reward_certificates";
  return `${baseUrl}/${imagePath}`;
};

export const getStatusColor = (status) => {
  switch (status) {
    case "pending":
      return "yellow";
    case "assigned":
      return "purple";
    case "ongoing":
      return "blue";
    case "completed":
      return "green";
    case "not-valid":
      return "red";
    case "reported":
      return "green";
    default:
      return "gray"; // You can set a default color or handle other cases as needed
  }
};

export const getStatusText = (status) => {
  switch (status) {
    case "ongoing":
      return "In Progress";
    case "completed":
      return "Completed";
    case "assigned":
      return "Assigned";
    case "pending":
      return "Pending";
    case "not-valid":
      return "Not Valid";
    case "reported":
      return "Reported";
    default:
      return "Unknown";
  }
};

export const isTaskDurationValid = (dateStarted) => {
  // Parse the dateStarted string into a Date object
  const startDate = new Date(dateStarted);

  // Calculate the current time
  const currentTime = new Date();

  // Calculate the time difference in milliseconds
  const timeDifference = currentTime - startDate;

  // Check if the time difference is greater than or equal to 3 minutes (180,000 milliseconds)
  return timeDifference >= 120000;
};

export const isNotPastDueDate = (dateString) => {
  // Extract the date part from the date string
  var datePart = dateString.split(" ")[0];

  // Convert the date part to a Date object
  var date = new Date(datePart.replace(/-/g, "/")); // Replace '-' with '/' for cross-browser compatibility

  // Get the current date
  var currentDate = new Date();

  // Check if the given date is not in the past
  return date.getTime() <= currentDate.getTime();
};
