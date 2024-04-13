<?php

namespace App\Helpers;

use Exception;

class ResponseHelper
{
    /**
     * Return success response.
     *
     * @param  string|null $message
     * @param  mixed|null $data
     * @param  int $status
     * @return \Illuminate\Http\JsonResponse
     */
    public static function success(string|null $message = null, mixed $data = null, int $status = 200)
    {
        $response = [
            'error' => false,
            'status' => $status,
        ];

        if ($data) {
            $response['data'] = $data;
        }

        if ($message) {
            $response['message'] = $message;
        }

        return response()->json($response);
    }

    /**
     * Return data response.
     *
     * @param  mixed $data
     * @param  string|null $message
     * @param  int $status
     * @return \Illuminate\Http\JsonResponse
     */
    public static function data(mixed $data, string|null $message = null, int $status = 200)
    {
        $response = [
            'error' => false,
            'status' => $status,
            'data' => $data,
        ];

        if ($message) {
            $response['message'] = $message;
        }

        return response()->json($response, $status);
    }

    /**
     * Return 404 not found response.
     *
     * @param  string|null $message
     * @return \Illuminate\Http\JsonResponse
     */
    public static function notFound(string|null $message = null)
    {
        return response()->json([
            'error' => true,
            'status' => 404,
            'message' => $message ? $message : 'Resource not found.',
        ], 404);
    }

    /**
     * Return 401 unauthorized response.
     *
     * @param  string|null $message
     * @return \Illuminate\Http\JsonResponse
     */
    public static function unauthorized(string|null $message = null)
    {
        return response()->json([
            'error' => true,
            'status' => 401,
            'message' => $message ? $message : 'Sorry you are not authorized to access this resource.',
        ], 401);
    }

    /**
     * Return 403 forbidden response.
     *
     * @param  string|null $message
     * @return \Illuminate\Http\JsonResponse
     */
    public static function forbidden(string|null $message = null)
    {
        return response()->json([
            'error' => true,
            'status' => 403,
            'message' => $message ? $message : 'Sorry you are forbidden to access this resource.',
        ], 403);
    }

    /**
     * Return 400 bad request response.
     *
     * @param  string|null $message
     * @return \Illuminate\Http\JsonResponse
     */
    public static function badRequest(string|null $message = null)
    {
        return response()->json([
            'error' => true,
            'status' => 400,
            'message' => $message ? $message : 'Sorry we could not process your request. Please try again Later.',
        ], 400);
    }

    /**
     * Return 500 internal server error response.
     *
     * @param  string|null $message
     * @return \Illuminate\Http\JsonResponse
     */
    public static function internalServerError(string|null $message = null, Exception|null $exception = null, bool $sendLog = true)
    {
        if ($exception && $sendLog) {
            // TODO: Log the exception
        }

        $errorMessage = $message;

        if (!config('app.debug')) {
            $errorMessage = 'Something went wrong in our server. Please try again.';
        }

        $response = [
            'error' => true,
            'status' => 500,
            'message' => $errorMessage,
        ];

        if ($exception && config('app.debug')) {
            $response['exception'] = [
                'message' => $exception->getMessage(),
                'code' => $exception->getCode(),
                'file' => $exception->getFile(),
                'line' => $exception->getLine(),
                'trace' => $exception->getTrace(),
            ];
        }

        return response()->json($response, 500);
    }

    /**
     * Return 422 validation error response.
     *
     * @param  string|null $message
     * @param  mixed|null $errors
     */
    public static function validationError(string|null $message = null, mixed $errors = null)
    {
        $response = [
            'error' => true,
            'status' => 422,
            'message' => $message ? $message : 'Validation errors.',
        ];

        if ($errors) {
            $response['errors'] = $errors;
        } else {
            // Set default errors, laravel validation
            $response['errors'] = [
                'error' => [$message ? $message : 'Validation errors.'],
            ];
        }

        return response()->json($response, 422);
    }
}
