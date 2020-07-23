const tableBody = document.getElementById('table-body')
const modalChangeSituation = document.getElementById('modalSituation')

let actualId

const baseURL = 'http://localhost:3000/orders'
const headers = new Headers({"Content-Type": "application/json", "Access-Control-Allow-Origin": "*"}) 

function saveOrder() {
  if (orderOperation === 'create') {

  } else if (orderOperation === 'update') {

  }
}

function goToOrderPage(operation, orderId) {
  switch (operation) {
    case 'create':
      window.location.href = "./pedido/index.html"
      break;

    case 'update':
      window.location.href = `./pedido/index.html?id=${orderId}`
      break;
  
    default:
      break;
  }
}
async function getAllOrders() {
  let response = await fetch(baseURL, { method: 'get' })

  return response.json()
}

async function getSingleOrder(id) {
  let response = await fetch(`${baseURL}/${id}`, { method: 'get' })

  return response.json()
}

function setActualId(id) {
  actualId = id
}

function changeSituation(aprove) {
  const situation = aprove ? 'Aprovado' : 'Cancelado'
  getSingleOrder(actualId).then(order => {
    order.situation = situation
    delete order.id
    console.log(JSON.stringify(order))
  fetch(`${baseURL}/${actualId}`, { method: 'put', body: JSON.stringify(order), headers })
  })
}

getAllOrders().then(orders => {
  tableBody.innerHTML = ''
  orders.map(order => {
    tableBody.innerHTML += `
      <tr>
        <th scope="col">${order.id}</th>
        <td>${order.date}</td>
        <td>${order.description}</td>
        <td>${order.situation}</td>
        <td><button onclick="setActualId(${order.id})" type="button" class="btn btn-primary" data-toggle="modal" data-target="#modalSituation"><i class="fa fa-cart-arrow-down" aria-hidden="true"></i></button></td>
        <td><button onclick="goToOrderPage('update', ${order.id})" type="button" class="btn btn-warning" data-toggle="modal" data-target="#modalOrder"><i class="fa fa-edit" aria-hidden="true"></i></button></td>
      </tr>`
  })
})
