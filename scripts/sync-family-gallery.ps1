param(
  [string]$SourceDir,
  [string]$TargetDir,
  [string]$ManifestPath
)

$ErrorActionPreference = "Stop"

if (-not $SourceDir) {
  $SourceDir = Join-Path $PSScriptRoot "..\images"
}
if (-not $TargetDir) {
  $TargetDir = Join-Path $PSScriptRoot "..\public\family-gallery"
}
if (-not $ManifestPath) {
  $ManifestPath = Join-Path $PSScriptRoot "..\data\gallery-manifest.ts"
}

Add-Type -AssemblyName System.Drawing

$featuredConfig = @{
  "FAMILY FALL-28.jpg" = @{ priority = 1; caption = "Autumn portrait"; note = "A calm, elegant portrait that feels especially warm and timeless."; alt = "Mieszko Gorski with his wife in an autumn portrait"; hero = $true }
  "_DRL6135.jpg" = @{ priority = 2; caption = "Formal celebration"; note = "An elegant portrait from a family celebration."; alt = "Mieszko Gorski in a blue suit with his wife at a formal family event" }
  "Fall Family-90.jpg" = @{ priority = 3; caption = "By the lake"; note = "A gentle family moment outdoors in autumn."; alt = "Mieszko Gorski with family by a lake in the fall" }
  "FAMILY FALL-21.jpg" = @{ priority = 4; caption = "Family legacy"; note = "A multi-generational family portrait full of warmth and continuity."; alt = "Mieszko Gorski with his family in an autumn portrait" }
  "2025 Christmas-19.jpg" = @{ priority = 5; caption = "Christmas gathering"; note = "A bright holiday portrait centered on family togetherness."; alt = "Mieszko Gorski with family in a Christmas portrait" }
  "_DRL5039.jpg" = @{ priority = 6; caption = "Father and son"; note = "A composed portrait that emphasizes family connection."; alt = "Mieszko Gorski standing with his son at a formal occasion" }
  "G0064512.JPG" = @{ priority = 7; caption = "Adventure"; note = "A joyful image that shows curiosity, courage, and playfulness."; alt = "Mieszko Gorski smiling before a skydiving experience" }
  "1111171942c.jpg" = @{ priority = 8; caption = "Travel portrait"; note = "A reflective solo image from a trip abroad."; alt = "Mieszko Gorski standing near a waterfront during travel" }
}

$supportedExtensions = @(".jpg", ".jpeg", ".png", ".bmp", ".gif")

function Convert-ToSlug([string]$Name, [string]$Extension) {
  $base = [System.IO.Path]::GetFileNameWithoutExtension($Name).ToLowerInvariant()
  $base = $base -replace "[^a-z0-9]+", "-"
  $base = $base.Trim("-")
  if ([string]::IsNullOrWhiteSpace($base)) {
    $base = "image"
  }
  return "$base$($Extension.ToLowerInvariant())"
}

function Get-DefaultCaption([string]$Name) {
  switch -Regex ($Name.ToLowerInvariant()) {
    "christmas" { return @{ caption = "Christmas with family"; note = "A holiday moment from the family archive."; alt = "Mieszko Gorski in a Christmas family photo" } }
    "fall family|family fall" { return @{ caption = "Autumn family portrait"; note = "An outdoor family portrait from the autumn collection."; alt = "Mieszko Gorski in an autumn family portrait" } }
    "bahamascruise|2010-03-fl|2010-06" { return @{ caption = "Travel years"; note = "A travel photograph from the family archive."; alt = "Mieszko Gorski during a family trip" } }
    "g00|sam_|101sam|img_0|img_9|img_1" { return @{ caption = "Family archive"; note = "A candid moment from family life."; alt = "Mieszko Gorski in a family archive photo" } }
    "2009-09-pl|0403|0406|picture|200505" { return @{ caption = "Earlier chapter"; note = "An earlier photograph preserved in the archive."; alt = "Earlier photo of Mieszko Gorski" } }
    default { return @{ caption = "Family archive"; note = "A photograph from the family archive."; alt = "Photo of Mieszko Gorski from the family archive" } }
  }
}

[System.IO.Directory]::CreateDirectory($TargetDir) | Out-Null
[System.IO.Directory]::CreateDirectory([System.IO.Path]::GetDirectoryName($ManifestPath)) | Out-Null

$allFiles = Get-ChildItem -LiteralPath $SourceDir -File | Sort-Object Name
$photoItems = @()
$unsupportedFiles = @()
$usedSlugs = @{}

foreach ($file in $allFiles) {
  $extension = $file.Extension.ToLowerInvariant()
  if ($supportedExtensions -notcontains $extension) {
    $unsupportedFiles += $file.Name
    continue
  }

  $image = $null
  try {
    $image = [System.Drawing.Image]::FromFile($file.FullName)
    $orientation = if ($image.Width -ge $image.Height) { "landscape" } else { "portrait" }
    $slug = Convert-ToSlug -Name $file.Name -Extension $extension

    if ($usedSlugs.ContainsKey($slug)) {
      $usedSlugs[$slug] += 1
      $slug = "{0}-{1}{2}" -f ([System.IO.Path]::GetFileNameWithoutExtension($slug)), $usedSlugs[$slug], $extension
    } else {
      $usedSlugs[$slug] = 1
    }

    Copy-Item -LiteralPath $file.FullName -Destination (Join-Path $TargetDir $slug) -Force

    $details = if ($featuredConfig.ContainsKey($file.Name)) { $featuredConfig[$file.Name] } else { Get-DefaultCaption $file.Name }
    $isFeatured = $featuredConfig.ContainsKey($file.Name)
    $priority = if ($isFeatured) { [int]$details.priority } else { 1000 }
    $isHero = $isFeatured -and ($details.hero -eq $true)

    $photoItems += [PSCustomObject]@{
      src = "/family-gallery/$slug"
      alt = [string]$details.alt
      caption = [string]$details.caption
      note = [string]$details.note
      originalName = $file.Name
      width = [int]$image.Width
      height = [int]$image.Height
      orientation = $orientation
      featured = $isFeatured
      hero = $isHero
      priority = $priority
    }
  } finally {
    if ($image) {
      $image.Dispose()
    }
  }
}

$heroPhoto = $photoItems | Where-Object { $_.hero } | Select-Object -First 1
$featuredPhotos = $photoItems | Where-Object { $_.featured } | Sort-Object priority, originalName
$archivePhotos = $photoItems | Sort-Object priority, originalName

$heroJson = $heroPhoto | Select-Object src, alt, caption, note, originalName, width, height, orientation | ConvertTo-Json -Depth 4
$featuredJson = $featuredPhotos | Select-Object src, alt, caption, note, originalName, width, height, orientation | ConvertTo-Json -Depth 4
$archiveJson = $archivePhotos | Select-Object src, alt, caption, note, originalName, width, height, orientation | ConvertTo-Json -Depth 4
$unsupportedJson = $unsupportedFiles | ConvertTo-Json -Depth 2

$manifest = @"
export type GalleryPhoto = {
  src: string;
  alt: string;
  caption: string;
  note: string;
  originalName: string;
  width: number;
  height: number;
  orientation: "landscape" | "portrait";
};

// This file is generated by scripts/sync-family-gallery.ps1.
// Re-run the script after adding, removing, or renaming source images in /images.
export const heroPhoto = $heroJson as const satisfies GalleryPhoto;

export const featuredPhotos = $featuredJson as const satisfies readonly GalleryPhoto[];

export const archivePhotos = $archiveJson as const satisfies readonly GalleryPhoto[];

export const gallerySummary = {
  totalPhotos: $($archivePhotos.Count),
  featuredPhotos: $($featuredPhotos.Count),
  unsupportedFiles: $unsupportedJson,
} as const;
"@

Set-Content -LiteralPath $ManifestPath -Value $manifest -Encoding UTF8
Write-Host "Synced $($archivePhotos.Count) photos to $TargetDir"
if ($unsupportedFiles.Count -gt 0) {
  Write-Host "Skipped unsupported files: $($unsupportedFiles -join ', ')"
}