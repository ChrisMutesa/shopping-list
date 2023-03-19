const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');

const clearBtn = document.getElementById('clear');
const itemFilter = document.getElementById('filter');
const formBtn = itemForm.querySelector('button');

let isEditMode = false;

// 1st chapter - Add Items to the list

function onAddItemSubmit(e) {
  e.preventDefault();

  const newItem = itemInput.value;

  // Validate when empty
  if (newItem === '') {
    alert('Please add something');
    return;
  }

  // Check for edit mode
  if (isEditMode) {
    const itemToEdit = itemList.querySelector('.edit-mode');
    removeItemFromStorage(itemToEdit.textContent);
    itemToEdit.classList.remove('edit-mode');
    itemToEdit.remove();
    isEditMode = false;
  }

  // Check if item exists
  if (checkIfItemExists(newItem)) {
    alert('That item already exists');
    itemInput.value = '';
    return;
  }

  addItemToDOM(newItem);

  addItemToStorage(newItem);

  checkUI();

  itemInput.value = '';
}

function addItemToDOM(item) {
  const li = document.createElement('li');
  li.appendChild(document.createTextNode(item));

  const icon = document.createElement('i');
  icon.className = 'fa-solid fa-xmark';

  const button = document.createElement('button');
  button.className = 'remove-item btn-link text-red';

  // Append all together
  button.appendChild(icon);
  li.appendChild(button);
  itemList.appendChild(li);
}

// Chap 3 - Remove clear items

function onClickItem(e) {
  const targetKid = e.target.parentElement;
  const targetDad = e.target.parentElement.parentElement;

  if (targetKid.classList.contains('remove-item')) {
    removeItem(targetDad);
  } else {
    // console.log(e.target);
    setItemToEdit(e.target);
  }
}

function checkIfItemExists(item) {
  itemsFromStorage = getItemsFromStorage();
  return itemsFromStorage.includes(item);
}

// for chap 10
function setItemToEdit(item) {
  isEditMode = true;

  // Remove edit-mode class for lis
  itemList
    .querySelectorAll('li')
    .forEach((item) => item.classList.remove('edit-mode'));

  item.classList.add('edit-mode');
  formBtn.innerHTML = '<i class="fa-solid fa-pen"></i> Update Item';
  formBtn.style.backgroundColor = '#228b22';
  itemInput.value = item.textContent;
}

function removeItem(item) {
  itemsFromStorage = getItemsFromStorage();
  if (confirm('Are you sure?')) {
    item.remove();
  }

  // Remove item from local storage
  removeItemFromStorage(item.textContent);

  checkUI();
}

function removeItemFromStorage(item) {
  let itemsFromStorage = getItemsFromStorage();

  // remaining items
  itemsFromStorage = itemsFromStorage.filter((i) => i !== item);

  // Re-setting in local storage
  localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

function clearItems(e) {
  while (itemList.firstChild) {
    itemList.firstChild.remove();
  }

  // Clear all from storage
  localStorage.clear();

  checkUI();
}

// Chap 4 - Clear UI state
function checkUI() {
  const items = itemList.querySelectorAll('li');
  if (items.length === 0) {
    itemFilter.style.display = 'none';
    clearBtn.style.display = 'none';
  } else {
    itemFilter.style.display = 'flex';
    clearBtn.style.display = 'flex';
  }

  formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
  formBtn.style.backgroundColor = '#333';
  isEditMode = false;
}

// Chap 5 - filter items
function filterItems(e) {
  const items = itemList.querySelectorAll('li');
  const text = e.target.value.toLowerCase();

  items.forEach((item) => {
    const itemName = item.firstChild.textContent.toLowerCase();
    console.log(itemName);
    if (itemName.indexOf(text) != -1) {
      item.style.display = 'flex';
    } else {
      item.style.display = 'none';
    }
  });
}

// Chap 7 - add item to local storage
function getItemsFromStorage() {
  let itemsFromStorage;
  if (localStorage.getItem('items') === null) {
    itemsFromStorage = [];
  } else {
    // to array in order to push
    itemsFromStorage = JSON.parse(localStorage.getItem('items'));
  }
  return itemsFromStorage;
}

function addItemToStorage(item) {
  itemsFromStorage = getItemsFromStorage();
  itemsFromStorage.push(item);

  // set items to storage
  localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

// chap 8 - display items from local storage
/*
- function getItemsFromStorage
- function addItemToStorage
- function displayItem
- create init()
*/

function displayItem() {
  itemsFromStorage = getItemsFromStorage();
  itemsFromStorage.forEach((item) => addItemToDOM(item));

  checkUI();
}

// chap 9 - remove items from local storage
/*
- function onClickItem (for future use) 
- function removeItem
- function removeItemFromStorage inside removeItem
- clear all items from storage
*/

// Chap 10 - set edit mode
/*
- edit mode variable
- else set the target for onClickItem  (function setItemToEdit)
- function setItemToEdit
- remove the edit-mode class
*/

function init() {
  itemForm.addEventListener('submit', onAddItemSubmit);
  itemList.addEventListener('click', onClickItem);
  clearBtn.addEventListener('click', clearItems);
  itemFilter.addEventListener('input', filterItems);
  document.addEventListener('DOMContentLoaded', displayItem);

  checkUI();
}

init();
