/* eslint-disable no-async-promise-executor */
import * as mongo from 'mongodb';
import { publishServerEvent } from './stream';

export async function publishFollowingChanged(userId: mongo.ObjectID) {
	await publishServerEvent(userId, 'followingChanged');
}

export async function publishMutingChanged(userId: mongo.ObjectID) {
	await publishServerEvent(userId, 'mutingChanged');
}
