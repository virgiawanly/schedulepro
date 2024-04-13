<?php

namespace App\Repositories;

use App\Models\Employee;
use App\Repositories\Interfaces\BaseResourceRepositoryInterface;
use App\Repositories\Interfaces\EmployeeRepositoryInterface;

class EmployeeRepository extends BaseResourceRepository implements BaseResourceRepositoryInterface, EmployeeRepositoryInterface
{
    /**
     * Create a new instance of the repository.
     *
     * @return void
     */
    public function __construct()
    {
        $this->model = new Employee();
    }
}
