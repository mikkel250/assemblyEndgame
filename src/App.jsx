import { useState } from "react";
import { languages } from "./assets/languages";
import clsx from "clsx";
import { getFarewellText, getRandomWord } from "./utils";
import Confetti from 'react-confetti';
import { useWindowSize } from "react-use";

export default function AssemblyEndgame() {
  // state values
  const [currentWord, setCurrentWord] = useState(() => getRandomWord());
  const [guessedLetters, setGuessedLetters] = useState([]);

  // derived values
  const numGuessesLeft = languages.length - 1;
  const wrongGuessCount = guessedLetters.filter(
    (letter) => !currentWord.includes(letter),
  ).length;
  const isGameWon = currentWord
    .split("")
    .every((letter) => guessedLetters.includes(letter));
  const isGameLost = wrongGuessCount >= numGuessesLeft;
  const isGameOver = isGameWon || isGameLost;
  const lastGuessedLetter = guessedLetters[guessedLetters.length - 1];
  const isLastGuessIncorrect =
    lastGuessedLetter && !currentWord.includes(lastGuessedLetter);

  // static values
  const alphabet = "abcdefghijklmnopqrstuvwxyz";
  const { width, height } = useWindowSize();

  function addGuessedLetter(newLetter) {
    setGuessedLetters((prevLetters) =>
      prevLetters.includes(newLetter)
        ? prevLetters
        : [...prevLetters, newLetter],
    );
  }

  function renderGameStatus() {
    if (!isGameOver && isLastGuessIncorrect) {
      const language = languages[wrongGuessCount - 1];
      const itemDown = getFarewellText(language.name);

      return <p className='farewell-message'>{itemDown} 🫡 </p>;
    } else if (!isGameOver) {
      return null;
    }
    if (isGameWon) {
      return (
        <>
          <h2>You Win!</h2>
          <p>Well Done! 🎉</p>
        </>
      );
    } else if (isGameLost) {
      return (
        <>
          <h2>Game Over!</h2>
          <p>You lose! Better start learning Assembly! 😭</p>
        </>
      );
    }
  }

  return (
    <main>
      {isGameWon && <Confetti width={width} height={height} recycle={false} numberOfPieces={1000}/>}
      <div className="sr-only" aria-live="polite">
        {isGameWon && <p>Congratulations! You Won! Press "New Game" to start again.</p>}
      </div>
      <header>
        <h1 className='title'>Assembly: Endgame</h1>
        <p className='description'>
          Guess the word in under 8 attempts to keep the programming world safe
          from Assembly!
        </p>
      </header>
      <section
        aria-live='polite'
        role='status'
        className={clsx("game-status ", {
          won: isGameWon,
          lost: isGameLost,
          farewell: !isGameOver && isLastGuessIncorrect,
        })}
      >
        {renderGameStatus()}
      </section>
      <section className='language-chips'>
        {languages.map((item, index) => (
          <span
            key={item.name}
            className={clsx("chip ", {
              lost: index < wrongGuessCount,
            })}
            style={{ color: item.color, backgroundColor: item.backgroundColor }}
          >
            {item.name}
          </span>
        ))}
      </section>
      <section className='word'>
        {currentWord.split("").map((letter, index) => {
          const guessed = guessedLetters.includes(letter);
          const inWord = currentWord.includes(letter);
          if (isGameLost) {
            return (
              <span key={index} className={clsx('letter', {
                guessed: guessed && inWord,
              })}>
              {inWord && letter.toUpperCase()}
            </span>
            )
          }
          return ( 
            
            <span key={index} className={clsx('letter', {
              guessed: guessed && inWord,
            })}>
              {guessed && inWord && letter.toUpperCase()}
            </span>
            
          );
        })}
      </section>
      {/* Combined visually hidden aria-live region for status updates */}
      <section className='sr-only' aria-live='polite' role='status'>
        <p>
          {currentWord.includes(lastGuessedLetter)
            ? `Correct! The letter ${lastGuessedLetter} is in the word.`
            : `Sorry, the letter ${lastGuessedLetter} is not in the word.`}{" "}
          You have {numGuessesLeft} left.
        </p>
        <p>
          Current Word:{" "}
          {currentWord
            .split("")
            .map((letter) =>
              guessedLetters.includes(letter) ? letter + "." : "blank.",
            )
            .join(" ")}
        </p>
      </section>
      <section className='keyboard'>
        {alphabet.split("").map((letter) => {
          const guessed = guessedLetters.includes(letter);
          const inWord = currentWord.includes(letter);
          return (
            <button
              onClick={() => {
                addGuessedLetter(letter);
              }}
              key={letter}
              disabled={isGameOver}
              aria-disabled={guessedLetters.includes(letter)}
              aria-label={`Letter ${letter}`}
              className={clsx("key", {
                correct: guessed && inWord,
                wrong: guessed && !inWord,
              })}
            >
              {letter.toUpperCase()}
            </button>
          );
        })}
      </section>
      {isGameOver && (
        <button
          className='new-game'
          onClick={() => {
            setCurrentWord(getRandomWord());
            setGuessedLetters([]);
          }}
        >
          New Game
        </button>
      )}
    </main>
  );
}
