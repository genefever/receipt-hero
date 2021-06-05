import React, { createContext, useEffect, useState } from "react";
import * as api from "./api";

export const UserContext = createContext();

export const UserProvider = (props) => {
  const [userObject, setUserObject] = useState();

  useEffect(() => {
    async function getAuthenticatedUserObject() {
      const res = await api.getAuthenticatedUserObject();

      if (res.data) {
        setUserObject(res.data);
      }
    }

    getAuthenticatedUserObject();
  }, []);

  return (
    <UserContext.Provider value={{ userObject, setUserObject }}>
      {props.children}
    </UserContext.Provider>
  );
};
