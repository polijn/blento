import type { Component } from 'svelte';
import type { BaseCardProps } from './BaseCard/BaseCard.svelte';
import type { Item } from '$lib/types';
import type { BaseEditingCardProps } from './BaseCard/BaseEditingCard.svelte';

export type CardDefinition = {
	cardComponent: Component<BaseCardProps>;
	editingCardComponent: Component<BaseEditingCardProps>;
	createNew?: (item: Item) => void;
};
