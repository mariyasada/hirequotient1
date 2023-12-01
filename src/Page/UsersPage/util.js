import axios from "axios";

export const sortUsersData = (users, searchvalue) => {
  if (searchvalue !== "") {
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchvalue.toLowerCase()) ||
        user.email.toLowerCase().includes(searchvalue.toLowerCase()) ||
        user.role.toLowerCase().includes(searchvalue.toLowerCase())
    );
  } else return users;
};

export const fetchUsers = async () => {
  try {
    const { data } = await axios.get(
      "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
    );
    return data;
  } catch (err) {
    console.error(err, "something wong,can't get videos");
  }
};
