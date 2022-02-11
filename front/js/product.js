let params = new URL(document.location).searchParams;
let id = params.get("id");
console.log(id)
const productImg = document.querySelector(".item__img");
const productName = document.querySelector("#title");
const productDescription = document.querySelector("#description");
const productPrice = document.querySelector("#price");
const productselect = document.querySelector("#colors");
const productQuantity = document.querySelector("#quantity")

// Fonction pour afficher les détails du produit

function getArticles() {
    fetch("http://localhost:3000/api/products/"+id)
        .then(function(res) {
            if(res.ok) {
                return res.json();
            }
        })
        .then(function(article) {
            productName.innerHTML = article.name;
            productImg.innerHTML = `<img src="${article.imageUrl}" alt="Photographie d'un canapé"></img>`;
            productDescription.innerText = article.description;
            productPrice.innerHTML = article.price
            for(let i = 0; i < article.colors.length; i++) {
                productselect.innerHTML += `<option value="${article.colors[i]}">${article.colors[i]}</option>`;
            }
            addtocart(article)
        })
        .catch(function(err) {
            // Une erreur est survenue
    })
}
getArticles()

// Fonction pour ajouter un produit au panier

function addtocart(article) {
    const addtocart = document.querySelector("#addToCart");
    addtocart.addEventListener("click", function(){
        if (!productselect.value) {
            alert ("Veuillez choisir une couleur !")
            return
        } if (!(parseInt(productQuantity.value) >= 1 && parseInt(productQuantity.value) <= 100)) {
            alert ("Veuillez saisir une quantité !")
            return
        }
        article = {
            name: article.name,
            colors: productselect.value,
            quantity: parseInt(productQuantity.value),
            imageUrl: article.imageUrl,
            altTxt: article.altTxt,
            _id: id,
        };

        // Si le LocalStorage existe, on récupère son contenu,
        // on l'insère dans le tableau arrayProductsCart, puis on le renvoit vers le localStorage avec le nouveau produit ajouté.
        
        let arrayProductsInCart = [];
        if (localStorage.getItem("products")) {
            arrayProductsInCart = JSON.parse(localStorage.getItem("products"));
        }
        for(var i = 0; i < arrayProductsInCart.length; i++) {
            if (arrayProductsInCart[i]._id == article._id && arrayProductsInCart[i].colors == productselect.value) {
                arrayProductsInCart[i].quantity += parseInt(productQuantity.value);
                localStorage.setItem("products", JSON.stringify(arrayProductsInCart));
                return
            }
        }
        // Si le LocalStorage est vide, on le crée avec le produit ajouté

        arrayProductsInCart.push(article);
        localStorage.setItem("products", JSON.stringify(arrayProductsInCart));
    })
}