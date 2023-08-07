import React from "react";

function QuantityPe() {
  function renderQtyOptions() {
    return [1, 2, 3, 4, 5, 6].map((qty) => (
      <option key={qty} value={qty}>
        {qty}
      </option>
    ));
  }

  return (
    <select className="QPe" id="QPe">
      {renderQtyOptions()}
    </select>
  );
}

export default QuantityPe;