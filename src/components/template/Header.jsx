import "./Header.css";
import React from "react";
import If from "./If";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { changeVisibility } from "../../store/actions/menu";

const Header = (props) => {
  const { changeVisibility } = props;
  return (
    <header className="header">
      <If test={props.user}>
        <a href="#" className="toogle" onClick={() => changeVisibility()}>
          <i
            className={
              props.isMenuVisible ? "fa fa-lg fa-close" : "fa fa-lg fa-bars"
            }
          ></i>
        </a>
      </If>
      <h1 className="header-title">Meeting Manager</h1>
    </header>
  );
};

const mapStateToProps = (state) => ({
  isMenuVisible: state.menu.visible,
  user: state.auth.user,
});
const mapDispatchToProps = (dispatch) =>
  bindActionCreators({ changeVisibility }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Header);
