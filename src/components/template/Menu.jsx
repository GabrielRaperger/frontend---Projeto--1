import "./Menu.css";
import React from "react";
import links from "../../config/links";
import { CustomLink } from "./Link.tsx";
import If from "./If";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { setUser } from "../../store/actions/auth";
import { userKey } from "../../config/global";
import { useNavigate } from "react-router";
import Gravatar from "react-gravatar";

const Menu = (props) => {
  const navigate = useNavigate();

  function logout(event) {
    event.preventDefault();
    localStorage.removeItem(userKey);
    props.setUser(null);
    navigate("/auth/signin");
  }

  return (
    <If test={props.isMenuVisible && props.user}>
      <aside className="menu d-flex flex-column">
        <div className="vertical-nav bg-white" id="sidebar">
          <div className="p-3 bg-light">
            <div className="media d-flex align-items-center">
              <Gravatar
                email={props.user.name}
                size={65}
                className="mr-3 rounded-circle img-thumbnail shadow-sm"
              />
              <div className="media-body ms-1">
                <h5 className="m-0">{props.user.name}</h5>
                <p className="font-weight-light text-muted mb-0 user-email">
                  {props.user.email}
                </p>
              </div>
            </div>
          </div>
        </div>
        <nav className="menu-area">
          {links.map((link, index) => {
            return (
              <CustomLink key={index} to={link.to}>
                <i className={link.icon}></i> {link.name}
              </CustomLink>
            );
          })}
        </nav>
        <div className="d-flex justify-content-center logout-button">
          <button
            type="button"
            className="btn btn-danger"
            onClick={(e) => logout(e)}
          >
            <i className="fa fa-arrow-left"></i> Sair
          </button>
        </div>
      </aside>
    </If>
  );
};

const mapStateToProps = (state) => ({
  isMenuVisible: state.menu.visible,
  user: state.auth.user,
});
const mapDispatchToProps = (dispatch) =>
  bindActionCreators({ setUser }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Menu);
