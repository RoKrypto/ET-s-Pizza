const hamburgerMenu = document.getElementById('hamburger__menu');
const nav = document.getElementById('nav__menu');
const searchMenu = document.getElementById('search__menu');
const searchForm = document.getElementById('search__form');
const cartButton = document.getElementById('cart__button');
const shoppingCart = document.getElementById('shopping__cart');
const shoppingCartEmptyContent = document.getElementById('et__pizza__cart__empty__content');
const featuredFlavorsList = document.getElementById('featured__flavors__list');

function sumAmounts(previousAmount, currentAmount) {
	return previousAmount + currentAmount;
}

function amountFormatter(amount) {
	const formatter = new Intl.NumberFormat('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
	
	return formatter.format(amount);
}

function getTotalAmount() {
	// Get subtotals and map them to get their values in number format
	const subtotals = Array.from(document.querySelectorAll('.et__pizza__cart__loaded__item__subtotal__amount')).map(subtotal => parseFloat(subtotal.textContent));
	//Make addition
	let totalAmount = 0;
	if(subtotals.length < 2) {
		totalAmount += subtotals[0];
	} else {
		totalAmount += subtotals.reduce(sumAmounts);
	}

	return totalAmount;
}

function updateTotalAmount(totalAmount) {
	const totalAmountToPayNumber = document.getElementById('et__pizza__cart__checkout__amount__number');
	totalAmountToPayNumber.textContent = amountFormatter(totalAmount);
}

hamburgerMenu.addEventListener('click', () => {
	hamburgerMenu.classList.toggle('active');
	nav.classList.toggle('show');
});

searchMenu.addEventListener('click', () => {
	searchMenu.classList.toggle('active');
	searchForm.classList.toggle('show');
});

cartButton.addEventListener('click', () => {
	cartButton.classList.toggle('active');
	shoppingCart.classList.toggle('show');
});

featuredFlavorsList.addEventListener('click', e => {
	// Check if "Add to cart" button was clicked
	if(e.target.matches('.js__et__featured__flavors__cart__button')) {
		
		// If Shopping Cart is empty... 
		if(!shoppingCartEmptyContent.classList.contains('hide')) {
			// Hide empty content message
			shoppingCartEmptyContent.classList.add('hide');
			// Create shopping cart list element
			const shoppingCartList = document.createElement('ul');
			// Add classes to shopping cart list element
			shoppingCartList.classList.add('list__reset', 'et__pizza__cart__loaded__list');
			// Add id to shopping cart list element
			shoppingCartList.id = 'et__pizza__cart__loaded__list';
			// Add shopping cart list element to the DOM
			shoppingCart.insertAdjacentElement('beforeend', shoppingCartList);
		}

		// Get some details about clicked product
		const productItem = e.target.closest('.js__et__featured__flavors__list__item');
		const productDetails = {
			price: parseFloat(productItem.querySelector('.js__et__featured__flavors__price').textContent),
			qty: parseInt(productItem.querySelector('.js__et__featured__flavors__quantifier').value)
		};

		//Check if clicked product is already added in shopping cart
		const shoppingCartList = document.getElementById('et__pizza__cart__loaded__list');
		const productPossiblyAddedAlready = shoppingCartList.querySelector(`.et__pizza__cart__loaded__list__item[data-flavor = "${productItem.dataset.flavor}"]`);
		// If it is...
		if(productPossiblyAddedAlready !== null) {
			// Get product new qty
			productDetails['qty'] = parseInt(productItem.querySelector('.js__et__featured__flavors__quantifier').value);
			// Update product qty in shopping cart list item
			productPossiblyAddedAlready.querySelector('.et__pizza__cart__item__qty').textContent = productDetails['qty'];
			productPossiblyAddedAlready.querySelector('.et__pizza__cart__loaded__item__subtotal__amount').textContent = amountFormatter(productDetails['qty'] * productDetails.price);
		} else {
			// Get the rest of the clicked product details
			productDetails['id'] = productItem.dataset.flavor;
			productDetails['imgThumbnail'] = {
				imgSrc: productItem.querySelector('.js__et__featured__flavors__img').src,
				imgAlt: productItem.querySelector('.js__et__featured__flavors__img').alt
			};
			productDetails['name'] = productItem.querySelector('.js__et__featured__flavors__name').textContent;
			//Create shopping cart list item element
			const shoppingCartListItem = document.createElement('li');
			// Add classes to shopping cart list item element
			shoppingCartListItem.classList.add('et__pizza__cart__loaded__list__item');
			// Add flavor code to shopping cart list item element
			shoppingCartListItem.dataset.flavor = productDetails['id'];
			// Populate shopping cart list item element with product details
			shoppingCartListItem.innerHTML = `<figure class="figure__reset et__pizza__cart__loaded__item__figure"><img src="${productDetails['imgThumbnail']['imgSrc']}" alt="${productDetails['imgThumbnail']['imgAlt']}" class="et__pizza__cart__loaded__item__img"><figcaption class="et__pizza__cart__loaded__item__figcaption"><p class="et__pizza__cart__loaded__item__name">${productDetails['name']}</p><p class="et__pizza__cart__loaded__item__count"><span class="et__pizza__cart__item__qty">${productDetails['qty']}</span> x USD ${amountFormatter(productDetails['price'])}</p></figcaption></figure><p class="et__pizza__cart__loaded__item__subtotal">USD <span class="et__pizza__cart__loaded__item__subtotal__amount">${amountFormatter(productDetails['qty'] * productDetails['price'])}</span></p><button type="button" class="button__reset et__pizza__cart__loaded__item__trash__button"><svg viewBox="0 0 22 24" class="et__pizza__cart__loaded__item__trash__icon" aria-hidden="true"><use href="./assets/imgs/svg/icons.svg#trash__can"></use></svg><span class="screen__reader__text">Delete ${productDetails['name']}</span></button>`;
			shoppingCartList.insertAdjacentElement('beforeend', shoppingCartListItem);
		}

		// Check if total amount to pay section is already in shopping cart
		const totalAmountToPaySection = document.getElementById('et__pizza__cart__checkout');
		if(totalAmountToPaySection === null) {
			// Create total amount to pay section
			const totalAmountSection = document.createElement('div');
			// Add classes to total amount section
			totalAmountSection.classList.add('et__pizza__cart__checkout');
			// Add id to total amount section
			totalAmountSection.id = 'et__pizza__cart__checkout';
			// Populate total amount section
			totalAmountSection.innerHTML = `<p class="et__pizza__cart__checkout__amount">USD <span id="et__pizza__cart__checkout__amount__number">${amountFormatter(getTotalAmount())}</span></p><a class="et__pizza__cart__checkout__link" href="#">Checkout<svg viewBox="0 0 25 8" class="et__pizza__cart__checkout__arrow__icon" aria-hidden="true"><use href="./assets/imgs/svg/icons.svg#checkout__arrow"></use></svg></a>`;
			// Add total amount to pay section to the DOM
			shoppingCart.insertAdjacentElement('beforeend', totalAmountSection);
		} else {
			//Update total amount to pay
			updateTotalAmount(amountFormatter(getTotalAmount()));
		}

	}
})

// Check to determine what trash button was clicked
shoppingCart.addEventListener('click', e => {
	if(e.target.matches('.et__pizza__cart__loaded__item__trash__button')) {
		const listItem = e.target.closest('.et__pizza__cart__loaded__list__item');
		const shoppingCartList = document.getElementById('et__pizza__cart__loaded__list');
		//Check number of list items remaining
		if(shoppingCartList.children.length === 1) {
			const totalAmountToPaySection = document.getElementById('et__pizza__cart__checkout');
			const elementsToDelete = [shoppingCartList, totalAmountToPaySection];
			elementsToDelete.forEach(element => shoppingCart.removeChild(element));
			shoppingCartEmptyContent.classList.remove('hide');
		} else {
			shoppingCartList.removeChild(listItem);
			updateTotalAmount(amountFormatter(getTotalAmount()));
		}
	}
})