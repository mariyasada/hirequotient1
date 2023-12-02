export const sortUsersData = (users, state) => {
  if (state.searchByQuery) {
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(state.searchByQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(state.searchByQuery.toLowerCase()) ||
        user.role.toLowerCase().includes(state.searchByQuery.toLowerCase())
    );
  } else return users;
};
