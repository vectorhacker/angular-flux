
import {Injectable} from 'angular2/angular2'

import {ChatServerActionCreators} from '../actions/ChatServerActionCreators'

@Injectable()
export class ChatWebAPIUtils extends Firebase {
	messages;
	constructor(private chatServerActionCreators: ChatServerActionCreators) {
		super("https://flux-angular-chat.firebaseio.com/");
		this.messages = this.child('messages');
		
		// setup events
		this.setupEvents()
	}

	recieveMessage(snapshot, prevChildKey) {
		this.chatServerActionCreators
			.receiveMessage(snapshot.val())
	}

	setupEvents() {
		this.messages.limitToLast(100)
			.once('value', (snap) => {
				let messages = []
				
				snap.forEach(message => messages.push(message.val()))
				
				this.chatServerActionCreators.reciveAllMessage(messages);
			})
		this.messages
			.on('child_added', this.recieveMessage.bind(this));
	}

	createMessage(message) {

		var timestamp = Date.now();
		var id = 'm_' + timestamp;
		var threadID = message.threadID || ('t_' + Date.now());
		var createdMessage = {
			id: id,
			threadID: threadID,
			authorName: message.authorName,
			text: message.text,
			timestamp: timestamp
		};
		this.messages.push().set(createdMessage);
	}
}