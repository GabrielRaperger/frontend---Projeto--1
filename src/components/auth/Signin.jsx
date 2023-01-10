import axios from "axios";
import React from "react";
import "./Auth.css";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { useNavigate } from "react-router-dom";
import { setUser } from "../../store/actions/auth";
import { baseApiUrl, showError, userKey } from "../../config/global";
import { useState } from "react";
import { Link } from "react-router-dom";

const Signin = (props) => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const login = (event) => {
    event.preventDefault();
    axios
      .post(`${baseApiUrl}/signin`, credentials)
      .then((res) => {
        props.setUser(res.data);
        localStorage.setItem(userKey, JSON.stringify(res.data));
        navigate("/");
      })
      .catch(showError);
  };

  return (
    <div className="card-3d-wrap mx-auto">
      <div className="card-3d-wrapper">
        <div className="card-front">
          <div className="center-wrap">
            <div className="section text-center">
              <h4 className="mb-4 pb-3 login-text">Log In</h4>
              <div className="form-group">
                <input
                  type="email"
                  value={credentials.email}
                  onChange={(e) =>
                    setCredentials({
                      ...credentials,
                      email: e.target.value,
                    })
                  }
                  className="form-style"
                  name="email"
                  placeholder="E-mail"
                />
                <i className="input-icon fa fa-at"></i>
              </div>
              <div className="form-group mt-2">
                <input
                  type="password"
                  value={credentials.password}
                  onChange={(e) =>
                    setCredentials({
                      ...credentials,
                      password: e.target.value,
                    })
                  }
                  className="form-style"
                  name="password"
                  placeholder="Password"
                />
                <i className="input-icon fa fa-lock"></i>
              </div>
              <button className="btn mt-4 btn-login" onClick={(e) => login(e)}>
                Entrar
              </button>
              <p className="mb-0 mt-4 text-center">
                <Link to="/auth/reset-password" className="link">
                  Repor password
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({ user: state.auth.user });
const mapDispatchToProps = (dispatch) =>
  bindActionCreators({ setUser }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Signin);
