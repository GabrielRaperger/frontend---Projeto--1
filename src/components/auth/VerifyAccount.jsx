import axios from "axios";
import React from "react";
import "./Auth.css";
import { useParams } from "react-router-dom";
import { baseApiUrl } from "../../config/global";
import { useState } from "react";
import HashLoader from "react-spinners/HashLoader";
import { useEffect } from "react";
import If from "../template/If";

export default (props) => {
  let { id, token } = useParams();
  let [loading, setLoading] = useState(true);
  let [icon, setIcon] = useState("fa-check-circle-o text-success");
  let [message, setMessage] = useState("A tua conta foi verificada!!");

  useEffect(() => {
    verifyAccount();
  }, []);

  function verifyAccount() {
    setLoading(true);
    if (id && token) {
      axios
        .post(`${baseApiUrl}/verify/${id}/${token}`)
        .then((res) => {
          setLoading(false);
          setIcon("fa-check-circle-o text-success");
          setMessage("A tua conta foi verificada!!");
        })
        .catch((error) => {
          setLoading(false);
          setIcon("fa-exclamation-circle text-danger");
          setMessage("Não foi possivel verificar a tua conta!!");
        });
    }
  }

  return (
    <div className="d-flex flex-column justify-content-center content-box align-items-center">
      <HashLoader loading={loading} color="#5b67ca" size={200} />
      <If test={!loading}>
        <i className={`fa ${icon} verify-icon`}></i>
        <h1 class="display-3 mt-4">{message}</h1>
      </If>
    </div>
  );
};
