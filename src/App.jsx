import { useEffect, useState } from "react";

function App() {
  const [companies, setCompanies] = useState([]);
  const [search, setSearch] = useState("");

  const [locationFilter, setLocationFilter] = useState("");
  const [industryFilter, setIndustryFilter] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Fetch companies data
  useEffect(() => {
    fetch("/companies.json")
      .then((res) => res.json())
      .then((data) => setCompanies(data))
      .catch((err) => console.error("Error loading JSON:", err));
  }, []);

  // Apply search and filters
  const filteredCompanies = companies
    .filter((company) => {
      if (!company.name || !company.location || !company.industry) return false;

      const text = search.toLowerCase();
      return (
        company.name.toLowerCase().includes(text) ||
        company.location.toLowerCase().includes(text) ||
        company.industry.toLowerCase().includes(text)
      );
    })
    .filter((company) =>
      locationFilter === ""
        ? true
        : company.location.toLowerCase() === locationFilter.toLowerCase()
    )
    .filter((company) =>
      industryFilter === ""
        ? true
        : company.industry.toLowerCase() === industryFilter.toLowerCase()
    );

  // Reset page when search/filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, locationFilter, industryFilter]);

  // Pagination calculation
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = filteredCompanies.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage);

  return (
    <div className="p-6 font-sans max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Companies Directory</h1>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by name, location, industry..."
        className="border rounded px-4 py-2 w-full md:w-96 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-4">
        <select
          className="border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
        >
          <option value="">All Locations</option>
          <option value="USA">USA</option>
          <option value="India">India</option>
          <option value="UK">UK</option>
          <option value="Germany">Germany</option>
        </select>

        <select
          className="border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={industryFilter}
          onChange={(e) => setIndustryFilter(e.target.value)}
        >
          <option value="">All Industries</option>
          <option value="Technology">Technology</option>
          <option value="Finance">Finance</option>
          <option value="Healthcare">Healthcare</option>
          <option value="E-commerce">E-commerce</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 rounded shadow">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 border border-gray-300 text-left">Name</th>
              <th className="px-6 py-3 border border-gray-300 text-left">Location</th>
              <th className="px-6 py-3 border border-gray-300 text-left">Industry</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((company, index) => (
                <tr key={company.id || index} className="hover:bg-gray-50">
                  <td className="px-6 py-3 border border-gray-300">{company.name}</td>
                  <td className="px-6 py-3 border border-gray-300">{company.location}</td>
                  <td className="px-6 py-3 border border-gray-300">{company.industry}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="3"
                  className="px-6 py-3 text-center border border-gray-300 italic text-gray-500"
                >
                  No companies found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-4 mt-4">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
          className={`px-4 py-2 rounded ${
            currentPage === 1
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          Previous
        </button>

        <span>
          Page {currentPage} of {totalPages}
        </span>

        <button
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => setCurrentPage(currentPage + 1)}
          className={`px-4 py-2 rounded ${
            currentPage === totalPages || totalPages === 0
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default App;
