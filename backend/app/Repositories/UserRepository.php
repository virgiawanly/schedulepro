<?php

namespace App\Repositories;

use App\Models\User;
use App\Repositories\Interfaces\BaseResourceRepositoryInterface;
use App\Repositories\Interfaces\UserRepositoryInterface;

class UserRepository extends BaseResourceRepository implements UserRepositoryInterface, BaseResourceRepositoryInterface
{
    /**
     * Create a new instance of the repository.
     *
     * @return void
     */
    public function __construct()
    {
        $this->model = new User();
    }
}
