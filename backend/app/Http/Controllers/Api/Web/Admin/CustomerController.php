<?php

namespace App\Http\Controllers\Api\Web\Admin;

use App\Helpers\ResponseHelper;
use App\Http\Controllers\BaseResourceController;
use App\Http\Requests\Web\V1\Admin\Customer\CreateCustomerRequest;
use App\Http\Requests\Web\V1\Admin\Customer\UpdateCustomerRequest;
use App\Repositories\CustomerRepository;
use Exception;

class CustomerController extends BaseResourceController
{
    /**
     * Create a new controller instance.
     *
     * @param  \App\Repositories\CustomerRepository  $repository
     * @param  \App\Services\BaseResourceService  $service
     * @return void
     */
    public function __construct(CustomerRepository $repository)
    {
        parent::__construct($repository);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \App\Http\Requests\Web\V1\Admin\Customer\CreateCustomerRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(CreateCustomerRequest $request)
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
     * @param  \App\Http\Requests\Web\V1\Admin\Customer\UpdateCustomerRequest  $request
     * @param  string  $uuid
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateCustomerRequest $request, string $uuid)
    {
        return parent::patch($request, $uuid);
    }
}
