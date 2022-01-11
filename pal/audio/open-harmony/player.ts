import { systemInfo } from 'pal/system-info';
import { AudioType, AudioState, AudioEvent } from '../type';
import { EventTarget } from '../../../cocos/core/event';
import { legacyCC } from '../../../cocos/core/global-exports';
import { clamp, clamp01 } from '../../../cocos/core';
import { enqueueOperation, OperationInfo, OperationQueueable } from '../operation-queue';
import { Platform } from '../../system-info/enum-type';

const urlCount: Record<string, number> = {};
const audioEngine = jsb.AudioEngine;
const INVALID_AUDIO_ID = -1;

export class OneShotAudio {
    get onPlay () {
        throw new Error('not implemented');
    }
    set onPlay (cb) {
        throw new Error('not implemented');
    }

    get onEnd () {
        throw new Error('not implemented');
    }
    set onEnd (cb) {
        throw new Error('not implemented');
    }

    private constructor (url: string, volume: number)  {
        throw new Error('not implemented');
    }
    public play (): void {
        throw new Error('not implemented');
    }
    public stop (): void {
        throw new Error('not implemented');
    }
}

export class AudioPlayer implements OperationQueueable {
    /**
     * @legacyPublic
     */
    public _eventTarget: EventTarget = new EventTarget();
    /**
     * @legacyPublic
     */
    public _operationQueue: OperationInfo[] = [];

    constructor (url: string) {
        throw new Error('not implemented');
    }
    destroy () {
        throw new Error('not implemented');
    }
    static load (url: string): Promise<AudioPlayer> {
        throw new Error('not implemented');
    }
    static loadNative (url: string): Promise<unknown> {
        throw new Error('not implemented');
    }
    static loadOneShotAudio (url: string, volume: number): Promise<OneShotAudio> {
        throw new Error('not implemented');
    }
    static readonly maxAudioChannel: number = audioEngine.getMaxAudioInstance();

    get src () {
        throw new Error('not implemented');
    }
    get type (): AudioType {
        throw new Error('not implemented');
    }
    get state (): AudioState {
        throw new Error('not implemented');
    }
    get loop (): boolean {
        throw new Error('not implemented');
    }
    set loop (val: boolean) {
        throw new Error('not implemented');
    }
    get volume (): number {
        throw new Error('not implemented');
    }
    set volume (val: number) {
        throw new Error('not implemented');
    }
    get duration (): number {
        throw new Error('not implemented');
    }
    get currentTime (): number {
        throw new Error('not implemented');
    }

    @enqueueOperation
    seek (time: number): Promise<void> {
        throw new Error('not implemented');
    }

    @enqueueOperation
    play (): Promise<void> {
        throw new Error('not implemented');
    }

    @enqueueOperation
    pause (): Promise<void> {
        throw new Error('not implemented');
    }

    @enqueueOperation
    stop (): Promise<void> {
        throw new Error('not implemented');
    }
    onInterruptionBegin (cb: () => void) { this._eventTarget.on(AudioEvent.INTERRUPTION_BEGIN, cb); }
    offInterruptionBegin (cb?: () => void) { this._eventTarget.off(AudioEvent.INTERRUPTION_BEGIN, cb); }
    onInterruptionEnd (cb: () => void) { this._eventTarget.on(AudioEvent.INTERRUPTION_END, cb); }
    offInterruptionEnd (cb?: () => void) { this._eventTarget.off(AudioEvent.INTERRUPTION_END, cb); }
    onEnded (cb: () => void) { this._eventTarget.on(AudioEvent.ENDED, cb); }
    offEnded (cb?: () => void) { this._eventTarget.off(AudioEvent.ENDED, cb); }
}

// REMOVE_ME
legacyCC.AudioPlayer = AudioPlayer;
