'use strict'
import SERVER_IP from './config.js'
localStorage.clear()
const id = document.getElementById("username")
const password = document.getElementById("password")
let loginbtn = document.getElementById("loginbtn")
let passError = document.getElementById("error")
let error = document.getElementById("member-error")
let registerBtn = document.getElementById("register")

const url = `${SERVER_IP}/users/login`;

loginbtn.addEventListener("click", ()=>{
    passError.innerText = ""
    error.innerText = ""
    let userId = id.value
    let userPassword = password.value  

    if (userId === "")
        error.innerText = "Invalid User ID"
    if (userPassword === "")
        passError.innerText = "Please enter password"

    if(userId !== "" && userPassword !== ""){

        userId = isNaN(userId) ? userId : parseInt(userId)

        let params = {
            "id":userId,
            "password":userPassword
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
                if (data['code'] == '200'){ 
                    id.value = ""
                    password.value = ""
                    localStorage.setItem("id", data['id'])
                    localStorage.setItem("name", data['name'])
                    localStorage.setItem("type", data['type'])
                    home()
                }
                else{
                    passError.innerText = "Incorrect Username/Password"
                }
            })
            .catch(error => console.error('Error:', error));
    }  
})

function home(){
    console.log("Home function called")
    window.location.href = `${SERVER_IP}/home`;
}


registerBtn.addEventListener("click", ()=> {
    window.location.href = `${SERVER_IP}/register`;
})