import React, { useState, useEffect } from "react";
import Modal from "../modal/Modal";
import './users-grid.css';
import { useDispatch, useSelector } from 'react-redux';
import { fetchData } from '../redux/dataSlice';
import { RootState, AppDispatch } from '../redux/store';

// Define User type
interface User {
  id: number;
  firstName: string;
  lastName: string;
  contactNo: string;
  address: string;
  avatar: string;
  jobTitle: string;
  age: number;
  dateJoined: string;
  bio: string;
}

const UsersGrid: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, error } = useSelector((state: RootState) => state.data);

  const [rowData, setRowData] = useState<User[]>([]);
  const [companyInfo, setCompanyInfo] = useState<any>({});
  const [quickFilterText, setQuickFilterText] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedRow, setSelectedRow] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: string } | null>(null);

  const rowsPerPage = 10;

  // Fetch data and set state for rowData and companyInfo
  useEffect(() => {
    dispatch(fetchData());
  }, [dispatch]);

  useEffect(() => {
    if (data.employees && data.companyInfo) {
      setRowData(data.employees);
      setCompanyInfo(data.companyInfo);
    }
  }, [data]);

  // Filter Data
  const filteredData = rowData.filter((row) =>
    [row.firstName, row.lastName, row.contactNo, row.address].join(" ")
      .toLowerCase()
      .includes(quickFilterText.toLowerCase())
  );

  // Sort Data
  const sortedData = [...filteredData];
  if (sortConfig !== null) {
    sortedData.sort((a, b) => {
      const key = sortConfig.key;
      const direction = sortConfig.direction === "asc" ? 1 : -1;
      if (key in a && key in b) {
        if (key === "contactNo") {
          return (Number(a[key]) - Number(b[key])) * direction;
        }
        return a[key].localeCompare(b[key]) * direction;
      }
      return 0;
    });
  }

  const pageCount = Math.ceil(sortedData.length / rowsPerPage);
  const paginatedData = sortedData.slice(
    currentPage * rowsPerPage,
    (currentPage + 1) * rowsPerPage
  );

  const handleSearch = () => {
    setCurrentPage(0);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuickFilterText(event.target.value);
  };

  const handleRowClick = (row: User) => {
    setSelectedRow(row);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRow(null);
  };

  const handlePageClick = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleSort = (key: string) => {
    let direction = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
    setCurrentPage(0); // Reset to the first page on sorting
  };

  const getSortIndicator = (key: string) => {
    if (!sortConfig || sortConfig.key !== key) {
      return null;
    }
    return sortConfig.direction === "asc" ? "▲" : "▼";
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < pageCount - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div>
{loading && <p>Loading...</p>}
{error && (
  <h3
    style={{
      color: 'red',
      display: 'flex',
      justifyContent: 'space-around',
      paddingTop: '50px', // Corrected property and value
    }}
  >
    Error: Loading Grid Data
  </h3>
)}
	  
	{!loading && !error && (<div className="users-grid-container">
      <div className="company-info">
        <h1 className="company-name">{companyInfo.companyName}</h1>
        <div className="company-details">
          <p className="company-motto">{companyInfo.companyMotto}</p>
          <p className="company-establishment">
            Since {new Date(companyInfo.companyEst).getFullYear()}
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search..."
          onChange={handleInputChange}
          value={quickFilterText}
          className="search-input"
        />
        <button onClick={handleSearch} className="search-button">
          Search
        </button>
      </div>

      {/* Table */}
     <table className="user-table">
  <thead>
    <tr>
      <th className="table-header">ID</th>
      <th className="table-header sortable" onClick={() => handleSort("firstName")}>
        Name {getSortIndicator("firstName")}
      </th>
      <th className="table-header sortable" onClick={() => handleSort("contactNo")}>
        Contact No {getSortIndicator("contactNo")}
      </th>
      <th className="table-header sortable" onClick={() => handleSort("address")}>
        Address {getSortIndicator("address")}
      </th>
    </tr>
  </thead>
  <tbody>
    {paginatedData.length > 0 ? (
      paginatedData.map((row) => (
        <tr
          key={row.id}
          onClick={() => handleRowClick(row)}
          className={`table-row ${selectedRow?.id === row.id ? "selected" : ""}`}
        >
          <td className="table-cell">{row.id}</td>
          <td style={{ padding: "8px", textAlign: "left" }}>
            <img src={row.avatar} alt="Profile" className="avatar" />
            {row.firstName}
          </td>
          <td className="table-cell">{row.contactNo}</td>
          <td className="table-cell">{row.address}</td>
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan={4} className="no-data">
          No data found
        </td>
      </tr>
    )}
  </tbody>
</table>


      {/* Pagination */}
      <div className="pagination">
        <button onClick={handlePrevPage} disabled={currentPage === 0} className="pagination-button">
          Prev
        </button>
        {Array.from({ length: pageCount }, (_, index) => (
          <button
            key={index}
            onClick={() => handlePageClick(index)}
            className={`pagination-button ${currentPage === index ? "active" : ""}`}
          >
            {index + 1}
          </button>
        ))}
        <button onClick={handleNextPage} disabled={currentPage === pageCount - 1} className="pagination-button">
          Next
        </button>
      </div>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal} className="modal-container">
        {selectedRow ? (
          <div className="modal-content">
            <div className="modal-image">
              <img
                src={selectedRow.avatar}
                alt="Employer Name"
                className="modal-avatar"
              />
              <div className="modal-details">
                <span>{selectedRow.jobTitle}</span>
                <span>{selectedRow.age}</span>
                <span>{new Date(selectedRow.dateJoined).toISOString().split("T")[0]}</span>
              </div>
            </div>
            <div className="modal-info">
              <p className="modal-name">
                <b>
                  {selectedRow.firstName} {selectedRow.lastName}
                </b>
              </p>
              <hr />
              <p className="modal-bio">{selectedRow.bio}</p>
            </div>
          </div>
        ) : (
          <p>No data available for this row.</p>
        )}
      </Modal>
    </div>)}  
</div>	  
	  
  );
};

export default UsersGrid;
