# Qwuzz.js

A Javascript library for generating quizzes based on data sets.

## Usage

Start with some data
```js
const data = [
    { "state": "Maine", "capital": "Augusta" },
    { "state": "New Hampshire", "capital": "Concord" },
    { "state": "Texas", "capital": "Austin" },
    { "state": "Washington", "capital": "Olympia" },
    { "state": "Vermont", "capital": "Montpelier" },
    { "state": "Florida", "capital": "Talahassee" },
];
```

Then, create some question types. Each must provide the following functions:
* `createQuestion(): string`
* `createChoices(): string[]`
* `isCorrect(): bool`

The answer to the question is provided in `this.answer`.

```js
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
```

Then, generate your quiz:

```js
const quiz = new Qwuzz(data, questions);
console.log(quiz.generateQuiz(3));

[ 
    { 
        question: 'What is the capital of Washington?',
        choices: [ 'Concord', 'Olympia', 'Augusta', 'Austin' ],
        answer: 1 
    },
    {
        question: 'New Hampshire\'s capital is Concord',
        choices: [ 'True', 'False' ],
        answer: 0 
    },
    { 
        question: 'Austin is the capital of Texas',
        choices: [ 'True', 'False' ],
        answer: 0 
    }
]
```