<?php
echo 'App from SBS3';
echo '<br><br>';
echo 'Options:';
echo '<ul>';
echo '<li><a href="http://localhost/sbs3/sample.html">Frontend Demo (sample.html)</a></li>';
echo '<li><a href="http://localhost/sbs3/backend/tournaments">API: GET Tournaments</a></li>';
echo '<li><a href="http://localhost/sbs3/backend/api.php?action=tournaments">Raw API (api.php)</a></li>';
echo '</ul>';

// Bonus: Link to debug log if it exists
$debugLogPath = __DIR__ . '/backend/debug.log';
if (file_exists($debugLogPath)) {
    echo '<br><a href="http://localhost/sbs3/backend/debug.log">View Debug Log</a>';
}
?>