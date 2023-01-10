import React from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router";

const RequireAuth = (props) => {
  const navigate = useNavigate();
  if (!props.user || props.user.profile !== "admin") navigate("/auth/signin");
  else return <React.Fragment>{props.children}</React.Fragment>;
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
});

export default connect(mapStateToProps)(RequireAuth);
