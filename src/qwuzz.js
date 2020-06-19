import randFromArray from './randFromArray';
import shuffle from './shuffle';
import QuestionPrototype from './questionPrototype';

class Qwuzz {

    /**
     * 
     * @param {array} data 
     * @param {QuestionPrototype[]} questionPrototypes 
     */
	constructor(data, questionPrototypes = []) {
		this.data = data.map((record, i) => ({
			_id: i,
			...record,
        }));
        this.questionPrototypes = questionPrototypes.map(q => {
            if (!q instanceof QuestionPrototype) {
                throw new Error(`All question prototypes must be instances of QuestionPrototype`);
            }
            return q;
        })
	}

    /**
     * 
     * @param {QuestionPrototype} rawQuestionPrototype 
     * @param {object} answer 
     * @return {object}
     */
	generateQuestion(rawQuestionPrototype = null, answer = null) {
        const [questionPrototype, chosenAnswer] = this.getQuestionAndAnswer(rawQuestionPrototype, answer);
		const peers = this.data.filter(record => {
			return questionPrototype.appliesTo(record) && record._id !== chosenAnswer._id;
        });
        
        questionPrototype
            .setAnswer(chosenAnswer)
            .setPeers(peers)
            .init();
            
		const generatedQuestion = questionPrototype.createQuestion();
        let q = {
			question: null,
			data: {},
        };
        
		if (typeof generatedQuestion === 'string') {
			q.question = generatedQuestion;
		} else if (typeof generatedQuestion === 'object') {
			q = {
				...q,
				...generatedQuestion,
			};
		} else {
			throw new Error(`createQuestion() must return an object or string`);
		}

		const choices = questionPrototype.createChoices();
		const answerIndex = choices.findIndex((_, i) => (
			questionPrototype.isCorrect(choices, i)
        ));
        
		return {
            question: q.question,
            choices,
            answer: answerIndex,
            ...q.data
        };
    }

    /**
     * 
     * @param {QuestionPrototype} rawQuestionPrototype 
     * @param {object} answer 
     * @return {array}
     */
    getQuestionAndAnswer(rawQuestionPrototype, answer) {
        let chosenAnswer;
        let questionPrototype;
        
        if (!rawQuestionPrototype && !this.questionPrototypes.length) {
            throw new Error(`No question prototype provided and no prototypes loaded to choose from`);
        }
        if (!answer && !this.data.length) {
            throw new Error(`No answer provided and no dataset loaded to choose from`);
        }
        if (rawQuestionPrototype && !rawQuestionPrototype instanceof QuestionPrototype) {
            throw new Error(`Question prototypes must be instances of QuestionPrototype`);
        }

        if(!answer && !questionPrototype) {
            const elligibleQuestions = this.questionPrototypes.filter(q => {
                return this.data.some(record => q.appliesTo(record));
            });

            questionPrototype = randFromArray(elligibleQuestions);
            
            const elligibleAnswers = this.data.filter(record => {
                return questionPrototype.appliesTo(record);
            });
            
            chosenAnswer = randFromArray(elligibleAnswers);
        } else if(rawQuestionPrototype && !answer) {
            const elligibleAnswers = this.data.filter(record => {

                return questionPrototype.appliesTo(record);
            });
            if (!elligibleAnswers.length) {
                throw new Error(`The provided question prototype doesn't apply to any records`);
            }

            chosenAnswer = randFromArray(elligibleAnswers);
            questionPrototype = rawQuestionPrototype;

        } else if(!rawQuestionPrototype && answer) {            
            const elligibleQuestions = this.questionPrototypes.filter(q => {
                return q.appliesTo(answer);
            });
            if (!elligibleQuestions.length) {
                throw new Error(`The provided answer isn't compatible with any questions`);
            }
            questionPrototype = randFromArray(elligibleQuestions);
            chosenAnswer = answer;
        } else if(rawQuestionPrototype && answer) {
            if (!rawQuestionPrototype.appliesTo(answer)) {
                throw new Error(`The provided question prototype isn't compatible with the provided answer`);
            }
            questionPrototype = rawQuestionPrototype;
            chosenAnswer = answer;
        }

        return [questionPrototype, chosenAnswer];
    }

    /**
     * 
     * @param {number} questions 
     * @return {array}
     */
    generateQuiz(questions = 10) {
        const answers = shuffle(this.data).slice(0, questions);
        if (answers.length < questions) {
            throw new Error(`Asked for ${questions} questions, but there are only ${answers.length} questions.`);
        }

        const quiz = answers.map(answer => {
            return this.generateQuestion(null, answer);
        })

        return quiz;
    }
    
}

export default Qwuzz;
