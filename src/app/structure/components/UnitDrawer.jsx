import React, { useState, useEffect } from "react";
import SvgIcon from "@mui/material/SvgIcon";
import Drawer from "@mui/material/Drawer";
import Divider from "@mui/material/Divider";
import TreeView from "@mui/lab/TreeView";
import TreeItem, { treeItemClasses } from "@mui/lab/TreeItem";
import { isMobile } from "react-device-detect";
import SearchBox from "./SearchBox";
import { alpha, styled } from "@mui/material/styles";
import {
  getTreeUnits,
  setSelectedUnit,
  setSearchUnit,
} from "../../../store/structure/actions";
import { Tooltip,Chip } from "@mui/material";
import { connect } from "react-redux";
import { isEmpty } from "lodash";

const marginTop = 119;

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

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

const UnitDrawer = (props) => {
  const {
    drawer,
    open,
    units,
    treeUnits,
    getTreeUnits,
    setSelectedUnit,
    setSearchUnit,
  } = props;
  const [expandedNodes, setExpandedNodes] = useState([]);
  const [selectedNode, setSelectedNode] = useState("");

  useEffect(
    () => {
      setSelectedUnit("");
      getTreeUnits(setExpandedNodes);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const handleToggleNode = (event, nodeIds) => {
    setExpandedNodes(nodeIds);
  };

  const handleSelectNode = (event, nodeId) => {
    setSelectedNode(nodeId);
  };

  const labelClicked = (event, node) => {
    setSelectedUnit(node);
    setSelectedNode(node.unitId);
    event.stopPropagation();
  };
  const onSearch = (term) => {
    setTimeout(() => {
      setSearchUnit(term, units, setExpandedNodes);
    }, 200);
  };

  const renderTree = (node) => (
    <StyledTreeItem
      style={{ padding: "0" }}
      key={node.unitId}
      nodeId={node.unitId}
      label={
        <span
          onClick={(e) => labelClicked(e, node)}
          className="d-flex justify-content-between  align-items-center"
          style={{ maxWidth: "100%" }}
        >
          <span
            className={`d-block text-truncate ${
              selectedNode !== node.unitId && "add-padding"
            }`}
            style={{ maxWidth: "100%" }}
          >
            <Tooltip title={node.unitName}>
              <span className="mr-2"
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
      <Drawer
        elevation={isMobile ? 1 : 0}
        sx={{
          marginTop: `${isMobile ? 0 : marginTop}px`,

          width: drawer,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            marginTop: `${isMobile ? 0 : marginTop}px`,
            width: drawer,
            boxSizing: "border-box",
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <SearchBox
            placeholder="Search…"
            onSearch={onSearch}
          />
        </DrawerHeader>
        <Divider />
        {!isEmpty(treeUnits) && (
          <TreeView
            style={{
              padding: "1em",
              height: "auto",
              maxHeight: "78vh",
              overflow: "auto",
              cursor:'pointer'
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
        )}
      </Drawer>
    </>
  );
};

const mapStateToProps = ({ treeUnits, units }) => {
  return { treeUnits, units };
};

export default connect(mapStateToProps, {
  getTreeUnits,
  setSelectedUnit,
  setSearchUnit,
})(UnitDrawer);
