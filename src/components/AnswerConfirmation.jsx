import { Paper, Button, Typography } from "@material-ui/core";
import { Check, Close } from "@material-ui/icons";
import { createMarkup } from "../helpers";
import AnswerBank from "./AnswerBank";
import { useState } from "react";

const AnswerConfirmation = ({ processedAnswers, classes, resetQuiz, quizData, currentQuizStep, setCurrentQuizStep, questionCount, handleCount, setCorrectCounter, setQuestionCount }) => {
  const [nextVal, setNextVal] = useState(false);


  const renderAnswers = (answers) => {
    return answers.map(
      ({ question, isCorrect, correctAnswer, wrongAnswer }) => (
        <Paper key={question} className={classes.paper}>
          <Typography variant="h2" className={classes.question}>
            <span dangerouslySetInnerHTML={createMarkup(question)} />
          </Typography>

          {isCorrect ? (
            <Typography
              variant="h2"
              className={`${classes.answer} ${classes.correctAnswer}`}
            >
              <Check />
              <span
                className={classes.answer}
                dangerouslySetInnerHTML={createMarkup(correctAnswer)}
              />
            </Typography>
          ) : (
              <>
                <Typography
                  variant="h3"
                  color="secondary"
                  className={classes.answer}
                >
                  <Close />
                  <span
                    className={classes.answer}
                    dangerouslySetInnerHTML={createMarkup(wrongAnswer)}
                  />
                </Typography>
                <Typography
                  variant="h3"
                  className={`${classes.answer} ${classes.correctAnswer}`}
                >
                  <Check />
                  <span
                    className={classes.answer}
                    dangerouslySetInnerHTML={createMarkup(correctAnswer)}
                  />
                </Typography>
              </>
            )}
        </Paper>
      )
    );
  };

  const handleNext = () => {
    setNextVal(!nextVal);
    if (questionCount === 10) {
      handleCount();
    }
  };

  return (
    <>
      { !nextVal && (
        <>
          <Typography variant="h1" className={classes.mainTitle}>
            Answers review:
      </Typography>
          {renderAnswers(processedAnswers)}
          <Button
            className={classes.submitButton}
            onClick={resetQuiz}
            variant="contained"
            color="primary"
          >
            Reset
          </Button>
          <Button
            className={classes.submitButton}
            onClick={handleNext}
            variant="contained"
            color="primary"
          >
            Next
      </Button> </>)}
      { nextVal && (
        <AnswerBank
          classes={classes}
          quizData={quizData}
          resetQuiz={resetQuiz}
          currentQuizStep={currentQuizStep}
          setCurrentQuizStep={setCurrentQuizStep}
          questionCount={questionCount}
          setQuestionCount={setQuestionCount}
          setCorrectCounter={setCorrectCounter}
        />
      )}
    </>
  );
};

export default AnswerConfirmation;