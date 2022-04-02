import { useState, useEffect } from 'react'
import { Grid } from '../components/grid/Grid'
import { Keyboard } from '../components/keyboard/Keyboard'
import { MAX_WORD_LENGTH, MAX_CHALLENGES } from '../constants/settings'
import {
  isWinningWord,
  solution,
  findFirstUnusedReveal,
  unicodeLength,
} from '../lib/words'
import { addStatsForCompletedGame, loadStats } from '../lib/stats'
import {
  loadGameStateFromLocalStorage,
  saveGameStateToLocalStorage,
} from '../lib/localStorage'
import { default as GraphemeSplitter } from 'grapheme-splitter'
import { Card, Grid as Gird2 } from '@mui/material'

const ansKey = 'money'

function Question() {
  const prefersDarkMode = window.matchMedia(
    '(prefers-color-scheme: dark)'
  ).matches

  const [currentGuess, setCurrentGuess] = useState('')
  const [isGameWon, setIsGameWon] = useState(false)
  const [currentRowClass, setCurrentRowClass] = useState('')
  const [isGameLost, setIsGameLost] = useState(false)

  const [isRevealing, setIsRevealing] = useState(false)
  const [guesses, setGuesses] = useState<string[]>(() => {
    const loaded = loadGameStateFromLocalStorage()
    if (loaded?.solution !== solution) {
      return []
    }
    const gameWasWon = loaded?.guesses.includes(solution)
    if (gameWasWon) {
      setIsGameWon(true)
    }
    if (loaded?.guesses.length === MAX_CHALLENGES && !gameWasWon) {
      setIsGameLost(true)
    }
    return loaded?.guesses
  })

  console.log(guesses)

  const [stats, setStats] = useState(() => loadStats())

  const [isHardMode, setIsHardMode] = useState(
    localStorage.getItem('gameMode')
      ? localStorage.getItem('gameMode') === 'hard'
      : false
  )

  const clearCurrentRowClass = () => {
    setCurrentRowClass('')
  }

  useEffect(() => {
    saveGameStateToLocalStorage({ guesses, solution })
  }, [guesses])

  const onChar = (value: string) => {
    if (
      unicodeLength(`${currentGuess}${value}`) <= MAX_WORD_LENGTH &&
      guesses.length < MAX_CHALLENGES &&
      !isGameWon
    ) {
      setCurrentGuess(`${currentGuess}${value}`)
    }
  }

  const onDelete = () => {
    setCurrentGuess(
      new GraphemeSplitter().splitGraphemes(currentGuess).slice(0, -1).join('')
    )
  }

  useEffect(() => {
    localStorage.setItem('Anskey', 'money')
  }, [])

  const onEnter = () => {
    if (isGameWon || isGameLost) {
      return
    }

    if (!(unicodeLength(currentGuess) === MAX_WORD_LENGTH)) {
      setCurrentRowClass('jiggle')
      return false
    }

    // enforce hard mode - all guesses must contain all previously revealed letters
    if (isHardMode) {
      const firstMissingReveal = findFirstUnusedReveal(currentGuess, guesses)
      if (firstMissingReveal) {
        setCurrentRowClass('jiggle')
        return false
      }
    }

    setIsRevealing(true)

    const winningWord = isWinningWord(currentGuess)

    if (
      unicodeLength(currentGuess) === MAX_WORD_LENGTH &&
      guesses.length < MAX_CHALLENGES &&
      !isGameWon
    ) {
      setGuesses([...guesses, currentGuess])
      setCurrentGuess('')

      if (winningWord) {
        setStats(addStatsForCompletedGame(stats, guesses.length))
        return setIsGameWon(true)
      }

      if (guesses.length === MAX_CHALLENGES - 1) {
        setStats(addStatsForCompletedGame(stats, guesses.length + 1))
        setIsGameLost(true)
      }
    }
  }

  return (
    <Gird2 style={{ marginTop: 20 }} container>
      <Gird2 item lg={3} md={3} sm={12} xs={12}></Gird2>
      <Gird2 item lg={6} md={6} sm={12} xs={12}>
        <h1 style={{ color: 'white' }}>What is the most important thing ?</h1>
        <br />
        <Grid
          guesses={guesses}
          currentGuess={currentGuess}
          isRevealing={isRevealing}
          currentRowClassName={currentRowClass}
        />

        <button
          onClick={() => onEnter()}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded "
          style={{ marginTop: 20 }}
        >
          Submit
        </button>

        <div style={{ display: 'none' }}>
          <Keyboard
            onChar={onChar}
            onDelete={onDelete}
            onEnter={onEnter}
            guesses={guesses}
            isRevealing={isRevealing}
            ansKey={ansKey}
          />
        </div>
      </Gird2>
      <Gird2 item lg={3} md={3} sm={12} xs={12}></Gird2>
    </Gird2>
  )
}

export default Question
