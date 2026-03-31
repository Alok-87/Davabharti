import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '@/store';

export const selectAuth = (state: RootState) => state.auth;

export const selectIsAuthenticated = createSelector(selectAuth, (s) => !!s.token && !!s.user);
export const selectAuthUser = createSelector(selectAuth, (s) => s.user);
export const selectAuthLoading = createSelector(selectAuth, (s) => s.loading);
export const selectAuthError = createSelector(selectAuth, (s) => s.error);
