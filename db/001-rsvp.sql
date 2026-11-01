-- Apply once to an empty database. Preserve legacy timestamps and payloads as text.
CREATE TABLE rsvp_control (id integer PRIMARY KEY CHECK (id = 1), enabled boolean NOT NULL DEFAULT false);
INSERT INTO rsvp_control (id) VALUES (1);
CREATE TABLE invitations (
 invitation_id text PRIMARY KEY, group_label text NOT NULL,
 invitation_type text NOT NULL CHECK (invitation_type IN ('individual','couple','family')),
 reserved_seats integer NOT NULL CHECK (reserved_seats BETWEEN 1 AND 100),
 code_digest text UNIQUE NOT NULL CHECK (code_digest ~ '^[a-f0-9]{64}$'),
 code_version integer NOT NULL CHECK (code_version > 0),
 active boolean NOT NULL, updates_allowed boolean NOT NULL,
 created_at text NOT NULL, updated_at text NOT NULL
);
CREATE TABLE guest_names (
 name_id text PRIMARY KEY, invitation_id text NOT NULL REFERENCES invitations,
 display_name text NOT NULL, normalized_name text NOT NULL, lookup_enabled boolean NOT NULL
);
CREATE INDEX guest_names_lookup ON guest_names(normalized_name) WHERE lookup_enabled;
CREATE TABLE responses (
 invitation_id text PRIMARY KEY REFERENCES invitations,
 attendance text NOT NULL CHECK (attendance IN ('accepted','declined')),
 attending_count integer NOT NULL CHECK (attending_count BETWEEN 0 AND 100),
 response_json text NOT NULL CHECK (jsonb_typeof(response_json::jsonb) = 'object'),
 revision integer NOT NULL CHECK (revision > 0),
 last_request_id text NOT NULL, last_payload_digest text NOT NULL,
 submitted_at text NOT NULL, updated_at text NOT NULL
);
CREATE TABLE security_state (key text PRIMARY KEY, value_json jsonb NOT NULL, expires_at bigint NOT NULL);
CREATE INDEX security_state_expiry ON security_state(expires_at);
