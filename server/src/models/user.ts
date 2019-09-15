import { v4 } from "uuid";

interface UserProperties {
	name: string;
	uuid?: string;
}

export class User {
	public uuid: string;
	public name: string;

	constructor(props: UserProperties) {
		this.name = props.name;
		this.uuid = props.uuid || v4();
	}
}