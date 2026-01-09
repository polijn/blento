import { createContext } from 'svelte';
import type { DownloadedData } from './types';

export type UpdateFunction = () => boolean | Promise<boolean>;

export type UpdateRecordFunction = () => Record<string, unknown> | Promise<Record<string, unknown>>;

export const [getUpdateFunctionsContext, setUpdateFunctionsContext] =
	createContext<UpdateFunction[]>();
export const [getUpdateRecordFunctionsContext, setUpdateRecordFunctionsContext] =
	createContext<UpdateRecordFunction[]>();

export const [getDidContext, setDidContext] = createContext<string>();
export const [getHandleContext, setHandleContext] = createContext<string>();

export const [getDataContext, setDataContext] = createContext<DownloadedData>();

export const [isEditing, setIsEditing] = createContext<boolean>();