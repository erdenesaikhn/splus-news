<?php
// mobinet.json доторх файлуудыг public_html руу задлана. api/config.php-д хүрэхгүй.
$dest = getenv('DEPLOYPATH') ?: '/home/splusmn/public_html/';
$b = json_decode(file_get_contents(__DIR__ . '/mobinet.json'), true);
foreach ($b as $p => $data) {
  if ($p === 'api/config.php' || strpos($p, '..') !== false) continue;
  $f = rtrim($dest, '/') . '/' . $p;
  @mkdir(dirname($f), 0755, true);
  file_put_contents($f, base64_decode($data));
}
echo "OK " . count($b) . " files\n";
