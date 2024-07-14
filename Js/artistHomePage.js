const renderArtist = () => {
  const itemsSoldElem = document.querySelector(".items-sold-val");
  const totalIncomeElem = document.querySelector(".total-income-val");
  const artistName = localStorage.getItem("artist");

  const artistItems = items_LS.filter(item => item.artist === artistName);
  const soldItems = artistItems.filter(item => item.dateSold);

  const totalIncome = soldItems.reduce((sum, item) => sum + item.priceSold, 0);
  const totalItems = artistItems.length;
  const soldItemsCount = soldItems.length;

  itemsSoldElem.textContent = `${soldItemsCount}/${totalItems}`;
  totalIncomeElem.textContent = `$${totalIncome}`;
};

