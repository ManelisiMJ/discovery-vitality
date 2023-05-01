'use strict'
import SERVER_IP from './config.js'

const url = `${SERVER_IP}/post_transaction`;
const idBox = document.getElementById("id")
const categoryBox = document.getElementById("category")
const coinsBox = document.getElementById("coins")
const messageBox = document.getElementById("message")
const idError = document.getElementById("member-error")
const categoryError = document.getElementById("category-error")
const coinsError = document.getElementById("coins-error")
const messageError = document.getElementById("message-error")
const chainBtn = document.getElementById("chain")
const contactBtn = document.getElementById("contact")
const aboutBtn = document.getElementById("about")
const homeBtn = document.getElementById("home")

function postTransaction(){
    clearErrors()
    let id = parseInt(idBox.value)
    let categoryValue = categoryBox.value
    let coins = parseInt(coinsBox.value)
    let message = messageBox.value

    if (id == ""){
        idError.textContent = "Invalid ID / Member not found"
    }
    if (message == ""){
        messageError.textContent = "Please enter a message"
    }
    if (categoryValue == "Category"){
        categoryError.textContent = "Please select a category"
    }
    if (coins == 0){
        coinsError.textContent = "Please enter none zero value"
    }

    if (coins != 0 && message !="" && id!="" && categoryValue != "Category")
    {
        const params = {
            id: id,
            category: categoryValue,
            coins: coins,
            by: localStorage.getItem("id"),
            message: message
        };
    
        fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(params)
        })
        .then(response => response.json())
        .then(data => {console.log(data)
            if (data == "200"){
                idError.textContent = "Invalid ID / Member not found"
            }
            else{
                idBox.value = ""
                messageBox.value = ""
                coinsBox.value = ""
                categoryBox.selectedIndex = 0
                $(document).ready(function(){
                    $('.toast').toast({delay: 2000});
                    $('.toast').toast('show');
                });
            }
            
        })
        .catch(error => console.error('Error:', error));  
    }   
}

let submitBtn = document.getElementById('submit-btn')
submitBtn.addEventListener("click", ()=>{
    postTransaction()
})

function clearErrors(){
    idError.textContent = ""
    messageError.textContent = ""
    categoryError.textContent = ""
    coinsError.textContent = ""
}

chainBtn.addEventListener("click", ()=>{
    window.location.href = `${SERVER_IP}/chain`
})

aboutBtn.addEventListener("click", ()=>{
    window.location.href = `${SERVER_IP}/about`
})

contactBtn.addEventListener("click", ()=>{
    window.location.href = `${SERVER_IP}/contact`
})

homeBtn.addEventListener("click", ()=>{
    window.location.replace(`${SERVER_IP}/home`)
})

const logOut = document.getElementById("log-out")
logOut.addEventListener("click", ()=>{
    localStorage.clear()
    window.location.href = `${SERVER_IP}/`
})


