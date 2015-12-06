import {Component, Input, CORE_DIRECTIVES, FORM_DIRECTIVES} from 'angular2/angular2'
import {ChatMessageActionCreators} from '../actions/ChatMessageActionCreators'

let ENTER_KEY_CODE = 13
// Illustrates two-way data binding and events
@Component({
	selector: 'MessageComposer',
	template: `
	<textarea
		class="message-composer"
		name="message"
		[(ng-model)]="text"
		(keydown)="_onKeyDown($event)"></textarea>
	`,
	directives: [CORE_DIRECTIVES, FORM_DIRECTIVES]  // FORM_DIRECTIVES is needed for two-way binding
})
export class MessageComposer {
	@Input('thread-id') threadId;

	text = ''; // Two-way data-binded property

	constructor(private chatMessageActionCreators: ChatMessageActionCreators) {

	}

	_onKeyDown($event: KeyboardEvent) {
		if ($event.keyCode === ENTER_KEY_CODE) {
			event.preventDefault();
			var text = this.text.trim();
			if (text) {
				this.chatMessageActionCreators.createMessage(text, this.threadId);
			}
			this.text = '';
		}
	}

}