#!/bin/sh

echo "🐳 Aguardando o banco de dados (db:3306) ficar totalmente pronto..."

# Executa um comando PHP em loop tentando abrir uma conexão real com o MySQL
until php -r "try { new PDO('mysql:host=db;dbname=laravel_db', 'root', 'root'); exit(0); } catch (Exception \$e) { exit(1); }" 2>/dev/null; do
    echo "⏳ Banco de dados ainda inicializando... Tentando novamente em 2 segundos."
    sleep 2
done

echo "✅ Conexão com o banco de dados estabelecida com sucesso!"

echo "🐳 Rodando as migrations automaticamente..."
php artisan migrate --force

echo "🐳 Iniciando o servidor do Laravel..."
php artisan serve --host=0.0.0.0 --port=80