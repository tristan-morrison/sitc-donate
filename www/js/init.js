(function($){
  $(function(){

    $('.sidenav').sidenav();
    $('.parallax').parallax();

  }); // end of document ready
})(jQuery); // end of jQuery name space

var stripe = Stripe('pk_test_MAi5X0RDzUYfCXELpoSOZ3nS');
var elements = stripe.elements();

var card = elements.create('card');
card.mount('#card_element');

card.addEventListener('change', function(event) {
  var displayError = document.getElementById('card-errors');
  if (event.error) {
    displayError.textContent = event.error.message;
  } else {
    displayError.textContent = '';
  }
});

var paymentRequest = stripe.paymentRequest({
  country: 'US',
  currency: 'usd',
  total: {
    label: 'Demo total',
    amount: 1000,
  },
  requestPayerName: true,
  requestPayerEmail: true,
});

var prButton = elements.create('paymentRequestButton', {
  paymentRequest: paymentRequest,
});

// Check the availability of the Payment Request API first.
paymentRequest.canMakePayment().then(function(result) {
  console.log(result);
  if (result) {
    prButton.mount('#paymentRequestButtonContainer');
  } else {
    document.getElementById('paymentRequestButtonContainer').style.display = 'none';
  }
});
