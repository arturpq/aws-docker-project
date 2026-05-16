<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\AuthController;


Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// O middleware 'auth:sanctum' verifica se o Token enviado é válido
Route::middleware('auth:sanctum')->group(function () {
    
    // Rotas de Tarefas
    Route::get('/tasks', [TaskController::class, 'index']);      // Listar
    Route::post('/tasks', [TaskController::class, 'store']);     // Criar
    Route::get('/tasks/{id}', [TaskController::class, 'show']);  // Ver tarefa específica
    Route::delete('/tasks/{id}', [TaskController::class, 'destroy']); // Deletar
    Route::put('/tasks/{id}', [TaskController::class, 'update']); // Atualizar


    // Rota de Logout (para invalidar o token)
    Route::post('/logout', [AuthController::class, 'logout']);
});
