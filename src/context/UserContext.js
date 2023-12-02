import axios from "axios";
import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import { sortUsersData } from "../Page/UsersListPage/utils";
import { FilterReducer } from "./FilterReducer";

const UserContext = createContext();

const initialState = { searchByQuery: "" };

const UsersProvider = ({ children }) => {
  const [userList, setUserList] = useState([]);
  const [state, dispatch] = useReducer(FilterReducer, initialState);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState({
    data: [],
    isSelected: false,
    deleted: false,
  });

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get(
          "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
        );
        setIsLoading(false);
        setUserList(data);
      } catch (err) {
        console.error(err, "something wong,can't get videos");
      }
    })();
  }, []);

  const filteredData = sortUsersData(userList, state);

  return (
    <UserContext.Provider
      value={{
        userList,
        setUserList,
        filteredData,
        isLoading,
        setIsLoading,
        state,
        dispatch,
        selectedRows,
        setSelectedRows,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

const useUsers = () => useContext(UserContext);
export { useUsers, UsersProvider };
