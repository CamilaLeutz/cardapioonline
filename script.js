const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemsContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout-btn")
const closeModalBtn = document.getElementById("close-modal-btn")
const cartCounter = document.getElementById("cart-count")
const addressInput = document.getElementById("address")
const addressWarn = document.getElementById("address-warn")
const observationInput = document.getElementById("observationInput")

let cart = []

cartBtn.addEventListener("click", function () { //abrir modal do carrinho
    cartModal.style.display = "flex"
    updateCartModal()
})

cartModal.addEventListener("click", function () { //fechar o modal
    if (event.target === cartModal) {
        cartModal.style.display = "none"
    }
})

closeModalBtn.addEventListener("click", function () {
    cartModal.style.display = "none"
})

menu.addEventListener("click", function (event) {//função de adc itens ao carrinho
    let parentButton = event.target.closest(".add-to-cart-btn")

    if (parentButton) {
        const name = parentButton.getAttribute("data-name")
        const price = parseFloat(parentButton.getAttribute("data-price"))

        //add no carrinho
        addToCart(name, price)

    }
})

//função add ao carrinho
function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name) //buscar itens iguais

    if (existingItem) {//se existir o item com o mesmo nome, ele adc na quantidade + 1
        existingItem.quantity += 1
    } else {
        cart.push({ //adc quantidade com o push
            name,
            price,
            quantity: 1,
        })
    }

    updateCartModal() //chamando a função de abrir o modal com os itens adc ao button carrinho
}
//atualiza o carrinho
function updateCartModal() {
    cartItemsContainer.innerHTML = ""
    let total = 0

    cart.forEach(item => {
        const cartItemElement = document.createElement("div")
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col")//add uma class pra estilização

        cartItemElement.innerHTML = `
    <div class="flex items-center justify-between">
    <div>
    <p class="font-bold">${item.name}</p>
    <p>Qtd: ${item.quantity}</p>
    <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
    </div>
    
    <button class="remove-from-cart-btn" data-name="${item.name}">Remover</button>

    </div>
    
    `
        total += item.price * item.quantity //o += serve pra ele identificar o que ja existe no total e somar com o proximo valor que vira 

        cartItemsContainer.appendChild(cartItemElement)//adc o novo elemento criado dentro do modal
    })

    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    })

    cartCounter.innerHTML = cart.length
}

//função pra remover itens do carrinho
cartItemsContainer.addEventListener("click", function (event) {//adc ao botão o evento de click e adc a função de verificar a class dele
    if (event.target.classList.contains("remove-from-cart-btn")) {//verificando com o if se a class remove esta nesse btn 
        const name = event.target.getAttribute("data-name") //pegar o atributo data-name
        removeItemCart(name)
    }
})

function removeItemCart(name) {
    const index = cart.findIndex(item => item.name === name) //procuro a posição (index) que esta na minha lista

    if (index !== -1) { //verifico a posição da minha lista se ela é diferente de -1
        const item = cart[index]
        if (item.quantity > 1) { //verifico se tem um numero > (maior) do que 1 e quero remover apenas um
            item.quantity -= 1
            updateCartModal()//chama a função de atualizar o modal
            return //para a execução do if
        }
        cart.splice(index, 1) //remove a posição do carrinho
        updateCartModal()
    }
}

addressInput.addEventListener("input", function (event) {//evento de monitoração de input
    let inputValue = event.target.value

    if (inputValue !== "") {
        addressInput.classList.remove("border-red-500")
        addressWarn.classList.add("hidden")
    }
    //
})

observationInput.addEventListener("input", function (event) {//manipulação input de observações 
    let obsInputValue = event.target.value
})

checkoutBtn.addEventListener("click", function () { //button de finalizar pedido

    const isOpen = checkRestaurantOpen()
    if (!isOpen) {//se o restaurante não estiver aberto
        Toastify({
            text: "Ops, restaurante fechado no momento!",
            duration: 3000,
            destination: "https://github.com/apvarun/toastify-js",
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
                background: "#ef4444",
            }
        }).showToast()
        return
    }

    if (cart.length === 0) return //se o meu carrinho for igual a 0, ele estara vazio, não vai fazer nada
    if (addressInput.value === "") { //se o input naõ tiver digitado nada, estiver vazio, vai aparecer o warn que é o alert vermelho de erro de endereço 
        addressWarn.classList.remove("hidden") //vai remover a class de hidden e aparecer a frase em vermelho abaixo do input
        addressInput.classList.add("border-red-500")//vai adc uma borda vermelha de erro endereço vazio
        return
    }

    //enviar o pedido da api do whatsapp
    const cartItems = cart.map((item) => {
        return (
            `${item.name}  Quantidade: ${item.quantity} |  Preço:R$ ${item.price} |`
        )
    }).join("")

    const message = encodeURIComponent(cartItems)
    const phone = "47996408857"

    window.open(`https://wa.me/${phone}?text= ${message} Endereço: ${addressInput.value} Observações: ${observationInput.value}`, "_blank")

    cart = []
    updateCartModal()

})

//função de manipulaçao de card de horario de restarante aberto
function checkRestaurantOpen() {
    const data = new Date()
    const hora = data.getHours()
    return hora >= 18 && hora < 23//true, restaurante aberto
}

const spanItem = document.getElementById("date-span")
const isOpen = checkRestaurantOpen()

if (isOpen) {
    spanItem.classList.remove("bg-red-500")
    spanItem.classList.add("bg-green-600")
} else {
    spanItem.classList.remove("bg-green-600")
    spanItem.classList.add("bg-red-500")
}
