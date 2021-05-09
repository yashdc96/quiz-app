import { useState, useEffect } from "react";
import { Grid, Paper, Select, Button, MenuItem, Container, Typography, InputLabel, FormControl } from "@material-ui/core";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import { styles, difficulties } from "../helpers";
import AnswerBank from "./AnswerBank";

const useStyles = makeStyles((theme) => {
    return styles;
});

const DifficultyOptions = () => {
    const [difficulty, setDifficulty] = useState({ id: "", name: "" });
    const [quizData, setQuizData] = useState([]);
    const classes = useStyles();
    const [currentQuizStep, setCurrentQuizStep] = useState("start");
    const [questionCount, setQuestionCount] = useState(-1);
    const [correctCounter, setCorrectCounter] = useState(null);

    const fetchQuizData = async () => {
        try {
            const url = `https://opentdb.com/api.php?amount=10&category=18&difficulty=${difficulty.name.toLowerCase()}`;
            const { data } = await axios.get(url);

            const getCategory = data.results.map((cat) => {

                const incorrectAnswersIndexes = cat.incorrect_answers.length;
                const randomIndex = Math.round(
                    Math.random() * (incorrectAnswersIndexes - 0) + 0
                );

                cat.incorrect_answers.splice(randomIndex, 0, cat.correct_answer);

                return {
                    ...cat,
                    answers: cat.incorrect_answers,
                };
            });

            setQuizData(getCategory);
            setCurrentQuizStep("results");
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        window.scrollTo(0, "20px");
    }, []);

    const startQuiz = () => {
        setQuestionCount(0);
        setCorrectCounter(0);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (quizData.length === 0 && difficulty) {
            fetchQuizData();
            startQuiz();
        }
    };


    const handleDifficultyChange = (e) => {
        e.preventDefault();
        const selectedDifficulty = difficulties.find(
            (diff) => diff.id === e.target.value
        );
        setDifficulty(selectedDifficulty);
    };

    const resetQuiz = (time) => {
        setQuizData([]);
        setCorrectCounter(0);
        setDifficulty("");
        setCurrentQuizStep("start");
        setQuestionCount(-1);
        window.scrollTo(0, "20px");
        if(time===0){
            alert("You ran out of time!")
        }
    };


    return (
        <Container>
            <Paper className={classes.paper}>
                {currentQuizStep === "start" && (
                    <>
                        <Typography variant="h1" className={classes.title}>
                            Computer Science Quiz
                        </Typography>
                        <Typography variant="h6" className={classes.mainTitle}>
                            Choose your difficulty:
                        </Typography>
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={4}>
                                <Grid item xs={12}>
                                    <FormControl fullWidth variant="outlined">
                                        <InputLabel id="difficulty-select-label">
                                            Select Difficulty:
                                        </InputLabel>
                                        <Select
                                            required
                                            name="difficulty"
                                            value={difficulty.id || ""}
                                            id="difficulty-select"
                                            label="Select Difficulty"
                                            labelId="difficulty-select-label"
                                            onChange={handleDifficultyChange}
                                        >
                                            {difficulties.map((difficulty) => (
                                                <MenuItem key={difficulty.id} value={difficulty.id}>
                                                    {difficulty.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <Button
                                className={classes.submitButton}
                                type="submit"
                                variant="contained"
                                color="primary"
                            >
                                Submit
                            </Button>
                        </form>
                    </>
                )} {questionCount > -1 && quizData.length && (
                    <AnswerBank
                        classes={classes}
                        quizData={quizData}
                        resetQuiz={resetQuiz}
                        currentQuizStep={currentQuizStep}
                        setCurrentQuizStep={setCurrentQuizStep}
                        questionCount={questionCount}
                        setQuestionCount={setQuestionCount}
                        setCorrectCounter={setCorrectCounter}
                        correctCounter={correctCounter}
                    />
                )}
            </Paper>
        </Container>
    );
};

export default DifficultyOptions;