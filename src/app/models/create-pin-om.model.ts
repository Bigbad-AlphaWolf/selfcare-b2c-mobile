export interface CreatePinOM {
	app_version?: string;
	channel?: string;
	code_otp?: string;
	conf_version?: string;
	confirm_pin: string;
	em: string;
	firebase_id?: string;
	hmac: string;
	is_primo?: string;
	msisdn: string;
	new_pin: string;
	os?: string;
	pin?: string;
	service_version?: string;
	type?: string;
	uuid?: string;
}
