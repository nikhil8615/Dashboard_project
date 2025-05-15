import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = ({ setToken }) => {
  const [userID, setUserID] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [availableRoles, setAvailableRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("http://localhost:4000/api/user/roles");
        const data = await response.json();

        if (data.success) {
          setAvailableRoles(data.roles);
        } else {
          console.error("Failed to fetch roles:", data.message);
          toast.error("Failed to load roles");
        }
      } catch (error) {
        console.error("Error fetching roles:", error);
        toast.error("Error connecting to server");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoles();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const endpoint =
        role === "superadmin"
          ? "http://localhost:4000/api/user/superadminlogin"
          : "http://localhost:4000/api/user/login";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userID, password, role }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userRole", role);

        toast.success("Login successful!");
        console.log("Login successful", data);

        setToken(data.token);
      } else {
        // Handle error
        toast.error(data.message || "Login failed!");
        console.error("Login failed", data);
      }
    } catch (error) {
      toast.error("Error connecting to server.");
      console.error("Error during login:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center w-full">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="bg-white shadow-md rounded-lg px-8 py-6  max-w-md">
        <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-3 min-w-72">
            <p className="text-sm font-medium text-gray-700 mb-2">Role</p>
            <select
              onChange={(e) => setRole(e.target.value)}
              value={role}
              className="rounded-md w-full py-2 px-3 border border-gray-300 outline-none"
              required
              disabled={isLoading}
            >
              <option value="" disabled>
                {isLoading ? "Loading roles..." : "Select Role"}
              </option>
              {availableRoles.map((roleOption, index) => (
                <option key={index} value={roleOption.Worker_role}>
                  {roleOption.Worker_role}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3 min-w-72">
            <p className="text-sm font-medium text-gray-700 mb-2">UserID</p>
            <input
              onChange={(e) => setUserID(e.target.value)}
              value={userID}
              className="rounded-md w-full py-2 px-3 border border-gray-300 outline-none "
              type="text"
              name=""
              placeholder="ABC123"
              id=""
              required
            />
          </div>

          <div className="mb-3 min-w-72">
            <p className="text-sm font-medium text-gray-700 mb-2">Password</p>
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className="rounded-md w-full py-2 px-3 border border-gray-300 outline-none "
              type="password"
              name=""
              placeholder="Enter your password"
              id=""
              required
            />
          </div>

          <button
            className="mt-2 w-full py-2 px-4 rounded-md text-white bg-black cursor-pointer"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
