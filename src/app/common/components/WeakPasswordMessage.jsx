import { Link } from "react-router-dom";

const WeakPasswordMessage = () => {
  return (
    <div className="alert alert-danger text-center py-1 mb-0 weak-password-div">
      Your password is very weak.
      <Link to="/rbm/my-account" className="btn btn-info btn-sm ml-2 mr-2">
        Click here
      </Link>
      to change it.
    </div>
  );
};

export default WeakPasswordMessage;
