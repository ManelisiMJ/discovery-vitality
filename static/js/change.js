'use strict'
import SERVER_IP from './config.js'

let blockchain = 0
const changeBtn = document.getElementById("change")
const output = document.getElementById("out")
const resolve = document.getElementById("resolve")
const resolveOut = document.getElementById("resolve-out")

fetch(`${SERVER_IP}/chain_data`).then(function(response) {
    return response.json();
  }).then(function(data) {
    console.log(data)
    blockchain = data.chain
    console.log(blockchain)
    changeBtn.addEventListener("click", ()=>{
        for (let i=0; i<blockchain.length; i++){
            if (i != 0)
                blockchain[i].transaction.coins = 1000000      
        }
        output.innerText = JSON.stringify(blockchain)
    })

  }).catch(function(err) {
    console.log('Fetch Error :-S', err);
  });

resolve.addEventListener("click", ()=>{
    if (blockchain != 0){
        let params = {"chain":blockchain}
            const url = `${SERVER_IP}/resolve`;
            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(params)
                })
                .then(response => response.json())
                .then(data => {console.log(data)
                    resolveOut.innerText = data["message"]
                })
                .catch(error => console.error('Error:', error));
    }
})


