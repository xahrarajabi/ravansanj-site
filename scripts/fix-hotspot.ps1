# Run in PowerShell as Administrator to fix Windows Mobile Hotspot DHCP
# Set-ExecutionPolicy -Scope Process Bypass -Force; .\scripts\fix-hotspot.ps1

Write-Host "`n=== Fix Mobile Hotspot (no IP on phone) ===`n" -ForegroundColor Cyan

Write-Host "IMPORTANT: Turn OFF your VPN (Happ/Hiddify/OpenVPN) before using hotspot.`n" -ForegroundColor Yellow
Write-Host "VPN adapters detected on this PC often break hotspot DHCP.`n"

# Restart Internet Connection Sharing services
Write-Host "Restarting hotspot services..." -ForegroundColor Cyan
Stop-Service SharedAccess -Force -ErrorAction SilentlyContinue
Stop-Service icssvc -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2
Start-Service icssvc -ErrorAction SilentlyContinue
Start-Service SharedAccess -ErrorAction SilentlyContinue
Write-Host "[OK] Services restarted`n" -ForegroundColor Green

# Show hotspot adapter
$hotspot = Get-NetAdapter | Where-Object { $_.InterfaceDescription -like "*Wi-Fi Direct*" -and $_.Status -eq "Up" }
if ($hotspot) {
  Write-Host "Hotspot adapter: $($hotspot.Name) — $($hotspot.Status)" -ForegroundColor Green
  $ip = Get-NetIPAddress -InterfaceIndex $hotspot.ifIndex -AddressFamily IPv4 -ErrorAction SilentlyContinue
  if ($ip) { Write-Host "Hotspot IP: $($ip.IPAddress)`n" -ForegroundColor Green }
} else {
  Write-Host "Hotspot adapter not active. Turn on Mobile Hotspot in Settings first.`n" -ForegroundColor Yellow
}

Write-Host "--- Steps ---`n" -ForegroundColor Cyan
Write-Host "1. Disconnect VPN completely (Happ/Hiddify tray icon > Disconnect)"
Write-Host "2. Settings > Network > Mobile hotspot > OFF, wait 5 sec, ON again"
Write-Host "3. 'Share my internet connection from' = Wi-Fi"
Write-Host "4. Connect phone to the hotspot"
Write-Host "5. Open on phone: http://192.168.137.1:3000"
Write-Host ""
Write-Host "--- If phone still gets no IP ---`n" -ForegroundColor Yellow
Write-Host "Option A — USB (Android): Enable USB debugging, connect cable, run:"
Write-Host "  adb reverse tcp:3000 tcp:3000"
Write-Host "  Then open http://localhost:3000 on phone`n"
Write-Host "Option B — Temporary public URL (only while command runs):"
Write-Host "  cloudflared tunnel --url http://localhost:3000"
Write-Host "  Open the trycloudflare.com URL on your phone`n"
