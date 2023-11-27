import React, { useState, useEffect } from "react";
import IRISLogo from "../assets/images/iris_logo.png";
import { useNavigate, Link } from "react-router-dom";
import { Spinner } from "flowbite-react";
import "../styles/login/login.css";
import { containsGmail, validatePassword } from "../utils/utils";
import { Eye, EyeSlash } from "@phosphor-icons/react";
import toast, { Toaster } from "react-hot-toast";
import { login, getStudent } from "../services/api/authService";
import useUserStore from "../services/state/userStore";
import QCULogo from "../assets/images/qcu_logo.png";
import QCUImage from "../assets/images/qcu_image.jpg";

import Cookies from "js-cookie";

const Login = () => {
  const { setEmail, setUser } = useUserStore();
  const [formFields, setFormFields] = useState({ email: "", password: "" });
  const [isShowPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState({ isError: false, message: "" });
  // const [passwordError, setPasswordError] = useState({
  //   isError: false,
  //   message: "",
  // });
  const [isLoading, setIsLoading] = useState(false);
  const [isAccountError, setAccountError] = useState(false);

  const navigate = useNavigate();

  const notify = (message) =>
    toast.error(message, {
      style: {
        fontSize: "1rem",
      },
    });

  useEffect(() => {
    // Check for authToken cookie
    const authToken = Cookies.get("authToken");

    console.log("authToken", authToken);

    // If authToken does  exist, redirect to home page
    if (authToken) {
      navigate("/student/home");
    }
  }, [navigate]);

  useEffect(() => {
    let timeoutId;

    if (isShowPassword) {
      timeoutId = setTimeout(() => {
        setShowPassword(false);
      }, 2000);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isShowPassword]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormFields((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    setEmailError({ ...emailError, isError: false });
  };

  const handleSubmit = async () => {
    // const validation = validatePassword(formFields.password);
    let isError = false;

    if (formFields.email === "") {
      setEmailError({ isError: true, message: "Please input email." });
      isError = true;
    } else if (!containsGmail(formFields.email)) {
      setEmailError({
        isError: true,
        message: "Please input a valid email address",
      });
      isError = true;
    }

    // if (formFields.password === "") {
    //   setPasswordError({ isError: true, message: "Please input password." });
    //   isError = true;
    // } else if (!validation.isValid) {
    //   setPasswordError({ isError: true, message: validation.errors });
    //   isError = true;
    // }

    if (!isError) {
      setIsLoading(true);
      try {
        const response = await login(formFields.email, formFields.password);
        if (response) {
          console.log("Login success", response);
          setEmail(response.user_email);
          setUser(response.user);
          if (response.token) {
            //set token in cookies
            Cookies.set("authToken", response.token, { expires: 7 });
          }

          navigate(response.route);
        }
        // Handle successful login here (e.g., navigate to another page, store the token)
      } catch (error) {
        setIsLoading(false);

        if (error.response) {
          const status = error.response.status;
          let errorMessage = "";

          switch (status) {
            //Account is not in database
            case 422:
              errorMessage = "Account doesn't exist";
              break;
            // Handle other status codes if needed
            default:
              errorMessage = "An error occurred";
          }
          setAccountError(true);
          notify(errorMessage);
        }
      }
    }
  };

  const handleShowPassword = () => {
    setShowPassword(!isShowPassword);
  };

  const passwordIcon = isShowPassword ? (
    <EyeSlash size={30} color="#9c9c9c" />
  ) : (
    <Eye size={30} color="#9c9c9c" />
  );

  return (
    <div className=" h-screen w-screen flex flex-col items-center justify-center   relative">
      <Toaster />

      <div className="bg-white rounded-md w-[80%] flex flex-col items-center justify-center space-y-10 px-5 py-14 z-10 shadow-lg relative mb-20">
        <div className="absolute top-[-3rem] rounded-full bg-white shadow-md">
          <img src={QCULogo} alt="qcu-logo" className="w-24 h-24" />
        </div>

        <div className="relative w-full items-center">
          <input
            type="email"
            name="email"
            value={formFields.email}
            onChange={handleChange}
            placeholder="Email"
            className={`${
              emailError.isError ? "border-rose-500" : ""
            } rounded-md p-3 w-full focus:outline-none focus:border-mainColor border-mainColor  border-2`}
          />

          {emailError.isError && (
            <p className="text-red-400 italic">{emailError.message}</p>
          )}
        </div>

        <button
          onClick={handleSubmit}
          className="py-4 bg-mainColor rounded-lg text-white font-semibold flex justify-center text-xl w-full inline-block"
        >
          {isLoading ? (
            <Spinner aria-label="Large spinner example" size="lg" />
          ) : (
            "Login"
          )}
        </button>
      </div>

      {/* Background design input */}
      <div className="bg-qcu-image w-full h-[70%] absolute top-0">
        <img src={QCUImage} className="w-full h-full opacity-50 bg-blue-100" />
      </div>
      <div className="bg-input-login w-full h-[30rem] absolute bottom-0"></div>
    </div>
  );
};

export default Login;
