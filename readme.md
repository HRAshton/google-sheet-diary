# Автоматический ежедневник на Google Sheets + Google Apps Script

1. Скопировать https://docs.google.com/spreadsheets/d/18lt6h0fsZh_859FUxaxSJcj9uMXv2wiwW-urvQRRRv4/edit?usp=sharing
2. Если скрипт не применился, скопировать содержимое файлов из репозитория
3. Добавить триггеры:
3.1. Time-based в 1:00 ежедневно на метод copyAll().
3.2. From spreadsheet - On change на метод refrashAll().