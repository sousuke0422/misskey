<template>
<div class="account" v-hotkey.global="keymap">
	<button class="header" :data-active="isOpen" @click="toggle">
		<span class="username">{{ $store.state.i.username }}
			<fa :icon="xor(isOpen, navbar === 'bottom') ? 'angle-up' : 'angle-down'"/>
		</span>
		<mk-avatar class="avatar" :user="$store.state.i"/>
	</button>
	<transition :name="navbar === 'top' ? 'zoom-in-top' : 'zoom-in-bottom'">
		<div class="menu" :class="navbar" v-if="isOpen">
			<ul>
				<li @click="closeMenu">
					<router-link :to="`/@${ $store.state.i.username }`">
						<i><fa icon="user" fixed-width/></i>
						<span>{{ $t('profile') }}</span>
						<i><fa icon="angle-right"/></i>
					</router-link>
				</li>
				<li @click="drive">
					<p>
						<i><fa icon="cloud" fixed-width/></i>
						<span>{{ $t('@.drive') }}</span>
						<i><fa icon="angle-right"/></i>
					</p>
				</li>
				<li @click="closeMenu">
					<router-link to="/i/favorites">
						<i><fa icon="star" fixed-width/></i>
						<span>{{ $t('@.favorites') }}</span>
						<i><fa icon="angle-right"/></i>
					</router-link>
				</li>
				<li @click="closeMenu">
					<router-link to="/i/reactions">
						<i><fa :icon="faThumbsUp" fixed-width/></i>
						<span>{{ $t('@.noteReactions') }}</span>
						<i><fa icon="angle-right"/></i>
					</router-link>
				</li>
				<li @click="list">
					<p>
						<i><fa icon="list" fixed-width/></i>
						<span>{{ $t('lists') }}</span>
						<i><fa icon="angle-right"/></i>
					</p>
				</li>
				<li @click="closeMenu">
					<router-link to="/i/pages">
						<i><fa :icon="faStickyNote" fixed-width/></i>
						<span>{{ $t('@.pages') }}</span>
						<i><fa icon="angle-right"/></i>
					</router-link>
				</li>
				<li @click="followRequests">
					<p>
						<i><fa :icon="['far', 'envelope']" fixed-width/></i>
						<span>{{ $t('follow-requests') }}<i v-if="$store.state.i.pendingReceivedFollowRequestsCount">{{ $store.state.i.pendingReceivedFollowRequestsCount }}</i></span>
						<i><fa icon="angle-right"/></i>
					</p>
				</li>
				<li>
					<a :href="`/@${ $store.state.i.username }/room`">
						<i><fa :icon="faDoorOpen" fixed-width/></i>
						<span>{{ $t('room') }}</span>
						<i><fa icon="angle-right"/></i>
					</a>
				</li>
			</ul>
			<ul>
				<li>
					<router-link to="/i/settings">
						<i><fa icon="cog" fixed-width/></i>
						<span>{{ $t('@.settings') }}</span>
						<i><fa icon="angle-right"/></i>
					</router-link>
				</li>
				<li v-if="$store.state.i.isAdmin || $store.state.i.isModerator">
					<a href="/admin">
						<i><fa icon="terminal" fixed-width/></i>
						<span>{{ $t('admin') }}</span>
						<i><fa icon="angle-right"/></i>
					</a>
				</li>
			</ul>
			<ul>
				<li @click="toggleDeckMode">
					<p>
						<template v-if="$store.state.device.inDeckMode"><span>{{ $t('@.undeck') }}</span><i><fa :icon="faHome"/></i></template>
						<template v-else><span>{{ $t('@.deck') }}</span><i><fa :icon="faColumns"/></i></template>
					</p>
				</li>
				<li @click="toggleAppType">
					<p>
						<template v-if="$root.isMobile"><span>{{ $t('@.desktop-mode') }}</span><i><fa :icon="faDesktop"/></i></template>
						<template v-else><span>{{ $t('@.mobile-mode') }}</span><i><fa :icon="faMobileAlt" style="margin-right: 3px"/></i></template>
					</p>
				</li>
				<li @click="dark">
					<p>
						<span>{{ $store.state.device.darkmode ? $t('@.turn-off-darkmode') : $t('@.turn-on-darkmode') }}</span>
						<template><i><fa :icon="$store.state.device.darkmode ? faSun : faMoon"/></i></template>
					</p>
				</li>
			</ul>
			<ul>
				<li @click="signout">
					<p class="signout">
						<i><fa icon="power-off" fixed-width/></i>
						<span>{{ $t('@.signout') }}</span>
					</p>
				</li>
			</ul>
		</div>
	</transition>
</div>
</template>

<script lang="ts">
import Vue from 'vue';
import i18n from '../../../i18n';
import MkUserListsWindow from './user-lists-window.vue';
import MkFollowRequestsWindow from './received-follow-requests-window.vue';
import MkDriveWindow from './drive-window.vue';
import contains from '../../../common/scripts/contains';
import { faHome, faColumns, faUsers, faDoorOpen, faDesktop, faMobileAlt, faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { faMoon, faSun, faStickyNote } from '@fortawesome/free-regular-svg-icons';

export default Vue.extend({
	i18n: i18n('desktop/views/components/ui.header.account.vue'),
	data() {
		return {
			isOpen: false,
			faHome, faColumns, faMoon, faSun, faStickyNote, faUsers, faDoorOpen, faDesktop, faMobileAlt, faThumbsUp
		};
	},
	computed: {
		navbar(): string {
			return this.$store.state.device.navbar;
		},
		keymap(): any {
			return {
				'a|m': this.toggle
			};
		}
	},
	beforeDestroy() {
		this.close();
	},
	methods: {
		toggle() {
			this.isOpen ? this.close() : this.open();
		},
		open() {
			this.isOpen = true;
			for (const el of Array.from(document.querySelectorAll('body *'))) {
				el.addEventListener('mousedown', this.onMousedown);
			}
		},
		close() {
			this.isOpen = false;
			for (const el of Array.from(document.querySelectorAll('body *'))) {
				el.removeEventListener('mousedown', this.onMousedown);
			}
		},
		onMousedown(e) {
			e.preventDefault();
			if (!contains(this.$el, e.target) && this.$el != e.target) this.close();
			return false;
		},
		closeMenu() {
			this.close();
		},
		drive() {
			this.close();
			this.$root.new(MkDriveWindow);
		},
		list() {
			this.close();
			this.$root.new(MkUserListsWindow);
		},
		followRequests() {
			this.close();
			this.$root.new(MkFollowRequestsWindow);
		},
		signout() {
			this.$root.signout();
		},
		dark() {
			this.$store.commit('device/set', {
				key: 'darkmode',
				value: !this.$store.state.device.darkmode
			});
		},
		toggleAppType() {
			this.$store.commit('device/set', { key: 'appType', value: this.$root.isMobile ? 'desktop' : 'mobile' });
			location.replace('/');
		},
		toggleDeckMode() {
			this.$store.commit('device/set', { key: 'deckMode', value: !this.$store.state.device.inDeckMode });
			location.replace('/');
		},
		xor(a: boolean, b: boolean): boolean {
			return (a || b) && !(a && b);
		},
	}
});
</script>

<style lang="stylus" scoped>
.account
	> .header
		display block
		margin 0
		padding 0
		color var(--desktopHeaderFg)
		border none
		background transparent
		cursor pointer

		*
			pointer-events none

		&:hover
		&[data-active='true']
			color var(--desktopHeaderHoverFg)

			> .avatar
				filter saturate(150%)

		> .username
			display block
			float left
			margin 0 12px 0 16px
			max-width 16em
			line-height 48px
			font-weight bold
			text-decoration none

			@media (max-width 1100px)
				display none

			[data-icon]
				margin-left 8px

		> .avatar
			display block
			float left
			min-width 32px
			max-width 32px
			min-height 32px
			max-height 32px
			margin 8px 8px 8px 0
			border-radius 4px
			transition filter 100ms ease

			@media (max-width 1100px)
				margin-left 8px

	> .menu
		$bgcolor = var(--secondary)
		display block
		position absolute
		right -2px
		width 230px
		font-size 0.8em
		background $bgcolor
		border-radius 4px
		box-shadow 0 var(--lineWidth) 4px rgba(#000, 0.25)

		&.top
			top 56px

			&:before
				border-bottom solid 14px rgba(#000, 0.1)
				top -28px

			&:after
				border-bottom solid 14px $bgcolor
				top -27px

		&.bottom
			bottom 56px

			&:before
				border-top solid 14px rgba(#000, 0.1)
				bottom -27px


			&:after
				border-top solid 14px $bgcolor
				bottom -27px

		&:before
			content ""
			pointer-events none
			display block
			position absolute
			right 12px
			border-top solid 14px transparent
			border-right solid 14px transparent
			border-bottom solid 14px transparent
			border-left solid 14px transparent

		&:after
			content ""
			pointer-events none
			display block
			position absolute
			right 12px
			border-top solid 14px transparent
			border-right solid 14px transparent
			border-bottom solid 14px transparent
			border-left solid 14px transparent

		ul
			display block
			margin 10px 0
			padding 0
			list-style none

			& + ul
				padding-top 10px
				border-top solid var(--lineWidth) var(--faceDivider)

			> li
				display block
				margin 0
				padding 0

				> a
				> p
					display block
					z-index 1
					padding 0 28px
					margin 0
					line-height 40px
					color var(--text)
					cursor pointer

					*
						pointer-events none

					> span:first-child
						padding-left 22px

					> span:nth-child(2)
						> i
							margin-left 4px
							padding 2px 8px
							font-size 90%
							font-style normal
							background var(--primary)
							color var(--primaryForeground)
							border-radius 8px

					> i:first-child
						margin-right 6px
						width 16px

					> i:last-child
						display block
						position absolute
						top 0
						right 8px
						z-index 1
						padding 0 20px
						font-size 1.2em
						line-height 40px

					&:hover, &:active
						text-decoration none
						background var(--primary)
						color var(--primaryForeground)

					&:active
						background var(--primaryDarken10)

					&.signout
						$color = #e64137

						&:hover, &:active
							background $color
							color #fff

						&:active
							background darken($color, 10%)

.zoom-in-top-enter-active,
.zoom-in-top-leave-active {
	transform-origin: center -16px;
}

</style>
