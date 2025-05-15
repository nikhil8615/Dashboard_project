import React from "react";
import { useNavigate } from "react-router-dom";
import img from "../assets/logo.png";

const Navbar = ({ setToken }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    setToken("");
    navigate("/");
  };

  return (
    <div className="flex items-center justify-between py-2 px-[4%]">
      <img className="w-20" src={img} alt="" />
      <button
        onClick={handleLogout}
        className="bg-gray-600 text-white px-5 py-2 sm:px-7 sm:py-2 rounded-full text-xs sm:text-sm cursor-pointer"
      >
        Logout
      </button>
    </div>
  );
};

export default Navbar;
