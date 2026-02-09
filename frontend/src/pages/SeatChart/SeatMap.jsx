import React from "react";

function Seat({ id, seatsInfo, onSeatClick }) {
  const occupied = seatsInfo.isOccupied(id);
  const selected = seatsInfo.isSelected(id);

  const className = [
    "seat",
    occupied ? "occupied" : "available",
    selected ? "selected" : "",
  ].join(" ");

  return (
    <button
      type="button"
      className={className}
      onClick={() => onSeatClick(id)}
      disabled={occupied}
      title={`좌석 ${id}번`}
    >
      {id}
    </button>
  );
}

function Block({ block, seatsInfo, onSeatClick }) {
  return (
    <div className="block" style={{ left: block.x, top: block.y }}>
      <div className="block-grid">
        {block.rows.map((pair, idx) => (
          <div className="block-row" key={idx}>
            <Seat id={pair[0]} seatsInfo={seatsInfo} onSeatClick={onSeatClick} />
            <Seat id={pair[1]} seatsInfo={seatsInfo} onSeatClick={onSeatClick} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SeatMap({ layout, seatsInfo, onSeatClick }) {
  return (
    <div className="mapWrap">
      <div className="map">
        <div className="roomTopArea">
          {layout.blocks.map((b) => (
            <Block key={b.id} block={b} seatsInfo={seatsInfo} onSeatClick={onSeatClick} />
          ))}
        </div>

        <div className="roomBottomArea" />
      </div>
    </div>
  );
}