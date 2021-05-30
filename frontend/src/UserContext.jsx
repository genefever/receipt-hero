import React, { createContext, useEffect, useState } from "react";
import * as api from "./api";

export const UserContext = createContext();

export const UserProvider = (props) => {
  const [userObject, setUserObject] = useState();

  useEffect(() => {
    async function getUserObject() {
      const res = await api.getUserObject();

      if (res.data) {
        setUserObject(res.data);
      }
    }

    getUserObject();
  }, []);

  return (
    <UserContext.Provider value={userObject}>
      {props.children}
    </UserContext.Provider>
  );
};
