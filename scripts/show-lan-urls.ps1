# No admin needed — just prints URLs to try
Write-Host "`nMizoon LAN URLs (dev server must be running):`n" -ForegroundColor Cyan
Get-NetIPAddress -AddressFamily IPv4 |
  Where-Object { $_.IPAddress -notlike '127.*' -and $_.PrefixOrigin -ne 'WellKnown' -and $_.IPAddress -notlike '169.254.*' } |
  ForEach-Object {
    Write-Host "  http://$($_.IPAddress):3000  ($($_.InterfaceAlias))"
  }
Write-Host "`nHotspot (if enabled): http://192.168.137.1:3000`n"
