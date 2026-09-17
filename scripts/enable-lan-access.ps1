# Run in PowerShell as Administrator:
#   Set-ExecutionPolicy -Scope Process Bypass -Force; .\scripts\enable-lan-access.ps1

Write-Host "`n=== Mizoon LAN access setup ===`n" -ForegroundColor Cyan

# 1. Set Wi-Fi to Private (Public blocks many local connections)
try {
  Set-NetConnectionProfile -InterfaceAlias "Wi-Fi" -NetworkCategory Private
  Write-Host "[OK] Wi-Fi set to Private network" -ForegroundColor Green
} catch {
  Write-Host "[SKIP] Could not set Wi-Fi profile: $_" -ForegroundColor Yellow
}

# 2. Firewall: allow port 3000
$portRule = Get-NetFirewallRule -DisplayName "Mizoon Dev 3000" -ErrorAction SilentlyContinue
if (-not $portRule) {
  netsh advfirewall firewall add rule name="Mizoon Dev 3000" dir=in action=allow protocol=TCP localport=3000 profile=any
  Write-Host "[OK] Added firewall rule for port 3000" -ForegroundColor Green
} else {
  Write-Host "[OK] Firewall rule for port 3000 already exists" -ForegroundColor Green
}

# 3. Firewall: allow Node.js
$nodePath = (Get-Command node -ErrorAction SilentlyContinue).Source
if ($nodePath) {
  $nodeRule = Get-NetFirewallRule -DisplayName "Node.js Mizoon" -ErrorAction SilentlyContinue
  if (-not $nodeRule) {
    netsh advfirewall firewall add rule name="Node.js Mizoon" dir=in action=allow program="$nodePath" enable=yes profile=any
    Write-Host "[OK] Added firewall rule for $nodePath" -ForegroundColor Green
  } else {
    Write-Host "[OK] Node.js firewall rule already exists" -ForegroundColor Green
  }
}

# 4. Show URLs
Write-Host "`n--- Use these URLs from other devices ---`n" -ForegroundColor Cyan
Get-NetIPAddress -AddressFamily IPv4 |
  Where-Object { $_.IPAddress -notlike '127.*' -and $_.PrefixOrigin -ne 'WellKnown' -and $_.IPAddress -notlike '169.254.*' } |
  ForEach-Object {
    Write-Host "  http://$($_.IPAddress):3000  ($($_.InterfaceAlias))" -ForegroundColor White
  }

Write-Host "`n--- If Wi-Fi still fails, use Mobile Hotspot ---`n" -ForegroundColor Yellow
Write-Host "  1. Settings > Network > Mobile hotspot > Turn ON"
Write-Host "  2. Connect your phone to the PC hotspot Wi-Fi"
Write-Host "  3. Open: http://192.168.137.1:3000`n"
