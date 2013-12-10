<?php

// Import account info from the account.php
$account = require("account.php");
$aLogin = $account['login'];
$aApp = $account['app'];
$aPassword = $account['password'];

// Base URL 
$aBaseURL = "http://vaas.acapela-group.com/Services/Synthesizer";

/**
 * Allocate a new acapella sound
 */
function acapellaNew($text, $voiceName = 'heather22k', $soundType = 'WAV') {
	global $aLogin, $aApp, $aPassword, $aBaseURL;

	// Prepare request
	$req = array(
			'prot_vers' => 2,
			'cl_env' => 'PHP_APACHE_2.2.15_CENTOS',
			'cl_vers' => '1-30',
			'cl_login' => $aLogin,
			'cl_app' => $aApp,
			'cl_pwd' => $aPassword,
			'req_type' => 'NEW',
			'req_voice' => $voiceName,
			'req_text' => $text,
			'req_snd_type' => $soundType,
			'req_asw_type' => 'INFO',

			// Word sync info
			'req_wp' => 'ON'
		);

	// Send request
	$options = array(
		'http' => array(
			'header'  => "Content-type: application/x-www-form-urlencoded\r\n",
			'method'  => 'POST',
			'content' => http_build_query($req),
		),
	);

	// Open stream
	$context  = stream_context_create($options);
	$result = file_get_contents($aBaseURL, false, $context);

	// Analyze response
	if ($result == "") return false;
	$vars = array();
	parse_str( $result, $vars );

	// Check for errors
	if ($vars['res'] != 'OK') return false;

	// Load the word timing info
	$wpBuffer = file_get_contents( $vars['wp_url'] );
	$words = explode("\n", $wpBuffer);

	// Map between word contents and timestamp
	$wordParts = array( );
	foreach ($words as $i => $v) {
		if (trim($v) == "") continue;

		$parts = explode("=", $v);
		$time = $parts[0];
		$parts = explode("/", $parts[1]);
		$offset = $parts[1];
		$end = strpos( $text, ' ', $offset );
		if ($end === false) $end = strlen($text);
		$len = $end - $offset;

		$w = substr($text, $offset, $len);

		// Map timestamp & Offset
		$wordParts[] = array( $time, $w );
	}

	// Return sound info
	return array(
			'id' => $vars['snd_id'],
			'soundURL' => $vars['snd_url'],
			'wordURL' => $vars['wp_url'],
			'duration' => $vars['snd_time'],
			'size' => $vars['snd_size'],
			'words' => $wordParts
		);
}

/**
 * Delete an acapella sound
 */
function acapellaDelete($id) {
	global $aLogin, $aApp, $aPassword, $aBaseURL;

	// Prepare request
	$req = array(
			'prot_vers' => 2,
			'cl_env' => 'PHP_APACHE_2.2.15_CENTOS',
			'cl_vers' => '1-30',
			'cl_login' => $aLogin,
			'cl_app' => $aApp,
			'cl_pwd' => $aPassword,
			'req_type' => 'DEL',
			'req_snd_id' => $id
		);

	// Send request
	$options = array(
		'http' => array(
			'header'  => "Content-type: application/x-www-form-urlencoded\r\n",
			'method'  => 'POST',
			'content' => http_build_query($req),
		),
	);

	// Open stream
	$context  = stream_context_create($options);
	$result = file_get_contents($aBaseURL, false, $context);

	// Analyze response
	if ($result == "") return false;
	$vars = array();
	parse_str( $result, $vars );

	// Check for errors
	if ($vars['res'] != 'OK') return false;

	// OK
	return true;

}

/**
 * Delete an acapella sound
 */
function acapellaGet($id) {
	global $aLogin, $aApp, $aPassword, $aBaseURL;

	// Prepare request
	$req = array(
			'prot_vers' => 2,
			'cl_env' => 'PHP_APACHE_2.2.15_CENTOS',
			'cl_vers' => '1-30',
			'cl_login' => $aLogin,
			'cl_app' => $aApp,
			'cl_pwd' => $aPassword,
			'req_type' => 'GET',
			'req_snd_id' => $id
		);

	// Send request
	$options = array(
		'http' => array(
			'header'  => "Content-type: application/x-www-form-urlencoded\r\n",
			'method'  => 'POST',
			'content' => http_build_query($req),
		),
	);

	// Open stream
	$context  = stream_context_create($options);
	$result = file_get_contents($aBaseURL, false, $context);

	// Analyze response
	if ($result == "") return false;
	$vars = array();
	parse_str( $result, $vars );

	// Check for errors
	if ($vars['res'] != 'OK') return false;

	// Return sound info
	return array(
			'soundURL' => $vars['snd_url'],
			'wordURL' => $vars['wp_url'],
			'duration' => $vars['snd_time'],
			'size' => $vars['snd_size']
		);

}


// Check if we have a string to process
$text = $_GET['text'];
if (isset($text)) {

	// Guess voice
	$voice = $_GET['voice'];
	if (!isset($voice)) $voice='heather22k';

	// Create new text
	$info = acapellaNew($text, $voice);

	// Build response
	if ($info == false) {
		echo json_encode(array(
				'res' => "error",
				'err_msg' => 'Unable to create sound object'
			));
	} else {

		$info['res'] = 'ok';
		echo json_encode($info);

		// Debugging - Delete audio afterwards
		//acapellaDelete($info['id']);

	}
}



?>