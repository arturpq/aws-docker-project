<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class TaskTest extends TestCase
{
    //Iniciar o banco do zero para testes
    use RefreshDatabase;

    // Garantir erro 401 para usuários não logados no POST
    public function test_unauthenticated_user_cannot_create_task(): void {

        $response = $this->postJson('/api/tasks', [
            'title' => 'Learn Testing',
            'status' => 'pending'
        ]);

        $response->assertStatus(401);
    }

    // Garantir POST para usuário logado
    public function test_authenticated_user_can_create_task(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user, 'sanctum');

        $response = $this->postJson('/api/tasks', [
            'title' => 'Task Title',
            'description' => 'Task Description',
            'status' => 'pending'
        ]);

        $response->assertStatus(201);

        $this->assertDatabaseHas('tasks', [
            'title' => 'Task Title',
            'user_id' => $user->id
        ]);
    }
    /**
     * @dataProvider invalidTaskDataProvider
    */
    public function test_invalid_task_creation(array $invalidData, string $wrongField) :void {
        $user = User::factory()->create();

        $this->actingAs($user, 'sanctum');

        $response = $this->postJson('/api/tasks', $invalidData);

        $response->assertStatus(422);

        $response->assertJsonValidationErrors([$wrongField]);
    }

    public static function invalidTaskDataProvider() :array {
        return [
            'Case 1: Null title' => [
                [
                'title' => '',
                'description' => 'This task has no title',
                'status' => 'pending'
                ], 'title'
            ],
            'Case 2: Invalid status' => [
                [
                'title' => '',
                'description' => 'This task has no title',
                'status' => 'pendente'
                ], 'status'
            ],
        ];
    }
}
