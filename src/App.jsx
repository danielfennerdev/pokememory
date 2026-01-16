import { useCallback, useEffect, useState } from "react";
import data from "./data/pokemon_list.json";
import Card from "./components/Card.jsx";
import Modal from "./components/Modal.jsx";
import "./App.css";

function App() {
  const [pokemonList] = useState(data);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [clickedPokemonIds, setClickedPokemonIds] = useState([]);
  const [currentCards, setCurrentCards] = useState([]);
  const [modalOpen, setModalOpen] = useState(true);
  const [modalType, setModalType] = useState("instructions");
  const [shareCopied, setShareCopied] = useState(false);

  const getNewCards = useCallback(
    (currentClickedIds) => {
      const maxClickedAllowed = Math.min(currentClickedIds.length, 4);

      const clickedObjects = pokemonList.filter((p) =>
        currentClickedIds.includes(p.id),
      );
      const shuffledClicked = [...clickedObjects].sort(
        () => 0.5 - Math.random(),
      );

      const selectedClicked = shuffledClicked.slice(0, maxClickedAllowed);

      const unclickedObjects = pokemonList.filter(
        (p) => !currentClickedIds.includes(p.id),
      );
      const shuffledUnclicked = [...unclickedObjects].sort(
        () => 0.5 - Math.random(),
      );

      const selectedUnclicked = shuffledUnclicked.slice(
        0,
        8 - selectedClicked.length,
      );

      return [...selectedClicked, ...selectedUnclicked].sort(
        () => 0.5 - Math.random(),
      );
    },
    [pokemonList],
  );

  useEffect(() => {
    setCurrentCards(getNewCards(clickedPokemonIds));
  }, [clickedPokemonIds, getNewCards]);

  const handleCardClick = (pokemon) => {
    if (clickedPokemonIds.includes(pokemon.id)) {
      setHighScore(Math.max(highScore, score));
      setModalType("gameover");
      setModalOpen(true);
    } else {
      setScore((prev) => prev + 1);
      setClickedPokemonIds((prev) => [...prev, pokemon.id]);
    }
  };

  const handleStartGame = () => {
    setModalOpen(false);
  };

  const handlePlayAgain = () => {
    setScore(0);
    setClickedPokemonIds([]);
    setModalOpen(false);
  };

  const handleShareScore = async () => {
    try {
      await navigator.clipboard.writeText(
        `I scored ${score} points on Pokémemory! Can you beat my score? https://pokememory-self.vercel.app/`,
      );
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div>
      <div className="signature">
        by <a href="https://www.danielfenner.com">@danielfennerdev</a>
      </div>
      <div className="title" id="title">
        <h5>Pokémemory</h5>
      </div>
      <Modal
        isOpen={modalOpen}
        onClose={
          modalType === "instructions" ? handleStartGame : handlePlayAgain
        }
        title={modalType === "instructions" ? "How to Play" : "Game Over"}
        buttonText={modalType === "instructions" ? "Start Game" : "Play Again"}
      >
        {modalType === "instructions" ? (
          <p>
            Try to click on as many different Pokémon as possible without
            clicking the same one twice. Each time you click a Pokémon, the
            cards will reshuffle. Good luck!
          </p>
        ) : (
          <div>
            <p>Your Score: {score}</p>
            <p>High Score: {highScore}</p>
            <button className="share-button" onClick={handleShareScore}>
              {shareCopied ? "Copied!" : "Share Score"}
            </button>
          </div>
        )}
      </Modal>
      <main>
        <div className="scoreboard">
          <div className="score">Score: {score}</div>
          <div className="high-score">High Score: {highScore}</div>
        </div>
        <div className="card-grid">
          {currentCards.map((pokemon) => (
            <Card
              key={`${score}-${pokemon.id}`}
              pokemon={pokemon}
              onClick={handleCardClick}
            />
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;
