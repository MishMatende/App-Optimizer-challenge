import { pgTable, unique, pgEnum, serial, text, boolean, uuid, timestamp, integer, json, pgSchema, index, varchar, foreignKey, bigserial, uniqueIndex, jsonb, smallint, inet, customType } from "drizzle-orm/pg-core"
  import { sql } from "drizzle-orm"


export const keyStatus = pgEnum("key_status", ['default', 'valid', 'invalid', 'expired'])
export const keyType = pgEnum("key_type", ['aead-ietf', 'aead-det', 'hmacsha512', 'hmacsha256', 'auth', 'shorthash', 'generichash', 'kdf', 'secretbox', 'secretstream', 'stream_xchacha20'])
export const factorType = pgEnum("factor_type", ['totp', 'webauthn'])
export const factorStatus = pgEnum("factor_status", ['unverified', 'verified'])
export const aalLevel = pgEnum("aal_level", ['aal1', 'aal2', 'aal3'])
export const codeChallengeMethod = pgEnum("code_challenge_method", ['s256', 'plain'])

export const auth = pgSchema("auth");

export const cmsUsers = pgTable("cms_users", {
	id: serial("id").primaryKey().notNull(),
	provider: text("Provider").notNull(),
	avatarUrl: text("avatar_url").notNull(),
	email: text("email").notNull(),
	emailVerified: boolean("email_verified"),
	fullName: text("full_name").notNull(),
	iss: text("iss").notNull(),
	name: text("name").notNull(),
	phone: text("phone"),
	phoneVerified: boolean("phone_verified"),
	picture: text("picture").notNull(),
	userUuid: uuid("user_uuid").notNull(),
	createdAt: timestamp("createdAt", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updatedAt", { mode: 'string' }).defaultNow(),
},
(table) => {
	return {
		cmsUsersUserUuidUnique: unique("cms_users_user_uuid_unique").on(table.userUuid),
	}
});

export const cmsClient = pgTable("cms_client", {
	id: serial("id").primaryKey().notNull(),
	userId: integer("userId").notNull(),
	twitterHandle: text("twitterHandle"),
	facebookHandle: text("facebookHandle"),
	instagramHandle: text("instagramHandle"),
	personalTwitter: text("personalTwitter"),
	personalFacebook: text("personalFacebook"),
	personalInstagram: text("personalInstagram"),
},
(table) => {
	return {
		cmsClientTwitterHandleUnique: unique("cms_client_twitterHandle_unique").on(table.twitterHandle),
		cmsClientFacebookHandleUnique: unique("cms_client_facebookHandle_unique").on(table.facebookHandle),
		cmsClientInstagramHandleUnique: unique("cms_client_instagramHandle_unique").on(table.instagramHandle),
		cmsClientPersonalTwitterUnique: unique("cms_client_personalTwitter_unique").on(table.personalTwitter),
		cmsClientPersonalFacebookUnique: unique("cms_client_personalFacebook_unique").on(table.personalFacebook),
		cmsClientPersonalInstagramUnique: unique("cms_client_personalInstagram_unique").on(table.personalInstagram),
	}
});

export const cmsPosts = pgTable("cms_posts", {
	id: serial("id").primaryKey().notNull(),
	title: text("title").notNull(),
	meta: json("meta"),
	createdAt: timestamp("createdAt", { mode: 'string' }).defaultNow(),
	body: text("body").notNull(),
	updatedAt: text("updatedAt"),
});

export const cmsBasiclog = pgTable("cms_basiclog", {
	id: serial("id").primaryKey().notNull(),
	query: json("query").notNull(),
	userId: integer("userId").notNull(),
	time: timestamp("time", { mode: 'string' }).defaultNow(),
	result: json("result").notNull(),
});

export const auditLogEntries = auth.table("audit_log_entries", {
	instanceId: uuid("instance_id"),
	id: uuid("id").primaryKey().notNull(),
	payload: json("payload"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }),
	ipAddress: varchar("ip_address", { length: 64 }).default("''::character varying").notNull(),
},
(table) => {
	return {
		auditLogsInstanceIdIdx: index("audit_logs_instance_id_idx").on(table.instanceId),
	}
});

export const schemaMigrations = auth.table("schema_migrations", {
	version: varchar("version", { length: 255 }).primaryKey().notNull(),
});

export const refreshTokens = auth.table("refresh_tokens", {
	instanceId: uuid("instance_id"),
	id: bigserial("id", { mode: "bigint" }).primaryKey().notNull(),
	token: varchar("token", { length: 255 }),
	userId: varchar("user_id", { length: 255 }),
	revoked: boolean("revoked"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
	parent: varchar("parent", { length: 255 }),
	sessionId: uuid("session_id").references(() => sessions.id, { onDelete: "cascade" } ),
},
(table) => {
	return {
		instanceIdIdx: index("refresh_tokens_instance_id_idx").on(table.instanceId),
		instanceIdUserIdIdx: index("refresh_tokens_instance_id_user_id_idx").on(table.instanceId, table.userId),
		parentIdx: index("refresh_tokens_parent_idx").on(table.parent),
		sessionIdRevokedIdx: index("refresh_tokens_session_id_revoked_idx").on(table.revoked, table.sessionId),
		updatedAtIdx: index("refresh_tokens_updated_at_idx").on(table.updatedAt),
		refreshTokensTokenUnique: unique("refresh_tokens_token_unique").on(table.token),
	}
});

export const instances = auth.table("instances", {
	id: uuid("id").primaryKey().notNull(),
	uuid: uuid("uuid"),
	rawBaseConfig: text("raw_base_config"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
});

export const users = auth.table("users", {
	instanceId: uuid("instance_id"),
	id: uuid("id").primaryKey().notNull(),
	aud: varchar("aud", { length: 255 }),
	role: varchar("role", { length: 255 }),
	email: varchar("email", { length: 255 }),
	encryptedPassword: varchar("encrypted_password", { length: 255 }),
	emailConfirmedAt: timestamp("email_confirmed_at", { withTimezone: true, mode: 'string' }),
	invitedAt: timestamp("invited_at", { withTimezone: true, mode: 'string' }),
	confirmationToken: varchar("confirmation_token", { length: 255 }),
	confirmationSentAt: timestamp("confirmation_sent_at", { withTimezone: true, mode: 'string' }),
	recoveryToken: varchar("recovery_token", { length: 255 }),
	recoverySentAt: timestamp("recovery_sent_at", { withTimezone: true, mode: 'string' }),
	emailChangeTokenNew: varchar("email_change_token_new", { length: 255 }),
	emailChange: varchar("email_change", { length: 255 }),
	emailChangeSentAt: timestamp("email_change_sent_at", { withTimezone: true, mode: 'string' }),
	lastSignInAt: timestamp("last_sign_in_at", { withTimezone: true, mode: 'string' }),
	rawAppMetaData: jsonb("raw_app_meta_data"),
	rawUserMetaData: jsonb("raw_user_meta_data"),
	isSuperAdmin: boolean("is_super_admin"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
	phone: text("phone").default("NULL::character varying"),
	phoneConfirmedAt: timestamp("phone_confirmed_at", { withTimezone: true, mode: 'string' }),
	phoneChange: text("phone_change").default("''::character varying"),
	phoneChangeToken: varchar("phone_change_token", { length: 255 }).default("''::character varying"),
	phoneChangeSentAt: timestamp("phone_change_sent_at", { withTimezone: true, mode: 'string' }),
	confirmedAt: timestamp("confirmed_at", { withTimezone: true, mode: 'string' }),
	emailChangeTokenCurrent: varchar("email_change_token_current", { length: 255 }).default("''::character varying"),
	emailChangeConfirmStatus: smallint("email_change_confirm_status").default(0),
	bannedUntil: timestamp("banned_until", { withTimezone: true, mode: 'string' }),
	reauthenticationToken: varchar("reauthentication_token", { length: 255 }).default("''::character varying"),
	reauthenticationSentAt: timestamp("reauthentication_sent_at", { withTimezone: true, mode: 'string' }),
	isSsoUser: boolean("is_sso_user").default(false).notNull(),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
},
(table) => {
	return {
		instanceIdIdx: index("users_instance_id_idx").on(table.instanceId),
		instanceIdEmailIdx: index("users_instance_id_email_idx").on(table.instanceId),
		confirmationTokenIdx: uniqueIndex("confirmation_token_idx").on(table.confirmationToken),
		recoveryTokenIdx: uniqueIndex("recovery_token_idx").on(table.recoveryToken),
		emailChangeTokenCurrentIdx: uniqueIndex("email_change_token_current_idx").on(table.emailChangeTokenCurrent),
		emailChangeTokenNewIdx: uniqueIndex("email_change_token_new_idx").on(table.emailChangeTokenNew),
		reauthenticationTokenIdx: uniqueIndex("reauthentication_token_idx").on(table.reauthenticationToken),
		emailPartialKey: uniqueIndex("users_email_partial_key").on(table.email),
		usersPhoneKey: unique("users_phone_key").on(table.phone),
	}
});

const customFactorType = customType<{ data: string }>({
	dataType() {
	  return 'auth.factor_type';
	},
  });

  const customFactorStatus = customType<{ data: string }>({
	dataType() {
	  return 'auth.factor_status';
	},
  });

export const mfaFactors = auth.table("mfa_factors", {
	id: uuid("id").primaryKey().notNull(),
	userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" } ),
	friendlyName: text("friendly_name"),
	// TODO: failed to parse database type 'auth.factor_type'
	// 
factorType: customFactorType("factor_type").notNull(),
	// TODO: failed to parse database type 'auth.factor_status'
	//
	status: customFactorStatus("status").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).notNull(),
	secret: text("secret"),
},
(table) => {
	return {
		userFriendlyNameUnique: uniqueIndex("mfa_factors_user_friendly_name_unique").on(table.userId, table.friendlyName),
		factorIdCreatedAtIdx: index("factor_id_created_at_idx").on(table.userId, table.createdAt),
		userIdIdx: index("mfa_factors_user_id_idx").on(table.userId),
	}
});

export const mfaChallenges = auth.table("mfa_challenges", {
	id: uuid("id").primaryKey().notNull(),
	factorId: uuid("factor_id").notNull().references(() => mfaFactors.id, { onDelete: "cascade" } ),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).notNull(),
	verifiedAt: timestamp("verified_at", { withTimezone: true, mode: 'string' }),
	ipAddress: inet("ip_address").notNull(),
},
(table) => {
	return {
		mfaChallengeCreatedAtIdx: index("mfa_challenge_created_at_idx").on(table.createdAt),
	}
});

export const mfaAmrClaims = auth.table("mfa_amr_claims", {
	sessionId: uuid("session_id").notNull().references(() => sessions.id, { onDelete: "cascade" } ),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).notNull(),
	authenticationMethod: text("authentication_method").notNull(),
	id: uuid("id").primaryKey().notNull(),
},
(table) => {
	return {
		mfaAmrClaimsSessionIdAuthenticationMethodPkey: unique("mfa_amr_claims_session_id_authentication_method_pkey").on(table.sessionId, table.authenticationMethod),
	}
});

export const ssoProviders = auth.table("sso_providers", {
	id: uuid("id").primaryKey().notNull(),
	resourceId: text("resource_id"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
});

export const ssoDomains = auth.table("sso_domains", {
	id: uuid("id").primaryKey().notNull(),
	ssoProviderId: uuid("sso_provider_id").notNull().references(() => ssoProviders.id, { onDelete: "cascade" } ),
	domain: text("domain").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
},
(table) => {
	return {
		ssoProviderIdIdx: index("sso_domains_sso_provider_id_idx").on(table.ssoProviderId),
	}
});

export const samlProviders = auth.table("saml_providers", {
	id: uuid("id").primaryKey().notNull(),
	ssoProviderId: uuid("sso_provider_id").notNull().references(() => ssoProviders.id, { onDelete: "cascade" } ),
	entityId: text("entity_id").notNull(),
	metadataXml: text("metadata_xml").notNull(),
	metadataUrl: text("metadata_url"),
	attributeMapping: jsonb("attribute_mapping"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
},
(table) => {
	return {
		ssoProviderIdIdx: index("saml_providers_sso_provider_id_idx").on(table.ssoProviderId),
		samlProvidersEntityIdKey: unique("saml_providers_entity_id_key").on(table.entityId),
	}
});

export const samlRelayStates = auth.table("saml_relay_states", {
	id: uuid("id").primaryKey().notNull(),
	ssoProviderId: uuid("sso_provider_id").notNull().references(() => ssoProviders.id, { onDelete: "cascade" } ),
	requestId: text("request_id").notNull(),
	forEmail: text("for_email"),
	redirectTo: text("redirect_to"),
	fromIpAddress: inet("from_ip_address"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
	flowStateId: uuid("flow_state_id").references(() => flowState.id, { onDelete: "cascade" } ),
},
(table) => {
	return {
		ssoProviderIdIdx: index("saml_relay_states_sso_provider_id_idx").on(table.ssoProviderId),
		forEmailIdx: index("saml_relay_states_for_email_idx").on(table.forEmail),
		createdAtIdx: index("saml_relay_states_created_at_idx").on(table.createdAt),
	}
});
const customCodeChallengeMethod = customType<{ data: string }>({
	dataType() {
	  return 'auth.code_challenge_method';
	},
  });
export const flowState = auth.table("flow_state", {
	id: uuid("id").primaryKey().notNull(),
	userId: uuid("user_id"),
	authCode: text("auth_code").notNull(),
	// TODO: failed to parse database type 'auth.code_challenge_method'
	
	codeChallengeMethod: customCodeChallengeMethod("code_challenge_method").notNull(),
	codeChallenge: text("code_challenge").notNull(),
	providerType: text("provider_type").notNull(),
	providerAccessToken: text("provider_access_token"),
	providerRefreshToken: text("provider_refresh_token"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
	authenticationMethod: text("authentication_method").notNull(),
},
(table) => {
	return {
		idxAuthCode: index("idx_auth_code").on(table.authCode),
		idxUserIdAuthMethod: index("idx_user_id_auth_method").on(table.userId, table.authenticationMethod),
		createdAtIdx: index("flow_state_created_at_idx").on(table.createdAt),
	}
});

const customAAL = customType<{ data: string }>({
	dataType() {
	  return 'auth.aal_level';
	},
  });

export const sessions = auth.table("sessions", {
	id: uuid("id").primaryKey().notNull(),
	userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" } ),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
	factorId: uuid("factor_id"),
	// TODO: failed to parse database type 'auth.aal_level'
	// 
	aal: customAAL("aal"),
	notAfter: timestamp("not_after", { withTimezone: true, mode: 'string' }),
	refreshedAt: timestamp("refreshed_at", { mode: 'string' }),
	userAgent: text("user_agent"),
	ip: inet("ip"),
	tag: text("tag"),
},
(table) => {
	return {
		userIdCreatedAtIdx: index("user_id_created_at_idx").on(table.userId, table.createdAt),
		userIdIdx: index("sessions_user_id_idx").on(table.userId),
		notAfterIdx: index("sessions_not_after_idx").on(table.notAfter),
	}
});

export const identities = auth.table("identities", {
	providerId: text("provider_id").notNull(),
	userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" } ),
	identityData: jsonb("identity_data").notNull(),
	provider: text("provider").notNull(),
	lastSignInAt: timestamp("last_sign_in_at", { withTimezone: true, mode: 'string' }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
	email: text("email"),
	id: uuid("id").defaultRandom().primaryKey().notNull(),
},
(table) => {
	return {
		userIdIdx: index("identities_user_id_idx").on(table.userId),
		emailIdx: index("identities_email_idx").on(table.email),
		identitiesProviderIdProviderUnique: unique("identities_provider_id_provider_unique").on(table.providerId, table.provider),
	}
});