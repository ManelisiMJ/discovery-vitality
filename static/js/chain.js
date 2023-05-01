'use strict'
import SERVER_IP from './config.js'

const id = document.getElementById("id")
const coins = document.getElementById("coins")
const category = document.getElementById("category")
const message = document.getElementById("message")
const made = document.getElementById("made")
const contactBtn = document.getElementById("contact")
const aboutBtn = document.getElementById("about")
const homeBtn = document.getElementById("home")
let table = document.getElementById("myTable");
console.log("adfsdf")

fetch(`${SERVER_IP}/chain_data`).then(function(response) {
  return response.json();
}).then(function(data) {
  let blockchain = data.chain
  console.log(blockchain)

  for (let i = 1; i<blockchain.length; i++){
    let transaction = blockchain[i].transaction
    if (transaction.id == localStorage.getItem("id") || localStorage.getItem("type") === "employee"){
      table.innerHTML += `
        <tr>
        <td>${transaction.id}</td>
        <td> ${transaction.coins}</td>
        <td> ${transaction.category}</td>
        <td> ${transaction['made-by']}</td>
        <td> ${transaction.message}</td>
        </tr>
      `
      highlight()
    }
  }
}).catch(function(err) {
  console.log('Fetch Error :-S', err);
});

function highlight(){
  // Attach onclick event to each cell
  let cells = table.getElementsByTagName("td");

  for (let i = 0; i < cells.length; i++) {
    cells[i].onclick = function() {

      // Remove the highlight from any previously highlighted row
      let highlightedRows = document.querySelectorAll(".highlighted");

      for (var j = 0; j < highlightedRows.length; j++) {
        highlightedRows[j].classList.remove("highlighted");
      }

      // Get the row that contains the clicked cell
      let row = this.parentNode;

      // Highlight the row
      row.classList.add("highlighted");
      
      // Get the contents of the row
      let rowData = [];
      let cells = row.getElementsByTagName("td");
      for (let j = 0; j < cells.length; j++) {
        rowData.push(cells[j].textContent);
      }
      
      id.innerHTML = "Member ID:<b> "+rowData[0]+"</b>"
      coins.innerHTML = "Coins:<b> "+rowData[1]+"</b>"
      category.innerHTML = "Category:<b> "+rowData[2]+"</b>"
      made.innerHTML = "Made by:<b> "+rowData[3]+"</b>"
      message.innerHTML = "Message:<b> "+rowData[4]+"</b>"
    };
  }
}

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