<?php

  // API key loads from here so that test key is used in dev environ but live key is used on server
  require_once 'stripe_api_key.php';
  require_once __DIR__ . '/stripe-php/init.php';
  
  $inputJSON = file_get_contents('php://input');
  $input = json_decode($inputJSON, TRUE);
  $chargeId = $input['chargeId'];

  \Stripe\Stripe::setApiKey($stripeAPIKey_sk);

  $charge = \Stripe\Charge::retrieve($chargeId);
  $charge->capture();

?>

<?php
  function sanitize($var) {
    $clean_var = filter_var($var, FILTER_SANITIZE_STRING);
    return $clean_var;
  }
?>
