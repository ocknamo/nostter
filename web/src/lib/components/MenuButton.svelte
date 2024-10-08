<script lang="ts">
	import { Divider, Menu } from '@svelteuidev/core';
	import { _ } from 'svelte-i18n';
	import { nip19 } from 'nostr-tools';
	import type { Event } from 'nostr-typedef';
	import { page } from '$app/stores';
	import { bookmark, unbookmark, isBookmarked } from '$lib/author/Bookmark';
	import { broadcast } from '$lib/Broadcast';
	import { copy } from '$lib/Clipboard';
	import { shareUrl } from '$lib/Share';
	import { rom, pubkey as authorPubkey } from '$lib/stores/Author';
	import { developerMode } from '$lib/stores/Preference';
	import IconDots from '@tabler/icons-svelte/icons/dots';
	import IconBookmark from '@tabler/icons-svelte/icons/bookmark';
	import IconBookmarkFilled from '@tabler/icons-svelte/icons/bookmark-filled';
	import IconClipboard from '@tabler/icons-svelte/icons/clipboard';
	import IconLink from '@tabler/icons-svelte/icons/link';
	import IconCodeDots from '@tabler/icons-svelte/icons/code-dots';
	import IconBroadcast from '@tabler/icons-svelte/icons/broadcast';
	import IconTrash from '@tabler/icons-svelte/icons/trash';
	import { deleteEvent } from '$lib/author/Delete';

	export let event: Event;
	export let iconSize: number;
	export let showDetails = false;

	$: bookmarked = isBookmarked(event);
	$: nevent = nip19.neventEncode({ id: event.id });
	$: url = `${$page.url.origin}/${nevent}`;

	async function onBookmark(note: Event) {
		console.log('[bookmark]', note, $rom);

		if (bookmarked) {
			console.debug('[bookmark already]');
			return;
		}

		bookmarked = true;

		try {
			await bookmark(['e', note.id]);
		} catch (error) {
			console.error('[bookmark failed]', error);
			bookmarked = false;
			alert($_('actions.bookmark.failed'));
		}
	}

	async function onUnbookmark(note: Event) {
		console.log('[unbookmark]', note, $rom);

		if (!confirm($_('actions.unbookmark.confirm'))) {
			return;
		}

		bookmarked = false;

		try {
			await unbookmark(['e', note.id]);
		} catch (error) {
			console.error('[remove bookmark failed]', error);
			bookmarked = true;
			alert($_('actions.unbookmark.failed'));
		}
	}

	async function onDelete(): Promise<void> {
		if (!confirm($_('actions.delete.confirm'))) {
			return;
		}

		console.log('[delete]', event);
		await deleteEvent([event]);
	}
</script>

<Menu placement="center">
	<svelte:fragment slot="control">
		<div class="icon">
			<IconDots size={iconSize} />
		</div>
	</svelte:fragment>

	{#if bookmarked}
		<Menu.Item
			icon={IconBookmarkFilled}
			color="var(--red)"
			disabled={$rom || event.kind === 42}
			on:click={() => onUnbookmark(event)}
		>
			{$_('actions.unbookmark.button')}
		</Menu.Item>
	{:else}
		<Menu.Item
			icon={IconBookmark}
			disabled={$rom || event.kind === 42}
			on:click={() => onBookmark(event)}
		>
			{$_('actions.bookmark.button')}
		</Menu.Item>
	{/if}

	<Menu.Item icon={IconClipboard} on:click={() => copy(nevent)}>
		{$_('actions.copy_id.button')}
	</Menu.Item>

	{#if navigator.canShare !== undefined}
		<Menu.Item
			icon={IconLink}
			on:click={async () => {
				if (!(await shareUrl(url))) {
					await copy(url);
				}
			}}
		>
			{$_('actions.share.button')}
		</Menu.Item>
	{:else}
		<Menu.Item icon={IconLink} on:click={() => copy(url)}>
			{$_('actions.copy_url.button')}
		</Menu.Item>
	{/if}

	{#if event.pubkey === $authorPubkey}
		<Divider />
		<Menu.Label>{$_('menu.caution')}</Menu.Label>
		<Menu.Item icon={IconTrash} on:click={onDelete}>
			{$_('actions.delete.button')}
		</Menu.Item>
	{/if}

	{#if $developerMode}
		<Divider />
		<Menu.Label>{$_('menu.developer')}</Menu.Label>
		<Menu.Item icon={IconCodeDots} on:click={() => (showDetails = !showDetails)}>
			{$_('actions.details.button')}
		</Menu.Item>
		<Menu.Item icon={IconBroadcast} on:click={() => broadcast(event)}>
			{$_('actions.broadcast.button')}
		</Menu.Item>
	{/if}
</Menu>

<style>
	.icon {
		color: var(--accent-gray);
	}
</style>
