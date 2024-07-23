<?php

namespace App\Http\Controllers\Api\Web\Admin;

use App\Helpers\ResponseHelper;
use App\Http\Controllers\BaseResourceController;
use App\Http\Requests\Web\V1\Admin\Employee\CreateEmployeeRequest;
use App\Http\Requests\Web\V1\Admin\Employee\UpdateEmployeeRequest;
use App\Repositories\EmployeeRepository;
use App\Repositories\UserRepository;
use App\Services\EmployeeService;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class EmployeeController extends BaseResourceController
{
    /**
     * Employee repository instance.
     *
     * @var \App\Repositories\EmployeeRepository
     */
    protected EmployeeRepository $repository;

    /**
     * User repository instance.
     *
     * @var \App\Repositories\UserRepository
     */
    protected UserRepository $userRepository;

    /**
     * Employee service instance.
     *
     * @var \App\Services\EmployeeService
     */
    protected EmployeeService $employeeService;

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->repository = new EmployeeRepository();
        $this->userRepository = new UserRepository();
        $this->employeeService = new EmployeeService($this->repository, $this->userRepository);

        parent::__construct($this->repository);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \App\Http\Requests\Web\V1\Admin\Employee\CreateEmployeeRequest  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(CreateEmployeeRequest $request)
    {
        try {
            $employee = $this->employeeService->saveEmployeeAndUser($request->validated(), $request);
            return ResponseHelper::success('Successfully created.', $employee);
        } catch (Exception $e) {
            return ResponseHelper::internalServerError($e->getMessage(), $e);
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Http\Requests\Web\V1\Admin\Employee\UpdateEmployeeRequest  $request
     * @param  string  $uuid
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(UpdateEmployeeRequest $request, $uuid)
    {
        try {
            $employee = $this->employeeService->updateEmployeeAndUser($uuid, $request->validated(), $request);
            return ResponseHelper::success('Successfully updated.', $employee);
        } catch (ModelNotFoundException $e) {
            return ResponseHelper::notFound('Resource not found.');
        } catch (Exception $e) {
            return ResponseHelper::internalServerError($e->getMessage(), $e);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  string  $uuid
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(string $uuid)
    {
        try {
            $this->employeeService->deleteEmployeeAndUser($uuid);
            return ResponseHelper::success('Successfully deleted.');
        } catch (ModelNotFoundException $e) {
            return ResponseHelper::notFound('Resource not found.');
        } catch (Exception $e) {
            return ResponseHelper::internalServerError($e->getMessage(), $e);
        }
    }
}
