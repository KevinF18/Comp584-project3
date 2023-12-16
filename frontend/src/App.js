import React, { useState, useEffect } from "react";
import axios from "axios";

const filterOptions = ["state", "category", "name", "city"];

export default function App() {
  const [businessData, setBusinessData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [appliedFilters, setAppliedFilters] = useState([]);
  const [filterType, setFilterType] = useState("state");
  const [filterValue, setFilterValue] = useState("");
  const [maxPage, setMaxPage] = useState(0);
  const pageSize = 25;

  const handleApplyFilters = () => {
    setCurrentPage(1);
    const trimmedFilterValue = filterValue.trim();
    setAppliedFilters((prevFilters) => [
      ...prevFilters,
      { type: filterType, value: trimmedFilterValue },
    ]);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/api/data?page=${currentPage}&pageSize=${pageSize}`,
          { params: { filters: appliedFilters } }
        );

        setBusinessData(response.data.result);

        const totalResults = response.data.totalResults || 0;
        const totalPages = Math.ceil(totalResults / pageSize);
        setMaxPage(totalPages);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [currentPage, appliedFilters]);

  return (
    <div className="p-3">
      <div className="mb-3">
        <h1 className="display-6">Business Data</h1>
      </div>

      <div className="mb-3">
        <div className="d-flex">
          <div className="me-3">
            <label className="form-label">Filter Type:</label>
            <select
              className="form-select"
              onChange={(e) => setFilterType(e.target.value)}
              value={filterType}
            >
              {filterOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className="me-3">
            <label className="form-label">Filter Value:</label>
            <input
              type="text"
              className="form-control"
              onChange={(e) => setFilterValue(e.target.value)}
              value={filterValue}
            />
          </div>
        </div>

        <div className="mt-3">
          <button className="btn btn-primary" onClick={handleApplyFilters}>
            Apply Filter
          </button>
        </div>

        <div className="mt-3">
          {appliedFilters.map((filter, uniqueId) => (
            <span key={uniqueId} className="badge bg-secondary me-2">
              {filter.type === "categories"
                ? `category: ${filter.value}`
                : `${filter.type}: ${filter.value}`}
              <button
                className="btn-close btn-close-white ms-2"
                onClick={() => {
                  setAppliedFilters((prevFilters) => {
                    const updatedFilters = [...prevFilters];
                    updatedFilters.splice(uniqueId, 1);
                    return updatedFilters;
                  });
                }}
              />
            </span>
          ))}
        </div>
      </div>

      <table className="table table-striped">
        <thead>
          <tr>
            <th scope="col">business_id</th>
            <th scope="col">name</th>
            <th scope="col">address</th>
            <th scope="col">city</th>
            <th scope="col">state</th>
            <th scope="col">postal_code</th>
            <th scope="col">stars</th>
            <th scope="col">review_count</th>
            <th scope="col">is_open</th>
            <th scope="col">categories</th>
          </tr>
        </thead>
        <tbody>
          {businessData.length > 0 ? (
            businessData.map((business) => (
              <tr key={business.business_id}>
                <td>{business.business_id}</td>
                <td>{business.name}</td>
                <td>{business.address}</td>
                <td>{business.city}</td>
                <td>{business.state}</td>
                <td>{business.postal_code}</td>
                <td>{business.stars}</td>
                <td>{business.review_count}</td>
                <td>{business.is_open}</td>
                <td>{business.categories}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="10" className="text-center">
                No results found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <button
          className="btn btn-primary"
          onClick={() =>
            setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))
          }
          disabled={currentPage === 1}
        >
          Previous Page
        </button>
        <span className="h5">
          {" "}
          Page {currentPage} of {maxPage}{" "}
        </span>
        <button
          className="btn btn-primary"
          onClick={() =>
            setCurrentPage((prevPage) => Math.min(prevPage + 1, maxPage))
          }
          disabled={currentPage === maxPage}
        >
          Next Page
        </button>
      </div>
    </div>
  );
}
