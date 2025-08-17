$ErrorActionPreference = 'Stop'

if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host 'Installing Docker Desktop...'
    $installer = "$env:TEMP/DockerDesktopInstaller.exe"
    Invoke-WebRequest 'https://desktop.docker.com/win/main/amd64/Docker%20Desktop%20Installer.exe' -OutFile $installer
    Start-Process -FilePath $installer -Wait -ArgumentList 'install', '--quiet'
}

docker compose up -d
