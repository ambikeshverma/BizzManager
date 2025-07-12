const addProduct = document.getElementById('addProduct');
const openButton = document.getElementById('openModal');
const openUseStock = document.getElementById('openUseStock');
const modalOverlay = document.getElementById('modalOverlay');
const modalOverlay1 = document.getElementById('modalOverlay1');
const modalOverlay2 = document.getElementById('modalOverlay2');
const form = document.getElementById('myForm');
const addProductForm = document.getElementById('addProductForm');
const useStockForm = document.getElementById('useStockForm');
const cancelButton = document.getElementById('cancelButton');
const cancelButtonProduct = document.getElementById('cancelButton-product');
const useStockcancelButton = document.getElementById('useStockcancelButton');
const productName = document.getElementById("productName");
const currentStockDisplay = document.getElementById("currentStockDisplay");
const productIdInput = document.getElementById("productId");
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

// //Show the modal of add-stock (delegation)

 const tableBody = document.querySelector('.table-content tbody');

tableBody.addEventListener('click', (e) => {
   const addbutton = e.target.closest('.add-stock');
   const usebutton = e.target.closest('.use-stock');
  if (usebutton) {
  console.log("Use button clicked")
  const id = usebutton.dataset.id;
  const name = usebutton.dataset.name;
  const stock = parseInt(usebutton.dataset.stock);

  productNameUseStock.innerText = name;
  currentStockDisplayUseStock.innerText = stock;
  productIdInputuseStock.value = id;
  useQuantityInput.value = "";

  modalOverlay2.style.display = 'flex'; 
  return;
}

   if (addbutton){ 

  const id = addbutton.dataset.id;
  const name = addbutton.dataset.name;
  const stock = parseInt(addbutton.dataset.stock);

  productName.innerText = name;
  currentStockDisplay.innerText = stock;
  productIdInput.value = id;
  addQuantityInput.value = "";

  modalOverlay.style.display = 'flex'; 
  
}
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


useStockForm.addEventListener('submit', (e) => {
 
  alert('Form submitted!');
  modalOverlay2.style.display = 'none'; 
});


useStockcancelButton.addEventListener('click', () => {
  modalOverlay2.style.display = 'none';
});

modalOverlay2.addEventListener('click', (e) => {
  if (e.target === modalOverlay2) {
    modalOverlay2.style.display = 'none';
  }
});


// Handle add row
// addProductForm.addEventListener('submit', () => {
//   // e.preventDefault();

//   const product = document.getElementById('productInput').value;
//   const category = document.getElementById('categoryInput').value;
//   const currentStock = document.getElementById('stockInput').value;
//   const minMaxStock = document.getElementById('minMaxInput').value;
//   const supplier = document.getElementById('supplierInput').value;

//   const newRow = document.createElement('tr');

//   const today = new Date().toISOString().split('T')[0];

//   newRow.innerHTML = `
//     <td>${tableBody.children.length + 1}.</td>
//     <td>${product}</td>
//     <td>${category}</td>
//     <td>${currentStock}</td>
//     <td>${minMaxStock}</td>
//     <td> 
//      <button class="add-stock">
//         <img src="/public/images/add-stock.png" height="20px" alt="" />
//         <span>Add Stock</span>
//       </button>
//     </td>
//     <td>${today}</td>
//     <td>${supplier}</td>
//     <td >
//        <button class="delete-row">
//           <img src="/public/images/delete.png" alt="">
//        </button>
//     </td>
   
      
    
//   `;

//   tableBody.appendChild(newRow);

  //addProductForm.reset();
//});




document.addEventListener("DOMContentLoaded", function () {
  const hamburger = document.getElementById("hamburger");
  const sidebar = document.querySelector(".sidebar");

  hamburger.addEventListener("click", function () {
    sidebar.classList.toggle("show");
  });
});



