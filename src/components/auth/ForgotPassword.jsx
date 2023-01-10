import axios from "axios";
import React from "react";
import "./Auth.css";
import { baseApiUrl, showError } from "../../config/global";
import { useState } from "react";
import { Link } from "react-router-dom";
import If from "../template/If";

export default (props) => {
  const [email, setEmail] = useState("");
  const [send, setSend] = useState(false);
  const [resend, setResend] = useState(false);
  const [timer, setTimer] = useState(60);

  const forgotPassword = (event) => {
    event.preventDefault();
    setResend(false);
    const req = {
      email: email,
    };
    axios
      .post(`${baseApiUrl}/resetPassword`, req)
      .then((res) => {
        setSend(true);
        setTimer(60);
        startCounter();
      })
      .catch(showError);
  };

  const restartPage = (event) => {
    setSend(false);
  };

  const startCounter = () => {
    let interval = 60;
    var count = setInterval(() => {
      setTimer(interval);
      console.log(interval);
      if (interval == 0) {
        setResend(true);
        clearInterval(count);
      }
      interval--;
    }, 1000);
    return () => clearInterval(count);
  };

  return (
    <div className="card-3d-wrap mx-auto">
      <div className="card-3d-wrapper">
        <div className="card-front">
          <div className="center-wrap">
            <div className="section text-center">
              <h4 className="mb-4 pb-3 login-text">Repor Password</h4>
              <If test={!send}>
                <div className="form-group">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-style"
                    name="email"
                    placeholder="E-mail"
                  />
                  <i className="input-icon fa fa-at"></i>
                </div>
                <button
                  className="btn mt-4 btn-login"
                  onClick={(e) => forgotPassword(e)}
                >
                  Confirmar
                </button>
                <p className="mb-0 mt-4 text-center">
                  <Link to="/auth/signin" className="link">
                    Voltar
                  </Link>
                </p>
              </If>
              <If test={send}>
                <h4 className="mb-4 pb-3 login-text">Verifica o teu e-mail!</h4>
                <h4 className="mb-4 pb-3 login-text">{timer}s</h4>
                <If test={resend}>
                  <button
                    className="btn mt-4 btn-login"
                    onClick={(e) => restartPage(e)}
                  >
                    Enviar novo e-mail
                  </button>
                </If>
              </If>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
