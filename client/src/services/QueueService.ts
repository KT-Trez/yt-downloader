import {QueueEntryMetadata} from '../types/interfaces';
import IPCRenderer from './IPCRenderer';


export default class QueueService implements QueueEntryMetadata {
	// singleton store
	private static downloads: Map<string, QueueEntryMetadata> = new Map();

	// static methods
	private static async recoverQueue(name: string) {
		const ongoingDownloads = await IPCRenderer.getOngoingDownloads();
		for (const ongoingDownload of ongoingDownloads)
			QueueService.createEntry(ongoingDownload);
		return this.downloads.has(name);
	}

	static createEntry(name: string, hasAudio?: boolean, hasVideo?: boolean, hasMerge?: boolean) {
		QueueService.downloads.set(name, new QueueService(name, hasAudio, hasVideo, hasMerge));
	}

	static deleteEntry(name: string) {
		QueueService.downloads.delete(name);
	}

	static getQueue() {
		const queue = QueueService.downloads.values();
		return Array.from(queue);
	}

	static async updateAudioProgress(name: string, newProgress: number) {
		let queueEntry = this.downloads.get(name);
		if (!queueEntry) {
			if (await this.recoverQueue(name))
				throw new Error('Cannot get queue entry');
			else
				queueEntry = this.downloads.get(name);
		}
		queueEntry!.audioProgress = newProgress;
	}

	static async updateMergeProgress(name: string, newProgress: number) {
		let queueEntry = this.downloads.get(name);
		if (!queueEntry) {
			if (await this.recoverQueue(name))
				throw new Error('Cannot get queue entry');
			else
				queueEntry = this.downloads.get(name);
		}
		queueEntry!.mergeProgress = newProgress;
	}

	static async updateVideoProgress(name: string, newProgress: number) {
		let queueEntry = this.downloads.get(name);
		if (!queueEntry) {
			if (await this.recoverQueue(name))
				throw new Error('Cannot get queue entry');
			else
				queueEntry = this.downloads.get(name);
		}
		queueEntry!.videoProgress = newProgress;
	}

	// getters and setters
	get audioProgress(): number {
		return this._audioProgress;
	}

	get hasAudio(): boolean {
		return this._hasAudio;
	}

	get hasMerge(): boolean {
		return this._hasMerge;
	}

	get hasVideo(): boolean {
		return this._hasVideo;
	}

	get isAudioDownloaded(): boolean {
		return this._isAudioDownloaded;
	}

	get isVideoDownloaded(): boolean {
		return this._isVideoDownloaded;
	}

	get mergeProgress(): number {
		return this._mergeProgress;
	}

	get videoProgress(): number {
		return this._videoProgress;
	}

	set audioProgress(value: number) {
		this._audioProgress = Math.round(value);
		if (this.audioProgress >= 100)
			this.audioFinished();
	}

	set hasAudio(value: boolean) {
		this._hasAudio = value;
		if (!value)
			this.isAudioDownloaded = true;
	}

	set hasMerge(value: boolean) {
		this._hasMerge = value;
		if (!value)
			this.isMerged = true;
	}

	set hasVideo(value: boolean) {
		this._hasVideo = value;
		if (!value)
			this.isVideoDownloaded = true;
	}

	set isAudioDownloaded(value: boolean) {
		this._isAudioDownloaded = value;
		if (this.isAudioDownloaded && this.isVideoDownloaded)
			this.isDownloaded = true;
	}

	set isVideoDownloaded(value: boolean) {
		this._isVideoDownloaded = value;
		if (this.isAudioDownloaded && this.isVideoDownloaded)
			this.isDownloaded = true;
	}

	set mergeProgress(value: number) {
		this._mergeProgress = Math.round(value);
		if (this.mergeProgress >= 100)
			this.isMerged = true;
	}

	set videoProgress(value: number) {
		this._videoProgress = Math.round(value);
		if (this.videoProgress >= 100)
			this.videoFinished();
	}

	// instance params
	private _audioProgress = 0;
	private _hasAudio = true;
	private _hasMerge = true;
	private _hasVideo = true;
	private _isAudioDownloaded = false;
	isDownloaded = false;
	isMerged = false;
	private _isVideoDownloaded = false;
	private _mergeProgress = 0;
	name: string;
	private _videoProgress = 0;

	constructor(name: string, hasAudio?: boolean, hasVideo?: boolean, hasMerge?: boolean) {
		this.name = name;
		if (hasAudio !== undefined)
			this.hasAudio = hasAudio;
		if (hasVideo !== undefined)
			this.hasVideo = hasVideo;
		if (hasMerge !== undefined)
			this.hasMerge = hasMerge;
	}


	// instance private methods
	private audioFinished() {
		this.isAudioDownloaded = true;
	}

	private videoFinished() {
		this.isVideoDownloaded = true;
	}
}