import {videoFormat} from 'ytdl-core';
import {IpcMainInvokeEvent} from 'electron';
import LocalCache from '../services/LocalCache';
import {IpcMainHandler} from '../types/interfaces';


const YTDownload = require('ytdl-core');

const handler: IpcMainHandler = {
	execute: async (event: IpcMainInvokeEvent, url: string) => {
		if (LocalCache.hasRecordingFormats(url))
			return LocalCache.readRecordingFormats(url);

		const recordingFormats: videoFormat[] = (await YTDownload.getInfo(url)).formats;
		LocalCache.cacheRecordingFormats(url, recordingFormats);
		return recordingFormats;
	},
	name: 'get-recording-formats',
	type: 'handle'
};

export default handler;