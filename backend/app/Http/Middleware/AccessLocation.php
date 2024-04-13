<?php

namespace App\Http\Middleware;

use App\Helpers\ResponseHelper;
use App\Models\Location;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AccessLocation
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user->can_access_multiple_locations) {
            $locationId = $request->header('Location-Id');

            if (!$locationId) {
                return ResponseHelper::badRequest(config('app.debug')
                    ? 'The Location-id header not provided'
                    : 'Location must be selected');
            }

            $canAccessLocation = Location::where('company_id', $user->company_id)
                ->where('id', $locationId)
                ->exists();

            if (!$canAccessLocation) {
                return ResponseHelper::notFound('Location not found');
            }
        }

        return $next($request);
    }
}
