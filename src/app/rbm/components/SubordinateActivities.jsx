import { Button, Card, CardActions, CardContent } from "@mui/material";
import React, { useEffect } from "react";
import { useState } from "react";
// import showLoading from "../../assets/loading.gif";

import EvaluationQuarterCard from "./EvaluationQuarterCard";

const SubordinateActivities = (props) => {
  const { subordinateActivities, loading } = props;

  const [allActivities, setAllActivities] = useState(0);

  useEffect(() => {
    let allActivities = 0;
    subordinateActivities.forEach((myActivity) => {
      myActivity.activities.forEach((activity) => {
        allActivities = ++allActivities;
      });
    });

    setAllActivities(allActivities);
  }, [subordinateActivities]);

  return (
    <>
      <Card
        className=" "
        variant="outlined"
        style={{ backgroundColor: "#f6f8fa" }}
      >
        <CardContent className="px-0 px-md-4">
          {subordinateActivities.map((quarter, index) => (
            <EvaluationQuarterCard
              totalWeight={0}
              quarter={quarter}
              key={quarter.quarterId}
            />
          ))}
          {allActivities === 0 && loading && (
            <div className="text-center">
              <img
                src={require("../../assets/loading.gif")}
                height="128"
                alt="loading"
              />
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default SubordinateActivities;
