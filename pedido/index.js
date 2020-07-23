const orderDateInput = document.getElementById('orderDate')
const orderDescriptionInput = document.getElementById('orderDescription')
const formItem = document.getElementById('formItem')
const tableBody = document.getElementById('table-body')
const saveOrderButton = document.getElementById('saveOrder')

const baseURL = 'http://localhost:3000/orders'
const headers = new Headers({"Content-Type": "application/json", "Access-Control-Allow-Origin": "*"}) 

let orderItems = []
let operation

function loadPage() {
  const orderId = new URLSearchParams(window.location.search).get('id');
  if (orderId) {
    operation = 'update'
    getSingleOrder(orderId).then(order => {
      orderItems = order.itens
      orderDateInput.value = convertDate(order.date)
      orderDescriptionInput.value = order.description
      localStorage.setItem('orderId', order.id)
      renderItems()
    })
  } else {
    operation = 'create'
    orderDateInput.value = getDate()
  }
}

function getDate() {
  let now = new Date
  const day = now.getDate()
  let mounth = now.getMonth() + 1
  mounth = `${mounth}`.length === 1 ? `0${mounth}` : mounth
  const year = now.getFullYear()
  return `${year}-${mounth}-${day}`
}

function convertDate(date) {
  if (date.indexOf('/') > -1) {
    const [day, mounth, year] = date.split('/')
    return `${year}-${mounth}-${day}`
  }
  const [year, mounth, day] = date.split('-')
  return `${day}/${mounth}/${year}`
}

async function getSingleOrder(id) {
  let response = await fetch(`${baseURL}/${id}`, { method: 'get' })

  return response.json()
}

function convertValues(value) {
  if (value.indexOf(',') > -1) {
    return parseFloat(value.replace(',', '.'))
  }else if (value.indexOf('.') > -1) {
    return parseFloat(value)
  }else {
    return parseInt(value)
  }
}

function convertvaluePtBr(value) { return 'R$ ' + value.toFixed(2).toString().replace('.', ',') }

function cleanItemData() {
  document.getElementById('itemId').value = ''
  document.getElementById('itemName').value = ''
  document.getElementById('itemAmount').value = ''
  document.getElementById('itemValue').value = ''
  document.getElementById('itemDiscount').value = ''
}

function renderItems() {
  tableBody.innerHTML = ''
  let itemsTotal = 0
  orderItems.forEach(item => {
    let itemTotal = item.amount * item.value
    itemTotal -= itemTotal * (item.discount / 100)
    tableBody.innerHTML += `
    <tr>
      <th scope="col">${item.id}</th>
      <td>${item.name}</td>
      <td>${item.amount}</td>
      <td>${convertvaluePtBr(item.value)}</td>
      <td>${item.discount} %</td>
      <td>${convertvaluePtBr(itemTotal)}</td>
      <td><td><button onclick="removeItem(${item.id})" type="button" class="btn btn-warning" data-toggle="modal" data-target="#modalOrder"><i class="fa fa-trash" aria-hidden="true"></i></button></td></td>
    </tr>`
    itemsTotal += itemTotal 
  })
  tableBody.innerHTML += `
    <tr>
      <th scope="col">Total</th>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td>${convertvaluePtBr(itemsTotal)}</td>
    </tr>`
}


function updateOrder() {
  const actualId = localStorage.getItem('orderId')
  const body = formatData()
  fetch(`${baseURL}/${actualId}`, { method: 'put', body, headers })
  goBack()
}

function createOrder() {
  const body = formatData()
  fetch(`${baseURL}`, { method: 'post', body, headers })
  goBack()
}

function formatData() {
  const order = {
    date: convertDate(orderDateInput.value),
    description: orderDescriptionInput.value,
    situation: "Em Análise",
    itens: [ ...orderItems ]
  }
  return JSON.stringify(order)
}

function goBack() {
  window.location.href = 'http://127.0.0.1:5500/'
}

function removeItem(id) {
  orderItems = orderItems.filter( item => item.id == id)
  renderItems()
}

formItem.addEventListener('submit', event => {
  event.preventDefault()
  const item = {
    "id": convertValues(document.getElementById('itemId').value),
    "name": document.getElementById('itemName').value,
    "amount": convertValues(document.getElementById('itemAmount').value),
    "value": convertValues(document.getElementById('itemValue').value),
    "discount": convertValues(document.getElementById('itemDiscount').value),
  }
  orderItems.push(item)
  cleanItemData()
  renderItems()
})

saveOrderButton.addEventListener('click', () => {
  switch (operation) {
    case 'create':
      createOrder()
      break;

    case 'update':
      updateOrder()
      break;
  
    default:
      break;
  }
})
