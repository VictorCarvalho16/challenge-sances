const orderDateInput = document.getElementById('orderDate')
const orderDescriptionInput = document.getElementById('orderDescription')
const formItem = document.getElementById('formItem')
const tableBody = document.getElementById('table-body')

let orderItems = []

function loadPage() {
  const orderId = new URLSearchParams(window.location.search).get('id');
  if (orderId) {
    getSingleOrder(orderId).then(order => {

    })
  } else {
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
  return 0
}

async function getSingleOrder(id) {
  let response = await fetch(`${baseURL}/${id}`, { method: 'get' })

  return response.json()
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
  console.log(orderItems)
  cleanItemData()
  renderItems()
})

function convertValues(value) {
  if (value.indexOf(',') > -1) {
    return parseFloat(value.replace(',', '.'))
  }else if (value.indexOf('.') > -1) {
    return parseFloat(value)
  }else {
    return parseInt(value)
  }
}

function convertvaluePtBr(value) {return 'R$ ' + value.toString().replace('.', ',')}

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
    const itemTotal = item.amount + item.value 
    tableBody.innerHTML += `
    <tr>
      <th scope="col">${item.id}</th>
      <td>${item.name}</td>
      <td>${item.amount}</td>
      <td>${convertvaluePtBr(item.value)}</td>
      <td>${item.discount} %</td>
      <td>${itemTotal}</td>
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
      <td>${itemsTotal}</td>
    </tr>`
}