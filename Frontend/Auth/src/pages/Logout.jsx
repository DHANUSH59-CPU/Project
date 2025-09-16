import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { logoutUser } from "../store/authSlice";

const Logout = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(logoutUser());
  }, []);
  return <div>Logout</div>;
};

export default Logout;
