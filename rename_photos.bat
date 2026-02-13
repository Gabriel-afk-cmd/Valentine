@echo off
setlocal enabledelayedexpansion
cd /d "c:\Users\gabri\Downloads\Valentine"

REM Rename JPEG images to photo1.jpg through photo10.jpg
set count=1
for /f "tokens=*" %%A in ('dir /b /o:d *.jpeg 2^>nul') do (
    ren "%%A" "photo!count!.jpg"
    set /a count=!count!+1
)

echo.
echo DONE! Photos renamed successfully.
echo Your 10 photos are now ready as photo1.jpg through photo10.jpg
echo.
dir /b photo*.jpg
pause
