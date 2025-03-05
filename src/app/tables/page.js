"use client";
import { useEffect, useState } from "react";
import Table from "@/components/Table";
import { toast } from "react-hot-toast";
import axios from "axios";
import { socialPlatforms } from "@/utils/utils";

const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL;

export default function Tables() {
  const [users, setUsers] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editingPlatformId, setEditingPlatformId] = useState(null);

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
  });

  const [newPlatformData, setNewPlatformData] = useState({
    platform: "",
    followers: "",
    engagement: "",
    postsCount: "",
    userId: null,
  });

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${FRONTEND_URL}/api/user`);
      setUsers(res.data);
    } catch (error) {
      toast.error("Failed to fetch users.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUserChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handlePlatformChange = (e) => {
    const { name, value } = e.target;

    const integerFields = ["followers", "postsCount"];

    const decimalFields = ["engagement"];

    let formattedValue = value;

    if (integerFields.includes(name)) {
      formattedValue = parseInt(value, 10) || 0;
    } else if (decimalFields.includes(name)) {
      formattedValue = parseFloat(value.replace(",", ".")) || 0;
    }

    setNewPlatformData({
      ...newPlatformData,
      [name]: formattedValue,
    });
  };

  // button of user form
  const handleSubmitUser = async (e) => {
    e.preventDefault();

    try {
      const url = editingUserId ? `${FRONTEND_URL}/api/user/${editingUserId}` : `${FRONTEND_URL}/api/user`;
      const method = editingUserId ? "PUT" : "POST";

      await axios({ method, url, data: newUser });

      toast.success(
        editingUserId ? "User updated successfully!" : "New user added!"
      );
      fetchUsers();
    } catch (error) {
      toast.error("Failed to save user.");
    } finally {
      setEditingUserId(null);
      setNewUser({ name: "", email: "" });
      setEditingPlatformId(null);
      setNewPlatformData({
        platform: "",
        followers: "",
        engagement: "",
        postsCount: "",
        userId: null,
      });
    }
  };

  // button of platform form
  const handleSubmitPlatform = async (e) => {
    e.preventDefault();

    // here I validate if the user already has the new platform
    if (!editingPlatformId) {
      const user = users.find((u) => u.id === newPlatformData.userId);
      if (
        user &&
        user.socialData.some((p) => p.platform === newPlatformData.platform)
      ) {
        toast.error("User already has this platform assigned!");
        return;
      }
    }

    try {
      const url = editingPlatformId
        ? `${FRONTEND_URL}/api/socialData/${editingPlatformId}`
        : `${FRONTEND_URL}/api/socialData`;
      const method = editingPlatformId ? "PUT" : "POST";

      await axios({ method, url, data: newPlatformData });

      toast.success(
        editingPlatformId
          ? "Platform updated successfully!"
          : "New platform added!"
      );
      fetchUsers();
    } catch (error) {
      toast.error("Failed to save platform.");
    } finally {
      setEditingPlatformId(null);
      setNewPlatformData({
        platform: "",
        followers: "",
        engagement: "",
        postsCount: "",
        userId: null,
      });
      setEditingUserId(null);
      setNewUser({ name: "", email: "" });
    }
  };

  // this handles data of both forms to edit
  const handleEdit = (userId, platformId) => {
    const user = users.find((u) => u.id === userId);
    if (!user) return;

    if (platformId) {
      const platform = user.socialData.find((p) => p.id === platformId);
      setNewPlatformData({
        platform: platform.platform,
        followers: platform.followers,
        engagement: platform.engagement,
        postsCount: platform.postsCount,
        userId: userId,
      });
      setEditingPlatformId(platformId);
    }
    if (userId) {
      setNewUser({ name: user.name, email: user.email });
      setEditingUserId(userId);
    }
  };

  // this handles if the user has multiple platforms, only the selected platform is deleted.
  // if it's the last platform, the user can choose to delete both or keep the user for adding new platforms.
  const handleDelete = async (userId, platformId) => {
    const user = users.find((u) => u.id === userId);
    if (!user) return;

    const remainingPlatforms = user.socialData.filter(
      (p) => p.id !== platformId
    );
    toast.custom(
      (t) => (
        <div
          className={`fixed h-screen w-screen flex items-center justify-center bg-gray-900/75 z-50 mt-[-15px] ${
            t.visible ? "opacity-100" : "opacity-0"
          } transition-opacity`}
        >
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <p className="text-lg font-semibold">
              {remainingPlatforms.length === 0
                ? "This is the only platform for this user. Do you want to delete the user as well?"
                : "Are you sure you want to delete this platform?"}
            </p>
            <div className="flex justify-center gap-4 mt-4">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={async () => {
                  try {
                    await axios.delete(`${FRONTEND_URL}/api/socialData/${platformId}`);
                    toast.success("Platform deleted!");
                    fetchUsers();
                    toast.dismiss(t.id);
                  } catch (error) {
                    console.error("Error deleting platform:", error);
                    toast.error("Failed to delete platform.");
                  }
                }}
              >
                Delete Platform
              </button>

              {remainingPlatforms.length === 0 && (
                <button
                  className="bg-gray-700 text-white px-4 py-2 rounded"
                  onClick={async () => {
                    try {
                      await axios.delete(`${FRONTEND_URL}/api/user/${userId}`);
                      toast.success("User and platform deleted!");
                      fetchUsers();
                      toast.dismiss(t.id);
                    } catch (error) {
                      console.error("Error deleting user:", error);
                      toast.error("Failed to delete user.");
                    }
                  }}
                >
                  Delete User & Platform
                </button>
              )}

              <button
                className="bg-gray-400 text-white px-4 py-2 rounded"
                onClick={() => toast.dismiss(t.id)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ),
      { duration: Infinity }
    );
  };

  return (
    <div className="space-y-8 p-4 sm:p-6 bg-slate-50 min-h-screen">
      <h1 className="text-3xl font-bold">User Management</h1>

      {/* users form */}
      <div className="bg-white p-6 rounded-lg shadow-xl text-gray-800 mx-auto w-full">
        <h2 className="text-xl font-semibold">
          {editingUserId ? "Edit User" : "Add New User"}
        </h2>
        <form
          onSubmit={(e) => e.preventDefault()}
          className="grid grid-cols-1 gap-4 mt-4"
        >
          <input
            type="text"
            name="name"
            value={newUser.name}
            onChange={handleUserChange}
            placeholder="User Name"
            className="border p-2 rounded w-full"
            required
          />
          <input
            type="email"
            name="email"
            value={newUser.email}
            onChange={handleUserChange}
            placeholder="Email"
            className="border p-2 rounded w-full"
            required
          />
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-700 w-full"
          >
            {editingUserId ? "Update User" : "Add User"}
          </button>
        </form>
      </div>

      {/* platform form */}
      <div className="bg-white p-6 rounded-lg shadow-xl text-gray-800 mx-auto w-full">
        <h2 className="text-xl font-semibold">
          {editingPlatformId
            ? "Edit Platform from User"
            : "Add New Platform to User"}
        </h2>
        <form
          onSubmit={(e) => e.preventDefault()}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4"
        >
          <select
            name="userId"
            value={newPlatformData.userId || ""}
            onChange={handlePlatformChange}
            className="border p-2 rounded w-full"
            required
          >
            <option value="">Select User</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
          <select
            name="platform"
            value={newPlatformData.platform}
            onChange={handlePlatformChange}
            className="border p-2 rounded w-full"
            required
          >
            <option value="">Select Platform</option>
            {socialPlatforms.map((platform, index) => (
              <option key={index} value={platform}>
                {platform}
              </option>
            ))}
          </select>
          <input
            type="number"
            name="followers"
            value={newPlatformData.followers}
            onChange={handlePlatformChange}
            placeholder="Followers"
            className="border p-2 rounded w-full"
            required
          />
          <input
            type="number"
            step="0.1"
            name="engagement"
            value={newPlatformData.engagement}
            onChange={handlePlatformChange}
            placeholder="Engagement (%)"
            className="border p-2 rounded w-full"
            required
          />
          <input
            type="number"
            name="postsCount"
            value={newPlatformData.postsCount}
            onChange={handlePlatformChange}
            placeholder="Posts Count"
            className="border p-2 rounded w-full"
            required
          />
          <button
            type="submit"
            className="bg-green-500 text-white p-2 rounded-md hover:bg-green-700 w-full sm:w-auto col-span-1 sm:col-span-2 md:col-span-4"
          >
            {editingPlatformId ? "Update Platform" : "Add Platform"}
          </button>
        </form>
      </div>

      {/* table */}
      <div className="mx-auto w-full overflow-x-auto">
        <Table data={users} />
      </div>
    </div>
  );
}
