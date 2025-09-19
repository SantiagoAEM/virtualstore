<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

       User::factory()->create([
            'name' => 'Santi',
            'email' => 'santi@example.com',
            'password' => bcrypt('123456789')
        ]);
        
       $this->call([

            UserSeeder::class,
        ]); 
    }
}
