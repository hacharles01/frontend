import {
  List
} from "@mui/material";

import React, { useEffect,useState } from "react";
import { connect } from "react-redux";
import { getProfessionalCertificates } from "../../../store/structure/actions";
import ProfessionalCertificateCard from "./ProfessionalCertificateCard";
import ReactPaginate from "react-paginate";

const ProfessionalCertificate = (props) => {
  const {
    loading,
    professionalCertificates,
    position,
    getProfessionalCertificates,
  } = props;


  useEffect(
    () => {
      getProfessionalCertificates(position.id);
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
    paginate(professionalCertificates);
  },
      // eslint-disable-next-line react-hooks/exhaustive-deps
   [itemOffset, itemsPerPage, professionalCertificates]);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % professionalCertificates.length;

    setItemOffset(newOffset);
  };

  return (
    <>
     <div className="row no-gutter justify-content-center">
            {!!paginatedItems.length && !loading && (
               <List sx={{ width: '100%', maxWidth: '100%', bgcolor: 'background.paper' }}>
                  {paginatedItems.map((professionalCertificate, index) => (
                    <ProfessionalCertificateCard index={index} professionalCertificate={professionalCertificate} key={index} position={position}  />
                  ))}
               </List>
            )}

          {!paginatedItems.length && !loading && (
              <div className="jumbotron jumbotron-fluid text-center mt-5" style={{width:'100%'}}>
                <div className="container">
                  <p className="lead">No professional certificates found</p>
                </div>
              </div>
            )}

          {!loading && !!paginatedItems.length && professionalCertificates.length >= itemsPerPage && (
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
    </>
  );
};

const mapStateToProps = ({ loading, professionalCertificates }) => {
  return {
    loading,
    professionalCertificates,
  };
};
export default connect(mapStateToProps, {
  getProfessionalCertificates,
})(ProfessionalCertificate);
