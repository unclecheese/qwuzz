require("@babel/register")({})

const Qwuzz = require('./src/qwuzz').default;
const QuestionPrototype = require('./src/questionPrototype').default;

const data = [
    { "state": "Maine", "capital": "Augusta" },
    { "state": "New Hampshire", "capital": "Concord" },
    { "state": "Texas", "capital": "Austin" },
    { "state": "Washington", "capital": "Olympia" },
    { "state": "Vermont", "capital": "Montpelier" },
    { "state": "Florida", "capital": "Talahassee" },
];

const questions = [
    new QuestionPrototype({
        _id: 'STATE_TO_CAPITAL',
        createQuestion() {
            return `What is the capital of ${this.answer.state}?`
        },
        createChoices() {
            return this.multipleChoiceOf('capital');
        },
        isCorrect(choices, i) {
            return choices.indexOf(this.answer.capital) === i;
        }
    }),
    new QuestionPrototype({
        _id: 'CAPITAL_TO_STATE',
        createQuestion() {
            return `What state is ${this.answer.capital} in?`
        },
        createChoices() {
            return this.multipleChoiceOf('state');
        },
        isCorrect(choices, i) {
            return choices.indexOf(this.answer.state) === i;
        }
    }),
    new QuestionPrototype({
        _id: 'TRUE_FALSE_CAPITAL_OF_STATE',
        init() {
            this.isTrue = this.coinFlip() === 1;
        },
        createQuestion() {
            return this.isTrue ?
                `${this.answer.capital} is the capital of ${this.answer.state}` :
                `${this.pickPeer().capital} is the capital of ${this.answer.state}`
        },
        createChoices() {
            return [`True`, `False`]
        },
        isCorrect(_, i) {
            return this.isTrue ? i === 0 : i === 1;
        }
    }),
    new QuestionPrototype({
        _id: 'TRUE_FALSE_STATE_OF_CAPITAL',
        init() {
            this.isTrue = this.coinFlip() === 1;
        },
        createQuestion() {
            return this.isTrue ?
                `${this.answer.state}'s capital is ${this.answer.capital}` :
                `${this.pickPeer().state}'s capital is ${this.answer.capital}`
        },
        createChoices() {
            return [`True`, `False`]
        },
        isCorrect(_, i) {
            return this.isTrue ? i === 0 : i === 1;
        }
    })

];

const quiz = new Qwuzz(data, questions);


console.log(quiz.generateQuiz(3));