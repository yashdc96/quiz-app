import { Button, Typography } from "@material-ui/core";
import { useEffect } from "react";

const Results = ({
  classes,
  resetQuiz,
  currentQuizStep,
  correctCounter,
}) => {
  useEffect(() => {
    window.scrollTo(0, "20px");
  }, []);
  return currentQuizStep === "results" ? (
    <div className={classes.results}>
      <Typography variant="h1" className={classes.title}>
        Results
      </Typography>
      <Typography variant="h4" className={classes.mainTitle2}>
        You have answered {correctCounter} questions correctly.
      </Typography>
      <Button
        onClick={resetQuiz}
        className={classes.submitButton}
        variant="contained"
        color="primary"
      >
        Reset
      </Button>
    </div>
  ):(<> Error </>);
};

export default Results;