
const addProduct = document.getElementById('addProduct');
const openButton = document.getElementById('openModal');
const openUseStock = document.getElementById('openUseStock');
const modalOverlay = document.getElementById('modalOverlay');
const modalOverlay1 = document.getElementById('modalOverlay1');
const addPayment = document.getElementById('bt2');
const form = document.getElementById('myForm');
const addProductForm = document.getElementById('addProductForm');
const useStockForm = document.getElementById('useStockForm');
const cancelButton = document.getElementById('cancelButton');
const cancelButtonProduct = document.getElementById('cancelButton-product');
const useStockcancelButton = document.getElementById('useStockcancelButton');
const productName = document.getElementById("productName");
const currentStockDisplay = document.getElementById("currentStockDisplay");
const teamNameInput = document.getElementById("teamName");
const addQuantityInput = document.getElementById("addQuantity");
const currentStockDisplayUseStock = document.getElementById("currentStockDisplayUseStock");
const productIdInputuseStock = document.getElementById("productIdUseStock");
const productNameUseStock = document.getElementById("productNameUseStock");
const useQuantityInput = document.getElementById("useQuantity");

//show product add form
addProduct.addEventListener('click', () => {
  modalOverlay1.style.display = 'flex';
});

//handle cancle button of addproduct
cancelButtonProduct.addEventListener('click', () => {
  modalOverlay1.style.display = 'none';
});

//handle cancle by area of addproduct form
modalOverlay1.addEventListener('click', (e) => {
  if (e.target === modalOverlay1) {
    modalOverlay1.style.display = 'none';
  }
});

// Handle form submission of add product
addProductForm.addEventListener('submit', () => {
  //e.preventDefault(); // Prevent actual form submission
  alert('Form submitted!');
  modalOverlay1.style.display = 'none'; // Hide the modal
});


 //Show the modal of add-stock (delegation)

 const showExpenses = document.querySelector('.showExpenses');

showExpenses.addEventListener('click', (e) => {
   const addteambutton = e.target.closest('.bt2');
    if (!addteambutton) return
 // console.log(addteambutton.dataset.teamName)
   const teamName = addteambutton.dataset.teamName;
//   const name = addbutton.dataset.name;
//   const stock = parseInt(addbutton.dataset.stock);

//   productName.innerText = name;
  // currentStockDisplay.innerText = teamName;
   teamNameInput.value = teamName;
//   addQuantityInput.value = "";

 modalOverlay.style.display = 'flex'; 

});



form.addEventListener('submit', (e) => {
 
  alert('Form submitted!');
  modalOverlay.style.display = 'none'; 
});

// Handle cancel button
cancelButton.addEventListener('click', () => {
  modalOverlay.style.display = 'none';
});

modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) {
    modalOverlay.style.display = 'none';
  }
});



//Handle use stock button and all their things (delegation)

// tableBody.addEventListener('click', (e) => {
//   const usebutton = e.target.closest('.use-stock');
//   // if (!usebutton) return;

//   // const id = usebutton.dataset.id;
//   // const name = usebutton.dataset.name;
//   // const stock = parseInt(usebutton.dataset.stock);

//   // productNameUseStock.innerText = name;
//   // currentStockDisplayUseStock.innerText = stock;
//   // productIdInputuseStock.value = id;
//   // addQuantityInput.value = "";

//   modalOverlay2.style.display = 'flex'; 
// });








document.addEventListener("DOMContentLoaded", function () {
  const hamburger = document.getElementById("hamburger");
  const sidebar = document.querySelector(".sidebar");

  hamburger.addEventListener("click", function () {
    sidebar.classList.toggle("show");
  });
});



