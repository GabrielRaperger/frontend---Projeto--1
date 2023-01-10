import "bootstrap/dist/css/bootstrap.min.css";
import "font-awesome/css/font-awesome.min.css";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { ToastContainer } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import Router from "./Router";
import Header from "../components/template/Header";
import Menu from "../components/template/Menu";
import If from "../components/template/If";
import { setUser } from "../store/actions/auth";
import { useEffect } from "react";
import { userKey } from "../config/global";

const App = (props) => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    validateToken();
  }, []);

  const validateToken = async () => {
    const json = localStorage.getItem(userKey);
    const userData = JSON.parse(json);

    if (!userData) {
      if (!location.pathname.includes("/auth/")) {
        props.setUser(null);
        navigate("/auth/signin");
      }
    } else {
      props.setUser(userData);
    }
  };

  return (
    <div
      id="app"
      className={!props.isMenuVisible || !props.user ? "hide-menu" : ""}
    >
      <Header hideToggle={props.user} />
      <If test={props.user}>
        <Menu />
      </If>
      <Router />
      <ToastContainer />
    </div>
  );
};

const mapStateToProps = (state) => ({
  isMenuVisible: state.menu.visible,
  user: state.auth.user,
});
const mapDispatchToProps = (dispatch) =>
  bindActionCreators({ setUser }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(App);
