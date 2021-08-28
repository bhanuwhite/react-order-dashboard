import { observable } from 'mobx';


// FeaturePreviewState holds feature names and their enabled state
export interface FeaturePreviewState {
   alertSummary: boolean
   listFilters: boolean
}

export enum FeaturePreviewFlags {
    AlertSummary,
    ListFilters,
}

export const createFeaturePreview = () => observable<FeaturePreviewState>({
    alertSummary: window.ecUser?.featurePreview?.includes('alertSummary') ?? false,
    listFilters: window.ecUser?.featurePreview?.includes('listFilters') ?? false,
});