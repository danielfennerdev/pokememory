import "./Card.css";

function Card({ pokemon, onClick }) {
  const imgUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`;

  return (
    <div className="card" onClick={() => onClick(pokemon)}>
      <img src={imgUrl} alt={pokemon.name} className="card-image" />
      <div className="card-name">{pokemon.name}</div>
    </div>
  );
}

export default Card;
