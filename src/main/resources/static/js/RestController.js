var RestaurantRestController = (function (){
    var url = '';

    function getOrders() {
        return axios.get(url + "/orders").then(function (response) {
            return response.data;
        })
    }

    function getProducts() {
        return axios.get(url + "/orders/products").then(function (response) {
            return response.data;
        })
    }
    
    function updateOrder(orderId,quantity,productName,callBack) {
        axios.put(url + "/orders/"+orderId+"/"+quantity+"/"+productName).then(function (response){
            callBack(orderId,productName,quantity);
        });
    }
    
    function deleteOrder(orderId,itemName,callBack) {
        axios.delete(url + "/orders/"+orderId+"/"+itemName).then(function (response){
            callBack(orderId,itemName);
        });
    }
    
    function addDish(orderId,quantity,productName,callBack) {
        axios.post(url + "/orders/"+orderId+"/"+quantity+"/"+productName).then(function (response){
            callBack(orderId,productName,quantity);
        });
    }
    
    
    
    return {
        getOrders: getOrders,
        getProducts: getProducts,
        updateOrder: updateOrder,
        deleteOrder: deleteOrder,
        addDish: addDish
    };
})();