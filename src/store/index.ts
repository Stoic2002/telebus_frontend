// Central store exports and configuration
export { useAuthStore } from './authStore';
export { useUserStore } from './userStore';
export { useAppStore } from './appStore';
export { useDataStore } from './dataStore';
export { useMachineLearningStore } from './machineLearningStore';
export { useReportStore } from './reportStore';

// Type exports
export type { AuthState, AuthActions } from './authStore';
export type { UserState, UserActions } from './userStore';
export type { AppState, AppActions } from './appStore';
export type { DataState, DataActions } from './dataStore';
export type { MachineLearningState, MachineLearningActions } from './machineLearningStore';
export type { ReportState, ReportActions } from './reportStore';

// Store reset function for cleanup
export const resetAllStores = () => {
  // Will be implemented with individual reset functions
}; 