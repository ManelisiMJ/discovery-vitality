'use strict'
import SERVER_IP from './config.js'

const nameBox = document.getElementById("name")
const surname = document.getElementById("surname")
const password = document.getElementById("password")
const verifyPassword = document.getElementById("verifypassword")
const nameError = document.getElementById("name-error")
const surnameError = document.getElementById("surname-error")
const passError = document.getElementById("pass-error")
const login = document.getElementById("log-in")

let registerbtn = document.getElementById("registerbtn")
registerbtn.addEventListener("click",()=>{
    clearErrors()
    let userName = nameBox.value
    let userSurname = surname.value
    let pass = password.value
    let verify = verifyPassword.value
    if (userName === ""){
        nameError.innerText = "Invalid name"
    }
    if (userSurname === ""){
        surnameError.innerText = "Invalid surname"
    }

    if (userName !== "" && userSurname !== "" && checkPassword(pass, verify)){
        const url = `${SERVER_IP}/users/register`
        params = {
            "name": userName,
            "surname": userSurname,
            "password": pass
        }
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params)
            })
            .then(response => response.json())
            .then(data => {console.log(data)
                if (data == '200'){ 
                    console.log("Success")
                    nameBox.value = ""
                    surname.value = ""
                    password.value = ""
                    verifyPassword.value = ""
                    window.location.replace(`${SERVER_IP}/`)
                }
                else{
                    console.log("An error occurred")
                }
            })
            .catch(error => console.error('Error:', error));
    }

})

function checkPassword(password, verified){
    console.log(password, verified)
    if (password === "" && verified === ""){
        passError.innerText = "Password cannot be empty"
        return false
    }
    else{
        if (password !== verified){
            passError.innerText = "Passwords do not match"
            return false
        }
        else
            return true
    }
}

function clearErrors(){
    nameError.innerText = ""
    surnameError.innerText = ""
    passError.innerText = ""
}

login.addEventListener("click", ()=>{
    window.location.replace(`${SERVER_IP}/`)
})


