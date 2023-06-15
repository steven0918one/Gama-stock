import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "../layout";
import { SplashScreen } from "../components";
import { appRoutes } from "./app-routes";
import { useSelector, useDispatch } from "react-redux";
import { SignIn, SetPassword, QrViewer } from "../pages";
import API from "../axios";
import { langSetter, logout, storeUser, Translation } from "../store/reducer";
import axios from "axios";

export default function Router() {
  const [isLoading, setIsLoading] = useState(true);
  const { isLogged, user } = useSelector((state) => state.storeReducer);
  const _token = localStorage.getItem("@ACCESS_TOKEN");
  const _lan = localStorage.getItem("language");
  const dispatch = useDispatch();

  useEffect(() => {
    if (!!_token) {
      getUser();
      getTranslation();
    } else {
      getTranslation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getUser = async () => {
    try {
      let { data } = await API("get", "me");
      dispatch(storeUser(data));
      getTranslation();
    } catch (error) {
      dispatch(logout());
      getTranslation();
    }
  };

  const getTranslation = async () => {
    axios
      .get("https://gama-portal.ch/apps/gama-storage-server/api/get-csvfile", {
        headers: {
          "content-type": "application/json",
        },
      })
      .then((res) => {
        dispatch(Translation(res?.data));
        if (!_lan) {
          dispatch(langSetter("german"));
        } else {
          dispatch(langSetter(_lan));
        }
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
      });
  };

  return (
    <>
      {isLoading ? (
        <SplashScreen />
      ) : (
        <Routes>
          <Route
            path="/sign-in"
            exact
            element={
              <CheckUser flag={isLogged} user={user}>
                <SignIn />
              </CheckUser>
            }
          />
          <Route path="/set-password/:token" exact element={<SetPassword />} />
          <Route path="/qr" exact element={<QrViewer />} />
          {appRoutes.map((_v, _i) => {
            return (
              <Route
                key={_i}
                path={_v.path}
                exact
                element={
                  <Protected
                    isLogged={isLogged}
                    user={user}
                    ele={_v}
                    children={_v.component}
                  />
                }
              />
            );
          })}
          <Route path="*" element={<SignIn />} />
        </Routes>
      )}
    </>
  );
}

const Protected = ({ isLogged, ele, user, children }) => {
  var array = window.location.pathname.split("/");
  if (!isLogged) {
    return <Navigate to="/sign-in" replace />;
  }
  if (user?.role === "stock_manager" && ele.path === array[3] + array[4])
    return <Navigate to="/" replace />;
  else return ele.layout ? <Layout children={children} /> : children;
};
const CheckUser = ({ flag, user, children }) => {
  if (flag) {
    return <Navigate to="/" replace />;
  }
  return children;
};
