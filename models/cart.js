module.exports = function Cart(oldCart) {	//cart constructor; change to oldCart, passing oldCart.
	this.items = oldCart.items || {};		//access items of oldCart, fetching old data items to recreate cart
	this.totalQty = oldCart.totalQty || 0; 	//fetching totalQty data from oldCart
	this.totalPrice = oldCart.totalPrice || 0; 	//fetching totalPrice data from oldCart

	this.add = function(item, id) {			//Adding a new product group
		var storedItem = this.items[id];	//if id already exists if product already added to the cart							
		if (!storedItem) {					//if product has not been added to the cart then create a new one
			storedItem = this.items[id] = {item: item, qty: 0, price: 0};	//if product has been added to cart; create new item equal to item id 
		}
		storedItem.qty++;	//increase quantity by 1
		storedItem.price = storedItem.item.price * storedItem.qty; 	//increase price; change to be equal to items price times quantity
		this.totalQty++; 	//increase by 1
		this.totalPrice += storedItem.item.price;	//add to storedItem.price
	};

	this.generateArray = function() { //used to output a list of products group; will give me the cart of items as an array
		var arr = []; 		//an empty array
		for (var id in this.items) { 	//loop through items for the keys
			arr.push(this.items[id]); 	//push the value of each item to the the array
		}
		return arr;	//return the array
	};
};