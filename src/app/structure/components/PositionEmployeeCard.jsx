import * as React from "react";
import {
  Typography,
  ListItem,
  Divider,
  ListItemText,
  ListItemAvatar,
  Avatar,
} from "@mui/material";
const PositionEmployeeCard = (props) => {
  const { employee, index } = props;

  return (
    <>
      {index > 0 && <Divider variant="inset" component="li" />}

      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <Avatar
            style={{ border: "1px solid #d1cbcb" }}
            alt={employee.lastName}
            src={
                `data:image/jpeg;base64,${employee.profileImage}`
            }
          />
        </ListItemAvatar>
        <ListItemText
          primary={!!employee.employeeId ?employee.lastName + " " + employee.firstName:'Unknown'}
          secondary={
            <React.Fragment>
              <Typography
                sx={{ display: "inline" }}
                component="span"
                variant="body2"
                color="text.primary"
              >
               <strong>No:</strong> {!!employee.employeeId ? employee.employeeId : "N/A"}
              </Typography>
              {!!!employee.employeeId && (
                <span style={{color: 'red'}}>- Vacant</span>
              )}
            </React.Fragment>
          }
        />
      </ListItem>
    </>
  );
};

export default PositionEmployeeCard;
