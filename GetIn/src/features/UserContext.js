import React, {createContext, useState} from 'react';


export const UsersContext = createContext();

export const UsersProvider = props => {
  const [user, setUser] = useState("profile1");
  const [userList, setUserList] = useState([
    {
        id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
        title: 'profile1',
      },
      {
        id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
        title: 'profile2',
      },
      {
        id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f62',
        title: 'profile3',
      },
  ])
  return (
    <UsersContext.Provider
      value={{
        user,
        setUser,
        userList,
        setUserList
      }}>
      {props.children}
    </UsersContext.Provider>
  );
};
