import {Component} from 'angular2/angular2'
import {MessageSection} from './MessageSection'
import {ThreadSection} from './ThreadSection'
import {ChatWebAPIUtils} from '../utils/ChatWebAPIUtils'

@Component({
	selector: 'chat',
	template: `
		<div className="chatapp">
			<ThreadSection></ThreadSection>
			<MessageSection></MessageSection>
		</div>
	`,
	directives: [ThreadSection, MessageSection]
})
export class ChatApp {
	constructor(private chatWebAPIUtils: ChatWebAPIUtils) {}
}