<?php

namespace App\Enums;

enum UserRole: string
{
    case ADMIN = 'Admin';
    case EMPLOYEE = 'Employee';
}
