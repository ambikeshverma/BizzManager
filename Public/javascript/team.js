
const addProduct = document.getElementById('addProduct');
const openButton = document.getElementById('openModal');
const openUseStock = document.getElementById('openUseStock');
const modalOverlay = document.getElementById('modalOverlay');
const modalOverlay1 = document.getElementById('modalOverlay1');
const modalOverlay2 = document.getElementById('modalOverlay2');
const addPayment = document.getElementById('bt2');
const form = document.getElementById('myForm');
const addinstallationform = document.getElementById('addinstallationform');
const cancelButtonAddInstallation = document.getElementById('cancelButtonAddInstallation');
const addProductForm = document.getElementById('addProductForm');
const useStockForm = document.getElementById('useStockForm');
const cancelButton = document.getElementById('cancelButton');
const cancelButtonProduct = document.getElementById('cancelButton-product');
const useStockcancelButton = document.getElementById('useStockcancelButton');
const productName = document.getElementById("productName");
const currentStockDisplay = document.getElementById("currentStockDisplay");
const teamNameInput = document.getElementById("teamName");
const teamIdPayInput = document.getElementById("teamIdPay");
const teamNameInputIn = document.getElementById("teamNameIn");
const teamIdInput = document.getElementById("teamId");
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
  const addInstallation = e.target.closest('.bt1');
   const addpaymentbutton = e.target.closest('.bt2');
    if (addpaymentbutton){
   const teamName = addpaymentbutton.dataset.teamName;
   const teamIdPay = addpaymentbutton.dataset.id;

//   productName.innerText = name;
  // currentStockDisplay.innerText = teamName;
   teamNameInput.value = teamName;
   teamIdPayInput.value = teamIdPay;
//   addQuantityInput.value = "";

 modalOverlay.style.display = 'flex'; 
 return;
    }
    if(addInstallation){
       const teamNameIn = addInstallation.dataset.teamName;
       const teamIdIn = addInstallation.dataset.id;
       teamNameInputIn.value = teamNameIn;
       teamIdInput.value = teamIdIn;

      modalOverlay2.style.display = 'flex';
    }

});

form.addEventListener('submit', (e) => {
 
  alert('Payment Add Succesfully!');
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



//handle add installation cancel button model target and from subbmision (modalOverlay2)


addinstallationform.addEventListener('submit', (e) => {
 
  alert('Installation add Successfully!');
  modalOverlay2.style.display = 'none'; 
});

// Handle cancel button
cancelButtonAddInstallation.addEventListener('click', () => {
  modalOverlay2.style.display = 'none';
});

modalOverlay2.addEventListener('click', (e) => {
  if (e.target === modalOverlay2) {
    modalOverlay2.style.display = 'none';
  }
});





//for Side bar
document.addEventListener("DOMContentLoaded", function () {
  const hamburger = document.getElementById("hamburger");
  const sidebar = document.querySelector(".sidebar");

  hamburger.addEventListener("click", function () {
    sidebar.classList.toggle("show");
  });

  const links = document.querySelectorAll(".sidebar-item");
  const currentPath = window.location.pathname;

  links.forEach(link => {
    if (link.getAttribute("href") === currentPath) {
      link.classList.add("active");
    }
  });

   document.addEventListener("click", function (e) {
    const isClickInsideSidebar = sidebar.contains(e.target);
    const isClickOnHamburger = hamburger.contains(e.target);

    if (!isClickInsideSidebar && !isClickOnHamburger) {
      sidebar.classList.remove("show");
    }
  });

});



