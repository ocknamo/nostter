import { writable, type Writable } from 'svelte/store';
import type { User, UserEvent } from '../routes/types';
import type { Event } from 'nostr-tools';

export const userEvents: Writable<Map<string, UserEvent>> = writable(new Map());
export function saveUserEvent(userEvent: UserEvent) {
	userEvents.update((userEvents) => {
		const savedUserEvent = userEvents.get(userEvent.pubkey);

		if (savedUserEvent === undefined || savedUserEvent.created_at < userEvent.created_at) {
			userEvents.set(userEvent.pubkey, userEvent);
		}

		return userEvents;
	});
}
export function saveMetadataEvent(event: Event) {
	try {
		const user = JSON.parse(event.content) as User;
		console.debug('[metadata]', user);
		const userEvent: UserEvent = {
			...event,
			user
		};
		saveUserEvent(userEvent);
	} catch (error) {
		console.error('[invalid metadata]', event);
	}
}
