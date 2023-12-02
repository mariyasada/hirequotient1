import React, { useEffect } from "react";
import styles from "./User.module.scss";
import { FaEdit, FaSave, FaTrash } from "react-icons/fa";

const User = ({
  user,
  selectedRows,
  handleRowChangeHandler,
  isEditing,
  setIsEditing,
  singleUser,
  setSingleUser,
  setUserList,
  userList,
  RowCheckboxChangeHandler,
}) => {
  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setSingleUser((prevData) => ({ ...prevData, [name]: value }));
  };

  useEffect(() => {
    if (isEditing === user.id) {
      setSingleUser(user);
    }
  }, [isEditing]);

  const SaveHandler = () => {
    const updatedData = userList?.map((user) =>
      user.id === singleUser.id ? { ...user, ...singleUser } : user
    );

    setUserList(updatedData);
    setIsEditing(null);
  };

  return (
    <div
      className={
        selectedRows.includes(user?.id)
          ? `${styles.userCard} ${styles.bggray}`
          : styles.userCard
      }
      onClick={() => RowCheckboxChangeHandler(user?.id)}
    >
      <input
        type="checkbox"
        className={styles.checkbox}
        checked={selectedRows.includes(user?.id)}
      />
      <div className={styles.number}>{user?.id}</div>
      {isEditing === user.id ? (
        <input
          type="text"
          value={isEditing ? singleUser.name : user?.name}
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
          value={isEditing ? singleUser.email : user?.email}
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
          value={isEditing ? singleUser.role : user?.role}
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
          size={17}
          className={styles.edit}
          title="edit"
          onClick={() => setIsEditing(user?.id)}
        />
        <FaTrash
          size={17}
          className={styles.delete}
          title="delete"
          onClick={() => {
            setUserList((prev) => prev.filter((data) => data.id !== user.id));
          }}
        />
        <FaSave
          size={17}
          className={styles.save}
          title="save"
          onClick={SaveHandler}
        />
      </div>
    </div>
  );
};

export default User;
