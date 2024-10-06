import { connect } from "react-redux";

const Proflile = (props) => {
  const { user } = props;
  return (
    <>
      <div className="row mt-3 justify-content-center">
        <div className="col-12 col-md-8 text-center">
          <span className="text-uppercase text-primary font-weight-bold">
            My Profile
          </span>
          <div className="row mt-2  mb-2">
            <div className="col-6 text-right">EmployeeId:</div>
            <div className="col-6 text-left">{user.employeeId}</div>
          </div>
          <div className="row  mb-2">
            <div className="col-6 text-right">Names:</div>
            <div className="col-6 text-left">
              {user.firstName} {user.lastName}
            </div>
          </div>
          <div className="row  mb-2">
            <div className="col-6 text-right">Email:</div>
            <div className="col-6 text-truncate text-left">{user.email}</div>
          </div>
          <div className="row mb-2">
            <div className="col-6 text-right">Phone Number:</div>
            <div className="col-6 text-left">{user.phoneNumber}</div>
          </div>
          <div className="row  mb-2">
            <div className="col-6 text-right">NID Number:</div>
            <div className="col-6 text-left">{user.idNumber}</div>
          </div>
          <div className="row  mb-2">
            <div className="col-6 text-right">Position:</div>
            <div className="col-6 text-left">{user.position.name}</div>
          </div>
          <div className="row  mb-2">
            <div className="col-6 text-right">Unit:</div>
            <div className="col-6 text-left">{user.unit.name}</div>
          </div>
          <div className="row  mb-2">
            <div className="col-6 text-right">Institution:</div>
            <div className="col-6 text-left">{user.institution.name}</div>
          </div>
          <div className="row  mb-2">
            <div className="col-6 text-right">Roles:</div>
            <div className="col-6 text-left">
              <small>
                {user.position.isTechnicalHead ? "| TECH_HEAD | " : ""}
                {user.position.isSupervisor ? "| SUPERVISOR | " : ""}
                {user.position.isPlanner ? "| PLANNER | " : ""}
                {user.position.isEmployee ? "| EMPLOYEE | " : ""}
              </small>
            </div>
          </div>
        </div>
      </div>

      {!!user.actingPosition && (
        <div className="row mt-3 justify-content-center alert alert-primary">
          <div className="col-12 col-md-8 text-center">
            <div className="row  mb-2">
              <div className="col-6 text-right">Acting position:</div>
              <div className="col-6 text-left">{user.actingPosition.name}</div>
            </div>
            <div className="row  mb-2">
              <div className="col-6 text-right">Acting unit:</div>
              <div className="col-6 text-left">{user.actingUnit.name}</div>
            </div>

            <div className="row  mb-2">
              <div className="col-6 text-right">Acting roles:</div>
              <div className="col-6 text-left">
                <small>
                  {user.actingPosition.isTechnicalHead
                    ? "| Ag.TECH_HEAD | "
                    : ""}
                  {user.actingPosition.isSupervisor ? "| Ag.SUPERVISOR | " : ""}
                  {user.actingPosition.isPlanner ? "| Ag.PLANNER | " : ""}
                  {user.actingPosition.isEmployee ? "| Ag.EMPLOYEE | " : ""}
                </small>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const mapStateToProps = ({ user, strongPassword }) => {
  return { user, strongPassword };
};
export default connect(mapStateToProps)(Proflile);
