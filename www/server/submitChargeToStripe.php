<?php

  // API key loads from here so that test key is used in dev environ but live key is used on server
  require_once 'stripe_api_key.php';
  require_once __DIR__ . '/stripe-php/init.php';


  $inputJSON = file_get_contents('php://input');
  $input = json_decode($inputJSON, TRUE);

  $amount = isset($input["amount"]) ? sanitize($input["amount"]) : "";
  $currency = isset($input["currency"]) ? sanitize($input["currency"]) : "";
  $description = isset($input["description"]) ? sanitize($input["description"]) : "";
  $shipping = isset($input["shipping"]) ? sanitize($input["shipping"]) : "";
  $source = isset($input["source"]) ? sanitize($input["source"]) : "";
  $statement_descriptor = isset($input["statement_descriptor"]) ? sanitize($input["statement_descriptor"]) : "Summer in the City";

  \Stripe\Stripe::setApiKey($stripeAPIKey_sk);

  $chargeParams = array(
    "amount" => $amount,
    "currency" => $currency,
    "source" => $source,
    "description" => $description,
    "statement_descriptor" => $statement_descriptor,
    "capture" => false
  );

  try {
    $charge = \Stripe\Charge::create($chargeParams);
  } catch (\Stripe\Error\Card $e) {
    $response = $e->getJsonBody();
    $err = $response['error'];

    http_response_code($e->getHttpStatus());
    echo json_encode($err);
    // echo 'Error type: ' . $err['type'] . "\n";
    // echo 'Error code: ' . $err['code'] . "\n";
    // echo 'Error message: ' . $err['message'] . "\n";
  } catch (\Stripe\Error\InvalidRequest $e) {

    // echo "Invalid request!";
    // echo $e->getHttpStatus();

    $response = $e->getJsonBody();
    $err = $response['error'];

    http_response_code($e->getHttpStatus());
    echo json_encode($err);
    // echo 'Error type: ' . $err['type'] . "\n";
    // echo 'Error code: ' . $err['code'] . "\n";
    // echo 'Error message: ' . $err['message'] . "\n";
  } catch (\Stripe\Error\Base $e) {
    $response = $e->getJsonBody();
    $err = $response['error'];

    http_response_code($e->getHttpStatus());
    echo json_encode($err);
    // echo 'Error type: ' . $err['type'] . "\n";
    // echo 'Error code: ' . $err['code'] . "\n";
    // echo 'Error message: ' . $err['message'] . "\n";
  }

  if (isset($charge)) {
    http_response_code(200);
    echo json_encode($charge);
  }

?>

<?php
  function sanitize($var) {
    $clean_var = filter_var($var, FILTER_SANITIZE_STRING);
    return $clean_var;
  }
?>
