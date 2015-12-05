
import {Injectable} from 'angular2/angular2'

import {ChatServerActionCreators} from '../actions/ChatServerActionCreators'

// This is an injectable service (I.E. A singleton).
@Injectable()
export class ChatWebAPIUtils extends Firebase { // Extend the firebase class
	private messages; // Firebase ref to messages list
	// Inject ChatServerActionCreators service
	constructor(private chatServerActionCreators: ChatServerActionCreators) {
		super("https://flux-angular-chat.firebaseio.com/"); // Connect to Firebase API
		this.messages = this.child('messages');
		
		// setup events
		this.setupEvents()
	}

    // Trigger RECIEVE_MESSAGE event to the dispatcher
	recieveMessage(snapshot, prevChildKey) {
		this.chatServerActionCreators
			.receiveMessage(snapshot.val())
	}

	setupEvents() {
		// Get all previous messages.
		this.messages.limitToLast(100)
			.once('value', (snap) => {
				let messages = []

				snap.forEach(message => messages.push(message.val()))

				this.chatServerActionCreators.reciveAllMessage(messages);
			})
			
		// Listen to new incomming messages, then trigger 
		// a RECIEVE_MESSAGE event to the dispatcher.
		this.messages
			.on('child_added', this.recieveMessage.bind(this));
	}
	
	// Adds a new message to the list
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