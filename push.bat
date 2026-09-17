@echo off
chcp 65001 > nul
echo ==============================================
echo 🚀 Отправка изменений в GitHub (Push to GitHub)
echo ==============================================

set /p msg="Введите описание изменений (или нажмите Enter для 'Update'): "
if "%msg%"=="" set msg=Update site

echo.
echo [1/3] Индексация файлов (git add)...
git add .

echo [2/3] Создание коммита (git commit)...
git commit -m "%msg%"

echo [3/3] Отправка в GitHub (git push)...
git push origin main

if %errorlevel% neq 0 (
    echo.
    echo ❌ Ошибка при отправке. Проверьте подключение к GitHub или настройки remote.
) else (
    echo.
    echo ✅ Успешно отправлено! Vercel автоматически начнёт сборку и публикацию сайта.
)

pause
