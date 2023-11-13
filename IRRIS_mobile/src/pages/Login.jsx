import React, { useState, useEffect } from "react";
import IRISLogo from "../assets/images/iris_logo.png";
import { useNavigate, Link } from "react-router-dom";
import { Spinner } from "flowbite-react";
import "../styles/login/login.css";
import { containsGmail, validatePassword } from "../utils/utils";
import { Eye, EyeSlash } from "@phosphor-icons/react";
import axios from "axios";
import { login, getStudent } from "../services/api/authService";

const Login = () => {
  const [formFields, setFormFields] = useState({ email: "", password: "" });
  const [isShowPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState({ isError: false, message: "" });
  const [passwordError, setPasswordError] = useState({
    isError: false,
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [invalidAccount, setInvalidAccount] = useState({
    isError: false,
    message: "",
  });

  const navigate = useNavigate();

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

  const passwordIcon = isShowPassword ? (
    <EyeSlash size={30} color="#9c9c9c" />
  ) : (
    <Eye size={30} color="#9c9c9c" />
  );

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormFields((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    name === "email"
      ? setEmailError({ ...emailError, isError: false })
      : setPasswordError({ ...passwordError, isError: false });
  };

  const handleSubmit = async () => {
    const validation = validatePassword(formFields.password);
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

    if (formFields.password === "") {
      setPasswordError({ isError: true, message: "Please input password." });
      isError = true;
    } else if (!validation.isValid) {
      setPasswordError({ isError: true, message: validation.errors });
      isError = true;
    }

    if (!isError) {
      setIsLoading(true);
      try {
        console.log("sending data", formFields);
        const response = await login(formFields.email, formFields.password);
        if (response) {
          navigate(response.route);
        }
        console.log("Login successful", response);
        // Handle successful login here (e.g., navigate to another page, store the token)
      } catch (error) {
        // Handle error (e.g., show error message)
        console.log("Login failed", error);

        if (error) {
          setIsLoading(false);
          console.log("error response", error.response.data);
        }
      }
    }
  };

  const handleShowPassword = () => {
    setShowPassword(!isShowPassword);
  };

  return (
    <div className=" h-screen w-screen flex flex-col items-center  element relative">
      <div className="flex justify-center items-center w-full h-[35%] z-10">
        <img src={IRISLogo} />
      </div>

      <div className="flex flex-col  w-full h-[65%] z-10 space-y-8 px-16 pt-20">
        <div className="relative w-full  items-center">
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
            <p className="text-red-400">{emailError.message}</p>
          )}
        </div>

        <div className="relative w-full flex flex-col justify-center">
          <button
            onClick={handleShowPassword}
            className=" absolute right-2 top-2.5x`"
          >
            {passwordIcon}
          </button>

          <input
            type={`${isShowPassword ? "text" : "password"}`}
            name="password"
            value={formFields.password}
            onChange={handleChange}
            placeholder="Password"
            className={`${
              passwordError.isError ? "border-rose-500" : ""
            } border-mainColor  border-2 rounded-md p-3 w-full focus:outline-none focus:border-mainColor`}
          />
          {passwordError.isError && (
            <p className="text-red-400">{passwordError.message}</p>
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
        {/* <p>Checking user role</p> */}
      </div>

      <div className="bg-input-login w-full h-[33rem] absolute bottom-0"></div>
    </div>
  );
};

export default Login;
