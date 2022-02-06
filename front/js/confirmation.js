  // On créer le numéro de commande
  const orderId = document.getElementById("orderId");
  let params = new URL(document.location).searchParams;
  let id = params.get("id");
  orderId.innerHTML = id