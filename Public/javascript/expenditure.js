const addProduct = document.getElementById('addProduct');
const modalOverlay1 = document.getElementById('modalOverlay1');
const addProductForm = document.getElementById('addProductForm');
const cancelButton = document.getElementById('cancelButton');
const cancelButtonProduct = document.getElementById('cancelButton-product');

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
addProductForm.addEventListener('submit', (e) => {
  alert('Form submitted!');
  modalOverlay1.style.display = 'none'; // Hide the modal
});







// Handle add row
// addProductForm.addEventListener('submit', (e) => {
//   e.preventDefault();

//   const amount = document.getElementById('amount').value;
//   const date = document.getElementById('date').value;
//   const categoryInput = document.getElementById('categoryInput').value;
//   const personName = document.getElementById('personName').value;
//   const description = document.getElementById('description').value;

//   const newRow = document.createElement('tr');
  


//   newRow.innerHTML = `
//     <td>${tableBody.children.length + 1}.</td>
//     <td>${date}</td>
//     <td>${description}</td>
//     <td>${amount}</td>
//     <td>${personName}</td>
//     <td>${categoryInput}</td>
//     <td >
//        <button class="delete-row">
//           <img src="/public/images/delete.png" alt="">
//        </button>
//     </td>
   
      
    
//   `;

//   tableBody.appendChild(newRow);

//   //addProductForm.reset();
// });

// const tableBody = document.querySelector('.table-content tbody');

// tableBody.addEventListener('click', (e) => {
//   if (e.target.closest('.add-stock')) {
//     modalOverlay1.style.display = 'flex';
//   }
// });


//delete button for delete row
// tableBody.addEventListener('click', (e) => {
//   if (e.target.closest('.delete-row')) {
//     const row = e.target.closest('tr');
//     const productName = row.children[1].textContent;

//     // Remove from DOM
//     row.remove();
//   }
// });



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


