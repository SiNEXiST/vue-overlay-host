import { Vue } from 'vue-property-decorator';

export const NAMESPACE_NAME = 'overlay-host';

export interface PluginSettings {
    timeout?: number;
}

export interface OverlayHostState {
    items: EntrySetting[];
    idCounter: number;
}

export interface EntrySetting {
    id: number;
    timeoutId?: number;
    resolver: (value?: any, origin?: string) => any;
    rejector: (value?: any, origin?: string) => any;
    settings: FinalShowOptions;
}

interface OverlayOptions {
    show: boolean;
    closeOnClick: boolean;
}

interface BaseShowOptions {
    component: string | Vue;
    closeOnEscape?: boolean;
    timeout?: number;
    props?: {
        [name: string]: any;
    };
}

interface FinalShowOptions extends BaseShowOptions {
    overlay: OverlayOptions;
}

export interface ShowOptions extends BaseShowOptions {
    overlay?: boolean | OverlayOptions;
}

export interface ShowResponse {
    id: number;
    promise: Promise<RemoveRequest>;
    close: (value?: any, origin?: string) => void;
    abort: (value?: any, origin?: string) => void;
}

export interface RemoveRequest {
    id: number;
    origin?: string;
    value?: any;
}
