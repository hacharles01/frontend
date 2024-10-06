import {
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Skeleton,
  List
} from "@mui/material";

import React, { useEffect,useState } from "react";
import { connect } from "react-redux";
import { getPositionEmployees } from "../../../store/structure/actions";
import PositionEmployeeCard from "../components/PositionEmployeeCard";
import ReactPaginate from "react-paginate";
const ViewPositionEmployees = (props) => {
  const {
    loading,
    positionEmployees,
    position,
    showPostionEmployeesModal,
    setShowPostionEmployeesModal,
    getPositionEmployees,
  } = props;


  useEffect(
    () => {
      getPositionEmployees(position.id);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [position]
  );

   //PAGINATION
   const [paginatedItems, setPaginatedItems] = useState([]);
   const [pageCount, setPageCount] = useState(0);
 
   const [itemOffset, setItemOffset] = useState(0);
 
   const itemsPerPage = 5;
 
   const paginate = (items) => {
     const endOffset = itemOffset + itemsPerPage;
     setPaginatedItems(items.slice(itemOffset, endOffset));
     setPageCount(Math.ceil(items.length / itemsPerPage));
   };


   useEffect(() => {
    paginate(positionEmployees);
  },
      // eslint-disable-next-line react-hooks/exhaustive-deps
   [itemOffset, itemsPerPage, positionEmployees]);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % positionEmployees.length;

    setItemOffset(newOffset);
  };

  const onClose = () => {
    setShowPostionEmployeesModal(false);
  };

  return (
    <>
      <Dialog
        onClose={onClose}
        aria-labelledby="customized-dialog-title"
        open={showPostionEmployeesModal}
        fullWidth
      >
        <DialogTitle className="text-primary">
          <Typography variant="overline" display="block">
            Position: <span>{position.name}</span>
          </Typography>
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <span className="material-icons">close</span>
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <div className="row no-gutter justify-content-center">
            {!!paginatedItems.length && !loading && (
               <List sx={{ width: '100%', maxWidth: '100%', bgcolor: 'background.paper' }}>
                  {paginatedItems.map((employee, index) => (
                    <PositionEmployeeCard index={index} employee={employee} key={index}  />
                  ))}
               </List>
            )}

            {!paginatedItems.length && !loading && (
              <div className="jumbotron jumbotron-fluid text-center mt-5" style={{width:'100%'}}>
                <div className="container">
                  <p className="lead">No employees found</p>
                </div>
              </div>
            )}

            {position && loading && (
              <div>
                <Skeleton
                  variant="rectangular"
                  className="mb-3 mt-2"
                  height={118}
                />
                <Skeleton variant="rectangular" className="mb-3" height={96} />
                <Skeleton variant="rectangular" className="mb-3" height={96} />
              </div>
            )}

          {!loading && !!paginatedItems.length && positionEmployees.length >= itemsPerPage && (
                <ReactPaginate
                  breakLabel="..."
                  nextLabel={
                    <>
                      <span className="pr-1 d-none d-md-inline">Next</span>
                      <i className="fas fa-angle-double-right"></i>
                    </>
                  }
                  previousLabel={
                    <>
                      <i className="fas fa-angle-double-left"></i>
                      <span className="pl-1  d-none d-md-inline">Previous</span>
                    </>
                  }
                  pageRangeDisplayed={3}
                  marginPagesDisplayed={1}
                  onPageChange={handlePageClick}
                  pageCount={pageCount}
                  renderOnZeroPageCount={null}
                  containerClassName="pagination"
                  pageLinkClassName="btn btn-outline-info btn-sm mr-1 ml-1 mt-1"
                  previousLinkClassName="btn btn-outline-info btn-sm mr-1 ml-1 mt-1"
                  nextLinkClassName="btn btn-outline-info btn-sm ml-1 mt-1"
                  activeLinkClassName="active"
                />
              )}

          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

const mapStateToProps = ({ loading, positionEmployees }) => {
  return {
    loading,
    positionEmployees,
  };
};
export default connect(mapStateToProps, {
  getPositionEmployees,
})(ViewPositionEmployees);
