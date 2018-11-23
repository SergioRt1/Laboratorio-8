var OrdersController = (function () {

    var numberTable = 1;
    var GlobalOrders = {};

    function clearTables() {
        var content = document.getElementById("content");
        var tables = document.getElementsByClassName("table");
        while (tables.length > 0) {
            content.removeChild(tables[0]);
        }
        var titles = document.getElementsByClassName("table-title");
        while (titles.length > 0) {
            content.removeChild(titles[0]);
        }
        numberTable = 1;
    }

    function clearSelectTable() {
        var selectTable = document.getElementById("selectTable");
        var options = document.getElementsByClassName("option-select");
        while (options.length > 0) {
            selectTable.removeChild(options[0]);
        }
        var selectProducts = document.getElementById("ItemName");
        var options = document.getElementsByClassName("product-select");
        while (options.length > 0) {
            selectProducts.removeChild(options[0]);
        }
    }

    function clearList() {
        var listOrders = document.getElementById("listOrders");
        var options = document.getElementsByClassName("product-displayed");
        while (options.length > 0) {
            listOrders.removeChild(options[0]);
        }

    }

    function addOrder(order) {
        var tableOrder = document.createElement("table");
        var header = document.createElement("tr");
        var cell = document.createElement("th");
        cell.innerHTML = "Product";
        header.appendChild(cell);
        var cell = document.createElement("th");
        cell.innerHTML = "Quantity";
        header.appendChild(cell);
        var cell = document.createElement("th");
        cell.innerHTML = "Price";
        header.appendChild(cell);
        tableOrder.appendChild(header);
        tableOrder.setAttribute("class", "table");
        for (var i = 0; i < order.products.length; i++) {
            var row = document.createElement("tr");

            var cell = document.createElement("td");
            cell.innerHTML = order.products[i].product;
            row.appendChild(cell);

            var cell = document.createElement("td");
            cell.innerHTML = order.products[i].quantity;
            row.appendChild(cell);

            var cell = document.createElement("td");
            cell.innerHTML = order.products[i].price;
            row.appendChild(cell);

            tableOrder.appendChild(row);
        }
        var title = document.createElement("h4");
        title.setAttribute("class", "table-title");
        title.innerHTML = "Table " + numberTable++;
        var firstTable = document.getElementById("HTMLtable");
        content.insertBefore(tableOrder, firstTable);
        content.insertBefore(title, tableOrder);
    }

    function loadProducts(product) {
        var selectTable = document.getElementById("ItemName");
        var option = document.createElement("option");
        option.setAttribute("class", "product-select");
        option.innerHTML = product.name;
        selectTable.appendChild(option);
        $('#ItemName').selectpicker('refresh');
    }

    function loadTables(order) {
        var selectTable = document.getElementById("selectTable");
        var option = document.createElement("option");
        option.innerHTML = "Table " + order.order_id;
        option.setAttribute("class", "option-select");
        selectTable.appendChild(option);
        $('#selectTable').selectpicker('refresh');
    }

    function putInDiv(component) {
        var newDiv = document.createElement("div");
        newDiv.setAttribute("class", "grid-item product-displayed");
        newDiv.appendChild(component);
        return newDiv;
    }

    function getSelectedTable() {
        var selectedTable = document.getElementById("selectTable");
        var tableLabel = selectedTable.options[selectedTable.selectedIndex].value;
        var table = tableLabel.match(/(\d+)/g)[0];
        return table;
    }

    function loadList() {
        clearList();
        var table = getSelectedTable();
        var listOrders = document.getElementById("listOrders");
        for (product in GlobalOrders[table]) {

            var productName = document.createElement("span");
            productName.setAttribute("class", "label label-default");
            productName.setAttribute("id", "name " + product);
            productName.innerHTML = GlobalOrders[table][product].product;

            var productQuantity = document.createElement("input");
            productQuantity.setAttribute("class", "label label-default");
            productQuantity.setAttribute("value", GlobalOrders[table][product].quantity);
            productQuantity.setAttribute("placeholder", "Quantity");
            productQuantity.setAttribute("id", "quantity " + product);

            var updateButton = document.createElement("button");
            updateButton.setAttribute("type", "submit");
            updateButton.setAttribute("name", GlobalOrders[table][product].product);
            updateButton.setAttribute("class", "btn btn-default");
            updateButton.setAttribute("id", "update " + product);
            updateButton.setAttribute("onclick", "OrdersController.updateOrderItem(this.id)");
            updateButton.innerHTML = "Update";


            var deleteButton = document.createElement("button");
            deleteButton.setAttribute("type", "submit");
            deleteButton.setAttribute("name", GlobalOrders[table][product].product);
            deleteButton.setAttribute("class", "btn btn-default");
            deleteButton.setAttribute("id", "delete " + product);
            deleteButton.setAttribute("onclick", "OrdersController.deleteOrderItem(this.id)");
            deleteButton.innerHTML = "Delete";

            listOrders.appendChild(putInDiv(productName));
            listOrders.appendChild(putInDiv(productQuantity));
            listOrders.appendChild(putInDiv(updateButton));
            listOrders.appendChild(putInDiv(deleteButton));
        }
    }

    function deleteOrderItem(idButton) {
        var productId = idButton.match(/(\d+)/g)[0];
        var productName = document.getElementById("name " + productId).innerText;
        var table = getSelectedTable();
        GlobalOrders[table].splice(productId,1);
        RestaurantRestController.deleteOrder(table, productName, helperDelete);

    }

    function updateOrderItem(idButton) {
        var productId = idButton.match(/(\d+)/g)[0];
        var table = getSelectedTable();
        var productName = document.getElementById("name " + productId).innerText;
        var quantity = document.getElementById("quantity " + productId).value;
        GlobalOrders[table][productId].quantity = quantity;
        RestaurantRestController.updateOrder(table, quantity, productName, helperUpdate);
    }

    function addItemToOrder() {
        var selectName = document.getElementById("ItemName");
        var productName = selectName.options[selectName.selectedIndex].value;
        var quantityInput = document.getElementById("quantity");
        var quantity = quantityInput.value;
        var table = getSelectedTable();
        RestaurantRestController.addDish(table, quantity, productName, helperAdd);
    }

    function helperDelete(table, productName) {
        loadList();
        alert("Deleted in Table " + table + " " + productName);
    }

    function helperUpdate(table, productName, quantity) {
        loadList();
        alert("Updated in Table " + table + " " + productName + " x " + quantity);
    }

    function helperAdd(table, productName, quantity) {
        loadList();
        alert("Added in Table " + table + " " + productName + " x " + quantity);
    }

    function loadItems(orders, products) {
        clearSelectTable();
        GlobalOrders = {};
        for (i in orders) {
            var order = orderBuilder(orders[i], products);
            loadTables(order);
            GlobalOrders[order.table_id] = order.products;
        }
        for (i in products) {
            loadProducts(products[i]);
        }
    }

    function loadToUpdate() {
        loadData(loadItems);
    }

    function loadOrders() {
        clearTables();
        loadData(buildOrders);
    }

    function buildOrders(orders, products) {
        for (i in orders) {
            var order = orderBuilder(orders[i], products);
            addOrder(order);
        }
    }

    function loadData(callback) {
        axios.all([RestaurantRestController.getOrders(), RestaurantRestController.getProducts()])
                .then(axios.spread(function (orders, products) {
                    callback(orders, products);
                }));
    }

    function orderBuilder(orderJson, productsJson) {
        var order = {order_id: orderJson.tableNumber, table_id: orderJson.tableNumber, products: []};
        for (productName in orderJson.orderAmountsMap) {
            var prod = {"product": productName, "quantity": orderJson.orderAmountsMap[productName], "price": null}
            prod.price = productsJson.filter(function (x) {
                return x.name === productName;
            })[0].price;
            order.products.push(prod);
        }
        return order;
    }
    return {
        loadOrders: loadOrders,
        loadToUpdate: loadToUpdate,
        loadList: loadList,
        addItemToOrder: addItemToOrder,
        updateOrderItem: updateOrderItem,
        deleteOrderItem: deleteOrderItem
    };
})();