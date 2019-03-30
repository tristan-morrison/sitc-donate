<?php
  require_once 'airtable_api_info.php';

  $inputJSON = file_get_contents('php://input');
  $input = json_decode($inputJSON, TRUE);

  $donationInfo = $input['info'];

  $curl = curl_init("https://api.airtable.com/v0/$airtable_base_id/Online%20Donations");

  $headers = array(
    "Authorization: Bearer $airtable_api_key",
    "Content-Type: application/json"
  );

  $fields = array();
  foreach ($donationInfo as $fieldId => $value) {
    $fieldName = getFieldName($fieldId);
    $fields[$fieldName] = $value;
  }

  $fieldsObj = array(
    "fields" => $fields
  );

  $data_str = json_encode($fieldsObj);

  curl_setopt($curl, CURLOPT_CUSTOMREQUEST, "POST");
  curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);
  curl_setopt($curl, CURLOPT_POSTFIELDS, $data_str);

  // automatically echoes the result
  curl_exec($curl);


  function getFieldName ($fieldId) {
    $fieldNames = array(
      "firstName" => "Donor First Name",
      "lastName" => "Donor Last Name",
      "email" => "Donor Email",
      "phone" => "Donor Phone",
      "tributeFirstName" => "Tribute First Name",
      "tributeLastName" => "Tribute Last Name",
      "tributeEmail" => "Tribute Email",
      "tributePhone" => "Tribute Phone",
      "notes" => "Notes",
      "amountPaid" => "Amount Paid",
      "paymentToken" => "Stripe Payment Token"
    );

    return $fieldNames[$fieldId];
  }

?>
