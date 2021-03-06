// On récupère les éléments du LocalStorage

let arrayProductsInCart = JSON.parse(localStorage.getItem("products")) || [];

// On met dans l'ordre les produits du panier par ordre de "l'id"

arrayProductsInCart.sort((a, b) => a._id > b._id ?-1:1);
var section = document.getElementById("cart__items");

// On créer une boucle pour afficher les caractéristiques des produits

for(var i = 0; i < arrayProductsInCart.length; i++) {
  const colors = arrayProductsInCart[i].colors;
  const quantity = arrayProductsInCart[i].quantity;
  fetch("http://localhost:3000/api/products/"+ arrayProductsInCart[i]._id)
  .then(function(res) {
      if(res.ok) {
          return res.json();
      }
  })
  .then(function(article) {
    section.innerHTML += `<article class="cart__item" data-id="${article._id}" data-color="${colors}">
    <div class="cart__item__img">
      <img src="${article.imageUrl}" alt="${article.altTxt}">
    </div>
    <div class="cart__item__content">
      <div class="cart__item__content__description">
        <h2>${article.name}</h2>
        <p>${colors}</p>
        <p>${article.price} €</p>
      </div>
      <div class="cart__item__content__settings">
        <div class="cart__item__content__settings__quantity">
          <p>Qté :</p>
          <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${quantity}">
        </div>
        <div class="cart__item__content__settings__delete">
          <p class="deleteItem">Supprimer</p>
          </div>
        </div>
      </div>
    </article>`
    deleteItem()
    modifItem()
  })
}

    // Fonction pour calculer le total du prix et de la quantité pour ensuite les affichées

function displaytotal() {
  var cart = JSON.parse(localStorage.getItem("products"));
  let totalQuantity = 0;
  let quantity = document.getElementById("totalQuantity");
  let totalPrice = 0;
  let price = document.getElementById("totalPrice")
  if (cart === null) {
    alert("Votre panier est vide")
  } else {
  for(var q = 0; q < cart.length; q++) {
    let t = cart[q].quantity;
  fetch("http://localhost:3000/api/products/"+ cart[q]._id)
  .then(function(res) {
      if(res.ok) {
          return res.json();
      }
  })
  .then(function(article) {
    let quantityInCart = t;
    let priceInCart = article.price * t;
    totalPrice += priceInCart;
    totalQuantity += quantityInCart;
    quantity.innerHTML = totalQuantity;
    price.innerHTML = totalPrice;
    })
  }
  }
}
displaytotal()


// Fonction pour supprimer un article du panier

function deleteItem() {
  let btnDelete = document.querySelectorAll(".deleteItem");
  for (var d = 0; d < btnDelete.length; d++) {
    btnDelete[d].addEventListener('click', (e) => {
      var article = e.target.closest("article");
      let id = article.dataset.id;
      let colors = article.dataset.color;
      let arrayProductsInCart = JSON.parse(localStorage.getItem("products"));
      for (var i = 0; i < arrayProductsInCart.length; i++) {
        if (arrayProductsInCart[i]._id == id && arrayProductsInCart[i].colors == colors) {
          arrayProductsInCart.splice(i, 1);
          localStorage.setItem("products", JSON.stringify(arrayProductsInCart));
          article.remove();
          displaytotal();
          return;
        }
      }
    });
  }
}
deleteItem()

// Fonction pour actualiser le panier quand on supprime un article ou que l'on augmente la quantité d'un produit

function modifItem() {
  let modifQuantity = document.querySelectorAll(".itemQuantity");
  for(var d = 0; d < modifQuantity.length; d++) {
    modifQuantity[d].addEventListener('change', (e) => {
      var article = e.target.closest("article")
      let id = article.dataset.id;
      let colors = article.dataset.color;
      let quantity = parseInt(e.target.value);
      let arrayProductsInCart = JSON.parse(localStorage.getItem("products"));
      for(var i = 0; i < arrayProductsInCart.length; i++) {
          if (arrayProductsInCart[i]._id == id && arrayProductsInCart[i].colors == colors) {
            arrayProductsInCart[i].quantity = quantity;
              localStorage.setItem("products", JSON.stringify(arrayProductsInCart));
              displaytotal()
              return
          }
      }
    })
  }
}
modifItem()

const order = document.getElementById("order");

let pattern = {};
pattern.firstName = /^(([a-zA-ZÀ-ÿ]+[\s\-]{1}[a-zA-ZÀ-ÿ]+)|([a-zA-ZÀ-ÿ]+))$/;
pattern.lastName = /^(([a-zA-ZÀ-ÿ]+[\s\-]{1}[a-zA-ZÀ-ÿ]+)|([a-zA-ZÀ-ÿ]+))$/;
pattern.city = /^(([a-zA-ZÀ-ÿ]+[\s\-]{1}[a-zA-ZÀ-ÿ]+)|([a-zA-ZÀ-ÿ]+)){1,10}$/;
pattern.email = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]{2,}\.[a-z]{2,4}$/;
pattern.address = /^(([a-zA-ZÀ-ÿ0-9]+[\s\-]{1}[a-zA-ZÀ-ÿ0-9]+)){1,10}$/;
let errorMsg = {};
errorMsg.firstName = document.getElementById('firstNameErrorMsg');
errorMsg.lastName = document.getElementById('lastNameErrorMsg');
errorMsg.address = document.getElementById('addressErrorMsg');
errorMsg.city = document.getElementById('cityErrorMsg');
errorMsg.email = document.getElementById('emailErrorMsg');

// On ajoute un "event" pour vérifier que le formulaire est bien remplit et confirmer la commande

order.addEventListener("click", (e) => {
  e.preventDefault()
  let contact = {
    firstName: document.getElementById("firstName").value,
    lastName: document.getElementById("lastName").value,
    address: document.getElementById("address").value,
    city: document.getElementById("city").value,
    email: document.getElementById("email").value,
  };
  let check = true;
  for (field in contact) {
    if (!pattern[field].test(contact[field])) {
      check = false;
      errorMsg[field].innerHTML = `Donnée incorrecte.`
    } else {
      errorMsg[field].innerHTML = ``
    }
  }
  let products = [];
  
  // Une fois le panier finaliser on fait une boucle pour sélectionner les ID des produits

  for (listId of arrayProductsInCart) {
    products.push(listId._id)
  }

  // SI check est true alors on envoie le formulaire et le panier

  if (check) {
    fetch("http://localhost:3000/api/products/order", {
    method: "POST",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
      body: JSON.stringify({ contact, products }),
    })
    .then((res) => res.json())
    .then((data) => {
      document.location.href = "confirmation.html?id=" + data.orderId;
    })
    .catch((erreur) => alert("Une erreur est survenue"));
  }
})
