import React, { useState, useEffect, useCallback } from "react";
import SvgIcon from "@mui/material/SvgIcon";
import { alpha, styled } from "@mui/material/styles";
import TreeView from "@mui/lab/TreeView";
import TreeItem, { treeItemClasses } from "@mui/lab/TreeItem";

import { getTreeUnits, deleteUnit } from "../../../store/structure/actions";
import { connect } from "react-redux";
import { isEmpty } from "lodash";
import { IconButton,Tooltip,Chip } from "@mui/material";
import ConfirmationDialog from "../../rbm/components/ConfirmationDialog";
import AddOrUpdateUnitDialog from "../components/AddOrUpdateUnitDialog";

function MinusSquare(props) {
  return (
    <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
      {/* tslint:disable-next-line: max-line-length */}
      <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 11.023h-11.826q-.375 0-.669.281t-.294.682v0q0 .401.294 .682t.669.281h11.826q.375 0 .669-.281t.294-.682v0q0-.401-.294-.682t-.669-.281z" />
    </SvgIcon>
  );
}

function PlusSquare(props) {
  return (
    <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
      {/* tslint:disable-next-line: max-line-length */}
      <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 12.977h-4.923v4.896q0 .401-.281.682t-.682.281v0q-.375 0-.669-.281t-.294-.682v-4.896h-4.923q-.401 0-.682-.294t-.281-.669v0q0-.401.281-.682t.682-.281h4.923v-4.896q0-.401.294-.682t.669-.281v0q.401 0 .682.281t.281.682v4.896h4.923q.401 0 .682.281t.281.682v0q0 .375-.281.669t-.682.294z" />
    </SvgIcon>
  );
}

function CloseSquare(props) {
  return (
    <SvgIcon
      className="close"
      fontSize="inherit"
      style={{ width: 14, height: 14 }}
      {...props}
    >
      {/* tslint:disable-next-line: max-line-length */}
      <path d="M17.485 17.512q-.281.281-.682.281t-.696-.268l-4.12-4.147-4.12 4.147q-.294.268-.696.268t-.682-.281-.281-.682.294-.669l4.12-4.147-4.12-4.147q-.294-.268-.294-.669t.281-.682.682-.281.696 .268l4.12 4.147 4.12-4.147q.294-.268.696-.268t.682.281 .281.669-.294.682l-4.12 4.147 4.12 4.147q.294.268 .294.669t-.281.682zM22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0z" />
    </SvgIcon>
  );
}

const StyledTreeItem = styled((props) => <TreeItem {...props} />)(
  ({ theme }) => ({
    [`& .${treeItemClasses.iconContainer}`]: {
      "& .close": {
        opacity: 0.3,
      },
    },
    [`& .${treeItemClasses.group}`]: {
      // marginLeft: 15,
      // paddingLeft: 18,
      borderLeft: `1px dashed ${alpha(theme.palette.text.primary, 0.4)}`,
    },
  })
);

const Units = (props) => {
  const { units, getTreeUnits, treeUnits, deleteUnit } = props;
  const [expandedNodes, setExpandedNodes] = useState([]);
  const [selectedNode, setSelectedNode] = useState("");
  const [hoveredNode, setHoveredNode] = useState("");
  const [parentUnit, setParentUnit] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [showUnitForm, setShowUnitForm] = useState(false);

  const [confirmRemoveUnit, setConfirmRemoveUnit] = useState(false);
  const [unitToBeRemoved, setUnitToBeRemoved] = useState(null);

  const handleToggleNode = (event, nodeIds) => {
    setExpandedNodes(nodeIds);
  };

  const handleSelectNode = (event, nodeId) => {
    setSelectedNode(nodeId);
  };
  const handleAddUnitDialog = (event, node) => {
    setParentUnit(node);
    setShowUnitForm(true);
    setSelectedUnit("");
    setIsEditing(false);
    event.stopPropagation();
  };
  //handleEditUnitDialog
  const handleEditUnitDialog = (event, node) => {
    setSelectedUnit(node);
    setIsEditing(true);
    setParentUnit("");
    setShowUnitForm(true);

    event.stopPropagation();
  };

  useEffect(
    () => {
      getTreeUnits(setExpandedNodes);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const labelClicked = useCallback((event, unitId) => {
    setSelectedNode(unitId);
    event.stopPropagation();
  }, []);

  const renderTree = (node) => (
    <StyledTreeItem
      style={{ padding: "0" }}
      key={node.unitId}
      nodeId={node.unitId}
      label={
        <span
          onMouseOut={() => setHoveredNode("")}
          onMouseOver={() => setHoveredNode(node.unitId)}
          onClick={(e) => labelClicked(e, node.unitId)}
          className="d-flex justify-content-between  align-items-center"
          style={{ maxWidth: "100%" }}
        >
          <span
            className={`d-block text-truncate ${
              selectedNode !== node.unitId && "add-padding"
            }`}
            style={{ maxWidth: "70%" }}
          >
            <Tooltip title={node.unitName}>
              <span
              className="mr-2"
                style={{
                  cursor: "default",
                }}
              >
                {" "}
                {node.unitName}
              </span>
            </Tooltip>
            { !node.isOnStructure && <Chip label="Not on structure" color="error" size="small" variant="outlined" />}
          </span>

          <span
            className={`${
              selectedNode === node.unitId || hoveredNode === node.unitId
                ? "d-block"
                : "d-none"
            }`}
          >
            <IconButton
              color="success"
              onClick={(e) => handleAddUnitDialog(e, node)}
              size="small"
              className=""
            >
              <span className="material-icons">add_box</span>
            </IconButton>
            <IconButton
              color="primary"
              size="small"
              onClick={(e) => handleEditUnitDialog(e, node)}
              className=" "
            >
              <span className="material-icons">edit</span>
            </IconButton>
            <IconButton
              color="error"
              size="small"
              onClick={() => {
                setUnitToBeRemoved(node);
                setConfirmRemoveUnit(true);
              }}
              className=" mr-2"
            >
              <span className="material-icons">delete</span>
            </IconButton>
          </span>
        </span>
      }
    >
      {Array.isArray(node.children)
        ? node.children.map((childNode) => renderTree(childNode))
        : null}
    </StyledTreeItem>
  );

  return (
    <>
      {!isEmpty(treeUnits) && (
        <div
          style={{
            height: "auto",
            maxHeight: "auto",
            margin: "1.5em",
            backgroundColor: "#fff",
            borderRadius: "0.5rem",
            overflow: "visible",
            boxShadow: "0 5px 5px 0 rgb(42 119 144 / 5%)",
            MozBoxShadow: "0 5px 5px 0 rgba(42,119,144,.05)",
          }}
        >
          <TreeView
            style={{
              padding: "1em",
              height: "auto",
              maxHeight: "78vh",
              overflow: "auto",
            }}
            defaultCollapseIcon={<MinusSquare />}
            defaultExpandIcon={<PlusSquare />}
            defaultEndIcon={<CloseSquare />}
            expanded={expandedNodes}
            selected={selectedNode}
            onNodeToggle={handleToggleNode}
            onNodeSelect={handleSelectNode}
          >
            {renderTree(treeUnits)}
          </TreeView>

          {showUnitForm && (
            <AddOrUpdateUnitDialog
              parentUnit={parentUnit}
              selectedUnit={selectedUnit}
              setIsEditing={setIsEditing}
              showUnitForm={showUnitForm}
              setShowUnitForm={setShowUnitForm}
              setExpandedNodes={setExpandedNodes}
              isEditing={isEditing}
              units={units}
            />
          )}
          {confirmRemoveUnit && (
            <ConfirmationDialog
              confirmationDialog={confirmRemoveUnit}
              message={`Are you sure you want to remove this unit @${unitToBeRemoved.unitName}?`}
              setConfirmationDialog={setConfirmRemoveUnit}
              onYes={() => {
                deleteUnit(
                  unitToBeRemoved,
                  setConfirmRemoveUnit,
                  setUnitToBeRemoved,
                  setExpandedNodes,
                  units
                );
              }}
            />
          )}
        </div>
      )}
    </>
  );
};

const mapStateToProps = ({ user, loading, units, treeUnits }) => {
  return { user, units, treeUnits, loading };
};
export default connect(mapStateToProps, { getTreeUnits, deleteUnit })(Units);
