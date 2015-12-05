import {Component, Input} from 'angular2/angular2'

@Component({
	selector: 'MessageListItem',
	template: `
		<li className="message-list-item">
        <h5 className="message-author-name">{{message.authorName}}</h5>
        <div className="message-time">
          {{message.date.toLocaleTimeString()}}
        </div>
        <div className="message-text">{{message.text}}</div>
      </li>
	`
})
export class MessageListItem {
	@Input() message 
}