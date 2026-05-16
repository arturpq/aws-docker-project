<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class FullFlowTest extends TestCase
{
    use RefreshDatabase;
    public function test_user_can_perform_full_crud_lifecycle_via_api(): void
    {
        
        // Teste de Registro de usuário
        $registerResponse = $this->postJson('/api/register', [
            'name' => 'Flow Test',
            'email' => 'flow@test.com',
            'password' => 'password123',
            'password_confirmation' => 'password123'
        ]);
        
        $registerResponse->assertStatus(201);
        
        // Pega o Token de Acesso
        $token = $registerResponse->json('access_token');

        // Teste de Criação de Tarefa
        $createResponse = $this->withToken($token)->postJson('/api/tasks', [
            'title' => 'Flow Task',
            'description' => 'Description',
            'status' => 'pending'
        ]);

        $createResponse->assertStatus(201);

        $taskId = $createResponse->json('task.id');

        // Teste de Edição de Tarefa
        $updateResponse = $this->withToken($token)->putJson('/api/tasks/' . $taskId, [
            'title' => 'Updated Task', // Mudamos o título
            'status' => 'complete'         // Mudamos o status
        ]);

        $updateResponse->assertStatus(200);
        $this->assertDatabaseHas('tasks', [
            'id' => $taskId,
            'title' => 'Updated Task',
            'status' => 'complete'
        ]);
        
        // Teste de Remoção de Tarefa
        $deleteResponse = $this->withToken($token)->deleteJson('/api/tasks/' . $taskId);

        $deleteResponse->assertStatus(200);
        
        $this->assertDatabaseMissing('tasks', [
            'id' => $taskId
        ]);
    }
}
