import { useDispatch, useSelector, useStore } from 'react-redux';
import { createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState, AppDispatch, AppStore } from './store';

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppStore = useStore.withTypes<AppStore>();

export const createAppAsyncThunk = createAsyncThunk.withTypes<{
  state: RootState;
  dispatch: AppDispatch;
  rejectValue: string;
}>();
