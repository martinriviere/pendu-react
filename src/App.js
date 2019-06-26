import React from 'react';
import './App.css';
import PropTypes from 'prop-types'

const ALPHABET = ('ABCDEFGHIJKLMNOPQRSTUVWXYZ').split("")
const MOTS = ["CHEVAL", "TROUVAILLE", "BOUDIN", "POMME", "GAZON", "TRAVAIL", "MARMITON", 
    "PRAIRIE", "TRIGONOMETRIE", "CHASSEUR", "RATATOUILLE", "CHENILLE", "CACAHUETE", "MENINGITE"]

const Key = ({ letter, feedback, click }) => (
    <div className={`key ${feedback}`} onClick={() => click(letter, feedback)}>
        <span>
          {letter}
        </span>
    </div>
)

Key.propTypes = {
    letter: PropTypes.string.isRequired,
    feedback: PropTypes.oneOf(["used", false]).isRequired,
    click: PropTypes.func.isRequired
}

const Word = ({ word }) => (
    <div className="word">
        {word.map((letter, index) => (
            <div className="letter" key={index}>
                <span>{letter}</span>
            </div>   
        ))}
    </div>
)

Word.propTypes = {
    word: PropTypes.arrayOf(PropTypes.string).isRequired
}

const Score = ({ score }) => (
    <span className="score">Score : {score}</span>
)

Score.propTypes = {
    score: PropTypes.number.isRequired
}

class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            word: this.generateWord(),
            usedLetters: [],
            score: 0,
            badKey: false
        }
    }

    generateWord() {
        const word = MOTS[Math.floor(Math.random() * MOTS.length)]
        //const result = word.split("")
        const result = word
        return result
    }

    getFeedback = (letter) => {
        const { usedLetters } = this.state
        return usedLetters.includes(letter)
    }

    computeDisplay(phrase, usedLetters) {
        return phrase.replace(/\w/g,
          (letter) => (usedLetters.includes(letter) ? letter : "_")
        )
    }

    newGame() {
        this.setState({
            word: this.generateWord(),
            usedLetters: [],
            score: 0,
            badKey: false
        })
    }

    componentDidMount() {
        document.addEventListener("keypress", e => this.handleClick(String.fromCharCode(e.charCode).toUpperCase()))
    }

    componentWillUnmount() {
        document.removeEventListener("keypress", e => this.handleClick(String.fromCharCode(e.charCode).toUpperCase()))
    }

    handleClick = (letter) => {
        const { word, usedLetters, score } = this.state
        if (!(ALPHABET.includes(letter))) {
            this.setState({ badKey: true })
        } else if (usedLetters.includes(letter)) {
            return
        } else {
            let newScore
            word.includes(letter) ? newScore = 2 : newScore = -1
            this.setState({ usedLetters: [...usedLetters, letter], score: score + newScore, badKey: false })
            return
        }
    }

    render() {
        const { word, usedLetters, score, badKey } = this.state
        const wordToFind = this.computeDisplay(word, usedLetters).split("")
        const won = !(wordToFind.includes("_"))
        return (
            <div className="container">
                <Word word={wordToFind} />
                <Score score={score} />
                <button className="newGame" onClick={() => this.newGame()}>Nouveau jeu</button>
                <div className="keyboard">
                    {ALPHABET.map((letter, index) => (
                        <Key letter={letter} feedback={this.getFeedback(letter) && "used"} key={index} click={this.handleClick} />
                    ))}
                </div>
                <p className="badKey">{badKey && `Vous avez tapé sur une touche non autorisée. Seules les lettres, non accentuées, sont autorisées.`}</p>
                <p className="win">{won && `C'est trouvé !`}</p>
            </div>
        )
    }
}

export default App;
