export type AuthUser = {
	_id: string;
	name: string;
	email: string;
	isAdmin: boolean;
	token: string;
};

export type User = {
	_id: string;
	name: string;
	email: string;
	isAdmin: boolean;
};

export interface UserFull extends User {
	createdAt: string;
	updatedAt: string;
}
