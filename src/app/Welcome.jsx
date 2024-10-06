import React, { Fragment, useState, createRef, useEffect } from "react";
import { useHistory } from "react-router-dom";

import logo from "./assets/logo-full.png";
import chart1 from "./assets/charts/chart1.svg";
import chart2 from "./assets/charts/chart2.svg";
import chart3 from "./assets/charts/chart3.svg";
import { connect } from "react-redux";
import {
  login,
  register,
  resetPassword,
  logout,
} from "../store/common/actions";

const Welcome = (props) => {
  const { login, register, resetPassword, logout, loading } = props;
  const history = useHistory();

  const loginModelDismiss = createRef();
  const registerModelDismiss = createRef();
  const [isForgetFormActive, setIsForgetFormActive] = useState(false);

  // Login
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const onLogin = async (e) => {
    e.preventDefault();
    const modelDismiss = loginModelDismiss.current;
    login(credentials, history, modelDismiss);
  };

  //Resset password
  const [email, setEmail] = useState("");
  const onReset = async (e) => {
    e.preventDefault();
    resetPassword(email);
  };

  //Register
  const [userToRegister, setUserToRegister] = useState({
    employeeId: "",
    email: "",
    phoneNumber: "",
  });

  const onRegister = async (e) => {
    e.preventDefault();
    const modelDismiss = registerModelDismiss.current;
    register(userToRegister, modelDismiss);
  };

  useEffect(
    () => {
      logout(history);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <Fragment>
      <div id="welcpme-pg">
        <div className="alert alert-warning my-alert text-center" role="alert">
          <i className="fas fa-bell mr-2"></i>
          <strong>MIFOTRA</strong> has started the piloting phase of the new
          IPPIS version which includes many features that will help to manage
          public service more effectively.
          <a
            target="_blank"
            className="btn btn-link text-uppercase"
            href="http://ippis.rw/"
          >
            To open it, click here.
          </a>
        </div>
        {/* <div className="alert alert-warning my-alert" role="alert">
          We are conducting an impact evaluation to assess the impact of RBM
          system on Public Institutions organizational efficiency and to examine
          the level of satisfaction from users. The evaluation shall also
          collect the recommendations, which will guide the future improvement
          of RBM system.
          <strong>
            Please take a few minutes to complete this short survey to
            contribute on the future improvement of RBM system.
          </strong>
          <div className="text-center mt-2">
            <a
              target="_blank"
              className="btn btn-primary"
              href="https://form.jotform.com/223464381224048"
            >
              Take the survey {"=>"} for planners
            </a>
            <a
              target="_blank"
              className="btn btn-secondary ml-3"
              href="https://form.jotform.com/223464877528065"
            >
              Take the survey {"=>"} for other RBM users
            </a>
          </div>
        </div> */}
        <div className="header">
          <div className="header-top"></div>
          <div className="header-bottom"></div>
        </div>
        <div className="body-wrp">
          <span className="span2"></span>
          <div className="applicant-container">
            <div className="title">
              <div className="logocont">
                <img src={logo} alt="logo" />
              </div>
              <h2>Result Based Performance Management System</h2>
              <p>Integrated Personnel and Payroll Information System</p>
              <div className="join__btns">
                <div
                  className="loginBtn"
                  data-toggle="modal"
                  data-target="#myLogin"
                >
                  <button>Login</button>
                </div>
                <div
                  className="loginBtn "
                  data-toggle="modal"
                  data-target="#mySignup"
                >
                  <button>Sign Up</button>
                </div>
              </div>
              <div className="join__btns">
                <div className="loginBtn">
                  <a
                    className="btn btn-outline-info button is-outlined has-text-info"
                    href="https://e-recruitment.mifotra.gov.rw"
                    target="_brank"
                  >
                    Go To Recruitment Portal
                  </a>
                </div>
              </div>
            </div>
            <div className="cards d-none d-lg-block">
              <div className="cards-s">
                <div className="staticard">
                  <h2>Personnel</h2>
                  <div className="imgcont">
                    <img src={chart1} alt="jobs stastistics graph" />
                  </div>
                </div>
                <div className="staticard">
                  <h2>Salary</h2>
                  <div className="imgcont">
                    <img src={chart2} alt="jobs stastistics graph" />
                  </div>
                </div>
              </div>
              <div className="staticard-l">
                <h2>Performance</h2>
                <div className="imgcont">
                  <img src={chart3} alt="jobs stastistics graph" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="modal fade" id="myLogin">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body">
              <span
                className="closebtn"
                ref={loginModelDismiss}
                data-dismiss="modal"
              >
                X
              </span>
              <div className="logincont">
                <div className="loginwrp">
                  <div className="sidebar">
                    <span className="span_3"></span>
                  </div>
                  {!isForgetFormActive && (
                    <div className="loginform">
                      <div className="logincont__header">
                        <h2>Login</h2>
                        <p>Provide informations below to continue</p>
                      </div>
                      <form onSubmit={onLogin}>
                        <div className="logincont__form">
                          <div className="login--filed login--filed-witherror havTultip2">
                            <label>Email</label>
                            <input
                              className="input"
                              type="text"
                              placeholder="Email"
                              required
                              value={credentials.username}
                              name="username"
                              onChange={(e) => {
                                const username = e.target.value;
                                setCredentials({ ...credentials, username });
                              }}
                            />
                          </div>
                          <div className="login--filed login--filed-witherror">
                            <label>Password</label>
                            <input
                              className="input"
                              type="password"
                              name="password"
                              placeholder="********"
                              required
                              value={credentials.password}
                              onChange={(e) => {
                                const password = e.target.value;
                                setCredentials({ ...credentials, password });
                              }}
                            />
                          </div>
                          <div className="forgotbBtn">
                            <button
                              onClick={() => {
                                setIsForgetFormActive(true);
                              }}
                              type="button"
                            >
                              Reset Password
                            </button>
                          </div>

                          {!loading && (
                            <div className="loginsubBtn">
                              <button className="pri__button" type="submit">
                                Login
                              </button>
                            </div>
                          )}
                          {loading && (
                            <div className="loginsubBtn">
                              <button className="pri__button" type="button">
                                Connecting...
                              </button>
                            </div>
                          )}
                        </div>
                      </form>
                    </div>
                  )}

                  {isForgetFormActive && (
                    <div className="loginform">
                      <div className="logincont__header">
                        <h2>Reset Password</h2>
                      </div>
                      <form onSubmit={onReset}>
                        <div className="logincont__form">
                          <div className="login--filed login--filed-witherror havTultip2">
                            <label>Email</label>
                            <input
                              className="input"
                              type="email"
                              name="email"
                              pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
                              required
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                            />
                          </div>

                          <div className="loginsubBtn">
                            {!loading && (
                              <button className="pri__button" type="submit">
                                Submit
                              </button>
                            )}
                            {loading && (
                              <button className="pri__button" type="button">
                                Wait...
                              </button>
                            )}
                            <button
                              onClick={() => {
                                setIsForgetFormActive(false);
                              }}
                              className="sec__button"
                              type="button"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="modal fade" id="mySignup">
        <div className="modal-dialog modal-dialog-centered signup-modal">
          <div className="modal-content">
            <div className="modal-body">
              <span
                className="closebtn"
                ref={registerModelDismiss}
                data-dismiss="modal"
              >
                X
              </span>
              <div className="logincont">
                <div className="loginwrp">
                  <div className="sidebar">
                    <span className="span_3"></span>
                  </div>
                  <div className="loginform">
                    <div className="logincont__header">
                      <h2>Sign Up</h2>
                      <p>Create an account to access this application</p>
                    </div>

                    <form onSubmit={onRegister}>
                      <div className="logincont__form ">
                        <div className="emplofield">
                          <div className="login--filed">
                            <label>NID Number or EmployeeID</label>
                            <input
                              type="text"
                              name="employeeId"
                              required
                              value={userToRegister.employeeId}
                              onChange={(e) => {
                                const employeeId = e.target.value;
                                setUserToRegister({
                                  ...userToRegister,
                                  employeeId,
                                });
                              }}
                            />
                          </div>
                        </div>

                        <div className="emplofield">
                          <div className="login--filed">
                            <label>Email</label>
                            <input
                              type="text"
                              name="email"
                              pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
                              required
                              value={userToRegister.email}
                              onChange={(e) => {
                                const email = e.target.value;
                                setUserToRegister({ ...userToRegister, email });
                              }}
                            />
                          </div>
                        </div>

                        <div className="emplofield">
                          <div className="login--filed">
                            <label>Telephone</label>
                            <input
                              type="text"
                              name="phoneNumber"
                              required
                              value={userToRegister.phoneNumber}
                              onChange={(e) => {
                                const phoneNumber = e.target.value;
                                setUserToRegister({
                                  ...userToRegister,
                                  phoneNumber,
                                });
                              }}
                            />
                          </div>
                        </div>

                        <div className="loginsubBtn">
                          {!loading && (
                            <button className="pri__button" type="submit">
                              Submit
                            </button>
                          )}
                          {loading && (
                            <button className="pri__button" type="button">
                              Wait...
                            </button>
                          )}
                          <button
                            className="sec__button"
                            type="button"
                            data-dismiss="modal"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

const mapStateToProps = ({ user, loading }) => {
  return { user, loading };
};
export default connect(mapStateToProps, {
  login,
  register,
  resetPassword,
  logout,
})(Welcome);
