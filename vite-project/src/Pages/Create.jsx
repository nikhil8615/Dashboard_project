import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PlusIcon } from "@heroicons/react/24/outline";
import img from "../assets/plus.png";

export default function CreateRoleForm() {
  const [availableRoles, setAvailableRoles] = useState([]);
  const [UserID, setUserID] = useState([]);
  const [UserPassword, setUserPassword] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [workers, setWorkers] = useState([]);
  const [editingWorker, setEditingWorker] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchWorkers();
  }, []);

  const fetchWorkers = async () => {
    try {
      setIsLoading(true);

      const workersResponse = await fetch(
        "http://localhost:4000/api/user/workers"
      );
      const workersData = await workersResponse.json();

      // Fetch roles data
      const rolesResponse = await fetch("http://localhost:4000/api/user/roles");
      const rolesData = await rolesResponse.json();

      if (workersData.success && rolesData.success) {
        setWorkers(workersData.workers);
        setAvailableRoles(rolesData.roles);
      } else {
        console.error("Failed to fetch data");
        toast.error("Failed to load data");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Error connecting to server");
    } finally {
      setIsLoading(false);
    }
  };

  const [formData, setFormData] = useState({
    tag: "",
    userId: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEdit = (worker) => {
    setEditingWorker(worker);
    setFormData({
      tag: worker.Worker_role,
      userId: worker.UserID || "",
      password: "",
    });
    setShowForm(true);
  };

  const handleCancelEdit = () => {
    setEditingWorker(null);
    setFormData({ tag: "", userId: "", password: "" });
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingWorker
        ? `http://localhost:4000/api/user/roles/${editingWorker.Worker_id}`
        : "http://localhost:4000/api/user/roles";

      const method = editingWorker ? "PUT" : "POST";

      const requestBody = {
        tag: formData.tag,
        userId: formData.userId,
        ...(formData.password && { password: formData.password }),
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      const result = await res.json();

      if (result.success) {
        toast.success(
          `Role ${editingWorker ? "updated" : "created"} successfully!`
        );
        setFormData({ tag: "", userId: "", password: "" });
        setEditingWorker(null);
        setShowForm(false);
        fetchWorkers();
      } else {
        toast.error(result.message || "Something went wrong.");
      }
    } catch (error) {
      console.error("Error saving role:", error);
      toast.error("Error connecting to server.");
    }
  };

  const handleDelete = async (worker) => {
    if (window.confirm("Are you sure you want to delete this role?")) {
      try {
        const response = await fetch(
          `http://localhost:4000/api/user/roles/${worker.Worker_id}`,
          {
            method: "DELETE",
          }
        );
        const result = await response.json();

        if (result.success) {
          toast.success(result.message || "Role deleted successfully");
          fetchWorkers();
        } else {
          toast.error(result.message || "Failed to delete role");
        }
      } catch (error) {
        console.error("Error deleting role:", error);
        toast.error("Error connecting to server");
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto mt-10 p-6">
      <ToastContainer position="top-right" autoClose={3000} />

      {!showForm ? (
        <div className="bg-white shadow-lg rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-700">
              Employee List
            </h2>
            <button
              onClick={() => {
                setShowForm(true);
                setEditingWorker(null);
                setFormData({ tag: "", userId: "", password: "" });
              }}
              className="flex items-center text-blue-600 hover:text-blue-800"
            >
              <img src={img} className="h-6 w-6 cursor-pointer" />
            </button>
          </div>
          {isLoading ? (
            <p className="text-center text-gray-600">Loading data...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Worker ID
                    </th> */}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Worker Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Password
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {workers.map((worker) => (
                    <tr key={worker.Worker_id}>
                      {/* <td className="px-6 py-4 whitespace-nowrap">
                        {worker.Worker_id}
                      </td> */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        {worker.Worker_role}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {worker.UserID}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {worker.User_password}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap space-x-2">
                        <button
                          onClick={() => handleEdit(worker)}
                          className="text-blue-600 hover:text-blue-800 mr-3 cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(worker)}
                          className="text-red-600 hover:text-red-800 cursor-pointer"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white shadow-lg rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">
            {editingWorker ? "Edit Role" : "Create Role"}
          </h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Tag
              </label>
              <input
                type="text"
                name="tag"
                value={formData.tag}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. Admin, Editor"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                User ID
              </label>
              <input
                type="text"
                name="userId"
                value={formData.userId}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. john.doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required={!editingWorker}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={
                  editingWorker
                    ? "Leave blank to keep current password"
                    : "Enter secure password"
                }
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-300"
              >
                {editingWorker ? "Update Role" : "Create Role"}
              </button>
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition duration-300"
              >
                Cancel
              </button>
            </div>
            {message && (
              <p
                className={`text-sm mt-2 ${
                  message.startsWith("✅") ? "text-green-600" : "text-red-600"
                }`}
              >
                {message}
              </p>
            )}
          </form>
        </div>
      )}
    </div>
  );
}
