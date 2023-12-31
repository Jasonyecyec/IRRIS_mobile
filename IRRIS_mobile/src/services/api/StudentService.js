import api from "./api";

export const activateStudent = async (email) => {
  try {
    const response = await api.post(`/activate-account`, { email });
    return response.data;
  } catch (error) {
    console.error("Activate error", error.response);
    throw error;
  }
};

export const verifyOTP = async (email, otp) => {
  try {
    const response = await api.post(`/verify-otp`, { email, otp });
    return response.data;
  } catch (error) {
    console.error("Verify OTP error", error.response);
    throw error;
  }
};

// export const getUser = async (email, otp) => {
//   try {
//     const response = await api.post(`/verify-otp`, { email, otp });
//     return response.data;
//   } catch (error) {
//     console.error("Verify OTP error", error.response);
//     throw error;
//   }
// };

export const resendOTP = async (email) => {
  try {
    const response = await api.post(`/resend-otp`, { email });
    return response.data;
  } catch (error) {
    console.error("Resend OTP error", error.response);
    throw error;
  }
};

export const createPassword = async (email, password, confirmPassword) => {
  try {
    const response = await api.post(`/create-password`, {
      email,
      password,
      confirmPassword,
    });
    return response.data;
  } catch (error) {
    console.error("Create password error", error.response);
    throw error;
  }
};
