# Run this script as Administrator to map mcbyrnecreative.com to localhost.
$hostsPath = "$env:SystemRoot\System32\drivers\etc\hosts"
$marker = "# my-website local dev"

if (Select-String -Path $hostsPath -Pattern "mcbyrnecreative.com" -Quiet) {
  Write-Host "mcbyrnecreative.com is already in your hosts file."
  exit 0
}

Add-Content -Path $hostsPath -Value @"

$marker
127.0.0.1 mcbyrnecreative.com
127.0.0.1 www.mcbyrnecreative.com
"@

Write-Host "Added mcbyrnecreative.com -> 127.0.0.1"
Write-Host "Start the site with: npm run dev:domain"
Write-Host "Then open: https://mcbyrnecreative.com/"
