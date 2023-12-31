import React from "react";
import StudentIcon from "../assets/images/student_login_icon.png";
import "../index.css";
import { Link } from "react-router-dom";

const ActivateSuccessPage = () => {
  return (
    <div className="h-screen w-screen flex background flex-col items-center space-y-10">
      <div className="mt-24 ">
        <img src={StudentIcon} alt="studentIcon" className="w-50" />
      </div>

      <p className="w-3/5 text-xl font-bold  text-center text-mainColor">
        Your account has been verified successfully!
      </p>
      <button className="w-4/5">
        <Link
          to="/create-password"
          className="py-4 bg-mainColor rounded-lg text-white font-semibold text-xl w-full inline-block"
        >
          LET'S GET STARTED
        </Link>
      </button>
    </div>
  );
};

export default ActivateSuccessPage;
