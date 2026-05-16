<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_register_with_valid_data(): void
    {
        $response = $this->postJson('/api/register', [
            'name' => 'New User',
            'email' => 'new@test.com',
            'password' => 'password123',
            'password_confirmation' => 'password123'
        ]);

        $response->assertStatus(201);

        $response->assertJsonStructure([
            'message',
            'access_token'
        ]);

        $this->assertDatabaseHas('users', [
            'email' => 'new@test.com'
        ]);
    }

    public function test_user_cannot_register_with_existing_email(): void
    {
        User::factory()->create([
            'email' => 'existent@test.com'
        ]);

        $response = $this->postJson('/api/register', [
            'name' => 'Another User',
            'email' => 'existent@test.com',
            'password' => 'password123',
            'password_confirmation' => 'password123'
        ]);

        $response->assertStatus(422);

        $response->assertJsonValidationErrors(['email']);
    }


    /**
     * @dataProvider invalidUserDataProvider
     */
    public function test_user_cannot_register_with_invalid_data(array $invalidData, string $wrongField): void
    {
        $response = $this->postJson('/api/register', $invalidData);

        $response->assertStatus(422);

        $response->assertJsonValidationErrors([$wrongField]);
    }
    public static function invalidUserDataProvider(): array
    {
        return [
            'Case 1: Null Name' => [
                // Os dados enviados
                [
                    'name' => '', 
                    'email' => 'test@test.com', 
                    'password' => 'password123', 
                    'password_confirmation' => 'password123'
                ],
                // O campo que o Laravel deve acusar o erro
                'name' 
            ],

            'Case 2: Misinputed Email' => [
                [
                    'name' => 'User', 
                    'email' => 'invalid_email.com', 
                    'password' => 'password123', 
                    'password_confirmation' => 'password123'
                ],
                'email'
            ],

            'Case 3: Password with less than 8 characters' => [
                [
                    'name' => 'User', 
                    'email' => 'test2@test.com', 
                    'password' => '1234', 
                    'password_confirmation' => '1234'
                ],
                'password'
            ],

            'Case 4: Password confirmation difference' => [
                [
                    'name' => 'User', 
                    'email' => 'test3@test.com', 
                    'password' => 'password123', 
                    'password_confirmation' => 'wrong_password'
                ],
                'password' 
            ],
        ];
    }

}