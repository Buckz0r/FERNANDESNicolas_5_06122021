fetch("http://localhost:3000/api/products")
    .then(function(res) {
        if(res.ok) {
            return res.json();
        }
    })
    .then(function(value) {
        console.log(value)
        var section = document.getElementById("items");
        for(let i = 0; i < value.length; i++) {
            section.innerHTML += `
            <a href="./product.html?id=${value[i]._id}">
                <article>
                    <img src="${value[i].imageUrl}" alt="${value[i].altTxt}">
                    <h3 class="productName">${value[i].name}</h3>
                    <p class="productDescription">${value[i].description}</p>
                </article>
            </a>`
        }
    })
    .catch(function(err) {
        // Une erreur est survenue
    })