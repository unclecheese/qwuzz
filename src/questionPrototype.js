import shuffle from './shuffle';
import randFromArray from './randFromArray';

const defaults = {
	appliesTo() { return true; },
	createQuestion() { return `No question` },
	createChoices() { return []; },
    isCorrect() { return false; },
    init() {},
    _id: null,
};


const defaultFilter = () => true;

class QuestionPrototype {

    /**
     * 
     * @param {object} prototype 
     */
    constructor(prototype) {
        const model = {
            ...defaults,
            ...prototype,
        };
        
        this.shuffle = shuffle;
        this.randFromArray = randFromArray;
        this.peers = [];
        this.data = [];
        this.answer = {};
        
        this.createQuestion = model.createQuestion.bind(this);
        this.createChoices = model.createChoices.bind(this);
        this.isCorrect = model.isCorrect.bind(this);
        this.appliesTo = model.appliesTo.bind(this);
        this.init = model.init.bind(this);
    }


    /**
     * 
     * @param {object} answer 
     * @return {QuestionPrototype}
     */
    setAnswer(answer) {
        this.answer = answer;

        return this;
    }

    /**
     * 
     * @param {array} peers 
     * @return {QuestionPrototype}
     */
    setPeers(peers) {
        this.peers = peers;

        return this;
    }

    /**
     * @return {number}
     */
    coinFlip() {
        return this.randFromArray([0, 1]);
    }

    /**
     * 
     * @param {nu,ber} count 
     * @param {function} filter 
     * @return {array}
     */
    pickPeers(count, filter = defaultFilter) {
        return this.shuffle(this.peers.filter(filter)).slice(0, count);
    }

    /**
     * 
     * @param {function} filter 
     * @return {object}
     */
    pickPeer(filter = defaultFilter) {
        return this.shuffle(this.peers.filter(filter))[0];
    }

    /**
     * 
     * @param {string} field 
     * @param {number} count 
     * @return {array}
     */
    distinctColumnSelect(field, count) {
        const shuffled = this.shuffle(this.peers);
        const set = new Set();
        shuffled.some(data => {
            if (data[field]) {
                if (Array.isArray(data[field])) {
                    set.add(data[field].join(', '));
                } else if (['function', 'object'].includes(typeof data[field])) {
                    throw new Error(`Illegal non-scalar type in field ${field}`);
                } else {
                    set.add(data[field]);	
                }
            }
            return set.size === count;
        });
        return [...set];
    }
    
    /**
     * 
     * @param {string} field 
     * @param {number} count 
     * @return {array}
     */
    multipleChoiceOf(field, count = 3) {
        const incorrectChoices = this.distinctColumnSelect(field, count);
        return this.shuffle([
            ...incorrectChoices,
            this.answer[field],
        ]);
    }        
}

export default QuestionPrototype;