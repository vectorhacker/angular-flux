import {Injectable} from 'angular2/angular2'
import {Dispatcher as ChatAppDispatcher} from '../dispatcher/ChatAppDispatcher'
import {ChatConstants} from '../constants/ChatConstants'
import {ChatWebAPIUtils} from '../utils/ChatWebAPIUtils'
import {ChatMessageUtils} from '../utils/ChatMessageUtils'

let ActionTypes = ChatConstants.ActionTypes;

@Injectable()
export class ChatMessageActionCreators {

	constructor(private chatAppDispatcher: ChatAppDispatcher,
		private chatWebAPIUtils: ChatWebAPIUtils) { }

	createMessage(text, currentThreadID) {
		this.chatAppDispatcher.dispatch({
			type: ActionTypes.CREATE_MESSAGE,
			text: text,
			currentThreadID: currentThreadID
		});
		var message = ChatMessageUtils.getCreatedMessageData(text, currentThreadID);
		this.chatWebAPIUtils.createMessage(message);
	}
}