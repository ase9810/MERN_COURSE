const expressJwt = require("express-jwt");

function authJwt() {
	const secret = process.env.secret;
	const api = process.env.API_URL;
	return (
		expressJwt({
			secret: secret,
			algorithms: ["HS256"],
			isRevoked: isRevoked,
		})
			// 인증 제외 항목(로그인, 회원가입)
			.unless({
				path: [
					{ url: /\/uploads(.*)/, methods: ["GET", "OPTIONS"] },
					{ url: /\/api\/v1\/products(.*)/, methods: ["GET", "OPTIONS"] },
					{ url: /\/api\/v1\/categories(.*)/, methods: ["GET", "OPTIONS"] },
					{ url: /\/api\/v1\/orders(.*)/, methods: ["GET", "OPTIONS", "POST"] },
					`${api}/users/login`,
					`${api}/users/register`,
				],
			})
	);
}

async function isRevoked(req, payload, done) {
	if (!payload.isAdmin) {
		done(null, true);
	}

	done();
}

module.exports = authJwt;
