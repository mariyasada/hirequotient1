import React, { useEffect, useState } from "react";
import styles from "./UsersListPage.module.scss";
import { FaBackward, FaForward, FaTrash } from "react-icons/fa";
import { TABLE_HEADERS } from "./constants";
import User from "../../compoenents/Users/User";
import { useUsers } from "../../context/UserContext";

const UsersListPage = () => {
  const {
    userList,
    setUserList,
    isLoading,
    setIsLoading,
    filteredData,
    state,
    selectedRows,
    setSelectedRows,
    dispatch,
  } = useUsers();

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isEditing, setIsEditing] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const usersPerPage = 10;
  const [singleUserDetail, setSingleUserDetail] = useState({});

  //   pagination logic
  useEffect(() => {
    if (filteredData.length > 0) {
      setTotalPages(Math.ceil(filteredData.length / usersPerPage));
    }
  }, [filteredData]);

  const endIndex = usersPerPage * currentPage;
  const startIndex = endIndex - usersPerPage;
  const paginatedUsers =
    filteredData?.length > 0 && filteredData?.slice(startIndex, endIndex);

  //Search Data Logic
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === "Enter" || e.key === "Backspace") {
        dispatch({ type: "SEARCH_QUERY", payload: searchValue });
      }
    };
    window.addEventListener("keypress", handleKeyPress);
    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keypress", handleKeyPress);
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [searchValue]);

  // select and disselect multiple rows
  const selectAllRowsHandler = (e) => {
    const allRowsOnPage = filteredData.slice(
      (currentPage - 1) * usersPerPage,
      currentPage * usersPerPage
    );
    const isSelected = selectedRows.data.length === allRowsOnPage.length;

    if (isSelected) {
      setSelectedRows((prev) => ({ ...prev, isSelected: false, data: [] }));
    } else {
      // we store all the ids of current page
      setSelectedRows((prev) => ({
        ...prev,
        isSelected: true,
        data: allRowsOnPage.map((userRow) => userRow.id),
      }));
    }
  };

  //when we change the page it unchecked the header's checkbox
  useEffect(() => {
    if (selectedRows.isSelected) {
      const allRows = filteredData.slice(
        (currentPage - 1) * usersPerPage,
        currentPage * usersPerPage
      );
      setSelectedRows((prev) => ({
        ...prev,
        data: allRows.map((user) => user.id),
      }));
    }
  }, [currentPage]);

  const multipleRowDeleteHandler = (selectedRows) => {
    const newUpdateData = filteredData?.filter(
      (user) => !selectedRows.data.includes(user?.id)
    );
    setUserList(newUpdateData);
    setSelectedRows((prev) => ({ ...prev, isSelected: false, data: [] }));
  };

  const handleRowCheckboxChange = (rowId) => {
    setSelectedRows((prev) => ({
      ...prev,
      data: prev.data.includes(rowId)
        ? prev.data.filter((id) => id !== rowId)
        : [...prev.data, rowId],
    }));
  };

  return (
    <div className={styles.container}>
      <h3>UserList Page</h3>
      <div className={styles.searchbarcontainer}>
        <div className={styles.searchWithClear}>
          <input
            type="text"
            className={styles.searchIcon}
            placeholder="Search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <div
            onClick={() => {
              setSearchValue("");
              dispatch({ type: "CLEAR_SEARCH", payload: "" });
            }}
          >
            Clear
          </div>
        </div>
        <div
          className={styles.deleteRows}
          onClick={() => multipleRowDeleteHandler(selectedRows)}
        >
          Delete Selected
        </div>
      </div>

      <div className={styles.table}>
        <div className={`${styles.header} `}>
          <div className={styles.checkboxdiv}>
            <input
              type="checkbox"
              checked={selectedRows.isSelected}
              onChange={(e) => selectAllRowsHandler(e)}
            />
          </div>

          {TABLE_HEADERS?.map((header) => (
            <div key={header.label} className={`${styles[header.value]} `}>
              {header.label}
            </div>
          ))}
        </div>
        <div className={styles.body}>
          {isLoading ? (
            <p>Loading..... It's take some time... Please wait...</p>
          ) : (
            paginatedUsers?.length > 0 &&
            paginatedUsers?.map((user, index) => {
              return (
                <User
                  user={user}
                  userNo={index + 1}
                  key={user.id}
                  selectedRows={selectedRows.data}
                  setUserList={setUserList}
                  userList={userList}
                  RowCheckboxChangeHandler={handleRowCheckboxChange}
                  isEditing={isEditing}
                  setIsEditing={setIsEditing}
                  singleUser={singleUserDetail}
                  setSingleUser={setSingleUserDetail}
                />
              );
            })
          )}
        </div>
      </div>

      <div className={styles.pagination}>
        <div
          className={styles.selectedRowInfo}
          onClick={() => multipleRowDeleteHandler(selectedRows)}
        >
          {`${selectedRows.data?.length} of ${userList?.length} row(s) selected`}
        </div>
        <div className={styles.paginationNumbers}>
          <div className={styles.pageNumberDetail}>
            <span>{`Page ${currentPage} of ${totalPages} `}</span>
          </div>
          {totalPages > 1 ? (
            <div>
              <button
                className={`${styles.btnPaginate} ${styles.previosPage} `}
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
                className={`${styles.btnPaginate} ${styles.nextpage} `}
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

export default UsersListPage;
