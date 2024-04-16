<?php

namespace App\Repositories;

use App\Models\Product;
use App\Repositories\Interfaces\BaseResourceRepositoryInterface;
use App\Repositories\Interfaces\ProductRepositoryInterface;

class ProductRepository extends BaseResourceRepository implements BaseResourceRepositoryInterface, ProductRepositoryInterface
{
    /**
     * Create a new instance of the repository.
     *
     * @return void
     */
    public function __construct()
    {
        $this->model = new Product();
    }
}
