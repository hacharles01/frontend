import { Link, useLocation } from "react-router-dom";
import appeal from "../../assets/icons/appeal.png";
import career from "../../assets/icons/career.png";
import contract from "../../assets/icons/contract.png";
import discipline from "../../assets/icons/discipline.png";
import exit from "../../assets/icons/exit.png";
import leave from "../../assets/icons/leave.png";
import payroll from "../../assets/icons/payroll.png";
import rbm from "../../assets/icons/rbm.png";
import recruitment from "../../assets/icons/recruitment.png";
import structure from "../../assets/icons/structure.png";
import talent from "../../assets/icons/talent.png";
import training from "../../assets/icons/training.png";

const ModulesMenu = () => {
  const location = useLocation();

  return (
    <>
      <div className="d-flex pl-1 modules-menu  align-items-center flex-wrap ">
        <Link
          style={{ textDecoration: "none" }}
          to="/recruitment"
          className={`mr-1 px-1      ${
            location.pathname.includes("/recruitment") ? " active  " : " "
          }`}
        >
          <span className=" ">
            <img src={recruitment} width="20" alt="" className="mr-1" />
            Recruitment
          </span>
        </Link>

        <Link
          style={{ textDecoration: "none" }}
          to="/structure"
          className={`mr-1 px-1    ${
            location.pathname.includes("/structure") ? " active  " : " "
          }`}
        >
          <span className=" ">
            <img src={structure} width="20" alt="" className="mr-1" />
            Org. Structure
          </span>
        </Link>

        <Link
          style={{ textDecoration: "none" }}
          to="/payroll"
          className={`  mr-1 px-1     ${
            location.pathname.includes("/payroll") ? "active" : " "
          }`}
        >
          <span className="  ">
            <img src={payroll} width="20" alt="" className="mr-1" />
            Payroll
          </span>
        </Link>

        <Link
          style={{ textDecoration: "none" }}
          to="/rbm"
          className={`  mr-1 px-1     ${
            location.pathname.includes("/rbm") ? "active" : " "
          }`}
        >
          <span className=" ">
            <img src={rbm} width="20" alt="" className="mr-1 invert" />
            RBM
          </span>
        </Link>
        <Link
          style={{ textDecoration: "none" }}
          to="/training"
          className={`  mr-1 px-1     ${
            location.pathname.includes("/training") ? "active" : " "
          }`}
        >
          <span className="  ">
            <img src={training} width="20" alt="" className="mr-1" />
            Training
          </span>
        </Link>
        <Link
          style={{ textDecoration: "none" }}
          to="/career"
          className={`  mr-1 px-1     ${
            location.pathname.includes("/career") ? "active" : " "
          }`}
        >
          <span className="  ">
            <img src={career} width="20" alt="" className="mr-1" />
            Career
          </span>
        </Link>
        <Link
          style={{ textDecoration: "none" }}
          to="/talents"
          className={`  mr-1 px-1     ${
            location.pathname.includes("/talents") ? "active" : " "
          }`}
        >
          <span className="  ">
            <img src={talent} width="20" alt="" className="mr-1" />
            Talents
          </span>
        </Link>
        <Link
          style={{ textDecoration: "none" }}
          to="/leave"
          className={`  mr-1 px-1     ${
            location.pathname.includes("/leave") ? "active" : " "
          }`}
        >
          <span className="  ">
            <img src={leave} width="20" alt="" className="mr-1" />
            Leave & Abscence
          </span>
        </Link>
        <Link
          style={{ textDecoration: "none" }}
          to="/discipline"
          className={`  mr-1 px-1     ${
            location.pathname.includes("/discipline") ? "active" : " "
          }`}
        >
          <span className="  ">
            <img src={discipline} width="20" alt="" className="mr-1" />
            Discipline
          </span>
        </Link>
        <Link
          style={{ textDecoration: "none" }}
          to="/e-appeal"
          className={`  mr-1 px-1     ${
            location.pathname.includes("/e-appeal") ? "active" : " "
          }`}
        >
          <span className="  ">
            <img src={appeal} width="20" alt="" className="mr-1" />
            E-Appeal
          </span>
        </Link>
        <Link
          style={{ textDecoration: "none" }}
          to="/exit"
          className={`  mr-1 px-1     ${
            location.pathname.includes("/exit") ? "active" : " "
          }`}
        >
          <span className="  ">
            <img src={exit} width="20" alt="" className="mr-1" />
            Exit
          </span>
        </Link>
      </div>
    </>
  );
};

export default ModulesMenu;
