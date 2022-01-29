function entierAleatoire(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  const orderId = document.getElementById("orderId");
  let numberOrder = entierAleatoire(1000000000, 574102410652);
  orderId.innerHTML += `${numberOrder}`