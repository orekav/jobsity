import { v4 } from "uuid";
import { User } from "./user";

export interface MessageProperties {
	text: string;
	submitter: User;
	timestamp?: number;
	uuid?: string;
}

export class Message {
	public text: string;
	public submitter: User;
	public timestamp: number;
	public uuid: string;

	constructor(props: MessageProperties) {
		this.text = props.text;
		this.submitter = props.submitter;
		this.timestamp = props.timestamp || Date.now();
		this.uuid = props.uuid || v4();
	}
}