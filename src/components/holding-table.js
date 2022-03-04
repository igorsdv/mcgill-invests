import HoldingCard from './holding-card.js';

export default function HoldingTable({ holdings }) {
  return (
    <div className="flex flex-wrap">
      {holdings.map((holding) => (
        <HoldingCard key={holding.id} holding={holding} />
      ))}
    </div>
  );
}
