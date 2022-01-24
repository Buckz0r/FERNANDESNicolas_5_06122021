let arrayProductsInCart = JSON.parse(localStorage.getItem("products")) || [];
console.log(arrayProductsInCart)
arrayProductsInCart.sort((a, b) => a._id > b._id ?-1:1);
var section = document.getElementById("cart__items");
for(var i = 0; i < arrayProductsInCart.length; i++) {
    section.innerHTML += `<article class="cart__item" data-id="${arrayProductsInCart[i]._id}" data-color="${arrayProductsInCart[i].colors}">
    <div class="cart__item__img">
      <img src="${arrayProductsInCart[i].imageUrl}" alt="${arrayProductsInCart[i].altTxt}">
    </div>
    <div class="cart__item__content">
      <div class="cart__item__content__description">
        <h2>${arrayProductsInCart[i].name}</h2>
        <p>${arrayProductsInCart[i].colors}</p>
        <p>${arrayProductsInCart[i].price} €</p>
      </div>
      <div class="cart__item__content__settings">
        <div class="cart__item__content__settings__quantity">
          <p>Qté :</p>
          <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${arrayProductsInCart[i].quantity}">
        </div>
        <div class="cart__item__content__settings__delete">
          <p class="deleteItem">Supprimer</p>
          </div>
        </div>
      </div>
    </article>`
    }
function displaytotal() {
  var cart = JSON.parse(localStorage.getItem("products"));
  let totalQuantity = 0;
  let quantity = document.getElementById("totalQuantity");
  let totalPrice = 0;
  let price = document.getElementById("totalPrice")
  for(var q = 0; q < cart.length; q++) {
    let quantityInCart = cart[q].quantity;
    let priceInCart = cart[q].price * cart[q].quantity;
    totalPrice += priceInCart;
    totalQuantity += quantityInCart;
  }
  quantity.innerHTML = totalQuantity;
  price.innerHTML = totalPrice;
}
displaytotal()
function deleteItem() {
  let btnDelete = document.querySelectorAll(".deleteItem");
  for(var d = 0; d < btnDelete.length; d++) {
    btnDelete[d].addEventListener('click', (e) => {
      var article = e.target.closest("article")
      let id = article.dataset.id;
      let colors = article.dataset.color;
      console.log(id);
      console.log(colors);
      let arrayProductsInCart = JSON.parse(localStorage.getItem("products"));
      for(var i = 0; i < arrayProductsInCart.length; i++) {
          if (arrayProductsInCart[i]._id == id && arrayProductsInCart[i].colors == colors) {
            arrayProductsInCart.splice(i, 1)
              localStorage.setItem("products", JSON.stringify(arrayProductsInCart));
              article.remove();
              displaytotal()
              return
          }
      }
    })
  }
}
deleteItem()
function modifItem() {
  let modifQuantity = document.querySelectorAll(".itemQuantity");
  for(var d = 0; d < modifQuantity.length; d++) {
    modifQuantity[d].addEventListener('change', (e) => {
      var article = e.target.closest("article")
      let id = article.dataset.id;
      let colors = article.dataset.color;
      let quantity = parseInt(e.target.value);
      console.log(id);
      console.log(colors);
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
console.log(order);
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
  let LSproducts = localStorage.getItem("products");
  for (var products = 0; products < products.length; products++) {
    LSproducts[products]._id
  }
  if (check) {
    fetch("http://localhost:3000/api/order", {
    Method: "POST",
    Headers: { 
    'Accept': 'application/json', 
    'Content-Type': 'application/json' 
    },
      body: JSON.stringify({
        contact: contact,
        products: products
      })
    });
  }
})