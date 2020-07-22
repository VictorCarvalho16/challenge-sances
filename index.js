const tableBody = document.getElementById('table-body')
const modalChangeSituation = document.getElementById('modalSituation')
let actualId
const baseURL = 'http://localhost:3000/orders'

async function getAllOrders() {
  let response = await fetch(baseURL, { method: 'get' })

  return response.json()
}

async function getSingleOrder(id) {
  let response = await fetch(`${baseURL}/${id}`, { method: 'get' })

  return response.json()
}


function showModalChangeSituation(id) {
  actualId = id
}

function changeSituation(aprove) {
  
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
        <td><button onclick="showModalChangeSituation(${order.id})" type="button" class="btn btn-primary" data-toggle="modal" data-target="#modalSituation"><i class="fa fa-cart-arrow-down" aria-hidden="true"></i></button></td>
        <td><button onclick="showModalChangeSituation(${order.id})" type="button" class="btn btn-warning"><i class="fa fa-edit" aria-hidden="true"></i></button></td>
      </tr>`
  })
})