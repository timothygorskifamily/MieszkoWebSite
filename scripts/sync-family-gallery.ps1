param(
  [string]$SourceDir,
  [string]$TargetDir,
  [string]$ManifestPath,
  [string]$VideoSourceDir,
  [string]$VideoTargetDir
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
if (-not $VideoSourceDir) {
  $VideoSourceDir = Join-Path $PSScriptRoot "..\videos"
}
if (-not $VideoTargetDir) {
  $VideoTargetDir = Join-Path $PSScriptRoot "..\public\family-videos"
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

$videoConfig = @{
  "1.mp4" = @{ priority = 1; caption = "Family archive clip"; note = "A moving family moment preserved in the archive."; alt = "Video from the family archive featuring Mieszko Gorski" }
  "2.MP4" = @{ priority = 2; caption = "Family archive clip"; note = "Another preserved video memory from family life."; alt = "Family archive video featuring Mieszko Gorski" }
  "3.mp4" = @{ priority = 3; caption = "Family archive clip"; note = "A candid family video clip from the archive."; alt = "Archived family video connected to Mieszko Gorski" }
  "4.mp4" = @{ priority = 4; caption = "Family archive clip"; note = "A short moving-image moment from the family archive."; alt = "Family archive video of Mieszko Gorski" }
}

$supportedExtensions = @(".jpg", ".jpeg", ".png", ".bmp", ".gif")
$supportedVideoExtensions = @(".mp4", ".mov", ".m4v", ".webm")

function Convert-ToSlug([string]$Name, [string]$Extension) {
  $base = [System.IO.Path]::GetFileNameWithoutExtension($Name).ToLowerInvariant()
  $base = $base -replace "[^a-z0-9]+", "-"
  $base = $base.Trim("-")
  if ([string]::IsNullOrWhiteSpace($base)) {
    $base = "image"
  }
  return "$base$($Extension.ToLowerInvariant())"
}

function Convert-ToDurationLabel([TimeSpan]$Duration) {
  if ($Duration.TotalHours -ge 1) {
    return "{0}:{1:D2}:{2:D2}" -f [int]$Duration.TotalHours, $Duration.Minutes, $Duration.Seconds
  }

  return "{0}:{1:D2}" -f (($Duration.Hours * 60) + $Duration.Minutes), $Duration.Seconds
}

function Get-NumericDetailValue([string]$Value, [int]$DefaultValue = 0) {
  $digits = ($Value -replace "[^0-9-]", "")
  if ([string]::IsNullOrWhiteSpace($digits)) {
    return $DefaultValue
  }

  $number = 0
  if ([int]::TryParse($digits, [ref]$number)) {
    return $number
  }

  return $DefaultValue
}

function Get-MimeType([string]$Extension) {
  switch ($Extension.ToLowerInvariant()) {
    ".mp4" { return "video/mp4" }
    ".mov" { return "video/quicktime" }
    ".m4v" { return "video/x-m4v" }
    ".webm" { return "video/webm" }
    default { return "video/mp4" }
  }
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

function Get-DefaultVideoCaption([string]$Name) {
  $basename = [System.IO.Path]::GetFileNameWithoutExtension($Name)

  if ($basename -match "^\d+$") {
    return @{
      caption = "Family archive clip"
      note = "A moving family moment preserved in the archive."
      alt = "Video from the family archive featuring Mieszko Gorski"
    }
  }

  return @{
    caption = "Family archive clip"
    note = "A moving family moment preserved in the archive."
    alt = "Family archive video featuring Mieszko Gorski"
  }
}

function Get-VideoMetadata([string]$Path) {
  $shell = New-Object -ComObject Shell.Application
  $folderPath = Split-Path -Path $Path -Parent
  $fileName = Split-Path -Path $Path -Leaf
  $folder = $shell.Namespace($folderPath)
  $item = $folder.ParseName($fileName)

  if (-not $folder -or -not $item) {
    throw "Unable to read video metadata for $Path"
  }

  $width = Get-NumericDetailValue ($folder.GetDetailsOf($item, 324))
  $height = Get-NumericDetailValue ($folder.GetDetailsOf($item, 322))
  $rotation = Get-NumericDetailValue ($folder.GetDetailsOf($item, 327))

  if (($rotation % 180) -ne 0) {
    $originalWidth = $width
    $width = $height
    $height = $originalWidth
  }

  $lengthValue = $folder.GetDetailsOf($item, 27)
  $duration = [TimeSpan]::Zero
  [TimeSpan]::TryParse($lengthValue, [ref]$duration) | Out-Null

  if ($width -le 0) {
    $width = 1920
  }
  if ($height -le 0) {
    $height = 1080
  }

  return [PSCustomObject]@{
    width = $width
    height = $height
    orientation = if ($width -ge $height) { "landscape" } else { "portrait" }
    durationSeconds = [int][Math]::Round($duration.TotalSeconds)
    durationLabel = Convert-ToDurationLabel $duration
  }
}

[System.IO.Directory]::CreateDirectory($TargetDir) | Out-Null
[System.IO.Directory]::CreateDirectory($VideoTargetDir) | Out-Null
[System.IO.Directory]::CreateDirectory([System.IO.Path]::GetDirectoryName($ManifestPath)) | Out-Null

$allFiles = if (Test-Path -LiteralPath $SourceDir) {
  Get-ChildItem -LiteralPath $SourceDir -File | Sort-Object Name
} else {
  @()
}
$allVideoFiles = if (Test-Path -LiteralPath $VideoSourceDir) {
  Get-ChildItem -LiteralPath $VideoSourceDir -File | Sort-Object Name
} else {
  @()
}

$photoItems = @()
$videoItems = @()
$unsupportedFiles = @()
$usedPhotoSlugs = @{}
$usedVideoSlugs = @{}

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

    if ($usedPhotoSlugs.ContainsKey($slug)) {
      $usedPhotoSlugs[$slug] += 1
      $slug = "{0}-{1}{2}" -f ([System.IO.Path]::GetFileNameWithoutExtension($slug)), $usedPhotoSlugs[$slug], $extension
    } else {
      $usedPhotoSlugs[$slug] = 1
    }

    Copy-Item -LiteralPath $file.FullName -Destination (Join-Path $TargetDir $slug) -Force

    $details = if ($featuredConfig.ContainsKey($file.Name)) { $featuredConfig[$file.Name] } else { Get-DefaultCaption $file.Name }
    $isFeatured = $featuredConfig.ContainsKey($file.Name)
    $priority = if ($isFeatured) { [int]$details.priority } else { 1000 }
    $isHero = $isFeatured -and ($details.hero -eq $true)

    $photoItems += [PSCustomObject]@{
      type = "photo"
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

foreach ($file in $allVideoFiles) {
  $extension = $file.Extension.ToLowerInvariant()
  if ($supportedVideoExtensions -notcontains $extension) {
    $unsupportedFiles += $file.Name
    continue
  }

  $metadata = Get-VideoMetadata $file.FullName
  $slug = Convert-ToSlug -Name $file.Name -Extension $extension

  if ($usedVideoSlugs.ContainsKey($slug)) {
    $usedVideoSlugs[$slug] += 1
    $slug = "{0}-{1}{2}" -f ([System.IO.Path]::GetFileNameWithoutExtension($slug)), $usedVideoSlugs[$slug], $extension
  } else {
    $usedVideoSlugs[$slug] = 1
  }

  Copy-Item -LiteralPath $file.FullName -Destination (Join-Path $VideoTargetDir $slug) -Force

  $details = if ($videoConfig.ContainsKey($file.Name)) { $videoConfig[$file.Name] } else { Get-DefaultVideoCaption $file.Name }
  $priority = if ($videoConfig.ContainsKey($file.Name)) { [int]$details.priority } else { 1000 }

  $videoItems += [PSCustomObject]@{
    type = "video"
    src = "/family-videos/$slug"
    alt = [string]$details.alt
    caption = [string]$details.caption
    note = [string]$details.note
    originalName = $file.Name
    width = [int]$metadata.width
    height = [int]$metadata.height
    orientation = [string]$metadata.orientation
    durationSeconds = [int]$metadata.durationSeconds
    durationLabel = [string]$metadata.durationLabel
    mimeType = Get-MimeType $extension
    priority = $priority
  }
}

$heroPhoto = $photoItems | Where-Object { $_.hero } | Select-Object -First 1
$featuredPhotos = $photoItems | Where-Object { $_.featured } | Sort-Object priority, originalName
$archivePhotos = $photoItems | Sort-Object priority, originalName
$archiveVideos = $videoItems | Sort-Object priority, originalName

$heroJson = $heroPhoto | Select-Object type, src, alt, caption, note, originalName, width, height, orientation | ConvertTo-Json -Depth 4
$featuredJson = @($featuredPhotos | Select-Object type, src, alt, caption, note, originalName, width, height, orientation) | ConvertTo-Json -Depth 4
$archiveJson = @($archivePhotos | Select-Object type, src, alt, caption, note, originalName, width, height, orientation) | ConvertTo-Json -Depth 4
$videoJson = @($archiveVideos | Select-Object type, src, alt, caption, note, originalName, width, height, orientation, durationSeconds, durationLabel, mimeType) | ConvertTo-Json -Depth 4
$unsupportedJson = @($unsupportedFiles) | ConvertTo-Json -Depth 2

$manifest = @"
export type GalleryPhoto = {
  type: "photo";
  src: string;
  alt: string;
  caption: string;
  note: string;
  originalName: string;
  width: number;
  height: number;
  orientation: "landscape" | "portrait";
};

export type GalleryVideo = {
  type: "video";
  src: string;
  alt: string;
  caption: string;
  note: string;
  originalName: string;
  width: number;
  height: number;
  orientation: "landscape" | "portrait";
  durationSeconds: number;
  durationLabel: string;
  mimeType: string;
};

export type GalleryMedia = GalleryPhoto | GalleryVideo;

// This file is generated by scripts/sync-family-gallery.ps1.
// Re-run the script after adding, removing, or renaming source files in /images or /videos.
export const heroPhoto = $heroJson as const satisfies GalleryPhoto;

export const featuredPhotos = $featuredJson as const satisfies readonly GalleryPhoto[];

export const archivePhotos = $archiveJson as const satisfies readonly GalleryPhoto[];

export const archiveVideos = $videoJson as const satisfies readonly GalleryVideo[];

export const archiveMedia = [...archivePhotos, ...archiveVideos] as const satisfies readonly GalleryMedia[];

export const gallerySummary = {
  totalPhotos: $($archivePhotos.Count),
  featuredPhotos: $($featuredPhotos.Count),
  totalVideos: $($archiveVideos.Count),
  totalMedia: $($archivePhotos.Count + $archiveVideos.Count),
  unsupportedFiles: $unsupportedJson,
} as const;
"@

Set-Content -LiteralPath $ManifestPath -Value $manifest -Encoding UTF8
Write-Host "Synced $($archivePhotos.Count) photos to $TargetDir"
Write-Host "Synced $($archiveVideos.Count) videos to $VideoTargetDir"
if ($unsupportedFiles.Count -gt 0) {
  Write-Host "Skipped unsupported files: $($unsupportedFiles -join ', ')"
}
