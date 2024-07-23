<?php

namespace App\Http\Controllers\Api\Web\Admin;

use App\Helpers\ResponseHelper;
use App\Http\Controllers\BaseResourceController;
use App\Http\Requests\Web\V1\Admin\Product\CreateProductRequest;
use App\Http\Requests\Web\V1\Admin\Product\UpdateProductRequest;
use App\Repositories\ProductRepository;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class ProductController extends BaseResourceController
{
    /**
     * Product repository instance.
     *
     * @var \App\Repositories\ProductRepository
     */
    protected ProductRepository $repository;

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->repository = new ProductRepository();

        parent::__construct($this->repository);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \App\Http\Requests\Web\V1\Admin\Product\CreateProductRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(CreateProductRequest $request)
    {
        try {
            $payload = $request->validated();
            $payload['company_id'] = auth()->user()->company_id;
            $payload['location_id'] = $request->header('Location-Id');

            $result = $this->service->save($payload);
            return ResponseHelper::success('Successfully created.', $result, 201);
        } catch (Exception $e) {
            return ResponseHelper::internalServerError($e->getMessage(), $e);
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Http\Requests\Web\V1\Admin\Product\UpdateProductRequest  $request
     * @param  string  $uuid
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateProductRequest $request, string $uuid)
    {
        return parent::patch($request, $uuid);
    }

    /**
     * Toggle the product status.
     *
     * @param  string  $uuid
     * @return \Illuminate\Http\Response
     */
    public function toggleStatus(string $uuid)
    {
        try {
            $product = $this->repository->findByUuid($uuid);
            $product->update(['is_active' => !$product->is_active]);

            return ResponseHelper::success('Successfully updated.', $product, 200);
        } catch (ModelNotFoundException $e) {
            return ResponseHelper::notFound('Resource not found.');
        } catch (Exception $e) {
            return ResponseHelper::internalServerError($e->getMessage(), $e);
        }
    }
}
