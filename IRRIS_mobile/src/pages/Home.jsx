import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Settings from "./Settings";
import HomePage from "./HomePage";
import EyeIcon from "../assets/images/eye_icon.png";
import ScanIcon from "../assets/images/scan_icon.png";
import MenuIcon from "../assets/images/menu_icon.png";
import RequestPage from "./RequestPage";

const Home = () => {
  return (
    <div className="h-screen relative  bg-thirdColor">
      <div className="w-full p-5">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="history" element={<div>History </div>} />
          <Route path="settings" element={<Settings />} />
          <Route path="request" element={<RequestPage />} />
        </Routes>
      </div>

      <div className="bg-[#16425B] absolute py-2 bottom-5 left-1/2 transform -translate-x-1/2 rounded-lg  w-10/12  flex px-5 justify-center">
        <div className="relative w-full flex justify-around ">
          <Link to="/home">      
            <button>
              <img src={EyeIcon} className="w-14 h-14" />
            </button>
          </Link>

          <div className="absolute flex items-center justify-center bottom-0 right-27.5  h-full ">
            <button className="rounded-full p-1 bg-[#16425B] flex justify-center content-center">
              <img src={ScanIcon} className="w-20  h-20 object-fit" />
            </button>
          </div>

          <Link to="settings">
            <button>
              <img src={MenuIcon} className="w-14 h-14" />
            </button>
          </Link>
        </div>

        {/* <Link to="history">History</Link>
      
        <Link to="settings">Settings</Link> */}
      </div>
    </div>
  );
};

export default Home;
