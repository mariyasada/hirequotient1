import React, { useEffect, useState } from "react";
import styles from "./UsersPage.module.scss";
import { FaBackward, FaForward, FaTrash } from "react-icons/fa";
import { TABLE_HEADERS } from "./constants";
import User from "../../compoenents/Users/User";
import { fetchUsers, sortUsersData } from "./util";
import axios from "axios";
import { Loader } from "../../compoenents/Loader/Loader";

const UsersPage = () => {
  const [loading, setLoading] = useState(false);
  const [usersData, setUsersData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const usersPerPage = 10;
  const [searchValue, setSearchValue] = useState("");
  const [originalData, setOriginalData] = useState([]);
  const [selectedRows, setSelectedRows] = useState({
    data: [],
    isSelected: false,
  });
  const [isEditing, setIsEditing] = useState(null);
  const [userDetail, setUserDetail] = useState({
    name: "",
    role: "",
    email: "",
  });

  useEffect(() => {
    setLoading(true);
    (async () => {
      try {
        const { data } = await axios.get(
          "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
        );
        setLoading(false);
        setUsersData(data || []);
        setOriginalData(data);
      } catch (err) {
        console.error(err, "something wong,can't get videos");
      }
    })();
  }, []);

  //   pagination
  useEffect(() => {
    if (usersData.length > 0) {
      setTotalPages(Math.ceil(usersData.length / usersPerPage));
    }
  }, [usersData]);

  const endIndex = usersPerPage * currentPage;
  const startIndex = endIndex - usersPerPage;
  const paginatedUsers =
    usersData?.length > 0 && usersData?.slice(startIndex, endIndex);

  useEffect(() => {
    if (!searchValue) setSearchValue("");
  }, [searchValue]);

  useEffect(() => {
    if (searchValue === "") return setUsersData(originalData);
    const handleKeyPress = (e) => {
      if (e.key === "Enter") {
        const filteredData = sortUsersData(usersData, searchValue);
        sortUsersData(usersData, searchValue);
        setUsersData(filteredData);
        setCurrentPage(1);
      }
    };

    window.addEventListener("keypress", handleKeyPress);

    return () => {
      window.removeEventListener("keypress", handleKeyPress);
    };
  }, [searchValue, usersData]);

  const selectAllRowsHandler = (e) => {
    const allRowsOnPage = usersData.slice(
      (currentPage - 1) * usersPerPage,
      currentPage * usersPerPage
    );
    const isSelected = selectedRows.data.length === allRowsOnPage.length;

    if (isSelected) {
      setSelectedRows((prev) => ({ ...prev, isSelected: false, data: [] }));
    } else {
      setSelectedRows((prev) => ({
        ...prev,
        isSelected: true,
        data: allRowsOnPage.map((userRow) => userRow.id),
      }));
    }
  };
  useEffect(() => {
    setSelectedRows((prev) => ({ ...prev, isSelected: false }));
  }, [currentPage]);

  const handleRowCheckboxChange = (rowId) => {
    setSelectedRows((prev) => ({
      ...prev,
      data: prev.data.includes(rowId)
        ? prev.data.filter((id) => id !== rowId)
        : [...prev.data, rowId],
    }));
  };

  const multipleRowDeleteHandler = (selectedRows) => {
    const newUpdateData = usersData?.filter(
      (user) => !selectedRows.data.includes(user?.id)
    );
    // if search value is empty string then original data used
    // Update original data
    setOriginalData(newUpdateData);

    // Update usersData based on searchValue
    setUsersData((prev) => {
      const filteredData =
        searchValue.trim() === ""
          ? newUpdateData
          : sortUsersData(newUpdateData, searchValue);
      return filteredData;
    });

    setCurrentPage(1);
  };

  return (
    <div className={styles.container}>
      <div className={styles.searchbarcontainer}>
        <input
          type="text"
          className={styles.searchbar}
          placeholder="Search"
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <div
          className={styles.iconcontainer}
          onClick={() => multipleRowDeleteHandler(selectedRows)}
        >
          <FaTrash />
        </div>
      </div>

      <div className={styles.table}>
        <div className={`${styles.header} `}>
          <div className={styles.checkboxdiv}>
            <input
              type="checkbox"
              checked={selectedRows.isSelected}
              onChange={(e) => selectAllRowsHandler(e)}
              style={{ cursor: "pointer" }}
            />
          </div>

          {TABLE_HEADERS?.map((header) => (
            <div key={header.label} className={`${styles[header.value]} `}>
              {header.label}
            </div>
          ))}
        </div>
        <div className={styles.body}>
          {loading ? (
            <p>Loading..... It's take some time... Please wait...</p>
          ) : (
            paginatedUsers?.length > 0 &&
            paginatedUsers?.map((user, index) => {
              return (
                <User
                  user={user}
                  userNo={index + 1}
                  totalUsers={usersData?.length}
                  key={user.id}
                  selectedRows={selectedRows.data}
                  handleRowChangeHandler={handleRowCheckboxChange}
                  setOriginalData={setOriginalData}
                  setUsersData={setUsersData}
                  originalData={originalData}
                  isEditing={isEditing}
                  setIsEditing={setIsEditing}
                  setUserDetail={setUserDetail}
                  userDetail={userDetail}
                  usersData={usersData}
                />
              );
            })
          )}
        </div>
      </div>

      <div className={styles.pagination}>
        <div
          className={styles.selectedRowInfo}
        >{`${selectedRows.data?.length} of 46 row(s) selected`}</div>
        <div className={styles.paginationNumbers}>
          <div className={styles.pageNumberDetail}>
            <span>{`Page ${currentPage} of ${totalPages} `}</span>
          </div>
          {totalPages > 1 ? (
            <div>
              <button
                className={`${styles.btnPaginate} `}
                style={{
                  cursor: currentPage === 1 ? "not-allowed" : "pointer",
                }}
                onClick={() =>
                  currentPage !== 1 &&
                  setCurrentPage((currentPage) => currentPage - 1)
                }
              >
                <FaBackward />
              </button>
              {[...Array(totalPages)].map((page, index) => (
                <button
                  key={index}
                  className={`${styles.btnPaginate} ${
                    currentPage === index + 1 && styles.secondaryBtn
                  }`}
                  onClick={() => {
                    setCurrentPage(index + 1);
                  }}
                >
                  {index + 1}
                </button>
              ))}
              <button
                className={`${styles.btnPaginate} `}
                style={{
                  cursor:
                    currentPage === totalPages ? "not-allowed" : "pointer",
                }}
                onClick={() =>
                  currentPage !== totalPages && setCurrentPage(currentPage + 1)
                }
              >
                <FaForward />
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default UsersPage;
