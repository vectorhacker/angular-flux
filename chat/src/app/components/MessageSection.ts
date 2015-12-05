import {Component, CORE_DIRECTIVES} from 'angular2/angular2';

import {ThreadStore} from '../stores/ThreadStore'
import {MessageStore} from '../stores/MessageStore'
import {MessageListItem} from './MessageListItem'
import {MessageComposer} from './MessageComposer'

@Component({
	selector: 'MessageSection',
	template: `
	<div class="message-section">
        <h3 class="message-thread-heading">{{thread.name}}</h3>
        <ul class="message-list" ref="messageList">
          <MessageListItem *ng-for="#message of messages"
			[message]="message" ></MessageListItem>
        </ul>
        <MessageComposer [thread-id]="thread.id"/>
      </div>
	`,
	directives: [CORE_DIRECTIVES, MessageListItem, MessageComposer]
})
export class MessageSection {
	messages = [];
	thread = {}
	constructor(private threadStore: ThreadStore, private messageStore: MessageStore) {
		this.setState(this.getStateFromStores());
		this.threadStore.addChangeListener(this._onChange.bind(this))
		this.messageStore.addChangeListener(this._onChange.bind(this))
	}

	ngOnDestroy() {
		this.messageStore.removeChangeListener(this._onChange.bind(this));
		this.threadStore.removeChangeListener(this._onChange.bind(this));
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

	private _onChange() {
		this.setState(this.getStateFromStores());
	}
}