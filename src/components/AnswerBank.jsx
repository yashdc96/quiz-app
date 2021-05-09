import {
  Grid,
  Paper,
  Select,
  Button,
  MenuItem,
  Typography,
  InputLabel,
  FormControl,
} from "@material-ui/core";
import { React, useState, useEffect } from "react";
import { createMarkup } from "../helpers";
import AnswerConfirmation from "./AnswerConfirmation";
import Results from "./Results";
import AccessAlarmIcon from '@material-ui/icons/AccessAlarm';

const AnswerBank = ({
  classes,
  quizData,
  resetQuiz,
  currentQuizStep,
  setCurrentQuizStep,
  questionCount,
  setQuestionCount,
  setCorrectCounter,
  correctCounter,
}) => {
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [processedAnswers, setProcessedAnswers] = useState([]);
  const [time, setTime] = useState({});

  const startTimer = () => {
    const countDownTime = Date.now() + 12000;
    const interval = setInterval(() => {
      const now = new Date();
      const distance = countDownTime - now
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      if (distance < 0) {
        clearInterval(interval);
        setTime({ seconds: 0 })
      } else {
        setTime({ seconds: seconds })
      }
    }, 1000)
  }

  const handleResult = (e) => {
    e.preventDefault();
    handleCount();
    const processedAnswers = selectedAnswers.map(({ answer, question }) => {
      const relatedQuestion = quizData.find(
        (category) => category.question === question
      );
      if (relatedQuestion.correct_answer === answer) {
        return { correctAnswer: answer, isCorrect: true, question };
      }
      return {
        correctAnswer: relatedQuestion.correct_answer,
        wrongAnswer: answer,
        isCorrect: false,
        question,
      };
    });
    counter(processedAnswers);
    setProcessedAnswers(processedAnswers);
  };

  const counter = (answer) => {
    if (answer[0].isCorrect) {
      setCorrectCounter((correctCounter) => correctCounter + 1);
    }
  }


  const handleAnswerChange = (e, selectedQuestion) => {
    e.preventDefault();
    const { value } = e.target;

    const isExistQuestion =
      selectedAnswers.length &&
      selectedAnswers.find((answer) => answer.question === selectedQuestion);

    if (isExistQuestion && isExistQuestion.answer) {
      const updatedAnswers = selectedAnswers.map((answer) => {
        if (answer.question === selectedQuestion) {
          return { question: selectedQuestion, answer: value };
        }
        return answer;
      });
      setSelectedAnswers(updatedAnswers);
    } else {
      setSelectedAnswers([
        ...selectedAnswers,
        { question: selectedQuestion, answer: value },
      ]);
    }
  };

  const relatedAnswer = (question, selectedAnswers) => {
    if (selectedAnswers && selectedAnswers.length) {
      const relatedQuestion = selectedAnswers.find(
        (answer) => answer.question === question
      );
      return (relatedQuestion && relatedQuestion.answer) || "";
    }
    return "";
  };

  const handleCount = () => {
    setQuestionCount(questionCount + 1);
  };

  useEffect(() => {
    window.scrollTo(0, "20px");
    startTimer();
  }, []);

  return !processedAnswers || !processedAnswers.length ? (
    <>
        {time.seconds === 0 && resetQuiz()}
      <Typography variant="h1" className={classes.mainTitle}>
        Question: {questionCount + 1}
      </Typography>
         <AccessAlarmIcon className={classes.icon} color="primary" /> <span className={classes.time}> : {time.seconds} </span>
      <form onSubmit={handleResult}>
        <Grid container spacing={4}>
          <Grid item xs={12}>

            <Paper key={quizData[questionCount].question} className={classes.paper}>
              <Typography variant="h5" className={classes.question}>
                <span> {quizData[questionCount].question} </span>
              </Typography>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="answer-select-label">
                  Select answer:
                    </InputLabel>
                <Select
                  required
                  name="answer"
                  id="answer-select"
                  label="Select answer"
                  value={relatedAnswer(quizData[questionCount].question, selectedAnswers) || ""}
                  labelId="answer-select-label"
                  onChange={(e) => handleAnswerChange(e, quizData[questionCount].question)}
                >
                  {quizData[questionCount].answers.map((answer) => (
                    <MenuItem key={answer} value={answer}>
                      <span dangerouslySetInnerHTML={createMarkup(answer)} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Paper>

            <Button
              className={classes.submitButton}
              variant="contained"
              color="primary"
              type="submit"
            >
              Result
              </Button>
          </Grid>
        </Grid>
      </form>
    </>
  ) : (<>
    {questionCount <= 10 && quizData.length && (
      <>
        <AnswerConfirmation
          classes={classes}
          resetQuiz={resetQuiz}
          quizData={quizData}
          currentQuizStep={currentQuizStep}
          setCurrentQuizStep={setCurrentQuizStep}
          questionCount={questionCount}
          setQuestionCount={setQuestionCount}
          processedAnswers={processedAnswers}
          setCorrectCounter={setCorrectCounter}
          handleCount={handleCount}
        />
      </>
    )}

    {questionCount > 10 && (
      <>
        <Results
          classes={classes}
          resetQuiz={resetQuiz}
          currentQuizStep={currentQuizStep}
          setCurrentQuizStep={setCurrentQuizStep}
          correctCounter={correctCounter}
        />
      </>
    )}
  </>
    );
};

export default AnswerBank;