import {Component, CORE_DIRECTIVES} from 'angular2/angular2';

import {ThreadStore} from '../stores/ThreadStore'
import {MessageStore} from '../stores/MessageStore'
import {MessageListItem} from './MessageListItem'
import {MessageComposer} from './MessageComposer'

// Illustrates use of data binding to input attributes
// Illustrates use of ng-for directive API
@Component({
	selector: 'MessageSection',
	template: `
	<div class="message-section">
		<h3 class="message-thread-heading">{{thread.name}}</h3>
		<ul class="message-list" ref="messageList">
			<MessageListItem *ng-for="#message of messages"
				[message]="message" ></MessageListItem>
		</ul>
		<MessageComposer [thread-id]="thread.id"></MessageComposer>
	</div>
	`,
	directives: [CORE_DIRECTIVES, MessageListItem, MessageComposer] // Include CORE_DIRECTIVES and custom components for use in template
})
export class MessageSection {
	messages = [];
	thread = {}
	
	// Inject needed models
	constructor(private threadStore: ThreadStore, private messageStore: MessageStore) {
		this.setState(this.getStateFromStores());
		// Start listening for changes on models
		this.threadStore.subscribe(this._onChange.bind(this))
		this.messageStore.subscribe(this._onChange.bind(this))
	}

	ngOnDestroy() {
		this.messageStore.unsubscribe();
		this.threadStore.unsubscribe();
	}

	getStateFromStores() {
		return {
			messages: this.messageStore.getAllForCurrentThread(),
			thread: this.threadStore.getCurrent() || {}
		}
	}
	
	private setState(state) {
		this.messages = state.messages;
		this.thread = state.thread;
	}

	// Listen for changes on models and update properties 
	private _onChange() {
		this.setState(this.getStateFromStores());
	}
}