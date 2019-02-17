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

  var amount = (parseFloat(document.getElementById('amount').value) * 100) || 10000;
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
  var amount = (parseFloat(document.getElementById('amount').value) * 100) || 10000;
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

var paymentForm = document.getElementById('paymentForm');
paymentForm.addEventListener('submit', function(event) {
  event.preventDefault();

  stripe.createToken(card).then(function(result) {
    if (result.error) {
      var errorElement = document.getElementById('card-errors');
      errorElement.textContent = result.error.message;
    } else {
      stripeTokenHandler(result.token).then(function(response) {
        if (response.ok) {
          response.json().then(function (responseObj) {
            console.log(responseObj);
          })
        } else {
          console.log('Charge error!');
        }
      })
    }
  })
})

function stripeTokenHandler (token) {
  var amount = (parseFloat(document.getElementById('amount').value) * 100) || 10000;
  var name = document.getElementById('first_name').value + " " + document.getElementById('last_name').value;
  console.log("name: " + name);
  var description = "Donation from " + name;
  var statement_descriptor = "Summer in the City";

  return fetch('./../server/submitChargeToStripe.php', {
    method: 'POST',
    body: JSON.stringify({
      amount: amount,
      currency: 'usd',
      source: token.id,
      description: description,
      statement_descriptor: statement_descriptor,
    }),
    headers: {'content-type': 'application/json'},
  });
}

function toggleTributeInfo () {
  if (event.target.checked) {
    console.log(event.target.checked);
    document.getElementById('tributeInfo').style.display = 'block';
    document.getElementById('tributeRow').style.marginBottom = '15px';
  } else {
    console.log(event.target.checked);
    document.getElementById('tributeInfo').style.display = 'none';
    document.getElementById('tributeRow').style.marginBottom = '30px';
    document.getElementById('tribute_first_name').value = '';
    document.getElementById('tribute_last_name').value = '';
    document.getElementById('tribute_phone').value = '';
    document.getElementById('tribute_email').value = '';
  }
}
