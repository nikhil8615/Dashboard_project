import { useState, useEffect } from "react";
import axios from "axios";

const UserSubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4000/api/forms/submissions"
      );
      setSubmissions(response.data.data);
      setLoading(false);
    } catch (error) {
      setError("Error fetching submissions");
      setLoading(false);
    }
  };

  const filteredSubmissions = submissions.filter((submission) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      submission.email.toLowerCase().includes(searchLower) ||
      submission.name.toLowerCase().includes(searchLower) ||
      (submission.phone && submission.phone.toLowerCase().includes(searchLower))
    );
  });

  if (loading)
    return (
      <div className="text-center p-6 text-lg text-gray-500">Loading...</div>
    );
  if (error)
    return (
      <div className="text-center p-6 text-red-600 font-semibold">{error}</div>
    );

  return (
    <div className="w-full max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 pt-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <h2 className="text-2xl font-bold text-gray-800">📋 User</h2>
        <input
          type="text"
          placeholder="Search by name, email or phone..."
          className="w-full sm:w-80 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[800px] bg-white rounded-lg shadow">
          <thead>
            <tr className="text-gray-600 text-left border-b">
              <th className="px-2 sm:px-4 py-4">
                {/* <input type="checkbox" /> */}
              </th>
              <th className="px-2 sm:px-4 py-4">User</th>
              <th className="px-2 sm:px-4 py-4">Email</th>
              <th className="px-2 sm:px-4 py-4">Phone number</th>
              <th className="px-2 sm:px-4 py-4">Created At</th>
            </tr>
          </thead>
          <tbody>
            {filteredSubmissions.map((submission, index) => (
              <tr
                key={submission.id}
                className={`hover:bg-gray-100 border-b border-gray-200 ${
                  selectedRow === index ? "bg-indigo-50" : ""
                }`}
              >
                <td className="px-2 sm:px-4 py-6">
                  <input
                    type="checkbox"
                    checked={selectedRow === index}
                    onChange={() =>
                      setSelectedRow(selectedRow === index ? null : index)
                    }
                  />
                </td>
                <td className="px-2 sm:px-4 py-6 flex items-center gap-3">
                  <span className="font-medium text-gray-800">
                    {submission.name}
                  </span>
                </td>
                <td className="px-2 sm:px-4 py-6 font-medium">
                  {submission.email}
                </td>
                <td className="px-2 sm:px-4 py-6 text-gray-700">
                  {submission.phone || "N/A"}
                </td>
                <td className="px-2 sm:px-4 py-6 text-gray-700">
                  {new Date(submission.created_at).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserSubmissions;
