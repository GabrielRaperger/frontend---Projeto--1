import axios from "axios";
import React from "react";
import "./Auth.css";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { useNavigate, useParams } from "react-router-dom";
import { setUser } from "../../store/actions/auth";
import { baseApiUrl, showError, showSuccess } from "../../config/global";
import { useState } from "react";
import { Link } from "react-router-dom";

const Signin = (props) => {
  let { id, token } = useParams();
  const [credentials, setCredentials] = useState({
    password: "",
    confirm_password: "",
  });
  const navigate = useNavigate();

  const changePassword = (event) => {
    event.preventDefault();
    if (token && id) {
      axios
        .post(`${baseApiUrl}/resetPassword/${id}/${token}`, {...credentials})
        .then((res) => {
          showSuccess("A password foi alterada com sucesso");
          navigate("/auth/signin");
        })
        .catch((error) => {
          console.log(error);
          showError(error);
        });
    }
  };

  return (
    <div className="card-3d-wrap mx-auto">
      <div className="card-3d-wrapper">
        <div className="card-front">
          <div className="center-wrap">
            <div className="section text-center">
              <h4 className="mb-4 pb-3 login-text">Nova Password</h4>
              <div className="form-group">
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
                <i className="input-icon uil fa fa-lock"></i>
              </div>
              <div className="form-group mt-2">
                <input
                  type="password"
                  value={credentials.confirm_password}
                  onChange={(e) =>
                    setCredentials({
                      ...credentials,
                      confirm_password: e.target.value,
                    })
                  }
                  className="form-style"
                  name="confirm_password"
                  placeholder="Confirmar Password"
                />
                <i className="input-icon uil fa fa-check-square-o"></i>
              </div>
              <button
                className="btn mt-4 btn-login"
                onClick={(e) => changePassword(e)}
              >
                Alterar Password
              </button>
              <p className="mb-0 mt-4 text-center">
                <Link to="/auth/signin" className="link">
                  Log In
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
