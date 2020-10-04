/* eslint-disable no-async-promise-executor */
import * as mongo from 'mongodb';
import { publishServerEvent } from './stream';

export async function publishFollowingChanged(userId: mongo.ObjectID) {
	await publishServerEvent(userId, 'FollowingChanged');
}
