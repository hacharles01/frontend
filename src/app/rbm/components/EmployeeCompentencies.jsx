import {
  Tooltip,
  Card,
  CardContent,
  CardHeader,
  Dialog,
  DialogTitle,
  IconButton,
  DialogActions,
  DialogContent,
  Divider,
  Badge,
  MenuItem,
  Avatar,
  Menu,
  CircularProgress,
  Typography,
  Chip,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Checkbox,
  ListItemText,
  Alert,
  CardActions,
  Button,
} from "@mui/material";
import moment from "moment";
import { useHistory, useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { connect, useDispatch } from "react-redux";
import {
  getCompetenciesDescriptors,
  saveCompetenciesEvaluations,
} from "../../../store/rbm/actions";
import Paper from "@mui/material/Paper";
import { Box } from "@mui/system";
import showLoading from "../../assets/loading.gif";

const EmployeeCompentencies = (props) => {
  const {
    competenciesDescriptors,
    onSaveCompetenciesEvaluations,
    employee,
    loading,
    competenciesApproved,
  } = props;

  const getCompetencyScore = (competencyId) => {
    let score = 0;

    competenciesDescriptors.forEach((competency) => {
      competency.descriptors.forEach((descriptor) => {
        if (
          !!descriptor.isAdded &&
          descriptor.competencyId === competencyId &&
          !!descriptor.approved
        )
          score = score + descriptor.score * 10;
      });
    });

    return score * 0.9;
  };

  const [canEvaluate, setCanEvaluate] = useState(false);

  useEffect(() => {
    const curDate = moment().format("MM-DD");

    if (curDate >= "04-01" && curDate <= "07-31") setCanEvaluate(true);
  }, []);

  return (
    <>
      <Card
        className=" "
        variant="outlined"
        style={{ backgroundColor: "#f6f8fa" }}
      >
        <CardContent className="px-0 px-md-4">
          <div className="row">
            {competenciesDescriptors.map((competency, index) => (
              <div className="col-3" key={index}>
                <Card
                  variant="outlined"
                  style={{
                    border: "1px solid #bcc0c5",
                  }}
                  className={`mb-3 `}
                >
                  <CardHeader
                    style={{
                      backgroundColor: "#d6d9dc",
                    }}
                    avatar={
                      <Tooltip title="Quarter Score">
                        <Box
                          sx={{
                            position: "relative",
                            display: "inline-flex",
                            cursor: "default",
                          }}
                        >
                          {!!competenciesApproved && (
                            <CircularProgress
                              className={`text-${
                                getCompetencyScore(competency.id) < 50
                                  ? "danger"
                                  : getCompetencyScore(competency.id) < 70
                                  ? "warning"
                                  : getCompetencyScore(competency.id) < 100
                                  ? "info"
                                  : "success"
                              }`}
                              variant="determinate"
                              value={getCompetencyScore(competency.id)}
                            />
                          )}

                          <Box
                            sx={{
                              top: 0,
                              left: 0,
                              bottom: 0,
                              right: 0,
                              position: "absolute",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Typography
                              variant="caption"
                              component="div"
                              style={{ fontSize: "7px" }}
                              color="text.secondary"
                              className={`text-${
                                getCompetencyScore(competency.id) < 50
                                  ? "danger"
                                  : getCompetencyScore(competency.id) < 70
                                  ? "warning"
                                  : getCompetencyScore(competency.id) < 100
                                  ? "info"
                                  : "success"
                              }`}
                            >
                              {!!competenciesApproved && (
                                <>{`${getCompetencyScore(competency.id)}%`}</>
                              )}
                              {!competenciesApproved && <span>-</span>}
                            </Typography>
                          </Box>
                        </Box>
                      </Tooltip>
                    }
                    title={
                      <span className="d-flex">
                        <strong
                          style={{
                            backgroundColor: ``,
                          }}
                          className={`text-primary mr-1`}
                        >
                          {competency.name}
                        </strong>
                      </span>
                    }
                  />

                  <CardContent
                    style={{ paddingLeft: "5%", paddingRight: "5%" }}
                  >
                    <List dense>
                      {!!competency.descriptors &&
                        competency.descriptors.map((descriptor, index) => (
                          <ListItem key={index}>
                            <ListItemIcon>
                              <Checkbox
                                disabled={loading}
                                edge="start"
                                checked={descriptor.isAdded}
                                tabIndex={-1}
                                onChange={(e) => {
                                  onSaveCompetenciesEvaluations({
                                    competencyId: descriptor.competencyId,
                                    employeeId: employee.id,
                                    competencyDescriptorId: descriptor.id,
                                    score: descriptor.score,
                                    value: e.target.checked,
                                  });
                                }}
                              />
                            </ListItemIcon>
                            <ListItemText
                              id={index}
                              primary={descriptor.name}
                            />
                          </ListItem>
                        ))}
                    </List>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
          {/* {!!loading && competenciesDescriptors.lengh === 0 && (
            <div className="text-center">
              <img
                src={require("../../assets/loading.gif")}
                height="128"
                alt="loading"
              />
            </div>
          )} */}
        </CardContent>
      </Card>
    </>
  );
};

const mapStateToProps = ({ loading }) => {
  return {
    loading,
  };
};
export default connect(mapStateToProps)(EmployeeCompentencies);
