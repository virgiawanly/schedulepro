<?php

namespace App\Repositories;

use App\Models\Customer;
use App\Repositories\Interfaces\BaseResourceRepositoryInterface;
use App\Repositories\Interfaces\CustomerRepositoryInterface;

class CustomerRepository extends BaseResourceRepository implements BaseResourceRepositoryInterface, CustomerRepositoryInterface
{
    /**
     * Create a new instance of the repository.
     *
     * @return void
     */
    public function __construct()
    {
        $this->model = new Customer();
    }
}
