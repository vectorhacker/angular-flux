import {Injectable} from 'angular2/angular2'


@Injectable()
export class Dispatcher {
	private callbacks: Array<Function> = [];
	private promises: Array<Promise<any>>

	register(cb: Function) {
		let index = this.callbacks.push(cb) - 1;
		return index;
	}

	dispatch(payload) {
		let resolves = [];
		let rejects = [];
		this.promises = this.callbacks.map(function(_, i) {
			return new Promise(function(resolve, reject) {
				resolves[i] = resolve;
				rejects[i] = reject;
			});
		});
		// Dispatch to callbacks and resolve/reject promises.
		this.callbacks.forEach(function(callback, i) {
			// Callback can return an obj, to resolve, or a promise, to chain.
			// See waitFor() for why this might be useful.
			Promise.resolve(callback(payload)).then(function() {
				resolves[i](payload);
			}, function() {
				rejects[i](new Error('Dispatcher callback unsuccessful'));
			});
		});
		this.promises = [];
	}

	waitFor(promiseIndexes, callback?) {
		let selectedPromises = promiseIndexes.map((index) => {
			return this.promises[index];
		});
		return Promise.all(selectedPromises).then(callback);
	}
}