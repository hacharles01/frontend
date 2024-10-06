import React, { useState, useEffect } from "react";

import { Switch, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import RBMLayout from "./rbm/Layout";
import Welcome from "./Welcome";
import TopBarProgress from "react-topbar-progress-indicator";
import { connect } from "react-redux";
import StructLayout from "./structure/Layout";
import WeakPasswordMessage from "./common/components/WeakPasswordMessage";

function App(props) {
  let [online, isOnline] = useState(navigator.onLine);

  const setOnline = () => {
    isOnline(true);
  };
  const setOffline = () => {
    isOnline(false);
  };

  useEffect(() => {
    window.addEventListener("offline", setOffline);
    window.addEventListener("online", setOnline);

    return () => {
      window.removeEventListener("offline", setOffline);
      window.removeEventListener("online", setOnline);
    };
  }, []);

  const { loading } = props;
  TopBarProgress.config({
    barColors: {
      0: "#f00",
      0.5: "#f00",
      1.0: "#f00",
    },
    shadowBlur: 5,
  });
  return (
    <React.Fragment>
      {loading && <TopBarProgress />}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        theme="colored"
        pauseOnHover
      />
      {!online && (
        <div
          className="bg-danger text-white text-center px-1 py-0 "
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            width: "100vw",
            zIndex: "99999",
            fontSize: "10px",
          }}
        >
          Offline
        </div>
      )}
      {/* <WeakPasswordMessage /> */}

      <Switch>
        <Route path="/rbm" component={RBMLayout} />
        <Route path="/structure" component={StructLayout} />
        <Route path="/" component={Welcome} />
      </Switch>
    </React.Fragment>
  );
}

const mapStateToProps = ({ loading }) => {
  return { loading };
};
export default connect(mapStateToProps)(App);
