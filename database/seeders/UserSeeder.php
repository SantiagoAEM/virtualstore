<?php

namespace Database\Seeders;

use App\Models\User;
use App\RolesEnum;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::factory()->create([
            'name' => 'santi',
            'email' => 'santi@example.com',
            'password' => Hash::make('12345678'),
                'email_verified_at' => now(),
        ])->assignRole(RolesEnum::Admin->value);

        User::factory()->create([
            'name' => 'vendor',
            'email' => 'vendor@example.com',
            'password' => Hash::make('12345678'),
                'email_verified_at' => now(),
        ])->assignRole(RolesEnum::Vendor->value);

        User::factory()->create([
            'name' => 'user',
            'email' => 'user@example.com',
            'password' => Hash::make('12345678'),
                'email_verified_at' => now(),
        ])->assignRole(RolesEnum::User->value);
    }
}
