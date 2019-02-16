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
    amount: 10000,
    label: "Donation",
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

prButton.on('click', function(ev) {
  ev.preventDefault();

  var amount = (parseInt(document.getElementById('amount').value) * 100) || 10000;
  console.log(amount);

  paymentRequest.update({
    total: {
      amount: amount,
      label: "Donation"
    }
  })

  paymentRequest.show();
})

paymentRequest.on('token', function(ev) {
  var amount = (parseInt(document.getElementById('amount').value) * 100) || 10000;
  var name = document.getElementById('first_name').value + " " + document.getElementById('last_name').value;
  console.log("name: " + name);
  var description = "Donation from " + name;
  var statement_descriptor = "Summer in the City";

  fetch('./../server/submitChargeToStripe.php', {
    method: 'POST',
    body: JSON.stringify({
      amount: amount,
      currency: 'usd',
      source: ev.token.id,
      description: description,
      statement_descriptor: statement_descriptor,
    }),
    headers: {'content-type': 'application/json'},
  }).then(function (response) {
    if (response.ok) {
      var responseObj = response.json();
      console.log(responseObj);
      ev.complete('success');
    } else {
      ev.complete('fail')
    }
  })
})

function toggleTributeInfo () {
  if (event.target.checked) {
    console.log(event.target.checked);
    document.getElementById('tributeInfo').style.display = 'block';
  } else {
    console.log(event.target.checkd);
    document.getElementById('tributeInfo').style.display = 'none';
  }
}
