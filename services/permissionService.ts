import { apiService, ApiResponse } from './apiService'
import { API_ENDPOINTS } from '@/constants/api'
import { GymPermission, UserPermission } from '@/interfaces/Permission'

export class PermissionService {
  // ─── Gym Permissions ──────────────────────────────────────────────────────

  async fetchGymPermissions(
    token: string,
  ): Promise<ApiResponse<GymPermission[]>> {
    return apiService.get<GymPermission[]>(API_ENDPOINTS.GYM_PERMISSIONS, token)
  }

  async fetchMyGymPermissions(
    token: string,
  ): Promise<ApiResponse<GymPermission[]>> {
    return apiService.get<GymPermission[]>(
      API_ENDPOINTS.MY_GYM_PERMISSIONS,
      token,
    )
  }

  async fetchGymPermissionById(
    permissionId: number,
    token: string,
  ): Promise<ApiResponse<GymPermission>> {
    return apiService.get<GymPermission>(
      API_ENDPOINTS.GYM_PERMISSION_BY_ID(permissionId),
      token,
    )
  }

  async createGymPermission(
    data: Partial<GymPermission>,
    token: string,
  ): Promise<ApiResponse<GymPermission>> {
    return apiService.post<GymPermission>(
      API_ENDPOINTS.GYM_PERMISSIONS,
      data,
      token,
    )
  }

  async updateGymPermission(
    permissionId: number,
    data: Partial<GymPermission>,
    token: string,
  ): Promise<ApiResponse<GymPermission>> {
    return apiService.put<GymPermission>(
      API_ENDPOINTS.GYM_PERMISSION_BY_ID(permissionId),
      data,
      token,
    )
  }

  async deleteGymPermission(
    permissionId: number,
    token: string,
  ): Promise<ApiResponse<void>> {
    return apiService.delete<void>(
      API_ENDPOINTS.GYM_PERMISSION_BY_ID(permissionId),
      token,
    )
  }

  // ─── User Permissions ─────────────────────────────────────────────────────

  async fetchUserPermissions(
    token: string,
  ): Promise<ApiResponse<UserPermission[]>> {
    return apiService.get<UserPermission[]>(
      API_ENDPOINTS.USER_PERMISSIONS,
      token,
    )
  }

  async fetchPermissionsGrantedToMe(
    token: string,
  ): Promise<ApiResponse<UserPermission[]>> {
    return apiService.get<UserPermission[]>(
      API_ENDPOINTS.PERMISSIONS_GRANTED_TO_ME,
      token,
    )
  }

  async fetchUserPermissionById(
    permissionId: number,
    token: string,
  ): Promise<ApiResponse<UserPermission>> {
    return apiService.get<UserPermission>(
      API_ENDPOINTS.USER_PERMISSION_BY_ID(permissionId),
      token,
    )
  }

  async createUserPermission(
    data: Partial<UserPermission>,
    token: string,
  ): Promise<ApiResponse<UserPermission>> {
    return apiService.post<UserPermission>(
      API_ENDPOINTS.USER_PERMISSIONS,
      data,
      token,
    )
  }

  async updateUserPermission(
    permissionId: number,
    data: Partial<UserPermission>,
    token: string,
  ): Promise<ApiResponse<UserPermission>> {
    return apiService.put<UserPermission>(
      API_ENDPOINTS.USER_PERMISSION_BY_ID(permissionId),
      data,
      token,
    )
  }

  async deleteUserPermission(
    permissionId: number,
    token: string,
  ): Promise<ApiResponse<void>> {
    return apiService.delete<void>(
      API_ENDPOINTS.USER_PERMISSION_BY_ID(permissionId),
      token,
    )
  }
}

export const permissionService = new PermissionService()
