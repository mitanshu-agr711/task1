import React, { useState, useEffect } from "react";
import axios from "axios";
import { Menu, X ,Trash2,Pencil} from "lucide-react";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editUserId, setEditUserId] = useState(null);
  const [editedUserData, setEditedUserData] = useState({
    first_name: "",
    last_name: "",
    email: "",
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);

 
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOption, setFilterOption] = useState("all");
  const [sortOption, setSortOption] = useState("name_asc");

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");

        const allUsersData = [];
        let page = 1;
        let hasMorePages = true;

        while (hasMorePages) {
          const response = await axios.get(
            `https://reqres.in/api/users?page=${page}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          allUsersData.push(...response.data.data);
          setTotalPages(response.data.total_pages);

          if (page >= response.data.total_pages) {
            hasMorePages = false;
          } else {
            page++;
          }
        }

        setAllUsers(allUsersData);
        setError("");
      } catch (err) {
        setError("Failed to fetch users. Please try again.");
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    let filteredUsers = [...allUsers];

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filteredUsers = filteredUsers.filter(
        (user) =>
          user.first_name.toLowerCase().includes(searchLower) ||
          user.last_name.toLowerCase().includes(searchLower) ||
          user.email.toLowerCase().includes(searchLower)
      );
    }

    if (filterOption === "odd_id") {
      filteredUsers = filteredUsers.filter((user) => user.id % 2 !== 0);
    } else if (filterOption === "even_id") {
      filteredUsers = filteredUsers.filter((user) => user.id % 2 === 0);
    }

    if (sortOption === "name_asc") {
      filteredUsers.sort((a, b) => a.first_name.localeCompare(b.first_name));
    } else if (sortOption === "name_desc") {
      filteredUsers.sort((a, b) => b.first_name.localeCompare(a.first_name));
    } else if (sortOption === "id_asc") {
      filteredUsers.sort((a, b) => a.id - b.id);
    } else if (sortOption === "id_desc") {
      filteredUsers.sort((a, b) => b.id - a.id);
    }

    const itemsPerPage = 6;
    const totalFilteredPages = Math.ceil(filteredUsers.length / itemsPerPage);

    const validCurrentPage = Math.min(currentPage, totalFilteredPages || 1);
    if (validCurrentPage !== currentPage) {
      setCurrentPage(validCurrentPage);
    }

    const startIndex = (validCurrentPage - 1) * itemsPerPage;
    const paginatedUsers = filteredUsers.slice(
      startIndex,
      startIndex + itemsPerPage
    );

    setUsers(paginatedUsers);
    setTotalPages(totalFilteredPages || 1);
  }, [allUsers, searchTerm, filterOption, sortOption, currentPage]);

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleDeleteConfirmation = (userId) => {
    setDeleteConfirmation(userId);
  };

  const handleDelete = async () => {
    if (!deleteConfirmation) return;

    try {
      await axios.delete(`https://reqres.in/api/users/${deleteConfirmation}`);

      setAllUsers(allUsers.filter((user) => user.id !== deleteConfirmation));
      setDeleteConfirmation(null);
    } catch (err) {
      console.error("Error deleting user:", err);
      alert("Failed to delete user. Please try again.");
    }
  };

  const handleEditClick = (user) => {
    setEditUserId(user.id);
    setEditedUserData({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
    });
    setIsEditModalOpen(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedUserData({ ...editedUserData, [name]: value });
  };

  const handleEditSubmit = async () => {
    try {
      await axios.put(
        `https://reqres.in/api/users/${editUserId}`,
        editedUserData
      );

      setAllUsers(
        allUsers.map((user) =>
          user.id === editUserId ? { ...user, ...editedUserData } : user
        )
      );

      setIsEditModalOpen(false);
      setEditUserId(null);
    } catch (err) {
      console.error("Error updating user:", err);
      alert("Failed to update user. Please try again.");
    }
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditUserId(null);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterChange = (e) => {
    setFilterOption(e.target.value);
    setCurrentPage(1);
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilterOption("all");
    setSortOption("name_asc");
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500 text-center">
          <p className="text-xl font-semibold">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
 

  return (
    <div
      className="transition-colors duration-300 
    bg-gradient-to-b from-[#0F123B] to-black 
    dark:from-slate-800 dark:to-slate-900 flex flex-col items-center min-h-screen relative"
    >
    
      <div className="w-full bg-white/10 backdrop-blur-sm fixed top-0 left-0 z-20">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-bold text-white">User List</h1>

         
          <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
  {isMenuOpen ? (
    <X className="w-6 h-6 text-red-500" />
  ) : (
    <Menu className="w-6 h-6 text-black md:hidden" />
  )}
</button>

          
          <div className="hidden md:flex items-center gap-4">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search users..."
              className="px-3 py-1 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 w-48"
            />

            <select
              value={filterOption}
              onChange={handleFilterChange}
              className="px-3 py-1 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Users</option>
              <option value="odd_id">Odd ID</option>
              <option value="even_id">Even ID</option>
            </select>

            <select
              value={sortOption}
              onChange={handleSortChange}
              className="px-3 py-1 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="name_asc">Name (A-Z)</option>
              <option value="name_desc">Name (Z-A)</option>
              <option value="id_asc">ID (Ascending)</option>
              <option value="id_desc">ID (Descending)</option>
            </select>

            <button
              onClick={clearFilters}
              className="px-3 py-1 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
            >
              Clear
            </button>
          </div>
        </div>

       
        <div
          className={`md:hidden bg-slate-500 overflow-hidden transition-all duration-300 ${
            isMenuOpen ? "max-h-96 py-4" : "max-h-0"
          }`}
        >
          <div className="px-4 space-y-4">
            <div>
              <label
                htmlFor="mobile-search"
                className="block text-sky-400 text-sm font-medium mb-2"
              >
                Search Users
              </label>
              <input
                id="mobile-search"
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search by name or email..."
                className="w-full px-4 text-white py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="mobile-filter"
                className="block text-sky-400 text-sm font-medium mb-2"
              >
                Filter
              </label>
              <select
                id="mobile-filter"
                value={filterOption}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Users</option>
                <option value="odd_id">Odd ID</option>
                <option value="even_id">Even ID</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="mobile-sort"
                className="block   text-sky-400 text-sm font-medium mb-2"
              >
                Sort By
              </label>
              <select
                id="mobile-sort"
                value={sortOption}
                onChange={handleSortChange}
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500  text-white"
              >
                <option value="name_asc">Name (A-Z)</option>
                <option value="name_desc">Name (Z-A)</option>
                <option value="id_asc">ID (Ascending)</option>
                <option value="id_desc">ID (Descending)</option>
              </select>
            </div>

            <div className="flex justify-end">
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      </div>

     
      <div className="w-full max-w-6xl pt-20 px-4 flex flex-col items-center">
        
        <div className="w-full mb-6">
          <p className="text-white">
            
            {searchTerm && ` matching "${searchTerm}"`}
          </p>
        </div>

       
        {users.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {users.map((user) => (
              <div
                key={user.id}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div className="p-4 flex items-center space-x-4">
                  <img
                    src={user.avatar}
                    alt={`${user.first_name}'s avatar`}
                    className="h-16 w-16 rounded-full object-cover"
                  />
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">
                      {user.first_name} {user.last_name}
                    </h2>
                    <p className="text-gray-600">{user.email}</p>
                    <p className="text-gray-500 text-sm">ID: {user.id}</p>
                    <div className="mt-2">
                      <button
                        onClick={() => handleEditClick(user)}
                        className="text-blue-500 hover:underline"
                      >
                          <Pencil className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteConfirmation(user.id)}
                        className="text-red-500 hover:underline ml-2"
                      >
                         <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white/10 rounded-lg p-8 text-center w-full">
            <p className="text-white text-lg">
              No users found matching your criteria.
            </p>
            <button
              onClick={clearFilters}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Clear Filters
            </button>
          </div>
        )}

       
        {users.length > 0 && (
          <div className="mt-8 mb-8 flex justify-center">
            <nav aria-label="Page navigation">
              <ul className="inline-flex -space-x-px text-base h-10">
                <li>
                  <button
                    onClick={handlePrevious}
                    disabled={currentPage === 1}
                    className={`flex items-center justify-center px-4 h-10 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 ${
                      currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    Previous
                  </button>
                </li>

                {[...Array(totalPages)].map((_, index) => (
                  <li key={index}>
                    <button
                      onClick={() => setCurrentPage(index + 1)}
                      aria-current={
                        currentPage === index + 1 ? "page" : undefined
                      }
                      className={`flex items-center justify-center px-4 h-10 leading-tight border border-gray-300 ${
                        currentPage === index + 1
                          ? "text-blue-600 bg-blue-50 hover:bg-blue-100 hover:text-blue-700"
                          : "text-gray-500 bg-white hover:bg-gray-100 hover:text-gray-700"
                      }`}
                    >
                      {index + 1}
                    </button>
                  </li>
                ))}

                <li>
                  <button
                    onClick={handleNext}
                    disabled={currentPage === totalPages}
                    className={`flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 ${
                      currentPage === totalPages
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </div>

      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Edit User</h2>

            <div className="space-y-4">
              <div>
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="first_name"
                >
                  First Name
                </label>
                <input
                  id="first_name"
                  type="text"
                  name="first_name"
                  value={editedUserData.first_name}
                  onChange={handleEditChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>

              <div>
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="last_name"
                >
                  Last Name
                </label>
                <input
                  id="last_name"
                  type="text"
                  name="last_name"
                  value={editedUserData.last_name}
                  onChange={handleEditChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>

              <div>
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={editedUserData.email}
                  onChange={handleEditChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={closeEditModal}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSubmit}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              Confirm Delete
            </h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this user? This action cannot be
              undone.
            </p>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteConfirmation(null)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              >
                  <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;
