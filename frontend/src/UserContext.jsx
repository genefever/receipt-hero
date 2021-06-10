import React, { createContext, useEffect, useState } from "react";
import * as api from "./api";

export const UserContext = createContext();

export const UserProvider = (props) => {
  const [userObject, setUserObject] = useState();
  const [loadingUserObject, setLoadingUserObject] = useState(true);

  useEffect(() => {
    async function getAuthenticatedUserObject() {
      const res = await api.getAuthenticatedUser();

      if (res.data) {
        setUserObject(res.data);
      }
      setLoadingUserObject(false);
    }

    getAuthenticatedUserObject();
  }, []);

  return (
    <UserContext.Provider
      value={{ userObject, setUserObject, loadingUserObject }}
    >
      {props.children}
    </UserContext.Provider>
  );
};
