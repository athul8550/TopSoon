import React from "react";

function QuantityCe() {
  function renderQtyOptions() {
    return [1, 2, 3, 4, 5, 6].map((qty) => (
      <option key={qty} value={qty}>
        {qty}
      </option>
    ));
  }

  return (
    <select className="QCe" id="QCe">
      {renderQtyOptions()}
    </select>
  );
}

export default QuantityCe;