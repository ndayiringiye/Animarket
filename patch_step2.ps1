$utf8 = New-Object System.Text.UTF8Encoding($false)
$p = (Resolve-Path ".\frontend\src\Pages\Dashboards\Admin\AdminDashboard.tsx").Path
$t = [IO.File]::ReadAllText($p)
$nl = if ($t.Contains("`r`n")) { "`r`n" } else { "`n" }

if ($t.Contains('AnimalPassportsView')) {
  "AdminDashboard: already patched"
} else {
  $sw = "\) : activeView === 'animals' \? \("
  if ([regex]::Matches($t, $sw).Count -ne 1) {
    "AdminDashboard: view-switch anchor not found exactly once, NOT changed"
  } else {
    $t = [regex]::Replace($t, $sw, ") : activeView === 'passports' ? ($nl            <AnimalPassportsView />$nl          ) : activeView === 'animals' ? (")

    $t1 = "(:\s*)activeView === 'animals'(\s*\?\s*)'All Livestock'"
    if ([regex]::Matches($t, $t1).Count -eq 1) {
      $t = [regex]::Replace($t, $t1, "`$1activeView === 'passports'`$2'Animal Passports'`$1activeView === 'animals'`$2'All Livestock'")
    } else { "title anchor skipped" }

    $t2 = "(:\s*)activeView === 'animals'(\s*\?\s*)'View and manage all registered livestock'"
    if ([regex]::Matches($t, $t2).Count -eq 1) {
      $t = [regex]::Replace($t, $t2, "`$1activeView === 'passports'`$2'Delivery-ready animals with scannable passports'`$1activeView === 'animals'`$2'View and manage all registered livestock'")
    } else { "subtitle anchor skipped" }

    $t = "import AnimalPassportsView from './AnimalPassportsView';$nl" + $t
    [IO.File]::WriteAllText($p, $t, $utf8)
    "AdminDashboard: patched"
  }
}
