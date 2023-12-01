import React, { useEffect } from "react";
import styles from "./User.module.scss";
import { FaEdit, FaSave, FaTrash } from "react-icons/fa";

const User = ({
  user,
  selectedRows,
  handleRowChangeHandler,
  setOriginalData,
  setUsersData,
  isEditing,
  setIsEditing,
  setUserDetail,
  userDetail,
  originalData,
  usersData,
}) => {
  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setUserDetail((prevData) => ({ ...prevData, [name]: value }));
  };

  useEffect(() => {
    if (isEditing === user.id) {
      setUserDetail(user);
    }
  }, [isEditing]);

  const SaveHandler = () => {
    const updatedData = usersData?.map((user) =>
      user.id === userDetail.id ? { ...user, ...userDetail } : user
    );

    setUsersData(updatedData);
    setOriginalData(updatedData);
    setIsEditing(null);
  };

  return (
    <div
      className={
        selectedRows.includes(user?.id)
          ? `${styles.userCard} ${styles.bggray}`
          : styles.userCard
      }
    >
      <input
        type="checkbox"
        checked={selectedRows.includes(user?.id)}
        onChange={() => handleRowChangeHandler(user?.id)}
      />
      <div className={styles.id}>{user?.id}</div>
      {isEditing === user.id ? (
        <input
          type="text"
          className={styles.name}
          value={isEditing ? userDetail.name : user?.name}
          name="name"
          onChange={(e) => onChangeHandler(e)}
        />
      ) : (
        <div className={styles.name}>{user?.name}</div>
      )}

      {isEditing === user.id ? (
        <input
          type="text"
          className={styles.email}
          value={isEditing ? userDetail.email : user?.email}
          name="email"
          onChange={(e) => onChangeHandler(e)}
        />
      ) : (
        <div className={styles.email}>{user?.email}</div>
      )}

      {isEditing === user.id ? (
        <input
          type="text"
          className={styles.role}
          value={isEditing ? userDetail.role : user?.role}
          name="role"
          onChange={(e) => onChangeHandler(e)}
        />
      ) : (
        <div className={styles.role}>
          <p>{user?.role}</p>
        </div>
      )}
      <div className={styles.actions}>
        <FaEdit
          className={styles.edit}
          title="edit"
          onClick={() => setIsEditing(user?.id)}
        />
        <FaTrash
          className={styles.delete}
          title="delete"
          onClick={() => {
            setOriginalData((prev) =>
              prev.filter((data) => data.id !== user.id)
            );
            setUsersData((prev) => prev.filter((data) => data.id !== user.id));
          }}
        />
        <FaSave className={styles.save} title="save" onClick={SaveHandler} />
      </div>
    </div>
  );
};

export default User;
