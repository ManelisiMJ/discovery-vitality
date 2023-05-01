import SERVER_IP from './config.js'

const makeBtn = document.getElementById("make-trans")
const chainBtn = document.getElementById("chain")
const contactBtn = document.getElementById("contact")
const aboutBtn = document.getElementById("about")
const userName = document.getElementById("name")
const logOut = document.getElementById("log-out")
userName.innerText = localStorage.getItem("name")

console.log(localStorage.getItem("type") === "user")

// let theUrl = "https://api.ipify.org/?format=json"        
//   fetch(theUrl).then(function(response) {
//       return response.json();
//     }).then(function(data) {
//       console.log(data)
//       localStorage.setItem("ip",data.ip);

//       let params = {"nodes":`http://${localStorage.getItem("ip")}:5000`}

//       fetch(`${SERVER_IP}/nodes/register`, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(params)
//         })
//         .then(response => response.json())
//         .then(data => {console.log(data)
//         })
//         .catch(error => console.error('Error:', error));
//     }).catch(function(err) {
//       console.log('Fetch Error :-S', err);
//     });

if (localStorage.getItem("type") === "user"){
  try {
    getChain()
    const viewBtn = document.getElementById("View-btn")
    viewBtn.addEventListener("click", ()=>{
      window.location.href = `${SERVER_IP}/chain`
      // fetch(`${SERVER_IP}/nodes/resolve`).then(function(response) {
      //   return response.json();
      // }).then(function(data) {
      //   console.log(data)
      // }).catch(function(err) {
      //   console.log('Fetch Error :-S', err);
      // });
      
    })
  } catch (error) {
    
  }
  makeBtn.classList.add("hidden")
}
else{
  const summary = document.getElementById("summary")
  summary.classList.add("hidden")
}

function getChain(){
    fetch(`${SERVER_IP}/chain_data`).then(function(response) {
        return response.json();
      }).then(function(data) {
        console.log(data)
        let totalCoins = 0
        let blockchain = data.chain
        console.log(blockchain)

        for (let i = 0; i<blockchain.length; i++){
          let transaction = blockchain[i].transaction
          if (transaction.id == localStorage.getItem("id")){
            totalCoins+=transaction.coins
          }
        }

        console.log("Updating balance now")
        let out = document.getElementById("coins")
        out.innerText = "Balance - "+totalCoins+" coins" 
      }).catch(function(err) {
        console.log('Fetch Error :-S', err);
      });
}

logOut.addEventListener("click", ()=>{
    localStorage.clear()
    window.location.href = `${SERVER_IP}/`
})

try {
    makeBtn.addEventListener("click", ()=>{
    window.location.href = `${SERVER_IP}/transact`
})
} catch (error) {
  
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



