import { useState } from "react";
import { languages } from "./assets/languages";
import clsx from "clsx";
import { getFarewellText } from "./utils";

/**
 * Goal: Build out the main parts of our app
 *
 * Challenge: Add a header with the game title
 * and description. Startin' out easy 🙂🚶‍➡️
 */

export default function AssemblyEndgame() {
  // state values
  const [currentWord, setCurrentWord] = useState("abc");
  const [guessedLetters, setGuessedLetters] = useState([]);

  // derived values
  const wrongGuessCount = guessedLetters.filter(
    (letter) => !currentWord.includes(letter),
  ).length;
  const isGameWon = currentWord
    .split("")
    .every((letter) => guessedLetters.includes(letter));
  const isGameLost = wrongGuessCount >= languages.length - 1;
  const isGameOver = isGameWon || isGameLost;
  const lastGuessedLetter = guessedLetters[guessedLetters.length - 1];
  const isLastGuessIncorrect =
    lastGuessedLetter && !currentWord.includes(lastGuessedLetter);

  // static values
  const alphabet = "abcdefghijklmnopqrstuvwxyz";

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
      
      return (
        <p className="farewell-message">{itemDown} 🫡 </p>
      )
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
      <header>
        <h1 className='title'>Assembly: Endgame</h1>
        <p className='description'>
          Guess the word in under 8 attempts to keep the programming world safe
          from Assembly!
        </p>
      </header>
      <section
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
          return (
            <span key={index} className='letter'>
              {guessed && inWord && letter.toUpperCase()}
            </span>
          );
        })}
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
      {isGameOver && <button className='new-game'>New Game</button>}
    </main>
  );
}
