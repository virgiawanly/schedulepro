<?php

namespace App\Repositories;

use App\Models\Material;
use App\Repositories\Interfaces\BaseResourceRepositoryInterface;
use App\Repositories\Interfaces\MaterialRepositoryInterface;

class MaterialRepository extends BaseResourceRepository implements BaseResourceRepositoryInterface, MaterialRepositoryInterface
{
    /**
     * Create a new instance of the repository.
     *
     * @return void
     */
    public function __construct()
    {
        $this->model = new Material();
    }
}
