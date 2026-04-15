param(
  [string]$SourceDir,
  [string]$TargetDir,
  [string]$ManifestPath
)

$ErrorActionPreference = "Stop"

if (-not $SourceDir) {
  $SourceDir = Join-Path $PSScriptRoot "..\Music"
}
if (-not $TargetDir) {
  $TargetDir = Join-Path $PSScriptRoot "..\public\music-library"
}
if (-not $ManifestPath) {
  $ManifestPath = Join-Path $PSScriptRoot "..\data\music-manifest.ts"
}

$SourceDir = (Resolve-Path -LiteralPath $SourceDir).Path
$TargetDir = [System.IO.Path]::GetFullPath($TargetDir)
$ManifestPath = [System.IO.Path]::GetFullPath($ManifestPath)

$shell = New-Object -ComObject Shell.Application
$namespace = $shell.Namespace($SourceDir)

$trackConfig = @{
  "WhisperingSpaces.mp3" = @{ priority = 1; title = "Whispering Spaces"; description = "A quiet, meditative piece that works beautifully as an ambient thread through the tribute site."; inspiration = "Chosen as the site's background track for its gentle, reflective atmosphere."; background = $true; featured = $false }
  "SemperAnticus.mp3" = @{ priority = 2; title = "Semper Anticus"; description = "A substantial and dignified work that gives the music page a strong dramatic center."; inspiration = "A featured track that suggests endurance, gravity, and continuity."; featured = $true }
  "DreamsToCome.mp3" = @{ priority = 3; title = "Dreams to Come"; description = "A forward-looking composition filled with promise and open space."; inspiration = "A reflection on possibility, future seasons, and imagination still unfolding."; featured = $true }
  "WatchingStars.mp3" = @{ priority = 4; title = "Watching Stars"; description = "A contemplative piece that feels expansive, patient, and quietly luminous."; inspiration = "Inspired by wonder, distance, and the calm of looking upward."; featured = $true }
  "SailingAway.mp3" = @{ priority = 5; title = "Sailing Away"; description = "Music shaped by movement, distance, and the emotional texture of departure."; inspiration = "A voyage piece about transition, memory, and horizon." }
  "WanderingSoul.mp3" = @{ priority = 6; title = "Wandering Soul"; description = "An introspective track with a searching, inward character."; inspiration = "A meditation on identity, change, and the long arc of a life." }
  "SoloTravel.mp3" = @{ priority = 7; title = "Solo Travel"; description = "A personal and reflective work that suggests motion through unfamiliar places."; inspiration = "A study in independence, curiosity, and inner dialogue." }
  "RockyWays.mp3" = @{ priority = 8; title = "Rocky Ways"; description = "A piece that feels shaped by perseverance and uneven paths."; inspiration = "A musical acknowledgment of effort, resilience, and hard-earned progress." }
  "LullabyForSon.mp3" = @{ priority = 9; title = "Lullaby for Son"; description = "A tender, intimate composition centered on care and closeness."; inspiration = "A family piece rooted in affection, memory, and gentleness." }
  "Tymoteusz.mp3" = @{ priority = 10; title = "Tymoteusz"; description = "A personal dedication that gives the library a more intimate family register."; inspiration = "Presented as a named musical offering within the family story." }
  "DadaDance.mp3" = @{ priority = 11; title = "Dada Dance"; description = "A playful, rhythmic work that brings contrast and energy to the collection."; inspiration = "A lighter, more animated piece that balances the reflective tracks." }
}

$supportedExtensions = @(".mp3", ".wav", ".m4a", ".aac", ".ogg")

function Convert-ToSlug([string]$Name, [string]$Extension) {
  $base = [System.IO.Path]::GetFileNameWithoutExtension($Name).ToLowerInvariant()
  $base = $base -replace "[^a-z0-9]+", "-"
  $base = $base.Trim("-")
  if ([string]::IsNullOrWhiteSpace($base)) {
    $base = "track"
  }
  return "$base$($Extension.ToLowerInvariant())"
}

function Get-TitleFromName([string]$Name) {
  $base = [System.IO.Path]::GetFileNameWithoutExtension($Name)
  $spaced = $base -creplace "([a-z])([A-Z])", '$1 $2'
  return $spaced.Trim()
}

[System.IO.Directory]::CreateDirectory($TargetDir) | Out-Null
[System.IO.Directory]::CreateDirectory([System.IO.Path]::GetDirectoryName($ManifestPath)) | Out-Null

$musicFiles = Get-ChildItem -LiteralPath $SourceDir -File | Sort-Object Name
$tracks = @()
$unsupportedFiles = @()
$usedSlugs = @{}

foreach ($file in $musicFiles) {
  $extension = $file.Extension.ToLowerInvariant()
  if ($supportedExtensions -notcontains $extension) {
    $unsupportedFiles += $file.Name
    continue
  }

  $slug = Convert-ToSlug -Name $file.Name -Extension $extension
  if ($usedSlugs.ContainsKey($slug)) {
    $usedSlugs[$slug] += 1
    $slug = "{0}-{1}{2}" -f ([System.IO.Path]::GetFileNameWithoutExtension($slug)), $usedSlugs[$slug], $extension
  } else {
    $usedSlugs[$slug] = 1
  }

  Copy-Item -LiteralPath $file.FullName -Destination (Join-Path $TargetDir $slug) -Force

  $shellItem = $namespace.ParseName($file.Name)
  $duration = if ($shellItem) { $namespace.GetDetailsOf($shellItem, 27) } else { "" }
  $config = if ($trackConfig.ContainsKey($file.Name)) { $trackConfig[$file.Name] } else { @{} }
  $title = if ($config.title) { [string]$config.title } else { Get-TitleFromName $file.Name }
  $description = if ($config.description) { [string]$config.description } else { "A recording from Mieszko Gorski's current music library." }
  $inspiration = if ($config.inspiration) { [string]$config.inspiration } else { "Part of the current body of music created in retirement." }
  $priority = if ($config.priority) { [int]$config.priority } else { 1000 }
  $isFeatured = [bool]($config.featured -eq $true)
  $isBackground = [bool]($config.background -eq $true)

  $tracks += [PSCustomObject]@{
    src = "/music-library/$slug"
    fileName = $file.Name
    title = $title
    duration = [string]$duration
    description = $description
    inspiration = $inspiration
    featured = $isFeatured
    background = $isBackground
    priority = $priority
  }
}

$orderedTracks = $tracks | Sort-Object priority, title
$featuredTrack = $orderedTracks | Where-Object { $_.featured } | Select-Object -First 1
$backgroundTrack = $orderedTracks | Where-Object { $_.background } | Select-Object -First 1
$tracksJson = $orderedTracks | Select-Object src, fileName, title, duration, description, inspiration, featured, background | ConvertTo-Json -Depth 4
$featuredJson = $featuredTrack | Select-Object src, fileName, title, duration, description, inspiration, featured, background | ConvertTo-Json -Depth 4
$backgroundJson = $backgroundTrack | Select-Object src, fileName, title, duration, description, inspiration, featured, background | ConvertTo-Json -Depth 4
$unsupportedJson = if ($unsupportedFiles.Count -eq 0) { "[]" } else { $unsupportedFiles | ConvertTo-Json -Depth 2 }

$manifest = @"
export type MusicTrack = {
  src: string;
  fileName: string;
  title: string;
  duration: string;
  description: string;
  inspiration: string;
  featured: boolean;
  background: boolean;
};

// This file is generated by scripts/sync-music-library.ps1.
// Re-run the script after updating the source recordings in /Music.
export const backgroundTrack = $backgroundJson as const satisfies MusicTrack;

export const featuredTrack = $featuredJson as const satisfies MusicTrack;

export const musicLibrary = $tracksJson as const satisfies readonly MusicTrack[];

export const musicSummary = {
  totalTracks: $($orderedTracks.Count),
  unsupportedFiles: $unsupportedJson,
} as const;
"@

Set-Content -LiteralPath $ManifestPath -Value $manifest -Encoding UTF8
Write-Host "Synced $($orderedTracks.Count) tracks to $TargetDir"
